# Unit Conversion Hints

A VS Code extension that shows unit conversion hints in various file types. Displays conversions as inline comments on the active line and in hover tooltips.

## Features

- **Active Line Hints**: Shows conversion hints as inline comments on the line where your cursor is (e.g., `"1.25rem", // 20px`)
- **Hover Tooltips**: Hover over any unit value to see the conversion
- **Extensible Architecture**: Easy to add new unit converters and file type handlers
- **Multiple File Types**: Currently supports JSON and JSONC files (easily extensible to more)
- **Multiple Conversions**: Currently supports rem ↔ px conversions (easily extensible to more)

## Supported Conversions

- **REM to PX**: Converts rem values to pixels based on configurable base font size
- **PX to REM**: Converts pixel values to rem based on configurable base font size

## Supported File Types

- JSON (`.json`)
- JSONC (`.jsonc`)

## Installation

### From Source

**Important**: You must open the `unit-conversion-hints` folder as the workspace root in VS Code, not the parent directory.

1. **Open the extension folder as workspace**:
   - In VS Code: `File` → `Open Folder...` → Navigate to and select the `unit-conversion-hints` folder
   - Or from terminal: `cd unit-conversion-hints && code .`
2. Run `npm install` to install dependencies
3. Compile the extension: `npm run compile` (or `npm run watch` for auto-compile)
4. Launch the extension using one of these methods:
   - **Method 1 (Recommended)**:
     - Click the "Run and Debug" icon in the sidebar (or press `Cmd + Shift + D` on Mac)
     - Select "Run Extension" from the dropdown at the top
     - Click the green play button (or press `F5`)
   - **Method 2**:
     - Press `Cmd + Shift + P` (Mac) or `Ctrl + Shift + P` (Windows/Linux)
     - Type "Debug: Start Debugging" and select it
5. A new Extension Development Host window will open
6. In the new window, open your file with unit values (like `theme.json`) to see the extension in action

### Package for Distribution

1. Install `vsce`: `npm install -g @vscode/vsce`
2. Run `vsce package` to create a `.vsix` file
3. Install the `.vsix` file in VS Code: `code --install-extension unit-conversion-hints-1.0.0.vsix`

## Configuration

The extension can be configured in VS Code settings:

### Global Settings

- `unitConversionHints.showHover`: Show hover tooltips (default: `true`)

### REM to PX Converter Settings

- `unitConversionHints.remToPx.baseFontSize`: Base font size in pixels (default: `16`)

## Usage

Simply open any supported file containing unit values like:

```json
{
  "size": "1rem",
  "max": "1.25rem",
  "min": "0.875rem"
}
```

The extension will automatically:

- Show conversion hints as inline comments on the active line
- Show conversion tooltips when you hover over unit values

## Example

In your `theme.json` file, move your cursor to a line with unit values to see inline hints:

```json
{
  "fluid": {
    "max": "1.25rem", // 20px
    "min": "1rem", // 16px
    "maxViewportWidth": "1440px", // 90rem
    "minViewportWidth": "425px" // 26.56rem
  },
  "size": "1rem" // 16px
}
```

Hover over any unit value to see detailed conversion information in a tooltip.

## Architecture

The extension is built with a modular architecture to make it easy to add new unit conversions and file type support:

### Adding a New Unit Converter

1. Create a new converter class in `src/converters/` that implements `UnitConverter`
2. Register it in `src/converters/index.ts`
3. Add configuration properties to `package.json`

Example converter structure:

```typescript
export class MyConverter implements UnitConverter {
  id = "myConverter";
  name = "My Converter";

  getRegex(): RegExp {
    return /pattern/g;
  }

  convert(
    matchedValue: string,
    extractedValue: string,
    config: vscode.WorkspaceConfiguration
  ): string {
    // Conversion logic
  }

  // ... other required methods
}
```

### Adding a New File Type Handler

1. Create a new file handler class in `src/fileHandlers/` that implements `FileHandler`
2. Register it in `src/fileHandlers/index.ts`
3. Add the language ID to `activationEvents` in `package.json`

Example file handler structure:

```typescript
export class MyFileHandler implements FileHandler {
  supportedLanguages = ['mylang'];

  canHandle(document: vscode.TextDocument): boolean {
    return this.supportedLanguages.includes(document.languageId);
  }

  findMatches(document: vscode.TextDocument, converters: UnitConverter[]): Array<...> {
    // Match finding logic
  }
}
```

## Development

```bash
npm install
npm run compile
npm run watch  # For development with auto-recompile
```

## License

MIT
