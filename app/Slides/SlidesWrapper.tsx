"use client";
//eslint-disable @next/next/no-img-element
import styles from "@/app/page.module.css";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import Slides from "@/app/Slides/Slides";
import { play, selectStatus } from "@/lib/features/player/playerSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import PlayerControls from "@/app/PlayerControls/PlayerControls";
import { AppContext } from "@/app/AppContext";
import AlbumsPlayList from "@/app/AlbumsPlaylist";
import { AppContextProvider } from "@/app/AppContext";
import PruebaSearch2 from "@/app/PruebaSearch";

export default function SlidesWrapper({
  imagesPlaylist,
}: {
  imagesPlaylist: { albumId: number; link: string }[];
}) {
  const [showPlayer, setShowPlayer] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isMouseOverPlayer, setIsMouseOverPlayer] = useState(false);

  const status = useAppSelector(selectStatus);

  let statusStyle = {
    paused: styles.playing,
    playing: styles.playing,
    stopped: "",
  };

  function handleMouseMove() {
    if ((status === "playing" || status === "paused") && !showPlayer) {
      setShowPlayer(true);
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (status !== "stopped") {
      timeoutRef.current = setTimeout(() => {
        if (!isMouseOverPlayer) {
          setShowPlayer(false);
        }
      }, 1000);
    }
  }
  return (
    <div
      onMouseMove={handleMouseMove}
      className={`${styles.slidesWrapper} ${statusStyle[status]}`}
    >
      {imagesPlaylist.length > 0 && (
        <Slides imageList={imagesPlaylist}></Slides>
      )}
      <div className={`${styles.playerControlsWrapper}`}>
        {showPlayer && status !== "stopped" && (
          <PlayerControls
            key={1}
            setIsMouseOverPlayer={setIsMouseOverPlayer}
            setShowPlayer={setShowPlayer}
          />
        )}
      </div>
    </div>
  );
}
