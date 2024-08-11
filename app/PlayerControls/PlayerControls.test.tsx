import { describe, it, expect, vi, Mock, beforeAll, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore, { MockStoreEnhanced } from "redux-mock-store";
import PlayerControls from "@/app/PlayerControls/PlayerControls";
import "@testing-library/jest-dom";
import { play, pause, stop } from "../../lib/features/player/playerSlice";

// Define the state interface
interface PlayerState {
  status: string;
  albumId: number;
}

interface RootState {
  player: PlayerState;
}

const mockStore = configureStore<RootState>([]);

describe("PlayerControls", () => {
  let store: MockStoreEnhanced<RootState>;
  let setIsMouseOverPlayer: Mock<(...args: any[]) => any>;
  let setShowPlayer: Mock<(...args: any[]) => any>;

  beforeEach(() => {
    store = mockStore({
      player: {
        status: "paused",
        albumId: 1,
      },
    });

    setIsMouseOverPlayer = vi.fn();
    setShowPlayer = vi.fn();
  });

  it("should render correctly", () => {
    render(
      <Provider store={store}>
        <PlayerControls
          setIsMouseOverPlayer={setIsMouseOverPlayer}
          setShowPlayer={setShowPlayer}
        />
      </Provider>
    );

    expect(screen.getByRole("button", { name: /play/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /stop/i })).toBeInTheDocument();
  });

  it("should dispatch play action and hide player on play button click", () => {
    render(
      <Provider store={store}>
        <PlayerControls
          setIsMouseOverPlayer={setIsMouseOverPlayer}
          setShowPlayer={setShowPlayer}
        />
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: /play/i }));

    const actions = store.getActions();
    expect(actions).toContainEqual(play());
    expect(setShowPlayer).toHaveBeenCalledWith(false);
    expect(setIsMouseOverPlayer).toHaveBeenCalledWith(false);
  });

  it("should dispatch pause action on pause button click", () => {
    store = mockStore({
      player: {
        status: "playing",
        albumId: 1,
      },
    });

    render(
      <Provider store={store}>
        <PlayerControls
          setIsMouseOverPlayer={setIsMouseOverPlayer}
          setShowPlayer={setShowPlayer}
        />
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: /pause/i }));

    const actions = store.getActions();
    expect(actions).toContainEqual(pause());
  });

  it("should dispatch stop action on stop button click", () => {
    render(
      <Provider store={store}>
        <PlayerControls
          setIsMouseOverPlayer={setIsMouseOverPlayer}
          setShowPlayer={setShowPlayer}
        />
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: /stop/i }));

    const actions = store.getActions();
    expect(actions).toContainEqual(stop());
  });

  it("should call setIsMouseOverPlayer on mouse over and out", () => {
    render(
      <Provider store={store}>
        <PlayerControls
          setIsMouseOverPlayer={setIsMouseOverPlayer}
          setShowPlayer={setShowPlayer}
        />
      </Provider>
    );

    const playerContainer = screen.getByRole("button", {
      name: /play/i,
    }).parentElement;

    fireEvent.mouseOver(playerContainer!);
    expect(setIsMouseOverPlayer).toHaveBeenCalledWith(true);

    fireEvent.mouseOut(playerContainer!);
    expect(setIsMouseOverPlayer).toHaveBeenCalledWith(false);
  });
});
