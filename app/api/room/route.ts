import { Room, RoomServiceClient } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name");

  if (!name) {
    return NextResponse.json(
      { error: 'Missing "user" query parameter' },
      { status: 400 }
    );
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  const livekitHost = wsUrl?.replace("wss://", "https://");
  const roomService = new RoomServiceClient(livekitHost, apiKey, apiSecret);

  try {
    const rooms: Room[] = await roomService.listRooms();
    return NextResponse.json({ room: (rooms.find((r) => r.name === name)) });
  } catch {
    const rooms: Room[] = [];
    // return NextResponse.json({ room: rooms });
  }
}