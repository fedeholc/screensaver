/* eslint-disable @next/next/no-img-element */
"use client";
import styles from "./prueba1.module.css";
import FullScreenButton from "../fullScreenButton";
import { useRef, useState } from "react";
import { useEffect } from "react";
import imageLinks from "./images.json";

export default function Prueba1(props: { play: boolean }) {
  const images = imageLinks.map((link) => {
    return `url(${link})`;
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(props.play);

  //TODO: ojo, por algún motivo isplaying no toma el valor de props.play, revisar 


  const intervalId = useRef<NodeJS.Timeout | undefined>();

  useEffect(() => {
    console.log("holi", isPlaying, props.play);
    //if (isPlaying) {
    if (props.play) {
      intervalId.current = setInterval(() => {
        console.log("entre", props.play);
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000);
    }
    return () => clearInterval(intervalId.current);
  }, [images.length, isPlaying, props.play]);

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
      <h3>playing:</h3> {isPlaying}
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
