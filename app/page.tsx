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
import PruebaSearch2 from "./PruebaSearch";
import SlidesWrapper from "./Slides/SlidesWrapper";
import { PlayIcon } from "./PlayerControls/icons";
import playerControlsStyles from "./PlayerControls/PlayerControls.module.css";
import type { Album } from "@/app/types/db/Album";
import type { Image } from "@/app/types/db/Image";

//TODO: probar cascade layers en lugar de z-index

export default function Home() {
  const { albumsPL } = useContext(AppContext);

  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);

  const [albums, setAlbums] = useState<Album[]>([]);
  const [filteredAlbums, setFilteredAlbums] = useState(albums);

  //TODO: hay que definir acá el tipo de dato, que sería images como la tabla. pero la tabla tiene albumid, lo cual no sería correcto si pensamos que puede estar en distintos albumes, pero en los aun no tenemos custom playlist... habría que ver si vale la pena armar una nueva tabla que tenga para el album la lista de imagenes. Pero ahora que lo pienso, una cosa es un album al cual si pertenece una imagen y otra cosa es una custom playlist, como sucede con la música. Pensarlo...
  const [imagesPlaylist, setImagesPlaylist] = useState<Image[]>([]);

  async function loadRandomAlbum() {
    let albumId;

    var response = await fetch("/api/randomalbum");
    let album = await response.json();
    albumId = album[0].id;

    var response = await fetch("/api/album/" + albumId);
    let data: Image[] = await response.json();

    if (data) {
      setImagesPlaylist(data);
    }
  }

  useEffect(() => {
    if (imagesPlaylist.length === 0) {
      try {
        loadRandomAlbum();
      } catch (e) {
        console.log(e);
      }
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
    let response = await fetch("/api/album/" + albumId);
    let data: Image[] = await response.json();

    if (data) {
      setImagesPlaylist(data);
    }
  }

  let statusStyle = {
    paused: styles.playing,
    playing: styles.playing,
    stopped: "",
  };

  return (
    <main className={`${styles.mainPage}`}>
      <SlidesWrapper imagesPlaylist={imagesPlaylist} />

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
