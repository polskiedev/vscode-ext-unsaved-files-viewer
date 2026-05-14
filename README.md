# Unsaved Files Viewer

A lightweight VS Code extension that displays all currently unsaved files in the Explorer sidebar.

## Features

- Lists all dirty/unsaved files
- Supports untitled files
- Click file to open
- Right click to close/revert
- Auto refreshes on edits

---

## Development Setup

### Install dependencies

```bash
npm install
```

### Launch extension

Press:

```txt
F5
```

This launches an Extension Development Host.

---

## Package Extension

Install VSCE:

```bash
npm install -g @vscode/vsce
```

Create VSIX:

```bash
vsce package
```

---

## Install Extension

Inside VS Code:

1. Press `Ctrl + Shift + P`
2. Run:
   `Extensions: Install from VSIX`
3. Select generated `.vsix` file
