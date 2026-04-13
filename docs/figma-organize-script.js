// ============================================================
// NEXI Design System — Figma Organizer Script
// Run this in Figma: Plugins > Development > Open Console
// Then paste and press Enter
// ============================================================

(async () => {
  const page = figma.currentPage;

  // Find the design system frame (node 10:2)
  const dsFrame = page.findOne(n => n.name === "NEXI Design System — Figma Export");
  if (!dsFrame) {
    figma.notify("❌ Could not find 'NEXI Design System — Figma Export' frame");
    return;
  }

  figma.notify("🔧 Starting organization...");

  // ── HELPER FUNCTIONS ──────────────────────────────────────

  function findByText(parent, textContent) {
    return parent.findOne(n => n.type === "TEXT" && n.characters.includes(textContent));
  }

  function findParentFrame(node, depth = 1) {
    let current = node;
    for (let i = 0; i < depth; i++) {
      if (current.parent) current = current.parent;
    }
    return current;
  }

  function applyAutoLayout(frame, direction = "VERTICAL", gap = 0, padding = 0) {
    if (!frame || frame.type !== "FRAME") return;
    frame.layoutMode = direction;
    frame.itemSpacing = gap;
    frame.paddingTop = typeof padding === 'object' ? padding.top || 0 : padding;
    frame.paddingRight = typeof padding === 'object' ? padding.right || 0 : padding;
    frame.paddingBottom = typeof padding === 'object' ? padding.bottom || 0 : padding;
    frame.paddingLeft = typeof padding === 'object' ? padding.left || 0 : padding;
    frame.primaryAxisSizingMode = "AUTO";
    frame.counterAxisSizingMode = "AUTO";
  }

  // ── 1. RENAME MAIN FRAME ─────────────────────────────────

  dsFrame.name = "NEXI Design System";

  // ── 2. REMOVE PLASMO ARTIFACT ─────────────────────────────

  const plasmo = dsFrame.findOne(n => n.name === "Plasmo-csui");
  if (plasmo) plasmo.remove();

  // ── 3. RENAME BODY ────────────────────────────────────────

  const body = dsFrame.findOne(n => n.name === "Body");
  if (body) body.name = "Design System Content";

  // ── 4. MAP SECTIONS TO PROPER NAMES ───────────────────────
  // We identify sections by finding their title text nodes
  // and renaming their parent containers

  const sectionMap = [
    { search: "Color Palette — 30 Tokens", sectionName: "01 — Color Palette", containerDepth: 1 },
    { search: "Typography — 2 Fonts · 12 Sizes", sectionName: "02 — Typography", containerDepth: 1 },
    { search: "Spacing & Radius", sectionName: "03 — Spacing & Radius", containerDepth: 1 },
    { search: "Shadows & Effects", sectionName: "04 — Shadows & Effects", containerDepth: 1 },
    { search: "Buttons — 4 Variants · 3 Sizes", sectionName: "05 — Buttons", containerDepth: 1 },
    { search: "Form Inputs — Text · Select · Textarea", sectionName: "06 — Form Inputs", containerDepth: 1 },
    { search: "Cards — 3 Variants", sectionName: "07 — Cards", containerDepth: 1 },
    { search: "Progress & Status", sectionName: "08 — Progress & Status", containerDepth: 1 },
    { search: "Global Header — 48px · 2 Variants", sectionName: "09 — Global Header", containerDepth: 1 },
    { search: "Special Patterns — Unique UI Elements", sectionName: "10 — Special Patterns", containerDepth: 1 },
    { search: "Logos & Branding — 5 Assets", sectionName: "11 — Logos & Branding", containerDepth: 1 },
  ];

  for (const mapping of sectionMap) {
    const textNode = findByText(dsFrame, mapping.search);
    if (textNode) {
      // Navigate up to the section container
      let sectionContainer = textNode;
      for (let i = 0; i < mapping.containerDepth; i++) {
        sectionContainer = sectionContainer.parent;
      }
      // Go up one more to get the actual section wrapper
      if (sectionContainer.parent && sectionContainer.parent.name === "Container") {
        sectionContainer = sectionContainer.parent;
      }
      sectionContainer.name = mapping.sectionName;

      // Also rename the title container
      if (textNode.parent && textNode.parent.name === "Container") {
        textNode.parent.name = mapping.sectionName + " / Title";
      }
    }
  }

  // ── 5. RENAME HEADER SECTION ──────────────────────────────

  const designSystemTitle = findByText(dsFrame, "Design System");
  if (designSystemTitle) {
    let headerSection = designSystemTitle;
    // Navigate up to find the header container
    while (headerSection.parent && headerSection.parent !== body) {
      headerSection = headerSection.parent;
    }
    if (headerSection.name === "Container") {
      headerSection.name = "00 — Header";
    }
  }

  // ── 6. RENAME SUB-CONTAINERS ──────────────────────────────
  // Find Light Mode / Dark Mode labels and rename their parent containers

  const allTextNodes = dsFrame.findAll(n => n.type === "TEXT");

  for (const textNode of allTextNodes) {
    const text = textNode.characters.trim();

    // Rename Light/Dark Mode containers
    if (text === "Light Mode" || text === "Dark Mode") {
      if (textNode.parent && textNode.parent.name === "Container") {
        textNode.parent.name = text + " — Label";
      }
      // The content container is usually the sibling - find the parent section
      const grandparent = textNode.parent?.parent;
      if (grandparent && grandparent.name === "Container") {
        grandparent.name = text;
      }
    }

    // Rename specific subsection containers
    if (text === "Backgrounds (3)" && textNode.parent?.name === "Container") {
      textNode.parent.name = "Backgrounds — Label";
      if (textNode.parent.parent?.name === "Container") {
        textNode.parent.parent.name = "Color / Backgrounds";
      }
    }
    if (text === "Primary (4)" && textNode.parent?.name === "Container") {
      textNode.parent.name = "Primary — Label";
      if (textNode.parent.parent?.name === "Container") {
        textNode.parent.parent.name = "Color / Primary";
      }
    }
    if (text === "Semantic (6)" && textNode.parent?.name === "Container") {
      textNode.parent.name = "Semantic — Label";
      if (textNode.parent.parent?.name === "Container") {
        textNode.parent.parent.name = "Color / Semantic";
      }
    }
    if (text === "Module Color Mapping" && textNode.parent?.name === "Container") {
      textNode.parent.name = "Module Color Mapping — Label";
      if (textNode.parent.parent?.name === "Container") {
        textNode.parent.parent.name = "Color / Module Mapping";
      }
    }
    if (text === "NEXI Icon" && textNode.parent?.name === "Container") {
      textNode.parent.name = "NEXI Icon — Label";
      if (textNode.parent.parent?.name === "Container") {
        textNode.parent.parent.name = "Logo / NEXI Icon";
      }
    }
    if (text === "NEXI Full Logo" && textNode.parent?.name === "Container") {
      textNode.parent.name = "NEXI Full Logo — Label";
      if (textNode.parent.parent?.name === "Container") {
        textNode.parent.parent.name = "Logo / NEXI Full Logo";
      }
    }
    if (text === "Powered by TrueOmni" && textNode.parent?.name === "Container") {
      textNode.parent.name = "Powered by TrueOmni — Label";
      if (textNode.parent.parent?.name === "Container") {
        textNode.parent.parent.name = "Logo / Powered by TrueOmni";
      }
    }
    if (text === "Logo Usage Rules" && textNode.parent?.name === "Container") {
      textNode.parent.name = "Logo Usage Rules — Label";
      if (textNode.parent.parent?.name === "Container") {
        textNode.parent.parent.name = "Logo / Usage Rules";
      }
    }

    // Rename button variant labels
    if ((text === "Primary" || text === "Ghost" || text === "Amber" || text === "Danger")
        && textNode.parent?.name === "Container") {
      textNode.parent.name = "Button " + text + " — Label";
    }

    // Rename card variant labels
    if ((text === "Default Card" || text === "Elevated Card" || text === "Module Tile")
        && textNode.parent?.name === "Container") {
      textNode.parent.name = text;
    }

    // Rename spacing labels
    if (text === "Light — Spacing (4px grid)" && textNode.parent?.name === "Container") {
      if (textNode.parent.parent?.name === "Container") {
        textNode.parent.parent.name = "Spacing / Light";
      }
    }
    if (text === "Dark — Spacing (4px grid)" && textNode.parent?.name === "Container") {
      if (textNode.parent.parent?.name === "Container") {
        textNode.parent.parent.name = "Spacing / Dark";
      }
    }

    // Rename shadow labels
    if (text === "Light Shadows" && textNode.parent?.name === "Container") {
      if (textNode.parent.parent?.name === "Container") {
        textNode.parent.parent.name = "Shadows / Light";
      }
    }
    if (text === "Dark Shadows" && textNode.parent?.name === "Container") {
      if (textNode.parent.parent?.name === "Container") {
        textNode.parent.parent.name = "Shadows / Dark";
      }
    }
  }

  // ── 7. RENAME REMAINING GENERIC CONTAINERS ────────────────
  // Color swatch cards
  const colorTokenNames = [
    "bg", "bg-card", "bg-elevated",
    "primary", "primary-hover", "primary-light", "primary-glow",
    "success", "error", "amber", "purple", "yellow", "orange",
    "text", "text-secondary", "text-tertiary", "border", "border-hover"
  ];

  for (const tokenName of colorTokenNames) {
    const tokenTexts = dsFrame.findAll(n => n.type === "TEXT" && n.characters === tokenName);
    for (const tt of tokenTexts) {
      // The swatch card is usually the grandparent
      let card = tt.parent;
      if (card && card.name === "Container") {
        card.name = "Swatch / " + tokenName;
      }
    }
  }

  // ── 8. RENAME TEXT & BORDER SECTION ───────────────────────

  for (const textNode of allTextNodes) {
    const text = textNode.characters.trim();
    if (text === "Text & Borders (5)") {
      if (textNode.parent?.name === "Container") {
        textNode.parent.name = "Text & Borders — Label";
      }
      if (textNode.parent?.parent?.name === "Container") {
        textNode.parent.parent.name = "Color / Text & Borders";
      }
    }
  }

  // ── 9. APPLY AUTO-LAYOUT TO MAJOR SECTIONS ────────────────

  // Apply auto-layout to the main content frame
  if (body && body.type === "FRAME") {
    try {
      body.layoutMode = "VERTICAL";
      body.itemSpacing = 0;
      body.primaryAxisSizingMode = "AUTO";
      body.counterAxisSizingMode = "FIXED";
    } catch(e) { /* some frames may resist */ }
  }

  // Apply auto-layout to each major section
  const sectionNames = [
    "00 — Header", "01 — Color Palette", "02 — Typography",
    "03 — Spacing & Radius", "04 — Shadows & Effects", "05 — Buttons",
    "06 — Form Inputs", "07 — Cards", "08 — Progress & Status",
    "09 — Global Header", "10 — Special Patterns", "11 — Logos & Branding"
  ];

  for (const sName of sectionNames) {
    const section = dsFrame.findOne(n => n.name === sName && n.type === "FRAME");
    if (section) {
      try {
        section.layoutMode = "VERTICAL";
        section.itemSpacing = 24;
        section.paddingTop = 48;
        section.paddingBottom = 48;
        section.paddingLeft = 48;
        section.paddingRight = 48;
        section.primaryAxisSizingMode = "AUTO";
        section.counterAxisSizingMode = "FIXED";
      } catch(e) { /* skip if can't apply */ }
    }
  }

  // ── 10. CLEAN UP REMAINING "Container" NAMES ─────────────
  // Rename any remaining "Container" frames with a counter

  let containerCount = 0;
  const remainingContainers = dsFrame.findAll(n => n.name === "Container" && n.type === "FRAME");
  for (const container of remainingContainers) {
    containerCount++;
    // Try to identify by children
    const firstText = container.findOne(n => n.type === "TEXT");
    if (firstText) {
      const chars = firstText.characters.substring(0, 30).trim();
      if (chars.length > 2) {
        container.name = "Frame / " + chars;
        continue;
      }
    }
    container.name = "Frame " + containerCount;
  }

  // ── 11. RENAME SEPARATOR LINES ────────────────────────────

  const separators = dsFrame.findAll(n => n.type === "LINE" || (n.type === "RECTANGLE" && n.height <= 2));
  let sepCount = 0;
  for (const sep of separators) {
    if (sep.name === "Line" || sep.name === "Container" || sep.name === "Rectangle") {
      sepCount++;
      sep.name = "Divider " + sepCount;
    }
  }

  // ── 12. RENAME ICON/VECTOR NODES ──────────────────────────

  const vectors = dsFrame.findAll(n => n.type === "VECTOR" && n.name === "Vector");
  let vecCount = 0;
  for (const vec of vectors) {
    vecCount++;
    // Check parent name for context
    const parentName = vec.parent?.name || "";
    if (parentName.includes("Icon") || parentName.includes("Logo") || parentName.includes("NEXI")) {
      vec.name = "Icon Path " + vecCount;
    } else {
      vec.name = "Shape " + vecCount;
    }
  }

  // ── 13. RENAME GROUP NODES ────────────────────────────────

  const groups = dsFrame.findAll(n => n.name === "Group" && (n.type === "GROUP" || n.type === "FRAME"));
  let groupCount = 0;
  for (const group of groups) {
    groupCount++;
    const parentName = group.parent?.name || "";
    if (parentName.includes("Icon") || parentName.includes("Logo")) {
      group.name = "Logo Group " + groupCount;
    } else {
      group.name = "Element Group " + groupCount;
    }
  }

  // ── DONE ──────────────────────────────────────────────────

  figma.notify("✅ Organization complete! Renamed " +
    sectionMap.length + " sections, " +
    containerCount + " containers, " +
    vecCount + " vectors, " +
    groupCount + " groups");

  console.log("=== NEXI Design System Organization Complete ===");
  console.log("Sections renamed:", sectionMap.length);
  console.log("Containers cleaned:", containerCount);
  console.log("Vectors renamed:", vecCount);
  console.log("Groups renamed:", groupCount);
})();
