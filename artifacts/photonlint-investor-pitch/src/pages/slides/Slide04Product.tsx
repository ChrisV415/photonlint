export default function Slide04Product() {
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
        <div style={{ fontSize: '1vw', fontWeight: 600, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>The Product&nbsp;&nbsp;·&nbsp;&nbsp;2026</div>
      </div>

      {/* Main */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5vh' }}>
        <div>
          <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#0D9488', marginBottom: '1vh', textTransform: 'uppercase', letterSpacing: '0.12em' }}>How it works</div>
          <h2 style={{ fontSize: '2.8vw', fontWeight: 800, color: '#1E3A5F', margin: 0, lineHeight: 1.15, textWrap: 'balance' } as React.CSSProperties}>
            Browser-native DRC in under 10 seconds
          </h2>
        </div>

        {/* 3-step process */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2vw' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0.8vw', border: '1px solid #E2E8F0', padding: '2.5vh 2vw', boxShadow: '0 2px 12px rgba(30,58,95,0.06)', display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
            <div style={{ fontSize: '2.5vw', fontWeight: 800, color: '#0D9488' }}>01</div>
            <div style={{ fontSize: '1.6vw', fontWeight: 700, color: '#1E3A5F' }}>Upload</div>
            <p style={{ fontSize: '1.8vw', color: '#64748B', margin: 0, lineHeight: 1.45 }}>Upload a .gds layout file from any browser — no installation, no license, no IT ticket</p>
          </div>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0.8vw', border: '1px solid #E2E8F0', padding: '2.5vh 2vw', boxShadow: '0 2px 12px rgba(30,58,95,0.06)', display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
            <div style={{ fontSize: '2.5vw', fontWeight: 800, color: '#0D9488' }}>02</div>
            <div style={{ fontSize: '1.6vw', fontWeight: 700, color: '#1E3A5F' }}>Select foundry</div>
            <p style={{ fontSize: '1.8vw', color: '#64748B', margin: 0, lineHeight: 1.45 }}>Choose your target PDK: GF 45SPCLO, AIM Photonics, Tower PH18, or imec iSiPP50G</p>
          </div>
          <div style={{ backgroundColor: '#1E3A5F', borderRadius: '0.8vw', border: '1px solid #1E3A5F', padding: '2.5vh 2vw', boxShadow: '0 2px 12px rgba(30,58,95,0.12)', display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
            <div style={{ fontSize: '2.5vw', fontWeight: 800, color: '#0D9488' }}>03</div>
            <div style={{ fontSize: '1.6vw', fontWeight: 700, color: '#FFFFFF' }}>Get results</div>
            <p style={{ fontSize: '1.8vw', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.45 }}>Instant, actionable violation report with severity levels — in under 10 seconds</p>
          </div>
        </div>

        {/* Bottom 2 features */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2vw' }}>
          <div style={{ backgroundColor: 'rgba(13,148,136,0.06)', borderRadius: '0.8vw', border: '1px solid rgba(13,148,136,0.15)', padding: '2vh 2vw', display: 'flex', gap: '1.5vw', alignItems: 'center' }}>
            <div style={{ width: '3vw', height: '3vw', backgroundColor: '#0D9488', borderRadius: '0.5vw', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ width: '1.4vw', height: '1vw', backgroundColor: '#FFFFFF', borderRadius: '0.2vw' }} />
            </div>
            <p style={{ fontSize: '1.8vw', color: '#1E3A5F', margin: 0, lineHeight: 1.4, fontWeight: 500 }}>Download a PDF or CSV for your review record</p>
          </div>
          <div style={{ backgroundColor: 'rgba(13,148,136,0.06)', borderRadius: '0.8vw', border: '1px solid rgba(13,148,136,0.15)', padding: '2vh 2vw', display: 'flex', gap: '1.5vw', alignItems: 'center' }}>
            <div style={{ width: '3vw', height: '3vw', backgroundColor: '#0D9488', borderRadius: '0.5vw', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ width: '1.4vw', height: '1.4vw', border: '0.25vw solid #FFFFFF', borderRadius: '50%' }} />
            </div>
            <p style={{ fontSize: '1.8vw', color: '#1E3A5F', margin: 0, lineHeight: 1.4, fontWeight: 500 }}>An insurance policy before every tape-out submission</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '1.5vh', fontSize: '1vw', color: '#94A3B8', fontWeight: 500 }}>
        <span>PhotonLint, Inc.</span>
        <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'center' }}>
          <span>Confidential &amp; Proprietary</span>
          <span>·</span>
          <span>Slide 4 of 10</span>
        </div>
      </div>
    </div>
  );
}
