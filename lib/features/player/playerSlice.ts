import { createAppSlice } from "@/lib/createAppSlice";
import type { AppThunk } from "@/lib/store";
import type { PayloadAction } from "@reduxjs/toolkit";
import { fetchPlayer } from "./playerAPI";

export interface PlayerSliceState {
  albumId: string;
  status: "playing" | "paused" | "stopped";
}

const initialState: PlayerSliceState = {
  albumId: "",
  status: "stopped",
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const playerSlice = createAppSlice({
  name: "player",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    play: create.reducer((state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.status = 'playing';
    }),
    pause: create.reducer((state) => {
      state.status = 'paused';
    }),
    stop: create.reducer((state) => {
      state.status = 'stopped';
    }),
    setAlbumId: create.reducer((state, action: PayloadAction<string>) => {
      state.albumId = action.payload;
    }),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectAlbumId: (player: PlayerSliceState) => player.albumId,
    selectStatus: (player: PlayerSliceState) => player.status,
  },
});

// Action creators are generated for each case reducer function.
export const { stop, play, pause, setAlbumId } =
  playerSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectAlbumId, selectStatus } = playerSlice.selectors;

