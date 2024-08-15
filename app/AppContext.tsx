"use client";
import { createContext, useContext, useReducer } from "react";

export type AplAction =
  | { type: "add"; payload: Album }
  | { type: "remove"; payload: number };

export function albumsPlaylistReducer(
  albumsPlaylist: Album[],
  action: AplAction
): Album[] {
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
import { Album } from "./types/db/Album";

export const AppContext = createContext<{
  albumsPlaylist: Album[];
  albumsPlaylistDispatch: Dispatch<AplAction>;
  albumsPL: {
    add: (album: Album) => void;
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
    add: function (album: Album) {
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
