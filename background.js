const runtime = typeof chrome !== 'undefined' ? chrome : browser;

runtime.contextMenus.create({
    id: "copyHighlights",
    title: "Copy All Highlights",
    contexts: ["all"]
});

runtime.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "copyHighlights") {
        runtime.tabs.sendMessage(tab.id, {action: "copyAllHighlights"}, response => {
            if (response && response.text) {
                if (typeof chrome !== 'undefined') {
                    navigator.clipboard.writeText(response.text).then(() => {
                        console.log('Highlighted text copied to clipboard');
                    });
                } else {
                    runtime.tabs.sendMessage(tab.id, { action: "copyToClipboard", text: response.text });
                }
            }
        });
    }
});
