const base = import.meta.env.BASE_URL;

export default function S03Solution() {
  return (
    <div
      style={{
        width: "100vw", height: "100vh", overflow: "hidden",
        backgroundColor: "#FAFBFC", fontFamily: "'Inter', sans-serif",
        padding: "4vh 4vw", boxSizing: "border-box", position: "relative",
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "auto 1fr auto", gap: "3vh 4vw", color: "#1E3A5F",
      }}
    >
      {/* Header */}
      <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #E2E8F0", paddingBottom: "2vh" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1vw" }}>
          <div style={{ width: "2vw", height: "2vw", backgroundColor: "#0D9488", borderRadius: "0.4vw" }} />
          <div style={{ fontSize: "1.2vw", fontWeight: 700, letterSpacing: "0.02em" }}>PhotonLint</div>
        </div>
        <div style={{ display: "flex", gap: "2vw", fontSize: "1vw", fontWeight: 500, color: "#64748B" }}>
          <div>THE SOLUTION</div>
          <div>2026</div>
        </div>
      </div>

      {/* Left */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: "1.1vw", fontWeight: 600, color: "#0D9488", marginBottom: "1.5vh", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Automated Verification
        </div>
        <h2 style={{ fontSize: "3.5vw", fontWeight: 800, margin: "0 0 2vh 0", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
          PhotonLint catches violations before you tape out
        </h2>
        <p style={{ fontSize: "1.5vw", fontWeight: 400, color: "#475569", margin: "0 0 3.5vh 0", lineHeight: 1.5 }}>
          Upload a GDSII layout, select your foundry PDK, and get a full layer-aware compliance report in seconds — no EDA license required.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5vh" }}>
          <div style={{ display: "flex", gap: "1.5vw", alignItems: "center", background: "#FFFFFF", padding: "1.5vh 1.8vw", borderRadius: "0.8vw", border: "1px solid #E2E8F0", boxShadow: "0 0.5vw 1.5vw rgba(30, 58, 95, 0.05)" }}>
            <div style={{ width: "0.8vw", height: "0.8vw", minWidth: "0.8vw", backgroundColor: "#0D9488", borderRadius: "50%" }} />
            <div style={{ fontSize: "1.4vw", fontWeight: 500, color: "#1E3A5F" }}>Layer-aware — checks each PDK layer against foundry specs</div>
          </div>
          <div style={{ display: "flex", gap: "1.5vw", alignItems: "center", background: "#FFFFFF", padding: "1.5vh 1.8vw", borderRadius: "0.8vw", border: "1px solid #E2E8F0", boxShadow: "0 0.5vw 1.5vw rgba(30, 58, 95, 0.05)" }}>
            <div style={{ width: "0.8vw", height: "0.8vw", minWidth: "0.8vw", backgroundColor: "#0D9488", borderRadius: "50%" }} />
            <div style={{ fontSize: "1.4vw", fontWeight: 500, color: "#1E3A5F" }}>Results in under 30 seconds — no waiting, no queues</div>
          </div>
          <div style={{ display: "flex", gap: "1.5vw", alignItems: "center", background: "#FFFFFF", padding: "1.5vh 1.8vw", borderRadius: "0.8vw", border: "1px solid #E2E8F0", boxShadow: "0 0.5vw 1.5vw rgba(30, 58, 95, 0.05)" }}>
            <div style={{ width: "0.8vw", height: "0.8vw", minWidth: "0.8vw", backgroundColor: "#0D9488", borderRadius: "50%" }} />
            <div style={{ fontSize: "1.4vw", fontWeight: 500, color: "#1E3A5F" }}>PDF report ready for foundry submission</div>
          </div>
        </div>
      </div>

      {/* Right — image */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ background: "#FFFFFF", borderRadius: "1vw", border: "1px solid #E2E8F0", width: "100%", height: "100%", overflow: "hidden", boxShadow: "0 0.5vw 1.5vw rgba(30, 58, 95, 0.05)", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#F1F5F9" }}>
          <img
            src={`${base}slide3-drc-split.png`}
            crossOrigin="anonymous"
            alt="GDS layout alongside DRC violation report"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>

      {/* Footer */}
      <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #E2E8F0", paddingTop: "2vh", fontSize: "0.9vw", color: "#94A3B8", fontWeight: 500 }}>
        <div>PhotonLint, Inc.</div>
        <div style={{ display: "flex", gap: "1vw" }}>
          <span>Product Overview</span>
          <span>•</span>
          <span>Page 3</span>
        </div>
      </div>
    </div>
  );
}
