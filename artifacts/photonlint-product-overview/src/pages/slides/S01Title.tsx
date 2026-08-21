export default function S01Title() {
  return (
    <div
      style={{
        width: "100vw", height: "100vh", overflow: "hidden",
        backgroundColor: "#FAFBFC", fontFamily: "'Inter', sans-serif",
        padding: "4vh 4vw", boxSizing: "border-box", position: "relative",
        display: "grid", gridTemplateColumns: "3fr 2fr",
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
          <div>PRODUCT OVERVIEW</div>
          <div>2026</div>
        </div>
      </div>

      {/* Left */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: "1.1vw", fontWeight: 600, color: "#0D9488", marginBottom: "1.5vh", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Automated Design Rule Check
        </div>
        <h1 style={{ fontSize: "4.5vw", fontWeight: 800, margin: "0 0 2vh 0", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
          Catch layout defects before tape-out
        </h1>
        <p style={{ fontSize: "1.6vw", fontWeight: 400, color: "#475569", margin: "0 0 4vh 0", lineHeight: 1.5, maxWidth: "36vw" }}>
          Layer-aware DRC for silicon photonics — no EDA license, no installation required.
        </p>
        <div style={{ display: "flex", gap: "2vw" }}>
          <div style={{ background: "#FFFFFF", padding: "2.5vh 2vw", borderRadius: "1vw", border: "1px solid #E2E8F0", flex: 1, boxShadow: "0 0.5vw 1.5vw rgba(30, 58, 95, 0.05)" }}>
            <div style={{ fontSize: "0.85vw", fontWeight: 600, color: "#64748B", marginBottom: "1vh", textTransform: "uppercase", letterSpacing: "0.04em" }}>DRC Runtime</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.8vw" }}>
              <div style={{ fontSize: "3vw", fontWeight: 700, color: "#1E3A5F" }}>&lt;30s</div>
              <div style={{ fontSize: "0.85vw", fontWeight: 600, color: "#0D9488", backgroundColor: "rgba(13, 148, 136, 0.1)", padding: "0.4vh 0.7vw", borderRadius: "2vw" }}>Per run</div>
            </div>
          </div>
          <div style={{ background: "#FFFFFF", padding: "2.5vh 2vw", borderRadius: "1vw", border: "1px solid #E2E8F0", flex: 1, boxShadow: "0 0.5vw 1.5vw rgba(30, 58, 95, 0.05)" }}>
            <div style={{ fontSize: "0.85vw", fontWeight: 600, color: "#64748B", marginBottom: "1vh", textTransform: "uppercase", letterSpacing: "0.04em" }}>Foundry PDKs</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.8vw" }}>
              <div style={{ fontSize: "3vw", fontWeight: 700, color: "#1E3A5F" }}>4</div>
              <div style={{ fontSize: "0.85vw", fontWeight: 600, color: "#0D9488", backgroundColor: "rgba(13, 148, 136, 0.1)", padding: "0.4vh 0.7vw", borderRadius: "2vw" }}>Supported</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right — bar chart */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ background: "#FFFFFF", padding: "3vh 2.5vw", borderRadius: "1vw", border: "1px solid #E2E8F0", width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", boxSizing: "border-box", boxShadow: "0 0.5vw 1.5vw rgba(30, 58, 95, 0.05)" }}>
          <div style={{ fontSize: "1.1vw", fontWeight: 600, color: "#1E3A5F" }}>DRC Checks by Type</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "1.5vw", height: "19vh", borderBottom: "2px solid #E2E8F0", paddingBottom: "1vh" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.8vh" }}>
              <div style={{ width: "100%", height: "8vh", backgroundColor: "rgba(13, 148, 136, 0.2)", borderRadius: "0.4vw 0.4vw 0 0" }} />
              <div style={{ fontSize: "0.75vw", color: "#64748B", fontWeight: 500, textAlign: "center", lineHeight: 1.2 }}>Grid Snap</div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.8vh" }}>
              <div style={{ width: "100%", height: "12vh", backgroundColor: "rgba(13, 148, 136, 0.4)", borderRadius: "0.4vw 0.4vw 0 0" }} />
              <div style={{ fontSize: "0.75vw", color: "#64748B", fontWeight: 500, textAlign: "center", lineHeight: 1.2 }}>Min Width</div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.8vh" }}>
              <div style={{ width: "100%", height: "15vh", backgroundColor: "rgba(13, 148, 136, 0.65)", borderRadius: "0.4vw 0.4vw 0 0" }} />
              <div style={{ fontSize: "0.75vw", color: "#64748B", fontWeight: 500, textAlign: "center", lineHeight: 1.2 }}>Min Spacing</div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.8vh" }}>
              <div style={{ width: "100%", height: "19vh", backgroundColor: "#0D9488", borderRadius: "0.4vw 0.4vw 0 0" }} />
              <div style={{ fontSize: "0.75vw", color: "#64748B", fontWeight: 500, textAlign: "center", lineHeight: 1.2 }}>Bend Radius</div>
            </div>
          </div>
          <div style={{ fontSize: "1vw", color: "#64748B", lineHeight: 1.4 }}>
            Geometry · layer rules · optical constraints
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #E2E8F0", paddingTop: "2vh", fontSize: "0.9vw", color: "#94A3B8", fontWeight: 500 }}>
        <div>PhotonLint, Inc.</div>
        <div style={{ display: "flex", gap: "1vw" }}>
          <span>Product Overview</span>
          <span>•</span>
          <span>2026</span>
        </div>
      </div>
    </div>
  );
}
