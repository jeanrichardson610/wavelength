import { NextRequest, NextResponse } from "next/server";

/**
 * Deezer's public API does not send Access-Control-Allow-Origin headers,
 * so it can't be called directly from the browser. This route is the one
 * piece of "backend" in the app: it forwards a path + query string to
 * api.deezer.com and streams the JSON back. It holds no state, no
 * database, and no auth — it exists purely to get around CORS.
 *
 * Usage from the client: GET /api/deezer?path=/search&q=daft+punk
 * "path" selects the Deezer endpoint; every other query param is
 * forwarded as-is.
 */

const DEEZER_BASE = "https://api.deezer.com";

const ALLOWED_PATH_PREFIXES = [
  "/search",
  "/chart",
  "/album/",
  "/artist/",
  "/track/",
  "/playlist/",
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (!path || !ALLOWED_PATH_PREFIXES.some((p) => path.startsWith(p))) {
    return NextResponse.json(
      { error: "Missing or disallowed 'path' parameter." },
      { status: 400 }
    );
  }

  const forwarded = new URLSearchParams(searchParams);
  forwarded.delete("path");

  const target = `${DEEZER_BASE}${path}?${forwarded.toString()}`;

  try {
    const res = await fetch(target, {
      // Deezer payloads for charts/search are small and cacheable for a
      // short window — this takes load off Deezer and speeds up repeat
      // navigation without ever touching a database.
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Deezer responded with ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to reach Deezer API." },
      { status: 502 }
    );
  }
}