export default function Slide06Market() {
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
        <div style={{ fontSize: '1vw', fontWeight: 600, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Market Opportunity&nbsp;&nbsp;·&nbsp;&nbsp;2026</div>
      </div>

      {/* Main: left stats + right content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4vw', alignItems: 'center' }}>

        {/* Left: key metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5vh' }}>
          <div>
            <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#0D9488', marginBottom: '0.8vh', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Total addressable market</div>
            <div style={{ fontSize: '7vw', fontWeight: 800, color: '#1E3A5F', lineHeight: 1, letterSpacing: '-0.04em' }}>$1.2B</div>
            <div style={{ fontSize: '1.5vw', fontWeight: 500, color: '#64748B', marginTop: '0.5vh' }}>Silicon Photonics TAM</div>
          </div>

          <div style={{ display: 'flex', gap: '2vw' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0.8vw', border: '1px solid #E2E8F0', padding: '2vh 1.8vw', flex: 1, boxShadow: '0 2px 12px rgba(30,58,95,0.06)', textAlign: 'center' }}>
              <div style={{ fontSize: '3vw', fontWeight: 800, color: '#0D9488' }}>25%</div>
              <div style={{ fontSize: '1.2vw', color: '#64748B', marginTop: '0.5vh' }}>YoY growth</div>
            </div>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0.8vw', border: '1px solid #E2E8F0', padding: '2vh 1.8vw', flex: 1, boxShadow: '0 2px 12px rgba(30,58,95,0.06)', textAlign: 'center' }}>
              <div style={{ fontSize: '3vw', fontWeight: 800, color: '#1E3A5F' }}>300+</div>
              <div style={{ fontSize: '1.2vw', color: '#64748B', marginTop: '0.5vh' }}>SiP startups</div>
            </div>
          </div>
        </div>

        {/* Right: market detail */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '2.2vw', fontWeight: 800, color: '#1E3A5F', margin: '0 0 2.5vh 0', lineHeight: 1.2, textWrap: 'balance' } as React.CSSProperties}>
            $1.2B Silicon Photonics TAM, growing 25% YoY
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8vh' }}>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#0D9488', borderRadius: '50%', marginTop: '1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>300+ silicon photonics startups globally (co-packaged optics, LiDAR, sensing, quantum)</p>
            </div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#0D9488', borderRadius: '50%', marginTop: '1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>Each runs 2–6 tape-outs per year at $100K–$500K per run</p>
            </div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#0D9488', borderRadius: '50%', marginTop: '1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>SAM: agile SiP startups and university labs that cannot afford Synopsys/Cadence</p>
            </div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#0D9488', borderRadius: '50%', marginTop: '1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>Expansion path: OASIS file support, multi-layer PDKs, real-time rule updates via foundry partnerships</p>
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
          <span>Slide 6 of 10</span>
        </div>
      </div>
    </div>
  );
}
