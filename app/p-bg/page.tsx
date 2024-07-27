/* eslint-disable @next/next/no-img-element */
"use client";
import styles from "./page.module.css";
import FullScreenButton from "../fullScreenButton";
import { useRef, useState } from "react";
import { useEffect } from "react";
import imageLinks from "./images.json";
export default function Home() {
  const images = imageLinks.map((link) => {
    return `url(${link})`;
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const intervalId = useRef<NodeJS.Timeout | undefined>();

  useEffect(() => {
    if (isPlaying) {
      intervalId.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000);
    }
    return () => clearInterval(intervalId.current);
  }, [images.length, isPlaying]);

  const currentImage = images[currentImageIndex];

  //también podría usar useref?
  // Preload next 3 images
  useEffect(() => {
    const preloadImages = () => {
      for (let i = 1; i <= 3; i++) {
        const nextIndex = (currentImageIndex + i) % images.length;
        const img = new Image();
        img.src = images[nextIndex].replace("url(", "").replace(")", "");
      }
    };
    preloadImages();
  }, [currentImageIndex, images]);
  
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
