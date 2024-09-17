document.getElementById('executeButton').addEventListener('click', function() {
    const inputValue = document.getElementById('inputField').value;
    
    // Execute the function locally
    executeFunction(inputValue);
    
    // Open a new tab and pass the function to be executed there
    openNewTab("https://code.visualstudio.com/docs/python/formatting", executeFunction);
});

function executeFunction(value) {
    console.log('Button clicked! Input value: ' + value);
    // Add your desired functionality here
}

function openNewTab(url, functionToExecute) {
    chrome.tabs.create({ url: url }, function(tab) {
        // Pass the function to be executed in the new tab
        executeScriptInTab(tab.id, functionToExecute);
    });
}

function executeScriptInTab(tabId, functionToExecute) {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: functionToExecute // Pass the reference to the function you want to execute in the new tab
    });
}

// Listen for messages with data from the new tab
chrome.runtime.onMessage.addListener(onMessageReceived);

function onMessageReceived(message, sender, sendResponse) {
    if (message.data) {
        displayDataInPopup(message.data);
    }
}

function displayDataInPopup(data) {
    document.getElementById('output').textContent = data;
}
