export default function Slide03LegacyEDA() {
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
        <div style={{ fontSize: '1vw', fontWeight: 600, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Market Gap&nbsp;&nbsp;·&nbsp;&nbsp;2026</div>
      </div>

      {/* Main */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '4vw', alignItems: 'center' }}>

        {/* Left: big stat */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#64748B', marginBottom: '1.5vh', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Legacy EDA market
          </div>
          <div style={{ fontSize: '8vw', fontWeight: 800, color: '#1E3A5F', lineHeight: 1, letterSpacing: '-0.04em', marginBottom: '1vh' }}>
            $2B
          </div>
          <div style={{ fontSize: '1.6vw', fontWeight: 500, color: '#64748B', lineHeight: 1.4, marginBottom: '3vh' }}>
            per year in licenses — mostly inaccessible to startups
          </div>
          <div style={{ backgroundColor: 'rgba(13,148,136,0.08)', border: '1px solid rgba(13,148,136,0.2)', borderRadius: '0.8vw', padding: '2vh 2vw' }}>
            <div style={{ fontSize: '1.3vw', fontWeight: 700, color: '#0D9488', marginBottom: '0.5vh' }}>No cloud-native option exists</div>
            <div style={{ fontSize: '1.5vw', color: '#475569', lineHeight: 1.4 }}>PhotonLint fills the gap with browser-native, instant-feedback DRC</div>
          </div>
        </div>

        {/* Right: 5 bullets */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '2.2vw', fontWeight: 800, color: '#1E3A5F', margin: '0 0 2.5vh 0', lineHeight: 1.2, textWrap: 'balance' } as React.CSSProperties}>
            Legacy EDA tools are a $2B tax on innovation
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#64748B', borderRadius: '50%', marginTop: '1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.4, fontWeight: 400 }}>Synopsys and Cadence DRC tools cost $100K–$500K/year in licenses</p>
            </div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#64748B', borderRadius: '50%', marginTop: '1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.4, fontWeight: 400 }}>Require dedicated IT infrastructure and 6-month procurement cycles</p>
            </div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#64748B', borderRadius: '50%', marginTop: '1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.4, fontWeight: 400 }}>Overkill for agile deep-tech startups iterating on photonic designs weekly</p>
            </div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#64748B', borderRadius: '50%', marginTop: '1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.4, fontWeight: 400 }}>Open-source alternative (KLayout) requires scripting expertise and manual rule setup</p>
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
          <span>Slide 3 of 10</span>
        </div>
      </div>
    </div>
  );
}
