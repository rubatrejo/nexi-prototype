"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import GlobalHeader from "@/components/layout/GlobalHeader";

const CUSTOMIZE_OPTIONS = [
  { label: "Extra egg", price: 3 },
  { label: "No sauce", price: 0 },
  { label: "Gluten-free bread", price: 2 },
  { label: "Extra cheese", price: 2 },
  { label: "No onions", price: 0 },
  { label: "Well done", price: 0 },
];
const ALLERGY_TAGS = ["Nuts", "Dairy", "Gluten", "Shellfish", "Eggs", "Soy"];
const TIMES = ["ASAP", "30 min", "1 hour", "Specific time"];

type CartItem = { name: string; desc: string; price: number; qty: number; img: string };

const INITIAL_CART: CartItem[] = [
  { name: "Eggs Benedict", desc: "Poached eggs, hollandaise, English muffin", price: 18, qty: 1, img: "/images/unsplash/photo-1525351484163-7529414344d8.jpg" },
  { name: "Fresh Juice", desc: "Seasonal cold-pressed orange juice", price: 8, qty: 2, img: "/images/unsplash/photo-1622597467836-f3285f2131b8.jpg" },
  { name: "Caesar Salad", desc: "Romaine, parmesan, croutons, anchovy dressing", price: 16, qty: 1, img: "/images/unsplash/photo-1550304943-4f24f54ddde9.jpg" },
  { name: "Wagyu Burger", desc: "Wagyu beef, truffle aioli, brioche bun", price: 28, qty: 1, img: "/images/unsplash/photo-1568901346375-23c9450c58cd.jpg" },
];

const SUGGESTIONS: CartItem[] = [
  { name: "Truffle Fries", desc: "Hand-cut fries, truffle oil, parmesan", price: 14, qty: 0, img: "/images/unsplash/photo-1573080496219-bb080dd4f877.jpg" },
  { name: "Chocolate Fondant", desc: "Warm chocolate cake, vanilla ice cream", price: 16, qty: 0, img: "/images/unsplash/photo-1606313564200-e75d5e30476c.jpg" },
  { name: "Craft Cocktail", desc: "Daily special by our mixologist", price: 18, qty: 0, img: "/images/unsplash/photo-1514362545857-3bc16c4c7d1b.jpg" },
  { name: "Crème Brûlée", desc: "Classic vanilla custard, caramelized sugar", price: 14, qty: 0, img: "/images/unsplash/photo-1470124182917-cc6e71b22ecc.jpg" },
  { name: "Espresso", desc: "Double shot, locally roasted beans", price: 5, qty: 0, img: "/images/unsplash/photo-1510707577719-ae7c14805e3a.jpg" },
  { name: "Cheese Board", desc: "Artisan cheeses, honeycomb, crackers", price: 24, qty: 0, img: "/images/unsplash/photo-1452195100486-9cc805987862.jpg" },
  { name: "Tiramisu", desc: "Espresso-soaked ladyfingers, mascarpone", price: 15, qty: 0, img: "/images/unsplash/photo-1571877227200-a0d98ea607e9.jpg" },
  { name: "Glass of Wine", desc: "Selection of red, white, or rosé", price: 14, qty: 0, img: "/images/unsplash/photo-1510812431401-41d2bd2722f3.jpg" },
];

