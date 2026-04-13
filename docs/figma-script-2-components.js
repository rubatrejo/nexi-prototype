// ============================================================
// NEXI Design System — Script 2/4: Components
// Creates Button, Card, Input, Header, Badge, Progress components
// with auto-layout, variants, and bound variables
// RUN AFTER Script 1 (variables must exist)
// Figma: Plugins > Development > Open Console > Paste & Enter
// ============================================================

(async () => {
  figma.notify("🧩 Creating NEXI components...");

  // ── LOAD VARIABLES ────────────────────────────────────────
  const allVars = await figma.variables.getLocalVariablesAsync("COLOR");
  const allNums = await figma.variables.getLocalVariablesAsync("FLOAT");

  function getVar(name) {
    return allVars.find(v => v.name === name) || allNums.find(v => v.name === name);
  }

  function bindFill(node, varName) {
    const v = getVar(varName);
    if (v) {
      const alias = figma.variables.createVariableAlias(v);
      node.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 }, boundVariables: { color: alias } }];
      // Re-apply with binding
      node.setBoundVariable("fills", 0, "color", v);
    }
  }

  function bindStroke(node, varName) {
    const v = getVar(varName);
    if (v) {
      node.strokes = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
      node.setBoundVariable("strokes", 0, "color", v);
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

  // ── FONT LOADING ──────────────────────────────────────────
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Extra Bold" });

  // ── HELPER: Create text node ──────────────────────────────
  function createText(chars, size, weight, colorVar) {
    const t = figma.createText();
    const style = weight >= 800 ? "Extra Bold" : weight >= 700 ? "Bold" : weight >= 600 ? "Semi Bold" : weight >= 500 ? "Medium" : "Regular";
    t.fontName = { family: "Inter", style };
    t.characters = chars;
    t.fontSize = size;
    if (colorVar) bindFill(t, colorVar);
    return t;
  }

  // ── CREATE COMPONENT PAGE ─────────────────────────────────
  let compPage = figma.root.findOne(n => n.type === "PAGE" && n.name === "Components");
  if (!compPage) {
    compPage = figma.createPage();
    compPage.name = "Components";
  }
  figma.currentPage = compPage;

  let xOffset = 0;
  let yOffset = 0;

  // ══════════════════════════════════════════════════════════
  // 1. BUTTON COMPONENT SET (4 variants × 3 sizes)
  // ══════════════════════════════════════════════════════════

  figma.notify("🔧 Creating buttons...");

  const buttonVariants = [
    { name: "Primary", bgVar: "primary/default", textColor: "fixed/white" },
    { name: "Ghost", bgVar: null, textColor: "text/secondary", border: "border/default" },
    { name: "Amber", bgVar: "semantic/amber", textColor: "fixed/white" },
    { name: "Danger", bgVar: "semantic/error", textColor: "fixed/white" },
  ];

  const buttonSizes = [
    { name: "Large", paddingV: 16, paddingH: 32, fontSize: 16, radius: 16 },
    { name: "Default", paddingV: 12, paddingH: 24, fontSize: 14, radius: 12 },
    { name: "Small", paddingV: 8, paddingH: 16, fontSize: 12, radius: 8 },
  ];

  const buttonComponents = [];

  for (const variant of buttonVariants) {
    for (const size of buttonSizes) {
      const btn = figma.createComponent();
      btn.name = `Variant=${variant.name}, Size=${size.name}`;

      // Auto-layout
      btn.layoutMode = "HORIZONTAL";
      btn.primaryAxisAlignItems = "CENTER";
      btn.counterAxisAlignItems = "CENTER";
      btn.itemSpacing = 8;
      btn.paddingTop = size.paddingV;
      btn.paddingBottom = size.paddingV;
      btn.paddingLeft = size.paddingH;
      btn.paddingRight = size.paddingH;
      btn.cornerRadius = size.radius;
      btn.primaryAxisSizingMode = "AUTO";
      btn.counterAxisSizingMode = "AUTO";

      // Background
      if (variant.bgVar) {
        bindFill(btn, variant.bgVar);
      } else {
        btn.fills = [];
      }

      // Border for Ghost
      if (variant.border) {
        bindStroke(btn, variant.border);
        btn.strokeWeight = 1;
      }

      // Text
      const label = createText("Button", size.fontSize, 600, variant.textColor);
      label.name = "Label";
      btn.appendChild(label);

      btn.x = xOffset;
      btn.y = yOffset;
      compPage.appendChild(btn);

      buttonComponents.push(btn);
      xOffset += btn.width + 24;
    }
    xOffset = 0;
    yOffset += 80;
  }

  // Combine into component set
  if (buttonComponents.length > 0) {
    const buttonSet = figma.combineAsVariants(buttonComponents, compPage);
    buttonSet.name = "Button";
    buttonSet.layoutMode = "HORIZONTAL";
    buttonSet.layoutWrap = "WRAP";
    buttonSet.itemSpacing = 24;
    buttonSet.counterAxisSpacing = 24;
    buttonSet.paddingTop = 32;
    buttonSet.paddingBottom = 32;
    buttonSet.paddingLeft = 32;
    buttonSet.paddingRight = 32;
    buttonSet.primaryAxisSizingMode = "AUTO";
    buttonSet.counterAxisSizingMode = "AUTO";
    bindFill(buttonSet, "bg/elevated");
  }

  // ══════════════════════════════════════════════════════════
  // 2. PILL BUTTON
  // ══════════════════════════════════════════════════════════

  yOffset += 60;
  xOffset = 0;

  const pill = figma.createComponent();
  pill.name = "Pill Button";
  pill.layoutMode = "HORIZONTAL";
  pill.primaryAxisAlignItems = "CENTER";
  pill.counterAxisAlignItems = "CENTER";
  pill.itemSpacing = 8;
  pill.paddingTop = 14; pill.paddingBottom = 14;
  pill.paddingLeft = 32; pill.paddingRight = 32;
  pill.cornerRadius = 9999;
  pill.primaryAxisSizingMode = "AUTO";
  pill.counterAxisSizingMode = "AUTO";
  bindFill(pill, "primary/default");
  const pillLabel = createText("Tap to Start →", 15, 600, "fixed/white");
  pillLabel.name = "Label";
  pill.appendChild(pillLabel);
  pill.x = 0; pill.y = yOffset;
  compPage.appendChild(pill);

  // ══════════════════════════════════════════════════════════
  // 3. CARD COMPONENTS (3 variants)
  // ══════════════════════════════════════════════════════════

  yOffset += 100;
  figma.notify("🔧 Creating cards...");

  const cardVariants = [];

  // Default Card
  const card1 = figma.createComponent();
  card1.name = "Type=Default";
  card1.layoutMode = "VERTICAL";
  card1.itemSpacing = 8;
  card1.paddingTop = 16; card1.paddingBottom = 16;
  card1.paddingLeft = 16; card1.paddingRight = 16;
  card1.cornerRadius = 12;
  card1.resize(280, 1); // width fixed, height hug
  card1.primaryAxisSizingMode = "AUTO";
  card1.counterAxisSizingMode = "FIXED";
  card1.layoutSizingVertical = "HUG";
  bindFill(card1, "bg/card");
  bindStroke(card1, "border/default");
  card1.strokeWeight = 1;

  const card1Title = createText("Card Title", 13, 600, "text/primary");
  card1Title.name = "Title";
  card1Title.layoutSizingHorizontal = "FILL";
  card1.appendChild(card1Title);

  const card1Desc = createText("Description text for the card content goes here.", 11, 400, "text/secondary");
  card1Desc.name = "Description";
  card1Desc.layoutSizingHorizontal = "FILL";
  card1.appendChild(card1Desc);

  card1.x = 0; card1.y = yOffset;
  compPage.appendChild(card1);
  cardVariants.push(card1);

  // Elevated Card
  const card2 = figma.createComponent();
  card2.name = "Type=Elevated";
  card2.layoutMode = "VERTICAL";
  card2.itemSpacing = 8;
  card2.paddingTop = 20; card2.paddingBottom = 20;
  card2.paddingLeft = 20; card2.paddingRight = 20;
  card2.cornerRadius = 16;
  card2.resize(280, 1);
  card2.primaryAxisSizingMode = "AUTO";
  card2.counterAxisSizingMode = "FIXED";
  card2.layoutSizingVertical = "HUG";
  bindFill(card2, "bg/elevated");
  card2.effects = [{
    type: "DROP_SHADOW", color: { r: 0, g: 0, b: 0, a: 0.06 },
    offset: { x: 0, y: 4 }, radius: 12, spread: 0, visible: true,
    blendMode: "NORMAL"
  }];

  const card2Title = createText("Card Title", 13, 600, "text/primary");
  card2Title.name = "Title";
  card2Title.layoutSizingHorizontal = "FILL";
  card2.appendChild(card2Title);

  const card2Desc = createText("Description text for elevated card.", 11, 400, "text/secondary");
  card2Desc.name = "Description";
  card2Desc.layoutSizingHorizontal = "FILL";
  card2.appendChild(card2Desc);

  const card2Price = createText("$89/night", 14, 800, "semantic/amber");
  card2Price.name = "Price";
  card2.appendChild(card2Price);

  card2.x = 320; card2.y = yOffset;
  compPage.appendChild(card2);
  cardVariants.push(card2);

  // Glass Card
  const card3 = figma.createComponent();
  card3.name = "Type=Glass";
  card3.layoutMode = "VERTICAL";
  card3.itemSpacing = 12;
  card3.paddingTop = 24; card3.paddingBottom = 24;
  card3.paddingLeft = 24; card3.paddingRight = 24;
  card3.cornerRadius = 16;
  card3.resize(340, 1);
  card3.primaryAxisSizingMode = "AUTO";
  card3.counterAxisSizingMode = "FIXED";
  card3.layoutSizingVertical = "HUG";
  card3.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 }, opacity: 0.08 }];
  card3.strokes = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 }, opacity: 0.12 }];
  card3.strokeWeight = 1;
  card3.effects = [{
    type: "BACKGROUND_BLUR", radius: 24, visible: true
  }];

  const card3Title = createText("Glass Card", 20, 700, "fixed/white");
  card3Title.name = "Title";
  card3Title.layoutSizingHorizontal = "FILL";
  card3.appendChild(card3Title);

  const card3Desc = createText("Content on blurred background", 11, 400, "fixed/white");
  card3Desc.name = "Description";
  card3Desc.opacity = 0.6;
  card3Desc.layoutSizingHorizontal = "FILL";
  card3.appendChild(card3Desc);

  card3.x = 640; card3.y = yOffset;
  compPage.appendChild(card3);
  cardVariants.push(card3);

  // Combine cards
  const cardSet = figma.combineAsVariants(cardVariants, compPage);
  cardSet.name = "Card";
  cardSet.layoutMode = "HORIZONTAL";
  cardSet.itemSpacing = 32;
  cardSet.paddingTop = 32; cardSet.paddingBottom = 32;
  cardSet.paddingLeft = 32; cardSet.paddingRight = 32;
  cardSet.primaryAxisSizingMode = "AUTO";
  cardSet.counterAxisSizingMode = "AUTO";
  setFill(cardSet, "#1A1A2E");

  // ══════════════════════════════════════════════════════════
  // 4. MODULE TILE (Dashboard)
  // ══════════════════════════════════════════════════════════

  yOffset += 300;

  const moduleTile = figma.createComponent();
  moduleTile.name = "Module Tile";
  moduleTile.layoutMode = "HORIZONTAL";
  moduleTile.counterAxisAlignItems = "CENTER";
  moduleTile.itemSpacing = 12;
  moduleTile.paddingTop = 16; moduleTile.paddingBottom = 16;
  moduleTile.paddingLeft = 16; moduleTile.paddingRight = 16;
  moduleTile.cornerRadius = 12;
  moduleTile.resize(240, 1);
  moduleTile.primaryAxisSizingMode = "FIXED";
  moduleTile.counterAxisSizingMode = "AUTO";
  bindFill(moduleTile, "bg/card");
  bindStroke(moduleTile, "border/default");
  moduleTile.strokeWeight = 1;

  // Icon circle
  const iconCircle = figma.createFrame();
  iconCircle.name = "Icon";
  iconCircle.resize(40, 40);
  iconCircle.cornerRadius = 8;
  bindFill(iconCircle, "primary/light");
  iconCircle.layoutMode = "HORIZONTAL";
  iconCircle.primaryAxisAlignItems = "CENTER";
  iconCircle.counterAxisAlignItems = "CENTER";
  moduleTile.appendChild(iconCircle);

  const tileLabel = createText("Room Service", 13, 600, "text/primary");
  tileLabel.name = "Label";
  moduleTile.appendChild(tileLabel);

  moduleTile.x = 0; moduleTile.y = yOffset;
  compPage.appendChild(moduleTile);

  // ══════════════════════════════════════════════════════════
  // 5. TEXT INPUT
  // ══════════════════════════════════════════════════════════

  yOffset += 100;
  figma.notify("🔧 Creating inputs...");

  const textInput = figma.createComponent();
  textInput.name = "Text Input";
  textInput.layoutMode = "HORIZONTAL";
  textInput.counterAxisAlignItems = "CENTER";
  textInput.itemSpacing = 12;
  textInput.paddingTop = 14; textInput.paddingBottom = 14;
  textInput.paddingLeft = 16; textInput.paddingRight = 16;
  textInput.cornerRadius = 12;
  textInput.resize(320, 1);
  textInput.primaryAxisSizingMode = "FIXED";
  textInput.counterAxisSizingMode = "AUTO";
  bindFill(textInput, "bg/card");
  bindStroke(textInput, "border/default");
  textInput.strokeWeight = 1;

  const inputPlaceholder = createText("Enter value...", 15, 400, "text/tertiary");
  inputPlaceholder.name = "Placeholder";
  inputPlaceholder.layoutSizingHorizontal = "FILL";
  textInput.appendChild(inputPlaceholder);

  textInput.x = 0; textInput.y = yOffset;
  compPage.appendChild(textInput);

  // ══════════════════════════════════════════════════════════
  // 6. GLOBAL HEADER (2 variants)
  // ══════════════════════════════════════════════════════════

  yOffset += 100;
  figma.notify("🔧 Creating headers...");

  const headerVariants = [];

  // Default Header
  const header1 = figma.createComponent();
  header1.name = "Style=Default";
  header1.layoutMode = "HORIZONTAL";
  header1.primaryAxisAlignItems = "SPACE_BETWEEN";
  header1.counterAxisAlignItems = "CENTER";
  header1.paddingLeft = 24; header1.paddingRight = 24;
  header1.resize(960, 48);
  header1.primaryAxisSizingMode = "FIXED";
  header1.counterAxisSizingMode = "FIXED";
  bindFill(header1, "bg/card");

  // Left side
  const headerLeft = figma.createFrame();
  headerLeft.name = "Left";
  headerLeft.layoutMode = "HORIZONTAL";
  headerLeft.counterAxisAlignItems = "CENTER";
  headerLeft.itemSpacing = 8;
  headerLeft.fills = [];
  headerLeft.primaryAxisSizingMode = "AUTO";
  headerLeft.counterAxisSizingMode = "AUTO";

  const headerLogo = createText("NEXI", 14, 700, "text/primary");
  headerLogo.name = "Logo Text";
  headerLogo.letterSpacing = { value: 0.5, unit: "PIXELS" };
  headerLeft.appendChild(headerLogo);

  const headerHotel = createText("The Grand Hotel & Spa", 13, 400, "text/secondary");
  headerHotel.name = "Hotel Name";
  headerLeft.appendChild(headerHotel);

  header1.appendChild(headerLeft);

  // Right side
  const headerRight = figma.createFrame();
  headerRight.name = "Right";
  headerRight.layoutMode = "HORIZONTAL";
  headerRight.counterAxisAlignItems = "CENTER";
  headerRight.itemSpacing = 16;
  headerRight.fills = [];
  headerRight.primaryAxisSizingMode = "AUTO";
  headerRight.counterAxisSizingMode = "AUTO";

  const headerDate = createText("Mar 16, 2026 · 4:30 PM", 12, 400, "text/secondary");
  headerDate.name = "Date Time";
  headerRight.appendChild(headerDate);

  const headerTemp = createText("24°C", 12, 500, "text/secondary");
  headerTemp.name = "Temperature";
  headerRight.appendChild(headerTemp);

  header1.appendChild(headerRight);
  header1.x = 0; header1.y = yOffset;
  compPage.appendChild(header1);
  headerVariants.push(header1);

  // Cinematic Header
  const header2 = figma.createComponent();
  header2.name = "Style=Cinematic";
  header2.layoutMode = "HORIZONTAL";
  header2.primaryAxisAlignItems = "SPACE_BETWEEN";
  header2.counterAxisAlignItems = "CENTER";
  header2.paddingLeft = 24; header2.paddingRight = 24;
  header2.resize(960, 48);
  header2.primaryAxisSizingMode = "FIXED";
  header2.counterAxisSizingMode = "FIXED";
  header2.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 0.3 }];
  header2.effects = [{
    type: "BACKGROUND_BLUR", radius: 12, visible: true
  }];

  const headerLeft2 = figma.createFrame();
  headerLeft2.name = "Left";
  headerLeft2.layoutMode = "HORIZONTAL";
  headerLeft2.counterAxisAlignItems = "CENTER";
  headerLeft2.itemSpacing = 8;
  headerLeft2.fills = [];
  headerLeft2.primaryAxisSizingMode = "AUTO";
  headerLeft2.counterAxisSizingMode = "AUTO";

  const headerLogo2 = createText("NEXI", 14, 700, "fixed/white");
  headerLogo2.name = "Logo Text";
  headerLogo2.letterSpacing = { value: 0.5, unit: "PIXELS" };
  headerLeft2.appendChild(headerLogo2);
  header2.appendChild(headerLeft2);

  const headerRight2 = figma.createFrame();
  headerRight2.name = "Right";
  headerRight2.layoutMode = "HORIZONTAL";
  headerRight2.counterAxisAlignItems = "CENTER";
  headerRight2.itemSpacing = 16;
  headerRight2.fills = [];
  headerRight2.primaryAxisSizingMode = "AUTO";
  headerRight2.counterAxisSizingMode = "AUTO";

  const headerTime2 = createText("10:45", 24, 700, "fixed/white");
  headerTime2.name = "Time";
  headerRight2.appendChild(headerTime2);
  header2.appendChild(headerRight2);

  header2.x = 0; header2.y = yOffset + 70;
  compPage.appendChild(header2);
  headerVariants.push(header2);

  const headerSet = figma.combineAsVariants(headerVariants, compPage);
  headerSet.name = "Global Header";
  headerSet.layoutMode = "VERTICAL";
  headerSet.itemSpacing = 16;
  headerSet.paddingTop = 24; headerSet.paddingBottom = 24;
  headerSet.paddingLeft = 24; headerSet.paddingRight = 24;
  headerSet.primaryAxisSizingMode = "AUTO";
  headerSet.counterAxisSizingMode = "AUTO";
  bindFill(headerSet, "bg/default");

  // ══════════════════════════════════════════════════════════
  // 7. PROGRESS BAR
  // ══════════════════════════════════════════════════════════

  yOffset += 200;

  const progressBar = figma.createComponent();
  progressBar.name = "Progress Bar";
  progressBar.layoutMode = "HORIZONTAL";
  progressBar.resize(400, 4);
  progressBar.primaryAxisSizingMode = "FIXED";
  progressBar.counterAxisSizingMode = "FIXED";
  progressBar.cornerRadius = 2;
  bindFill(progressBar, "border/default");

  const progressFill = figma.createFrame();
  progressFill.name = "Fill";
  progressFill.resize(150, 4);
  progressFill.cornerRadius = 2;
  bindFill(progressFill, "primary/default");
  progressBar.appendChild(progressFill);

  progressBar.x = 0; progressBar.y = yOffset;
  compPage.appendChild(progressBar);

  // ══════════════════════════════════════════════════════════
  // 8. BADGE / PILL
  // ══════════════════════════════════════════════════════════

  yOffset += 40;

  const badge = figma.createComponent();
  badge.name = "Badge";
  badge.layoutMode = "HORIZONTAL";
  badge.primaryAxisAlignItems = "CENTER";
  badge.counterAxisAlignItems = "CENTER";
  badge.paddingTop = 4; badge.paddingBottom = 4;
  badge.paddingLeft = 10; badge.paddingRight = 10;
  badge.cornerRadius = 9999;
  badge.primaryAxisSizingMode = "AUTO";
  badge.counterAxisSizingMode = "AUTO";
  bindFill(badge, "bg/elevated");
  bindStroke(badge, "border/default");
  badge.strokeWeight = 1;

  const badgeText = createText("King Bed", 9, 500, "text/primary");
  badgeText.name = "Label";
  badge.appendChild(badgeText);

  badge.x = 0; badge.y = yOffset;
  compPage.appendChild(badge);

  // ══════════════════════════════════════════════════════════
  // 9. TAB BAR
  // ══════════════════════════════════════════════════════════

  yOffset += 60;

  const tabBar = figma.createComponent();
  tabBar.name = "Tab Bar";
  tabBar.layoutMode = "HORIZONTAL";
  tabBar.itemSpacing = 0;
  tabBar.paddingTop = 4; tabBar.paddingBottom = 4;
  tabBar.paddingLeft = 4; tabBar.paddingRight = 4;
  tabBar.cornerRadius = 9999;
  tabBar.primaryAxisSizingMode = "AUTO";
  tabBar.counterAxisSizingMode = "AUTO";
  bindFill(tabBar, "bg/elevated");

  // Active tab
  const tabActive = figma.createFrame();
  tabActive.name = "Tab Active";
  tabActive.layoutMode = "HORIZONTAL";
  tabActive.primaryAxisAlignItems = "CENTER";
  tabActive.counterAxisAlignItems = "CENTER";
  tabActive.paddingTop = 8; tabActive.paddingBottom = 8;
  tabActive.paddingLeft = 20; tabActive.paddingRight = 20;
  tabActive.cornerRadius = 9999;
  tabActive.primaryAxisSizingMode = "AUTO";
  tabActive.counterAxisSizingMode = "AUTO";
  bindFill(tabActive, "primary/default");
  const tabActiveLabel = createText("Confirmation #", 13, 600, "fixed/white");
  tabActiveLabel.name = "Label";
  tabActive.appendChild(tabActiveLabel);
  tabBar.appendChild(tabActive);

  // Inactive tab 1
  const tabInactive1 = figma.createFrame();
  tabInactive1.name = "Tab Inactive";
  tabInactive1.layoutMode = "HORIZONTAL";
  tabInactive1.primaryAxisAlignItems = "CENTER";
  tabInactive1.counterAxisAlignItems = "CENTER";
  tabInactive1.paddingTop = 8; tabInactive1.paddingBottom = 8;
  tabInactive1.paddingLeft = 20; tabInactive1.paddingRight = 20;
  tabInactive1.cornerRadius = 9999;
  tabInactive1.primaryAxisSizingMode = "AUTO";
  tabInactive1.counterAxisSizingMode = "AUTO";
  tabInactive1.fills = [];
  const tabInactiveLabel1 = createText("Last Name", 13, 600, "text/secondary");
  tabInactiveLabel1.name = "Label";
  tabInactive1.appendChild(tabInactiveLabel1);
  tabBar.appendChild(tabInactive1);

  // Inactive tab 2
  const tabInactive2 = figma.createFrame();
  tabInactive2.name = "Tab Inactive";
  tabInactive2.layoutMode = "HORIZONTAL";
  tabInactive2.primaryAxisAlignItems = "CENTER";
  tabInactive2.counterAxisAlignItems = "CENTER";
  tabInactive2.paddingTop = 8; tabInactive2.paddingBottom = 8;
  tabInactive2.paddingLeft = 20; tabInactive2.paddingRight = 20;
  tabInactive2.cornerRadius = 9999;
  tabInactive2.primaryAxisSizingMode = "AUTO";
  tabInactive2.counterAxisSizingMode = "AUTO";
  tabInactive2.fills = [];
  const tabInactiveLabel2 = createText("QR Code", 13, 600, "text/secondary");
  tabInactiveLabel2.name = "Label";
  tabInactive2.appendChild(tabInactiveLabel2);
  tabBar.appendChild(tabInactive2);

  tabBar.x = 0; tabBar.y = yOffset;
  compPage.appendChild(tabBar);

  // ══════════════════════════════════════════════════════════
  // 10. QUANTITY COUNTER
  // ══════════════════════════════════════════════════════════

  yOffset += 80;

  const counter = figma.createComponent();
  counter.name = "Quantity Counter";
  counter.layoutMode = "HORIZONTAL";
  counter.counterAxisAlignItems = "CENTER";
  counter.itemSpacing = 8;
  counter.primaryAxisSizingMode = "AUTO";
  counter.counterAxisSizingMode = "AUTO";
  counter.fills = [];

  // Minus button
  const minusBtn = figma.createFrame();
  minusBtn.name = "Minus";
  minusBtn.resize(36, 36);
  minusBtn.cornerRadius = 18;
  minusBtn.fills = [];
  bindStroke(minusBtn, "border/default");
  minusBtn.strokeWeight = 1;
  minusBtn.layoutMode = "HORIZONTAL";
  minusBtn.primaryAxisAlignItems = "CENTER";
  minusBtn.counterAxisAlignItems = "CENTER";
  const minusText = createText("−", 16, 400, "text/secondary");
  minusBtn.appendChild(minusText);
  counter.appendChild(minusBtn);

  // Value
  const counterValue = createText("2", 16, 700, "text/primary");
  counterValue.name = "Value";
  counterValue.textAlignHorizontal = "CENTER";
  counterValue.resize(24, counterValue.height);
  counter.appendChild(counterValue);

  // Plus button
  const plusBtn = figma.createFrame();
  plusBtn.name = "Plus";
  plusBtn.resize(36, 36);
  plusBtn.cornerRadius = 18;
  plusBtn.fills = [];
  bindStroke(plusBtn, "border/default");
  plusBtn.strokeWeight = 1;
  plusBtn.layoutMode = "HORIZONTAL";
  plusBtn.primaryAxisAlignItems = "CENTER";
  plusBtn.counterAxisAlignItems = "CENTER";
  const plusText = createText("+", 16, 400, "text/secondary");
  plusBtn.appendChild(plusText);
  counter.appendChild(plusBtn);

  counter.x = 0; counter.y = yOffset;
  compPage.appendChild(counter);

  // ══════════════════════════════════════════════════════════
  // DONE
  // ══════════════════════════════════════════════════════════

  figma.notify("✅ Components created! Button (4×3), Card (3), Header (2), Input, Badge, Tab Bar, Progress, Pill, Counter, Module Tile");
  console.log("=== SCRIPT 2 COMPLETE ===");
  console.log("Component sets: Button (12 variants), Card (3 variants), Global Header (2 variants)");
  console.log("Single components: Pill Button, Module Tile, Text Input, Progress Bar, Badge, Tab Bar, Quantity Counter");
  console.log("All components use auto-layout and bound variables.");
  console.log("");
  console.log("Next: Run Script 3 to create the documentation page.");
})();
