chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openWindow') {
        createPopupWindow();
    }
});

// Function to create a popup window
function createPopupWindow() {
    chrome.windows.create({
        url: 'E:/Projects/Degenerate Engineering/Medical/SoftwareTests/TableOrganizer/BasicWebpage/dynamic.html',
        type: 'popup',
        width: 800,
        height: 600
    }, (newWindow) => {
        const tabId = newWindow.tabs[0].id;
        waitForTabToLoad(tabId);
    });
}

// Function to wait for the tab to load
function waitForTabToLoad(tabId) {
    chrome.tabs.onUpdated.addListener(function listener(tabIdUpdated, info) {
        if (tabId === tabIdUpdated && info.status === 'complete') {
            injectScript(tabId);
            chrome.tabs.onUpdated.removeListener(listener);
        }
    });
}

// Function to inject the script
function injectScript(tabId) {
    chrome.scripting.executeScript({
        target: {tabId: tabId},
        files: ['content.js']
    });
}
