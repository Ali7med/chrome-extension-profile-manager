document.addEventListener("DOMContentLoaded", function () {
  // Load and display the last 5 profiles on page load
  loadSearchProfiles();

  // Attach event listener for the search input
  document.getElementById("searchInput").addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();
    chrome.storage.local.get("profiles", function (data) {
      const profiles = data.profiles || [];
      const filteredProfiles = profiles.filter((profile) =>
        profile.name.toLowerCase().includes(searchValue)
      );
      displaySearchResults(filteredProfiles, profiles); // Pass both filtered and original profiles
    });
  });

  // Attach event listener for the Enter key
  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      const firstSelectButton = document.querySelector(".select-profile-btn");
      if (firstSelectButton) {
        firstSelectButton.focus(); // Focus the first "Select" button
      }
      event.preventDefault(); // Prevent the default form submission or input behavior
    }
  });
});

function loadSearchProfiles() {
  chrome.storage.local.get("profiles", function (data) {
    const profiles = data.profiles || [];
    const lastFiveProfiles = profiles.slice(-5); // Get the last 5 profiles
    displaySearchResults(lastFiveProfiles, profiles); // Pass both last five and original profiles
  });
}

// Display search results
function displaySearchResults(filteredProfiles, allProfiles) {
  const searchResultDiv = document.getElementById("searchResult");
  searchResultDiv.innerHTML = "";

  if (filteredProfiles.length === 0) {
    searchResultDiv.innerHTML = "<p>No profiles found.</p>";
    return;
  }

  filteredProfiles.forEach((profile) => {
    const profileDiv = document.createElement("div");
    profileDiv.className = "profile-item";
    profileDiv.innerHTML = `
        <span>${profile.name}</span>
        <button class="select-profile-btn" data-name="${profile.name}">Select</button>
      `;
    searchResultDiv.appendChild(profileDiv);
  });

  // Attach click listeners to "Select" buttons
  document.querySelectorAll(".select-profile-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const profileName = this.getAttribute("data-name"); // Get profile name
      selectProfile(profileName, filteredProfiles); // Pass the name and filtered profiles
    });
  });
}

// Select and autofill the profile
function selectProfile(profileName, filteredProfiles) {
  const selectedProfile = filteredProfiles.find(
    (profile) => profile.name === profileName
  );

  if (!selectedProfile) {
    alert("Profile not found!");
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length === 0) {
      alert("No active tab found!");
      console.error("No active tab found.");
      return;
    }

    const tab = tabs[0];

    if (!tab.url || !tab.url.startsWith("http")) {
      alert("This page is not supported for autofill.");
      console.error("The current tab's URL is not a valid web page:", tab.url);
      return;
    }

    // Ensure you have permissions for the active tab before executing
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: fillProfileFields,
        args: [selectedProfile.fields],
      },
      (results) => {
        if (chrome.runtime.lastError) {
          console.error("Error:", chrome.runtime.lastError.message);
        } else {
          console.log("Profile fields filled in the active tab.");
        }

        // Close the extension popup
        //window.close();
      }
    );
  });
}

// Function to run in the active tab to autofill the fields
function fillProfileFields(fields) {
  console.log("fillProfileFields running");
  Object.entries(fields).forEach(([key, value]) => {
    let field = null;

    if (key.startsWith("#")) {
      // Search by ID only
      const id = key.slice(1); // Remove the "#"
      field = document.getElementById(id);
    } else if (key.startsWith(".")) {
      // Search by name only
      const name = key.slice(1); // Remove the "."
      field = document.querySelector(`[name="${name}"]`);
    } else {
      // Search by both name and ID
      field = document.querySelector(
        `input[name="${key}"], input[id="${key}"], textarea[name="${key}"], textarea[id="${key}"]`
      );
    }

    if (field) {
      field.value = value;
    }
  });
}
