const runtime = typeof chrome !== 'undefined' ? chrome : browser;

document.addEventListener("DOMContentLoaded", () => {
    const toggleSwitch = document.getElementById("highlightToggle");

    runtime.storage.local.get("toggleState", (result) => {
        const isEnabled = result.toggleState || false;
        updateToggleStatus(isEnabled);
        toggleCurrentTabHighlighting(isEnabled);
    });

    toggleSwitch.addEventListener("change", (event) => {
        let isEnabled = event.target.checked;
        console.log(isEnabled);
        saveToggleStatus(isEnabled);
        updateToggleStatus(isEnabled);
        toggleCurrentTabHighlighting(isEnabled);
    });

    function toggleCurrentTabHighlighting(isEnabled) {
        runtime.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            runtime.tabs.sendMessage(tabs[0].id, { action: "toggleHighlighting", isEnabled });
        });
    }

    function updateToggleStatus(isEnabled) {
        toggleSwitch.checked = isEnabled;
    }

    function saveToggleStatus(isEnabled) {
        runtime.storage.local.set({ toggleState: isEnabled });
    }
});