// Content script for the browser extension

let highligtEnabled = false;

// Function to handle text selection
function handleSelection() {
    if (highligtEnabled) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            console.log(selection);
            const range = selection.getRangeAt(0);
            console.log(range);
            const span = document.createElement('span');
            span.className = 'extension-highlighted';
            span.style.backgroundColor = 'yellow';
            range.surroundContents(span);
    }
  }
}

// Function to get all highlighted text
function getAllHighlightedText() {
  const highlights = document.querySelectorAll('.extension-highlighted');
  return Array.from(highlights).map(el => el.textContent.trim()).join('\n');
}

// Function to copy text to clipboard
function copyToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
}

// Function to remove all highlights
function removeAllHighlights() {
    const highlights =  document.querySelectorAll('.extension-highlighted');
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize();
    });
}

// Event listener for right-click on highlighted text
document.addEventListener('contextmenu', (event) => {
  const target = event.target;
  if (target.classList.contains('extension-highlighted')) {
    event.preventDefault();
    const allHighlightedText = getAllHighlightedText();
    copyToClipboard(allHighlightedText);
    console.log('All highlighted text copied to clipboard');
  }
});

// Event listener for highlighting current selection
document.addEventListener('mouseup', handleSelection);

// Use browser-compatible runtime API
const runtime = typeof chrome !== 'undefined' ? chrome.runtime : browser.runtime;

runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getHighlightedText') {
    sendResponse({ text: getAllHighlightedText() });
  }
  if (message.action === 'removeHighlightedText') {
    removeAllHighlights();
    sendResponse({ text: 'removed' });
  }
  if (message.action === 'toggleHighlighting') {
    highligtEnabled = message.isEnabled || false;
    console.log(highligtEnabled ? 'Highlighting enabled' : 'Highlighting disabled');
  }
});

