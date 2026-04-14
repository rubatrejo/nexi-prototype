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

## Phase 5 — Ops hardening (CRÍTICO · siguiente sesión)

Auditoría completa del admin (2026-04-14) descubrió que **el API del admin está completamente abierto a internet**. Esto es el bloqueador #1 antes de cualquier cosa más.

Plan detallado completo en `~/.claude/plans/compiled-frolicking-pike.md`.

### 5.1 Auth mínima viable (S-M) 🔴 CRÍTICO

- **Problema:** `src/app/api/admin/configs/route.ts` y `[slug]/route.ts` son públicamente accesibles sin auth. Cualquiera puede POST/PUT/DELETE configs.
- **Approach:** bearer token vía env var + cookie HttpOnly firmada con HMAC. No NextAuth (overkill para 1 usuario).
- **Archivos nuevos:**
  - `src/lib/auth.ts` — `requireAdmin(request)` helper (Bearer o cookie)
  - `src/app/api/admin/login/route.ts` — POST `{password}`, `crypto.timingSafeEqual` vs `ADMIN_PASSWORD`, setea cookie HttpOnly/Secure/SameSite=Strict
  - `src/app/api/admin/logout/route.ts` — clear cookie
  - `src/app/admin/login/page.tsx` — form simple
  - `src/middleware.ts` — protege `/admin/:path*` UI, redirige a /admin/login
- **Archivos editados:**
  - `src/app/api/admin/configs/route.ts` — `requireAdmin` en GET (list) y POST
  - `src/app/api/admin/configs/[slug]/route.ts` — `requireAdmin` en PUT y DELETE **pero NO en GET** (el kiosko público necesita leer por slug)
- **Env vars nuevos:** `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` (32 bytes random), `ADMIN_API_TOKEN` (opcional para curl/CI)
- **Riesgo:** bajo — GET público del kiosko queda intacto

### 5.2 Rate limiting (S)

- Añadir `@upstash/ratelimit` (Upstash Redis ya wired en `kv-client.ts`)
- Sliding window: 30 writes/min/token, 5 login attempts/min/IP
- Wrap mutating handlers + login route

### 5.3 Soft delete + version history (M)

- Redis schema additions:
  - `config:{slug}:v:{n}` → snapshot JSON (cap últimas 20 via LTRIM)
  - `config:{slug}:versions` → LIST de version numbers
  - `config:{slug}:deleted` → tombstone con TTL 30 días
- Edits en `src/lib/kv-client.ts`:
  - `saveConfig` escribe a `:v:{next}` antes de sobrescribir
  - `deleteConfig` mueve payload a `:deleted` con TTL en vez de DEL hard
- Nuevo endpoint: `src/app/api/admin/configs/[slug]/versions/route.ts` (GET list, POST revert)
- Admin UI: drawer "History" + tab "Recently deleted"
- **Riesgo:** bajo (additive)

### 5.4 Zod schema validation (S-M)

- Añadir `zod`
- Archivo nuevo: `src/lib/hotel-config-schema.ts` — mirror de `HotelConfig` como Zod schema
- Rechaza data URLs >1MB (empuja al usuario a Phase 5.5)
- Edit ambos route handlers: reemplazar checks manuales con `HotelConfigSchema.safeParse`
- **Riesgo:** medio — configs viejas pueden fallar al siguiente save. Mitigación: dry-run endpoint `/api/admin/configs/validate-all` primero

### 5.5 Vercel Blob para imágenes grandes (M)

- Añadir `@vercel/blob`
- Archivo nuevo: `src/app/api/admin/uploads/route.ts` — POST multipart, admin-gated
- Admin UI: si file > 256KB → upload a Blob primero, guardar URL en config en vez de data URL
- Env var: `BLOB_READ_WRITE_TOKEN` (Vercel auto-provide)
- **Riesgo:** bajo — configs viejas con data URLs siguen funcionando

---

## Phase 6 — Close the Loop v2

Auditoría descubrió que varios campos configurables en admin NO se consumen en el kiosko (el admin "miente al SE"), y varios screens tienen contenido hardcoded que debería ser configurable.

### 6.1 Wire orphan fields existentes (S cada uno) 🟡 ALTA PRIORIDAD

- **`info.wifi` → WIF-01** (`src/components/screens/WIF01.tsx:30,35`) — reemplazar `"NEXI-Guest-Premium"` / `"WELCOME2026"` con `useHotel().info.wifi.networkName/password`
- **`inactivity.warningAfterMs/resetAfterMs` → InactivityModal** (`src/components/ui/InactivityModal.tsx:6`) — reemplazar `TIMEOUT_MS = 60000` hardcoded con `useHotel().inactivity.*`
- **Weather toggle:** nuevo `brand.showWeather?: boolean` + `info.weatherPlaceholder?: string`, consumido en `src/components/layout/GlobalHeader.tsx:66` e `src/components/screens/IDL01.tsx:88`. (Weather real → Phase 8 integraciones)
- **`brand.website`:** decidir — eliminar del admin (marcado "internal") O wire-ar a un QR "Visit our website" en WIF-01/IDL-01. Recomiendo eliminar.
- **`info.phone / email / address`** — añadir un footer "Contact" opcional en FAQ-01 y/o un Contact screen nuevo (media prioridad)

