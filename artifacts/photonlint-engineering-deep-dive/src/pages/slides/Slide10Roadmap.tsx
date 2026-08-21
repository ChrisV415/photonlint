export default function Slide10Roadmap() {
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
        <div style={{ fontSize: '1vw', fontWeight: 600, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Engineering Roadmap&nbsp;&nbsp;·&nbsp;&nbsp;2026</div>
      </div>

      {/* Main */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4vw', alignItems: 'center' }}>

        {/* Left */}
        <div>
          <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#0D9488', marginBottom: '1.5vh', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Engineering</div>
          <h2 style={{ fontSize: '3.2vw', fontWeight: 800, color: '#FFFFFF', margin: '0 0 2.5vh 0', lineHeight: 1.15 }}>
            From MVP to production DRC engine
          </h2>
          <p style={{ fontSize: '1.8vw', color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.5 }}>
            Each item is scoped, independently shippable, and builds toward certified foundry DRC
          </p>
        </div>

        {/* Right: 3 horizon columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2vw' }}>

          <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '0.8vw', border: '1px solid rgba(255,255,255,0.1)', padding: '2.5vh 2vw', display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
            <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5vh' }}>Near-term</div>
            <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#0D9488', borderRadius: '50%', marginTop: '0.9vh', flexShrink: 0 }} />
              <p style={{ fontSize: '1.9vw', color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.4 }}>GDS layout viewer with highlighted violation polygons</p>
            </div>
            <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#0D9488', borderRadius: '50%', marginTop: '0.9vh', flexShrink: 0 }} />
              <p style={{ fontSize: '1.9vw', color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.4 }}>Real PDK rule YAML files per foundry — layer-specific rules</p>
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '0.8vw', border: '1px solid rgba(255,255,255,0.1)', padding: '2.5vh 2vw', display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
            <div style={{ fontSize: '1.2vw', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5vh' }}>Medium-term</div>
            <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '50%', marginTop: '0.9vh', flexShrink: 0 }} />
              <p style={{ fontSize: '1.9vw', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.4 }}>R-tree spatial index for full-chip spacing checks at scale</p>
            </div>
            <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '50%', marginTop: '0.9vh', flexShrink: 0 }} />
              <p style={{ fontSize: '1.9vw', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.4 }}>OASIS (.oas) support via KLayout Python API as alternative backend</p>
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '0.8vw', border: '1px solid rgba(255,255,255,0.1)', padding: '2.5vh 2vw', display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
            <div style={{ fontSize: '1.2vw', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5vh' }}>Longer-term</div>
            <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', marginTop: '0.9vh', flexShrink: 0 }} />
              <p style={{ fontSize: '1.9vw', color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.4 }}>Arc reconstruction for true bend-radius CRITICAL checks</p>
            </div>
            <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', marginTop: '0.9vh', flexShrink: 0 }} />
              <p style={{ fontSize: '1.9vw', color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.4 }}>Multi-layer DRC with layer interaction rules</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5vh', fontSize: '1vw', color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
        <span>PhotonLint, Inc.</span>
        <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'center' }}>
          <span>Engineering Deep-Dive</span>
          <span>·</span>
          <span>Slide 10 of 10</span>
        </div>
      </div>
    </div>
  );
}
