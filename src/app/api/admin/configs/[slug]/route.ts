/**
 * Admin CMS: fetch, update, or delete a single hotel config by slug.
 *
 * GET    /api/admin/configs/:slug  → { config: HotelConfig } | 404
 * PUT    /api/admin/configs/:slug  → overwrite the config at this slug
 * DELETE /api/admin/configs/:slug  → remove the config
 */

import { NextResponse } from "next/server";
import { deleteConfig, loadConfig, saveConfig } from "@/lib/kv-client";
import type { HotelConfig } from "@/lib/hotel-config";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const config = await loadConfig(slug);
    if (!config) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ config });
  } catch (error) {
    console.error("[api/admin/configs/[slug] GET]", error);
    return NextResponse.json(
      { error: "Failed to load config" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const body = (await request.json()) as Partial<HotelConfig>;

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    // The URL slug is authoritative: force it into the persisted payload
    // so callers can't accidentally mutate the key by editing body.slug.
    const toSave = { ...body, slug } as HotelConfig;

    if (!toSave.brand?.name) {
      return NextResponse.json(
        { error: "brand.name is required" },
        { status: 400 }
      );
    }

    await saveConfig(toSave);

    return NextResponse.json({ slug, url: `/?client=${slug}` });
  } catch (error) {
    console.error("[api/admin/configs/[slug] PUT]", error);
    return NextResponse.json(
      { error: "Failed to update config" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    await deleteConfig(slug);
    return NextResponse.json({ slug, deleted: true });
  } catch (error) {
    console.error("[api/admin/configs/[slug] DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete config" },
      { status: 500 }
    );
  }
}
