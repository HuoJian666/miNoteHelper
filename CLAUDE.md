# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

miNoteHelper (小米便签增强助手) is a Chrome/Edge browser extension (Manifest V3) that enhances the web version of Xiaomi Notes at `https://i.mi.com/note/*`.

## Key Files

| File | Purpose |
|------|---------|
| `manifest.json` | Extension configuration (Manifest V3) |
| `content.js` | Core content script injected into Xiaomi Notes pages |
| `popup.html` | Browser toolbar popup UI |
| `README.md` | Comprehensive documentation in Chinese |

## Architecture

This is a **dependency-free** pure JavaScript extension:
- Content script (`content.js`) injects UI elements and manipulates the DOM
- Uses Chrome Storage API for settings persistence
- No build tools required - load directly into Chrome/Edge in developer mode

## Default Settings Object (in content.js)

```javascript
const defaultSettings = {
  hideAllFolder: true,
  hideUnclassified: true,
  floatingToc: false,
  tocShowH1: true,
  tocShowH2: true,
  tocShowH3: true,
  collapseNoteList: false,
  defaultCollapseNoteList: false,
  defaultActiveFolder: "a-work",
  customFolderVisibility: {}
};
```

## Development

**No build step needed.** To test changes:
1. Open Chrome/Edge to `chrome://extensions/` or `edge://extensions/`
2. Enable "Developer mode"
3. Load the unpacked extension by selecting this folder
4. After making changes, click the reload button on the extension card

## Key Features

- Floating orange ⚙️ settings button in bottom-left corner
- Folder visibility toggles
- Floating table of contents (TOC) for notes
- Settings persisted via Chrome Storage API
- Auto-opens the configured folder (default `a-work`); an empty value disables switching. Stops after selection, manual folder selection, or 30 seconds.
