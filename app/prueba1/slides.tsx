/* eslint-disable @next/next/no-img-element */
"use client";
import styles from "./slides.module.css";
import { useRef, useState } from "react";
import { useEffect } from "react";
import imageLinks from "./images.json";
import { SlidesAction } from "../types";

export default function Slides({
  play,
  action,
}: {
  play: boolean;
  action: SlidesAction;
}) {
  const images = imageLinks.map((link) => {
    return `url(${link})`;
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  //  const [isPlaying, setIsPlaying] = useState(props.play);
  const [isPlaying, setIsPlaying] = useState(false);

  const intervalId = useRef<NodeJS.Timeout | undefined>();

  useEffect(() => {
    if (action === SlidesAction.PLAY) {
      setIsPlaying(true);
    }

    //if (isPlaying) {
    if (action === SlidesAction.PLAY) {
      intervalId.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000);
    }
    return () => clearInterval(intervalId.current);
  }, [images.length, isPlaying, play, action]);

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
    <div
      style={{ backgroundImage: `${currentImage}` }}
      className={`${styles.slides} ${isPlaying ? styles.playing : ""}`}
    ></div>
  );
}
