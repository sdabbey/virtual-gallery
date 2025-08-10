// MovementHint.jsx
export default function MovementHint() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "5%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: ".5rem",
        background: "rgba(0,0,0,0.6)",
        color: "white",
        padding: "14px",
        borderRadius: "6px",
        fontSize: "14px",
        fontFamily: "sans-serif",
        
        pointerEvents: "none", // don't block clicks
        zIndex: 1000
      }}
    >
      <div>Move: <strong>W A S D</strong> or <strong>↑ ↓ ← →</strong></div>
      <div>Drag mouse to look around</div>
    </div>
  );
}
