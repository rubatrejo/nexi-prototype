/**
 * Admin CMS: list all saved hotel configs and create new ones.
 *
 * GET  /api/admin/configs           → { configs: HotelConfig[] }
 * POST /api/admin/configs           → persists the body as a new config
 *                                     or overwrites an existing slug
 */

import { NextResponse } from "next/server";
import { listConfigs, saveConfig } from "@/lib/kv-client";
import type { HotelConfig } from "@/lib/hotel-config";

// Slugs are user-provided and become part of the URL, so constrain them
// to a safe shape: lowercase letters, digits, hyphens, 1–64 chars.
const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{0,62}[a-z0-9]$|^[a-z0-9]$/;

export async function GET() {
  try {
    const configs = await listConfigs();
    return NextResponse.json({ configs });
  } catch (error) {
    console.error("[api/admin/configs GET]", error);
    return NextResponse.json(
      { error: "Failed to list configs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<HotelConfig>;

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    if (!body.slug || typeof body.slug !== "string") {
      return NextResponse.json(
        { error: "slug is required" },
        { status: 400 }
      );
    }
    if (!SLUG_REGEX.test(body.slug)) {
      return NextResponse.json(
        {
          error:
            "slug must be lowercase letters, digits, and hyphens (1–64 chars, cannot start or end with -)",
        },
        { status: 400 }
      );
    }
    if (!body.brand?.name) {
      return NextResponse.json(
        { error: "brand.name is required" },
        { status: 400 }
      );
    }

    await saveConfig(body as HotelConfig);

    return NextResponse.json(
      {
        slug: body.slug,
        url: `/?client=${body.slug}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[api/admin/configs POST]", error);
    return NextResponse.json(
      { error: "Failed to save config" },
      { status: 500 }
    );
  }
}
