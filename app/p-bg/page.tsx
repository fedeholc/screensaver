/* eslint-disable @next/next/no-img-element */
"use client";
import styles from "./page.module.css";
import FullScreenButton from "../fullScreenButton";
import { useState } from "react";
import { useEffect } from "react";
import imageLinks from "./images.json";
export default function Home() {
  const images = imageLinks.map((link) => {
    return `url(${link})`;
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isPlaying) {
        clearInterval(intervalId);
        return;
      }
       console.log("x");
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    console.log("holi");
    return () => clearInterval(intervalId);
  }, [images.length, isPlaying]);

  const currentImage = images[currentImageIndex];

  //también podría usar useref?

  return (
    <main
      style={{ backgroundImage: `${currentImage}` }}
      className={styles.main}
      onClick={() => {
        if (isPlaying) {
          setIsPlaying(false);
          if (document && document.fullscreenElement) {
            document.exitFullscreen();
          }
        } else {
        }
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        {!false && (
          <div>
            <FullScreenButton />
            <button
              onClick={() => {
                if (isPlaying) {
                  setIsPlaying(false);
                } else {
                  setIsPlaying(true);
                  document.documentElement.requestFullscreen();
                }
              }}
            >
              {!isPlaying ? "Play" : "Stop"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
