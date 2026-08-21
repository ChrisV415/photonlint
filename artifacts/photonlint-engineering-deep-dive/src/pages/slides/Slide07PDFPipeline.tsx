export default function Slide07PDFPipeline() {
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
        <div style={{ fontSize: '1vw', fontWeight: 600, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>PDF Pipeline&nbsp;&nbsp;·&nbsp;&nbsp;2026</div>
      </div>

      {/* Main */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5vh' }}>
        <div>
          <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#0D9488', marginBottom: '0.8vh', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Implementation</div>
          <h2 style={{ fontSize: '2.6vw', fontWeight: 800, color: '#1E3A5F', margin: 0, lineHeight: 1.15 }}>
            PDF report pipeline: report.py + reportlab
          </h2>
        </div>

        {/* Pipeline flow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1vw', flexWrap: 'nowrap' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0.7vw', border: '1px solid #E2E8F0', padding: '2vh 2vw', boxShadow: '0 2px 8px rgba(30,58,95,0.05)', textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#64748B', marginBottom: '0.8vh', textTransform: 'uppercase', letterSpacing: '0.05em' }}>1</div>
            <div style={{ fontSize: '1.8vw', fontWeight: 700, color: '#1E3A5F', marginBottom: '0.5vh' }}>PostgreSQL</div>
            <div style={{ fontSize: '1.4vw', color: '#64748B' }}>Run fetched by ID</div>
          </div>
          <div style={{ fontSize: '2vw', color: '#0D9488', fontWeight: 700, flexShrink: 0 }}>→</div>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0.7vw', border: '1px solid #E2E8F0', padding: '2vh 2vw', boxShadow: '0 2px 8px rgba(30,58,95,0.05)', textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#64748B', marginBottom: '0.8vh', textTransform: 'uppercase', letterSpacing: '0.05em' }}>2</div>
            <div style={{ fontSize: '1.8vw', fontWeight: 700, color: '#1E3A5F', marginBottom: '0.5vh' }}>Node.js route</div>
            <div style={{ fontSize: '1.4vw', color: '#64748B' }}>Serializes to JSON</div>
          </div>
          <div style={{ fontSize: '2vw', color: '#0D9488', fontWeight: 700, flexShrink: 0 }}>→</div>
          <div style={{ backgroundColor: '#1E3A5F', borderRadius: '0.7vw', padding: '2vh 2vw', textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#0D9488', marginBottom: '0.8vh', textTransform: 'uppercase', letterSpacing: '0.05em' }}>3</div>
            <div style={{ fontSize: '1.8vw', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5vh' }}>report.py</div>
            <div style={{ fontSize: '1.4vw', color: 'rgba(255,255,255,0.6)' }}>JSON via stdin</div>
          </div>
          <div style={{ fontSize: '2vw', color: '#0D9488', fontWeight: 700, flexShrink: 0 }}>→</div>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0.7vw', border: '1px solid #E2E8F0', padding: '2vh 2vw', boxShadow: '0 2px 8px rgba(30,58,95,0.05)', textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#64748B', marginBottom: '0.8vh', textTransform: 'uppercase', letterSpacing: '0.05em' }}>4</div>
            <div style={{ fontSize: '1.8vw', fontWeight: 700, color: '#1E3A5F', marginBottom: '0.5vh' }}>reportlab</div>
            <div style={{ fontSize: '1.4vw', color: '#64748B' }}>PDF bytes to stdout</div>
          </div>
          <div style={{ fontSize: '2vw', color: '#0D9488', fontWeight: 700, flexShrink: 0 }}>→</div>
          <div style={{ backgroundColor: 'rgba(13,148,136,0.08)', borderRadius: '0.7vw', border: '1px solid rgba(13,148,136,0.2)', padding: '2vh 2vw', textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#0D9488', marginBottom: '0.8vh', textTransform: 'uppercase', letterSpacing: '0.05em' }}>5</div>
            <div style={{ fontSize: '1.8vw', fontWeight: 700, color: '#1E3A5F', marginBottom: '0.5vh' }}>Browser</div>
            <div style={{ fontSize: '1.4vw', color: '#64748B' }}>File download</div>
          </div>
        </div>

        {/* Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5vw' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0.8vw', border: '1px solid #E2E8F0', padding: '2.5vh 2.5vw', boxShadow: '0 2px 12px rgba(30,58,95,0.06)', display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
            <div style={{ fontSize: '1.4vw', fontWeight: 700, color: '#1E3A5F' }}>PDF contents</div>
            <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#0D9488', borderRadius: '50%', marginTop: '1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '1.9vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>Header: file, foundry, timestamp</p>
            </div>
            <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#0D9488', borderRadius: '50%', marginTop: '1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '1.9vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>Summary KPI table + violations table (CRITICAL rows red, WARNING rows amber)</p>
            </div>
            <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#0D9488', borderRadius: '50%', marginTop: '1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '1.9vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>Heuristic disclaimer footer on every report</p>
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0.8vw', border: '1px solid #E2E8F0', padding: '2.5vh 2.5vw', boxShadow: '0 2px 12px rgba(30,58,95,0.06)', display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
            <div style={{ fontSize: '1.4vw', fontWeight: 700, color: '#1E3A5F' }}>Design choices</div>
            <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#0D9488', borderRadius: '50%', marginTop: '1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '1.9vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>Endpoint: GET /api/drc/runs/:id/report.pdf</p>
            </div>
            <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#0D9488', borderRadius: '50%', marginTop: '1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '1.9vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>No temp files — stdin/stdout pipe keeps the filesystem clean</p>
            </div>
            <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#0D9488', borderRadius: '50%', marginTop: '1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '1.9vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>Content-Disposition: attachment forces browser download with a clean filename</p>
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
          <span>Slide 7 of 10</span>
        </div>
      </div>
    </div>
  );
}
