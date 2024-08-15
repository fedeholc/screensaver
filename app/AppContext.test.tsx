import { describe, it, expect } from "vitest";
import { albumsPlaylistReducer } from "./AppContext";
import { AplAction } from "./AppContext";
import { Album } from "./types/Album";

const album1 = {
  id: "1",
  name: "Album 1",
  description: "Description",
  image: "image",
  dateCreated: "dateCreated",
};
const album2 = {
  id: "2",
  name: "Album 2",
  description: "Description",
  image: "image",
  dateCreated: "dateCreated",
};
describe("albumsPlaylistReducer", () => {
  it("should add an album to the playlist", () => {
    const initialState: Album[] = [];
    const newAlbum: Album = album1;
    const action: AplAction = { type: "add", payload: newAlbum };
    const newState = albumsPlaylistReducer(initialState, action);
    expect(newState).toEqual([newAlbum]);
  });

  it("should remove an album from the playlist by index", () => {
    const initialState: Album[] = [album1, album2];
    const action: AplAction = { type: "remove", payload: 0 };
    const newState = albumsPlaylistReducer(initialState, action);
    expect(newState).toEqual([{ id: 2, name: "Album 2", links: ["Artist 2"] }]);
  });

  it("should return the same state for unknown action types", () => {
    const initialState: Album[] = [album1];

    const newState = albumsPlaylistReducer(initialState, {
      //@ts-ignore
      type: "unknown",
      //@ts-ignore
      payload: {},
    });
    expect(newState).toEqual(initialState);
  });
});
