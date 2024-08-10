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
}>({
  albumsPlaylist: [],
  albumsPlaylistDispatch: () => null,
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
  return (
    <AppContext.Provider value={{ albumsPlaylist, albumsPlaylistDispatch }}>
      {children}
    </AppContext.Provider>
  );
}
