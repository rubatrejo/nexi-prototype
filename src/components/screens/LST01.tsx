"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useKiosk } from "@/lib/kiosk-context";
import { useHotel } from "@/lib/theme-provider";
import GlobalHeader from "@/components/layout/GlobalHeader";

const LSTMap = dynamic(() => import("./LSTMap"), { ssr: false });

/* ─── DATA ─── */

const CATEGORIES = [
  { name: "Restaurants", count: 24, img: "/images/unsplash/photo-1517248135467-4c7edcad34c4.jpg", subcategories: ["All", "Steakhouse", "Japanese", "Italian", "Seafood", "Brunch", "Gastropub", "Mediterranean"] },
  { name: "Attractions", count: 18, img: "/images/unsplash/photo-1499856871958-5b9627545d1a.jpg", subcategories: ["All", "Museums", "Galleries", "Parks", "Landmarks"] },
  { name: "Shopping", count: 12, img: "/images/unsplash/photo-1441986300917-64674bd600d8.jpg", subcategories: ["All", "Fashion", "Boutiques", "Malls", "Souvenirs"] },
  { name: "Nightlife", count: 9, img: "/images/unsplash/photo-1566417713940-fe7c737a9ef2.jpg", subcategories: ["All", "Bars", "Clubs", "Lounges", "Live Music"] },
  { name: "Nature", count: 15, img: "/images/unsplash/photo-1441974231531-c6227db76b6e.jpg", subcategories: ["All", "Hiking", "Parks", "Gardens", "Lakes"] },
  { name: "Transportation", count: 6, img: "/images/unsplash/photo-1544620347-c4fd4a3d5957.jpg", subcategories: ["All", "Taxi", "Shuttle", "Car Rental", "Public Transit"] },
  { name: "Wellness & Spa", count: 8, img: "/images/unsplash/photo-1600334129128-685c5582fd35.jpg", subcategories: ["All", "Massage", "Yoga", "Beauty", "Fitness"] },
  { name: "Tours & Activities", count: 14, img: "/images/unsplash/photo-1527631746610-bca00a040d60.jpg", subcategories: ["All", "City Tours", "Desert Tours", "Wine Tasting", "Cooking Classes"] },
];

interface Place {
  name: string;
  rating: number;
  distance: string;
  cuisine: string;
  price: string;
  hours: string;
  img: string;
  sub: string;
  phone: string;
  address: string;
  desc: string;
  review: string;
}

