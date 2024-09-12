# Text Highlighter Browser Extension

## Overview

Text Highlighter is a browser extension that allows users to highlight text of multiple areas on web pages, copy all highlighted text, and remove highlights. It helps to highlight valuable information on sites you're reading and export all at once instead of having to do multiple copying operations that distract the reading flow. It works on both Chrome and Firefox browsers.

## Features

- Toggle text highlighting on/off
- Highlight text across multiple nodes
- Copy all highlighted text
- Remove all highlights
- Right-click context menu integration

## Installation

### Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select the extension directory

### Firefox

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on" and select any file in the extension directory

## Usage

1. Click the extension icon to open the popup
2. Use the toggle switch to enable/disable highlighting
3. Highlight text on web pages by selecting it with your mouse
4. Right-click on the page to access the "Copy all highlights" option in the context menu
5. Use the popup buttons to copy all highlights or remove all highlights

## File Structure

- `manifest.json`: Extension configuration
- `index.js`: Content script for text highlighting functionality
- `background.js`: Background script for context menu integration
- `popup.html`: HTML for the extension popup
- `popup.js`: JavaScript for the extension popup

## Technical Details

- Uses the WebExtensions API for cross-browser compatibility
- Implements custom highlighting logic to handle multi-node text selections
- Uses the modern Clipboard API with a fallback for older browsers
- Stores highlighting state using the browser's storage API

## Known Limitations

- Highlighting may not work correctly with complex page layouts or dynamically loaded content
- The extension requires permission to read and modify web page content

## Future Improvements

- Add customizable highlight colors
- Exporting color based text
- Add eraser functionality
- Implement persistent highlights across page reloads
- Add support for annotating highlights
- Improve performance for large documents

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)