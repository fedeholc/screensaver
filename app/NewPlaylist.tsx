import styles from "./page.module.css";
import { AppContext } from "./AppContext";
import { useContext } from "react";
import type { Album } from "./types/db/Album";

export default function NewPlaylist() {
  const { albumsPlaylist, albumsPlaylistDispatch, albumsPL } =
    useContext(AppContext);

  return (
    <div>
      <h2>playlist</h2>
      <div className={styles.albumsList}>
        {albumsPlaylist &&
          albumsPlaylist.map((album: Album, index: number) => (
            <div
              className={styles.albumsItem}
              key={album.id + index.toString()}
            >
              {album.name}{" "}
              <button onClick={() => albumsPL.remove(index)}>remove</button>
            </div>
          ))}
      </div>
    </div>
  );
}
