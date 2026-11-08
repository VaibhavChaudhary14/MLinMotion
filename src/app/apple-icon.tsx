import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
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
          padding: '20px',
        }}
      >
        {/* Reticle horizontal line */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '6px',
            backgroundColor: '#FAF7F0',
            opacity: 0.85,
          }}
        />
        {/* Reticle vertical line */}
        <div
          style={{
            position: 'absolute',
            height: '100%',
            width: '6px',
            backgroundColor: '#FAF7F0',
            opacity: 0.85,
          }}
        />
        {/* Concentric reticle ring */}
        <div
          style={{
            position: 'absolute',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: '4px dashed #FAF7F0',
            opacity: 0.4,
          }}
        />
        {/* Active Vermilion sensor square in top-right */}
        <div
          style={{
            position: 'absolute',
            top: '26px',
            right: '26px',
            width: '44px',
            height: '44px',
            backgroundColor: '#C83226',
            borderRadius: '6px',
          }}
        />
        {/* Ultramarine anchor dot in bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: '26px',
            left: '26px',
            width: '36px',
            height: '36px',
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
