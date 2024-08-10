"use client";
/* eslint-disable @next/next/no-img-element */
import styles from "./PlayerControls.module.css";
import { PauseIcon, StopIcon, PlayIcon } from "@/app/PlayerControls/icons";
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
  setIsMouseOver: setIsMouseOver,
  setShowPlayer: setShowPlayer,
}: {
  setIsMouseOver: React.Dispatch<React.SetStateAction<boolean>>;
  setShowPlayer: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const albumId = useAppSelector(selectAlbumId);
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);

  return (
    <div
      onMouseOver={() => setIsMouseOver(true)}
      onMouseOut={() => setIsMouseOver(false)}
      className={`${styles.playerContainer}`}
    >
      {status !== "playing" && (
        <button
          /* id="buttonPlay" */
          className={`${styles.playerControl}`}
          onClick={() => {
            setShowPlayer(false);
            setIsMouseOver(false);
            dispatch(play());
          }}
        >
          <PlayIcon className={styles.icon} />
        </button>
      )}

      {status === "playing" && (
        <button
          /*           id="buttonPause"
           */ className={`${styles.playerControl}`}
          onClick={() => dispatch(pause())}
        >
          <PauseIcon className={styles.icon} />
        </button>
      )}

      <button
        /*         id="buttonStop"
         */ className={`${styles.playerControl}`}
        onClick={() => dispatch(stop())}
      >
        <StopIcon className={styles.icon} />
        {/*       <h1>
          {status}
          {albumId}
        </h1> */}
      </button>
    </div>
  );
}
