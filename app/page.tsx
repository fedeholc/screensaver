"use client";
/* eslint-disable @next/next/no-img-element */
import styles from "./page.module.css";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import Slides from "./Slides/Slides";
import { play, selectStatus } from "../lib/features/player/playerSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import PlayerControls from "./PlayerControls/PlayerControls";
import { AppContext } from "./AppContext";
import AlbumsPlayList from "./AlbumsPlaylist";
import { AppContextProvider } from "./AppContext";
import PruebaSearch2 from "./PruebaSearch";

//TODO: probar cascade layers en lugar de z-index

type AlbumType = {
  id: number;
  name: string;
  links?: string[];
  // otros campos del álbum si existen
};

export default function Home() {
  const { albumsPlaylist, albumsPlaylistDispatch, albumsPL } =
    useContext(AppContext);

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

  //hace una primera carga de imagenes por defecto, previo a que se seleccione un album, pero ojo, está tomando las imagenes de un archivo json, no de la base.
  //TODO: cambiar para que tome las imagenes de la base de datos de algún album, y que tenga la info completa del album.
  //sería interesante guardar datos de cantidad de reproducciones de cada album por usuario como para poder mostrar los más populares.
  useEffect(() => {
    if (imagesPlaylist.length === 0) {
      try {
        fetch("/api/data")
          .then((res) => res.json())
          .then((data) => {
            let temp = data.map((link: string) => {
              return { albumId: 1, link: link };
            });
            setImagesPlaylist(temp);
          });
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
    //albumsPlaylistDispatch({ type: "add", payload: album });
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

  let statusStyle = {
    paused: styles.playing,
    playing: styles.playing,
    stopped: "",
  };

  return (
    <main className={`${styles.mainPage}`}>
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
      <section
        /*  className={`${styles.mainContainer} ${status === "paused" || status === "playing" ? styles.playing: "" }`} */
        className={`${styles.mainContainer} ${statusStyle[status]}`}
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
