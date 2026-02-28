import { NextResponse } from "next/server";

const DID_API_KEY = process.env.DID_API_KEY || "cnViYS50cmVqb0BnbWFpbC5jb20:qObDt-oSF9gkZOcr09u3f";
const CONCIERGE_PHOTO = "/images/unsplash/photo-1573497019940-1c28c88b4f3e.jpg";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const action = body.action || "create";

  if (action === "create") {
    const res = await fetch("https://api.d-id.com/talks/streams", {
      method: "POST",
      headers: {
        Authorization: `Basic ${DID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_url: CONCIERGE_PHOTO,
        driver_url: "bank://lively",
      }),
    });
    const data = await res.json();
    return NextResponse.json(data);
  }

  if (action === "sdp") {
    // Send SDP answer back
    const res = await fetch(`https://api.d-id.com/talks/streams/${body.streamId}/sdp`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${DID_API_KEY}`,
        "Content-Type": "application/json",
        ...(body.sessionId ? { Cookie: body.sessionId } : {}),
      },
      body: JSON.stringify({ answer: body.answer }),
    });
    const data = await res.json();
    return NextResponse.json(data);
  }

  if (action === "ice") {
    const res = await fetch(`https://api.d-id.com/talks/streams/${body.streamId}/ice`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${DID_API_KEY}`,
        "Content-Type": "application/json",
        ...(body.sessionId ? { Cookie: body.sessionId } : {}),
      },
      body: JSON.stringify({ candidate: body.candidate, sdpMid: body.sdpMid, sdpMLineIndex: body.sdpMLineIndex }),
    });
    const data = await res.json();
    return NextResponse.json(data);
  }

  if (action === "talk") {
    const res = await fetch(`https://api.d-id.com/talks/streams/${body.streamId}`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${DID_API_KEY}`,
        "Content-Type": "application/json",
        ...(body.sessionId ? { Cookie: body.sessionId } : {}),
      },
      body: JSON.stringify({
        script: {
          type: "text",
          input: body.text || "Hello! I'm your AI Concierge. How can I help you today?",
          provider: { type: "microsoft", voice_id: "en-US-JennyNeural" },
        },
        driver_url: "bank://lively",
      }),
    });
    const data = await res.json();
    return NextResponse.json(data);
  }

  if (action === "destroy") {
    const res = await fetch(`https://api.d-id.com/talks/streams/${body.streamId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${DID_API_KEY}`,
        ...(body.sessionId ? { Cookie: body.sessionId } : {}),
      },
    });
    return NextResponse.json({ ok: res.ok });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
