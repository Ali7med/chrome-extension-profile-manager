// Import necessary modules
const saveButton = document.getElementById("saveProfile");
const profileNameInput = document.getElementById("profileName");
const profileFieldsInput = document.getElementById("profileFields");
const exportButton = document.getElementById("exportProfiles");
const importCsvButton = document.getElementById("import-csv-profiles");
const importFileInput = document.getElementById("importProfiles");

document.getElementById("search-tab").classList.add("active");
document.querySelector('.tab-button[data-tab="search"]').classList.add("active");
 // Tab switching logic
document.addEventListener("DOMContentLoaded", function () {
  
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");
  
  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Remove 'active' class from all buttons and content
      tabButtons.forEach(btn => btn.classList.remove("active"));
      tabContents.forEach(content => content.classList.remove("active"));
      
      // Add 'active' class to the clicked button and its associated content
      button.classList.add("active");
      const tabId = button.getAttribute("data-tab");
      document.getElementById(`${tabId}-tab`).classList.add("active");
    });
  }); 
  displayProfiles();
  
});
// Focus on the search input when the popup is opened
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.focus();
  }
  const versionDiv = document.getElementById("version");
  if (versionDiv) {
    const manifestData = chrome.runtime.getManifest();
    if (manifestData && manifestData.version) {
      versionDiv.textContent = `Version: ${manifestData.version}`;
      versionDiv.textContent += ` by: ${manifestData.author}`;
    } else {
      versionDiv.textContent = "Version information not available.";
    }
  }
});
 



 

