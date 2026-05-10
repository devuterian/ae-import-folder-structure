# AE — import folder → Project panel (same structure)

**v1.0** · [한국어](README.ko.md) · [日本語](README.ja.md)

Pick one folder on disk → After Effects rebuilds that folder tree in the **Project** panel and imports files into it.

**Only tested on macOS** (AE 2026). Not verified on Windows.

**Install:** drop `marie-import-folder-structure.jsx` into e.g.  
`/Applications/Adobe After Effects 2026/Scripts/`  
Turn on **Preferences → Scripting & Expressions → Allow Scripts to Write Files and Access Network**.

**Run:** **File → Scripts → marie-import-folder-structure**

Image sequences may not behave like AE’s built-in folder import; use the first frame if needed. Unicode folder names on macOS are handled when `.name` breaks.

MIT — see [`LICENSE`](LICENSE).
