export default function Slide09WhyNow() {
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
        <div style={{ fontSize: '1vw', fontWeight: 600, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Timing&nbsp;&nbsp;·&nbsp;&nbsp;2026</div>
      </div>

      {/* Main: left heading + right 5 reasons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '4vw', alignItems: 'start' }}>

        {/* Left */}
        <div style={{ paddingTop: '1vh' }}>
          <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#0D9488', marginBottom: '1.5vh', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Why now</div>
          <h2 style={{ fontSize: '3vw', fontWeight: 800, color: '#1E3A5F', margin: '0 0 2.5vh 0', lineHeight: 1.15, textWrap: 'balance' } as React.CSSProperties}>
            Silicon photonics is hitting an inflection point
          </h2>
          <div style={{ backgroundColor: '#1E3A5F', borderRadius: '0.8vw', padding: '2.5vh 2vw' }}>
            <div style={{ fontSize: '1.3vw', fontWeight: 700, color: '#0D9488', marginBottom: '0.8vh', textTransform: 'uppercase', letterSpacing: '0.08em' }}>First-mover</div>
            <p style={{ fontSize: '1.8vw', color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.5 }}>No direct competitor occupies the cloud-native SiP DRC position</p>
          </div>
        </div>

        {/* Right: 5 numbered reasons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5vh', paddingTop: '1vh' }}>

          <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'flex-start' }}>
            <div style={{ width: '3vw', height: '3vw', backgroundColor: 'rgba(13,148,136,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '1.4vw', fontWeight: 800, color: '#0D9488' }}>1</span>
            </div>
            <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.45 }}>Co-packaged optics demand is forcing hyperscalers to qualify 10× more photonic designs</p>
          </div>

          <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'flex-start' }}>
            <div style={{ width: '3vw', height: '3vw', backgroundColor: 'rgba(13,148,136,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '1.4vw', fontWeight: 800, color: '#0D9488' }}>2</span>
            </div>
            <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.45 }}>Foundry shuttle capacity is expanding — more tape-outs means more DRC failures if unchecked</p>
          </div>

          <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'flex-start' }}>
            <div style={{ width: '3vw', height: '3vw', backgroundColor: 'rgba(13,148,136,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '1.4vw', fontWeight: 800, color: '#0D9488' }}>3</span>
            </div>
            <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.45 }}>AI chip interconnects are shifting from copper to silicon photonics at scale</p>
          </div>

          <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'flex-start' }}>
            <div style={{ width: '3vw', height: '3vw', backgroundColor: 'rgba(13,148,136,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '1.4vw', fontWeight: 800, color: '#0D9488' }}>4</span>
            </div>
            <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.45 }}>First-mover in cloud-native SiP DRC: no direct competitor occupies this position</p>
          </div>

          <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'flex-start' }}>
            <div style={{ width: '3vw', height: '3vw', backgroundColor: 'rgba(13,148,136,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '1.4vw', fontWeight: 800, color: '#0D9488' }}>5</span>
            </div>
            <p style={{ fontSize: '2vw', color: '#475569', margin: 0, lineHeight: 1.45 }}>Regulatory tailwinds: domestic chip manufacturing mandates (CHIPS Act) driving more US foundry runs</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '1.5vh', fontSize: '1vw', color: '#94A3B8', fontWeight: 500 }}>
        <span>PhotonLint, Inc.</span>
        <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'center' }}>
          <span>Confidential &amp; Proprietary</span>
          <span>·</span>
          <span>Slide 9 of 10</span>
        </div>
      </div>
    </div>
  );
}
