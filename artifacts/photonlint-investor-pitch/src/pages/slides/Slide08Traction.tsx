export default function Slide08Traction() {
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
        <div style={{ fontSize: '1vw', fontWeight: 600, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Traction &amp; Roadmap&nbsp;&nbsp;·&nbsp;&nbsp;2026</div>
      </div>

      {/* Main: 2 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3vw' }}>

        {/* Left: current state */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5vh' }}>
          <div>
            <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#0D9488', marginBottom: '0.8vh', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Today</div>
            <h2 style={{ fontSize: '2.4vw', fontWeight: 800, color: '#1E3A5F', margin: 0, lineHeight: 1.2 }}>MVP live</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0.7vw', border: '1px solid #E2E8F0', padding: '1.8vh 1.8vw', boxShadow: '0 2px 8px rgba(30,58,95,0.05)', display: 'flex', alignItems: 'center', gap: '1.2vw' }}>
              <div style={{ width: '0.8vw', height: '0.8vw', backgroundColor: '#0D9488', borderRadius: '50%', flexShrink: 0 }} />
              <p style={{ fontSize: '1.9vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>Upload, DRC check, PDF report, run history, statistics dashboard</p>
            </div>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0.7vw', border: '1px solid #E2E8F0', padding: '1.8vh 1.8vw', boxShadow: '0 2px 8px rgba(30,58,95,0.05)', display: 'flex', alignItems: 'center', gap: '1.2vw' }}>
              <div style={{ width: '0.8vw', height: '0.8vw', backgroundColor: '#0D9488', borderRadius: '50%', flexShrink: 0 }} />
              <p style={{ fontSize: '1.9vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>4 foundry PDKs integrated: GF 45SPCLO, AIM Photonics, Tower PH18, imec iSiPP50G</p>
            </div>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0.7vw', border: '1px solid #E2E8F0', padding: '1.8vh 1.8vw', boxShadow: '0 2px 8px rgba(30,58,95,0.05)', display: 'flex', alignItems: 'center', gap: '1.2vw' }}>
              <div style={{ width: '0.8vw', height: '0.8vw', backgroundColor: '#0D9488', borderRadius: '50%', flexShrink: 0 }} />
              <p style={{ fontSize: '1.9vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>DRC engine: shapely-based real spacing, true rotated-rectangle width, bend-radius heuristic</p>
            </div>
          </div>
        </div>

        {/* Right: roadmap */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5vh' }}>
          <div>
            <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#64748B', marginBottom: '0.8vh', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Ahead</div>
            <h2 style={{ fontSize: '2.4vw', fontWeight: 800, color: '#1E3A5F', margin: 0, lineHeight: 1.2 }}>Roadmap</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5vh', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '1.1vw', top: '2vh', bottom: '2vh', width: '2px', backgroundColor: '#E2E8F0' }} />

            <div style={{ display: 'flex', gap: '2.5vw', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '2.2vw', height: '2.2vw', backgroundColor: '#0D9488', borderRadius: '50%', border: '3px solid #FAFBFC', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '0.6vw', height: '0.6vw', backgroundColor: '#FFFFFF', borderRadius: '50%' }} />
              </div>
              <div>
                <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Next 90 days</div>
                <p style={{ fontSize: '1.9vw', color: '#1E3A5F', margin: '0.4vh 0 0 0', lineHeight: 1.4 }}>GDS layout viewer with highlighted violations, real PDK rule file support</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '2.5vw', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '2.2vw', height: '2.2vw', backgroundColor: '#FFFFFF', borderRadius: '50%', border: '2px solid #E2E8F0', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '0.6vw', height: '0.6vw', backgroundColor: '#94A3B8', borderRadius: '50%' }} />
              </div>
              <div>
                <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>6 months</div>
                <p style={{ fontSize: '1.9vw', color: '#475569', margin: '0.4vh 0 0 0', lineHeight: 1.4 }}>Mobile companion app, OASIS (.oas) file support, R-tree spatial index for full-chip scale</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '2.5vw', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '2.2vw', height: '2.2vw', backgroundColor: '#FFFFFF', borderRadius: '50%', border: '2px solid #E2E8F0', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '0.6vw', height: '0.6vw', backgroundColor: '#94A3B8', borderRadius: '50%' }} />
              </div>
              <div>
                <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>12 months</div>
                <p style={{ fontSize: '1.9vw', color: '#475569', margin: '0.4vh 0 0 0', lineHeight: 1.4 }}>Foundry partnership for certified rule sets, enterprise SSO</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '1.5vh', fontSize: '1vw', color: '#94A3B8', fontWeight: 500 }}>
        <span>PhotonLint, Inc.</span>
        <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'center' }}>
          <span>Confidential &amp; Proprietary</span>
          <span>·</span>
          <span>Slide 8 of 10</span>
        </div>
      </div>
    </div>
  );
}
