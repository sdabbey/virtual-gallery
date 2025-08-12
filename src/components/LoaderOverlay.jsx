import React from "react";
import { useProgress } from "@react-three/drei";

export default function LoaderOverlay() {
  const { progress } = useProgress();

  return (
    <>
      {/* Local style tag to define keyframes safely */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <div style={styles.overlay}>
        <div style={styles.spinner}></div>
        <p style={styles.text}>{Math.floor(progress)}%</p>
        <p style={styles.text}>Loading artworks...</p>
      </div>
    </>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0, 0, 0, 0.9)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    color: "#fff",
    transition: "opacity 0.5s ease",
    gap: "1rem"
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid rgba(255,255,255,0.2)",
    borderTop: "5px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  text: {
    
    fontSize: "1rem",
    letterSpacing: "1px"
  }
};
