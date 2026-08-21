export default function Slide04GridWidth() {
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
        <div style={{ fontSize: '1vw', fontWeight: 600, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Checks 1 &amp; 2&nbsp;&nbsp;·&nbsp;&nbsp;2026</div>
      </div>

      {/* Main */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
        <div>
          <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#0D9488', marginBottom: '0.8vh', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Implementation</div>
          <h2 style={{ fontSize: '2.6vw', fontWeight: 800, color: '#1E3A5F', margin: 0, lineHeight: 1.15 }}>
            Grid snap + true minimum width
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5vw', flex: 1 }}>

          {/* Grid snap */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0.8vw', border: '1px solid #E2E8F0', padding: '2.5vh 2.5vw', boxShadow: '0 2px 12px rgba(30,58,95,0.06)', display: 'flex', flexDirection: 'column', gap: '2vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '1.6vw', fontWeight: 700, color: '#1E3A5F' }}>Check 1: Grid Snap</div>
              <span style={{ fontSize: '1.2vw', fontWeight: 600, color: '#F59E0B', backgroundColor: 'rgba(245,158,11,0.1)', padding: '0.3vh 0.8vw', borderRadius: '1vw' }}>WARNING</span>
            </div>

            {/* Grid visual */}
            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '0.5vw', padding: '2vh 2vw', position: 'relative', height: '18vh' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, #E2E8F0 0, #E2E8F0 1px, transparent 1px, transparent 20%), repeating-linear-gradient(90deg, #E2E8F0 0, #E2E8F0 1px, transparent 1px, transparent 20%)', borderRadius: '0.5vw' }} />
              {/* On-grid vertex */}
              <div style={{ position: 'absolute', top: '30%', left: '25%', width: '1vw', height: '1vw', backgroundColor: '#0D9488', borderRadius: '50%', transform: 'translate(-50%,-50%)' }} />
              <div style={{ position: 'absolute', top: '27%', left: '27%', fontSize: '1.1vw', color: '#0D9488', fontWeight: 600 }}>on-grid</div>
              {/* Off-grid vertex */}
              <div style={{ position: 'absolute', top: '62%', left: '65%', width: '1vw', height: '1vw', backgroundColor: '#EF4444', borderRadius: '50%', transform: 'translate(-50%,-50%)' }} />
              <div style={{ position: 'absolute', top: '59%', left: '67%', fontSize: '1.1vw', color: '#EF4444', fontWeight: 600 }}>off-grid!</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1vh' }}>
              <p style={{ fontSize: '1.9vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>For every vertex, check (x mod grid_size) and (y mod grid_size) &gt; 1e-9</p>
              <p style={{ fontSize: '1.9vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>Off-grid coordinates cause lithography errors during fabrication</p>
            </div>
          </div>

          {/* True minimum width */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0.8vw', border: '1px solid #E2E8F0', padding: '2.5vh 2.5vw', boxShadow: '0 2px 12px rgba(30,58,95,0.06)', display: 'flex', flexDirection: 'column', gap: '2vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '1.6vw', fontWeight: 700, color: '#1E3A5F' }}>Check 2: True Width</div>
              <span style={{ fontSize: '1.2vw', fontWeight: 600, color: '#EF4444', backgroundColor: 'rgba(239,68,68,0.08)', padding: '0.3vh 0.8vw', borderRadius: '1vw' }}>CRITICAL</span>
            </div>

            {/* Width visual */}
            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '0.5vw', padding: '2vh 2vw', position: 'relative', height: '18vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Rotated waveguide */}
              <div style={{ width: '18vw', height: '2.5vh', backgroundColor: 'rgba(13,148,136,0.4)', borderRadius: '0.2vw', transform: 'rotate(-30deg)', position: 'absolute' }} />
              {/* Naive bbox */}
              <div style={{ width: '16vw', height: '8vh', border: '0.15vw dashed #94A3B8', borderRadius: '0.2vw', position: 'absolute' }} />
              {/* Labels */}
              <div style={{ position: 'absolute', top: '12%', right: '5%', fontSize: '1.1vw', color: '#94A3B8' }}>naive bbox</div>
              <div style={{ position: 'absolute', bottom: '12%', left: '5%', fontSize: '1.1vw', color: '#0D9488', fontWeight: 600 }}>true width</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1vh' }}>
              <p style={{ fontSize: '1.9vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>True width: shapely minimum_rotated_rectangle → shorter side of minimum enclosing rectangle</p>
              <p style={{ fontSize: '1.9vw', color: '#1E3A5F', margin: 0, lineHeight: 1.4, fontWeight: 500 }}>A 45° waveguide at 0.4 µm true width has a 0.566 µm axis-aligned bbox — naive check passes it when it should fail</p>
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
          <span>Slide 4 of 10</span>
        </div>
      </div>
    </div>
  );
}
