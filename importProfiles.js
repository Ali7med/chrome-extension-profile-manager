console.log("importProfiles.js running");

// Import Profiles from CSV
document.getElementById("importCsvButton").addEventListener("click", () => {
  const importFileInput = document.getElementById("importFileInput"); // Input for CSV file
  const file = importFileInput.files[0]; // Get the first file selected
  if (!file) {
    console.log("No file selected.");
    alert("Please select a CSV file.");
    return;
  }

  console.log("File selected:", file.name);

  const reader = new FileReader();
  reader.onload = (event) => {
    const csvContent = event.target.result;
    console.log("CSV Content:", csvContent);

    // Split by line and skip the first line (header)
    const lines = csvContent.split("\n").slice(1);
    const importedProfiles = {};

    // Parse CSV content into profiles
    lines.forEach((line, index) => {
      const [name, key, value] = line.split(",").map((item) => item.trim());
      if (!name || !key) return; // Skip invalid lines

      // Create profile if it doesn't exist
      if (!importedProfiles[name]) importedProfiles[name] = {};

      // Add key-value pair to the profile fields
      importedProfiles[name][key] = value;
    });

    console.log("Parsed profiles:", importedProfiles);
    chrome.storage.local.get("profiles", function (data) {
      let profiles = data.profiles || [];
       
      Object.entries(importedProfiles).forEach(([name, fields]) => {
        if (!profiles.some((profile) => profile.name === name)) {
          profiles.push({ name: name, fields: fields });
        }
      });

      chrome.storage.local.set({ profiles: profiles }, function () {
        alert("Profiles imported successfully!");
        displayProfiles();
        loadSearchProfiles();
        resetForm();
      });
    });
    // // Get existing profiles from local storage
    // chrome.storage.local.get("profiles", (data) => {
    //   let profiles = data.profiles || [];
    //   console.log("Existing profiles:", profiles);

    //   // Add new profiles to existing ones if they don't already exist
    //   Object.entries(importedProfiles).forEach(([name, fields]) => {
    //     if (!profiles.some((profile) => profile.name === name)) {
    //       profiles.push({ name, fields });
    //     }
    //   });

    //   console.log("Updated profiles:", profiles);

    //   // Save updated profiles to local storage
    //   chrome.storage.local.set({ profiles: profiles }, () => {
    //     alert("Profiles imported successfully!");
    //     displayProfiles(); // Display the profiles after importing
    //     loadSearchProfiles(); // Load and display the last 5 profiles
    //   });
    // });
  };

  reader.readAsText(file); // Read the file as text
});
