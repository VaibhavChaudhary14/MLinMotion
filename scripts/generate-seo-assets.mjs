import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Minimal CRC32 implementation for PNG chunks
const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC_TABLE[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcBuf = Buffer.alloc(4);
  const typeAndData = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(typeAndData), 0);

  return Buffer.concat([lenBuf, typeAndData, crcBuf]);
}

function createPng(width, height, getPixelRgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // 8 bits per channel
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10); // deflate
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // no interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Raw Scanlines: each row starts with filter 0 (None)
  const rowStride = width * 4;
  const rawData = Buffer.alloc(height * (1 + rowStride));

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData.writeUInt8(0, offset++); // filter type None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixelRgba(x, y);
      rawData.writeUInt8(r, offset++);
      rawData.writeUInt8(g, offset++);
      rawData.writeUInt8(b, offset++);
      rawData.writeUInt8(a, offset++);
    }
  }

  const compressed = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

// 1. Generate 32x32 Favicon PNG & ICO
console.log('Generating 32x32 Favicon PNG & ICO...');
const faviconPng = createPng(32, 32, (x, y) => {
  // Border margin (1px)
  const isOuter = x < 1 || x >= 31 || y < 1 || y >= 31;
  if (isOuter) return [26, 23, 21, 255]; // #1A1715

  // Top-Right Vermilion Square: x in [19, 27], y in [4, 12]
  if (x >= 19 && x <= 27 && y >= 4 && y <= 12) {
    return [200, 50, 38, 255]; // #C83226
  }

  // Bottom-Left Ultramarine Circle: center (10, 22), radius 3.5
  const distBl = Math.sqrt((x - 10) ** 2 + (y - 22) ** 2);
  if (distBl <= 3.5) {
    return [24, 72, 184, 255]; // #1848B8
  }

  // Reticle crosshair (x === 16 or y === 16)
  if (x === 16 || y === 16) {
    return [250, 247, 240, 230]; // #FAF7F0
  }

  // Base Dark Bakelite (#1A1715)
  return [26, 23, 21, 255];
});

// Create ICO Header wrapping the PNG
const icoHeader = Buffer.alloc(6);
icoHeader.writeUInt16LE(0, 0); // reserved
icoHeader.writeUInt16LE(1, 2); // icon type 1
icoHeader.writeUInt16LE(1, 4); // 1 image

const icoDir = Buffer.alloc(16);
icoDir.writeUInt8(32, 0); // width
icoDir.writeUInt8(32, 1); // height
icoDir.writeUInt8(0, 2); // palette
icoDir.writeUInt8(0, 3); // reserved
icoDir.writeUInt16LE(1, 4); // color planes
icoDir.writeUInt16LE(32, 6); // bpp
icoDir.writeUInt32LE(faviconPng.length, 8); // size of image data
icoDir.writeUInt32LE(22, 12); // offset = 6 + 16 = 22

const icoBuffer = Buffer.concat([icoHeader, icoDir, faviconPng]);
fs.writeFileSync(path.resolve('public/favicon.ico'), icoBuffer);
console.log('Saved public/favicon.ico');

// 2. Generate 180x180 Apple Touch Icon PNG
console.log('Generating 180x180 Apple Touch Icon PNG...');
const appleIconPng = createPng(180, 180, (x, y) => {
  // Rounded corner mask
  const cornerR = 24;
  const isTopLeft = x < cornerR && y < cornerR && Math.hypot(x - cornerR, y - cornerR) > cornerR;
  const isTopRight = x > 180 - cornerR && y < cornerR && Math.hypot(x - (180 - cornerR), y - cornerR) > cornerR;
  const isBottomLeft = x < cornerR && y > 180 - cornerR && Math.hypot(x - cornerR, y - (180 - cornerR)) > cornerR;
  const isBottomRight = x > 180 - cornerR && y > 180 - cornerR && Math.hypot(x - (180 - cornerR), y - (180 - cornerR)) > cornerR;
  if (isTopLeft || isTopRight || isBottomLeft || isBottomRight) {
    return [0, 0, 0, 0]; // transparent
  }

  // Border margin (3px)
  if (x < 4 || x >= 176 || y < 4 || y >= 176) {
    return [26, 23, 21, 255];
  }

  // Top-Right Vermilion Square: x in [110, 155], y in [25, 70]
  if (x >= 110 && x <= 155 && y >= 25 && y <= 70) {
    return [200, 50, 38, 255]; // #C83226
  }

  // Bottom-Left Ultramarine Circle: center (55, 125), radius 22
  const distBl = Math.hypot(x - 55, y - 125);
  if (distBl <= 22) {
    return [24, 72, 184, 255]; // #1848B8
  }

  // Reticle crosshair (x in [88, 92] or y in [88, 92])
  if (Math.abs(x - 90) <= 2 || Math.abs(y - 90) <= 2) {
    return [250, 247, 240, 230]; // #FAF7F0
  }

  // Concentric dashed reticle ring: radius 50
  const ringDist = Math.abs(Math.hypot(x - 90, y - 90) - 50);
  if (ringDist <= 1.5) {
    const angle = Math.atan2(y - 90, x - 90);
    if (Math.sin(angle * 8) > 0) {
      return [250, 247, 240, 140];
    }
  }

  return [26, 23, 21, 255]; // #1A1715
});
fs.writeFileSync(path.resolve('public/apple-touch-icon.png'), appleIconPng);
console.log('Saved public/apple-touch-icon.png');

