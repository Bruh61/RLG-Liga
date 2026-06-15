# RLG Liga

> Professionelle Web-App zum Verwalten einer Rocket-League-Liga — Teams, Spieler, Saisons, Matches, Tabelle, Playoff-Bracket und Dashboard. Gebaut mit modernem Angular 22.

**Status:** 🟡 In Entwicklung · **Aktuelle Phase:** Phase 5 — Ergebnisse & Tabelle _(Phase 0–4 ✅ abgeschlossen)_
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
- [x] **Phase 2 — Teams:** CRUD-Blaupause; `mat-table` (Sort/Filter/Pagination), Signal Form im Dialog, confirm-dialog, team-badge.
- [x] **Phase 3 — Spieler:** CRUD, Team-Zuordnung, Captain-Regel, Filter nach Team/Plattform.
- [x] **Phase 4 — Saisons & Match-Planung:** Saisons-CRUD, Match-Schedule mit Signal Form.
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

### 2026-06-15 — Phase 4: Saisons & Match-Planung ✅

- **`seasons.service`** (httpResource + CRUD + `byId` + `activeSeason`-`computed`) und **`seasons-list`** (Tabelle mit Status-Chip, Format, Aktionen, Link zu Matches).
- **`season-form`** (Signal Forms, Inline-Template): Name/Daten required, Status/Format-Selects, `validate` für _Ende ≥ Beginn_.
- **`matches.service`** (httpResource + CRUD) und **`match-schedule`**: Saison-Selector (`linkedSignal`, Default = aktive Saison), nach Termin sortierte Match-Tabelle mit Team-Badges, Ergebnis-Spalte, Status.
- **`match-form`** (Signal Forms): Heim/Auswärts-Selects, Termin (`datetime-local`), Best-of & Phase; `validate` erzwingt **Heim ≠ Auswärts**; neue Matches starten als `scheduled` 0:0.
- Shared **`firstError`**-Helper (`shared/forms`) für konsistente Fehleranzeige. **15 Tests** (Seasons/Matches-Service); Build/Lint grün.

### 2026-06-15 — Phase 3: Spieler ✅

- **`players.service`** analog zur Teams-Blaupause (httpResource + CRUD + `byId`).
- **`players-list`**: `mat-table` mit Sortierung, kombinierten **Filtern** (Text + Team-Select inkl. _Free Agents_ + Plattform-Select über ein `computed`) und Paginierung; Team-Spalte via `team-badge`, Captain-Spalte mit Icon.
- **`player-form`** (Signal Forms): Gamertag/Plattform required, Team-Select mit **Free-Agent-Option** (`teamId: null`); **Captain-Regel** (max. 1 pro Team) als `validate(path.isCaptain, …)` — nutzt `valueOf(path.teamId)` + die Spielerliste, blockiert Speichern bei Verstoß.
- Selects/Checkbox aktualisieren das Modell direkt (kein `[formField]` für Nicht-Text-Controls); Validatoren greifen weiterhin reaktiv.
- **Tests (13 gesamt):** Service-Mutationen sowie Form-Validierung inkl. der Captain-Regel. Build/Lint grün.

### 2026-06-15 — Phase 2: Teams (CRUD-Blaupause) ✅

- **`teams.service`** als Domänen-Service: `httpResource` für den reaktiven Read (`teams`, `isLoading`, `error`, abgeleitete `byId`-Map), Mutationen (`create`/`update`/`remove`) via `HttpClient` + `.reload()`; Ids werden client-seitig erzeugt (`crypto.randomUUID()`), backend-unabhängig.
- **`teams-list`** (Smart-Container): `mat-table` mit `matSort`, Textfilter (eigene `filterPredicate` auf Name/Tag) und `mat-paginator`; Lade-/Leer-/Fehlerzustände; Aktionen Bearbeiten/Löschen.
- **`team-form`** Dialog mit **Signal Forms** (`@angular/forms/signals`): `form()` + Validatoren (`required`, `maxLength`), Bindung über `[formField]`, Fehler-Anzeige manuell aus dem Field-State (Material hat keine NgControl-Bridge), `submit()` ruft create/update; Create + Edit teilen den Dialog.
- **Shared**: generischer `confirm-dialog` (Löschbestätigung) und `team-badge` (Tag-Chip mit Team-Farbe + berechneter Kontrast-Textfarbe).
- **Tests (9 gesamt):** Service (id-Generierung/POST, PUT/DELETE), Signal-Form-Validierung, und ein Render-Test der Tabelle (httpResource → effect → Rows). Build/Lint grün; Initial-Budget auf 800kB/1.5MB angehoben (Material-SPA).

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
