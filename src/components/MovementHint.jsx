// MovementHint.jsx
export default function MovementHint() {
  return (
    <div
      className="lg:fixed hide-mobile"
      style={{
        
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",

        display: "flex",
        flexDirection: "column",
        
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
      <div>Move: <strong>W A S D </strong> or <strong style={{fontSize: "1.6rem", fontWeight: "bolder"}}>↑ ↓ ← →</strong></div>
      <div>Exit Artwork: <strong>ESC key</strong></div>
      <div>Drag mouse to look around</div>
      
    </div>
  );
}
