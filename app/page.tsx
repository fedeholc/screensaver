"use client";
/* eslint-disable @next/next/no-img-element */
import styles from "./page.module.css";
import FullScreenButton from "./fullScreenButton";
import React, { Dispatch, SetStateAction, use, useRef, useState } from "react";
import Slides from "./Slides/Slides";
import { SlidesAction } from "./types";
import { PauseIcon, StopIcon, PlayIcon } from "./PlayerControls/icons";
import {
  play,
  stop,
  pause,
  setAlbumId,
  selectAlbumId,
  selectStatus,
} from "../lib/features/player/playerSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import PlayerControls from "./PlayerControls/PlayerControls";
import album1 from "./Slides/images1.json";
import album2 from "./Slides/images2.json";
import album3 from "./Slides/images3.json";
import { useEffect } from "react";

//TODO: probar cascade layers en lugar de z-index

type AlbumType = {
  id: number;
  name: string;
  links?: string[];
  // otros campos del álbum si existen
};

export default function Home() {
  const dispatch = useAppDispatch();
  //const albumId = useAppSelector(selectAlbumId);
  const status = useAppSelector(selectStatus);

  const albums: AlbumType[] = [
    { id: 1, name: "Ansel Adams", links: album1 },
    {
      id: 2,
      name: "Henri Cartier-Bresson",
      links: album2,
    },
    { id: 3, name: "Salvador Dalí", links: album3 },
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

  const [showPlayer, setShowPlayer] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [filteredAlbums, setFilteredAlbums] = useState(albums);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const [playlist, setPlayList]: [
    { id: number; name: string }[],
    Dispatch<SetStateAction<{ id: number; name: string }[]>>
  ] = useState<{ id: number; name: string }[]>([]);

  const [imageList, setImageList] = useState<
    { albumId: number; link: string }[]
  >([]);

  const [playerList, setPlayerList] = useState<
    { albumId: number; link: string }[]
  >([]);

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const search = event.target.value;
    let filtered = albums.filter((photographer) =>
      photographer.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredAlbums(filtered);
  }

  useEffect(() => {
    if (imageList.length === 0) {
      let al = fetch("/api/data")
        .then((res) => res.json())
        .then((data) => {
          let temp = data.map((link: string) => {
            return { albumId: 1, link: link };
          });
          setPlayerList(temp);
          console.log("data:", data);
        });
    } else if (imageList.length > 0) {
      setPlayerList(imageList);
    }
  }, [imageList]);

  /*  useEffect(() => {
    if (imageList.length === 0) {
      let temp = album1.map((link) => {
        return { albumId: 1, link: link };
      });
      setPlayerList(temp);
      console.log(temp);
    } else {
      setPlayerList(imageList);
    }
  }, [imageList]); */

  function handleAdd(
    event: React.MouseEvent<HTMLButtonElement>,
    album: AlbumType
  ) {
    console.log(event);
    console.log(album);
    if (album && album.links) {
      let temp = album.links.map((link) => {
        return { albumId: album.id, link: link };
      });
      setImageList((prev) => [...prev, ...temp]);
    }
    setPlayList((prev) => [...prev, album]);
  }

  function handleMouseMove() {
    if ((status === "playing" || status === "paused") && !showPlayer) {
      setShowPlayer(true);
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (status !== "stopped") {
      timeoutRef.current = setTimeout(() => {
        if (!isMouseOver) {
          setShowPlayer(false);
        }
      }, 1000);
    }
  }

  return (
    <main className={`${styles.mainPage}`}>
      {" "}
      {/*       {showPlayer ? "showPlayer" : "no showPlayer"}
       */}{" "}
      <div
        onMouseMove={handleMouseMove}
        className={`${styles.slidesWrapper} ${
          status === "paused" || status === "playing" ? styles.playing : ""
        }`}
      >
        {playerList.length > 0 && <Slides imageList={playerList}></Slides>}

        <div className={`${styles.playerControlsWrapper}`}>
          {/*           {showPlayer ? "showPlayer" : "no showPlayer"}
           */}{" "}
          {showPlayer && status !== "stopped" && (
            <PlayerControls
              key={1}
              setIsMouseOver={setIsMouseOver}
              setShowPlayer={setShowPlayer}
            />
          )}
        </div>
      </div>
      <section
        className={`${styles.mainContainer}
            ${
              status === "paused" || status === "playing" ? styles.playing : ""
            }`}
      >
        <div>
          {showPlayer && (
            <PlayerControls
              setShowPlayer={setShowPlayer}
              key={2}
              setIsMouseOver={setIsMouseOver}
            />
          )}
        </div>
        <div
          className={`${styles.albumsContainer}
            ${
              status === "paused" || status === "playing" ? styles.playing : ""
            }`}
        >
          <div>
            <h1>
              {status} {/* {albumId} */}
            </h1>
            <h2>albums</h2>
            <input type="text" placeholder="Search" onChange={handleSearch} />
            <div className={styles.albumsList}>
              {filteredAlbums.map((album) => (
                <div className={styles.albumsItem} key={album.id}>
                  {album.name}
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
          <div>
            <h2>Imagelist</h2>
            <div className={styles.albumsList}>
              {imageList &&
                imageList.map((image) => (
                  <div className={styles.albumsItem} key={image.link}>
                    {image.link} <button>remove</button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
