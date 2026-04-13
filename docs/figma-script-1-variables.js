// ============================================================
// NEXI Design System — Script 1/4: Color Variables & Tokens
// Creates color variable collection with Light + Dark modes
// Figma: Plugins > Development > Open Console > Paste & Enter
// ============================================================

(async () => {
  figma.notify("🎨 Creating NEXI color variables...");

  // ── CREATE COLLECTION ─────────────────────────────────────
  const collection = figma.variables.createVariableCollection("NEXI Design Tokens");

  // Rename the default mode to "Light"
  const lightModeId = collection.modes[0].modeId;
  collection.renameMode(lightModeId, "Light");

  // Add Dark mode
  const darkModeId = collection.addMode("Dark");

  // ── HELPER ────────────────────────────────────────────────
  function hex(hexStr) {
    const h = hexStr.replace("#", "");
    return {
      r: parseInt(h.substring(0, 2), 16) / 255,
      g: parseInt(h.substring(2, 4), 16) / 255,
      b: parseInt(h.substring(4, 6), 16) / 255
    };
  }

  function rgba(r, g, b, a) {
    return { r: r / 255, g: g / 255, b: b / 255, a };
  }

  function createColor(name, lightHex, darkHex) {
    const variable = figma.variables.createVariable(name, collection, "COLOR");
    variable.setValueForMode(lightModeId, { ...hex(lightHex), a: 1 });
    variable.setValueForMode(darkModeId, { ...hex(darkHex), a: 1 });
    return variable;
  }

  function createColorRGBA(name, lightVal, darkVal) {
    const variable = figma.variables.createVariable(name, collection, "COLOR");
    variable.setValueForMode(lightModeId, lightVal);
    variable.setValueForMode(darkModeId, darkVal);
    return variable;
  }

  // ── BACKGROUND COLORS ────────────────────────────────────
  createColor("bg/default", "#F5F5F0", "#0C0C0E");
  createColor("bg/card", "#FFFFFF", "#1A1A1F");
  createColor("bg/elevated", "#FFFFFF", "#222228");

  // ── PRIMARY COLORS ───────────────────────────────────────
  createColor("primary/default", "#1288FF", "#1288FF");
  createColor("primary/hover", "#0B6FD4", "#3DA0FF");
  createColorRGBA("primary/light",
    rgba(18, 136, 255, 0.08),
    rgba(18, 136, 255, 0.12)
  );
  createColorRGBA("primary/glow",
    rgba(18, 136, 255, 0.25),
    rgba(18, 136, 255, 0.35)
  );

  // ── SEMANTIC COLORS ──────────────────────────────────────
  createColor("semantic/success", "#16A34A", "#22C55E");
  createColor("semantic/error", "#DC2626", "#EF4444");
  createColor("semantic/amber", "#D4960A", "#E5A91B");
  createColorRGBA("semantic/amber-light",
    rgba(212, 150, 10, 0.08),
    rgba(229, 169, 27, 0.12)
  );
  createColor("semantic/purple", "#8B5CF6", "#A78BFA");
  createColor("semantic/yellow", "#FBBF24", "#FCD34D");
  createColor("semantic/orange", "#F97316", "#FB923C");

  // ── TEXT COLORS ──────────────────────────────────────────
  createColor("text/primary", "#1A1A1A", "#F0F0F0");
  createColor("text/secondary", "#6B7280", "#8E93A4");
  createColor("text/tertiary", "#9CA3AF", "#5A5E6E");

  // ── BORDER COLORS ────────────────────────────────────────
  createColor("border/default", "#E8E8E3", "#2A2A30");
  createColor("border/hover", "#D1D1CC", "#3A3A42");

  // ── FIXED COLORS (same in both modes) ────────────────────
  createColor("fixed/white", "#FFFFFF", "#FFFFFF");
  createColor("fixed/black", "#000000", "#000000");

  // ══════════════════════════════════════════════════════════
  // NUMBER VARIABLES — Spacing & Radius
  // ══════════════════════════════════════════════════════════

  const numCollection = figma.variables.createVariableCollection("NEXI Spacing & Radius");
  const numLightMode = numCollection.modes[0].modeId;

  function createNumber(name, value) {
    const variable = figma.variables.createVariable(name, numCollection, "FLOAT");
    variable.setValueForMode(numLightMode, value);
    return variable;
  }

  // Spacing
  createNumber("spacing/2", 2);
  createNumber("spacing/4", 4);
  createNumber("spacing/8", 8);
  createNumber("spacing/12", 12);
  createNumber("spacing/16", 16);
  createNumber("spacing/20", 20);
  createNumber("spacing/24", 24);
  createNumber("spacing/32", 32);
  createNumber("spacing/40", 40);
  createNumber("spacing/48", 48);
  createNumber("spacing/64", 64);

  // Radius
  createNumber("radius/sm", 8);
  createNumber("radius/md", 12);
  createNumber("radius/lg", 16);
  createNumber("radius/xl", 20);
  createNumber("radius/full", 9999);

  // ══════════════════════════════════════════════════════════
  // DONE
  // ══════════════════════════════════════════════════════════

  figma.notify("✅ Variables created! 22 colors (Light+Dark) + 16 spacing/radius tokens");
  console.log("=== SCRIPT 1 COMPLETE ===");
  console.log("Color variables: 22 (with Light + Dark modes)");
  console.log("Number variables: 16 (spacing + radius)");
  console.log("Collections: 'NEXI Design Tokens' + 'NEXI Spacing & Radius'");
  console.log("");
  console.log("Next: Run Script 2 to create components.");
})();
