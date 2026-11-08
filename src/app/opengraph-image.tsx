import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'ML in Motion — Stop Memorizing Algorithms. Start Seeing How They Work.';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#F4EFE4',
          padding: '48px',
          fontFamily: 'monospace',
          border: '4px solid #1A1715',
        }}
      >
        {/* Top Header Plate */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid #1A1715',
            paddingBottom: '24px',
          }}
        >
          {/* Logo & Mark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                backgroundColor: '#1A1715',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                border: '2px solid #1A1715',
              }}
            >
              {/* Crosshair horizontal */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '2px',
                  backgroundColor: '#FAF7F0',
                  opacity: 0.8,
                }}
              />
              {/* Crosshair vertical */}
              <div
                style={{
                  position: 'absolute',
                  height: '100%',
                  width: '2px',
                  backgroundColor: '#FAF7F0',
                  opacity: 0.8,
                }}
              />
              {/* Vermilion sensor */}
              <div
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#C83226',
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '28px',
                  fontWeight: 900,
                  color: '#1A1715',
                  letterSpacing: '-0.5px',
                }}
              >
                ML IN MOTION
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#5C544B',
                  letterSpacing: '2px',
                }}
              >
                FIRST PRINCIPLES • INTERACTIVE LABORATORY
              </span>
            </div>
          </div>

          {/* Eyebrow Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: '#FAF7F0',
              border: '2px solid #1A1715',
              boxShadow: '2px 2px 0px #1A1715',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: '#C83226',
              }}
            />
            <span
              style={{
                fontSize: '13px',
                fontWeight: 800,
                color: '#1A1715',
                letterSpacing: '1px',
              }}
            >
              ANALOG BAUHAUS SYSTEM
            </span>
          </div>
        </div>

        {/* Center Main Message */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: 'auto 0' }}>
          <div
            style={{
              fontSize: '56px',
              fontWeight: 900,
              color: '#1A1715',
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
            }}
          >
            Stop memorizing algorithms.
          </div>
          <div
            style={{
              fontSize: '56px',
              fontWeight: 900,
              color: '#1848B8',
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
            }}
          >
            Start seeing how they work.
          </div>
          <div
            style={{
              fontSize: '20px',
              color: '#5C544B',
              lineHeight: 1.4,
              maxWidth: '960px',
              marginTop: '8px',
            }}
          >
            Step through real iterations, manipulate hyperparameter levers, and inspect mathematical derivations line-by-line with zero black boxes.
          </div>
        </div>

        {/* Bottom Feature Badges & URL Plate */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '2px solid #1A1715',
            paddingTop: '20px',
          }}
        >
          {/* Feature Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {['12 STAGES', '14 CONCEPT CARDS', 'ALGORITHM CINEMA', 'COMPARISON STUDIO'].map((badge) => (
              <div
                key={badge}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#FAF7F0',
                  border: '1.5px solid #1A1715',
                  fontSize: '12px',
                  fontWeight: 800,
                  color: '#1A1715',
                  letterSpacing: '0.5px',
                }}
              >
                {badge}
              </div>
            ))}
          </div>

          {/* Palette Dots & URL */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#1848B8' }} />
              <div style={{ width: '10px', height: '10px', backgroundColor: '#C83226', transform: 'rotate(45deg)' }} />
              <div style={{ width: '10px', height: '10px', backgroundColor: '#E28C05' }} />
              <div style={{ width: '10px', height: '10px', backgroundColor: '#33634B' }} />
            </div>
            <span
              style={{
                fontSize: '15px',
                fontWeight: 900,
                color: '#1A1715',
                letterSpacing: '1px',
              }}
            >
              mlinmotion.vercel.app
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
