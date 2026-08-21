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
        <div style={{ fontSize: '1vw', fontWeight: 600, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Engineering Deep-Dive&nbsp;&nbsp;·&nbsp;&nbsp;2026</div>
      </div>

      {/* Main: 3fr + 2fr */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '3vw', alignItems: 'center' }}>

        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#0D9488', marginBottom: '1.5vh', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Deck 2 of 3
          </div>
          <h1 style={{ fontSize: '5vw', fontWeight: 800, margin: '0 0 1.5vh 0', lineHeight: 1.1, letterSpacing: '-0.03em', color: '#1E3A5F' }}>
            PhotonLint — System Architecture
          </h1>
          <p style={{ fontSize: '1.9vw', fontWeight: 400, color: '#64748B', margin: '0 0 3.5vh 0', lineHeight: 1.5 }}>
            Architecture &amp; Implementation of the PhotonLint DRC Engine
          </p>

          <div style={{ display: 'flex', gap: '2vw' }}>
            <div style={{ background: '#FFFFFF', padding: '2vh 2vw', borderRadius: '0.8vw', border: '1px solid #E2E8F0', flex: 1, boxShadow: '0 2px 12px rgba(30,58,95,0.06)' }}>
              <div style={{ fontSize: '1vw', fontWeight: 600, color: '#64748B', marginBottom: '0.8vh', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stack layers</div>
              <div style={{ fontSize: '3.2vw', fontWeight: 800, color: '#1E3A5F' }}>6</div>
              <div style={{ fontSize: '1.2vw', color: '#64748B', marginTop: '0.4vh' }}>React · Express · Python · PG</div>
            </div>
            <div style={{ background: '#FFFFFF', padding: '2vh 2vw', borderRadius: '0.8vw', border: '1px solid #E2E8F0', flex: 1, boxShadow: '0 2px 12px rgba(30,58,95,0.06)' }}>
              <div style={{ fontSize: '1vw', fontWeight: 600, color: '#64748B', marginBottom: '0.8vh', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DRC checks</div>
              <div style={{ fontSize: '3.2vw', fontWeight: 800, color: '#1E3A5F' }}>4</div>
              <div style={{ fontSize: '1.2vw', color: '#64748B', marginTop: '0.4vh' }}>Grid · Width · Spacing · Bend</div>
            </div>
          </div>
        </div>

        {/* Right: dark architecture panel */}
        <div style={{ backgroundColor: '#1E3A5F', borderRadius: '1vw', padding: '3vh 2.5vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2.5vh', alignSelf: 'stretch' }}>
          <div style={{ fontSize: '1vw', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.1em' }}>System overview</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2vw', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.5vh' }}>
              <div style={{ width: '0.7vw', height: '0.7vw', backgroundColor: '#0D9488', borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ fontSize: '1.5vw', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>React + Vite + Tailwind</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2vw', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.5vh' }}>
              <div style={{ width: '0.7vw', height: '0.7vw', backgroundColor: '#0D9488', borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ fontSize: '1.5vw', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>Express 5 + multer</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2vw', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.5vh' }}>
              <div style={{ width: '0.7vw', height: '0.7vw', backgroundColor: '#0D9488', borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ fontSize: '1.5vw', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>Python · gdspy · shapely</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2vw', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.5vh' }}>
              <div style={{ width: '0.7vw', height: '0.7vw', backgroundColor: '#0D9488', borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ fontSize: '1.5vw', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>PostgreSQL + Drizzle ORM</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2vw' }}>
              <div style={{ width: '0.7vw', height: '0.7vw', backgroundColor: '#0D9488', borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ fontSize: '1.5vw', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>OpenAPI + Orval codegen</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '1.5vh', fontSize: '1vw', color: '#94A3B8', fontWeight: 500 }}>
        <span>PhotonLint, Inc.</span>
        <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'center' }}>
          <span>Engineering Deep-Dive</span>
          <span>·</span>
          <span>Slide 1 of 10</span>
        </div>
      </div>
    </div>
  );
}
