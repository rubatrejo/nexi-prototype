"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import GlobalHeader from "@/components/layout/GlobalHeader";

type MenuItem = { name: string; desc: string; price: number; img: string };

const MENU: Record<string, MenuItem[]> = {
  Breakfast: [
    { name: "Eggs Benedict", desc: "Poached eggs, hollandaise, English muffin", price: 18, img: "/images/unsplash/photo-1525351484163-7529414344d8.jpg" },
    { name: "Fresh Juice", desc: "Seasonal cold-pressed orange juice", price: 8, img: "/images/unsplash/photo-1622597467836-f3285f2131b8.jpg" },
    { name: "Avocado Toast", desc: "Sourdough, smashed avocado, poached egg, chili flakes", price: 16, img: "/images/unsplash/photo-1541519227354-08fa5d50c44d.jpg" },
    { name: "Pancake Stack", desc: "Buttermilk pancakes, maple syrup, fresh berries", price: 14, img: "/images/unsplash/photo-1567620905732-2d1ec7ab7445.jpg" },
    { name: "Açaí Bowl", desc: "Açaí, granola, fresh berries, honey", price: 14, img: "/images/unsplash/photo-1590301157890-4810ed352733.jpg" },
    { name: "Croissant Basket", desc: "Assorted butter croissants, jam, honey", price: 12, img: "/images/unsplash/photo-1555507036-ab1f4038024a.jpg" },
    { name: "French Omelette", desc: "Three eggs, gruyère, herbs, sourdough toast", price: 16, img: "/images/unsplash/photo-1510693206972-df098062cb71.jpg" },
    { name: "Granola Parfait", desc: "Greek yogurt, house granola, seasonal fruit", price: 12, img: "/images/unsplash/photo-1488477181946-6428a0291777.jpg" },
    { name: "Smoked Salmon Bagel", desc: "Cream cheese, capers, red onion, dill", price: 20, img: "/images/unsplash/photo-1509722747041-616f39b57569.jpg" },
    { name: "Belgian Waffle", desc: "Crispy waffle, whipped cream, strawberries", price: 15, img: "/images/unsplash/photo-1562376552-0d160a2f238d.jpg" },
    { name: "Breakfast Burrito", desc: "Scrambled eggs, chorizo, peppers, salsa", price: 17, img: "/images/unsplash/photo-1626700051175-6818013e1d4f.jpg" },
    { name: "Fruit Platter", desc: "Seasonal tropical fruits, mint, honey drizzle", price: 14, img: "/images/unsplash/photo-1490474418585-ba9bad8fd0ea.jpg" },
  ],
  Lunch: [
    { name: "Caesar Salad", desc: "Romaine, parmesan, croutons, anchovy dressing", price: 16, img: "/images/unsplash/photo-1550304943-4f24f54ddde9.jpg" },
    { name: "Club Sandwich", desc: "Triple-decker with turkey, bacon, avocado", price: 22, img: "/images/unsplash/photo-1528735602780-2552fd46c7af.jpg" },
    { name: "Wagyu Burger", desc: "Wagyu beef, truffle aioli, brioche bun", price: 28, img: "/images/unsplash/photo-1568901346375-23c9450c58cd.jpg" },
    { name: "Grilled Salmon", desc: "Atlantic salmon, asparagus, lemon butter", price: 32, img: "/images/unsplash/photo-1467003909585-2f8a72700288.jpg" },
    { name: "Margherita Pizza", desc: "San Marzano tomato, fresh mozzarella, basil", price: 20, img: "/images/unsplash/photo-1574071318508-1cdbab80d002.jpg" },
    { name: "Lobster Roll", desc: "Maine lobster, butter, brioche roll, fries", price: 36, img: "/images/unsplash/photo-1559742811-822bfbc14a30.jpg" },
  ],
  Dinner: [
    { name: "Filet Mignon", desc: "8oz beef tenderloin, truffle mash, red wine jus", price: 58, img: "/images/unsplash/photo-1558030006-450675393462.jpg" },
    { name: "Pan-Seared Sea Bass", desc: "Chilean sea bass, risotto, saffron broth", price: 45, img: "/images/unsplash/photo-1534604973900-c43ab4c2e0ab.jpg" },
    { name: "Lamb Chops", desc: "New Zealand rack, rosemary, roasted vegetables", price: 52, img: "/images/unsplash/photo-1544025162-d76694265947.jpg" },
    { name: "Lobster Thermidor", desc: "Whole lobster, cognac cream, gruyère gratin", price: 65, img: "/images/unsplash/photo-1553247407-23251ce81f59.jpg" },
    { name: "Duck Confit", desc: "Slow-cooked duck leg, lentils, orange glaze", price: 42, img: "/images/unsplash/photo-1432139509613-5c4255a1d197.jpg" },
    { name: "Truffle Pasta", desc: "Handmade tagliatelle, black truffle, parmesan", price: 38, img: "/images/unsplash/photo-1473093295043-cdd812d0e601.jpg" },
  ],
  Snacks: [
    { name: "Truffle Fries", desc: "Hand-cut fries, truffle oil, parmesan", price: 14, img: "/images/unsplash/photo-1573080496219-bb080dd4f877.jpg" },
    { name: "Cheese Board", desc: "Artisan cheeses, honeycomb, crackers, nuts", price: 24, img: "/images/unsplash/photo-1452195100486-9cc805987862.jpg" },
    { name: "Bruschetta", desc: "Grilled ciabatta, tomato, basil, balsamic", price: 12, img: "/images/unsplash/photo-1572695157366-5e585ab2b69f.jpg" },
    { name: "Chicken Wings", desc: "Crispy wings, buffalo sauce, blue cheese dip", price: 16, img: "/images/unsplash/photo-1567620832903-9fc6debc209f.jpg" },
    { name: "Edamame", desc: "Steamed edamame, sea salt, chili flakes", price: 8, img: "/images/unsplash/photo-1551326844-4df70f78d0e9.jpg" },
    { name: "Mixed Nuts", desc: "Roasted almonds, cashews, macadamia", price: 10, img: "/images/unsplash/photo-1536591375668-2715f4e0f7f3.jpg" },
  ],
  Drinks: [
    { name: "Craft Cocktail", desc: "Daily special cocktail by our mixologist", price: 18, img: "/images/unsplash/photo-1514362545857-3bc16c4c7d1b.jpg" },
    { name: "Glass of Wine", desc: "Selection of red, white, or rosé", price: 14, img: "/images/unsplash/photo-1510812431401-41d2bd2722f3.jpg" },
    { name: "Espresso", desc: "Double shot, locally roasted beans", price: 5, img: "/images/unsplash/photo-1510707577719-ae7c14805e3a.jpg" },
    { name: "Fresh Smoothie", desc: "Mango, pineapple, coconut milk, honey", price: 10, img: "/images/unsplash/photo-1505252585461-04db1eb84625.jpg" },
    { name: "Sparkling Water", desc: "San Pellegrino, 750ml", price: 6, img: "/images/unsplash/photo-1560512823-829485b8bf24.jpg" },
    { name: "Craft Beer", desc: "Local IPA, pale ale, or lager on tap", price: 12, img: "/images/unsplash/photo-1535958636474-b021ee887b13.jpg" },
  ],
  Desserts: [
    { name: "Chocolate Fondant", desc: "Warm chocolate cake, vanilla ice cream", price: 16, img: "/images/unsplash/photo-1606313564200-e75d5e30476c.jpg" },
    { name: "Crème Brûlée", desc: "Classic vanilla custard, caramelized sugar", price: 14, img: "/images/unsplash/photo-1470124182917-cc6e71b22ecc.jpg" },
    { name: "Tiramisu", desc: "Espresso-soaked ladyfingers, mascarpone", price: 15, img: "/images/unsplash/photo-1571877227200-a0d98ea607e9.jpg" },
    { name: "Fruit Sorbet", desc: "Three scoops, seasonal fruit flavors", price: 10, img: "/images/unsplash/photo-1488900128323-21503983a07e.jpg" },
    { name: "Cheesecake", desc: "New York style, berry compote", price: 14, img: "/images/unsplash/photo-1524351199678-941a58a3df50.jpg" },
    { name: "Gelato", desc: "Italian gelato, pistachio, stracciatella", price: 12, img: "/images/unsplash/photo-1557142046-c704a3adf364.jpg" },
  ],
};

