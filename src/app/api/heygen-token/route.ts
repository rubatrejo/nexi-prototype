import { NextResponse } from "next/server";

export async function POST() {
  const apiKey = process.env.NEXT_PUBLIC_HEYGEN_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "No API key" }, { status: 500 });

  const res = await fetch("https://api.heygen.com/v1/streaming.create_token", {
    method: "POST",
    headers: { "x-api-key": apiKey },
  });
  const data = await res.json();
  return NextResponse.json({ token: data.data?.token });
}
