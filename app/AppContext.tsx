"use client";
import { createContext, useContext, useReducer } from "react";
type AlbumType = {
  id: number;
  name: string;
  links?: string[];
  // otros campos del álbum si existen
};

type AplAction =
  | { type: "add"; payload: AlbumType }
  | { type: "remove"; payload: number };

function albumsPlaylistReducer(
  albumsPlaylist: AlbumType[],
  action: AplAction
): AlbumType[] {
  switch (action.type) {
    case "add":
      return [...albumsPlaylist, action.payload];
    case "remove":
      return albumsPlaylist.filter((_, index) => index !== action.payload);
    default:
      return albumsPlaylist;
  }
}

import { Dispatch } from "react";

export const AppContext = createContext<{
  albumsPlaylist: AlbumType[];
  albumsPlaylistDispatch: Dispatch<AplAction>;
  albumsPL: {
    add: (album: AlbumType) => void;
    remove: (index: number) => void;
  };
}>({
  albumsPlaylist: [],
  albumsPlaylistDispatch: () => null,
  albumsPL: { add: () => null, remove: () => null },
});

export function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [albumsPlaylist, albumsPlaylistDispatch] = useReducer(
    albumsPlaylistReducer,
    []
  );

  const albumsPL = {
    add: function (album: AlbumType) {
      albumsPlaylistDispatch({ type: "add", payload: album });
    },
    remove: function (index: number) {
      albumsPlaylistDispatch({ type: "remove", payload: index });
    },
  };
  return (
    <AppContext.Provider
      value={{ albumsPlaylist, albumsPlaylistDispatch, albumsPL }}
    >
      {children}
    </AppContext.Provider>
  );
}