const CATEGORIES = Object.keys(MENU);

export default function RSV02() {
  const { navigate, goBack } = useKiosk();
  const [activeCat, setActiveCat] = useState("Breakfast");
  const [cart, setCart] = useState<Record<string, number>>({});

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const addToCart = (name: string) => {
    setCart((prev) => ({ ...prev, [name]: (prev[name] || 0) + 1 }));
  };

  const removeFromCart = (name: string) => {
    setCart((prev) => {
      const next = { ...prev };
      if (next[name] > 1) next[name]--;
      else delete next[name];
      return next;
    });
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <GlobalHeader />
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        {/* Sidebar */}
        <div style={{ width: 160, background: "var(--bg-card)", borderRight: "1px solid var(--border)", padding: "12px 0", flexShrink: 0 }}>
          <div style={{ padding: "0 14px 8px", fontFamily: "var(--font-display)", fontSize: "0.5625rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>Categories</div>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              style={{
                width: "100%", padding: "8px 14px",
                background: activeCat === cat ? "var(--primary)" : "transparent",
                color: activeCat === cat ? "#fff" : "var(--text-secondary)",
                border: "none", cursor: "pointer", textAlign: "left",
                fontWeight: activeCat === cat ? 600 : 400,
                fontSize: "0.6875rem", fontFamily: "'Inter', sans-serif",
                transition: "all 150ms",
              }}
            >
              {cat}
              <span style={{ float: "right", fontSize: "0.5625rem", opacity: 0.6 }}>{MENU[cat].length}</span>
            </button>
          ))}
        </div>

        {/* Main */}
        <div style={{ flex: 1, overflow: "auto", padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <button onClick={() => goBack()} style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </button>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 800, color: "var(--text)" }}>{activeCat}</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {MENU[activeCat].map((item) => (
              <div key={item.name} style={{ background: "var(--bg-card)", borderRadius: "var(--radius-sm)", overflow: "hidden", border: "1px solid var(--border)" }}>
                <div style={{ height: 68, background: `url('${item.img}') center/cover` }} />
                <div style={{ padding: "6px 8px" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.625rem", color: "var(--text)" }}>{item.name}</div>
                  <div style={{ fontSize: "0.5rem", color: "var(--text-secondary)", marginTop: 1, lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{item.desc}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.6875rem", color: "var(--text)" }}>${item.price}</span>
                    {cart[item.name] ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--primary)", borderRadius: "var(--radius-full)", padding: "2px 4px" }}>
                        <button onClick={(e) => { e.stopPropagation(); removeFromCart(item.name); }} style={{ width: 22, height: 22, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.2)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6875rem", fontWeight: 600 }}>−</button>
                        <span style={{ fontSize: "0.5625rem", fontWeight: 700, color: "#fff", minWidth: 14, textAlign: "center" }}>{cart[item.name]}</span>
                        <button onClick={(e) => { e.stopPropagation(); addToCart(item.name); }} style={{ width: 22, height: 22, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.2)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6875rem", fontWeight: 600 }}>+</button>
                      </div>
                    ) : (
                      <button className="btn btn-primary" onClick={() => addToCart(item.name)} style={{ fontSize: "0.5rem", padding: "3px 8px", minHeight: 24 }}>
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Cart Badge */}
        {cartCount > 0 && (
          <button
            onClick={() => navigate("RSV-03")}
            style={{
              position: "absolute", bottom: 16, right: 16,
              background: "var(--primary)", color: "#fff", border: "none",
              borderRadius: "var(--radius-full)", padding: "10px 18px",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
              fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.75rem",
              boxShadow: "0 4px 16px rgba(18,136,255,0.35)", zIndex: 10,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
            View Cart
            <span style={{ background: "#fff", color: "var(--primary)", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.625rem", fontWeight: 700 }}>{cartCount}</span>
          </button>
        )}
      </div>
    </div>
  );
}
