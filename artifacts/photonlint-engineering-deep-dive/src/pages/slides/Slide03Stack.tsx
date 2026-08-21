export default function Slide03Stack() {
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
        <div style={{ fontSize: '1vw', fontWeight: 600, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>System Stack&nbsp;&nbsp;·&nbsp;&nbsp;2026</div>
      </div>

      {/* Main */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '3.5vw', alignItems: 'center' }}>

        {/* Left: stack diagram */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1vh' }}>
          <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#0D9488', marginBottom: '1vh', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Architecture layers</div>

          <div style={{ backgroundColor: 'rgba(13,148,136,0.12)', border: '1px solid rgba(13,148,136,0.3)', borderRadius: '0.6vw', padding: '1.8vh 2vw', display: 'flex', alignItems: 'center', gap: '1.5vw' }}>
            <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#0D9488', width: '8vw' }}>Frontend</div>
            <div style={{ fontSize: '1.8vw', color: '#1E3A5F', fontWeight: 500 }}>React + Vite + Tailwind</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '0.2vw', height: '2vh', backgroundColor: '#E2E8F0' }} />
          </div>

          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '0.6vw', padding: '1.8vh 2vw', display: 'flex', alignItems: 'center', gap: '1.5vw', boxShadow: '0 2px 8px rgba(30,58,95,0.05)' }}>
            <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#64748B', width: '8vw' }}>API</div>
            <div style={{ fontSize: '1.8vw', color: '#1E3A5F', fontWeight: 500 }}>Express 5 + multer</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '0.2vw', height: '2vh', backgroundColor: '#E2E8F0' }} />
          </div>

          <div style={{ backgroundColor: '#1E3A5F', borderRadius: '0.6vw', padding: '1.8vh 2vw', display: 'flex', alignItems: 'center', gap: '1.5vw' }}>
            <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#0D9488', width: '8vw' }}>DRC Engine</div>
            <div style={{ fontSize: '1.8vw', color: '#FFFFFF', fontWeight: 500 }}>Python · gdspy · shapely</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '0.2vw', height: '2vh', backgroundColor: '#E2E8F0' }} />
          </div>

          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '0.6vw', padding: '1.8vh 2vw', display: 'flex', alignItems: 'center', gap: '1.5vw', boxShadow: '0 2px 8px rgba(30,58,95,0.05)' }}>
            <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#64748B', width: '8vw' }}>DB</div>
            <div style={{ fontSize: '1.8vw', color: '#1E3A5F', fontWeight: 500 }}>PostgreSQL + Drizzle ORM</div>
          </div>
        </div>

        {/* Right: description */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '2.4vw', fontWeight: 800, color: '#1E3A5F', margin: '0 0 2.5vh 0', lineHeight: 1.2 }}>
            Stack: React → Express → Python subprocess
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8vh' }}>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#0D9488', borderRadius: '50%', marginTop: '1.1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>Frontend: React + Vite + Tailwind — upload, foundry select, results, history, stats</p>
            </div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#0D9488', borderRadius: '50%', marginTop: '1.1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>DRC Engine: Python 3 subprocess — gdspy parses GDSII, shapely does geometry</p>
            </div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#0D9488', borderRadius: '50%', marginTop: '1.1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>Contract: OpenAPI spec → Orval codegen → typed React hooks + Zod validation</p>
            </div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#0D9488', borderRadius: '50%', marginTop: '1.1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>PDF: reportlab Python script, spawned on demand, streams bytes to browser</p>
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
          <span>Slide 3 of 10</span>
        </div>
      </div>
    </div>
  );
}
