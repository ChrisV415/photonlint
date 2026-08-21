export default function Slide10JoinUs() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{
        backgroundColor: '#1E3A5F',
        fontFamily: "'Inter', sans-serif",
        padding: '3vh 4vw',
        boxSizing: 'border-box',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        gap: '2vh',
        color: '#FFFFFF',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
          <div style={{ width: '1.8vw', height: '1.8vw', backgroundColor: '#0D9488', borderRadius: '0.3vw' }} />
          <span style={{ fontSize: '1.2vw', fontWeight: 700, letterSpacing: '0.02em', color: '#FFFFFF' }}>PhotonLint</span>
        </div>
        <div style={{ fontSize: '1vw', fontWeight: 600, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Investor Pitch&nbsp;&nbsp;·&nbsp;&nbsp;2026</div>
      </div>

      {/* Main: 2 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4vw', alignItems: 'center' }}>

        {/* Left: the ask */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#0D9488', marginBottom: '1.5vh', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Pre-seed round
          </div>
          <div style={{ fontSize: '7vw', fontWeight: 800, color: '#FFFFFF', lineHeight: 1, letterSpacing: '-0.04em', marginBottom: '1vh' }}>
            $1.5M
          </div>
          <p style={{ fontSize: '1.8vw', color: 'rgba(255,255,255,0.65)', margin: '0 0 3vh 0', lineHeight: 1.5 }}>
            Join us — help make tape-out failures a thing of the past
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
            <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'center' }}>
              <div style={{ width: '0.6vw', height: '0.6vw', backgroundColor: '#0D9488', borderRadius: '50%', flexShrink: 0 }} />
              <p style={{ fontSize: '1.9vw', color: 'rgba(255,255,255,0.8)', margin: 0 }}>Reach 50 paying teams</p>
            </div>
            <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'center' }}>
              <div style={{ width: '0.6vw', height: '0.6vw', backgroundColor: '#0D9488', borderRadius: '50%', flexShrink: 0 }} />
              <p style={{ fontSize: '1.9vw', color: 'rgba(255,255,255,0.8)', margin: 0 }}>Close first foundry partnership</p>
            </div>
          </div>
        </div>

        {/* Right: use of funds + contact */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5vh' }}>

          <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '0.8vw', border: '1px solid rgba(255,255,255,0.1)', padding: '2.5vh 2.5vw' }}>
            <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#0D9488', marginBottom: '2vh', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Use of funds</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '2vw', color: 'rgba(255,255,255,0.8)', margin: 0 }}>Foundry rule verification</p>
                <span style={{ fontSize: '2vw', fontWeight: 700, color: '#0D9488' }}>40%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '2vw', color: 'rgba(255,255,255,0.8)', margin: 0 }}>Engineering</p>
                <span style={{ fontSize: '2vw', fontWeight: 700, color: '#0D9488' }}>40%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '2vw', color: 'rgba(255,255,255,0.8)', margin: 0 }}>Go-to-market</p>
                <span style={{ fontSize: '2vw', fontWeight: 700, color: '#0D9488' }}>20%</span>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '0.8vw', border: '1px solid rgba(255,255,255,0.1)', padding: '2vh 2.5vw' }}>
            <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#0D9488', marginBottom: '1.2vh', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Contact</div>
            <p style={{ fontSize: '2.2vw', fontWeight: 600, color: '#FFFFFF', margin: '0 0 0.5vh 0' }}>team@photonlint.io</p>
            <p style={{ fontSize: '1.6vw', color: 'rgba(255,255,255,0.5)', margin: 0 }}>photonlint.io</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5vh', fontSize: '1vw', color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
        <span>PhotonLint, Inc.</span>
        <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'center' }}>
          <span>Confidential &amp; Proprietary</span>
          <span>·</span>
          <span>Slide 10 of 10</span>
        </div>
      </div>
    </div>
  );
}
