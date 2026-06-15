# RLG Liga

> Professionelle Web-App zum Verwalten einer Rocket-League-Liga — Teams, Spieler, Saisons, Matches, Tabelle, Playoff-Bracket und Dashboard. Gebaut mit modernem Angular 22.

**Status:** 🟡 In Entwicklung · **Aktuelle Phase:** Phase 2 — Teams _(Phase 0–1 ✅ abgeschlossen)_
**Letztes Update:** 2026-06-15

> 📌 **Diese Datei ist die lebende Doku des Projekts.** Sie wird nach jeder Build-Phase aktualisiert (Status, Roadmap-Checkboxen, Changelog). Wenn Code und Doku auseinanderlaufen, ist das ein Bug — beides synchron halten.

---

## 1. Worum geht's

RLG Liga verwaltet eine komplette Rocket-League-Liga end-to-end. Die App entstand als **Portfolio- und Lernprojekt**, um moderne, signal-basierte Angular-Architektur (Stand 2026) praktisch zu demonstrieren — die Art von Patterns, die in Angular-Jobs und Bewerbungsgesprächen erwartet werden.

**Was die App kann (Zielbild):**

- Teams und Spieler verwalten (CRUD, Zuordnung, Captain-Logik)
- Saisons anlegen und Matches planen
- Serien-Ergebnisse erfassen; Tabelle berechnet sich daraus reaktiv
- Playoff-Bracket per Drag & Drop seeden
- Dashboard mit Kennzahlen und Charts

**Warum dieser Stack:** Jede Feature-Entscheidung ist so gewählt, dass sie eine zentrale Angular-Stärke zeigt — Signals für State, Signal Forms für Formulare, `computed` für die abgeleitete Tabelle, CDK Drag & Drop fürs Bracket, Material 3 für ein gebrandetes, barrierearmes UI.

---

## 2. Tech-Stack

| Bereich       | Wahl                                                     |
| ------------- | -------------------------------------------------------- |
| Framework     | Angular 22 (standalone, zoneless)                        |
| UI            | Angular Material 3 + Angular CDK                         |
| State         | Signals (`signal`, `computed`, `effect`, `linkedSignal`) |
| Forms         | Signal Forms                                             |
| Data Fetching | `httpResource` / `rxResource`                            |
| Routing       | `provideRouter`, lazy `loadComponent`, Guards            |
| Sprache       | TypeScript (strict)                                      |
| Tests         | Vitest                                                   |
| Lint/Format   | ESLint + Prettier                                        |
| Mock-Backend  | json-server (`db.json`)                                  |

---

## 3. Architektur

Feature-basierte Struktur mit klarer Trennung von App-Kern (`core`), wiederverwendbarer UI (`shared`), Features und Layout.

```
src/app/
  core/        interceptors, guards, services, models
  shared/      wiederverwendbare components, pipes, directives
  features/    dashboard, teams, players, seasons, matches, standings, bracket
  layout/      shell (sidenav + toolbar), nav
  app.routes.ts
  app.config.ts
src/styles/    _theme.scss (RLG rot/schwarz M3-Theme)
db.json        json-server Seed
```

**Prinzipien**

- Standalone Components, kein `NgModule`.
- Smart-Container holen Daten (`httpResource`), präsentierende Components erhalten `input()`s.
- Neues Control-Flow: `@if` / `@for` (mit `track`) / `@switch` / `@defer`.
- Daten-Fetching pro Domäne in einem Service; abgeleitete Werte via `computed()`.
- Lade-, Leer- und Fehlerzustände sind überall Pflicht.

---

## 4. Datenmodell

| Entity                         | Felder (Kurz)                                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------------------------ |
| **Team**                       | id, name, tag, logoUrl?, colorPrimary, foundedAt                                                       |
| **Player**                     | id, gamertag, realName?, platform, teamId\|null, isCaptain, joinedAt                                   |
| **Season**                     | id, name, startDate, endDate, status, format                                                           |
| **Match**                      | id, seasonId, homeTeamId, awayTeamId, scheduledAt, status, stage, bestOf, homeScore, awayScore, round? |
| **StandingRow** _(abgeleitet)_ | teamId, played, wins, losses, gamesWon, gamesLost, gameDiff, points                                    |

`platform`: `epic` \| `steam` \| `psn` \| `xbox` · `Season.status`: `upcoming` \| `active` \| `finished` · `Match.status`: `scheduled` \| `live` \| `finished`.

`StandingRow` wird nicht gespeichert, sondern als `computed()` aus den `finished`-Matches einer Saison berechnet (3 Punkte pro Sieg, Sortierung nach Punkten → Game-Differenz).

---

## 5. Roadmap

