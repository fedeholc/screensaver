/* eslint-disable @next/next/no-img-element */
"use client";
import styles from "./page.module.css";
import FullScreenButton from "../fullScreenButton";
import { flushSync } from "react-dom";
import { useRef, useState } from "react";
import { useEffect } from "react";
import imageLinks from "./images.json";
export default function Home() {
  const [isThumbnail, setIsThumbnail] = useState(true);
  const handleMove = () => {
    document.startViewTransition(() => {
      flushSync(() => {
        setIsThumbnail((prev) => !prev);
      });
    });
  };

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
      //todo: ojo, está volviendo a cargar imagenes que ya están cargadas luego de la primera pasada
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
          /* if (document && document.fullscreenElement) {
            document.exitFullscreen();
          } */
        } else {
          setIsPlaying(true);
        }
      }}
    >
      {isThumbnail && (
        <h1 className="cat-img thumbnail">
          <button>holi</button>
        </h1>
      )}

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
            {/*  <FullScreenButton /> */}
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
            <button onClick={handleMove}>Move</button>
          </div>
        )}

        {!isThumbnail && (
          <div className="cat-details">
            <h1 className="cat-img detailed-img">
              <button>holi</button>
            </h1>
          </div>
        )}
      </div>
    </main>
  );
}
