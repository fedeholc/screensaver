/* eslint-disable @next/next/no-img-element */
"use client";
import styles from "./slides.module.css";
import { useRef, useState, useMemo } from "react";
import { useEffect } from "react";
import imageLinks from "./images2.json";
import {
  play,
  stop,
  pause,
  setAlbumId,
  selectAlbumId,
  selectStatus,
} from "@/lib/features/player/playerSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export default function Slides({
  imageList,
}: {
  imageList: { albumId: number; link: string }[];
}) {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);

  //const images = useMemo(() => [...imageLinks], []);
  const images = imageList;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const intervalId = useRef<NodeJS.Timeout | undefined>();

  useEffect(() => {
    if (status === "playing") {
      intervalId.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => {
          return (prevIndex + 1) % images.length;
        });
      }, 5000);
    }
    return () => clearInterval(intervalId.current);
  }, [images.length, status]);

  const currentImage = images[currentImageIndex];

  //también podría usar useref?
  // Preload next 3 images
  useEffect(() => {
    //console.log("currentImage.albumId", currentImage.albumId);
    dispatch(setAlbumId(currentImage.albumId));
    const preloadImages = () => {
      //TODO: ojo, está volviendo a cargar imagenes que ya están cargadas luego de la primera pasada
      for (let i = 1; i <= 3; i++) {
        const nextIndex = (currentImageIndex + i) % images.length;
        const img = new Image();
        img.src = images[nextIndex].link;
      }
    };
    preloadImages();
  }, [currentImageIndex, currentImage.albumId, images, dispatch]);

  return (
    <div
      style={{ backgroundImage: `url(${currentImage.link})` }}
      className={`${styles.slides} ${
        status === "playing" || status === "paused" ? styles.playing : ""
      }`}
    ></div>
  );
}
