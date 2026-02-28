"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import GlobalHeader from "@/components/layout/GlobalHeader";

type Category = "All" | "Wellness" | "Dining" | "Entertainment" | "Adventure" | "Kids";
type DateFilter = "All" | "Today" | "Tomorrow" | "This Week" | "Weekend";

interface Event {
  title: string;
  time: string;
  day: DateFilter;
  category: Category;
  desc: string;
  location: string;
  price: string;
  spots: string;
  duration: string;
  img: string;
}

const EVENTS: Event[] = [
  { title: "Wine Tasting", time: "Tonight 7:00 PM", day: "Today", category: "Dining", desc: "Sample curated wines from local vineyards with our sommelier.", location: "Rooftop Terrace", price: "$45/person", spots: "8 spots left", duration: "2 hrs", img: "/images/unsplash/photo-1510812431401-41d2bd2722f3.jpg" },
  { title: "Yoga by the Pool", time: "Tomorrow 6:00 AM", day: "Tomorrow", category: "Wellness", desc: "Start your morning with a rejuvenating poolside yoga session.", location: "Infinity Pool Deck", price: "Complimentary", spots: "12 spots left", duration: "1 hr", img: "/images/unsplash/photo-1544367567-0f2fcb009e0b.jpg" },
  { title: "Live Jazz Night", time: "Friday 8:00 PM", day: "Weekend", category: "Entertainment", desc: "Enjoy smooth jazz performances in the rooftop lounge.", location: "Sky Lounge, Floor 20", price: "$30/person", spots: "20 spots left", duration: "3 hrs", img: "/images/unsplash/photo-1511192336575-5a79af67a629.jpg" },
  { title: "Cooking Class", time: "Saturday 10:00 AM", day: "Weekend", category: "Dining", desc: "Learn to prepare regional dishes with our executive chef.", location: "Chef's Kitchen", price: "$65/person", spots: "6 spots left", duration: "2.5 hrs", img: "/images/unsplash/photo-1556910103-1c02745aae4d.jpg" },
  { title: "Sunset Cruise", time: "Sunday 5:30 PM", day: "Weekend", category: "Adventure", desc: "A private catamaran cruise along the coast with cocktails.", location: "Marina Dock B", price: "$95/person", spots: "4 spots left", duration: "2 hrs", img: "/images/unsplash/photo-1544551763-46a013bb70d5.jpg" },
  { title: "Spa & Sound Bath", time: "Tomorrow 3:00 PM", day: "Tomorrow", category: "Wellness", desc: "Deep relaxation with crystal bowls and guided meditation.", location: "Wellness Center", price: "$55/person", spots: "10 spots left", duration: "1.5 hrs", img: "/images/unsplash/photo-1600334129128-685c5582fd35.jpg" },
  { title: "Mixology Workshop", time: "Tonight 9:00 PM", day: "Today", category: "Dining", desc: "Craft signature cocktails with our award-winning bartender.", location: "Lobby Bar", price: "$40/person", spots: "10 spots left", duration: "1.5 hrs", img: "/images/unsplash/photo-1514362545857-3bc16c4c7d1b.jpg" },
  { title: "Guided Snorkeling", time: "Tomorrow 9:00 AM", day: "Tomorrow", category: "Adventure", desc: "Explore the coral reef with a certified marine guide.", location: "Beach Hut", price: "$75/person", spots: "6 spots left", duration: "3 hrs", img: "/images/unsplash/photo-1544551763-77ef2d0cfc6c.jpg" },
  { title: "Kids Art Camp", time: "Saturday 11:00 AM", day: "Weekend", category: "Kids", desc: "Painting and crafts for kids ages 4-12 with our activities team.", location: "Kids Club", price: "Complimentary", spots: "15 spots left", duration: "2 hrs", img: "/images/unsplash/photo-1513364776144-60967b0f800f.jpg" },
  { title: "Stargazing Night", time: "Friday 9:30 PM", day: "Weekend", category: "Entertainment", desc: "Telescope viewing with an astronomer on the observation deck.", location: "Observation Deck", price: "$25/person", spots: "18 spots left", duration: "1.5 hrs", img: "/images/unsplash/photo-1519681393784-d120267933ba.jpg" },
  { title: "Morning Pilates", time: "Tomorrow 7:30 AM", day: "Tomorrow", category: "Wellness", desc: "Core-strengthening session overlooking the ocean.", location: "Beachfront Pavilion", price: "Complimentary", spots: "14 spots left", duration: "45 min", img: "/images/unsplash/photo-1518611012118-696072aa579a.jpg" },
  { title: "Seafood BBQ Night", time: "Saturday 6:30 PM", day: "Weekend", category: "Dining", desc: "Fresh-caught seafood grilled poolside with live acoustic music.", location: "Pool Deck", price: "$85/person", spots: "22 spots left", duration: "3 hrs", img: "/images/unsplash/photo-1555396273-367ea4eb4db5.jpg" },
];

const CATEGORIES: Category[] = ["All", "Wellness", "Dining", "Entertainment", "Adventure", "Kids"];
const DATE_FILTERS: DateFilter[] = ["All", "Today", "Tomorrow", "This Week", "Weekend"];

