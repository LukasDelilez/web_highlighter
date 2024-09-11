// Function to handle text selection
function handleSelection() {
    if (!highlightingEnabled) return;

    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    highlightRange(range);
    selection.removeAllRanges();
}

// highlight all nodes in the selection range individually
function highlightRange(range) {
    const startContainer = range.startContainer;
    const endContainer = range.endContainer;

    // If the selection is within a single text node
    if (startContainer === endContainer && startContainer.nodeType === Node.TEXT_NODE) {
        highlightTextNode(startContainer, range.startOffset, range.endOffset);
        return;
    }

    let currentNode = startContainer;
    let endReached = false;

    while (currentNode && !endReached) {
        // get next node before highlighting, because highlighting creates new sibling
        // and getNextNode will always point to the newly created sibling
        let nextNode = getNextNode(currentNode, endContainer);

        if (currentNode.nodeType === Node.TEXT_NODE) {
            if (currentNode === startContainer) {
                highlightTextNode(currentNode, range.startOffset, currentNode.length);
            } else if (currentNode === endContainer) {
                highlightTextNode(currentNode, 0, range.endOffset);
                endReached = true;
            } else {
                highlightTextNode(currentNode, 0, currentNode.length);
            }
        }

        if (currentNode === endContainer) {
            endReached = true;
        }

        currentNode = nextNode;
    }
}

// create span within node and insert nodes text 
function highlightTextNode(node, startOffset, endOffset) {
    const text = node.textContent;
    const span = document.createElement('span');
    span.className = 'extension-highlighted';
    span.style.backgroundColor = 'yellow';
    span.style.color = 'black';
    span.textContent = text.substring(startOffset, endOffset);

    const range = document.createRange();
    range.setStart(node, startOffset);
    range.setEnd(node, endOffset);
    range.deleteContents();
    range.insertNode(span);
}

// traverse over 
function getNextNode(node, endContainer) {
    if (node.firstChild) {
        return node.firstChild;
    }
    while (node) {
        if (node.nextSibling) {
            return node.nextSibling;
        }
        node = node.parentNode;
        if (node === endContainer.parentNode) {
            return null;
        }
    }
    return null;
}

// Function to get all highlighted text
function getAllHighlightedText() {
    const highlights = document.querySelectorAll('.extension-highlighted');
    return Array.from(highlights).reduce(ignoreDuplicates, '');

    function ignoreDuplicates(result, element) {
        return element.firstChild?.className === 'extension-highlighted' ? result += '' : result += element.textContent + '\n';
    }
}

// Function to copy text to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Text successfully copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    } else {
        console.warn('Clipboard API not available, falling back to execCommand');
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';  // Avoid scrolling to bottom
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

// Function to remove all highlights
function removeAllHighlights() {
    const highlights = document.querySelectorAll('.extension-highlighted');
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        while (highlight.firstChild) {
            parent.insertBefore(highlight.firstChild, highlight);
        }
        parent.normalize();
    });
}

// Use browser-compatible runtime API
const runtime = typeof chrome !== 'undefined' ? chrome.runtime : browser.runtime;

let highlightingEnabled = false;

// Event listener for highlighting current selection
document.addEventListener('mouseup', handleSelection);

runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'toggleHighlighting') {
        highlightingEnabled = message.isEnabled || false;
        console.log(highlightingEnabled ? 'Highlighting enabled' : 'Highlighting disabled');
    }
    if (message.action === 'removeHighlights') {
        removeAllHighlights();
    }
    if (message.action === 'copyHighlights') {
        let text = getAllHighlightedText();
        copyToClipboard(text);
    }
});