- [x] **Phase 0 — Setup & Fundament:** Projekt, Material/CDK, ESLint/Prettier/Vitest, json-server + Seed, `app.config`.
- [x] **Phase 1 — Layout & M3-Theme:** Shell (sidenav + toolbar), Lazy-Routen, Custom RLG-Theme (rot/schwarz, Dark Default).
- [ ] **Phase 2 — Teams:** CRUD-Blaupause; `mat-table` (Sort/Filter/Pagination), Signal Form im Dialog, confirm-dialog, team-badge.
- [ ] **Phase 3 — Spieler:** CRUD, Team-Zuordnung, Captain-Regel, Filter nach Team/Plattform.
- [ ] **Phase 4 — Saisons & Match-Planung:** Saisons-CRUD, Match-Schedule mit Signal Form.
- [ ] **Phase 5 — Ergebnisse & Tabelle:** Ergebnis-Dialog, `computed`-Standings, hervorgehobene Playoff-Plätze.
- [ ] **Phase 6 — Playoff-Bracket:** CDK Drag & Drop Seeding, Vorrücken der Gewinner.
- [ ] **Phase 7 — Dashboard, Auth & Politur:** Kennzahlen + Charts (`@defer`), Auth-Flow (Guard/Interceptor), a11y, Empty-/Error-States.

---

## 6. Setup & Start

**Voraussetzungen:** Node.js `^22.22.3 || ^24.15.0 || ^26.0.0` (Angular 22 unterstützt **kein** Node 20 mehr — entwickelt mit Node 24.16.0), npm. Angular CLI 22.

```bash
# Abhängigkeiten
npm install

# App + Mock-API parallel starten
npm run dev
#   → App:  http://localhost:4200
#   → API:  http://localhost:3000

# nur API
npm run api

# Tests
npm run test
```

Die API-Basis-URL liegt in `src/environments` (`http://localhost:3000`).

---

## 7. Konventionen

- TypeScript strict, kein `any`.
- Conventional Commits (`feat(...)`, `fix(...)`, `docs(...)`), kleine thematische Commits.
- Pro Phase: lauffähig → Tests grün → diese Doku aktualisieren → committen.
- Material-Komponenten nutzen statt Eigenbauten; konsistentes Theming über `_theme.scss`.
- Brandneue APIs (Signal Forms, M3-Theming) vor Implementierung auf angular.dev verifizieren.

---

## 8. Changelog

> Neueste Einträge oben. Pro abgeschlossener Phase ein datierter Eintrag.

### 2026-06-15 — Phase 1: Layout & M3-Theme ✅

- **Custom RLG-Theme** (rot/schwarz): Palette via `ng generate @angular/material:theme-color` (primary `#D32F2F`, tertiary `#FFA000`) → `src/styles/_theme-colors.scss`; `src/styles/_theme.scss` mit `mat.theme()`, **Dark Mode als Default** + `.light-mode`-Override.
- **App-Shell** (`layout/shell`): responsiver `mat-sidenav` (Overlay auf Handset via `BreakpointObserver`) + `mat-toolbar`, sticky; `layout/nav` als `mat-nav-list` mit aktivem Routen-Highlight.
- **Theme-Toggle** in der Toolbar über signal-basierten `ThemeService` (Dark/Light, persistiert in `localStorage`, `body.light-mode`).
- **Lazy-Routen** zu allen Features via `loadComponent` (eigene Chunks pro Feature) + Platzhalterseiten; Default-Redirect auf `/dashboard`, Wildcard-Fallback.
- **Shared-Komponenten**: `page-header` (Titel/Subtitle + Actions-Slot) und `empty-state` (Icon + Message), durchgängig genutzt.
- **Test-Setup**: `setupFiles` (`src/test-setup.ts`) polyfillt `matchMedia` für jsdom; Tests für `ThemeService`, `EmptyState`, App-Shell (4/4 grün).

### 2026-06-15 — Phase 0: Setup & Fundament ✅

- Angular-22-Workspace scaffolded: standalone, **zoneless** (Default in v22), SCSS, Routing, **Vitest** als Test-Runner (`@angular/build:unit-test`), 2025-Style-Guide-Dateinamen (`app.ts` / `app.html`, kein `.component.`).
- **Angular Material 3 + CDK** via `ng add` (M3-Theming-Basis in `src/styles.scss`; das Custom-RLG-Theme rot/schwarz folgt in Phase 1).
- **ESLint** (Flat Config `eslint.config.js`, ESLint 9+) + **Prettier** integriert via `eslint-config-prettier/flat`; `npm run lint`, `npm run format`.
- `app.config.ts`: `provideZonelessChangeDetection`, `provideRouter(routes, withComponentInputBinding())`, `provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor]))`.
- **Core-Modelle** (`core/models`: Team, Player, Season, Match, StandingRow) und funktionale **Interceptor-Skelette** (`auth`, `error`) angelegt.
- **json-server** Mock-API mit realistischem Seed (`db.json`: 6 Teams, 18 Spieler, 2 Saisons, 24 Matches inkl. Playoffs) + `concurrently`; `npm run dev` startet App (4200) + API (3000).
- **Umgebung:** lokales Node 20 → **24.16.0** angehoben (nvm); `src/environments` mit `apiBaseUrl`.
- **DoD ✓** — `ng build`, Tests (2/2) und Lint grün; API liefert Seed-Daten inkl. Feld-Filter.

---

## 9. Offene Punkte / Ideen (Backlog)

- Echtes Backend statt json-server (z.B. Supabase) als spätere Stufe.
- SSR/Hydration als zusätzlicher Showcase.
- Discord-Integration: Liga-Daten in die RLG-Community spiegeln.
- Spieler-Statistiken (Tore/Assists/Saves) pro Match.
