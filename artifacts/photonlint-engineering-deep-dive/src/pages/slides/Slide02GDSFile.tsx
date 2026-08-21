export default function Slide02GDSFile() {
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
        <div style={{ fontSize: '1vw', fontWeight: 600, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>GDS Format&nbsp;&nbsp;·&nbsp;&nbsp;2026</div>
      </div>

      {/* Main */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '4vw', alignItems: 'center' }}>

        {/* Left: GDS visual mockup */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <div style={{ backgroundColor: '#1E3A5F', borderRadius: '0.8vw', padding: '2.5vh 2.5vw', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: '1vw', fontWeight: 600, color: '#0D9488', marginBottom: '2vh', textTransform: 'uppercase', letterSpacing: '0.08em' }}>GDS Layout (Layer 1)</div>
            {/* Polygon visualization */}
            <div style={{ position: 'relative', height: '28vh', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '0.4vw' }}>
              {/* Waveguide 1 - horizontal */}
              <div style={{ position: 'absolute', top: '30%', left: '5%', width: '40%', height: '12%', backgroundColor: 'rgba(13,148,136,0.7)', borderRadius: '0.2vw' }} />
              {/* Waveguide 2 - angled */}
              <div style={{ position: 'absolute', top: '22%', left: '47%', width: '28%', height: '10%', backgroundColor: 'rgba(13,148,136,0.5)', borderRadius: '0.2vw', transform: 'rotate(-18deg)', transformOrigin: 'left center' }} />
              {/* Waveguide 3 - horizontal */}
              <div style={{ position: 'absolute', top: '55%', left: '50%', width: '42%', height: '12%', backgroundColor: 'rgba(13,148,136,0.7)', borderRadius: '0.2vw' }} />
              {/* Ring resonator */}
              <div style={{ position: 'absolute', top: '15%', left: '20%', width: '10vw', height: '10vw', border: '0.4vw solid rgba(13,148,136,0.6)', borderRadius: '50%', maxWidth: '12%', maxHeight: '42%' }} />
              {/* Grid lines */}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 10%, rgba(255,255,255,0.03) 10%, rgba(255,255,255,0.03) 10.5%), repeating-linear-gradient(90deg, transparent, transparent 10%, rgba(255,255,255,0.03) 10%, rgba(255,255,255,0.03) 10.5%)' }} />
            </div>
            <div style={{ marginTop: '1.5vh', fontSize: '1.2vw', color: 'rgba(255,255,255,0.45)' }}>Binary GDSII — polygons on named layers</div>
          </div>

          <div style={{ display: 'flex', gap: '1.5vw' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0.7vw', border: '1px solid #E2E8F0', padding: '1.5vh 1.5vw', flex: 1, boxShadow: '0 2px 8px rgba(30,58,95,0.05)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.4vw', fontWeight: 800, color: '#0D9488' }}>nm</div>
              <div style={{ fontSize: '1.3vw', color: '#64748B', marginTop: '0.3vh' }}>sub-micron scale</div>
            </div>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0.7vw', border: '1px solid #E2E8F0', padding: '1.5vh 1.5vw', flex: 1, boxShadow: '0 2px 8px rgba(30,58,95,0.05)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.4vw', fontWeight: 800, color: '#1E3A5F' }}>1000s</div>
              <div style={{ fontSize: '1.3vw', color: '#64748B', marginTop: '0.3vh' }}>polygons per cell</div>
            </div>
          </div>
        </div>

        {/* Right: bullets */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '2.5vw', fontWeight: 800, color: '#1E3A5F', margin: '0 0 2.5vh 0', lineHeight: 1.2, textWrap: 'balance' } as React.CSSProperties}>
            What a GDS file is and why checking it is hard
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8vh' }}>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#0D9488', borderRadius: '50%', marginTop: '1.1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.45 }}>GDSII: binary format for IC layouts — stores polygons on named layers at micron-scale coordinates</p>
            </div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#0D9488', borderRadius: '50%', marginTop: '1.1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.45 }}>A waveguide is a polygon on Layer 1; a contact is a polygon on a different layer</p>
            </div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#0D9488', borderRadius: '50%', marginTop: '1.1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.45 }}>DRC rules are geometric: min width across any polygon, min gap between any two polygons</p>
            </div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#EF4444', borderRadius: '50%', marginTop: '1.1vh', flexShrink: 0 }} />
              <p style={{ fontSize: '2vw', color: '#1E3A5F', margin: 0, lineHeight: 1.45, fontWeight: 500 }}>Naive checks (axis-aligned bounding boxes) give wrong answers on rotated geometry</p>
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
          <span>Slide 2 of 10</span>
        </div>
      </div>
    </div>
  );
}