const PLACES: Place[] = [
  { name: "Mastro's City Hall", rating: 4.8, distance: "0.2 mi", cuisine: "Steakhouse", price: "$$$", hours: "5 PM – 11 PM", img: "/images/unsplash/photo-1414235077428-338989a2e8c0.jpg", sub: "Steakhouse", phone: "+1 (480) 941-4700", address: "6991 E Camelback Rd, Scottsdale", desc: "Upscale steakhouse with an elegant atmosphere, featuring premium cuts, fresh seafood, and an award-winning wine list. Live music nightly.", review: "Best steak in Scottsdale, hands down. The warm butter cake is a must." },
  { name: "Sakura Garden", rating: 4.6, distance: "0.4 mi", cuisine: "Japanese", price: "$$", hours: "11 AM – 10 PM", img: "/images/unsplash/photo-1553621042-f6e147245754.jpg", sub: "Japanese", phone: "+1 (480) 947-2800", address: "7360 N Scottsdale Rd", desc: "Authentic Japanese cuisine featuring sushi, ramen, and teppanyaki prepared by master chefs. Tranquil garden-inspired interior.", review: "The omakase experience was incredible. Fresh fish flown in daily." },
  { name: "The Mission", rating: 4.7, distance: "0.3 mi", cuisine: "Latin-American", price: "$$$", hours: "11 AM – 12 AM", img: "/images/unsplash/photo-1544025162-d76694265947.jpg", sub: "Italian", phone: "+1 (480) 636-5005", address: "3815 N Brown Ave, Old Town", desc: "Modern Latin cuisine in a stunning converted church. Known for tableside guacamole and craft cocktails in a vibrant atmosphere.", review: "Incredible ambiance and the food matches. The duck carnitas are legendary." },
  { name: "Café Lumière", rating: 4.7, distance: "0.1 mi", cuisine: "French Bistro", price: "$$$", hours: "7 AM – 9 PM", img: "/images/unsplash/photo-1554118811-1e0d58224f24.jpg", sub: "Mediterranean", phone: "+1 (480) 555-0142", address: "7014 E 1st Ave, Scottsdale", desc: "Charming French bistro steps from the hotel. Perfect for breakfast croissants, afternoon espresso, or a candlelit dinner.", review: "The crème brûlée alone is worth the visit. Cozy and authentic." },
  { name: "Mariscos del Puerto", rating: 4.4, distance: "0.5 mi", cuisine: "Seafood", price: "$$", hours: "10 AM – 9 PM", img: "/images/unsplash/photo-1565557623262-b51c2513a641.jpg", sub: "Seafood", phone: "+1 (480) 555-0198", address: "4250 N Craftsman Ct", desc: "Fresh Mexican-style seafood with the catch of the day. Known for ceviche, shrimp cocktails, and fish tacos.", review: "Most authentic seafood in the area. The aguachile is perfection." },
  { name: "Citizen Public House", rating: 4.5, distance: "0.6 mi", cuisine: "Gastropub", price: "$$", hours: "11 AM – 11 PM", img: "/images/unsplash/photo-1555396273-367ea4eb4db5.jpg", sub: "Gastropub", phone: "+1 (480) 398-4208", address: "7111 E 5th Ave", desc: "Upscale gastropub with craft cocktails and elevated comfort food. The whiskey selection is one of the best in Arizona.", review: "Great vibes, amazing cocktails. The smoked prime rib is phenomenal." },
  { name: "Olive & Ivy", rating: 4.6, distance: "0.3 mi", cuisine: "Mediterranean", price: "$$$", hours: "11 AM – 10 PM", img: "/images/unsplash/photo-1559339352-11d035aa65de.jpg", sub: "Mediterranean", phone: "+1 (480) 751-2200", address: "7135 E Camelback Rd", desc: "Sophisticated Mediterranean restaurant with a gorgeous patio overlooking the canal. Fresh pastas, grilled meats, and wood-fired pizzas.", review: "Perfect patio dining. The burrata and lamb chops are outstanding." },
  { name: "Hash Kitchen", rating: 4.3, distance: "0.7 mi", cuisine: "Brunch", price: "$$", hours: "7 AM – 3 PM", img: "/images/unsplash/photo-1504674900247-0877df9cc836.jpg", sub: "Brunch", phone: "+1 (480) 947-4274", address: "7375 E Scottsdale Mall", desc: "The ultimate brunch destination with a DIY Bloody Mary bar, creative hash dishes, and weekend DJ sets.", review: "Best brunch spot in Scottsdale. The build-your-own Bloody Mary bar is genius." },
];

/* ─── SUB-COMPONENTS ─── */

function Stars({ rating, size = 10 }: { rating: number; size?: number }) {
  return (
    <div style={{ display: "flex", gap: 1, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width={size} height={size} viewBox="0 0 24 24" fill={s <= Math.round(rating) ? "var(--amber)" : "var(--border)"} stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
        </svg>
      ))}
      <span style={{ fontSize: size <= 10 ? "0.5625rem" : "0.6875rem", color: "var(--text-secondary)", marginLeft: 3 }}>{rating}</span>
    </div>
  );
}

