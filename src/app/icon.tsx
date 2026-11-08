import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1A1715',
          position: 'relative',
          borderRadius: '4px',
        }}
      >
        {/* Reticle horizontal line */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '1.5px',
            backgroundColor: '#FAF7F0',
            opacity: 0.85,
          }}
        />
        {/* Reticle vertical line */}
        <div
          style={{
            position: 'absolute',
            height: '100%',
            width: '1.5px',
            backgroundColor: '#FAF7F0',
            opacity: 0.85,
          }}
        />
        {/* Active Vermilion sensor square in top-right */}
        <div
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '9px',
            height: '9px',
            backgroundColor: '#C83226',
            borderRadius: '1px',
          }}
        />
        {/* Ultramarine anchor dot in bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: '4px',
            left: '4px',
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: '#1848B8',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
