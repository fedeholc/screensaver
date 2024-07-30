"use client";
/* eslint-disable @next/next/no-img-element */
import styles from "./page.module.css";
import FullScreenButton from "./fullScreenButton";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import Slides from "./prueba1/slides";
import { SlidesAction } from "./types";

//TODO: probar cascade layers en lugar de z-index

type AlbumType = {
  id: number;
  name: string;
  // otros campos del álbum si existen
};

const PauseIcon = (
  <svg
    className={styles.icon}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="square"
    strokeLinejoin="miter"
  >
    <rect x="14" y="4" width="4" height="16" rx="0" />
    <rect x="6" y="4" width="4" height="16" rx="0" />
  </svg>
);

export default function Home() {
  const albums: AlbumType[] = [
    { id: 1, name: "Ansel Adams" },
    { id: 2, name: "Henri Cartier-Bresson" },
    { id: 3, name: "Salvador Dalí" },
    { id: 4, name: "Man Ray" },
    { id: 5, name: "Dorothea Lange" },
    { id: 6, name: "Irving Penn" },
    { id: 7, name: "Richard Avedon" },
    { id: 8, name: "Diane Arbus" },
    { id: 9, name: "Helmut Newton" },
    { id: 10, name: "Annie Leibovitz" },
    { id: 11, name: "Steve McCurry" },
    { id: 12, name: "David LaChapelle" },
    { id: 13, name: "Nick Knight" },
    { id: 14, name: "Terry Richardson" },
    { id: 15, name: "Mario Testino" },
    { id: 16, name: "Peter Lindbergh" },
    { id: 17, name: "Patrick Demarchelier" },
    { id: 18, name: "Ellen von Unwerth" },
    { id: 19, name: "Bruce Weber" },
    { id: 20, name: "Herb Ritts" },
    { id: 21, name: "David Bailey" },
    { id: 22, name: "Cecil Beaton" },
    { id: 23, name: "Avedon" },
    { id: 24, name: "Cindy Sherman" },
    { id: 25, name: "Nan Goldin" },
    { id: 26, name: "Sally Mann" },
    { id: 27, name: "Carrie Mae Weems" },
    { id: 28, name: "Leni Riefenstahl" },
    { id: 29, name: "Walker Evans" },
    { id: 30, name: "Edward Weston" },
    { id: 31, name: "Paul Strand" },
    { id: 32, name: "Alfred Stieglitz" },
    { id: 33, name: "Georgia O'Keeffe" },
    { id: 34, name: "Imogen Cunningham" },
    { id: 35, name: "Barbra Kruger" },
    { id: 36, name: "Cindy Sherman" },
    { id: 37, name: "Sophie Calle" },
    { id: 38, name: "Shirin Neshat" },
    { id: 39, name: "Marina Abramović" },
    { id: 40, name: "Yayoi Kusama" },
    { id: 41, name: "Ai Weiwei" },
    { id: 42, name: "Anish Kapoor" },
    { id: 43, name: "Jeff Koons" },
    { id: 44, name: "Damien Hirst" },
    { id: 45, name: "Takashi Murakami" },
    { id: 46, name: "Banksy" },
    { id: 47, name: "Olafur Eliasson" },
    { id: 48, name: "Helen Levitt" },
    { id: 49, name: "Cai Guo-Qiang" },
    { id: 50, name: "Zhang Huan" },
  ];

  const [showPlayer, setShowPlayer] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [filteredAlbums, setFilteredAlbums] = useState(albums);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [playlist, setPlayList]: [
    { id: number; name: string }[],
    Dispatch<SetStateAction<{ id: number; name: string }[]>>
  ] = useState<{ id: number; name: string }[]>([]);

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const search = event.target.value;
    let filtered = albums.filter((photographer) =>
      photographer.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredAlbums(filtered);
  }

  function handleAdd(
    event: React.MouseEvent<HTMLButtonElement>,
    album: AlbumType
  ) {
    console.log(event);
    console.log(album);
    setPlayList((prev) => [...prev, album]);
  }

  function handlePlay() {
    setIsPlaying(!isPlaying);
  }

  //TODO: ver si los botones de pause y stop quedan  dentro del slideswrapper o fuera. Lo que hay que probar es que al mover el mouse se hagan visibles por un cierto tiempo y sino se vuelven a ocultar

  function handleMouseMove() {
    if (isPlaying && !showPlayer) {
      setShowPlayer(true);
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setShowPlayer(false);
    }, 1000);
  }

  return (
    <main className={`${styles.main}  `}>
      <div
        className={`${styles.slidesWrapper} ${isPlaying ? styles.playing : ""}`}
        onClick={(e) => {
          /*     console.log(e);
          const target = e.target as HTMLElement;
          console.log(target);
          if (target.id === "buttonPause") {
            setIsPaused(true);
            console.log("pausado");
            return;
          }
          handlePlay; */
        }}
        onMouseMove={handleMouseMove}
      >
        <Slides
          play={isPlaying}
          action={
            isPaused
              ? SlidesAction.PAUSE
              : isPlaying
              ? SlidesAction.PLAY
              : SlidesAction.STOP
          }
        ></Slides>
        Slides Wrapper
        <div
          className={`${styles.playerContainer} ${
            showPlayer ? styles.visible : styles.hidden
          }`}
          /*    onMouseOver={handleMouseMove} */
        >
          <button
            id="buttonPlay"
            className={`${styles.playerControl}
            `}
            onClick={() => {
              setIsPaused(false);
              setIsPlaying(true);
            }}
          >
            Play
          </button>
          <button
            id="buttonPause"
            className={`${styles.playerControl}`}
            onClick={() => setIsPaused(true)}
          >
            {PauseIcon}
          </button>
          <button
            id="buttonStop"
            className={`${styles.playerControl}
          `}
          >
            STOP
          </button>
        </div>
      </div>
      <div
        className={`${styles.albumsContainer} ${
          isPlaying ? styles.playing : ""
        }`}
      >
        <div>
          {isPlaying ? "Playing" : "Paused"}
          <button onClick={handlePlay}>Playaaaaa</button>
          <h2>albums</h2>
          <input type="text" placeholder="Search" onChange={handleSearch} />
          <div className={styles.albumsList}>
            {filteredAlbums.map((album) => (
              <div className={styles.albumsItem} key={album.id}>
                {album.name}{" "}
                <button onClick={(e) => handleAdd(e, album)}>Add</button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2>playlist</h2>
          <div className={styles.albumsList}>
            {playlist &&
              playlist.map((album: AlbumType) => (
                <div className={styles.albumsItem} key={album.id}>
                  {album.name} <button>remove</button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}
