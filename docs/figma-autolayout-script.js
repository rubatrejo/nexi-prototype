// ============================================================
// NEXI Design System — Auto-Layout & Component Script
// Figma: Plugins > Development > Open Console > Paste & Enter
// ============================================================

(async () => {
  const page = figma.currentPage;
  const ds = page.findOne(n => n.name === "NEXI Design System");
  if (!ds) { figma.notify("❌ Frame 'NEXI Design System' not found"); return; }

  let stats = { autoLayout: 0, resized: 0, components: 0 };

  // ── HELPERS ───────────────────────────────────────────────

  function setAutoLayout(frame, dir, gap, pad, sizing) {
    if (!frame || frame.type !== "FRAME") return;
    try {
      frame.layoutMode = dir; // "VERTICAL" or "HORIZONTAL"
      frame.itemSpacing = gap || 0;
      const p = typeof pad === "number" ? { t: pad, r: pad, b: pad, l: pad } : (pad || { t: 0, r: 0, b: 0, l: 0 });
      frame.paddingTop = p.t; frame.paddingRight = p.r;
      frame.paddingBottom = p.b; frame.paddingLeft = p.l;
      // Sizing: "FILL" or "HUG" or "FIXED"
      const h = sizing?.h || "HUG";
      const v = sizing?.v || "HUG";
      frame.primaryAxisSizingMode = "AUTO"; // always auto on primary
      frame.counterAxisSizingMode = "AUTO"; // auto on counter
      if (sizing?.fillW) frame.layoutSizingHorizontal = "FILL";
      if (sizing?.fillH) frame.layoutSizingVertical = "FILL";
      stats.autoLayout++;
    } catch(e) { /* skip */ }
  }

  function makeChildrenFillWidth(frame) {
    if (!frame || frame.type !== "FRAME") return;
    for (const child of frame.children) {
      if (child.type === "FRAME" || child.type === "TEXT") {
        try { child.layoutSizingHorizontal = "FILL"; stats.resized++; } catch(e) {}
      }
    }
  }

  function findByName(parent, name) {
    return parent.findOne(n => n.name === name);
  }

  function findAllByName(parent, name) {
    return parent.findAll(n => n.name === name);
  }

  function findContaining(parent, substring) {
    return parent.findOne(n => n.name.includes(substring));
  }

  function findAllContaining(parent, substring) {
    return parent.findAll(n => n.name.includes(substring));
  }

  // Apply auto-layout recursively to all "Container" or "Frame /" children
  function autoLayoutRecursive(frame, depth = 0) {
    if (!frame || frame.type !== "FRAME" || depth > 8) return;

    const children = [...frame.children].filter(c => c.type === "FRAME");
    if (children.length === 0) return;

    // First, recurse into children
    for (const child of children) {
      autoLayoutRecursive(child, depth + 1);
    }

    // Determine layout direction based on children positions
    if (children.length >= 2) {
      const firstChild = children[0];
      const lastChild = children[children.length - 1];

      // Check if children are arranged horizontally or vertically
      const xSpread = Math.abs(lastChild.x - firstChild.x);
      const ySpread = Math.abs(lastChild.y - firstChild.y);

      if (frame.layoutMode === "NONE") {
        if (xSpread > ySpread && xSpread > 20) {
          // Children spread horizontally → horizontal auto-layout
          const avgGap = children.length > 1 ?
            Math.max(0, Math.round((xSpread - children.reduce((s, c) => s + c.width, 0) + children[0].width) / (children.length - 1))) : 12;
          setAutoLayout(frame, "HORIZONTAL", Math.min(avgGap, 48), 0);
        } else if (ySpread > 20) {
          // Children spread vertically → vertical auto-layout
          const avgGap = children.length > 1 ?
            Math.max(0, Math.round((ySpread - children.reduce((s, c) => s + c.height, 0) + children[0].height) / (children.length - 1))) : 12;
          setAutoLayout(frame, "VERTICAL", Math.min(avgGap, 48), 0);
        }
      }
    }
  }

  figma.notify("🔧 Phase 1: Applying auto-layout to leaf nodes...");

  // ── PHASE 1: INDIVIDUAL SWATCH/CARD FRAMES ────────────────
  // Color swatches: each has a colored rectangle + text labels
  const swatchFrames = ds.findAll(n =>
    n.type === "FRAME" &&
    n.name.startsWith("Swatch /") &&
    n.layoutMode === "NONE"
  );

  for (const swatch of swatchFrames) {
    setAutoLayout(swatch, "VERTICAL", 4, 0);
  }

  // Token detail frames (hex values etc.)
  const hexFrames = ds.findAll(n =>
    n.type === "FRAME" &&
    n.name.startsWith("Frame / #") &&
    n.layoutMode === "NONE"
  );
  for (const hf of hexFrames) {
    setAutoLayout(hf, "VERTICAL", 2, 0);
  }

  // ── PHASE 2: COLOR GRID ROWS ──────────────────────────────
  figma.notify("🔧 Phase 2: Color grids and rows...");

  // Light/Dark mode containers within color sections
  const lightDarkContainers = ds.findAll(n =>
    n.type === "FRAME" &&
    (n.name.includes("Light Mode") || n.name.includes("Dark Mode")) &&
    !n.name.includes("Label") &&
    n.layoutMode === "NONE"
  );
  for (const container of lightDarkContainers) {
    // These contain color swatch grids - make them horizontal with wrap
    setAutoLayout(container, "HORIZONTAL", 12, 0);
    try { container.layoutWrap = "WRAP"; } catch(e) {}
  }

  // ── PHASE 3: SUBSECTION CONTAINERS ────────────────────────
  figma.notify("🔧 Phase 3: Subsection containers...");

  // Color subsections (Backgrounds, Primary, Semantic, etc.)
  const colorSubsections = ds.findAll(n =>
    n.type === "FRAME" &&
    (n.name.startsWith("Color /") || n.name === "Color / Module Mapping") &&
    n.layoutMode === "NONE"
  );
  for (const sub of colorSubsections) {
    setAutoLayout(sub, "VERTICAL", 16, 0);
    makeChildrenFillWidth(sub);
  }

  // Spacing subsections
  const spacingSubs = ds.findAll(n =>
    n.type === "FRAME" &&
    n.name.startsWith("Spacing /") &&
    n.layoutMode === "NONE"
  );
  for (const sub of spacingSubs) {
    setAutoLayout(sub, "VERTICAL", 12, 0);
  }

  // Shadows subsections
  const shadowSubs = ds.findAll(n =>
    n.type === "FRAME" &&
    n.name.startsWith("Shadows /") &&
    n.layoutMode === "NONE"
  );
  for (const sub of shadowSubs) {
    setAutoLayout(sub, "HORIZONTAL", 24, 0);
  }

  // Logo subsections
  const logoSubs = ds.findAll(n =>
    n.type === "FRAME" &&
    n.name.startsWith("Logo /") &&
    n.layoutMode === "NONE"
  );
  for (const sub of logoSubs) {
    setAutoLayout(sub, "VERTICAL", 16, 0);
  }

  // ── PHASE 4: LABEL FRAMES ────────────────────────────────
  // Labels should be horizontal auto-layout
  const labelFrames = ds.findAll(n =>
    n.type === "FRAME" &&
    n.name.includes("— Label") &&
    n.layoutMode === "NONE"
  );
  for (const label of labelFrames) {
    setAutoLayout(label, "HORIZONTAL", 8, 0);
  }

  // ── PHASE 5: REMAINING "Frame /" CONTAINERS ──────────────
  figma.notify("🔧 Phase 4: Remaining containers...");

  // Apply auto-layout intelligently to all remaining Frame/ containers
  const remainingFrames = ds.findAll(n =>
    n.type === "FRAME" &&
    (n.name.startsWith("Frame /") || n.name.startsWith("Frame ")) &&
    n.layoutMode === "NONE" &&
    n.children.length > 0
  );

  for (const frame of remainingFrames) {
    autoLayoutRecursive(frame);
  }

  // ── PHASE 6: SECTION CONTAINERS (00-11) ───────────────────
  figma.notify("🔧 Phase 5: Major sections...");

  const sectionPrefixes = [
    "00 — Header", "01 — Color Palette", "02 — Typography",
    "03 — Spacing & Radius", "04 — Shadows & Effects", "05 — Buttons",
    "06 — Form Inputs", "07 — Cards", "08 — Progress & Status",
    "09 — Global Header", "10 — Special Patterns", "11 — Logos & Branding"
  ];

  for (const prefix of sectionPrefixes) {
    const section = ds.findOne(n => n.name === prefix && n.type === "FRAME");
    if (section && section.layoutMode === "NONE") {
      // Sections are vertical with padding
      setAutoLayout(section, "VERTICAL", 32, { t: 48, r: 48, b: 48, l: 48 });
      // Make all direct children fill width
      makeChildrenFillWidth(section);
    }
  }

  // ── PHASE 7: MAIN CONTENT WRAPPER ────────────────────────

  const content = ds.findOne(n => n.name === "Design System Content");
  if (content && content.type === "FRAME") {
    setAutoLayout(content, "VERTICAL", 0, 0, { fillW: true });
    makeChildrenFillWidth(content);
  }

  // Main DS frame
  if (ds.type === "FRAME" && ds.layoutMode === "NONE") {
    setAutoLayout(ds, "VERTICAL", 0, 0);
  }

  // ── PHASE 8: TITLE FRAMES ────────────────────────────────
  // Section title frames should be horizontal
  const titleFrames = ds.findAll(n =>
    n.type === "FRAME" &&
    n.name.includes("/ Title") &&
    n.layoutMode === "NONE"
  );
  for (const title of titleFrames) {
    setAutoLayout(title, "VERTICAL", 4, 0);
    makeChildrenFillWidth(title);
  }

  // ── PHASE 9: BUTTON GROUPS ────────────────────────────────

  const buttonFrames = ds.findAll(n =>
    n.type === "FRAME" &&
    (n.name.includes("Button") || n.name.includes("Pill") || n.name.includes("Tab") || n.name.includes("Pair")) &&
    n.layoutMode === "NONE" &&
    n.children.length > 0
  );
  for (const bf of buttonFrames) {
    // Buttons are typically arranged horizontally
    setAutoLayout(bf, "HORIZONTAL", 12, 0);
    try { bf.layoutWrap = "WRAP"; } catch(e) {}
  }

  // ── PHASE 10: FORM INPUT CONTAINERS ──────────────────────

  const formFrames = ds.findAll(n =>
    n.type === "FRAME" &&
    n.parent && n.parent.name &&
    n.parent.name.includes("Form") &&
    n.layoutMode === "NONE" &&
    n.children.length > 0
  );
  for (const ff of formFrames) {
    autoLayoutRecursive(ff);
  }

  // ── PHASE 11: CARD CONTAINERS ─────────────────────────────

  const cardFrames = ds.findAll(n =>
    n.type === "FRAME" &&
    (n.name.includes("Card") || n.name.includes("Module Tile")) &&
    n.layoutMode === "NONE" &&
    n.children.length > 0
  );
  for (const cf of cardFrames) {
    setAutoLayout(cf, "VERTICAL", 8, { t: 16, r: 16, b: 16, l: 16 });
  }

  // ── PHASE 12: CATCH-ALL — ANY REMAINING FRAMES ───────────
  figma.notify("🔧 Phase 6: Catch-all pass...");

  const stillAbsolute = ds.findAll(n =>
    n.type === "FRAME" &&
    n.layoutMode === "NONE" &&
    n.children.length >= 2 &&
    n.name !== "NEXI Design System"
  );

  for (const frame of stillAbsolute) {
    autoLayoutRecursive(frame);
  }

  // ── PHASE 13: SET FILL WIDTH ON CHILDREN ──────────────────
  // After all auto-layouts applied, set children to fill where appropriate

  const allAutoFrames = ds.findAll(n =>
    n.type === "FRAME" &&
    n.layoutMode !== "NONE"
  );

  for (const frame of allAutoFrames) {
    if (frame.layoutMode === "VERTICAL") {
      // In vertical layout, make FRAME children fill width
      for (const child of frame.children) {
        if (child.type === "FRAME" && child.width > frame.width * 0.7) {
          try { child.layoutSizingHorizontal = "FILL"; stats.resized++; } catch(e) {}
        }
      }
    }
  }

  // ── PHASE 14: CREATE COMPONENTS ───────────────────────────
  figma.notify("🔧 Phase 7: Creating components...");

  // Find and componentize button frames
  function createComponentFrom(frame, componentName) {
    if (!frame || frame.type !== "FRAME") return null;
    try {
      const component = figma.createComponentFromNode(frame);
      component.name = componentName;
      stats.components++;
      return component;
    } catch(e) { return null; }
  }

  // Find first instance of each button variant in Light Mode
  const buttonSection = ds.findOne(n => n.name === "05 — Buttons");
  if (buttonSection) {
    const buttonTexts = buttonSection.findAll(n => n.type === "TEXT");
    for (const bt of buttonTexts) {
      const text = bt.characters.trim();
      if (["Primary", "Ghost", "Amber", "Danger"].includes(text)) {
        // The button itself is likely a sibling or nearby frame
        const parent = bt.parent;
        if (parent && parent.type === "FRAME" && parent.children.length <= 3) {
          // This might be the button or its label container
          const buttonFrame = parent.findOne(n =>
            n.type === "FRAME" &&
            n.height >= 30 && n.height <= 60 &&
            n.width >= 60
          );
          if (buttonFrame && buttonFrame.name.includes("Frame")) {
            buttonFrame.name = "Button / " + text;
          }
        }
      }
    }
  }

  // Name card variants properly
  const cardSection = ds.findOne(n => n.name === "07 — Cards");
  if (cardSection) {
    const cardTexts = cardSection.findAll(n => n.type === "TEXT");
    for (const ct of cardTexts) {
      const text = ct.characters.trim();
      if (text === "Default Card" || text === "Elevated Card" || text === "Module Tile") {
        // Find the visual card near this label
        const siblings = ct.parent?.children || [];
        for (const sib of siblings) {
          if (sib.type === "FRAME" && sib !== ct.parent && sib.height >= 60) {
            sib.name = "Card / " + text.replace(" Card", "").replace("Module ", "");
          }
        }
      }
    }
  }

  // ── DONE ──────────────────────────────────────────────────

  figma.notify("✅ Auto-layout complete! " + stats.autoLayout + " frames converted, " + stats.resized + " resized, " + stats.components + " components created");

  console.log("=== AUTO-LAYOUT RESULTS ===");
  console.log("Frames with auto-layout applied:", stats.autoLayout);
  console.log("Children resized to fill:", stats.resized);
  console.log("Components created:", stats.components);

  // Final count check
  const finalAbsolute = ds.findAll(n => n.type === "FRAME" && n.layoutMode === "NONE").length;
  const finalAutoLayout = ds.findAll(n => n.type === "FRAME" && n.layoutMode !== "NONE").length;
  console.log("Final absolute frames:", finalAbsolute);
  console.log("Final auto-layout frames:", finalAutoLayout);
})();
