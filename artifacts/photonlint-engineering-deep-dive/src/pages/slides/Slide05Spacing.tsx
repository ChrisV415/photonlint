export default function Slide05Spacing() {
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
        <div style={{ fontSize: '1vw', fontWeight: 600, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Check 3&nbsp;&nbsp;·&nbsp;&nbsp;2026</div>
      </div>

      {/* Main: left visual + right details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '3.5vw', alignItems: 'center' }}>

        {/* Left: spacing visualization */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <div style={{ backgroundColor: '#1E3A5F', borderRadius: '0.8vw', padding: '3vh 2.5vw', position: 'relative' }}>
            <div style={{ fontSize: '1vw', fontWeight: 600, color: '#0D9488', marginBottom: '2vh', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Exact polygon distance</div>

            {/* Two polygons */}
            <div style={{ position: 'relative', height: '26vh' }}>
              {/* Polygon A */}
              <div style={{ position: 'absolute', top: '15%', left: '5%', width: '35%', height: '55%', backgroundColor: 'rgba(13,148,136,0.5)', borderRadius: '0.3vw', border: '0.15vw solid #0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.5vw', color: '#FFFFFF', fontWeight: 700 }}>A</span>
              </div>
              {/* Polygon B */}
              <div style={{ position: 'absolute', top: '25%', left: '60%', width: '35%', height: '40%', backgroundColor: 'rgba(13,148,136,0.5)', borderRadius: '0.3vw', border: '0.15vw solid #0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.5vw', color: '#FFFFFF', fontWeight: 700 }}>B</span>
              </div>
              {/* Distance arrow */}
              <div style={{ position: 'absolute', top: '43%', left: '41%', width: '18%', height: '0.2vh', backgroundColor: '#EF4444' }} />
              <div style={{ position: 'absolute', top: '35%', left: '43%', fontSize: '1.2vw', color: '#EF4444', fontWeight: 700, whiteSpace: 'nowrap' }}>gap &lt; min</div>
            </div>
            <div style={{ fontSize: '1.3vw', color: 'rgba(255,255,255,0.5)', marginTop: '1.5vh' }}>shapely polygon.distance() — exact Hausdorff-derived minimum gap</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5vw' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0.7vw', border: '1px solid #E2E8F0', padding: '1.5vh 1.5vw', boxShadow: '0 2px 8px rgba(30,58,95,0.05)', textAlign: 'center' }}>
              <div style={{ fontSize: '1vw', fontWeight: 600, color: '#EF4444', marginBottom: '0.5vh', textTransform: 'uppercase' }}>Naive</div>
              <div style={{ fontSize: '1.5vw', color: '#64748B' }}>Centroid distance — misses narrow shapes</div>
            </div>
            <div style={{ backgroundColor: 'rgba(13,148,136,0.06)', borderRadius: '0.7vw', border: '1px solid rgba(13,148,136,0.2)', padding: '1.5vh 1.5vw', textAlign: 'center' }}>
              <div style={{ fontSize: '1vw', fontWeight: 600, color: '#0D9488', marginBottom: '0.5vh', textTransform: 'uppercase' }}>Ours</div>
              <div style={{ fontSize: '1.5vw', color: '#1E3A5F' }}>Exact polygon.distance() — precise</div>
            </div>
          </div>
        </div>

        {/* Right: details */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1vw', marginBottom: '2vh' }}>
            <h2 style={{ fontSize: '2.4vw', fontWeight: 800, color: '#1E3A5F', margin: 0, lineHeight: 1.2 }}>
              Minimum spacing via exact polygon distance
            </h2>
            <span style={{ fontSize: '1.2vw', fontWeight: 600, color: '#EF4444', backgroundColor: 'rgba(239,68,68,0.08)', padding: '0.4vh 0.9vw', borderRadius: '1vw', whiteSpace: 'nowrap', flexShrink: 0 }}>CRITICAL</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8vh' }}>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#0D9488', borderRadius: '50%', marginTop: '1.1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>Goal: flag any two waveguide polygons closer than the PDK crosstalk threshold</p>
            </div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#0D9488', borderRadius: '50%', marginTop: '1.1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>Implementation: O(n²) pairwise loop — acceptable for single-cell layouts up to ~300 polygons</p>
            </div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#F59E0B', borderRadius: '50%', marginTop: '1.1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>Known limit: full-chip layouts with 10K+ polygons need an R-tree spatial index (shapely STRtree)</p>
            </div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#0D9488', borderRadius: '50%', marginTop: '1.1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>Each violation reports exact measured distance and nearest-centroid location</p>
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
          <span>Slide 5 of 10</span>
        </div>
      </div>
    </div>
  );
}
