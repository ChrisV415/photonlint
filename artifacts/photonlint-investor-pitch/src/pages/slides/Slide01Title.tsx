export default function Slide01Title() {
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
        <div style={{ fontSize: '1vw', fontWeight: 600, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Investor Pitch&nbsp;&nbsp;·&nbsp;&nbsp;2026</div>
      </div>

      {/* Main: 3fr + 2fr */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '3vw', alignItems: 'center' }}>

        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#0D9488', marginBottom: '1.5vh', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Deck 1 of 3
          </div>
          <h1 style={{ fontSize: '6vw', fontWeight: 800, margin: '0 0 1.5vh 0', lineHeight: 1.05, letterSpacing: '-0.03em', color: '#1E3A5F' }}>
            PhotonLint
          </h1>
          <p style={{ fontSize: '1.9vw', fontWeight: 500, color: '#1E3A5F', margin: '0 0 1vh 0', lineHeight: 1.3 }}>
            The Grammarly for Photonic Chip Layouts.
          </p>
          <p style={{ fontSize: '1.6vw', fontWeight: 400, color: '#64748B', margin: '0 0 3.5vh 0', lineHeight: 1.5 }}>
            Cloud-native Design Rule Checking for Silicon Photonics engineers.
          </p>

          <div style={{ display: 'flex', gap: '2vw' }}>
            <div style={{ background: '#FFFFFF', padding: '2vh 2vw', borderRadius: '0.8vw', border: '1px solid #E2E8F0', flex: 1, boxShadow: '0 2px 12px rgba(30,58,95,0.06)' }}>
              <div style={{ fontSize: '1vw', fontWeight: 600, color: '#64748B', marginBottom: '0.8vh', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cost of failure</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.8vw' }}>
                <span style={{ fontSize: '3.2vw', fontWeight: 800, color: '#1E3A5F' }}>$500K</span>
                <span style={{ fontSize: '1vw', fontWeight: 600, color: '#EF4444', backgroundColor: 'rgba(239,68,68,0.08)', padding: '0.3vh 0.6vw', borderRadius: '1vw' }}>per run</span>
              </div>
            </div>
            <div style={{ background: '#FFFFFF', padding: '2vh 2vw', borderRadius: '0.8vw', border: '1px solid #E2E8F0', flex: 1, boxShadow: '0 2px 12px rgba(30,58,95,0.06)' }}>
              <div style={{ fontSize: '1vw', fontWeight: 600, color: '#64748B', marginBottom: '0.8vh', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DRC check time</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.8vw' }}>
                <span style={{ fontSize: '3.2vw', fontWeight: 800, color: '#1E3A5F' }}>{'<'} 10s</span>
                <span style={{ fontSize: '1vw', fontWeight: 600, color: '#0D9488', backgroundColor: 'rgba(13,148,136,0.1)', padding: '0.3vh 0.6vw', borderRadius: '1vw' }}>browser</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: dark panel */}
        <div style={{ backgroundColor: '#1E3A5F', borderRadius: '1vw', padding: '3.5vh 2.5vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '3vh', alignSelf: 'stretch' }}>
          <div style={{ fontSize: '1vw', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.1em' }}>In production today</div>

          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2.5vh' }}>
            <div style={{ fontSize: '3vw', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1 }}>{'<'} 10 seconds</div>
            <div style={{ fontSize: '1.3vw', color: 'rgba(255,255,255,0.55)', marginTop: '0.7vh' }}>DRC check time</div>
          </div>

          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2.5vh' }}>
            <div style={{ fontSize: '3vw', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1 }}>4 Foundry PDKs</div>
            <div style={{ fontSize: '1.3vw', color: 'rgba(255,255,255,0.55)', marginTop: '0.7vh' }}>GF · AIM · Tower · imec</div>
          </div>

          <div>
            <div style={{ fontSize: '3vw', fontWeight: 800, color: '#0D9488', lineHeight: 1.1 }}>PDF + CSV</div>
            <div style={{ fontSize: '1.3vw', color: 'rgba(255,255,255,0.55)', marginTop: '0.7vh' }}>export formats</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '1.5vh', fontSize: '1vw', color: '#94A3B8', fontWeight: 500 }}>
        <span>PhotonLint, Inc.</span>
        <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'center' }}>
          <span>Confidential &amp; Proprietary</span>
          <span>·</span>
          <span>Slide 1 of 10</span>
        </div>
      </div>
    </div>
  );
}
