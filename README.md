# After Effects — Import folder structure

**Release 1.0**

A small Adobe After Effects script that imports a folder from your disk into the **Project** panel **keeping the same folder layout**. Pick one folder; the script recreates subfolders inside the project and places imported footage in the matching folders.

## Who this is for

Editors and motion designers who want to mirror a client’s asset folders in the Project panel without dragging files one by one.

## Requirements

- **Adobe After Effects** (script tested with **After Effects 2026**)
- **macOS** — this script has **only been tested on macOS**. Windows behavior is not verified.

Also enable scripting in After Effects:

**Preferences → Scripting & Expressions → Allow Scripts to Write Files and Access Network**

## Installation

1. Copy `marie-import-folder-structure.jsx` into the After Effects scripts folder, for example:

   `/Applications/Adobe After Effects 2026/Scripts/`

2. Restart After Effects if it was already open (optional but recommended).

## How to run

1. Open your project in After Effects.
2. Choose **File → Scripts → marie-import-folder-structure**  
   (or **File → Scripts → Run Script File…** and select the `.jsx` file.)
3. Choose the folder on disk you want to import.
4. The script creates a **top-level folder** in the Project panel named like your chosen folder, then fills it using the same nested structure.

You’ll see a short summary when the import finishes.

## What gets skipped

- Hidden items whose names start with `.` (for example `.DS_Store`)
- `Thumbs.db`
- Files After Effects cannot import (they are counted as skipped in the summary)

## Unicode folder names (Korean, emoji, etc.)

On macOS, ExtendScript sometimes reports folder names in an encoded form. This script tries to **restore proper display names** using the file path and decoding when needed, so names like Korean titles should show correctly in the Project panel.

## Limitations

- **Image sequences** are not merged the same way as using After Effects’ own “Import” UI on a folder. If frames come in as separate clips, import the sequence manually using the first frame file.

## Files in this repo

| File | Purpose |
|------|---------|
| `marie-import-folder-structure.jsx` | The script — copy this into After Effects’ `Scripts` folder |

## Version

**1.0** — initial public release.

## License

MIT — see the [`LICENSE`](LICENSE) file.
