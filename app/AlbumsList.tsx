import styles from "./page.module.css";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { play, selectStatus } from "@/lib/features/player/playerSlice";
import { useContext } from "react";
import { AppContext } from "./AppContext";
import { getAlbumImages } from "@/lib/apiService";
import type { Image } from "@/app/types/db/Image";

import { Album } from "@/app/types/db/Album";

export default function AlbumsList({
  albums,
  filteredAlbums,
  setFilteredAlbums,
  setMainPL,
}: {
  albums: Album[];
  filteredAlbums: Album[];
  setFilteredAlbums: React.Dispatch<React.SetStateAction<Album[]>>;
  setMainPL: React.Dispatch<React.SetStateAction<Image[]>>;
}) {
  const status = useAppSelector(selectStatus);
  const dispatch = useAppDispatch();
  const { albumsPL } = useContext(AppContext);

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const search = event.target.value;
    if (albums.length > 0) {
      let filtered = albums.filter((album) => {
        return album.name.toLowerCase().includes(search.toLowerCase());
      });
      setFilteredAlbums(filtered);
    }
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
    <div className={`${styles.albumsContainer}${statusStyle[status]}`}>
      <input
        className={styles.albumsSearch}
        type="text"
        placeholder="Search albums..."
        onChange={handleSearch}
      />
      <div className={styles.albumsList}>
        {filteredAlbums.map((album) => (
          <div className={styles.albumsItem} key={album.id}>
            <div>{album.name}</div>
            <div>
              {/*TODO: para implementar  */}
              {/* <button onClick={(e) => albumsPL.add(album)}>Add</button> */}
              <button
                className={styles.albumsItemButton}
                onClick={(e) => {
                  handlePlayAlbum(e, album.id.toString());
                  dispatch(play());
                }}
              >
                Play
              </button>
            </div>
          </div>
        ))}
      </div>
      {/*  <AppContextProvider>
             VER  para implementar luego <AlbumsPlayList /> 
          </AppContextProvider>*/}
    </div>
  );
}
