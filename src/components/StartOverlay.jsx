import cover from "../assets/cover.png";
import React from "react";


export default function StartOverlay({ title, artist, curationDate, onClose }) {
  return (
    <div
      className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-80 text-black flex flex-col items-center justify-center p-6"
    >
        <div className="start-card">
            <button className="close-overlay-btn" onClick={onClose}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <img src={cover} alt="Cover"  />
            <div className="start-card-text">
                <h3 className="artist">{artist}</h3>
                <h4 className="gallery-name">{title}</h4>
                <p className="curation-date">{curationDate}</p>
            </div>
            <button className="exhibition-btn" onClick={onClose}>
                Enter Exhibition
            </button>
        </div>
        
     
    </div>
  );
}
