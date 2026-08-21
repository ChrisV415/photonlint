export default function Slide09KnownLimits() {
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
        <div style={{ fontSize: '1vw', fontWeight: 600, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Current Limits&nbsp;&nbsp;·&nbsp;&nbsp;2026</div>
      </div>

      {/* Main */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5vh' }}>
        <div>
          <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#64748B', marginBottom: '0.8vh', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Scoped engineering work, not fundamental blockers</div>
          <h2 style={{ fontSize: '2.6vw', fontWeight: 800, color: '#1E3A5F', margin: 0, lineHeight: 1.15 }}>
            Known limits and the path to production scale
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2vw' }}>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0.8vw', border: '1px solid #E2E8F0', padding: '2.2vh 2.2vw', boxShadow: '0 2px 12px rgba(30,58,95,0.06)', display: 'flex', gap: '1.5vw', alignItems: 'flex-start' }}>
            <div style={{ backgroundColor: 'rgba(245,158,11,0.1)', width: '3vw', height: '3vw', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '1.4vw', fontWeight: 800, color: '#F59E0B' }}>1</span>
            </div>
            <div>
              <div style={{ fontSize: '1.5vw', fontWeight: 700, color: '#1E3A5F', marginBottom: '0.5vh' }}>Spacing check is O(n²)</div>
              <p style={{ fontSize: '1.9vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>Fine for single-cell MVPs; needs R-tree (shapely STRtree) for full-chip layouts</p>
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0.8vw', border: '1px solid #E2E8F0', padding: '2.2vh 2.2vw', boxShadow: '0 2px 12px rgba(30,58,95,0.06)', display: 'flex', gap: '1.5vw', alignItems: 'flex-start' }}>
            <div style={{ backgroundColor: 'rgba(245,158,11,0.1)', width: '3vw', height: '3vw', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '1.4vw', fontWeight: 800, color: '#F59E0B' }}>2</span>
            </div>
            <div>
              <div style={{ fontSize: '1.5vw', fontWeight: 700, color: '#1E3A5F', marginBottom: '0.5vh' }}>Only Layer (1, 0) checked</div>
              <p style={{ fontSize: '1.9vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>Real PDKs have 10–30 layers each with distinct rules</p>
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0.8vw', border: '1px solid #E2E8F0', padding: '2.2vh 2.2vw', boxShadow: '0 2px 12px rgba(30,58,95,0.06)', display: 'flex', gap: '1.5vw', alignItems: 'flex-start' }}>
            <div style={{ backgroundColor: 'rgba(245,158,11,0.1)', width: '3vw', height: '3vw', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '1.4vw', fontWeight: 800, color: '#F59E0B' }}>3</span>
            </div>
            <div>
              <div style={{ fontSize: '1.5vw', fontWeight: 700, color: '#1E3A5F', marginBottom: '0.5vh' }}>Foundry rules are reference values</div>
              <p style={{ fontSize: '1.9vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>Not certified PDK files — fine for early error detection, not sign-off</p>
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0.8vw', border: '1px solid #E2E8F0', padding: '2.2vh 2.2vw', boxShadow: '0 2px 12px rgba(30,58,95,0.06)', display: 'flex', gap: '1.5vw', alignItems: 'flex-start' }}>
            <div style={{ backgroundColor: 'rgba(245,158,11,0.1)', width: '3vw', height: '3vw', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '1.4vw', fontWeight: 800, color: '#F59E0B' }}>4</span>
            </div>
            <div>
              <div style={{ fontSize: '1.5vw', fontWeight: 700, color: '#1E3A5F', marginBottom: '0.5vh' }}>.oas (OASIS) not supported</div>
              <p style={{ fontSize: '1.9vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>gdspy only reads GDSII; OASIS needs KLayout Python API as backend</p>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(13,148,136,0.06)', borderRadius: '0.8vw', border: '1px solid rgba(13,148,136,0.15)', padding: '1.8vh 2.5vw', display: 'flex', alignItems: 'center', gap: '1.5vw' }}>
          <div style={{ fontSize: '1.3vw', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0 }}>Key insight</div>
          <p style={{ fontSize: '1.9vw', color: '#1E3A5F', margin: 0, lineHeight: 1.4 }}>Each of these is a scoped engineering project with a clear solution path — not a fundamental architectural blocker</p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '1.5vh', fontSize: '1vw', color: '#94A3B8', fontWeight: 500 }}>
        <span>PhotonLint, Inc.</span>
        <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'center' }}>
          <span>Engineering Deep-Dive</span>
          <span>·</span>
          <span>Slide 9 of 10</span>
        </div>
      </div>
    </div>
  );
}
