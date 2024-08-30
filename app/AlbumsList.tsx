/* eslint-disable @next/next/no-img-element */
import styles from "./page.module.css";
import albumsList from "./albumsList.module.css";
import { useState, useEffect } from "react";
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
  /* albums,
  filteredAlbums,
  setFilteredAlbums, */
  setMainPL,
}: {
  /*  albums: Album[];
  filteredAlbums: Album[];
  setFilteredAlbums: React.Dispatch<React.SetStateAction<Album[]>>; */
  setMainPL: React.Dispatch<React.SetStateAction<Image[]>>;
}) {
  const status = useAppSelector(selectStatus);
  const dispatch = useAppDispatch();
  const { albumsPL } = useContext(AppContext);

  const [albums, setAlbums] = useState<Album[]>([]);
  const [filteredAlbums, setFilteredAlbums] = useState(albums);

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
    </div>
  );
}
