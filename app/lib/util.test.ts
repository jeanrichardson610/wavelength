import { describe, it, expect } from "vitest";
import { formatDuration } from "../lib/utils";

describe("formatDuration", () => {
  it("formats a plain sub-minute duration with zero-padded seconds", () => {
    expect(formatDuration(5)).toBe("0:05");
  });

  it("formats a duration over a minute", () => {
    expect(formatDuration(125)).toBe("2:05");
  });

  it("formats a duration over an hour as raw minutes, not h:mm:ss", () => {
    // formatDuration only ever needs to handle track lengths (a few
    // minutes at most, and the Deezer preview cap is 30s), so this
    // documents the current mm:ss-only behavior rather than assuming
    // hour-aware formatting exists.
    expect(formatDuration(3725)).toBe("62:05");
  });

  it("floors fractional seconds instead of rounding", () => {
    expect(formatDuration(59.9)).toBe("0:59");
  });

  it("treats exactly 0 as a valid, formattable duration", () => {
    expect(formatDuration(0)).toBe("0:00");
  });

  it("falls back to 0:00 for negative input", () => {
    expect(formatDuration(-5)).toBe("0:00");
  });

  it("falls back to 0:00 for NaN", () => {
    expect(formatDuration(NaN)).toBe("0:00");
  });

  it("falls back to 0:00 for Infinity", () => {
    expect(formatDuration(Infinity)).toBe("0:00");
  });
});