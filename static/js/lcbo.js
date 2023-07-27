const url3 = "https://raw.githubusercontent.com/domoto86/lcbo-project-3/main/lcbo_2.json";

let map = L.map('map').setView([0, 0], 2);

// Add the base tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 18
}).addTo(map);

fetch(url3)
  .then(response => response.json())
  .then(data => {
    console.log(data); // Check the data received

    if (Array.isArray(data)) {
      // Loop through the data array and add markers to the map
      data.forEach(entry => {
        // Retrieve the necessary properties from each entry
        let lat = entry.lat;
        let lon = entry.lon;
        let name = entry.name;

        // Create a marker and add it to the map
        L.marker([lat, lon]).addTo(map)
          .bindPopup(name);
      });
    } else {
      console.log("Invalid data format. Expected an array.");
    }
  })
  .catch(error => {
    console.log("Error fetching data:", error);
  });
