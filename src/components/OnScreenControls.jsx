// OnScreenControls.jsx
import { useRef } from "react";

export default function OnScreenControls() {
  const heldKey = useRef(null);

  const pressKey = (key) => {
    if (heldKey.current) return; // avoid re-trigger if already held
    heldKey.current = key;
    window.dispatchEvent(new KeyboardEvent("keydown", { key }));
  };

  const releaseKey = () => {
    if (!heldKey.current) return;
    window.dispatchEvent(new KeyboardEvent("keyup", { key: heldKey.current }));
    heldKey.current = null;
  };

  const btnStyle = {
    width: "50px",
    height: "50px",
    background: "rgba(0,0,0,0.6)",
    color: "white",
    border: "1px solid #aaa",
    borderRadius: "4px",
    fontSize: "18px",
    cursor: "pointer",
    userSelect: "none"
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        
        display: "grid",
        gridTemplateColumns: "50px 50px 50px",
        gridTemplateRows: "50px 50px 0px",
        gap: "5px",
        zIndex: 1000
      }}
    >
      <div />
      <button
        style={btnStyle}
        onMouseDown={() => pressKey("ArrowUp")}
        onMouseUp={releaseKey}
        onMouseLeave={releaseKey}
        onTouchStart={() => pressKey("ArrowUp")}
        onTouchEnd={releaseKey}
      >
        ↑
      </button>
      <div />
      <button
        style={btnStyle}
        onMouseDown={() => pressKey("ArrowLeft")}
        onMouseUp={releaseKey}
        onMouseLeave={releaseKey}
        onTouchStart={() => pressKey("ArrowLeft")}
        onTouchEnd={releaseKey}
      >
        ←
      </button>
      <button
        style={btnStyle}
        onMouseDown={() => pressKey("ArrowDown")}
        onMouseUp={releaseKey}
        onMouseLeave={releaseKey}
        onTouchStart={() => pressKey("ArrowDown")}
        onTouchEnd={releaseKey}
      >
        ↓
      </button>
      <button
        style={btnStyle}
        onMouseDown={() => pressKey("ArrowRight")}
        onMouseUp={releaseKey}
        onMouseLeave={releaseKey}
        onTouchStart={() => pressKey("ArrowRight")}
        onTouchEnd={releaseKey}
      >
        →
      </button>
   
      
      
    </div>
  );
}
