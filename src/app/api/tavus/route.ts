import { NextResponse } from "next/server";

const TAVUS_API_KEY = process.env.TAVUS_API_KEY || "b38113947e5e4a3a993091cc9812e9cd";
const PERSONA_ID = "paf97bca9c8e"; // NEXI Concierge
const REPLICA_ID = "r6c7a6cb6d9b"; // Rose - Business

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const action = body.action || "create";

  if (action === "create") {
    const res = await fetch("https://tavusapi.com/v2/conversations", {
      method: "POST",
      headers: {
        "x-api-key": TAVUS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        persona_id: PERSONA_ID,
        replica_id: REPLICA_ID,
        conversation_name: `NEXI-${Date.now()}`,
        properties: {
          enable_recording: false,
          apply_greenscreen: true,
          participant_left_timeout: 30,
          participant_absent_timeout: 60,
        },
      }),
    });
    const data = await res.json();
    return NextResponse.json(data);
  }

  if (action === "end") {
    const res = await fetch(`https://tavusapi.com/v2/conversations/${body.conversationId}/end`, {
      method: "POST",
      headers: { "x-api-key": TAVUS_API_KEY },
    });
    return NextResponse.json({ ok: res.ok });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