export default function RSV03() {
  const { navigate, goBack } = useKiosk();
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART);
  const [showCustomize, setShowCustomize] = useState(false);
  const [selectedTime, setSelectedTime] = useState("ASAP");
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const toggleAllergy = (a: string) => setSelectedAllergies((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  const toggleOption = (o: string) => setSelectedOptions((prev) => prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o]);
  const [customExtras, setCustomExtras] = useState(0);

  const confirmCustomize = () => {
    const extras = CUSTOMIZE_OPTIONS.filter((o) => selectedOptions.includes(o.label)).reduce((a, o) => a + o.price, 0);
    setCustomExtras(extras);
    setShowCustomize(false);
  };

  const addItem = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.name === item.name);
      if (existing) return prev.map((c) => c.name === item.name ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (name: string, delta: number) => {
    setCart((prev) => prev.map((c) => c.name === name ? { ...c, qty: Math.max(0, c.qty + delta) } : c).filter((c) => c.qty > 0));
  };

  const removeItem = (name: string) => {
    setCart((prev) => prev.filter((c) => c.name !== name));
  };

  const totalItems = cart.reduce((a, i) => a + i.qty, 0);
  const subtotal = cart.reduce((a, i) => a + i.price * i.qty, 0) + customExtras;
  const delivery = 5;
  const total = subtotal + delivery;

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left — Cart Items */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 0, minWidth: 0, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px 10px", flexShrink: 0 }}>
            <button onClick={() => goBack()} style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </button>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 800, color: "var(--text)", letterSpacing: -0.2 }}>Your Order</h1>
              <p style={{ fontSize: "0.5625rem", color: "var(--text-secondary)", marginTop: 1 }}>{totalItems} items · Room 1247</p>
            </div>
          </div>

          {/* Scrollable cart items */}
          <div style={{ flex: 1, overflow: "auto", padding: "0 20px 16px" }}>
            {cart.map((item, i) => (
              <div key={item.name} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < cart.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ width: 56, height: 56, borderRadius: "var(--radius-sm)", background: `url('${item.img}') center/cover`, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.6875rem", color: "var(--text)" }}>{item.name}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.6875rem", color: "var(--text)", flexShrink: 0 }}>${item.price * item.qty}</div>
                  </div>
                  <div style={{ fontSize: "0.5rem", color: "var(--text-secondary)", marginTop: 1 }}>{item.desc}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-full)", padding: "2px 4px" }}>
                      <button onClick={() => updateQty(item.name, -1)} style={{ width: 22, height: 22, borderRadius: "50%", border: "none", background: "transparent", color: "var(--text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6875rem", fontWeight: 600 }}>−</button>
                      <span style={{ fontSize: "0.625rem", fontWeight: 600, color: "var(--text)", minWidth: 12, textAlign: "center" }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.name, 1)} style={{ width: 22, height: 22, borderRadius: "50%", border: "none", background: "transparent", color: "var(--text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6875rem", fontWeight: 600 }}>+</button>
                    </div>
                    <button onClick={() => removeItem(item.name)} style={{ background: "none", border: "none", color: "var(--error)", fontSize: "0.5rem", fontWeight: 500, cursor: "pointer" }}>Remove</button>
                  </div>
                </div>
              </div>
            ))}

            {/* You might also like */}
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: "0.5625rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>You Might Also Like</div>
              <div className="rsv03-suggestions" style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none", paddingBottom: 4 }}>
                <style>{`.rsv03-suggestions::-webkit-scrollbar { display: none; }`}</style>
                {SUGGESTIONS.filter((s) => !cart.find((c) => c.name === s.name)).map((item) => (
                  <div key={item.name} style={{ width: 100, background: "var(--bg-card)", borderRadius: "var(--radius-sm)", overflow: "hidden", border: "1px solid var(--border)", flexShrink: 0 }}>
                    <div style={{ height: 52, background: `url('${item.img}') center/cover` }} />
                    <div style={{ padding: "4px 6px" }}>
                      <div style={{ fontSize: "0.5rem", fontWeight: 600, color: "var(--text)" }}>{item.name}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                        <span style={{ fontSize: "0.5rem", fontWeight: 700, color: "var(--primary)" }}>${item.price}</span>
                        <button onClick={() => addItem(item)} style={{ width: 20, height: 20, borderRadius: "50%", border: "none", background: "var(--primary)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6875rem", fontWeight: 600 }}>+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right — Order Summary + Photo */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "url('/images/unsplash/photo-1414235077428-338989a2e8c0.jpg') center/cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.6))" }} />
          <div className="grain" />

          {/* Glass summary card */}
          <div style={{ position: "absolute", bottom: 20, left: 16, right: 16, zIndex: 2, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "var(--radius-lg)", padding: "16px 18px" }}>
            <div style={{ fontSize: "0.5625rem", fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Order Summary</div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.8)" }}>Subtotal ({totalItems} items)</span>
              <span style={{ fontSize: "0.75rem", color: "#fff", fontWeight: 700 }}>${subtotal}</span>
            </div>
            {customExtras > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.55)" }}>Customizations</span>
                <span style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>+${customExtras}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.55)" }}>Delivery to Room 1247</span>
              <span style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>${delivery}</span>
            </div>
            <div style={{ height: 1, background: "rgba(255,255,255,0.12)", margin: "10px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#fff" }}>Total</span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", color: "#fff" }}>${total}</span>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-ghost" onClick={() => setShowCustomize(true)} style={{ flex: 1, fontSize: "0.6875rem", color: "#fff", borderColor: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.06)" }}>Customize</button>
              <button className="btn btn-primary" onClick={() => navigate("RSV-04")} style={{ flex: 1, fontSize: "0.6875rem" }}>Place Order</button>
            </div>
          </div>
        </div>
      </div>

      {/* Customize Modal */}
      {showCustomize && (
        <div style={{ position: "absolute", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} onClick={() => setShowCustomize(false)} />
          <div style={{ position: "relative", zIndex: 2, width: 380, maxHeight: "80%", background: "var(--bg-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", boxShadow: "0 24px 80px rgba(0,0,0,0.2)", overflow: "auto", padding: "20px 22px" }}>
            {/* Close */}
            <button onClick={() => setShowCustomize(false)} style={{ position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: "50%", background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", minWidth: 44, minHeight: 44 }}>✕</button>

            <p style={{ fontSize: "0.5rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Customize Order</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 800, color: "var(--text)", marginBottom: 14 }}>Preferences & Allergies</h2>

            {/* Modifications */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: "0.5625rem", fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>Modifications</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {CUSTOMIZE_OPTIONS.map((opt) => {
                  const active = selectedOptions.includes(opt.label);
                  return (
                    <button key={opt.label} onClick={() => toggleOption(opt.label)} style={{ padding: "4px 10px", borderRadius: 9999, fontSize: "0.5625rem", fontWeight: 500, background: active ? "color-mix(in srgb, var(--primary) 10%, transparent)" : "transparent", border: `1px solid ${active ? "var(--primary)" : "var(--border)"}`, color: active ? "var(--primary)" : "var(--text-secondary)", cursor: "pointer", minHeight: 30, display: "flex", alignItems: "center" }}>
                      {active && <span style={{ marginRight: 3, fontSize: "0.5rem" }}>✓</span>}{opt.label}{opt.price > 0 && <span style={{ marginLeft: 4, opacity: 0.7 }}>+${opt.price}</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Allergies */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: "0.5625rem", fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>Allergies</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {ALLERGY_TAGS.map((a) => {
                  const active = selectedAllergies.includes(a);
                  return (
                    <button key={a} onClick={() => toggleAllergy(a)} style={{ padding: "4px 10px", borderRadius: 9999, fontSize: "0.5625rem", fontWeight: 500, background: active ? "color-mix(in srgb, var(--error) 10%, transparent)" : "transparent", border: `1px solid ${active ? "var(--error)" : "var(--border)"}`, color: active ? "var(--error)" : "var(--text-secondary)", cursor: "pointer", minHeight: 30, display: "flex", alignItems: "center" }}>
                      {active && <span style={{ marginRight: 3, fontSize: "0.5rem" }}>✓</span>}{a}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Special instructions */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: "0.5625rem", fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Special Instructions</div>
              <textarea placeholder="E.g. extra egg in my omelette, no ice in drinks..." style={{ width: "100%", height: 48, padding: "8px 10px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--text)", fontSize: "0.625rem", resize: "none", outline: "none", fontFamily: "'Inter', sans-serif" }} />
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-ghost" onClick={() => setShowCustomize(false)} style={{ flex: 1, minHeight: 36, fontSize: "0.625rem" }}>Cancel</button>
              <button className="btn btn-primary" onClick={confirmCustomize} style={{ flex: 1, minHeight: 36, fontSize: "0.625rem" }}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
