export default function Slide08APIDesign() {
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
        <div style={{ fontSize: '1vw', fontWeight: 600, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>API Contract&nbsp;&nbsp;·&nbsp;&nbsp;2026</div>
      </div>

      {/* Main */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '3.5vw', alignItems: 'start' }}>

        {/* Left: codegen flow */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <div>
            <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#0D9488', marginBottom: '0.8vh', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Codegen pipeline</div>
            <h2 style={{ fontSize: '2.2vw', fontWeight: 800, color: '#1E3A5F', margin: 0, lineHeight: 1.2 }}>
              OpenAPI → codegen → typed end-to-end
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
            <div style={{ backgroundColor: '#1E3A5F', borderRadius: '0.7vw', padding: '2vh 2vw' }}>
              <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#0D9488', marginBottom: '0.5vh' }}>openapi.yaml</div>
              <div style={{ fontSize: '1.8vw', color: 'rgba(255,255,255,0.8)' }}>Single source of truth for all API contracts</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ fontSize: '1.8vw', color: '#0D9488', fontWeight: 700 }}>↓ orval codegen</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1vw' }}>
              <div style={{ backgroundColor: 'rgba(13,148,136,0.08)', borderRadius: '0.7vw', border: '1px solid rgba(13,148,136,0.2)', padding: '1.8vh 1.5vw' }}>
                <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#0D9488', marginBottom: '0.5vh' }}>React hooks</div>
                <div style={{ fontSize: '1.5vw', color: '#64748B', lineHeight: 1.4 }}>useListFoundries useRunDrcCheck useGetDrcStats</div>
              </div>
              <div style={{ backgroundColor: 'rgba(13,148,136,0.08)', borderRadius: '0.7vw', border: '1px solid rgba(13,148,136,0.2)', padding: '1.8vh 1.5vw' }}>
                <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#0D9488', marginBottom: '0.5vh' }}>Zod schemas</div>
                <div style={{ fontSize: '1.5vw', color: '#64748B', lineHeight: 1.4 }}>Runtime validation on every response</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0.8vw', border: '1px solid #E2E8F0', padding: '2.5vh 2.5vw', boxShadow: '0 2px 12px rgba(30,58,95,0.06)', display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
            <div style={{ fontSize: '1.4vw', fontWeight: 700, color: '#1E3A5F' }}>Design principles</div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#0D9488', borderRadius: '50%', marginTop: '1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>Single source of truth: lib/api-spec/openapi.yaml drives everything</p>
            </div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#0D9488', borderRadius: '50%', marginTop: '1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>Drizzle schema: drc_runs table — uuid PK, foundryId, violations JSONB, status, checkedAt</p>
            </div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#0D9488', borderRadius: '50%', marginTop: '1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>Stats endpoint aggregates passCount, failCount, common violations from last 200 runs</p>
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(245,158,11,0.06)', borderRadius: '0.8vw', border: '1px solid rgba(245,158,11,0.2)', padding: '2.5vh 2.5vw' }}>
            <div style={{ fontSize: '1.4vw', fontWeight: 700, color: '#92400E', marginBottom: '1.2vh' }}>File upload exception</div>
            <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>multipart/form-data with format: binary breaks Zod in Node.js context — frontend uses raw fetch(FormData) instead of the generated hook</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '1.5vh', fontSize: '1vw', color: '#94A3B8', fontWeight: 500 }}>
        <span>PhotonLint, Inc.</span>
        <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'center' }}>
          <span>Engineering Deep-Dive</span>
          <span>·</span>
          <span>Slide 8 of 10</span>
        </div>
      </div>
    </div>
  );
}