function SubcategoryFilters({ items, active, onSelect }: { items: string[]; active: string; onSelect: (s: string) => void }) {
  return (
    <div className="lst-filters" style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 6, minHeight: 34, alignItems: "center", flexShrink: 0 }}>
      <style>{`.lst-filters::-webkit-scrollbar{display:none}.lst-filters{scrollbar-width:none}.lst-scroll::-webkit-scrollbar{display:none}.lst-scroll{scrollbar-width:none}`}</style>
      {items.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          style={{
            padding: "7px 16px",
            borderRadius: "var(--radius-full)",
            border: active === s ? "2px solid var(--primary)" : "2px solid #BBBBB5",
            background: active === s ? "var(--primary)" : "#FFFFFF",
            color: active === s ? "#fff" : "#333",
            fontSize: "0.6875rem",
            fontWeight: 700,
            whiteSpace: "nowrap",
            cursor: "pointer",
            transition: "all 150ms",
            flexShrink: 0,
            boxShadow: active === s ? "0 1px 4px rgba(18,136,255,0.3)" : "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

/* ─── VIEWS ─── */

type View = "categories" | "listings" | "detail" | "directions";

export default function LST01() {
  const { goBack, navigate: kioskNavigate } = useKiosk();
  const { brand } = useHotel();
  const [view, setView] = useState<View>("categories");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [hovered, setHovered] = useState<number | null>(null);
  const [animDir, setAnimDir] = useState<"forward" | "back">("forward");
  const [animating, setAnimating] = useState(false);
  const [travelMode, setTravelMode] = useState<"walk" | "car">("walk");

  const transition = useCallback((dir: "forward" | "back", nextView: View, cb?: () => void) => {
    setAnimDir(dir);
    setAnimating(true);
    setTimeout(() => {
      setView(nextView);
      cb?.();
      setAnimating(false);
    }, 200);
  }, []);

  const selectCategory = useCallback((name: string) => {
    transition("forward", "listings", () => {
      setSelectedCategory(name);
      setActiveFilter("All");
      setSelectedPlace(null);
    });
  }, [transition]);

  const selectPlace = useCallback((index: number) => {
    transition("forward", "detail", () => {
      setSelectedPlace(index);
    });
  }, [transition]);

  const openDirections = useCallback(() => {
    transition("forward", "directions");
  }, [transition]);

  const goBackView = useCallback(() => {
    if (view === "directions") {
      transition("back", "detail");
    } else if (view === "detail") {
      transition("back", "listings", () => setSelectedPlace(null));
    } else if (view === "listings") {
      transition("back", "categories", () => {
        setSelectedCategory(null);
        setActiveFilter("All");
      });
    } else {
      goBack();
    }
  }, [view, goBack, transition]);

  const category = CATEGORIES.find((c) => c.name === selectedCategory);
  const subcategories = category?.subcategories || [];
  const filteredPlaces = activeFilter === "All" ? PLACES : PLACES.filter((p) => p.sub === activeFilter);
  const place = selectedPlace !== null ? PLACES[selectedPlace] : null;

  const slideOffset = animating ? (animDir === "forward" ? "20px" : "-20px") : "0";
  const exitOffset = animDir === "forward" ? "-20px" : "20px";

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left Panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "16px 20px 0", overflow: "hidden" }}>
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <button onClick={goBackView} style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 800, color: "var(--text)", letterSpacing: -0.3 }}>
                {view === "categories" ? "Explore the Area" : view === "listings" ? selectedCategory : view === "directions" ? "Directions" : place?.name}
              </h1>
              <p style={{ fontSize: "0.5625rem", color: "var(--text-secondary)", marginTop: 1 }}>
                {view === "categories" ? `${CATEGORIES.length} categories nearby` : view === "listings" ? `${filteredPlaces.length} places nearby` : view === "directions" ? `To ${place?.name}` : place?.cuisine}
              </p>
            </div>
            {/* Travel mode badge — only in directions view */}
            {view === "directions" && place && (() => {
              const walkMin = Math.round(parseFloat(place.distance) * 15 + 2);
              const driveMin = Math.max(2, Math.round(parseFloat(place.distance) * 3));
              const activeMin = travelMode === "walk" ? walkMin : driveMin;
              return (
                <div style={{ display: "flex", background: "var(--primary)", borderRadius: "var(--radius-full)", overflow: "hidden", flexShrink: 0 }}>
                  <button onClick={() => setTravelMode("walk")} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: travelMode === "walk" ? "var(--primary)" : "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", color: "#fff", fontSize: "0.5625rem", fontWeight: 700, transition: "background 150ms" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/></svg>
                    {walkMin}m
                  </button>
                  <button onClick={() => setTravelMode("car")} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: travelMode === "car" ? "var(--primary)" : "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", color: "#fff", fontSize: "0.5625rem", fontWeight: 700, transition: "background 150ms" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
                    {driveMin}m
                  </button>
                </div>
              );
            })()}
          </div>

          {/* Content area */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            {/* ── CATEGORIES ── */}
            <div style={{
              position: "absolute", inset: 0,
              opacity: view === "categories" && !animating ? 1 : 0,
              transform: `translateX(${view === "categories" && !animating ? "0" : view === "categories" ? exitOffset : "-30px"})`,
              transition: "opacity 250ms ease, transform 250ms ease",
              pointerEvents: view === "categories" ? "auto" : "none",
              overflowY: "auto", paddingBottom: 16,
            }} className="lst-scroll">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {CATEGORIES.map((cat, i) => (
                  <button key={cat.name} onClick={() => selectCategory(cat.name)} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                    style={{ border: hovered === i ? "2px solid var(--primary)" : "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden", cursor: "pointer", textAlign: "left", background: "var(--bg-card)", padding: 0, transition: "border-color 150ms, transform 150ms", transform: hovered === i ? "translateY(-2px)" : "none" }}>
                    <div style={{ width: "100%", height: 100, background: `url('${cat.img}') center/cover`, position: "relative" }}>
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.6))" }} />
                      <div style={{ position: "absolute", bottom: 6, left: 8, zIndex: 2 }}>
                        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.75rem", color: "#fff" }}>{cat.name}</div>
                        <div style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.7)" }}>{cat.count} places</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ── LISTINGS ── */}
            <div style={{
              position: "absolute", inset: 0,
              opacity: view === "listings" && !animating ? 1 : 0,
              transform: `translateX(${view === "listings" && !animating ? "0" : view !== "listings" && animDir === "forward" ? "-30px" : slideOffset})`,
              transition: "opacity 250ms ease, transform 250ms ease",
              pointerEvents: view === "listings" ? "auto" : "none",
              overflowY: "auto", paddingBottom: 16,
              display: "flex", flexDirection: "column", gap: 6,
            }} className="lst-scroll">
              <SubcategoryFilters items={subcategories} active={activeFilter} onSelect={setActiveFilter} />
              {filteredPlaces.map((p, i) => (
                <button key={i} onClick={() => selectPlace(i)}
                  style={{ display: "flex", gap: 10, padding: 10, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", cursor: "pointer", alignItems: "center", transition: "border-color 150ms", textAlign: "left", width: "100%" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "var(--radius-sm)", overflow: "hidden", flexShrink: 0 }}>
                    <div style={{ width: "100%", height: "100%", background: `url('${p.img}') center/cover` }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.75rem", color: "var(--text)", marginBottom: 3 }}>{p.name}</div>
                    <Stars rating={p.rating} />
                    <div style={{ display: "flex", gap: 8, marginTop: 3, fontSize: "0.5rem", color: "var(--text-secondary)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                        {p.distance}
                      </span>
                      <span>{p.cuisine}</span>
                      <span>{p.price}</span>
                    </div>
                    <div style={{ fontSize: "0.4375rem", color: "var(--text-secondary)", marginTop: 2 }}>
                      <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: "middle", marginRight: 2 }}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                      {p.hours}
                    </div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M9 18l6-6-6-6" /></svg>
                </button>
              ))}
            </div>

            {/* ── DETAIL ── */}
            <div style={{
              position: "absolute", inset: 0,
              opacity: view === "detail" && !animating ? 1 : 0,
              transform: `translateX(${view === "detail" && !animating ? "0" : slideOffset})`,
              transition: "opacity 250ms ease, transform 250ms ease",
              pointerEvents: view === "detail" ? "auto" : "none",
              overflowY: "auto", paddingBottom: 16,
              display: "flex", flexDirection: "column",
            }} className="lst-scroll">
              {place && (
                <>
                  {/* Hero image */}
                  <div style={{ width: "100%", height: 160, borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 14, flexShrink: 0, position: "relative" }}>
                    <div style={{ position: "absolute", inset: 0, background: `url('${place.img}') center/cover` }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.5))" }} />
                    <div style={{ position: "absolute", bottom: 10, left: 12, display: "flex", gap: 6 }}>
                      <span style={{ padding: "3px 8px", background: "var(--primary)", borderRadius: "var(--radius-full)", fontSize: "0.5rem", fontWeight: 700, color: "#fff" }}>{place.cuisine}</span>
                      <span style={{ padding: "3px 8px", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", borderRadius: "var(--radius-full)", fontSize: "0.5rem", fontWeight: 600, color: "#fff" }}>{place.price}</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div style={{ marginBottom: 12 }}>
                    <Stars rating={place.rating} size={12} />
                  </div>

                  {/* Info rows */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14, fontSize: "0.625rem", color: "var(--text-secondary)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      {place.address} · {place.distance}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                      {place.hours}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
                      {place.phone}
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: "0.625rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 14 }}>{place.desc}</p>

                  {/* Review */}
                  <div style={{ padding: 12, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", marginBottom: 16 }}>
                    <div style={{ fontSize: "0.5rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, fontWeight: 600 }}>Recent Review</div>
                    <p style={{ fontSize: "0.5625rem", color: "var(--text)", fontStyle: "italic", lineHeight: 1.5 }}>"{place.review}"</p>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-primary" style={{ flex: 1, fontSize: "0.6875rem", padding: "10px 16px" }} onClick={openDirections}>Get Directions</button>
                  </div>
                </>
              )}
            </div>

            {/* ── DIRECTIONS ── */}
            <div style={{
              position: "absolute", inset: 0,
              opacity: view === "directions" && !animating ? 1 : 0,
              transform: `translateX(${view === "directions" && !animating ? "0" : slideOffset})`,
              transition: "opacity 250ms ease, transform 250ms ease",
              pointerEvents: view === "directions" ? "auto" : "none",
              overflowY: "auto", paddingBottom: 16,
              display: "flex", flexDirection: "column",
            }} className="lst-scroll">
              {place && (() => {
                const walkMin = Math.round(parseFloat(place.distance) * 15 + 2);
                const driveMin = Math.max(2, Math.round(parseFloat(place.distance) * 3));
                const activeMin = travelMode === "walk" ? walkMin : driveMin;
                const modeLabel = travelMode === "walk" ? "Walking" : "Driving";
                return (
                  <>
                    {/* From / To */}
                    <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, paddingTop: 2 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", border: "2px solid var(--primary)", background: "#fff" }} />
                        <div style={{ width: 1, flex: 1, background: "var(--border)", margin: "3px 0" }} />
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--primary)" }} />
                      </div>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 8 }}>
                        <div>
                          <div style={{ fontSize: "0.5rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 0.5 }}>From</div>
                          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.6875rem", color: "var(--text)" }}>{brand.name}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: "0.5rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 0.5 }}>To</div>
                          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.6875rem", color: "var(--text)" }}>{place.name}</div>
                          <div style={{ fontSize: "0.5rem", color: "var(--text-secondary)" }}>{place.address}</div>
                        </div>
                      </div>
                    </div>

                    {/* Step by step directions */}
                    <div style={{ fontSize: "0.5625rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Directions</div>
                    {[
                      { icon: "↑", text: "Head north on Hotel Driveway", dist: "150 ft" },
                      { icon: "→", text: `Turn right onto E Indian School Rd`, dist: "0.1 mi" },
                      { icon: "↑", text: "Continue on Scottsdale Rd", dist: `${(parseFloat(place.distance) * 0.4).toFixed(1)} mi` },
                      { icon: "←", text: `Turn left onto ${place.address.split(",")[0]?.split(" ").slice(-2).join(" ") || "destination street"}`, dist: `${(parseFloat(place.distance) * 0.2).toFixed(1)} mi` },
                      { icon: "◉", text: `Arrive at ${place.name}`, dist: "" },
                    ].map((step, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", paddingBottom: 10, marginBottom: 10, borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                        <div style={{ width: 26, height: 26, borderRadius: "var(--radius-sm)", background: i === 4 ? "var(--primary)" : "var(--bg-card)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6875rem", color: i === 4 ? "#fff" : "var(--text)", flexShrink: 0, fontWeight: 700 }}>{step.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "0.625rem", color: "var(--text)", fontWeight: 500 }}>{step.text}</div>
                          {step.dist && <div style={{ fontSize: "0.5rem", color: "var(--text-secondary)", marginTop: 1 }}>{step.dist}</div>}
                        </div>
                      </div>
                    ))}

                    {/* Info note */}
                    <div style={{ padding: 10, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", display: "flex", gap: 8, alignItems: "flex-start", marginTop: 4, marginBottom: 14 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                      <p style={{ fontSize: "0.5rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>Ask the front desk for a printed map or shuttle service to nearby destinations.</p>
                    </div>

                    {/* Back to Dashboard */}
                    <button className="btn btn-primary" onClick={() => kioskNavigate("DSH-01")} style={{ width: "100%", fontSize: "0.6875rem", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                      Back to Dashboard
                    </button>
                  </>
                );
              })()}
            </div>

          </div>
        </div>

        {/* Right — Persistent Map */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <LSTMap showPins={view !== "categories"} focusedPin={view === "detail" || view === "directions" ? selectedPlace : null} routeTo={view === "directions" ? selectedPlace : null} travelMode={travelMode} />
        </div>
      </div>
    </div>
  );
}
