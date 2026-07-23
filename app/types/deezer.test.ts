import { describe, it, expect } from "vitest";
import { toPlayableTrack, DeezerTrack } from "../types/deezer";

function makeTrack(overrides: Partial<DeezerTrack> = {}): DeezerTrack {
  return {
    id: 123,
    title: "Around the World",
    duration: 215,
    preview: "https://cdn-preview.dzcdn.net/preview/123.mp3",
    artist: { id: 27, name: "Daft Punk" },
    album: {
      id: 55,
      title: "Homework",
      cover_medium: "https://cdn.dzcdn.net/cover_medium.jpg",
      cover_big: "https://cdn.dzcdn.net/cover_big.jpg",
    },
    ...overrides,
  };
}

describe("toPlayableTrack", () => {
  it("maps a fully-populated Deezer track to a PlayableTrack", () => {
    const result = toPlayableTrack(makeTrack());

    expect(result).toEqual({
      id: 123,
      title: "Around the World",
      artistName: "Daft Punk",
      artistId: 27,
      albumTitle: "Homework",
      albumId: 55,
      cover: "https://cdn.dzcdn.net/cover_big.jpg",
      duration: 215,
      preview: "https://cdn-preview.dzcdn.net/preview/123.mp3",
    });
  });

  it("prefers cover_big over cover_medium when both are present", () => {
    const result = toPlayableTrack(makeTrack());
    expect(result.cover).toBe("https://cdn.dzcdn.net/cover_big.jpg");
  });

  it("falls back to cover_medium when cover_big is missing", () => {
    const result = toPlayableTrack(
      makeTrack({
        album: {
          id: 55,
          title: "Homework",
          cover_medium: "https://cdn.dzcdn.net/cover_medium.jpg",
        },
      })
    );
    expect(result.cover).toBe("https://cdn.dzcdn.net/cover_medium.jpg");
  });

  it("falls back to the placeholder cover when the album has no artwork at all", () => {
    const result = toPlayableTrack(
      makeTrack({ album: { id: 55, title: "Homework" } })
    );
    expect(result.cover).toBe("/placeholder-cover.svg");
  });

  it("falls back to 'Unknown artist' and id 0 when artist is missing", () => {
    // Deezer's type marks `artist` as required, but real-world payloads
    // occasionally omit it — this guards against a runtime crash if that happens.
    const result = toPlayableTrack(
      makeTrack({ artist: undefined as unknown as DeezerTrack["artist"] })
    );
    expect(result.artistName).toBe("Unknown artist");
    expect(result.artistId).toBe(0);
  });
});