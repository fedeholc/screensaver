/* eslint-disable @next/next/no-img-element */
import styles from "./page.module.css";
import albumsList from "./albumsList.module.css";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { play, selectStatus } from "@/lib/features/player/playerSlice";
import { useContext } from "react";
import { AppContext } from "./AppContext";
import { getAlbumImages } from "@/lib/apiService";
import type { Image } from "@/app/types/db/Image";
import { PlayIcon } from "@/app/PlayerControls/icons";
import player from "@/app/PlayerControls/PlayerControls.module.css";

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

/*   if (albums.length === 0) {
    return <div className={albumsList.albumsContainer}>Loading...</div>;
  } */

  return (
    <div className={`${albumsList.albumsContainer}${statusStyle[status]}`}>
      <div className={albumsList.albumsSearchContainer}>
        <input
          className={albumsList.albumsSearch}
          type="text"
          placeholder="Search albums..."
          onChange={handleSearch}
        />
      </div>

      <div className={albumsList.albumsListContainer}>
        <div className={albumsList.albumsList}>
          {albums.length === 0 ? <div>Loading...</div> : null}
          {filteredAlbums.map((album) => (
            <div key={album.id} className={albumsList.albumsItem}>
              <div className={albumsList.albumsItemImgContainer}>
                <img
                  className={albumsList.albumsItemImg}
                  src={album.image}
                  alt={album.name}
                />
                <div className={albumsList.albumsItemControls}>
                  {/*TODO: para implementar  */}
                  {/* <button onClick={(e) => albumsPL.add(album)}>Add</button> */}
                  <button
                    className={albumsList.albumsItemButton}
                    onClick={(e) => {
                      handlePlayAlbum(e, album.id.toString());
                      dispatch(play());
                    }}
                  >
                    <PlayIcon className={player.iconSmall} />
                  </button>
                </div>
              </div>
              <div className={albumsList.albumsItemInfo}>{album.name}</div>
            </div>
          ))}
        </div>
      </div>
      {/*  <AppContextProvider>
             VER  para implementar luego <AlbumsPlayList /> 
          </AppContextProvider>*/}
    </div>
  );
}
