/**
 * Vercel KV (Upstash Redis) client wrapper for the NEXI admin CMS.
 *
 * Storage shape: every client hotel config lives under the key
 * `config:{slug}` as a serialized JSON HotelConfig. The set of known
 * slugs lives under `config:index` (a Redis SET) so we can list
 * everything without scanning the whole keyspace.
 */

import { Redis } from "@upstash/redis";
import type { HotelConfig } from "./hotel-config";

/**
 * Upstash Redis client constructed from the KV_REST_API_* env vars that
 * Vercel generates when you install the Upstash Redis marketplace
 * integration on a project. Works identically in local dev (pulled via
 * `vercel env pull .env.local`) and on the deployed Vercel runtime.
 */
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const CONFIG_KEY_PREFIX = "config:";
const INDEX_KEY = "config:index";

function keyFor(slug: string): string {
  return `${CONFIG_KEY_PREFIX}${slug}`;
}

/**
 * Persist a HotelConfig under its slug. Adds the slug to the index
 * set so listConfigs() stays O(1) and avoids Redis SCAN.
 */
export async function saveConfig(config: HotelConfig): Promise<void> {
  if (!config.slug) {
    throw new Error("saveConfig: HotelConfig.slug is required");
  }
  await redis.set(keyFor(config.slug), JSON.stringify(config));
  await redis.sadd(INDEX_KEY, config.slug);
}

/**
 * Fetch a HotelConfig by slug. Returns null if the slug has no config
 * stored (the caller should fall back to the default hotelConfig).
 */
export async function loadConfig(slug: string): Promise<HotelConfig | null> {
  const raw = await redis.get<string | HotelConfig>(keyFor(slug));
  if (raw == null) return null;
  // Upstash auto-parses JSON strings stored via the REST API. Handle
  // both shapes defensively.
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as HotelConfig;
    } catch {
      return null;
    }
  }
  return raw as HotelConfig;
}

/**
 * List all known slugs (not the full configs, just the identifiers).
 * The admin sidebar uses this to show saved clients. Sorted
 * alphabetically for stable ordering.
 */
export async function listSlugs(): Promise<string[]> {
  const slugs = await redis.smembers(INDEX_KEY);
  return (slugs ?? []).sort();
}

/**
 * Convenience helper: load every stored config at once. Used by the
 * admin UI when it wants to render a rich list with branding preview
 * for each client.
 */
export async function listConfigs(): Promise<HotelConfig[]> {
  const slugs = await listSlugs();
  if (slugs.length === 0) return [];
  const configs = await Promise.all(slugs.map((s) => loadConfig(s)));
  return configs.filter((c): c is HotelConfig => c !== null);
}

/**
 * Delete a config and remove its slug from the index.
 */
export async function deleteConfig(slug: string): Promise<void> {
  await redis.del(keyFor(slug));
  await redis.srem(INDEX_KEY, slug);
}
