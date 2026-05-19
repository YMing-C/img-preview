# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install              # Install dependencies
npm run dev              # Start both Vite dev server + Electron (watches for changes)
npm run build            # Compile main/preload (tsc) + bundle renderer (vite)
npm run typecheck        # Type-check all TypeScript
npm run preview          # Serve built renderer locally
```

`npm run dev` starts two processes concurrently:
- `vite --host 127.0.0.1` — hot-reloading dev server on port 5173
- Electron loads from the Vite dev server in dev; loads `dist/renderer/index.html` in production

There are no tests yet.

## Architecture

```
src/
├── main/          # Electron main process (Node.js)
│   ├── main.ts        # Entry: window creation, IPC handlers, app lifecycle
│   ├── database.ts    # JSON file read/write (not SQLite despite PRD)
│   ├── library.ts     # Business logic: import, scan, CRUD operations
│   └── types.ts       # Shared types: Comic, ComicPage, ReaderSettings, etc.
├── preload/
│   └── index.ts       # contextBridge exposing comicApi to renderer (contextIsolation: true)
└── renderer/       # React UI (single-page, no router)
    ├── main.tsx       # React entry point
    ├── App.tsx        # All UI: library view + reader view (switched via state)
    ├── types/comic.ts # Mirror of main types.ts (duplicated for renderer build)
    └── styles.css     # All styles (library + reader)
```

## Key architecture decisions

- **Two tsconfigs**: `tsconfig.json` handles `src/renderer` + `src/preload` (ESNext/Bundler), `tsconfig.node.json` handles `src/main` + `src/preload` (NodeNext/Node16). The preload is compiled by both — `tsconfig.node.json` produces the `dist/preload/` output that Electron loads.
- **Data storage**: Despite the PRD referencing SQLite, the current implementation uses a single JSON file (`library.json`) in `app.getPath('userData')`. This is the layer to expand when moving to SQLite.
- **Local images via custom protocol**: The `koma-file://` protocol registered in `main.ts` serves local image files to the renderer. File paths are URL-encoded and backslashes converted to forward slashes in the `fileUrl()` helper.
- **IPC channels**: All main-to-renderer communication goes through `ipcMain.handle` / `ipcRenderer.invoke` — no `send`/`on` message pattern.
- **Reader settings**: Persisted via `electron-store` (separate from the library JSON), with defaults: dark background, fit-width zoom.
- **Temp comics**: IDs prefixed `temp-` bypass progress persistence (see `saveProgress` in `library.ts`).
- **Reading progress**: Debounced with a 500ms `setTimeout` after `IntersectionObserver` detects the most visible page. The observer uses thresholds `[0.35, 0.6, 0.85]`.
- **Page preloading**: Images within ±2 pages before / ±3 pages after the current page use `loading="eager"`, others use `loading="lazy"`.

## Type sharing caveat

Types are duplicated between `src/main/types.ts` and `src/renderer/types/comic.ts`. When modifying types, update both files. The preload also mirrors the API shape in `src/renderer/types/electron.d.ts` (the `ComicApi` interface + `Window` augmentation).
