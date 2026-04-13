// ============================================================
// NEXI Design System — SAFE Auto-Layout Script (v2)
// Only applies auto-layout where it's SAFE and won't break layout
// Figma: Plugins > Development > Open Console > Paste & Enter
// ============================================================

(async () => {
  const page = figma.currentPage;
  const ds = page.findOne(n => n.name === "NEXI Design System");
  if (!ds) { figma.notify("❌ Frame 'NEXI Design System' not found"); return; }

  let count = 0;

  // ── HELPER ────────────────────────────────────────────────
  function safeAutoLayout(frame, dir, gap, pad) {
    if (!frame || frame.type !== "FRAME" || frame.layoutMode !== "NONE") return;
    try {
      frame.layoutMode = dir;
      frame.itemSpacing = gap;
      if (typeof pad === "number") {
        frame.paddingTop = pad; frame.paddingRight = pad;
        frame.paddingBottom = pad; frame.paddingLeft = pad;
      } else if (pad) {
        frame.paddingTop = pad.t || 0; frame.paddingRight = pad.r || 0;
        frame.paddingBottom = pad.b || 0; frame.paddingLeft = pad.l || 0;
      }
      frame.primaryAxisSizingMode = "AUTO";
      frame.counterAxisSizingMode = "AUTO";
      count++;
    } catch(e) {}
  }

  figma.notify("🔧 Applying safe auto-layout...");

  // ══════════════════════════════════════════════════════════
  // RULE 1: The main Design System frame → VERTICAL
  // ══════════════════════════════════════════════════════════

  if (ds.layoutMode === "NONE") {
    safeAutoLayout(ds, "VERTICAL", 0, 0);
  }

  // ══════════════════════════════════════════════════════════
  // RULE 2: Each major section (00-11) → VERTICAL with padding
  // These sections contain: Title + subsections stacked vertically
  // ══════════════════════════════════════════════════════════

  const sections = [
    "00 — Header", "01 — Color Palette", "02 — Typography",
    "03 — Spacing & Radius", "04 — Shadows & Effects", "05 — Buttons",
    "06 — Form Inputs", "07 — Cards", "08 — Progress & Status",
    "09 — Global Header", "10 — Special Patterns", "11 — Logos & Branding"
  ];

  for (const name of sections) {
    const section = ds.findOne(n => n.name === name && n.type === "FRAME");
    if (section) {
      safeAutoLayout(section, "VERTICAL", 32, { t: 48, r: 48, b: 48, l: 48 });

      // Make direct FRAME children fill width
      for (const child of section.children) {
        if (child.type === "FRAME" || child.type === "TEXT") {
          try { child.layoutSizingHorizontal = "FILL"; } catch(e) {}
        }
      }
    }
  }

  // ══════════════════════════════════════════════════════════
  // RULE 3: Subsection wrappers (Color/, Spacing/, etc.)
  // These contain: Label + two-column (Light | Dark) layout
  // → VERTICAL so label is on top and columns below
  // ══════════════════════════════════════════════════════════

  const subsectionPrefixes = ["Color /", "Spacing /", "Shadows /", "Logo /"];
  for (const prefix of subsectionPrefixes) {
    const subs = ds.findAll(n =>
      n.type === "FRAME" &&
      n.name.startsWith(prefix) &&
      n.layoutMode === "NONE" &&
      n.children.length >= 2
    );
    for (const sub of subs) {
      safeAutoLayout(sub, "VERTICAL", 16, 0);
      for (const child of sub.children) {
        if (child.type === "FRAME" || child.type === "TEXT") {
          try { child.layoutSizingHorizontal = "FILL"; } catch(e) {}
        }
      }
    }
  }

  // ══════════════════════════════════════════════════════════
  // RULE 4: Two-column Light|Dark containers
  // These have exactly 2 FRAME children side by side
  // → HORIZONTAL with gap, each child FILL width
  // ══════════════════════════════════════════════════════════

  // Find frames that have exactly 2 frame children where one contains
  // "Light" and other contains "Dark" in their descendants
  const allFrames = ds.findAll(n => n.type === "FRAME" && n.layoutMode === "NONE");

  for (const frame of allFrames) {
    const frameChildren = frame.children.filter(c => c.type === "FRAME");
    if (frameChildren.length === 2) {
      const child1 = frameChildren[0];
      const child2 = frameChildren[1];

      // Check if these are light/dark columns by position (side by side)
      const sideBySide = Math.abs(child1.y - child2.y) < 20 &&
                         Math.abs(child1.x - child2.x) > 100;

      if (sideBySide) {
        // Check if one has light bg and other dark bg
        const hasLightDark = (
          (child1.name.includes("Light") || child2.name.includes("Dark")) ||
          (child1.name.includes("Dark") || child2.name.includes("Light"))
        );

        if (hasLightDark || sideBySide) {
          safeAutoLayout(frame, "HORIZONTAL", 24, 0);
          // Make both children fill equally
          try {
            child1.layoutSizingHorizontal = "FILL";
            child2.layoutSizingHorizontal = "FILL";
          } catch(e) {}
        }
      }
    }
  }

  // ══════════════════════════════════════════════════════════
  // RULE 5: Title frames → VERTICAL (title text + divider line)
  // ══════════════════════════════════════════════════════════

  const titleFrames = ds.findAll(n =>
    n.type === "FRAME" &&
    n.name.includes("/ Title") &&
    n.layoutMode === "NONE"
  );
  for (const tf of titleFrames) {
    safeAutoLayout(tf, "VERTICAL", 8, 0);
    for (const child of tf.children) {
      try { child.layoutSizingHorizontal = "FILL"; } catch(e) {}
    }
  }

  // ══════════════════════════════════════════════════════════
  // RULE 6: Label frames → HORIZONTAL (icon + text)
  // ══════════════════════════════════════════════════════════

  const labelFrames = ds.findAll(n =>
    n.type === "FRAME" &&
    n.name.includes("— Label") &&
    n.layoutMode === "NONE"
  );
  for (const lf of labelFrames) {
    safeAutoLayout(lf, "HORIZONTAL", 8, 0);
  }

  // ══════════════════════════════════════════════════════════
  // RULE 7: "Design System Content" wrapper → VERTICAL
  // ══════════════════════════════════════════════════════════

  const content = ds.findOne(n => n.name === "Design System Content");
  if (content && content.type === "FRAME" && content.layoutMode === "NONE") {
    safeAutoLayout(content, "VERTICAL", 0, 0);
    for (const child of content.children) {
      if (child.type === "FRAME") {
        try { child.layoutSizingHorizontal = "FILL"; } catch(e) {}
      }
    }
  }

  // ══════════════════════════════════════════════════════════
  // DONE — Report
  // ══════════════════════════════════════════════════════════

  const finalAbs = ds.findAll(n => n.type === "FRAME" && n.layoutMode === "NONE").length;
  const finalAuto = ds.findAll(n => n.type === "FRAME" && n.layoutMode !== "NONE").length;

  figma.notify("✅ Done! " + count + " frames converted to auto-layout");
  console.log("=== SAFE AUTO-LAYOUT RESULTS ===");
  console.log("Frames converted:", count);
  console.log("Remaining absolute:", finalAbs);
  console.log("Total auto-layout:", finalAuto);
  console.log("NOTE: Inner elements (swatches, buttons, cards) kept their");
  console.log("original positioning to preserve the visual layout.");
})();
