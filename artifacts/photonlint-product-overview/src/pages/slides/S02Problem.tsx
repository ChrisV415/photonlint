export default function S02Problem() {
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
          <div>THE PROBLEM</div>
          <div>2026</div>
        </div>
      </div>

      {/* Left */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: "1.1vw", fontWeight: 600, color: "#0D9488", marginBottom: "1.5vh", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          The Stakes
        </div>
        <h2 style={{ fontSize: "3.5vw", fontWeight: 800, margin: "0 0 3vh 0", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
          Tape-out failures are catastrophically expensive
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5vh" }}>
          <div style={{ display: "flex", gap: "1.5vw", alignItems: "flex-start", background: "#FFFFFF", padding: "1.8vh 1.8vw", borderRadius: "0.8vw", border: "1px solid #E2E8F0", boxShadow: "0 0.5vw 1.5vw rgba(30, 58, 95, 0.05)" }}>
            <div style={{ fontSize: "1.2vw", fontWeight: 700, color: "#0D9488", backgroundColor: "rgba(13, 148, 136, 0.1)", width: "2.8vw", height: "2.8vw", minWidth: "2.8vw", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>1</div>
            <div style={{ fontSize: "1.5vw", fontWeight: 400, color: "#475569", lineHeight: 1.4 }}>A single silicon photonics tape-out costs $500K and takes 4+ months</div>
          </div>
          <div style={{ display: "flex", gap: "1.5vw", alignItems: "flex-start", background: "#FFFFFF", padding: "1.8vh 1.8vw", borderRadius: "0.8vw", border: "1px solid #E2E8F0", boxShadow: "0 0.5vw 1.5vw rgba(30, 58, 95, 0.05)" }}>
            <div style={{ fontSize: "1.2vw", fontWeight: 700, color: "#0D9488", backgroundColor: "rgba(13, 148, 136, 0.1)", width: "2.8vw", height: "2.8vw", minWidth: "2.8vw", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>2</div>
            <div style={{ fontSize: "1.5vw", fontWeight: 400, color: "#475569", lineHeight: 1.4 }}>Manual layout review is error-prone and takes days</div>
          </div>
          <div style={{ display: "flex", gap: "1.5vw", alignItems: "flex-start", background: "#FFFFFF", padding: "1.8vh 1.8vw", borderRadius: "0.8vw", border: "1px solid #E2E8F0", boxShadow: "0 0.5vw 1.5vw rgba(30, 58, 95, 0.05)" }}>
            <div style={{ fontSize: "1.2vw", fontWeight: 700, color: "#0D9488", backgroundColor: "rgba(13, 148, 136, 0.1)", width: "2.8vw", height: "2.8vw", minWidth: "2.8vw", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>3</div>
            <div style={{ fontSize: "1.5vw", fontWeight: 400, color: "#475569", lineHeight: 1.4 }}>Proprietary EDA tools cost $100K+/seat and require specialist training</div>
          </div>
          <div style={{ display: "flex", gap: "1.5vw", alignItems: "flex-start", background: "#FFFFFF", padding: "1.8vh 1.8vw", borderRadius: "0.8vw", border: "1px solid #E2E8F0", boxShadow: "0 0.5vw 1.5vw rgba(30, 58, 95, 0.05)" }}>
            <div style={{ fontSize: "1.2vw", fontWeight: 700, color: "#0D9488", backgroundColor: "rgba(13, 148, 136, 0.1)", width: "2.8vw", height: "2.8vw", minWidth: "2.8vw", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>4</div>
            <div style={{ fontSize: "1.5vw", fontWeight: 400, color: "#475569", lineHeight: 1.4 }}>One missed spacing violation can render an entire wafer useless</div>
          </div>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "2vh" }}>
        <div style={{ background: "#FFFFFF", padding: "4vh 3vw", borderRadius: "1vw", border: "1px solid #E2E8F0", boxShadow: "0 0.5vw 1.5vw rgba(30, 58, 95, 0.05)", textAlign: "center" }}>
          <div style={{ fontSize: "1vw", fontWeight: 600, color: "#64748B", marginBottom: "1.5vh", textTransform: "uppercase", letterSpacing: "0.05em" }}>Cost per tape-out run</div>
          <div style={{ fontSize: "7vw", fontWeight: 800, color: "#1E3A5F", lineHeight: 1, letterSpacing: "-0.03em" }}>$500K</div>
          <div style={{ fontSize: "1.3vw", color: "#64748B", marginTop: "1.5vh", lineHeight: 1.4 }}>Plus 4+ months of fabrication time — before you know if the design works</div>
        </div>
        <div style={{ background: "#FFFFFF", padding: "3vh 3vw", borderRadius: "1vw", border: "1px solid #E2E8F0", boxShadow: "0 0.5vw 1.5vw rgba(30, 58, 95, 0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "1vw", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.8vh" }}>EDA license cost</div>
              <div style={{ fontSize: "2.5vw", fontWeight: 700, color: "#1E3A5F" }}>$100K+</div>
              <div style={{ fontSize: "1.1vw", color: "#64748B", marginTop: "0.5vh" }}>per seat, per year</div>
            </div>
            <div style={{ width: "1px", backgroundColor: "#E2E8F0", alignSelf: "stretch" }} />
            <div>
              <div style={{ fontSize: "1vw", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.8vh" }}>Review time</div>
              <div style={{ fontSize: "2.5vw", fontWeight: 700, color: "#1E3A5F" }}>Days</div>
              <div style={{ fontSize: "1.1vw", color: "#64748B", marginTop: "0.5vh" }}>of manual checking</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #E2E8F0", paddingTop: "2vh", fontSize: "0.9vw", color: "#94A3B8", fontWeight: 500 }}>
        <div>PhotonLint, Inc.</div>
        <div style={{ display: "flex", gap: "1vw" }}>
          <span>Product Overview</span>
          <span>•</span>
          <span>Page 2</span>
        </div>
      </div>
    </div>
  );
}
