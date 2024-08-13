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

//TODO: probar cascade layers en lugar de z-index

type AlbumType = {
  id: number;
  name: string;
  links?: string[];
  // otros campos del álbum si existen
};

export default function Home() {
  const { albumsPL } = useContext(AppContext);

  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);

  const [albums, setAlbums] = useState<AlbumType[]>([]);

  const [filteredAlbums, setFilteredAlbums] = useState(albums);

  const [imagesPlaylist, setImagesPlaylist] = useState<
    { albumId: number; link: string }[]
  >([]);

  //VER sería interesante guardar datos de cantidad de reproducciones de cada album por usuario como para poder mostrar los más populares.
  //TODO: está tomando un album random para tenerlo cargado por defecto, pero revisar porque al estar react en strict mode, se está llamando 2 veces a la api y hace un cambio de imagenes si tocan 2 random distintos. Habría que hacer un useEffect que se ejecute solo una vez y guarde el random, o ver que pasa cuando no está en strict mode.
  useEffect(() => {
    async function getData() {
      let albumId;

      var response = await fetch("/api/randomalbum");
      let album = await response.json();
      albumId = album[0].id;

      var response = await fetch("/api/album/" + albumId);
      let data = await response.json();

      if (data) {
        let temp = data.map((img: any) => {
          return { albumId: img.albumId, link: img.url };
        });
        setImagesPlaylist(temp);
      }
    }

    if (imagesPlaylist.length === 0) {
      try {
        getData();
      } catch (e) {
        console.log(e);
      }
    } else if (imagesPlaylist.length > 0) {
      setImagesPlaylist(imagesPlaylist);
    }
  }, [imagesPlaylist]);

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

  function handleAdd(
    event: React.MouseEvent<HTMLButtonElement>,
    album: AlbumType
  ) {
    console.log("add", album);
    albumsPL.add(album);
  }

  async function handlePlayAlbum(
    event: React.MouseEvent<HTMLButtonElement>,
    albumId: string
  ) {
    let response = await fetch("/api/album/" + albumId);
    let data = await response.json();

    if (data) {
      let temp = data.map((img: any) => {
        return { albumId: img.albumId, link: img.url };
      });
      setImagesPlaylist(temp);
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