// 3. Generate 1200x630 High-Resolution OG Image PNG (Analog Bauhaus)
console.log('Generating 1200x630 OG Share Card Image PNG...');
const ogPng = createPng(1200, 630, (x, y) => {
  // Outer Border 4px: #1A1715
  if (x < 6 || x >= 1194 || y < 6 || y >= 624) {
    return [26, 23, 21, 255];
  }

  // Top Bar (y in [6, 85]): Header Strip with #FAF7F0 background
  if (y <= 85) {
    if (y >= 83) return [26, 23, 21, 255]; // Divider line
    // Reticle Icon Box in Header: x in [40, 84], y in [24, 68]
    if (x >= 40 && x <= 84 && y >= 24 && y <= 68) {
      if (x >= 68 && x <= 80 && y >= 28 && y <= 40) return [200, 50, 38, 255]; // Vermilion block
      if (x === 62 || y === 46) return [250, 247, 240, 240]; // White crosshair
      return [26, 23, 21, 255];
    }
    // Top right badge: x in [950, 1160], y in [25, 65]
    if (x >= 950 && x <= 1160 && y >= 25 && y <= 65) {
      if (x <= 952 || x >= 1158 || y <= 27 || y >= 63) return [26, 23, 21, 255];
      if (x >= 962 && x <= 972 && y >= 40 && y <= 50) return [200, 50, 38, 255]; // Vermilion dot
      return [250, 247, 240, 255];
    }
    return [250, 247, 240, 255]; // #FAF7F0
  }

  // Bottom Bar (y in [545, 624]): Footer Strip with #FAF7F0 background
  if (y >= 545) {
    if (y <= 547) return [26, 23, 21, 255]; // Divider line
    // Palette dots on bottom right:
    // Dot 1: Ultramarine at x=980, y=585
    if (Math.hypot(x - 980, y - 585) <= 7) return [24, 72, 184, 255];
    // Dot 2: Vermilion at x=1005, y=585
    if (Math.hypot(x - 1005, y - 585) <= 7) return [200, 50, 38, 255];
    // Dot 3: Amber at x=1030, y=585
    if (Math.hypot(x - 1030, y - 585) <= 7) return [226, 140, 5, 255];
    // Dot 4: Sage at x=1055, y=585
    if (Math.hypot(x - 1055, y - 585) <= 7) return [51, 99, 75, 255];

    // Feature chips on bottom left:
    // Chip 1: x in [40, 180], y in [565, 605]
    // Chip 2: x in [195, 360], y in [565, 605]
    // Chip 3: x in [375, 540], y in [565, 605]
    // Chip 4: x in [555, 750], y in [565, 605]
    const inChip1 = x >= 40 && x <= 180 && y >= 565 && y <= 605;
    const inChip2 = x >= 195 && x <= 360 && y >= 565 && y <= 605;
    const inChip3 = x >= 375 && x <= 540 && y >= 565 && y <= 605;
    const inChip4 = x >= 555 && x <= 750 && y >= 565 && y <= 605;

    if (inChip1 || inChip2 || inChip3 || inChip4) {
      const isBorder = (
        (x === 40 || x === 180 || x === 195 || x === 360 || x === 375 || x === 540 || x === 555 || x === 750) ||
        (y === 565 || y === 605)
      );
      if (isBorder) return [26, 23, 21, 255];
      return [232, 225, 211, 255]; // #E8E1D3
    }

    return [250, 247, 240, 255];
  }

  // Middle Body: Subtle coordinate grid pattern on warm stone substrate (#F4EFE4)
  const isGridX = x % 40 === 0;
  const isGridY = y % 40 === 0;
  if ((isGridX || isGridY) && Math.random() > 0.3) {
    return [232, 225, 211, 255]; // Grid tick #E8E1D3
  }

  // Decorative Voronoi/geometric lines in background right side
  // Slanted line 1
  if (Math.abs(y - 0.4 * x - 100) <= 1.2 && x >= 700) {
    return [216, 207, 192, 180]; // #D8CFC0
  }
  // Slanted line 2
  if (Math.abs(y + 0.6 * x - 850) <= 1.2 && x >= 750) {
    return [216, 207, 192, 180];
  }

  return [244, 239, 228, 255]; // #F4EFE4
});
fs.writeFileSync(path.resolve('public/og-image.png'), ogPng);
console.log('Saved public/og-image.png');

console.log('All SEO image assets generated successfully.');
