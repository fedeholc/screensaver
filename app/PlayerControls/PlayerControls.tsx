"use client";
/* eslint-disable @next/next/no-img-element */
import styles from "./PlayerControls.module.css";
import { PauseIcon, StopIcon, PlayIcon } from "./icons";
import {
  play,
  stop,
  pause,
  setAlbumId,
  selectAlbumId,
  selectStatus,
} from "@/lib/features/player/playerSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export default function PlayerControls({
  setIsMouseOverPlayer: setIsMouseOverPlayer,
  setShowPlayer: setShowPlayer,
}: {
  setIsMouseOverPlayer: React.Dispatch<React.SetStateAction<boolean>>;
  setShowPlayer: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const albumId = useAppSelector(selectAlbumId);
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);

  return (
    <div
      onMouseOver={() => setIsMouseOverPlayer(true)}
      onMouseOut={() => setIsMouseOverPlayer(false)}
      className={`${styles.playerContainer}`}
    >
      {status !== "playing" && (
        <button
          aria-label="play"
          className={`${styles.playerControl}`}
          onClick={() => {
            setShowPlayer(false);
            setIsMouseOverPlayer(false);
            dispatch(play());
          }}
        >
          <PlayIcon className={styles.icon} />
        </button>
      )}

      {status === "playing" && (
        <button
          aria-label="pause"
          className={`${styles.playerControl}`}
          onClick={() => dispatch(pause())}
        >
          <PauseIcon className={styles.icon} />
        </button>
      )}

      <button
        aria-label="stop"
        className={`${styles.playerControl}`}
        onClick={() => dispatch(stop())}
      >
        <StopIcon className={styles.icon} />
      </button>
    </div>
  );
}
