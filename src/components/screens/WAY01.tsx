"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import { useToast } from "@/lib/use-toast";
import GlobalHeader from "@/components/layout/GlobalHeader";

/* ─── Types ─── */
interface Destination {
  id: string;
  name: string;
  floor: number; // 1, 2, or 12
  distance: string;
  img: string;
  color: string;
  area: { x: number; y: number; w: number; h: number; rx?: number };
  directions: string[];
  icon: (c: string) => React.ReactNode;
}

/* ─── All destinations across floors ─── */
const DESTINATIONS: Destination[] = [
  // Floor 1
  {
    id: "lobby", name: "Lobby & Reception", floor: 1, distance: "You are here",
    img: "/images/unsplash/photo-1566073771259-6a8506099945.jpg",
    color: "#1288FF",
    area: { x: 180, y: 180, w: 160, h: 100, rx: 8 },
    directions: ["You are currently at the Lobby.", "The reception desk is directly in front of you."],
    icon: (c) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/></svg>,
  },
  {
    id: "pool", name: "Pool & Cabanas", floor: 1, distance: "2 min walk",
    img: "/images/unsplash/photo-1582268611958-ebfd161ef9cf.jpg",
    color: "#0EA5E9",
    area: { x: 420, y: 25, w: 240, h: 130, rx: 10 },
    directions: ["Exit the lobby and turn right.", "Walk past the restaurant entrance.", "Continue through the glass doors to the outdoor area.", "The pool and cabanas are straight ahead."],
    icon: (c) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M2 12h20M2 12c1 2 3 3 5 3s4-1 5-3c1 2 3 3 5 3s4-1 5-3"/><circle cx="12" cy="6" r="2"/></svg>,
  },
  {
    id: "restaurant", name: "Restaurant & Bar", floor: 1, distance: "1 min walk",
    img: "/images/unsplash/photo-1517248135467-4c7edcad34c4.jpg",
    color: "#F59E0B",
    area: { x: 20, y: 25, w: 180, h: 120, rx: 8 },
    directions: ["From the lobby, turn left.", "Walk through the main corridor.", "The restaurant entrance is on your left."],
    icon: (c) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/></svg>,
  },
  {
    id: "spa", name: "Spa & Wellness", floor: 1, distance: "3 min walk",
    img: "/images/unsplash/photo-1544161515-4ab6ce6db874.jpg",
    color: "#A855F7",
    area: { x: 420, y: 180, w: 130, h: 100, rx: 8 },
    directions: ["Exit the lobby and turn right.", "Pass the elevator bank.", "Continue down the corridor.", "The spa entrance is at the end on your right."],
    icon: (c) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M12 22c-4-3-8-6-8-11a8 8 0 0116 0c0 5-4 8-8 11z"/><circle cx="12" cy="11" r="3"/></svg>,
  },
  {
    id: "business", name: "Business Center", floor: 1, distance: "2 min walk",
    img: "/images/unsplash/photo-1497366216548-37526070297c.jpg",
    color: "#64748B",
    area: { x: 20, y: 170, w: 140, h: 70, rx: 8 },
    directions: ["From the lobby, turn left.", "Walk past the restaurant.", "The business center is the second door on your left."],
    icon: (c) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  },
  {
    id: "gift", name: "Gift Shop", floor: 1, distance: "1 min walk",
    img: "/images/unsplash/photo-1441986300917-64674bd600d8.jpg",
    color: "#10B981",
    area: { x: 20, y: 260, w: 140, h: 50, rx: 8 },
    directions: ["From the lobby, turn left.", "Walk to the end of the corridor.", "The gift shop is on your left near the entrance."],
    icon: (c) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 010-5C9 3 12 8 12 8s3-5 4.5-5a2.5 2.5 0 010 5"/></svg>,
  },
  // Floor 2
  {
    id: "gym", name: "Fitness Center", floor: 2, distance: "4 min walk",
    img: "/images/unsplash/photo-1534438327276-14e5300c3a48.jpg",
    color: "#EF4444",
    area: { x: 20, y: 25, w: 200, h: 130, rx: 8 },
    directions: ["From the lobby, take the elevator to Floor 2.", "Turn left out of the elevator.", "The Fitness Center is at the end of the hallway."],
    icon: (c) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M6.5 6.5L17.5 17.5M6.5 17.5L17.5 6.5"/><rect x="2" y="9" width="4" height="6" rx="1"/><rect x="18" y="9" width="4" height="6" rx="1"/><path d="M6 12h12"/></svg>,
  },
  {
    id: "conference", name: "Conference Rooms", floor: 2, distance: "4 min walk",
    img: "/images/unsplash/photo-1431540015159-0f9673630730.jpg",
    color: "#6366F1",
    area: { x: 20, y: 180, w: 200, h: 100, rx: 8 },
    directions: ["From the lobby, take the elevator to Floor 2.", "Turn left out of the elevator.", "Continue past the Fitness Center.", "Conference Rooms A, B, and C are on your right."],
    icon: (c) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  },
  {
    id: "kids", name: "Kids Club", floor: 2, distance: "5 min walk",
    img: "/images/unsplash/photo-1566140967404-b8b3932483f5.jpg",
    color: "#F97316",
    area: { x: 420, y: 25, w: 240, h: 100, rx: 10 },
    directions: ["From the lobby, take the elevator to Floor 2.", "Turn right out of the elevator.", "Walk past the guest rooms.", "The Kids Club is at the end of the corridor."],
    icon: (c) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="4" r="2"/><path d="M12 6v6M9 12l-2 8M15 12l2 8M8 21h8"/></svg>,
  },
  {
    id: "laundry", name: "Laundry Room", floor: 2, distance: "4 min walk",
    img: "/images/unsplash/photo-1545173168-9f1947eebb7f.jpg",
    color: "#14B8A6",
    area: { x: 420, y: 150, w: 130, h: 80, rx: 8 },
    directions: ["From the lobby, take the elevator to Floor 2.", "Turn right out of the elevator.", "First door on your right."],
    icon: (c) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="2"/><circle cx="12" cy="13" r="5"/><path d="M12 8v.01"/></svg>,
  },
  // Floor 12
  {
    id: "rooftop", name: "Rooftop Lounge", floor: 12, distance: "Elevator access",
    img: "/images/unsplash/photo-1470337458703-46ad1756a187.jpg",
    color: "#EC4899",
    area: { x: 20, y: 25, w: 300, h: 140, rx: 12 },
    directions: ["From the lobby, take the elevator to Floor 12.", "Exit the elevator and turn right.", "Follow the illuminated pathway.", "The Rooftop Lounge entrance is through the glass doors."],
    icon: (c) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  },
  {
    id: "skybar", name: "Sky Bar", floor: 12, distance: "Elevator access",
    img: "/images/unsplash/photo-1514933651103-005eec06c04b.jpg",
    color: "#8B5CF6",
    area: { x: 350, y: 25, w: 310, h: 140, rx: 12 },
    directions: ["From the lobby, take the elevator to Floor 12.", "Exit the elevator and turn left.", "The Sky Bar is immediately to your left with panoramic views."],
    icon: (c) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><path d="M6 1v3M10 1v3M14 1v3"/></svg>,
  },
  {
    id: "observation", name: "Observation Deck", floor: 12, distance: "Elevator access",
    img: "/images/unsplash/photo-1506929562872-bb421503ef21.jpg",
    color: "#0EA5E9",
    area: { x: 20, y: 195, w: 640, h: 80, rx: 10 },
    directions: ["From the lobby, take the elevator to Floor 12.", "Walk straight from the elevator.", "The Observation Deck wraps around the entire south side of the building.", "Best sunset views are from the west corner."],
    icon: (c) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  },
];

