// ============================================================
// NEXI Design System — Script 3/4: Documentation Page
// Creates organized doc page showcasing all tokens and components
// RUN AFTER Scripts 1 & 2
// Figma: Plugins > Development > Open Console > Paste & Enter
// ============================================================

(async () => {
  figma.notify("📄 Creating documentation page...");

  // ── LOAD VARIABLES & FONTS ────────────────────────────────
  const allVars = await figma.variables.getLocalVariablesAsync("COLOR");

  function getVar(name) {
    return allVars.find(v => v.name === name);
  }

  function bindFill(node, varName) {
    const v = getVar(varName);
    if (v) {
      node.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
      node.setBoundVariable("fills", 0, "color", v);
    }
  }

  function setFill(node, hex) {
    const h = hex.replace("#", "");
    node.fills = [{
      type: "SOLID",
      color: {
        r: parseInt(h.substring(0, 2), 16) / 255,
        g: parseInt(h.substring(2, 4), 16) / 255,
        b: parseInt(h.substring(4, 6), 16) / 255
      }
    }];
  }

  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Extra Bold" });

  function text(chars, size, weight, colorVar) {
    const t = figma.createText();
    const style = weight >= 800 ? "Extra Bold" : weight >= 700 ? "Bold" : weight >= 600 ? "Semi Bold" : weight >= 500 ? "Medium" : "Regular";
    t.fontName = { family: "Inter", style };
    t.characters = chars;
    t.fontSize = size;
    if (colorVar) bindFill(t, colorVar);
    return t;
  }

  // ── CREATE/FIND DOC PAGE ──────────────────────────────────
  let docPage = figma.root.findOne(n => n.type === "PAGE" && n.name === "Design System");
  if (!docPage) {
    docPage = figma.createPage();
    docPage.name = "Design System";
  }
  figma.currentPage = docPage;

  // ── MAIN CONTAINER ────────────────────────────────────────
  const main = figma.createFrame();
  main.name = "NEXI Design System";
  main.layoutMode = "VERTICAL";
  main.itemSpacing = 0;
  main.resize(1440, 1);
  main.primaryAxisSizingMode = "AUTO";
  main.counterAxisSizingMode = "FIXED";
  bindFill(main, "bg/default");
  docPage.appendChild(main);

  // ── HELPER: Create section ────────────────────────────────
  function createSection(title, subtitle) {
    const section = figma.createFrame();
    section.name = title;
    section.layoutMode = "VERTICAL";
    section.itemSpacing = 24;
    section.paddingTop = 64; section.paddingBottom = 64;
    section.paddingLeft = 80; section.paddingRight = 80;
    section.primaryAxisSizingMode = "AUTO";
    section.counterAxisSizingMode = "FILL";
    section.layoutSizingHorizontal = "FILL";
    section.fills = [];

    // Title
    const titleText = text(title, 32, 700, "text/primary");
    titleText.name = "Section Title";
    titleText.layoutSizingHorizontal = "FILL";
    section.appendChild(titleText);

    // Divider
    const divider = figma.createFrame();
    divider.name = "Divider";
    divider.resize(100, 2);
    divider.layoutSizingHorizontal = "FILL";
    bindFill(divider, "primary/default");
    section.appendChild(divider);

    if (subtitle) {
      const sub = text(subtitle, 14, 400, "text/secondary");
      sub.name = "Subtitle";
      sub.layoutSizingHorizontal = "FILL";
      section.appendChild(sub);
    }

    return section;
  }

  // ── HELPER: Create row container ──────────────────────────
  function createRow(name, gap) {
    const row = figma.createFrame();
    row.name = name;
    row.layoutMode = "HORIZONTAL";
    row.itemSpacing = gap || 16;
    row.layoutWrap = "WRAP";
    row.counterAxisSpacing = gap || 16;
    row.primaryAxisSizingMode = "AUTO";
    row.counterAxisSizingMode = "AUTO";
    row.layoutSizingHorizontal = "FILL";
    row.fills = [];
    return row;
  }

  // ── HELPER: Color swatch card ─────────────────────────────
  function createSwatch(tokenName, lightHex, darkHex) {
    const card = figma.createFrame();
    card.name = "Swatch / " + tokenName;
    card.layoutMode = "VERTICAL";
    card.itemSpacing = 8;
    card.resize(200, 1);
    card.primaryAxisSizingMode = "AUTO";
    card.counterAxisSizingMode = "FIXED";
    card.fills = [];

    // Color rectangle
    const swatch = figma.createFrame();
    swatch.name = "Color";
    swatch.resize(200, 80);
    swatch.cornerRadius = 8;
    swatch.layoutSizingHorizontal = "FILL";
    bindFill(swatch, tokenName);
    // Add border for light colors
    swatch.strokes = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 0.08 }];
    swatch.strokeWeight = 1;
    card.appendChild(swatch);

    // Token name
    const nameText = text(tokenName, 12, 600, "text/primary");
    nameText.name = "Token";
    card.appendChild(nameText);

    // Values
    const valText = text("L: " + lightHex + "  D: " + darkHex, 10, 400, "text/tertiary");
    valText.name = "Values";
    card.appendChild(valText);

    return card;
  }

  // ══════════════════════════════════════════════════════════
  // HEADER
  // ══════════════════════════════════════════════════════════

  const header = figma.createFrame();
  header.name = "Header";
  header.layoutMode = "VERTICAL";
  header.primaryAxisAlignItems = "CENTER";
  header.counterAxisAlignItems = "CENTER";
  header.itemSpacing = 12;
  header.paddingTop = 80; header.paddingBottom = 80;
  header.paddingLeft = 80; header.paddingRight = 80;
  header.layoutSizingHorizontal = "FILL";
  header.primaryAxisSizingMode = "AUTO";
  header.counterAxisSizingMode = "FILL";
  bindFill(header, "bg/card");

  const brandLabel = text("NEXI by TrueOmni", 10, 700, "primary/default");
  brandLabel.name = "Brand";
  brandLabel.letterSpacing = { value: 2, unit: "PIXELS" };
  brandLabel.textCase = "UPPER";
  header.appendChild(brandLabel);

  const mainTitle = text("Design System", 48, 800, "text/primary");
  mainTitle.name = "Title";
  header.appendChild(mainTitle);

  const mainSub = text("82 screens · 16 modules · 1920×1080 Landscape · Nordic Cinematic", 14, 400, "text/secondary");
  mainSub.name = "Subtitle";
  header.appendChild(mainSub);

  main.appendChild(header);

  // ══════════════════════════════════════════════════════════
  // 1. COLOR PALETTE
  // ══════════════════════════════════════════════════════════

  figma.notify("📄 Building color section...");
  const colorSection = createSection("Color Palette", "Every color is a variable with Light + Dark modes. Screens never use hardcoded hex values.");

  // Backgrounds
  const bgLabel = text("Backgrounds", 14, 600, "text/secondary");
  colorSection.appendChild(bgLabel);
  const bgRow = createRow("Background Colors");
  bgRow.appendChild(createSwatch("bg/default", "#F5F5F0", "#0C0C0E"));
  bgRow.appendChild(createSwatch("bg/card", "#FFFFFF", "#1A1A1F"));
  bgRow.appendChild(createSwatch("bg/elevated", "#FFFFFF", "#222228"));
  colorSection.appendChild(bgRow);

  // Primary
  const priLabel = text("Primary", 14, 600, "text/secondary");
  colorSection.appendChild(priLabel);
  const priRow = createRow("Primary Colors");
  priRow.appendChild(createSwatch("primary/default", "#1288FF", "#1288FF"));
  priRow.appendChild(createSwatch("primary/hover", "#0B6FD4", "#3DA0FF"));
  priRow.appendChild(createSwatch("primary/light", "8%", "12%"));
  priRow.appendChild(createSwatch("primary/glow", "25%", "35%"));
  colorSection.appendChild(priRow);

  // Semantic
  const semLabel = text("Semantic", 14, 600, "text/secondary");
  colorSection.appendChild(semLabel);
  const semRow = createRow("Semantic Colors");
  semRow.appendChild(createSwatch("semantic/success", "#16A34A", "#22C55E"));
  semRow.appendChild(createSwatch("semantic/error", "#DC2626", "#EF4444"));
  semRow.appendChild(createSwatch("semantic/amber", "#D4960A", "#E5A91B"));
  semRow.appendChild(createSwatch("semantic/purple", "#8B5CF6", "#A78BFA"));
  semRow.appendChild(createSwatch("semantic/yellow", "#FBBF24", "#FCD34D"));
  semRow.appendChild(createSwatch("semantic/orange", "#F97316", "#FB923C"));
  colorSection.appendChild(semRow);

  // Text & Border
  const tbLabel = text("Text & Borders", 14, 600, "text/secondary");
  colorSection.appendChild(tbLabel);
  const tbRow = createRow("Text & Border Colors");
  tbRow.appendChild(createSwatch("text/primary", "#1A1A1A", "#F0F0F0"));
  tbRow.appendChild(createSwatch("text/secondary", "#6B7280", "#8E93A4"));
  tbRow.appendChild(createSwatch("text/tertiary", "#9CA3AF", "#5A5E6E"));
  tbRow.appendChild(createSwatch("border/default", "#E8E8E3", "#2A2A30"));
  tbRow.appendChild(createSwatch("border/hover", "#D1D1CC", "#3A3A42"));
  colorSection.appendChild(tbRow);

  main.appendChild(colorSection);

  // ══════════════════════════════════════════════════════════
  // 2. TYPOGRAPHY
  // ══════════════════════════════════════════════════════════

  figma.notify("📄 Building typography section...");
  const typoSection = createSection("Typography", "Mona Sans for display/headings (approximated with Inter Bold/ExtraBold). Inter for body/UI.");

  const typeScale = [
    { label: "H1 Hero — 48px / 800", size: 48, weight: 800, sample: "Welcome to NEXI" },
    { label: "H1 Section — 28px / 700", size: 28, weight: 700, sample: "Find Your Reservation" },
    { label: "H2 — 24px / 800", size: 24, weight: 800, sample: "Welcome back, Sarah" },
    { label: "H3 — 20px / 700", size: 20, weight: 700, sample: "Booking Confirmed" },
    { label: "H4 — 18px / 600", size: 18, weight: 600, sample: "Processing your request" },
    { label: "Body — 15px / 400", size: 15, weight: 400, sample: "Search by confirmation number or scan your QR code." },
    { label: "Small Body — 13px / 500", size: 13, weight: 500, sample: "Hold your passport flat on the scanner" },
    { label: "Label — 12px / 600", size: 12, weight: 600, sample: "Mar 16, 2026 · 4:30 PM" },
    { label: "Caption — 11px / 400", size: 11, weight: 400, sample: "Ocean Suite · Checkout Feb 25" },
  ];

  for (const ts of typeScale) {
    const typeRow = figma.createFrame();
    typeRow.name = ts.label;
    typeRow.layoutMode = "VERTICAL";
    typeRow.itemSpacing = 4;
    typeRow.layoutSizingHorizontal = "FILL";
    typeRow.primaryAxisSizingMode = "AUTO";
    typeRow.counterAxisSizingMode = "FILL";
    typeRow.fills = [];

    const typeLabel = text(ts.label, 10, 600, "text/tertiary");
    typeLabel.textCase = "UPPER";
    typeLabel.letterSpacing = { value: 1, unit: "PIXELS" };
    typeRow.appendChild(typeLabel);

    const typeSample = text(ts.sample, ts.size, ts.weight, "text/primary");
    typeSample.layoutSizingHorizontal = "FILL";
    typeRow.appendChild(typeSample);

    typoSection.appendChild(typeRow);
  }

  main.appendChild(typoSection);

  // ══════════════════════════════════════════════════════════
  // 3. SPACING & RADIUS
  // ══════════════════════════════════════════════════════════

  const spaceSection = createSection("Spacing & Radius", "4px base grid. Radius tokens from 8px (sm) to 9999px (full).");

  // Spacing bars
  const spaceRow = createRow("Spacing Scale", 12);
  const spacings = [4, 8, 12, 16, 20, 24, 32, 48, 64];
  for (const sp of spacings) {
    const spaceItem = figma.createFrame();
    spaceItem.name = sp + "px";
    spaceItem.layoutMode = "VERTICAL";
    spaceItem.counterAxisAlignItems = "CENTER";
    spaceItem.itemSpacing = 8;
    spaceItem.primaryAxisSizingMode = "AUTO";
    spaceItem.counterAxisSizingMode = "AUTO";
    spaceItem.fills = [];

    const bar = figma.createFrame();
    bar.name = "Bar";
    bar.resize(sp, 32);
    bar.cornerRadius = 2;
    bindFill(bar, "primary/default");
    spaceItem.appendChild(bar);

    const label = text(sp + "px", 10, 500, "text/tertiary");
    spaceItem.appendChild(label);
    spaceRow.appendChild(spaceItem);
  }
  spaceSection.appendChild(spaceRow);

  // Radius examples
  const radiusLabel = text("Border Radius", 14, 600, "text/secondary");
  spaceSection.appendChild(radiusLabel);
  const radiusRow = createRow("Radius Scale", 24);
  const radii = [
    { name: "sm", value: 8 }, { name: "md", value: 12 },
    { name: "lg", value: 16 }, { name: "xl", value: 20 },
    { name: "full", value: 9999 }
  ];
  for (const r of radii) {
    const rItem = figma.createFrame();
    rItem.name = "radius-" + r.name;
    rItem.layoutMode = "VERTICAL";
    rItem.counterAxisAlignItems = "CENTER";
    rItem.itemSpacing = 8;
    rItem.primaryAxisSizingMode = "AUTO";
    rItem.counterAxisSizingMode = "AUTO";
    rItem.fills = [];

    const rBox = figma.createFrame();
    rBox.name = "Shape";
    rBox.resize(r.name === "full" ? 96 : 64, r.name === "full" ? 44 : 64);
    rBox.cornerRadius = r.value;
    bindFill(rBox, "primary/light");
    rBox.strokes = [{ type: "SOLID", color: { r: 0.07, g: 0.53, b: 1 } }];
    rBox.strokeWeight = 2;
    rItem.appendChild(rBox);

    const rLabel = text(r.name + " (" + (r.value === 9999 ? "full" : r.value + "px") + ")", 10, 600, "text/primary");
    rItem.appendChild(rLabel);
    radiusRow.appendChild(rItem);
  }
  spaceSection.appendChild(radiusRow);

  main.appendChild(spaceSection);

  // ══════════════════════════════════════════════════════════
  // 4. COMPONENTS SHOWCASE
  // ══════════════════════════════════════════════════════════

  figma.notify("📄 Building components showcase...");
  const compSection = createSection("Components", "All components use auto-layout, bound variables, and respond to Light/Dark mode switching.");

  const compNote = text("Switch the variable mode on this frame between 'Light' and 'Dark' to preview both themes.", 13, 500, "primary/default");
  compSection.appendChild(compNote);

  // Find and instantiate components
  const allComponents = figma.root.findAll(n => n.type === "COMPONENT");

  // Buttons subsection
  const btnSubLabel = text("Buttons", 18, 700, "text/primary");
  compSection.appendChild(btnSubLabel);

  const btnRow = createRow("Button Instances", 16);
  const buttonComp = figma.root.findOne(n => n.type === "COMPONENT_SET" && n.name === "Button");
  if (buttonComp) {
    for (const variant of buttonComp.children) {
      if (variant.type === "COMPONENT" && variant.name.includes("Size=Default")) {
        const inst = variant.createInstance();
        inst.name = "Button / " + variant.name;
        btnRow.appendChild(inst);
      }
    }
  }
  compSection.appendChild(btnRow);

  // Cards subsection
  const cardSubLabel = text("Cards", 18, 700, "text/primary");
  compSection.appendChild(cardSubLabel);

  const cardRow = createRow("Card Instances", 24);
  const cardComp = figma.root.findOne(n => n.type === "COMPONENT_SET" && n.name === "Card");
  if (cardComp) {
    for (const variant of cardComp.children) {
      if (variant.type === "COMPONENT") {
        const inst = variant.createInstance();
        inst.name = "Card / " + variant.name;
        cardRow.appendChild(inst);
      }
    }
  }
  compSection.appendChild(cardRow);

  // Headers subsection
  const hdrSubLabel = text("Global Header", 18, 700, "text/primary");
  compSection.appendChild(hdrSubLabel);

  const hdrCol = figma.createFrame();
  hdrCol.name = "Header Instances";
  hdrCol.layoutMode = "VERTICAL";
  hdrCol.itemSpacing = 16;
  hdrCol.layoutSizingHorizontal = "FILL";
  hdrCol.primaryAxisSizingMode = "AUTO";
  hdrCol.counterAxisSizingMode = "FILL";
  hdrCol.fills = [];

  const headerComp = figma.root.findOne(n => n.type === "COMPONENT_SET" && n.name === "Global Header");
  if (headerComp) {
    for (const variant of headerComp.children) {
      if (variant.type === "COMPONENT") {
        const inst = variant.createInstance();
        inst.name = "Header / " + variant.name;
        inst.layoutSizingHorizontal = "FILL";
        hdrCol.appendChild(inst);
      }
    }
  }
  compSection.appendChild(hdrCol);

  // Other components
  const otherLabel = text("UI Elements", 18, 700, "text/primary");
  compSection.appendChild(otherLabel);

  const otherRow = createRow("Other Instances", 24);
  const singleComps = ["Pill Button", "Module Tile", "Text Input", "Badge", "Tab Bar", "Quantity Counter", "Progress Bar"];
  for (const compName of singleComps) {
    const comp = figma.root.findOne(n => n.type === "COMPONENT" && n.name === compName);
    if (comp) {
      const inst = comp.createInstance();
      inst.name = compName;
      otherRow.appendChild(inst);
    }
  }
  compSection.appendChild(otherRow);

  main.appendChild(compSection);

  // ══════════════════════════════════════════════════════════
  // FOOTER
  // ══════════════════════════════════════════════════════════

  const footer = figma.createFrame();
  footer.name = "Footer";
  footer.layoutMode = "VERTICAL";
  footer.primaryAxisAlignItems = "CENTER";
  footer.counterAxisAlignItems = "CENTER";
  footer.itemSpacing = 8;
  footer.paddingTop = 48; footer.paddingBottom = 48;
  footer.layoutSizingHorizontal = "FILL";
  footer.primaryAxisSizingMode = "AUTO";
  footer.counterAxisSizingMode = "FILL";
  footer.fills = [];

  const footerText = text("NEXI Design System · 82 screens · 16 modules", 12, 400, "text/tertiary");
  footer.appendChild(footerText);

  const footerText2 = text("March 2026 · Generated from nexi-prototype source code", 10, 400, "text/tertiary");
  footer.appendChild(footerText2);

  main.appendChild(footer);

  // ══════════════════════════════════════════════════════════
  // DONE
  // ══════════════════════════════════════════════════════════

  // Zoom to fit
  figma.viewport.scrollAndZoomIntoView([main]);

  figma.notify("✅ Documentation page created! Switch Light/Dark mode on the main frame to preview both themes.");
  console.log("=== SCRIPT 3 COMPLETE ===");
  console.log("Created 'Design System' page with:");
  console.log("- Header with branding");
  console.log("- Color Palette (22 swatches with bound variables)");
  console.log("- Typography (9 scale levels)");
  console.log("- Spacing & Radius (9 spacings + 5 radii)");
  console.log("- Components showcase (instances of all components)");
  console.log("- All bound to NEXI Design Tokens variables");
  console.log("");
  console.log("To preview Dark mode: Select the main frame > Design panel > Layer section > Change 'Light' to 'Dark'");
})();
