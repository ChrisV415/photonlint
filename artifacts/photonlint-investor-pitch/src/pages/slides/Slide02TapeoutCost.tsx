export default function Slide02TapeoutCost() {
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
        <div style={{ fontSize: '1vw', fontWeight: 600, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>The Problem&nbsp;&nbsp;·&nbsp;&nbsp;2026</div>
      </div>

      {/* Main: 2-column */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '4vw', alignItems: 'center' }}>

        {/* Left: big stat */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#EF4444', marginBottom: '1.5vh', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Cost of failure
          </div>
          <div style={{ fontSize: '9vw', fontWeight: 800, color: '#1E3A5F', lineHeight: 1, letterSpacing: '-0.04em', marginBottom: '1vh' }}>
            $500K
          </div>
          <div style={{ fontSize: '1.6vw', fontWeight: 500, color: '#64748B', marginBottom: '3vh', lineHeight: 1.4 }}>
            per failed tape-out run
          </div>

          <div style={{ display: 'flex', gap: '2vw' }}>
            <div style={{ background: '#FFFFFF', padding: '1.8vh 1.8vw', borderRadius: '0.8vw', border: '1px solid #E2E8F0', boxShadow: '0 2px 12px rgba(30,58,95,0.06)' }}>
              <div style={{ fontSize: '2.8vw', fontWeight: 800, color: '#1E3A5F' }}>3–4</div>
              <div style={{ fontSize: '1.2vw', color: '#64748B', marginTop: '0.4vh' }}>months delay</div>
            </div>
            <div style={{ background: '#FFFFFF', padding: '1.8vh 1.8vw', borderRadius: '0.8vw', border: '1px solid #E2E8F0', boxShadow: '0 2px 12px rgba(30,58,95,0.06)' }}>
              <div style={{ fontSize: '2.8vw', fontWeight: 800, color: '#1E3A5F' }}>$100K+</div>
              <div style={{ fontSize: '1.2vw', color: '#64748B', marginTop: '0.4vh' }}>minimum run cost</div>
            </div>
          </div>
        </div>

        {/* Right: bullets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <h2 style={{ fontSize: '2.4vw', fontWeight: 800, color: '#1E3A5F', margin: '0 0 1vh 0', lineHeight: 1.2, textWrap: 'balance' } as React.CSSProperties}>
            A single tape-out failure costs $500K and 4 months
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#0D9488', borderRadius: '50%', marginTop: '1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.45, fontWeight: 400 }}>Silicon photonics startups send chip layouts to fabs for manufacturing — a process called tape-out</p>
            </div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#0D9488', borderRadius: '50%', marginTop: '1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.45, fontWeight: 400 }}>If a layout violates the foundry's design rules, the wafer run fails</p>
            </div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#0D9488', borderRadius: '50%', marginTop: '1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.45, fontWeight: 400 }}>Engineers are checking layouts manually or relying on expensive on-premise EDA tools</p>
            </div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#EF4444', borderRadius: '50%', marginTop: '1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '2vw', color: '#1E3A5F', margin: 0, lineHeight: 1.45, fontWeight: 600 }}>One missed rule = six-figure loss and a derailed product timeline</p>
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
          <span>Slide 2 of 10</span>
        </div>
      </div>
    </div>
  );
}
