export default function Slide06BendRadius() {
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
        <div style={{ fontSize: '1vw', fontWeight: 600, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Check 4&nbsp;&nbsp;·&nbsp;&nbsp;2026</div>
      </div>

      {/* Main */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3vw' }}>

        {/* Left: what we do */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1vw', marginBottom: '1vh' }}>
              <h2 style={{ fontSize: '2.2vw', fontWeight: 800, color: '#1E3A5F', margin: 0, lineHeight: 1.2 }}>
                Bend radius heuristic
              </h2>
              <span style={{ fontSize: '1.2vw', fontWeight: 600, color: '#F59E0B', backgroundColor: 'rgba(245,158,11,0.1)', padding: '0.3vh 0.8vw', borderRadius: '1vw', whiteSpace: 'nowrap' }}>WARNING</span>
            </div>
            <div style={{ fontSize: '1.3vw', fontWeight: 600, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Honest about its limits</div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0.8vw', border: '1px solid #E2E8F0', padding: '2.5vh 2.5vw', boxShadow: '0 2px 12px rgba(30,58,95,0.06)', display: 'flex', flexDirection: 'column', gap: '1.8vh' }}>
            <div style={{ fontSize: '1.4vw', fontWeight: 700, color: '#1E3A5F', marginBottom: '0.5vh' }}>The heuristic</div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#0D9488', borderRadius: '50%', marginTop: '1.1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>True bend-radius check requires arc reconstruction from discretized polygon vertices — out of MVP scope</p>
            </div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#0D9488', borderRadius: '50%', marginTop: '1.1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>Heuristic: for each vertex, compute turn angle between adjacent edge vectors; flag if angle &gt; 25° and shorter edge &lt; min_bend_radius</p>
            </div>
          </div>
        </div>

        {/* Right: known limits */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <div style={{ backgroundColor: 'rgba(245,158,11,0.06)', borderRadius: '0.8vw', border: '1px solid rgba(245,158,11,0.2)', padding: '2.5vh 2.5vw' }}>
            <div style={{ fontSize: '1.4vw', fontWeight: 700, color: '#92400E', marginBottom: '2vh', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Known false positives</div>
            <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.45 }}>Deliberate right-angle couplers trigger the heuristic — they are legal in the PDK</p>
          </div>

          <div style={{ backgroundColor: 'rgba(239,68,68,0.05)', borderRadius: '0.8vw', border: '1px solid rgba(239,68,68,0.15)', padding: '2.5vh 2.5vw' }}>
            <div style={{ fontSize: '1.4vw', fontWeight: 700, color: '#991B1B', marginBottom: '2vh', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Known false negatives</div>
            <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.45 }}>Smooth curves discretized with long segments won't flag — the turn angle stays below threshold</p>
          </div>

          <div style={{ backgroundColor: '#1E3A5F', borderRadius: '0.8vw', padding: '2vh 2.5vw' }}>
            <div style={{ fontSize: '1.4vw', fontWeight: 700, color: '#0D9488', marginBottom: '0.8vh' }}>Transparency in the UI</div>
            <p style={{ fontSize: '1.8vw', color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.4 }}>Labeled WARNING throughout the UI and PDF — footer note in every report makes the limitation explicit</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '1.5vh', fontSize: '1vw', color: '#94A3B8', fontWeight: 500 }}>
        <span>PhotonLint, Inc.</span>
        <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'center' }}>
          <span>Engineering Deep-Dive</span>
          <span>·</span>
          <span>Slide 6 of 10</span>
        </div>
      </div>
    </div>
  );
}