### 6.2 Nuevo contenido configurable (M cada uno)

Contenido hardcoded en screens que debería vivir en `HotelConfig`:

- **Room service menu** — nuevo `config.roomService: { categories, items }`, nuevo tab "Menu" en admin, wire `src/components/screens/{RSV01,RSV02}.tsx`
- **Events** — nuevo `config.events: EventItem[]`, nuevo tab "Events", wire `src/components/screens/{EVT01,EVT02}.tsx`
- **Local listings** — nuevo `config.localListings: { categories, items }`, nuevo tab "Explore", wire `src/components/screens/{LST01,LST02,LST03}.tsx`

Patrón: copiar estructura de `AdsTab.tsx` / `SurveyTab.tsx`. Reusar `DroppableImage`, `GalleryStrip`, `Field`, `Toggle`. Añadir normalizadores en `src/app/admin/_lib/normalize.ts`.

### 6.3 Fuera de scope (documentar como blockers)

- **CKO-03 charges / guest folio** — per-reservation data, requiere integración PMS real (Cloudbeds/Mews/Oracle). Los API key fields ya existen en `integrations`. Dependencia de Phase 8.
- **Weather real** — requiere `integrations.weatherApiKey` + OpenWeather/Tomorrow.io. Phase 8.

---

## Phase 7 — UX quality of life

### 7.1 Quick wins (S cada uno)

- **Save-gate reasons inline popover** — hover del amber "⚠ Save" muestra razones ("Slug: ...", "3 invalid colors", "Config too large"). Click salta al tab afectado. Tocar `TopBar.tsx` y `page.tsx`.
- **Live preview pulse indicator** — dot que se prende durante el debounce de 120ms del postMessage
- **ModuleNav auto-sync con activeTab** — `useEffect([activeTab])` en `page.tsx` que postMessage al iframe con el screen apropiado. Añadir `previewScreen?` en `_lib/sections.ts`
- **Onboarding hint** en empty state — badge "Quick start" sobre el primer template card, dismissible con localStorage

### 7.2 Medium lifts (M cada uno)

- **Inline validation global** — nuevo `src/app/admin/_lib/validateConfig.ts` que retorna `{tab, field, message}[]`, chip "Issues (N)" en TopBar con lista clickable
- **Batch image upload** — extender `ImageField.tsx` y `GalleryStrip.tsx` para aceptar `FileList` completo
- **Bulk edit en rooms/upgrades** — checkbox column en `RoomCard.tsx`/`UpgradeCard.tsx`, sticky bar "Bulk: set tag / adjust rate / duplicate / delete"
- **"Copy from..." entre clientes** — botón en SectionHeader que abre modal reusando `ClientsDropdown`; merge solo esa sección
- **Drop-zone indicator** durante drag reorder — línea accent 3px en el insert index

### 7.3 Big swings (L cada uno)

- **Image crop tool** — nuevo `ImageCropModal.tsx` con `react-easy-crop`, respetando `spec.ratio`
- **Command palette Cmd+K** — search de acciones: jump to tab, switch client, apply preset, save, copy link, test keys
- **Admin UI i18n** (EN/ES) para SEs de LATAM — extract strings a `_lib/i18n/{en,es}.ts`

---

## Orden recomendado (leer antes de arrancar siguiente sesión)

1. **Phase 5.1 + 5.2** (auth + rate limit) — **crítico**, una sesión. Arrancar aquí.
2. **Phase 6.1** (wire orphans: WiFi + inactivity + weather toggle) — rápido, alto impacto, una sesión. El admin deja de mentir.
3. **Phase 5.3 + 5.4** (soft delete + version history + Zod) — safety net contra misclicks y configs corruptas.
4. **Phase 7.1** (UX quick wins batch) — una sesión.
5. **Phase 6.2** (room service menu, events, local listings) — 2-3 sesiones.
6. **Phase 5.5** (Blob storage) cuando alguien se queje del límite de 1MB.
7. **Phase 7.2/7.3** cuando haya feedback real de SEs usando el admin en prod.

**Nota:** este orden prioriza cerrar **riesgos** (auth, data loss) antes que agregar **features** (content types, crop tool, i18n). Si la prioridad es demos > producción real, invertir y empezar con Phase 6.

### Hallazgos verificados en código (no rumor)

- `src/components/screens/WIF01.tsx:30,35` — hardcodea credenciales Wi-Fi ignorando `info.wifi`
- `src/components/ui/InactivityModal.tsx:6` — hardcodea `TIMEOUT_MS = 60000`
- `src/app/api/admin/configs/route.ts` — zero auth, sin rate limit, validation mínima (solo slug regex + brand.name)
- ColorField tiene color picker visual ✓ (NO es un problema)
- GradientField tiene live swatch ✓ (NO es un problema)
- Empty state muestra grid de templates + saved clients ✓ (NO es un problema)

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