const FLOORS = [
  { num: 1, label: "Floor 1", subtitle: "Lobby Level" },
  { num: 2, label: "Floor 2", subtitle: "Amenities" },
  { num: 12, label: "Floor 12", subtitle: "Rooftop" },
];

/* ─── Walking paths per floor (from elevator/lobby to each area) ─── */
const KIOSK_POS: Record<number, { x: number; y: number }> = {
  1: { x: 260, y: 240 },
  2: { x: 310, y: 160 },
  12: { x: 340, y: 280 },
};

const PATHS: Record<string, string> = {
  lobby: "",
  pool: "M 260,230 L 260,160 L 400,160 L 400,90 L 420,90",
  restaurant: "M 260,230 L 260,160 L 110,160 L 110,145",
  spa: "M 260,230 L 260,160 L 400,160 L 400,230 L 420,230",
  business: "M 260,230 L 260,205 L 160,205",
  gift: "M 260,230 L 260,260 L 160,260 L 90,285",
  gym: "M 310,160 L 240,160 L 120,90",
  conference: "M 310,160 L 240,160 L 120,230",
  kids: "M 310,160 L 420,160 L 540,75",
  laundry: "M 310,160 L 420,160 L 485,190",
  rooftop: "M 340,280 L 340,165 L 170,95",
  skybar: "M 340,280 L 340,165 L 505,95",
  observation: "M 340,280 L 340,235",
};

