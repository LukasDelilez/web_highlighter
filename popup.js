const runtime = typeof chrome !== 'undefined' ? chrome : browser;

document.addEventListener("DOMContentLoaded", () => {
    const toggleSwitch = document.getElementById("highlightToggle");
    const toggleStatus = document.getElementById("toggleStatus");

    runtime.storage.local.get("toggleState", (result) => {
        const isEnabled = result.toggleState || false;
        updateToggleStatus(isEnabled);
    });

    toggleSwitch.addEventListener("change", (event) => {
        let isEnabled = event.target.checked;
        saveToggleStatus(isEnabled);
        updateToggleStatus(isEnabled);
        toggleCurrentTabHighlighting(isEnabled);
    });

    function toggleCurrentTabHighlighting(isEnabled) {
        runtime.tabs.query({active: true, currentWindow: true}, (tabs) => {
            runtime.tabs.sendMessage(tabs[0].id, {action: "toggleHighlighting", isEnabled});
        });
    }

    function updateToggleStatus(isEnabled) {
        toggleStatus.textContent = isEnabled ? "Highlighting on" : "Highlighting off";
    }

    function saveToggleStatus(isEnabled) {
        runtime.storage.local.set({toggleState: isEnabled});
    }

    document.getElementById('copyButton').addEventListener('click', () => {
    runtime.tabs.query({active: true, currentWindow: true}, (tabs) => {
        runtime.tabs.sendMessage(tabs[0].id, {action: "getHighlightedText"}, (response) => {
        if (response && response.text) {
            navigator.clipboard.writeText(response.text).then(() => {
            console.log('Highlighted text copied to clipboard');
            });
        }
        });
    });
    });

    document.getElementById('removeButton').addEventListener('click', () => {
        runtime.tabs.query({active: true, currentWindow: true}, (tabs) => {
        runtime.tabs.sendMessage(tabs[0].id, {action: "removeHighlightedText"}, (response) => {
            if (response && response.text === "removed") {
                console.log('Highlighted text removed');
            }
        });
        });
    });
});