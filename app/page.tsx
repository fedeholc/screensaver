"use client";
/* eslint-disable @next/next/no-img-element */
import styles from "./page.module.css";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { play, selectStatus } from "../lib/features/player/playerSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { AppContext } from "./AppContext";
import AlbumsPlayList from "./AlbumsPlaylist";
import { AppContextProvider } from "./AppContext";
import PruebaSearch2 from "./PruebaSearch2";
import SlidesWrapper from "./Slides/SlidesWrapper";
import { PlayIcon } from "./PlayerControls/icons";
import playerControlsStyles from "./PlayerControls/PlayerControls.module.css";
import type { Album } from "@/app/types/db/Album";
import type { Image } from "@/app/types/db/Image";
import { getAlbumImages, getRandomAlbum } from "@/lib/apiService";

//TODO: probar cascade layers en lugar de z-index

export default function Home() {
  const { albumsPL } = useContext(AppContext);
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [filteredAlbums, setFilteredAlbums] = useState(albums);
  const [mainPL, setMainPL] = useState<Image[]>([]);

  useEffect(() => {
    async function loadRandomAlbum() {
      try {
        let album = await getRandomAlbum();
        setMainPL(album);
      } catch (error) {
        console.error("Error loading random album:", error);
        setMainPL([]);
      }
    }

    if (mainPL.length === 0) {
      loadRandomAlbum();
    }
  });

  //carga la lista de los albums desde la base de datos
  //TODO: habría que implementar acá el debounce y paginación cuando haya mas para cargar.
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

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const search = event.target.value;
    if (albums.length > 0) {
      let filtered = albums.filter((album) => {
        return album.name.toLowerCase().includes(search.toLowerCase());
      });
      setFilteredAlbums(filtered);
    }
  }

  function handleAdd(event: React.MouseEvent<HTMLButtonElement>, album: Album) {
    albumsPL.add(album);
  }

  async function handlePlayAlbum(
    event: React.MouseEvent<HTMLButtonElement>,
    albumId: string
  ) {
    let Images = await getAlbumImages(albumId);
    setMainPL(Images);
  }

  let statusStyle = {
    paused: styles.playing,
    playing: styles.playing,
    stopped: "",
  };

  return (
    <main className={`${styles.mainPage}`}>
      <SlidesWrapper imagesPlaylist={mainPL} />

      <section className={`${styles.mainContainer} ${statusStyle[status]}`}>
        <div className={`${playerControlsStyles.playerContainer}`}>
          <button
            aria-label="play"
            className={`${playerControlsStyles.playerControl}`}
            onClick={() => {
              dispatch(play());
            }}
          >
            <PlayIcon className={playerControlsStyles.icon} />
          </button>
        </div>
        <div className={`${styles.albumsContainer}${statusStyle[status]}`}>
          <div>
            <h2>albums</h2>
            <input type="text" placeholder="Search" onChange={handleSearch} />
            <AppContextProvider>
              <div className={styles.albumsList}>
                {filteredAlbums.map((album) => (
                  <div className={styles.albumsItem} key={album.id}>
                    {album.name}
                    <button onClick={(e) => handleAdd(e, album)}>Add</button>
                    <button
                      onClick={(e) => {
                        handlePlayAlbum(e, album.id.toString());
                        dispatch(play());
                      }}
                    >
                      Play
                    </button>
                  </div>
                ))}
              </div>
            </AppContextProvider>
          </div>
          <AppContextProvider>
            <AlbumsPlayList />
          </AppContextProvider>
        </div>
        <PruebaSearch2 />
      </section>
    </main>
  );
}