/* ─── Decorative elements per floor ─── */
function FloorDecorations({ floor }: { floor: number }) {
  if (floor === 1) return (
    <>
      <defs>
        <linearGradient id="corridorGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E8E4DD" stopOpacity="0.6"/>
          <stop offset="50%" stopColor="#F0ECE6" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#E8E4DD" stopOpacity="0.6"/>
        </linearGradient>
      </defs>
      {/* Corridors — warm beige */}
      <rect x="200" y="153" width="200" height="20" rx="2" fill="url(#corridorGrad)" />
      <rect x="345" y="153" width="75" height="20" rx="2" fill="url(#corridorGrad)" />
      {/* Corridor floor pattern (subtle lines) */}
      {[0,1,2,3,4,5,6,7,8].map(i => (
        <line key={`cl-${i}`} x1={210 + i * 22} y1="155" x2={210 + i * 22} y2="171" stroke="#D5CFC6" strokeWidth="0.5" opacity="0.4" />
      ))}
      {/* Interior walls — thicker, warm brown */}
      <line x1="10" y1="160" x2="345" y2="160" stroke="#C8C0B4" strokeWidth="2" />
      <line x1="410" y1="180" x2="670" y2="180" stroke="#C8C0B4" strokeWidth="2" />
      <line x1="345" y1="20" x2="345" y2="160" stroke="#C8C0B4" strokeWidth="2" />
      <line x1="190" y1="160" x2="190" y2="320" stroke="#C8C0B4" strokeWidth="2" />
      <line x1="410" y1="20" x2="410" y2="320" stroke="#C8C0B4" strokeWidth="2" />
      {/* Elevator bank */}
      <g transform="translate(355, 85)">
        <rect width="50" height="55" rx="8" fill="#EDE9E1" stroke="#C8C0B4" strokeWidth="1.5" />
        <rect x="6" y="6" width="17" height="22" rx="3" fill="#FFFEFA" stroke="#C8C0B4" strokeWidth="0.75" />
        <rect x="27" y="6" width="17" height="22" rx="3" fill="#FFFEFA" stroke="#C8C0B4" strokeWidth="0.75" />
        <text x="14.5" y="18" textAnchor="middle" fontSize="7" fill="#9CA3AF">▲</text>
        <text x="35.5" y="18" textAnchor="middle" fontSize="7" fill="#9CA3AF">▼</text>
        <text x="25" y="47" textAnchor="middle" fontSize="6" fill="#9CA3AF" fontWeight="700" fontFamily="Inter, sans-serif">Elevators</text>
      </g>
      {/* Plants in corridors */}
      <circle cx="215" cy="163" r="4" fill="#22C55E" opacity="0.2" /><circle cx="215" cy="163" r="2" fill="#22C55E" opacity="0.35" />
      <circle cx="390" cy="163" r="4" fill="#22C55E" opacity="0.2" /><circle cx="390" cy="163" r="2" fill="#22C55E" opacity="0.35" />
      <circle cx="340" cy="163" r="3.5" fill="#22C55E" opacity="0.15" /><circle cx="340" cy="163" r="1.5" fill="#22C55E" opacity="0.3" />
      {/* Entrance */}
      <g transform="translate(230, 292)">
        <rect width="60" height="22" rx="11" fill="#1A1A1A" />
        <text x="30" y="14" textAnchor="middle" fontSize="7" fill="#fff" fontWeight="700" fontFamily="Inter, sans-serif">ENTRANCE</text>
      </g>
      <path d="M 260,314 L 260,320" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 252,318 L 260,322 L 268,318" fill="none" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />
      {/* Room wing */}
      <text x="540" y="165" textAnchor="middle" fontSize="7" fill="#B8B0A4" fontWeight="700" fontFamily="Inter, sans-serif" letterSpacing="2">GUEST ROOMS</text>
      {[0,1,2,3,4,5].map(i => (
        <g key={`r1-${i}`}>
          <rect x={430 + (i % 3) * 80} y={i < 3 ? 30 : 80} width="65" height="38" rx="5" fill="#F5F0E8" stroke="#D5CFC6" strokeWidth="1" />
          <rect x={430 + (i % 3) * 80 + 2} y={i < 3 ? 32 : 82} width="12" height="8" rx="2" fill="#D5CFC6" opacity="0.5" />
          <text x={430 + (i % 3) * 80 + 32} y={i < 3 ? 55 : 105} textAnchor="middle" fontSize="8" fill="#B8B0A4" fontWeight="600" fontFamily="Inter, sans-serif">{1200 + i + 1}</text>
        </g>
      ))}
      {/* Restrooms */}
      <g transform="translate(565, 195)">
        <rect width="90" height="85" rx="8" fill="#F0ECE6" stroke="#D5CFC6" strokeWidth="1" />
        <text x="45" y="42" textAnchor="middle" fontSize="14" fill="#9CA3AF">🚻</text>
        <text x="45" y="62" textAnchor="middle" fontSize="6.5" fill="#B8B0A4" fontWeight="600" fontFamily="Inter, sans-serif">Restrooms</text>
      </g>
    </>
  );
  if (floor === 2) return (
    <>
      <defs>
        <linearGradient id="corridor2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E8E4DD" stopOpacity="0.6"/>
          <stop offset="50%" stopColor="#F0ECE6" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#E8E4DD" stopOpacity="0.6"/>
        </linearGradient>
      </defs>
      {/* Corridor */}
      <rect x="230" y="148" width="180" height="24" rx="2" fill="url(#corridor2)" />
      {/* Interior walls */}
      <line x1="230" y1="145" x2="410" y2="145" stroke="#C8C0B4" strokeWidth="2" />
      <line x1="230" y1="175" x2="410" y2="175" stroke="#C8C0B4" strokeWidth="2" />
      <line x1="230" y1="20" x2="230" y2="320" stroke="#C8C0B4" strokeWidth="2" />
      <line x1="410" y1="20" x2="410" y2="320" stroke="#C8C0B4" strokeWidth="2" />
      {/* Plants */}
      <circle cx="260" cy="160" r="4" fill="#22C55E" opacity="0.2" /><circle cx="260" cy="160" r="2" fill="#22C55E" opacity="0.35" />
      <circle cx="380" cy="160" r="4" fill="#22C55E" opacity="0.2" /><circle cx="380" cy="160" r="2" fill="#22C55E" opacity="0.35" />
      {/* Elevator */}
      <g transform="translate(295, 108)">
        <rect width="50" height="35" rx="8" fill="#EDE9E1" stroke="#C8C0B4" strokeWidth="1.5" />
        <text x="16" y="20" textAnchor="middle" fontSize="7" fill="#9CA3AF">▲</text>
        <text x="34" y="20" textAnchor="middle" fontSize="7" fill="#9CA3AF">▼</text>
        <text x="25" y="31" textAnchor="middle" fontSize="5.5" fill="#9CA3AF" fontWeight="700" fontFamily="Inter, sans-serif">Elevators</text>
      </g>
      {/* Room blocks */}
      <text x="540" y="215" textAnchor="middle" fontSize="7" fill="#B8B0A4" fontWeight="700" fontFamily="Inter, sans-serif" letterSpacing="2">GUEST ROOMS</text>
      {[0,1,2,3,4,5].map(i => (
        <g key={`r2-${i}`}>
          <rect x={430 + (i % 3) * 75} y={i < 3 ? 150 : 230} width="60" height="38" rx="5" fill="#F5F0E8" stroke="#D5CFC6" strokeWidth="1" />
          <rect x={430 + (i % 3) * 75 + 2} y={i < 3 ? 152 : 232} width="10" height="7" rx="2" fill="#D5CFC6" opacity="0.5" />
          <text x={430 + (i % 3) * 75 + 30} y={i < 3 ? 175 : 255} textAnchor="middle" fontSize="8" fill="#B8B0A4" fontWeight="600" fontFamily="Inter, sans-serif">{1210 + i + 1}</text>
        </g>
      ))}
      {/* Vending */}
      <g transform="translate(250, 200)">
        <rect width="55" height="45" rx="6" fill="#F0ECE6" stroke="#D5CFC6" strokeWidth="1" />
        <text x="27" y="25" textAnchor="middle" fontSize="12" fill="#9CA3AF">🧃</text>
        <text x="27" y="38" textAnchor="middle" fontSize="5.5" fill="#B8B0A4" fontWeight="600" fontFamily="Inter, sans-serif">Vending</text>
      </g>
    </>
  );
  // Floor 12 — Rooftop
  return (
    <>
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FDF2F8" stopOpacity="0.8"/>
          <stop offset="50%" stopColor="#F5F3FF" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#EFF6FF" stopOpacity="0.8"/>
        </linearGradient>
      </defs>
      {/* Sky atmosphere */}
      <rect x="12" y="22" width="656" height="296" rx="12" fill="url(#skyGrad)" />
      {/* Glass railing lines (top & bottom) */}
      <line x1="20" y1="185" x2="660" y2="185" stroke="#C8C0B4" strokeWidth="1.5" strokeDasharray="4 3" />
      {/* Stars/lights decoration */}
      {[50,130,220,340,440,520,600].map((x, i) => (
        <circle key={`star-${i}`} cx={x} cy={30 + (i % 3) * 5} r="1.5" fill="#F59E0B" opacity={0.2 + (i % 3) * 0.1} />
      ))}
      {/* Elevator */}
      <g transform="translate(315, 270)">
        <rect width="50" height="35" rx="8" fill="#EDE9E1" stroke="#C8C0B4" strokeWidth="1.5" />
        <text x="16" y="20" textAnchor="middle" fontSize="7" fill="#9CA3AF">▲</text>
        <text x="34" y="20" textAnchor="middle" fontSize="7" fill="#9CA3AF">▼</text>
        <text x="25" y="31" textAnchor="middle" fontSize="5.5" fill="#9CA3AF" fontWeight="700" fontFamily="Inter, sans-serif">Elevators</text>
      </g>
      {/* Panoramic label */}
      <text x="340" y="178" textAnchor="middle" fontSize="7" fill="#B8B0A4" fontWeight="700" fontFamily="Inter, sans-serif" letterSpacing="3">✦ PANORAMIC VIEWS ✦</text>
      {/* Decorative plants */}
      {[40,170,500,630].map((x, i) => (
        <g key={`plant-${i}`}>
          <circle cx={x} cy="195" r="5" fill="#22C55E" opacity="0.15" />
          <circle cx={x} cy="195" r="2.5" fill="#22C55E" opacity="0.3" />
        </g>
      ))}
    </>
  );
}

