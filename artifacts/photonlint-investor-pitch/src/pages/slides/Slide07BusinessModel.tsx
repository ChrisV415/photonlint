export default function Slide07BusinessModel() {
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
        <div style={{ fontSize: '1vw', fontWeight: 600, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Business Model&nbsp;&nbsp;·&nbsp;&nbsp;2026</div>
      </div>

      {/* Main */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5vh' }}>
        <div>
          <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#0D9488', marginBottom: '0.8vh', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Pricing</div>
          <h2 style={{ fontSize: '2.8vw', fontWeight: 800, color: '#1E3A5F', margin: 0, lineHeight: 1.15 }}>
            SaaS with a pay-per-check entry point
          </h2>
        </div>

        {/* 4 pricing tiers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1.5vw', flex: 1 }}>

          {/* Free */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0.8vw', border: '1px solid #E2E8F0', padding: '2.5vh 1.8vw', boxShadow: '0 2px 12px rgba(30,58,95,0.06)', display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
            <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Free</div>
            <div style={{ fontSize: '3vw', fontWeight: 800, color: '#1E3A5F', lineHeight: 1 }}>$0</div>
            <div style={{ fontSize: '1.4vw', color: '#64748B' }}>/ month</div>
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1.5vh', display: 'flex', flexDirection: 'column', gap: '1vh' }}>
              <p style={{ fontSize: '1.8vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>3 DRC checks/month</p>
              <p style={{ fontSize: '1.8vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>Removes friction for trial</p>
            </div>
          </div>

          {/* Pro */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0.8vw', border: '2px solid #0D9488', padding: '2.5vh 1.8vw', boxShadow: '0 4px 20px rgba(13,148,136,0.15)', display: 'flex', flexDirection: 'column', gap: '1.5vh', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-1.5vh', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#0D9488', color: '#FFFFFF', fontSize: '1vw', fontWeight: 700, padding: '0.3vh 1vw', borderRadius: '1vw', whiteSpace: 'nowrap' }}>Most popular</div>
            <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pro</div>
            <div style={{ fontSize: '3vw', fontWeight: 800, color: '#1E3A5F', lineHeight: 1 }}>$299</div>
            <div style={{ fontSize: '1.4vw', color: '#64748B' }}>/ month</div>
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1.5vh', display: 'flex', flexDirection: 'column', gap: '1vh' }}>
              <p style={{ fontSize: '1.8vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>Unlimited checks</p>
              <p style={{ fontSize: '1.8vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>PDF reports + run history</p>
              <p style={{ fontSize: '1.8vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>All 4 foundry PDKs</p>
            </div>
          </div>

          {/* Team */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0.8vw', border: '1px solid #E2E8F0', padding: '2.5vh 1.8vw', boxShadow: '0 2px 12px rgba(30,58,95,0.06)', display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
            <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Team</div>
            <div style={{ fontSize: '3vw', fontWeight: 800, color: '#1E3A5F', lineHeight: 1 }}>$999</div>
            <div style={{ fontSize: '1.4vw', color: '#64748B' }}>/ month</div>
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1.5vh', display: 'flex', flexDirection: 'column', gap: '1vh' }}>
              <p style={{ fontSize: '1.8vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>Shared workspace</p>
              <p style={{ fontSize: '1.8vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>API access</p>
              <p style={{ fontSize: '1.8vw', color: '#475569', margin: 0, lineHeight: 1.4 }}>Custom foundry rules</p>
            </div>
          </div>

          {/* Enterprise */}
          <div style={{ backgroundColor: '#1E3A5F', borderRadius: '0.8vw', border: '1px solid #1E3A5F', padding: '2.5vh 1.8vw', boxShadow: '0 2px 12px rgba(30,58,95,0.12)', display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
            <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Enterprise</div>
            <div style={{ fontSize: '3vw', fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>Custom</div>
            <div style={{ fontSize: '1.4vw', color: 'rgba(255,255,255,0.5)' }}>pricing</div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5vh', display: 'flex', flexDirection: 'column', gap: '1vh' }}>
              <p style={{ fontSize: '1.8vw', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.4 }}>Foundry-verified rules</p>
              <p style={{ fontSize: '1.8vw', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.4 }}>SSO + SLA</p>
              <p style={{ fontSize: '1.8vw', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.4 }}>On-prem option</p>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <div style={{ fontSize: '1.5vw', color: '#64748B', fontWeight: 400 }}>
          Land with free tier, expand as teams scale tape-out frequency
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '1.5vh', fontSize: '1vw', color: '#94A3B8', fontWeight: 500 }}>
        <span>PhotonLint, Inc.</span>
        <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'center' }}>
          <span>Confidential &amp; Proprietary</span>
          <span>·</span>
          <span>Slide 7 of 10</span>
        </div>
      </div>
    </div>
  );
}