const CAT_ICONS: Record<Category, React.ReactNode> = {
  All: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>,
  Wellness: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 0110 10c0 5.52-4.48 10-10 10S2 17.52 2 12h10V2z"/></svg>,
  Dining: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/></svg>,
  Entertainment: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  Adventure: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 20l9-16 9 16H3z"/></svg>,
  Kids: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
};

export default function EVT01() {
  const { navigate, goBack } = useKiosk();
  const [category, setCategory] = useState<Category>("All");
  const [dateFilter, setDateFilter] = useState<DateFilter>("All");
  const [catOpen, setCatOpen] = useState(false);

  const filtered = EVENTS.filter(e => {
    const catMatch = category === "All" || e.category === category;
    const dateMatch = dateFilter === "All" || e.day === dateFilter || (dateFilter === "This Week");
    return catMatch && dateMatch;
  });

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", padding: "14px 24px 0" }}>
        {/* Title + Filters row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <button onClick={goBack} style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 800, color: "var(--text)", letterSpacing: -0.3 }}>Hotel Events</h1>
            <p style={{ fontSize: "0.5625rem", color: "var(--text-secondary)", marginTop: 1 }}>{filtered.length} events found</p>
          </div>

          <div style={{ flex: 1 }} />

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {DATE_FILTERS.map(d => (
            <button key={d} onClick={() => setDateFilter(d)} style={{ padding: "5px 12px", borderRadius: "var(--radius-full)", border: `1.5px solid ${dateFilter === d ? "var(--primary)" : "var(--border)"}`, background: dateFilter === d ? "color-mix(in srgb, var(--primary) 8%, transparent)" : "transparent", color: dateFilter === d ? "var(--primary)" : "var(--text-secondary)", fontWeight: dateFilter === d ? 600 : 400, fontSize: "0.5625rem", cursor: "pointer", minHeight: 28 }}>{d}</button>
          ))}

          <div style={{ width: 1, height: 20, background: "var(--border)", margin: "0 2px", flexShrink: 0 }} />

          {/* Category dropdown */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setCatOpen(!catOpen)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px 5px 10px", borderRadius: "var(--radius-full)", border: `1.5px solid ${category !== "All" ? "var(--primary)" : "var(--border)"}`, background: category !== "All" ? "color-mix(in srgb, var(--primary) 8%, transparent)" : "var(--bg-card)", color: category !== "All" ? "var(--primary)" : "var(--text-secondary)", fontWeight: category !== "All" ? 600 : 400, fontSize: "0.5625rem", cursor: "pointer", minHeight: 28 }}>
              {CAT_ICONS[category]}
              {category === "All" ? "Category" : category}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: catOpen ? "rotate(180deg)" : "none", transition: "transform 150ms" }}><path d="M6 9l6 6 6-6"/></svg>
            </button>
            {catOpen && (
              <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, minWidth: 140, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", overflow: "hidden" }}>
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => { setCategory(c); setCatOpen(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", border: "none", background: category === c ? "color-mix(in srgb, var(--primary) 6%, transparent)" : "transparent", color: category === c ? "var(--primary)" : "var(--text)", fontSize: "0.5625rem", fontWeight: category === c ? 600 : 400, cursor: "pointer", textAlign: "left" }}>
                    {CAT_ICONS[c]}
                    {c}
                    {category === c && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" style={{ marginLeft: "auto" }}><path d="M20 6L9 17l-5-5"/></svg>}
                  </button>
                ))}
              </div>
            )}
          </div>
          </div>
        </div>

        {/* Event grid */}
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: 16 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "var(--text-secondary)", fontSize: "0.75rem" }}>No events match your filters</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {filtered.map((evt, i) => (
                <div key={i} onClick={() => navigate("EVT-02")} style={{ borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", transition: "transform 200ms" }}>
                  <div style={{ height: 90, background: `url('${evt.img}') center/cover`, position: "relative" }}>
                    <span style={{ position: "absolute", bottom: 6, left: 6, background: "var(--primary)", color: "#fff", fontSize: "0.4375rem", fontWeight: 700, padding: "2px 7px", borderRadius: "var(--radius-full)" }}>{evt.time}</span>
                    <span style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", color: "#fff", fontSize: "0.4375rem", fontWeight: 500, padding: "2px 6px", borderRadius: "var(--radius-full)" }}>{evt.category}</span>
                  </div>
                  <div style={{ padding: "8px 10px" }}>
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.6875rem", color: "var(--text)", marginBottom: 2 }}>{evt.title}</h3>
                    <p style={{ fontSize: "0.5rem", color: "var(--text-secondary)", lineHeight: 1.4, marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{evt.desc}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span style={{ fontSize: "0.4375rem", color: "var(--text-secondary)" }}>{evt.location}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 5 }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                      <span style={{ fontSize: "0.4375rem", color: "var(--text-secondary)" }}>{evt.duration}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.5625rem", fontWeight: 700, color: "var(--text)" }}>{evt.price}</span>
                      <span style={{ fontSize: "0.4375rem", color: "var(--primary)", fontWeight: 600 }}>{evt.spots}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
