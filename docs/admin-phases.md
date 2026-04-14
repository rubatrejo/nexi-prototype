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

## Phase 2 — Productivity (próximo)

1. **Search en clients dropdown** — filtro por slug o brand.name en el TopBar dropdown
2. **Duplicate client** — clona config con nuevo slug
3. **Export / Import JSON** — download config, upload JSON para crear cliente
4. **Undo / Redo** — stack de history con Cmd+Z / Cmd+Shift+Z (debounced 500ms, ~50 entradas)
5. **Preview full-screen** — botón que expande iframe a 100vw/100vh, Esc para salir

---

## Phase 3 — Close the Loop

Conectar el contenido del CMS a las pantallas del kiosko donde aún no se consume.

1. **Survey renderer en CKO-04** — leer del módulo Survey y renderizar las preguntas configuradas
2. **Policies PDF viewer en CKI-08** — leer PDF/URL de policies y mostrar en un viewer

---

## Phase 4 — Refactor

`src/app/admin/page.tsx` tiene ~3500 LOC. Extraer antes de que sea inmanejable.

1. **Extract `ListManager`** — patrón repetido (rooms, upgrades, ads, languages, faqs, surveys) en un componente reutilizable
2. **Split page.tsx por tab** — un archivo por tab (ClientTab, ColorsTab, FontsTab, ImagesTab, RoomsTab, ...) en `src/app/admin/tabs/`

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
