export default function Slide05FourChecks() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{
        backgroundColor: '#FAFBFC',
        fontFamily: "'Inter', sans-serif",
        padding: '3vh 4vw',
        boxSizing: 'border-box',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        gap: '2vh',
        color: '#1E3A5F',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '2vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
          <div style={{ width: '1.8vw', height: '1.8vw', backgroundColor: '#0D9488', borderRadius: '0.3vw' }} />
          <span style={{ fontSize: '1.2vw', fontWeight: 700, letterSpacing: '0.02em', color: '#1E3A5F' }}>PhotonLint</span>
        </div>
        <div style={{ fontSize: '1vw', fontWeight: 600, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>DRC Engine&nbsp;&nbsp;·&nbsp;&nbsp;2026</div>
      </div>

      {/* Main */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5vh' }}>
        <div>
          <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#0D9488', marginBottom: '0.8vh', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Design Rule Checks</div>
          <h2 style={{ fontSize: '2.8vw', fontWeight: 800, color: '#1E3A5F', margin: 0, lineHeight: 1.15, textWrap: 'balance' } as React.CSSProperties}>
            Four checks that catch the errors that matter most
          </h2>
        </div>

        {/* 2x2 grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '2vw', flex: 1 }}>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0.8vw', border: '1px solid #E2E8F0', padding: '2.5vh 2vw', boxShadow: '0 2px 12px rgba(30,58,95,0.06)', display: 'flex', flexDirection: 'column', gap: '1vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1vw' }}>
              <div style={{ backgroundColor: 'rgba(13,148,136,0.1)', width: '3vw', height: '3vw', borderRadius: '0.5vw', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ width: '1.5vw', height: '1.5vw', border: '0.3vw solid #0D9488', borderRadius: '0.15vw' }} />
              </div>
              <div style={{ fontSize: '1.6vw', fontWeight: 700, color: '#1E3A5F' }}>Grid Snap</div>
            </div>
            <p style={{ fontSize: '1.9vw', color: '#475569', margin: 0, lineHeight: 1.45, fontWeight: 400 }}>Vertices not aligned to the 1 nm manufacturing grid cause lithography errors</p>
            <div style={{ marginTop: 'auto' }}>
              <span style={{ fontSize: '1.2vw', fontWeight: 600, color: '#F59E0B', backgroundColor: 'rgba(245,158,11,0.1)', padding: '0.3vh 0.8vw', borderRadius: '1vw' }}>WARNING</span>
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0.8vw', border: '1px solid #E2E8F0', padding: '2.5vh 2vw', boxShadow: '0 2px 12px rgba(30,58,95,0.06)', display: 'flex', flexDirection: 'column', gap: '1vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1vw' }}>
              <div style={{ backgroundColor: 'rgba(13,148,136,0.1)', width: '3vw', height: '3vw', borderRadius: '0.5vw', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ width: '0.5vw', height: '2vw', backgroundColor: '#0D9488', borderRadius: '0.1vw' }} />
              </div>
              <div style={{ fontSize: '1.6vw', fontWeight: 700, color: '#1E3A5F' }}>Minimum Feature Width</div>
            </div>
            <p style={{ fontSize: '1.9vw', color: '#475569', margin: 0, lineHeight: 1.45, fontWeight: 400 }}>True minor-axis measurement via rotated rectangle — handles angled waveguides correctly</p>
            <div style={{ marginTop: 'auto' }}>
              <span style={{ fontSize: '1.2vw', fontWeight: 600, color: '#EF4444', backgroundColor: 'rgba(239,68,68,0.08)', padding: '0.3vh 0.8vw', borderRadius: '1vw' }}>CRITICAL</span>
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0.8vw', border: '1px solid #E2E8F0', padding: '2.5vh 2vw', boxShadow: '0 2px 12px rgba(30,58,95,0.06)', display: 'flex', flexDirection: 'column', gap: '1vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1vw' }}>
              <div style={{ backgroundColor: 'rgba(13,148,136,0.1)', width: '3vw', height: '3vw', borderRadius: '0.5vw', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ width: '2vw', height: '0.3vw', backgroundColor: '#0D9488' }} />
              </div>
              <div style={{ fontSize: '1.6vw', fontWeight: 700, color: '#1E3A5F' }}>Minimum Spacing</div>
            </div>
            <p style={{ fontSize: '1.9vw', color: '#475569', margin: 0, lineHeight: 1.45, fontWeight: 400 }}>Exact polygon-to-polygon distance via shapely — waveguides too close cause optical crosstalk</p>
            <div style={{ marginTop: 'auto' }}>
              <span style={{ fontSize: '1.2vw', fontWeight: 600, color: '#EF4444', backgroundColor: 'rgba(239,68,68,0.08)', padding: '0.3vh 0.8vw', borderRadius: '1vw' }}>CRITICAL</span>
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0.8vw', border: '1px solid #E2E8F0', padding: '2.5vh 2vw', boxShadow: '0 2px 12px rgba(30,58,95,0.06)', display: 'flex', flexDirection: 'column', gap: '1vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1vw' }}>
              <div style={{ backgroundColor: 'rgba(13,148,136,0.1)', width: '3vw', height: '3vw', borderRadius: '0.5vw', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ width: '2vw', height: '2vw', border: '0.3vw solid #0D9488', borderRadius: '50%', borderRightColor: 'transparent' }} />
              </div>
              <div style={{ fontSize: '1.6vw', fontWeight: 700, color: '#1E3A5F' }}>Minimum Bend Radius</div>
            </div>
            <p style={{ fontSize: '1.9vw', color: '#475569', margin: 0, lineHeight: 1.45, fontWeight: 400 }}>Heuristic sharp-turn detector — light scatters out of too-tight waveguide bends</p>
            <div style={{ marginTop: 'auto' }}>
              <span style={{ fontSize: '1.2vw', fontWeight: 600, color: '#F59E0B', backgroundColor: 'rgba(245,158,11,0.1)', padding: '0.3vh 0.8vw', borderRadius: '1vw' }}>WARNING</span>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <div style={{ fontSize: '1.5vw', color: '#64748B', fontWeight: 400 }}>
          Results sorted CRITICAL first — every violation shows location, measurement, and fix guidance
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '1.5vh', fontSize: '1vw', color: '#94A3B8', fontWeight: 500 }}>
        <span>PhotonLint, Inc.</span>
        <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'center' }}>
          <span>Confidential &amp; Proprietary</span>
          <span>·</span>
          <span>Slide 5 of 10</span>
        </div>
      </div>
    </div>
  );
}
