// Export Profiles as CSV with UTF-8 BOM
document.getElementById('exportProfiles').addEventListener('click', function () {
    chrome.storage.local.get('profiles', function (data) {
      const profiles = data.profiles || [];
      
      // Convert profiles to CSV format
      const csvData = convertProfilesToCSV(profiles);
  
      // Add BOM for UTF-8 encoding (to fix encoding issues in Excel)
      const bom = '\uFEFF';
      const csvWithBOM = bom + csvData;
  
      // Create a Blob with UTF-8 encoding and trigger a download
      const blob = new Blob([csvWithBOM], { type: 'text/csv; charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'profiles.csv';
      link.click();
    });
  });
  
  // Function to convert profiles to CSV
  function convertProfilesToCSV(profiles) {
    const header = ['Profile Name', 'Field Name', 'Field Value'];
    const rows = [];
  
    profiles.forEach(profile => {
      for (const [fieldName, fieldValue] of Object.entries(profile.fields)) {
        rows.push([profile.name, fieldName, fieldValue]);
      }
    });
  
    // Join header and rows to create the CSV content
    const csvContent = [header, ...rows].map(row => row.join(',')).join('\n');
    return csvContent;
  }