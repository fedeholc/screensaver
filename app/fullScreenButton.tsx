"use client";
import { useState, useEffect } from "react";

const FullScreenButton = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullScreen(true))
        .catch((err) =>
          console.error(
            `Error attempting to enable full-screen mode: ${err.message}`
          )
        );
    } else if (document.exitFullscreen) {
      document
        .exitFullscreen()
        .then(() => setIsFullScreen(false))
        .catch((err) =>
          console.error(
            `Error attempting to disable full-screen mode: ${err.message}`
          )
        );
    }
  };

  return (
    <button onClick={toggleFullScreen}>
      {isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
    </button>
  );
};

export default FullScreenButton;
