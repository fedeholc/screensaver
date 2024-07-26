/* eslint-disable @next/next/no-img-element */
"use client";
import styles from "./page.module.css";
import FullScreenButton from "../fullScreenButton";
import img1 from "../../public/c.jpg";
import { useState } from "react";
import { useEffect } from "react";

export default function Home() {
  //let bg = { backgroundImage: `url(${img1.src})` };

  const images = [
    `url(${img1.src})`,
    'url("/b.jpg")',
    `url('https://content.magnumphotos.com/wp-content/uploads/2016/04/cortex/par115311-overlay.jpg')`,
    // Agrega más URLs de imágenes según sea necesario
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  let bg = {
    backgroundImage: `url('https://content.magnumphotos.com/wp-content/uploads/2016/04/cortex/par115311-overlay.jpg')`,
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isPlaying) return;
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);
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
        {!isPlaying && (
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
