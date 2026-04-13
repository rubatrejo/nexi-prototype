// NEXI Design System — Script 5: Logos, Missing Components & Extras

var __awaiter = function(thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch(e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch(e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : new P(function(resolve) { resolve(result.value); }).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

function main() {
  return __awaiter(this, void 0, void 0, function*() {
    try {
      figma.notify("🚀 Creating logos, fonts & missing components...");

      yield figma.loadFontAsync({ family: "Inter", style: "Regular" });
      yield figma.loadFontAsync({ family: "Inter", style: "Medium" });
      yield figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
      yield figma.loadFontAsync({ family: "Inter", style: "Bold" });
      yield figma.loadFontAsync({ family: "Inter", style: "Extra Bold" });

      var allVars = yield figma.variables.getLocalVariablesAsync("COLOR");

      function getVar(name) {
        for (var i = 0; i < allVars.length; i++) {
          if (allVars[i].name === name) return allVars[i];
        }
        return null;
      }

      function bindFill(node, varName) {
        var v = getVar(varName);
        if (!v) return;
        node.fills = [figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 1 }, "color", v)];
      }

      function bindStroke(node, varName, weight) {
        var v = getVar(varName);
        if (!v) return;
        node.strokes = [figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 1 }, "color", v)];
        node.strokeWeight = weight || 1;
      }

      function solidFill(r, g, b, a) {
        return [{ type: "SOLID", color: { r: r, g: g, b: b }, opacity: a !== undefined ? a : 1 }];
      }

      function hexFill(hex) {
        var h = hex.replace("#", "");
        return [{ type: "SOLID", color: {
          r: parseInt(h.substring(0, 2), 16) / 255,
          g: parseInt(h.substring(2, 4), 16) / 255,
          b: parseInt(h.substring(4, 6), 16) / 255
        }}];
      }

      function txt(chars, size, weight, colorVar) {
        var t = figma.createText();
        var style = weight >= 800 ? "Extra Bold" : weight >= 700 ? "Bold" : weight >= 600 ? "Semi Bold" : weight >= 500 ? "Medium" : "Regular";
        t.fontName = { family: "Inter", style: style };
        t.characters = chars;
        t.fontSize = size;
        if (colorVar) bindFill(t, colorVar);
        return t;
      }

      function sectionLabel(name, x, y) {
        var label = txt(name, 18, 700, "text/primary");
        label.x = x;
        label.y = y;
        return label;
      }

      // Find Components page
      var compPage = figma.root.findOne(function(n) { return n.type === "PAGE" && n.name === "Components"; });
      if (!compPage) { compPage = figma.createPage(); compPage.name = "Components"; }
      figma.currentPage = compPage;

      var currentY = 6000; // Start below existing components
      var leftX = 0;
      var spacing = 60;

      // ════════════════════════════════════════════════════════
      // NEXI ICON SVG — Dark variant
      // ════════════════════════════════════════════════════════
      figma.notify("1/12 NEXI Logo Icon (Dark)...");
      var logoLabel = sectionLabel("═══ LOGOS & BRANDING ═══", leftX, currentY);
      currentY += 40;

      // NEXI Icon - Dark on light
      var nexiIconDarkLabel = sectionLabel("NEXI Icon — Dark", leftX, currentY);
      currentY += 30;

      var nexiIconDark = figma.createComponent();
      nexiIconDark.name = "Logo/NEXI Icon/Dark";
      nexiIconDark.resize(140, 122);
      nexiIconDark.fills = [];

      // Create the 4 blades of the NEXI windmill using vectors
      var iconSvgData = '<svg viewBox="0 0 137.993 121.233"><g transform="translate(-6144.282 727.124)"><path d="M71.349,87.094A21.555,21.555,0,0,1,60.563,84.2L43.631,101.134a45.086,45.086,0,0,0,55.823-.289l-16.9-16.9a21.556,21.556,0,0,1-11.207,3.145" transform="translate(6141.802 -731.895)"/><path d="M71.352,16.305a45.007,45.007,0,0,0-27.674,9.5L60.614,42.742a21.555,21.555,0,0,1,21.9.255l16.9-16.9a45.032,45.032,0,0,0-28.06-9.79" transform="translate(6141.8 -728.05)"/><path d="M115.72,78.45a44.824,44.824,0,0,0-.011-35.648L143.276,0,109.944,33.015c-.024-.031-.044-.064-.068-.094L92.944,49.852a21.576,21.576,0,0,1,.03,21.524v0l-.031,0,3.584,3.55,13.381,13.381c.019-.024.035-.051.054-.075l33.313,33Z" transform="translate(6139 -727.124)"/><path d="M27.556,78.45A44.823,44.823,0,0,1,27.567,42.8L0,0,33.332,33.015c.024-.031.044-.064.068-.094L50.332,49.852a21.576,21.576,0,0,0-.03,21.524v0l.031,0-3.584,3.55L33.367,88.312c-.019-.024-.035-.051-.054-.075L0,121.233Z" transform="translate(6144.282 -727.124)"/></g></svg>';

      // Use createNodeFromSvg to create the actual SVG
      var iconDarkNode = figma.createNodeFromSvg(iconSvgData);
      iconDarkNode.name = "Icon Paths";
      iconDarkNode.resize(140, 122);

      // Color all vector children dark
      var iconVectors = iconDarkNode.findAll(function(n) { return n.type === "VECTOR"; });
      for (var iv = 0; iv < iconVectors.length; iv++) {
        iconVectors[iv].fills = hexFill("#262626");
      }

      nexiIconDark.appendChild(iconDarkNode);
      nexiIconDark.x = leftX;
      nexiIconDark.y = currentY;
      currentY += 150;

      // ════════════════════════════════════════════════════════
      // NEXI ICON — White variant
      // ════════════════════════════════════════════════════════
      figma.notify("2/12 NEXI Logo Icon (White)...");
      var nexiIconWhiteLabel = sectionLabel("NEXI Icon — White (on dark bg)", leftX, currentY);
      currentY += 30;

      var nexiIconWhite = figma.createComponent();
      nexiIconWhite.name = "Logo/NEXI Icon/White";
      nexiIconWhite.resize(180, 160);
      nexiIconWhite.fills = hexFill("#1A1A1A");
      nexiIconWhite.layoutMode = "HORIZONTAL";
      nexiIconWhite.primaryAxisAlignItems = "CENTER";
      nexiIconWhite.counterAxisAlignItems = "CENTER";
      nexiIconWhite.paddingTop = 20; nexiIconWhite.paddingBottom = 20;
      nexiIconWhite.paddingLeft = 20; nexiIconWhite.paddingRight = 20;
      nexiIconWhite.cornerRadius = 12;

      var iconWhiteNode = figma.createNodeFromSvg(iconSvgData);
      iconWhiteNode.name = "Icon Paths";
      iconWhiteNode.resize(140, 122);
      var iconVectors2 = iconWhiteNode.findAll(function(n) { return n.type === "VECTOR"; });
      for (var iv2 = 0; iv2 < iconVectors2.length; iv2++) {
        iconVectors2[iv2].fills = hexFill("#FFFFFF");
      }
      nexiIconWhite.appendChild(iconWhiteNode);

      nexiIconWhite.x = leftX;
      nexiIconWhite.y = currentY;
      currentY += 190;

      // ════════════════════════════════════════════════════════
      // NEXI ICON — Primary (for spinners)
      // ════════════════════════════════════════════════════════
      figma.notify("3/12 NEXI Logo Icon (Primary)...");
      var nexiIconPriLabel = sectionLabel("NEXI Icon — Primary (spinners)", leftX, currentY);
      currentY += 30;

      var nexiIconPrimary = figma.createComponent();
      nexiIconPrimary.name = "Logo/NEXI Icon/Primary";
      nexiIconPrimary.resize(140, 122);
      nexiIconPrimary.fills = [];

      var iconPriNode = figma.createNodeFromSvg(iconSvgData);
      iconPriNode.name = "Icon Paths";
      iconPriNode.resize(140, 122);
      var iconVectors3 = iconPriNode.findAll(function(n) { return n.type === "VECTOR"; });
      for (var iv3 = 0; iv3 < iconVectors3.length; iv3++) {
        iconVectors3[iv3].fills = hexFill("#1288FF");
      }
      nexiIconPrimary.appendChild(iconPriNode);

      nexiIconPrimary.x = leftX;
      nexiIconPrimary.y = currentY;
      currentY += 150;

      // ════════════════════════════════════════════════════════
      // NEXI FULL LOGO (Icon + Wordmark) — Dark
      // ════════════════════════════════════════════════════════
      figma.notify("4/12 NEXI Full Logo (Dark)...");
      var fullLogoDarkLabel = sectionLabel("NEXI Full Logo — Dark", leftX, currentY);
      currentY += 30;

      var fullLogoSvg = '<svg viewBox="0 0 288.935 121.75"><g transform="translate(-53.3 -26.837)"><g transform="translate(53.3 26.837)"><circle cx="5.325" cy="5.325" r="5.325" transform="translate(46.886 71.055)"/><g transform="translate(263.791 3.055)"><rect width="25.144" height="46.812" transform="translate(0 71.883)"/><rect width="25.144" height="46.738"/></g><path d="M139.455,148.588H114.311V65.575c0-2-3-7.026-4.437-8.5-9.281-9.466-29.951-4.03-29.951,9.984v81.533H53.3V71.122c.185-24.774,16.2-42.856,41.229-44.187,27.659-1.479,43.484,14.014,44.964,41.229v80.424Z" transform="translate(-53.3 -26.837)"/><path d="M369.4,34.5V60.495H337.045a10.494,10.494,0,0,0-10.5,10.5h0a10.494,10.494,0,0,0,10.5,10.5h17.527v25.181H337.489a10.9,10.9,0,0,0-10.908,10.908h0a10.9,10.9,0,0,0,10.908,10.908H369.4v24.922H334.9a33.495,33.495,0,0,1-33.5-33.5V66.928A32.422,32.422,0,0,1,333.828,34.5H369.4Z" transform="translate(-209.661 -31.667)"/><g transform="translate(165.47 3.055)"><path d="M593.279,35.1H564.991L547.021,64.053,529.087,35.1H500.8l32.1,56.389-32.1,62.232h28.287l17.934-34.795,17.971,34.795h28.287l-32.1-62.232Z" transform="translate(-500.8 -35.1)"/></g></g></g></svg>';

      var fullLogoDark = figma.createComponent();
      fullLogoDark.name = "Logo/NEXI Full/Dark";
      fullLogoDark.resize(360, 152);
      fullLogoDark.fills = [];

      var fullDarkNode = figma.createNodeFromSvg(fullLogoSvg);
      fullDarkNode.name = "Logo Paths";
      fullDarkNode.resize(360, 152);
      var fVecs = fullDarkNode.findAll(function(n) { return n.type === "VECTOR" || n.type === "ELLIPSE" || n.type === "RECTANGLE"; });
      for (var fv = 0; fv < fVecs.length; fv++) {
        fVecs[fv].fills = hexFill("#262626");
      }
      fullLogoDark.appendChild(fullDarkNode);

      fullLogoDark.x = leftX;
      fullLogoDark.y = currentY;
      currentY += 180;

      // ════════════════════════════════════════════════════════
      // NEXI FULL LOGO — White
      // ════════════════════════════════════════════════════════
      figma.notify("5/12 NEXI Full Logo (White)...");
      var fullLogoWhiteLabel = sectionLabel("NEXI Full Logo — White (on dark bg)", leftX, currentY);
      currentY += 30;

      var fullLogoWhite = figma.createComponent();
      fullLogoWhite.name = "Logo/NEXI Full/White";
      fullLogoWhite.resize(400, 192);
      fullLogoWhite.fills = hexFill("#0C0C0E");
      fullLogoWhite.layoutMode = "HORIZONTAL";
      fullLogoWhite.primaryAxisAlignItems = "CENTER";
      fullLogoWhite.counterAxisAlignItems = "CENTER";
      fullLogoWhite.paddingTop = 20; fullLogoWhite.paddingBottom = 20;
      fullLogoWhite.paddingLeft = 20; fullLogoWhite.paddingRight = 20;
      fullLogoWhite.cornerRadius = 12;

      var fullWhiteNode = figma.createNodeFromSvg(fullLogoSvg);
      fullWhiteNode.name = "Logo Paths";
      fullWhiteNode.resize(360, 152);
      var fVecs2 = fullWhiteNode.findAll(function(n) { return n.type === "VECTOR" || n.type === "ELLIPSE" || n.type === "RECTANGLE"; });
      for (var fv2 = 0; fv2 < fVecs2.length; fv2++) {
        fVecs2[fv2].fills = hexFill("#FFFFFF");
      }
      fullLogoWhite.appendChild(fullWhiteNode);

      fullLogoWhite.x = leftX;
      fullLogoWhite.y = currentY;
      currentY += 220;

      // ════════════════════════════════════════════════════════
      // POWERED BY TRUEOMNI — Dark + White
      // ════════════════════════════════════════════════════════
      figma.notify("6/12 Powered by TrueOmni...");
      var pboLabel = sectionLabel("Powered by TrueOmni — Dark", leftX, currentY);
      currentY += 30;

      var pboDark = figma.createComponent();
      pboDark.name = "Logo/Powered by TrueOmni/Dark";
      pboDark.layoutMode = "HORIZONTAL";
      pboDark.itemSpacing = 8;
      pboDark.counterAxisAlignItems = "CENTER";
      pboDark.fills = [];
      pboDark.primaryAxisSizingMode = "AUTO";
      pboDark.counterAxisSizingMode = "AUTO";

      var pboText1 = txt("Powered by", 14, 500, "text/primary");
      pboDark.appendChild(pboText1);
      var pboLogo1 = txt("TrueOmni", 14, 700, "text/primary");
      pboLogo1.letterSpacing = { value: 0.5, unit: "PIXELS" };
      pboDark.appendChild(pboLogo1);

      pboDark.x = leftX;
      pboDark.y = currentY;
      currentY += 50;

      var pboWhiteLabel = sectionLabel("Powered by TrueOmni — White (on dark bg)", leftX, currentY);
      currentY += 30;

      var pboWhite = figma.createComponent();
      pboWhite.name = "Logo/Powered by TrueOmni/White";
      pboWhite.layoutMode = "HORIZONTAL";
      pboWhite.itemSpacing = 8;
      pboWhite.counterAxisAlignItems = "CENTER";
      pboWhite.paddingTop = 16; pboWhite.paddingBottom = 16;
      pboWhite.paddingLeft = 20; pboWhite.paddingRight = 20;
      pboWhite.cornerRadius = 8;
      pboWhite.fills = hexFill("#0C0C0E");
      pboWhite.primaryAxisSizingMode = "AUTO";
      pboWhite.counterAxisSizingMode = "AUTO";

      var pboText2 = txt("Powered by", 14, 500, "fixed/white");
      pboWhite.appendChild(pboText2);
      var pboLogo2 = txt("TrueOmni", 14, 700, "fixed/white");
      pboLogo2.letterSpacing = { value: 0.5, unit: "PIXELS" };
      pboWhite.appendChild(pboLogo2);

      pboWhite.x = leftX;
      pboWhite.y = currentY;
      currentY += 80 + spacing;

      // ════════════════════════════════════════════════════════
      // TYPOGRAPHY SAMPLES (Mona Sans note + full type scale)
      // ════════════════════════════════════════════════════════
      figma.notify("7/12 Typography Reference...");
      var typoHeadLabel = sectionLabel("═══ TYPOGRAPHY REFERENCE ═══", leftX, currentY);
      currentY += 40;

      var typoNote = figma.createComponent();
      typoNote.name = "Typography Note";
      typoNote.layoutMode = "VERTICAL";
      typoNote.itemSpacing = 16;
      typoNote.paddingTop = 24; typoNote.paddingBottom = 24;
      typoNote.paddingLeft = 24; typoNote.paddingRight = 24;
      typoNote.cornerRadius = 12;
      typoNote.resize(500, 1);
      typoNote.primaryAxisSizingMode = "AUTO";
      typoNote.counterAxisSizingMode = "FIXED";
      bindFill(typoNote, "bg/card");
      bindStroke(typoNote, "border/default", 1);

      var noteTitle = txt("Font Mapping", 16, 700, "text/primary");
      typoNote.appendChild(noteTitle);

      var noteBody1 = txt("DISPLAY / HEADINGS: Mona Sans (Google Fonts)", 12, 600, "primary/default");
      typoNote.appendChild(noteBody1);
      var noteBody1b = txt("→ In this Figma file: Inter Extra Bold / Bold as proxy", 11, 400, "text/secondary");
      typoNote.appendChild(noteBody1b);
      var noteBody2 = txt("BODY / UI: Inter (Google Fonts)", 12, 600, "primary/default");
      typoNote.appendChild(noteBody2);
      var noteBody2b = txt("→ In this Figma file: Inter Regular / Medium / Semi Bold", 11, 400, "text/secondary");
      typoNote.appendChild(noteBody2b);

      var noteDivider = figma.createFrame();
      noteDivider.resize(100, 1);
      noteDivider.layoutSizingHorizontal = "FILL";
      bindFill(noteDivider, "border/default");
      typoNote.appendChild(noteDivider);

      var noteInstall = txt("To use Mona Sans: Install from fonts.google.com/specimen/Mona+Sans then swap fonts in components.", 10, 400, "text/tertiary");
      noteInstall.layoutSizingHorizontal = "FILL";
      typoNote.appendChild(noteInstall);

      typoNote.x = leftX;
      typoNote.y = currentY;
      currentY += 250 + spacing;

      // ════════════════════════════════════════════════════════
      // FILM GRAIN OVERLAY
      // ════════════════════════════════════════════════════════
      figma.notify("8/12 Film Grain Overlay...");
      var grainHeadLabel = sectionLabel("═══ EFFECTS & OVERLAYS ═══", leftX, currentY);
      currentY += 40;

      var grainLabel = sectionLabel("Film Grain Overlay", leftX, currentY);
      currentY += 30;

      var grainComp = figma.createComponent();
      grainComp.name = "Film Grain Overlay";
      grainComp.resize(400, 300);
      grainComp.fills = [];
      grainComp.opacity = 0.04;

      // Create noise pattern using small dots
      for (var gy = 0; gy < 30; gy++) {
        for (var gx = 0; gx < 40; gx++) {
          if (Math.random() > 0.6) {
            var dot = figma.createEllipse();
            dot.resize(1, 1);
            dot.x = gx * 10 + Math.random() * 8;
            dot.y = gy * 10 + Math.random() * 8;
            dot.fills = solidFill(0, 0, 0, 1);
            grainComp.appendChild(dot);
          }
        }
      }

      grainComp.x = leftX;
      grainComp.y = currentY;
      currentY += 320 + spacing;

      // ════════════════════════════════════════════════════════
      // GRADIENT OVERLAY (for hero screens)
      // ════════════════════════════════════════════════════════
      figma.notify("9/12 Gradient Overlay...");
      var gradLabel = sectionLabel("Gradient Overlay (Hero Screens)", leftX, currentY);
      currentY += 30;

      var gradComp = figma.createComponent();
      gradComp.name = "Gradient Overlay";
      gradComp.resize(400, 300);
      gradComp.fills = [{
        type: "GRADIENT_LINEAR",
        gradientTransform: [[0, 1, 0], [-1, 0, 1]],
        gradientStops: [
          { position: 0, color: { r: 0, g: 0, b: 0, a: 0.15 } },
          { position: 1, color: { r: 0, g: 0, b: 0, a: 0.55 } }
        ]
      }];

      gradComp.x = leftX;
      gradComp.y = currentY;
      currentY += 320 + spacing;

      // ════════════════════════════════════════════════════════
      // ERROR STATE
      // ════════════════════════════════════════════════════════
      figma.notify("10/12 Error State...");
      var errHeadLabel = sectionLabel("═══ MISSING COMPONENTS ═══", leftX, currentY);
      currentY += 40;

      var errLabel = sectionLabel("Error State", leftX, currentY);
      currentY += 30;

      var errorState = figma.createComponent();
      errorState.name = "Error State";
      errorState.layoutMode = "VERTICAL";
      errorState.primaryAxisAlignItems = "CENTER";
      errorState.counterAxisAlignItems = "CENTER";
      errorState.itemSpacing = 12;
      errorState.paddingTop = 32; errorState.paddingBottom = 32;
      errorState.paddingLeft = 32; errorState.paddingRight = 32;
      errorState.resize(300, 1);
      errorState.primaryAxisSizingMode = "AUTO";
      errorState.counterAxisSizingMode = "FIXED";
      errorState.cornerRadius = 16;
      bindFill(errorState, "bg/card");

      var errCircle = figma.createEllipse();
      errCircle.resize(48, 48);
      bindFill(errCircle, "semantic/error");
      errCircle.effects = [{ type: "DROP_SHADOW", color: { r: 0.86, g: 0.15, b: 0.15, a: 0.4 }, offset: { x: 0, y: 0 }, radius: 24, spread: 0, visible: true, blendMode: "NORMAL" }];
      errorState.appendChild(errCircle);

      var errTitle = txt("Something went wrong", 20, 700, "text/primary");
      errTitle.textAlignHorizontal = "CENTER";
      errorState.appendChild(errTitle);

      var errSub = txt("Please try again or contact the front desk.", 11, 400, "text/secondary");
      errSub.textAlignHorizontal = "CENTER";
      errorState.appendChild(errSub);

      var errBtn = figma.createFrame();
      errBtn.layoutMode = "HORIZONTAL";
      errBtn.primaryAxisAlignItems = "CENTER";
      errBtn.counterAxisAlignItems = "CENTER";
      errBtn.paddingTop = 12; errBtn.paddingBottom = 12;
      errBtn.paddingLeft = 24; errBtn.paddingRight = 24;
      errBtn.cornerRadius = 12;
      errBtn.primaryAxisSizingMode = "AUTO";
      errBtn.counterAxisSizingMode = "AUTO";
      bindFill(errBtn, "primary/default");
      var errBtnTxt = txt("Try Again", 14, 600, "fixed/white");
      errBtn.appendChild(errBtnTxt);
      errorState.appendChild(errBtn);

      errorState.x = leftX;
      errorState.y = currentY;
      currentY += 260 + spacing;

      // ════════════════════════════════════════════════════════
      // INACTIVITY MODAL
      // ════════════════════════════════════════════════════════
      figma.notify("11/12 Inactivity Modal...");
      var inaLabel = sectionLabel("Inactivity Modal", leftX, currentY);
      currentY += 30;

      var inactivityModal = figma.createComponent();
      inactivityModal.name = "Inactivity Modal";
      inactivityModal.resize(480, 360);
      inactivityModal.fills = solidFill(0, 0, 0, 0.5);
      inactivityModal.layoutMode = "HORIZONTAL";
      inactivityModal.primaryAxisAlignItems = "CENTER";
      inactivityModal.counterAxisAlignItems = "CENTER";

      var inaCard = figma.createFrame();
      inaCard.layoutMode = "VERTICAL";
      inaCard.primaryAxisAlignItems = "CENTER";
      inaCard.counterAxisAlignItems = "CENTER";
      inaCard.itemSpacing = 16;
      inaCard.paddingTop = 32; inaCard.paddingBottom = 32;
      inaCard.paddingLeft = 32; inaCard.paddingRight = 32;
      inaCard.cornerRadius = 16;
      inaCard.resize(340, 1);
      inaCard.primaryAxisSizingMode = "AUTO";
      inaCard.counterAxisSizingMode = "FIXED";
      bindFill(inaCard, "bg/card");
      inaCard.effects = [{ type: "DROP_SHADOW", color: { r: 0, g: 0, b: 0, a: 0.2 }, offset: { x: 0, y: 24 }, radius: 48, spread: 0, visible: true, blendMode: "NORMAL" }];

      var inaTitle = txt("Are you still there?", 24, 700, "text/primary");
      inaTitle.textAlignHorizontal = "CENTER";
      inaCard.appendChild(inaTitle);

      var inaSub = txt("Your session will reset in", 13, 400, "text/secondary");
      inaSub.textAlignHorizontal = "CENTER";
      inaCard.appendChild(inaSub);

      // Timer circle
      var timerCircle = figma.createFrame();
      timerCircle.resize(80, 80);
      timerCircle.cornerRadius = 40;
      timerCircle.layoutMode = "HORIZONTAL";
      timerCircle.primaryAxisAlignItems = "CENTER";
      timerCircle.counterAxisAlignItems = "CENTER";
      bindFill(timerCircle, "primary/light");
      bindStroke(timerCircle, "primary/default", 3);

      var timerNum = txt("30", 28, 800, "primary/default");
      timerCircle.appendChild(timerNum);
      inaCard.appendChild(timerCircle);

      var inaSec = txt("seconds", 12, 400, "text/tertiary");
      inaSec.textAlignHorizontal = "CENTER";
      inaCard.appendChild(inaSec);

      // Button row
      var inaBtnRow = figma.createFrame();
      inaBtnRow.layoutMode = "HORIZONTAL";
      inaBtnRow.itemSpacing = 12;
      inaBtnRow.fills = [];
      inaBtnRow.primaryAxisSizingMode = "AUTO";
      inaBtnRow.counterAxisSizingMode = "AUTO";

      var inaEndBtn = figma.createFrame();
      inaEndBtn.layoutMode = "HORIZONTAL";
      inaEndBtn.paddingTop = 12; inaEndBtn.paddingBottom = 12;
      inaEndBtn.paddingLeft = 24; inaEndBtn.paddingRight = 24;
      inaEndBtn.cornerRadius = 12;
      inaEndBtn.fills = [];
      bindStroke(inaEndBtn, "border/default", 1);
      inaEndBtn.primaryAxisSizingMode = "AUTO";
      inaEndBtn.counterAxisSizingMode = "AUTO";
      var inaEndTxt = txt("End Session", 14, 600, "text/secondary");
      inaEndBtn.appendChild(inaEndTxt);
      inaBtnRow.appendChild(inaEndBtn);

      var inaContBtn = figma.createFrame();
      inaContBtn.layoutMode = "HORIZONTAL";
      inaContBtn.paddingTop = 12; inaContBtn.paddingBottom = 12;
      inaContBtn.paddingLeft = 24; inaContBtn.paddingRight = 24;
      inaContBtn.cornerRadius = 12;
      bindFill(inaContBtn, "primary/default");
      inaContBtn.primaryAxisSizingMode = "AUTO";
      inaContBtn.counterAxisSizingMode = "AUTO";
      var inaContTxt = txt("I'm Still Here", 14, 600, "fixed/white");
      inaContBtn.appendChild(inaContTxt);
      inaBtnRow.appendChild(inaContBtn);

      inaCard.appendChild(inaBtnRow);
      inactivityModal.appendChild(inaCard);

      inactivityModal.x = leftX;
      inactivityModal.y = currentY;
      currentY += 380 + spacing;

      // ════════════════════════════════════════════════════════
      // LANGUAGE SELECTOR
      // ════════════════════════════════════════════════════════
      figma.notify("12/12 Language Selector...");
      var langLabel = sectionLabel("Language Selector", leftX, currentY);
      currentY += 30;

      var langSelector = figma.createComponent();
      langSelector.name = "Language Selector";
      langSelector.layoutMode = "HORIZONTAL";
      langSelector.itemSpacing = 8;
      langSelector.layoutWrap = "WRAP";
      langSelector.counterAxisSpacing = 8;
      langSelector.fills = [];
      langSelector.primaryAxisSizingMode = "AUTO";
      langSelector.counterAxisSizingMode = "AUTO";

      var languages = [
        { code: "EN", name: "English", active: true },
        { code: "ES", name: "Español", active: false },
        { code: "FR", name: "Français", active: false },
        { code: "JA", name: "日本語", active: false }
      ];

      for (var li = 0; li < languages.length; li++) {
        var langBtn = figma.createFrame();
        langBtn.layoutMode = "HORIZONTAL";
        langBtn.itemSpacing = 6;
        langBtn.counterAxisAlignItems = "CENTER";
        langBtn.paddingTop = 8; langBtn.paddingBottom = 8;
        langBtn.paddingLeft = 16; langBtn.paddingRight = 16;
        langBtn.cornerRadius = 9999;
        langBtn.primaryAxisSizingMode = "AUTO";
        langBtn.counterAxisSizingMode = "AUTO";

        if (languages[li].active) {
          bindFill(langBtn, "primary/default");
          var langCode = txt(languages[li].code, 12, 700, "fixed/white");
          langBtn.appendChild(langCode);
          var langName = txt(languages[li].name, 11, 400, "fixed/white");
          langName.opacity = 0.8;
          langBtn.appendChild(langName);
        } else {
          langBtn.fills = [];
          bindStroke(langBtn, "border/default", 1);
          var langCode2 = txt(languages[li].code, 12, 700, "text/primary");
          langBtn.appendChild(langCode2);
          var langName2 = txt(languages[li].name, 11, 400, "text/secondary");
          langBtn.appendChild(langName2);
        }

        langSelector.appendChild(langBtn);
      }

      langSelector.x = leftX;
      langSelector.y = currentY;

      // ════════════════════════════════════════════════════════
      figma.viewport.scrollAndZoomIntoView(compPage.children);
      figma.notify("✅ All done! 6 logo variants + 6 missing components added. Total: 56 components!");
      console.log("=== SCRIPT 5 COMPLETE ===");
      console.log("Added: NEXI Icon (Dark/White/Primary), Full Logo (Dark/White),");
      console.log("Powered by TrueOmni (Dark/White), Typography Note,");
      console.log("Film Grain, Gradient Overlay, Error State,");
      console.log("Inactivity Modal, Language Selector");

    } catch(e) {
      console.log("ERROR: " + e.message);
      console.log("Stack: " + e.stack);
      figma.notify("❌ " + e.message);
    }
    figma.closePlugin();
  });
}
main();
