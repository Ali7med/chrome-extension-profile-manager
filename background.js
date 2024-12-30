console.log("Background script loaded.");
chrome.commands.onCommand.addListener((command) => {
    if (command === "open_popup") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          const tab = tabs[0];
          chrome.action.openPopup(); // Open the popup
        } else {
          console.error("No active tab found.");
        }
      });
    }
  });
  