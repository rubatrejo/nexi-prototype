"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const HOTEL = { lat: 33.4942, lng: -111.9261 };

// NEXI icon SVG as data URI for the hotel pin
const NEXI_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 137.993 121.233" fill="%231288FF"><path d="M71.349,87.094A21.555,21.555,0,0,1,60.563,84.2L43.631,101.134a45.086,45.086,0,0,0,55.823-.289l-16.9-16.9a21.556,21.556,0,0,1-11.207,3.145" transform="translate(-2.48 -4.771)"/><path d="M71.352,16.305a45.007,45.007,0,0,0-27.674,9.5L60.614,42.742a21.555,21.555,0,0,1,21.9.255l16.9-16.9a45.032,45.032,0,0,0-28.06-9.79" transform="translate(-2.482 -0.926)"/><path d="M115.72,78.45a44.824,44.824,0,0,0-.011-35.648L143.276,0,109.944,33.015c-.024-.031-.044-.064-.068-.094L92.944,49.852a21.576,21.576,0,0,1,.03,21.524v0l-.031,0,3.584,3.55,13.381,13.381c.019-.024.035-.051.054-.075l33.313,33Z" transform="translate(-5.282)"/><path d="M27.556,78.45A44.823,44.823,0,0,1,27.567,42.8L0,0,33.332,33.015c.024-.031.044-.064.068-.094L50.332,49.852a21.576,21.576,0,0,0-.03,21.524v0l.031,0-3.584,3.55L33.367,88.312c-.019-.024-.035-.051-.054-.075L0,121.233Z"/></svg>`;

export const RESTAURANT_PINS = [
  { lat: 33.4970, lng: -111.9230, name: "Mastro's City Hall" },
  { lat: 33.4925, lng: -111.9200, name: "Sakura Garden" },
  { lat: 33.4960, lng: -111.9300, name: "The Mission" },
  { lat: 33.4948, lng: -111.9245, name: "Café Lumière" },
  { lat: 33.4910, lng: -111.9280, name: "Mariscos del Puerto" },
  { lat: 33.4935, lng: -111.9180, name: "Citizen Public House" },
  { lat: 33.4955, lng: -111.9270, name: "Olive & Ivy" },
  { lat: 33.4900, lng: -111.9210, name: "Hash Kitchen" },
];

function hotelIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="width:44px;height:44px;border-radius:50% 50% 50% 4px;background:#1288FF;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(18,136,255,0.5);border:3px solid #fff;">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5"><path d="M3 21h18M5 21V7l8-4 8 4v14M9 21v-6h6v6M9 9h.01M15 9h.01M9 13h.01M15 13h.01"/></svg>
    </div>`,
    iconAnchor: [22, 44],
  });
}

function pinIcon(name: string, active = false) {
  const bg = active ? "#0a6ed6" : "#1288FF";
  const scale = active ? "scale(1.15)" : "scale(1)";
  return L.divIcon({
    className: "",
    html: `<div style="display:flex;flex-direction:column;align-items:center;transform:${scale};transition:transform 200ms;">
      <div style="padding:2px 7px;background:${bg};border-radius:10px;font-size:9px;font-weight:700;color:#fff;white-space:nowrap;font-family:var(--font-display);margin-bottom:2px;box-shadow:${active ? '0 2px 8px rgba(18,136,255,0.5)' : 'none'}">${name}</div>
      <svg width="10" height="14" viewBox="0 0 24 32" fill="${bg}"><path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0zm0 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/></svg>
    </div>`,
    iconAnchor: [30, 32],
  });
}

interface LSTMapProps {
  showPins?: boolean;
  focusedPin?: number | null;
  routeTo?: number | null;
  travelMode?: "walk" | "car";
}

export default function LSTMap({ showPins = false, focusedPin = null, routeTo = null, travelMode = "walk" }: LSTMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const pinLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const [ready, setReady] = useState(false);

  // Init map once
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    const map = L.map(mapRef.current, {
      center: [HOTEL.lat, HOTEL.lng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
      dragging: true,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    L.marker([HOTEL.lat, HOTEL.lng], { icon: hotelIcon(), zIndexOffset: 1000 }).addTo(map);

    pinLayerRef.current = L.layerGroup().addTo(map);
    routeLayerRef.current = L.layerGroup().addTo(map);
    leafletMap.current = map;
    setReady(true);

    return () => {
      map.remove();
      leafletMap.current = null;
    };
  }, []);

  // Toggle/update restaurant pins
  useEffect(() => {
    if (!pinLayerRef.current || !leafletMap.current) return;
    pinLayerRef.current.clearLayers();

    if (showPins) {
      RESTAURANT_PINS.forEach((p, i) => {
        const isActive = focusedPin === i;
        L.marker([p.lat, p.lng], {
          icon: pinIcon(p.name, isActive),
          zIndexOffset: isActive ? 500 : 0,
        }).addTo(pinLayerRef.current!);
      });

      if (focusedPin !== null && focusedPin >= 0 && focusedPin < RESTAURANT_PINS.length) {
        // Zoom to focused pin
        const fp = RESTAURANT_PINS[focusedPin];
        leafletMap.current.flyTo([fp.lat, fp.lng], 17, { duration: 0.6 });
      } else {
        // Fit all pins
        const bounds = L.latLngBounds(
          RESTAURANT_PINS.map((p) => [p.lat, p.lng] as [number, number])
        );
        bounds.extend([HOTEL.lat, HOTEL.lng]);
        leafletMap.current.flyToBounds(bounds, { padding: [40, 40], duration: 0.8 });
      }
    } else {
      leafletMap.current.flyTo([HOTEL.lat, HOTEL.lng], 15, { duration: 0.8 });
    }
  }, [showPins, focusedPin]);

  // Draw route line from hotel to destination
  useEffect(() => {
    if (!routeLayerRef.current || !leafletMap.current) return;
    routeLayerRef.current.clearLayers();

    if (routeTo !== null && routeTo >= 0 && routeTo < RESTAURANT_PINS.length) {
      const dest = RESTAURANT_PINS[routeTo];
      const isWalk = travelMode === "walk";

      // Walking: pedestrian path (zigzag through streets)
      // Driving: smoother route via main roads
      const routeCoords: [number, number][] = isWalk
        ? [
            [HOTEL.lat, HOTEL.lng],
            [HOTEL.lat, (HOTEL.lng + dest.lng) / 2],
            [(HOTEL.lat + dest.lat) / 2, (HOTEL.lng + dest.lng) / 2],
            [dest.lat, (HOTEL.lng + dest.lng) / 2],
            [dest.lat, dest.lng],
          ]
        : [
            [HOTEL.lat, HOTEL.lng],
            [HOTEL.lat, dest.lng],
            [dest.lat, dest.lng],
          ];

      L.polyline(routeCoords, {
        color: isWalk ? "#1288FF" : "#0a6ed6",
        weight: isWalk ? 4 : 5,
        opacity: 0.85,
        dashArray: isWalk ? "8, 6" : undefined,
        lineCap: "round",
      }).addTo(routeLayerRef.current);

      // Mode icon at midpoint
      const midIdx = Math.floor(routeCoords.length / 2);
      const midPoint = routeCoords[midIdx];
      const modeIconSvg = isWalk
        ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/></svg>`
        : `<svg width="12" height="12" viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>`;

      const modeIcon = L.divIcon({
        className: "",
        html: `<div style="background:${isWalk ? '#1288FF' : '#0a6ed6'};border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(18,136,255,0.4)">
          ${modeIconSvg}
        </div>`,
        iconAnchor: [11, 11],
      });
      L.marker(midPoint, { icon: modeIcon }).addTo(routeLayerRef.current);

      // Fit both hotel and destination
      const bounds = L.latLngBounds([
        [HOTEL.lat, HOTEL.lng],
        [dest.lat, dest.lng],
      ]);
      leafletMap.current.flyToBounds(bounds, { padding: [50, 50], duration: 0.8 });
    }
  }, [routeTo, travelMode]);

  return (
    <div
      ref={mapRef}
      style={{ position: "absolute", inset: 0, zIndex: 1 }}
    />
  );
}
