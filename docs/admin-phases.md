# CMS Admin — Plan de Fases

Plan de mejoras para el CMS single-page en `src/app/admin/page.tsx`. Guardado aquí para que no se pierda entre sesiones.

---

## Phase 1 — Safety Nets ✅ (2026-04-13)

Commit: `4416cb2` + follow-ups (`e8f4810`, `18c1b51`, `a54ce94`, `8f7a0ad`)

- Dirty state tracking con snapshot diff
- Indicadores visuales de "unsaved changes" (topbar dot, pulsing save button, tab dot)
- `beforeunload` guard
- Confirm al cambiar de cliente con cambios pendientes
- Cmd+S / Ctrl+S shortcut
- KV size counter con umbrales verde/amber/rojo (1 MB limit)
- Validación inline de slug (formato + colisión)
- Save button clickeable con toast (ya no silencioso)
- Auto-compresión de imágenes al guardar (en vez de hard-block a 950 KB)
- `normalizeConfig` hace merge de módulos por id

---

## Phase 2 — Productivity ✅ (2026-04-14)

1. **Search en clients dropdown** — `6021ba3` — filtro case-insensitive por slug/brand/templates con autofocus, Esc limpia query, no-results state
2. **Preview fullscreen toggle** — `80ceb8f` — botón expand en top-right del preview, position fixed inset 0 z-index 200, Esc para salir
3. **Duplicate client** — `eadf605` — clona current in-memory con slug `-copy`/`-copy-2` y nombre `(Copy)`, dirty until Save
4. **Export / Import JSON** — `81b3fb3` — download como `nexi-config-{slug}-{date}.json`; import valida shape, corre normalizeConfig, maneja colisiones de slug, Import disponible desde empty state también
5. **Undo / Redo** — `9426b27` — 2 stacks de 50 snapshots, debounced 500ms, skipSnapshotRef para evitar loops, Cmd+Z / Cmd+Shift+Z, botones visuales con estado disabled, resetHistory en todos los puntos de carga

---

## Phase 3 — Close the Loop ✅ (2026-04-14)

1. **Policies PDF viewer en CKI-08** — `373211f` — renderiza `policies.dataUrl` en un iframe nativo dentro del glass card cuando mimeType/filename es PDF, fallback a `policies.text` y luego al hardcoded
2. **Survey renderer en CKO-04** — `92ec1fc` — modal dinámico con 4 tipos de pregunta (rating/text/choice/yesno), validación de required, usa `survey.title/subtitle/thankYouMessage`, fallback al modal hardcoded cuando no hay preguntas

---

## Phase 4 — Refactor ✅ (2026-04-14)

`src/app/admin/page.tsx` pasó de **3788 → 1348 LOC** (-2440, -64%) en 5 tiers + 4 sub-batches.

- **Tier 1** `14bda03` — `_lib/` helpers (tokens, icons, sections, specs, validators, presets, normalize, compress)
- **Tier 2** `38672ec` — primitives (Field, ColorField, GradientField, ColorGroup, Toggle, SecretField, SaveStatus, ToastBar, ModuleGlyph)
- **Tier 3** `feeca00` — cards (SectionHeader, ModuleCard, DroppableImage, GalleryStrip, RoomCard, UpgradeCard)
- **Tier 4a** `675a78b` — Survey + FAQ tabs + `_lib/styles.ts`
- **Tier 4b** `afea1ca` — ImageZoomModal, ImageField, HeroExteriorEditor
- **Tier 4c** `177bd28` — PoliciesTab, FontsTab
- **Tier 4d** `221e460` — AdsTab + AdCard + ScreenPicker + pattern helpers (la más grande, -508 LOC)
- **Tier 5** `06dd589` — TopBar, ClientsDropdown, ModuleNav

Resultado: 8 archivos en `src/app/admin/_lib/` + 17 en `src/app/admin/_components/`. AdminCMS en page.tsx ahora es solo state, callbacks y los gates `{activeTab === "X" && <XTab .../>}`.

**Nota:** El item original "Extract ListManager" no se hizo — los patrones repetidos (Reorder.Group + add-card-btn) son cortos. Las cards (RoomCard, UpgradeCard, AdCard) ya están en sus propios archivos, lo cual cubre el 80% de la motivación.

---

## Candidatos adicionales (speculative — no asignados a fase)

Ideas propuestas en la conversación de 2026-04-14 como especulación sobre qué podría ir en Phase 2. No entraron al plan formal pero se guardan aquí como pool de ideas para futuras fases:

1. **Undo / Redo** — ya está en Phase 2
2. **Autoguardado a draft local (localStorage)** cada N segundos — recuperación si crasha el browser
3. **Historial de versiones en KV** — revertir a un save anterior (server-side, distinto al undo local)
4. **Duplicar cliente + Export/Import JSON** — ya está en Phase 2
5. **Bulk actions en listas** (rooms, upgrades, ads) — seleccionar múltiples y eliminar/duplicar
6. **Validaciones cruzadas** — ej. módulo activo sin configurar, FAQ sin preguntas, etc.
7. **Preview en móvil / tablet** además del embed desktop actual — responsive preview toggle

---

## Reglas al tocar este archivo

- Cuando una fase se complete, mover sus items a una sección "✅ Done" con fecha y commit hash
- Si un candidato speculative se promueve a fase real, moverlo arriba en vez de duplicar
- Si el plan cambia (features descartadas, reordenadas), actualizar aquí antes de ejecutar
