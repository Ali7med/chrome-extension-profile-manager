// Fetch and display profiles in the "Existing Profiles" section

// Delete Profile function
function deleteProfile(event) {
  const profileName = event.target.getAttribute("data-name");

  // Show a confirmation dialog before deleting
  const isConfirmed = confirm("Are you sure you want to delete this profile?");
  if (!isConfirmed) {
    return; // If the user cancels, exit the function
  }

  chrome.storage.local.get("profiles", function (data) {
    let profiles = data.profiles || [];

    const profile = profiles.find((profile) => profile.name === profileName);
    if (profile == null) {
      alert("Profile not found!");
      return;
    }
    const index = profiles.indexOf(profile);
    // Remove the profile from the array
    profiles.splice(index, 1);

    // Save the updated profiles to storage
    chrome.storage.local.set({ profiles: profiles }, function () {
      //alert("Profile deleted!"); // Notify the user
      // Re-fetch profiles after deletion
      displayProfiles();
    });
  });
}

// Edit Profile function
function editProfile(event) {
  const profileName = event.target.getAttribute("data-name");
  chrome.storage.local.get("profiles", function (data) {
    const profiles = data.profiles || [];
    const profile = profiles.find((profile) => profile.name === profileName);
    // Populate the form with the selected profile's data
    document.getElementById("profileName").value = profile.name;

    // Convert fields object to "key:value,key2:value2" format
    const fieldsFormatted = Object.entries(profile.fields)
      .map(([key, value]) => `${key}:${value}`)
      .join(",");

    document.getElementById("profileFields").value = fieldsFormatted;

    // Add the profile index to the save button for updates
    document
      .getElementById("saveProfile")
      .setAttribute("data-name", profileName);
  });
}

// Save Profile - Update the profile if editing

document
  .getElementById("saveProfile")
  .addEventListener("click", function (event) {
    event.preventDefault();

    const profileNewName = document.getElementById("profileName").value;
    const profileFieldsInput = document.getElementById("profileFields").value;
    // Convert "key:value,key2:value2" format into an object
    const profileFields = profileFieldsInput.split(",").reduce((acc, pair) => {
      const [key, value] = pair.split(":").map((item) => item.trim());
      if (key) acc[key] = value;
      return acc;
    }, {});

    chrome.storage.local.get("profiles", function (data) {
      let profiles = data.profiles || [];
      const profileName = event.target.getAttribute("data-name");
      const profile = profiles.find((profile) => profile.name === profileName);
      if (profile !== null) {
        // Update the existing profile
        const index = profiles.indexOf(profile);
        if (index === -1) {
          profiles.push({ name: profileNewName, fields: profileFields });
        } else {
          profiles[index] = { name: profileNewName, fields: profileFields };
        }
      } else {
        // Add new profile
        profiles.push({ name: profileNewName, fields: profileFields });
      }

      chrome.storage.local.set({ profiles: profiles }, function () {
        //alert("Profile saved!");
        displayProfiles();
        loadSearchProfiles();
        resetForm();
      });
    });
  });

// Attach event listener for the search input
document.getElementById("searchInput2").addEventListener("input", function () {
  const searchValue = this.value.toLowerCase();
  displayProfiles(searchValue);
});
// Display profiles after editing/deleting
function displayProfiles(search = "") {
  chrome.storage.local.get("profiles", function (data) {
    const profilesFull = data.profiles || [];
    if (search != "") {
      profiles = profilesFull.filter((profile) =>
        profile.name.toLowerCase().includes(search)
      );
    } else {
      profiles = profilesFull;
    }

    const profileContainer = document.getElementById("existingProfiles");

    if (profiles.length === 0) {
      profileContainer.innerHTML = "No profiles available.";
    } else {
      profileContainer.innerHTML = "";

      profiles.forEach((profile, index) => {
        const profileDiv = document.createElement("div");
        profileDiv.classList.add("profile-item");

        profileDiv.innerHTML = `
        <div class="profile-details">
            <span class="profile-name">${profile.name}</span>
            <div class="profile-actions">
            <button class="edit-button" data-name="${profile.name}">Edit</button>
            <button class="delete-button" data-name="${profile.name}">Delete</button>
            </div>
        </div>
        `;
        profileContainer.appendChild(profileDiv);
      });

      // Re-bind event listeners
      document.querySelectorAll(".delete-button").forEach((button) => {
        button.addEventListener("click", deleteProfile);
      });
      document.querySelectorAll(".edit-button").forEach((button) => {
        button.addEventListener("click", editProfile);
      });
    }
  });
}
// Clear all profiles when the "Clear All Profiles" button is clicked
document.getElementById("clearProfilesButton").addEventListener("click", () => {
  const confirmClear = window.confirm(
    "Are you sure you want to clear all profiles?"
  );
  if (confirmClear) {
    chrome.storage.local.set({ profiles: [] }, () => {
      //alert("All profiles have been cleared.");
      displayProfiles(); // Refresh the displayed profiles
      loadSearchProfiles();
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Load and display the last 5 profiles on page load
  displayProfiles();
  // Attach event listener for the search input
});
// Reset the form after saving or editing a profile
function resetForm() {
  document.getElementById("profileName").value = "";
  document.getElementById("profileFields").value = "";
  document.getElementById("saveProfile").removeAttribute("data-name");
}
