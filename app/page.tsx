"use client";
/* eslint-disable @next/next/no-img-element */
import styles from "./page.module.css";
import FullScreenButton from "./fullScreenButton";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import Prueba1 from "./prueba1/prueba1";

type AlbumType = {
  id: number;
  name: string;
  // otros campos del álbum si existen
};

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

  const [filteredAlbums, setFilteredAlbums] = useState(albums);
  const [play, setPlay] = useState(false);

  const [playList, setPlayList]: [
    { id: number; name: string }[],
    Dispatch<SetStateAction<{ id: number; name: string }[]>>
  ] = useState<{ id: number; name: string }[]>([]);

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const search = event.target.value;
    let filtered = albums.filter((photographer) =>
      photographer.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredAlbums(filtered);
    console.log(filteredAlbums);
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
    console.log("p", play);
    setPlay(!play);
  }

  //TODO: acá probé con el componente que pasa las imagenes como hermano de los controles pero mandandolo al fondo con posición absoluta y zindex. Tendría que probar si es mejor como componente padre que contenga a los controles.

  return (
    <main className={`${styles.main}  `}>
      <Prueba1 play={play}></Prueba1>
      <div
        className={`${styles.controller} ${play ? styles.playing : ""}`}
        onClick={handlePlay}
      >
        controller
      </div>
      <div className={`${styles.mainContainer} ${play ? styles.playing : ""}`}>
        {play ? "Playing" : "Paused"}
        <button onClick={handlePlay}>Playaaaaa</button>
        <h2>Main</h2>
        <input type="text" placeholder="Search" onChange={handleSearch} />
        <div className={styles.listContainer}>
          {filteredAlbums.map((album) => (
            <div className={styles.listItem} key={album.id}>
              {album.name}{" "}
              <button onClick={(e) => handleAdd(e, album)}>Add</button>
            </div>
          ))}
        </div>
      </div>

      <div className={`${styles.mainContainer} ${play ? styles.playing : ""}`}>
        <h2>playlist</h2>
        <div className={styles.listContainer}>
          {playList &&
            playList.map((album: AlbumType) => (
              <div className={styles.listItem} key={album.id}>
                {album.name} <button>remove</button>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}
