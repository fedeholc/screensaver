"use client";
/* eslint-disable @next/next/no-img-element */
import styles from "./page.module.css";
import React, {
  Dispatch,
  SetStateAction,
  use,
  useReducer,
  useRef,
  useState,
} from "react";
import Slides from "./Slides/Slides";
import { play, selectStatus } from "../lib/features/player/playerSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import PlayerControls from "./PlayerControls/PlayerControls";
import { AppContext } from "./AppContext";
import { useContext } from "react";
import { useEffect } from "react";
import AlbumsPlayList from "./AlbumsPlaylist";
import { AppContextProvider } from "./AppContext";

//TODO: probar cascade layers en lugar de z-index

type AlbumType = {
  id: number;
  name: string;
  links?: string[];
  // otros campos del álbum si existen
};

export default function Home() {
  const { albumsPlaylist, albumsPlaylistDispatch } = useContext(AppContext);

  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);

  const [albums, setAlbums] = useState<AlbumType[]>([]);
  const [showPlayer, setShowPlayer] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [filteredAlbums, setFilteredAlbums] = useState(albums);
  const [isMouseOverPlayer, setIsMouseOverPlayer] = useState(false);

  const [imagesPlaylist, setImagesPlaylist] = useState<
    { albumId: number; link: string }[]
  >([]);

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const search = event.target.value;
    if (albums.length > 0) {
      let filtered = albums.filter((album) => {
        console.log("album:", album.name.toLowerCase().includes(search));
        return album.name.toLowerCase().includes(search.toLowerCase());
      });
      setFilteredAlbums(filtered);
    }
  }

  useEffect(() => {
    if (imagesPlaylist.length === 0) {
      fetch("/api/data")
        .then((res) => res.json())
        .then((data) => {
          let temp = data.map((link: string) => {
            return { albumId: 1, link: link };
          });
          setImagesPlaylist(temp);
        });
    } else if (imagesPlaylist.length > 0) {
      setImagesPlaylist(imagesPlaylist);
    }
  }, [imagesPlaylist]);

  useEffect(() => {
    if (albums.length === 0) {
      fetch("/api/albums")
        .then((res) => res.json())
        .then((data) => {
          setAlbums(data);
          setFilteredAlbums(data);
        });
    }
  });

  function handleAdd(
    event: React.MouseEvent<HTMLButtonElement>,
    album: AlbumType
  ) {
    console.log("add", album);
    albumsPlaylistDispatch({ type: "add", payload: album });
    //setAlbumsPlaylist((prev) => [...prev, album]);
  }

  async function handlePlayAlbum(
    event: React.MouseEvent<HTMLButtonElement>,
    album: AlbumType
  ) {
    let response = await fetch("/api/album/" + album.id);
    let data = await response.json();

    if (data) {
      let temp = data.map((img: any) => {
        return { albumId: img.albumId, link: img.url };
      });
      setImagesPlaylist(temp);
    }
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
        if (!isMouseOverPlayer) {
          setShowPlayer(false);
        }
      }, 1000);
    }
  }

  return (
    <main className={`${styles.mainPage}`}>
      <div
        onMouseMove={handleMouseMove}
        className={`${styles.slidesWrapper} ${
          status === "paused" || status === "playing" ? styles.playing : ""
        }`}
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
      <section
        className={`${styles.mainContainer}
              ${
                status === "paused" || status === "playing"
                  ? styles.playing
                  : ""
              }`}
      >
        <div>
          {showPlayer && (
            <PlayerControls
              setShowPlayer={setShowPlayer}
              key={2}
              setIsMouseOverPlayer={setIsMouseOverPlayer}
            />
          )}
        </div>
        <div
          className={`${styles.albumsContainer}
              ${
                status === "paused" || status === "playing"
                  ? styles.playing
                  : ""
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
                  <button
                    onClick={(e) => {
                      handlePlayAlbum(e, album);
                      setShowPlayer(false);
                      dispatch(play());
                    }}
                  >
                    Play
                  </button>
                </div>
              ))}
            </div>
          </div>
          <AlbumsPlayList />
        </div>
      </section>
    </main>
  );
}