export default function WAY01() {
  const { goBack } = useKiosk();
  const toast = useToast();
  const [activeFloor, setActiveFloor] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const [showDirections, setShowDirections] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const floorDests = DESTINATIONS.filter(d => d.floor === activeFloor);
  const filtered = floorDests.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
  const activeId = selected || hoveredArea;
  const selectedDest = DESTINATIONS.find(d => d.id === selected);
  const kiosk = KIOSK_POS[activeFloor];

  const handleSelect = (id: string) => {
    if (selected === id) {
      setSelected(null);
      setShowDirections(false);
    } else {
      const dest = DESTINATIONS.find(d => d.id === id);
      if (dest && dest.floor !== activeFloor) setActiveFloor(dest.floor);
      setSelected(id);
      setShowDirections(false);
    }
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)", position: "relative" }}>
      <GlobalHeader />
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ─── Left panel ─── */}
        <div style={{ width: "38%", display: "flex", flexDirection: "column", borderRight: "1px solid var(--border)", flexShrink: 0 }}>
          {/* Header */}
          <div style={{ padding: "14px 18px 8px", display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={goBack} style={{ width: 40, height: 40, borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 800, color: "var(--text)", margin: 0 }}>Wayfinding</h1>
              <p style={{ fontSize: "0.5625rem", color: "var(--text-secondary)", margin: 0, marginTop: 1 }}>Tap a destination for directions</p>
            </div>
          </div>

          {/* Floor tabs */}
          <div style={{ padding: "0 18px 8px", display: "flex", gap: 5 }}>
            {FLOORS.map(f => (
              <button key={f.num} onClick={() => { setActiveFloor(f.num); setSelected(null); setShowDirections(false); }} style={{
                flex: 1, padding: "7px 0", borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
                border: activeFloor === f.num ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                background: activeFloor === f.num ? "rgba(18,136,255,0.06)" : "var(--bg-card)",
                color: activeFloor === f.num ? "var(--primary)" : "var(--text-secondary)",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "0.6875rem", fontWeight: 700 }}>{f.label}</div>
                <div style={{ fontSize: "0.5rem", opacity: 0.7, marginTop: 1 }}>{f.subtitle}</div>
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ padding: "0 18px 6px" }}>
            <div style={{ position: "relative" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}>
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{
                width: "100%", padding: "7px 10px 7px 30px", borderRadius: 999, border: "1px solid var(--border)",
                background: "var(--bg-card)", color: "var(--text)", fontSize: "0.6875rem", outline: "none", fontFamily: "inherit",
              }} />
            </div>
          </div>

          {/* Destination list */}
          <div style={{ flex: 1, overflowY: "auto", padding: "0 18px 10px", display: "flex", flexDirection: "column", gap: 3 }} className="way-scroll">
            {filtered.map(dest => {
              const isActive = selected === dest.id;
              return (
                <button key={dest.id} onClick={() => handleSelect(dest.id)}
                  onMouseEnter={() => setHoveredArea(dest.id)} onMouseLeave={() => setHoveredArea(null)}
                  style={{
                    display: "flex", gap: 10, padding: "8px 10px", borderRadius: 10, width: "100%",
                    border: isActive ? `1.5px solid ${dest.color}40` : "1.5px solid transparent",
                    background: isActive ? `${dest.color}08` : "transparent",
                    cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 200ms",
                  }}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                    background: isActive ? `${dest.color}15` : "var(--bg-elevated)",
                    display: "flex", alignItems: "center", justifyContent: "center", transition: "all 200ms",
                  }}>
                    {dest.icon(isActive ? dest.color : "var(--text-tertiary)")}
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 2 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 600, color: isActive ? dest.color : "var(--text)" }}>{dest.name}</div>
                    <div style={{ fontSize: "0.5625rem", color: "var(--text-secondary)" }}>{dest.distance}</div>
                  </div>
                  {isActive && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", background: dest.color, flexShrink: 0, alignSelf: "center" }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* View Directions + Share buttons */}
          {selected && selectedDest && (
            <div style={{ padding: "8px 18px 12px", borderTop: "1px solid var(--border)", display: "flex", gap: 6 }}>
              <button onClick={() => setShowDirections(true)} style={{
                flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit",
                background: selectedDest.color, color: "#fff", fontSize: "0.6875rem", fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                View Directions
              </button>
              <button onClick={() => setShowShare(true)} style={{
                width: 42, height: 42, borderRadius: 10, border: "1px solid var(--border)",
                background: "var(--bg-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
              </button>
            </div>
          )}
        </div>

        {/* ─── Right: Floor Plan SVG ─── */}
        <div style={{
          flex: 1, position: "relative", overflow: "hidden",
          background: "linear-gradient(145deg, #FAF8F5, #F0EDE8)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {/* Subtle warm grid */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.25, backgroundImage: "radial-gradient(circle, #c5b9a8 0.5px, transparent 0.5px)", backgroundSize: "18px 18px" }} />

          <svg viewBox="0 0 680 340" style={{ width: "92%", maxWidth: 680, position: "relative", zIndex: 1, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.06))" }}>
            {/* Building outline */}
            <rect x="10" y="20" width="660" height="300" rx="14" fill="#FFFEFA" stroke="#C8C0B4" strokeWidth="2" />

            {/* Floor-specific decorations */}
            <FloorDecorations floor={activeFloor} />

            {/* Interactive areas */}
            {floorDests.map(dest => {
              const a = dest.area;
              const isActive = activeId === dest.id;
              return (
                <g key={dest.id} style={{ cursor: "pointer" }}
                  onClick={() => handleSelect(dest.id)}
                  onMouseEnter={() => setHoveredArea(dest.id)}
                  onMouseLeave={() => setHoveredArea(null)}
                >
                  {/* Outer glow when active */}
                  {isActive && <rect x={a.x-4} y={a.y-4} width={a.w+8} height={a.h+8} rx={(a.rx||0)+4} fill={`${dest.color}08`} stroke={dest.color} strokeWidth="1.5" opacity="0.35" />}
                  {/* Area fill — ALWAYS tinted */}
                  <rect x={a.x} y={a.y} width={a.w} height={a.h} rx={a.rx||0}
                    fill={isActive ? `${dest.color}20` : `${dest.color}0A`}
                    stroke={isActive ? dest.color : `${dest.color}35`}
                    strokeWidth={isActive ? 2 : 1.25}
                    style={{ transition: "all 250ms cubic-bezier(.4,0,.2,1)" }}
                  />
                  {/* Left color accent bar */}
                  <rect x={a.x} y={a.y} width={4} height={a.h} rx={2} fill={isActive ? dest.color : `${dest.color}50`} style={{ transition: "fill 250ms" }} />
                  {/* Icon circle with real icon color */}
                  <circle cx={a.x + a.w/2} cy={a.y + a.h/2 - 8} r="13" fill={isActive ? `${dest.color}25` : `${dest.color}10`} stroke={isActive ? `${dest.color}50` : `${dest.color}20`} strokeWidth="1" style={{ transition: "all 250ms" }} />
                  {/* Emoji/icon hint in center */}
                  <text x={a.x + a.w/2} y={a.y + a.h/2 - 4} textAnchor="middle" fontSize="11" fill={isActive ? dest.color : `${dest.color}80`} style={{ transition: "fill 250ms" }}>
                    {dest.id === "pool" ? "🏊" : dest.id === "spa" ? "🧖" : dest.id === "restaurant" ? "🍽" : dest.id === "gym" ? "🏋️" : dest.id === "business" ? "💼" : dest.id === "gift" ? "🎁" : dest.id === "lobby" ? "🏨" : dest.id === "rooftop" ? "🌅" : dest.id === "skybar" ? "🍸" : dest.id === "observation" ? "🌇" : dest.id === "conference" ? "👥" : dest.id === "kids" ? "🎨" : dest.id === "laundry" ? "👕" : "📍"}
                  </text>
                  {/* Label */}
                  <text x={a.x + a.w/2} y={a.y + a.h/2 + 14} textAnchor="middle" fill={isActive ? dest.color : `${dest.color}CC`} fontSize="9" fontWeight="700" fontFamily="var(--font-display)" style={{ transition: "fill 250ms" }}>
                    {dest.name}
                  </text>
                </g>
              );
            })}

            {/* Walking path */}
            {selected && PATHS[selected] && (
              <path d={PATHS[selected]} fill="none" stroke={selectedDest?.color || "#1288FF"} strokeWidth="2.5" strokeDasharray="6 4" strokeLinecap="round" opacity="0.6">
                <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1.5s" repeatCount="indefinite" />
              </path>
            )}

            {/* You Are Here */}
            {kiosk && (
              <g>
                <circle cx={kiosk.x} cy={kiosk.y} r="14" fill="none" stroke="#1288FF" strokeWidth="1.5" opacity="0.3">
                  <animate attributeName="r" from="10" to="20" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx={kiosk.x} cy={kiosk.y} r="5.5" fill="#1288FF" stroke="#fff" strokeWidth="2" />
                <rect x={kiosk.x+9} y={kiosk.y-8} width="54" height="16" rx="8" fill="#1288FF" />
                <text x={kiosk.x+36} y={kiosk.y+3} textAnchor="middle" fontSize="6" fill="#fff" fontWeight="700" fontFamily="Inter, sans-serif">{activeFloor === 1 ? "You Are Here" : "Elevator"}</text>
              </g>
            )}

            {/* Selected destination pin */}
            {selected && floorDests.find(d => d.id === selected) && (() => {
              const d = floorDests.find(d2 => d2.id === selected)!;
              const cx = d.area.x + d.area.w/2;
              const cy = d.area.y + d.area.h/2;
              return (
                <g>
                  <circle cx={cx} cy={cy} r="10" fill={d.color} opacity="0.12">
                    <animate attributeName="r" from="8" to="18" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.25" to="0" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                </g>
              );
            })()}
          </svg>

          {/* Legend */}
          <div style={{ position: "absolute", top: 10, right: 10, padding: "7px 10px", background: "rgba(255,255,255,0.88)", backdropFilter: "blur(8px)", borderRadius: 8, border: "1px solid rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: 3 }}>
            <div style={{ fontSize: "0.5rem", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>Legend</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--primary)", border: "1.5px solid #fff", boxShadow: "0 0 0 1px #1288FF40" }} />
              <span style={{ fontSize: "0.5rem", color: "#6B7280" }}>Your Location</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 7, borderTop: "2px dashed #1288FF" }} />
              <span style={{ fontSize: "0.5rem", color: "#6B7280" }}>Walking Path</span>
            </div>
          </div>

          {/* Bottom info card */}
          {selected && selectedDest && !showDirections && (
            <div style={{
              position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)",
              display: "flex", alignItems: "center", gap: 10, padding: "8px 14px 8px 8px",
              background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
              borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, flexShrink: 0, background: `url('${selectedDest.img}') center/cover` }} />
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "0.6875rem", fontWeight: 700, color: "#1A1A1A" }}>{selectedDest.name}</div>
                <div style={{ fontSize: "0.5rem", color: "#6B7280" }}>{selectedDest.distance} · {FLOORS.find(f => f.num === selectedDest.floor)?.label}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Directions Modal ─── */}
      {showDirections && selectedDest && (
        <div style={{ position: "absolute", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={() => setShowDirections(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} />
          <div style={{ position: "relative", zIndex: 1, width: 380, background: "var(--bg-card)", borderRadius: 16, border: "1px solid var(--border)", padding: "24px 24px 20px", boxShadow: "0 24px 48px rgba(0,0,0,0.2)" }}>
            {/* Close */}
            <button onClick={() => setShowDirections(false)} style={{ position: "absolute", top: 12, right: 12, width: 28, height: 28, borderRadius: 8, border: "none", background: "var(--bg-elevated)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `url('${selectedDest.img}') center/cover`, flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "0.875rem", fontWeight: 800, color: "var(--text)" }}>{selectedDest.name}</div>
                <div style={{ fontSize: "0.625rem", color: "var(--text-secondary)", marginTop: 2 }}>{selectedDest.distance} · {FLOORS.find(f => f.num === selectedDest.floor)?.label}</div>
              </div>
            </div>

            {/* Steps */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 20 }}>
              {selectedDest.directions.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%",
                      background: i === selectedDest.directions.length - 1 ? selectedDest.color : "var(--bg-elevated)",
                      border: `2px solid ${i === selectedDest.directions.length - 1 ? selectedDest.color : "var(--border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: i === selectedDest.directions.length - 1 ? "#fff" : "var(--text-secondary)",
                      fontSize: "0.5625rem", fontWeight: 700,
                    }}>
                      {i === selectedDest.directions.length - 1 ? "✓" : i + 1}
                    </div>
                    {i < selectedDest.directions.length - 1 && (
                      <div style={{ width: 2, flex: 1, minHeight: 12, background: "var(--border)", marginTop: 4 }} />
                    )}
                  </div>
                  <div style={{ fontSize: "0.6875rem", color: "var(--text)", lineHeight: 1.5, paddingTop: 3 }}>{step}</div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setShowDirections(false); setShowShare(true); }} style={{
                flex: 1, padding: "10px 0", borderRadius: 10,
                border: "1px solid var(--border)", background: "var(--bg-card)",
                cursor: "pointer", fontFamily: "inherit", fontSize: "0.6875rem", fontWeight: 600, color: "var(--text)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
                Send to My Phone
              </button>
              <button onClick={() => setShowDirections(false)} className="btn btn-primary" style={{ flex: 1, padding: "10px 0", borderRadius: 10, fontSize: "0.6875rem", fontWeight: 700 }}>
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Share / QR Modal ─── */}
      {showShare && selectedDest && (
        <div style={{ position: "absolute", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={() => setShowShare(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} />
          <div style={{ position: "relative", zIndex: 1, width: 340, background: "var(--bg-card)", borderRadius: 16, border: "1px solid var(--border)", padding: "28px 24px 24px", boxShadow: "0 24px 48px rgba(0,0,0,0.2)", textAlign: "center" }}>
            <button onClick={() => setShowShare(false)} style={{ position: "absolute", top: 12, right: 12, width: 28, height: 28, borderRadius: 8, border: "none", background: "var(--bg-elevated)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>

            <div style={{ fontFamily: "var(--font-display)", fontSize: "0.875rem", fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>Send to Your Phone</div>
            <p style={{ fontSize: "0.625rem", color: "var(--text-secondary)", marginBottom: 20 }}>Scan this QR code to get directions on your mobile device</p>

            {/* QR Code (simulated) */}
            <div style={{
              width: 160, height: 160, margin: "0 auto 16px", borderRadius: 12,
              background: "#fff", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 12,
            }}>
              <svg viewBox="0 0 100 100" width="136" height="136">
                {/* QR-like pattern */}
                {Array.from({length: 10}, (_, r) =>
                  Array.from({length: 10}, (_, c) => {
                    const fill = ((r + c) % 3 === 0 || (r * c) % 5 < 2) ? "#1A1A1A" : "#fff";
                    return <rect key={`${r}-${c}`} x={c*10} y={r*10} width="9" height="9" rx="1.5" fill={fill} />;
                  })
                )}
                {/* Corner markers */}
                <rect x="0" y="0" width="30" height="30" rx="4" fill="none" stroke="#1A1A1A" strokeWidth="3" />
                <rect x="5" y="5" width="20" height="20" rx="2" fill="#1A1A1A" />
                <rect x="70" y="0" width="30" height="30" rx="4" fill="none" stroke="#1A1A1A" strokeWidth="3" />
                <rect x="75" y="5" width="20" height="20" rx="2" fill="#1A1A1A" />
                <rect x="0" y="70" width="30" height="30" rx="4" fill="none" stroke="#1A1A1A" strokeWidth="3" />
                <rect x="5" y="75" width="20" height="20" rx="2" fill="#1A1A1A" />
                {/* Center NEXI icon dot */}
                <circle cx="50" cy="50" r="8" fill={selectedDest.color} />
                <circle cx="50" cy="50" r="4" fill="#fff" />
              </svg>
            </div>

            <div style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>
              Directions to {selectedDest.name}
            </div>
            <div style={{ fontSize: "0.5625rem", color: "var(--text-secondary)", marginBottom: 20 }}>
              {selectedDest.distance} · {FLOORS.find(f => f.num === selectedDest.floor)?.label}
            </div>

            {/* Alt share options */}
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              {[
                { label: "Email", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg> },
                { label: "SMS", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> },
                { label: "Print", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> },
              ].map(opt => (
                <button key={opt.label} onClick={() => toast.show(`${opt.label} sent`)} style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  padding: "10px 18px", borderRadius: 10, border: "1px solid var(--border)",
                  background: "var(--bg-card)", cursor: "pointer", fontFamily: "inherit",
                  color: "var(--text-secondary)", fontSize: "0.5625rem", fontWeight: 600,
                }}>
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .way-scroll::-webkit-scrollbar { width: 3px; }
        .way-scroll::-webkit-scrollbar-track { background: transparent; }
        .way-scroll::-webkit-scrollbar-thumb { background: #E0E0DA; border-radius: 3px; }
      `}</style>
    </div>
  );
}
