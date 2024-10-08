const runtime = typeof chrome !== 'undefined' ? chrome : browser;

runtime.contextMenus.create({
    id: "copyHighlights",
    title: "Copy All Highlights",
    contexts: ["page"]
});

runtime.contextMenus.create({
    id: "removeHighlights",
    title: "Remove All Highlights",
    contexts: ["page"]
});

runtime.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "copyHighlights") {
        runtime.tabs.sendMessage(tab.id, {action: "copyHighlights"});
    }

    if(info.menuItemId === "removeHighlights") {
        runtime.tabs.sendMessage(tab.id, {action: "removeHighlights"});
    }
});
