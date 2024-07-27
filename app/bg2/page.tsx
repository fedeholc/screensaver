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

  const [fadeType, setFadeType] = useState("in");

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const intervalId = useRef<NodeJS.Timeout | undefined>();

  useEffect(() => {
    if (isPlaying) {
      intervalId.current = setInterval(() => {
        setFadeType("out");
        setTimeout(() => {
          setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
          setFadeType("in");
        }, 200); // Duración de la animación de salida
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
      className={`${styles.main} ${styles.bgi} ${
        fadeType === "in" ? styles.in : styles.out
      }`}
      onClick={() => {
        if (isPlaying) {
          setIsPlaying(false);
        } else {
          setIsPlaying(true);
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
          </div>
        )}
      </div>
    </main>
  );
}
