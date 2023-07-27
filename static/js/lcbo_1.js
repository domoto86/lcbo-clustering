// The url with data
const url1 = "https://raw.githubusercontent.com/domoto86/lcbo-project-3/main/lcbo_1.json"
const url2 = "https://raw.githubusercontent.com/domoto86/lcbo-project-3/main/lcbo_2.json"
// const url = "/api/data"
// Display the default plots
function init() {

    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Fetch the JSON data and console log it
    d3.json(url1).then((data1) => {
        console.log(data1);

        // An array of id names
        let names = data1.name;

        // Iterate through the names Array
        names.forEach((name) => {
            // Append each name as an option to the drop down menu
            // This is adding each name to the html file as an option element with value = a name in the names array
            dropdownMenu.append("option").text(name).property("value", name);
        });

        // Assign the first name to name variable
        let name = names[0];

        // Call the functions to make the demographic panel, bar chart, and bubble chart
        demo(name);
        bar(name);
        // bubble(name);
        gauge(name);
    });
}

// Make the demographics panel
function demo(selectedValue) {
    // Fetch the JSON data and console log it
    d3.json(url2).then((data2) => {
        console.log(data2);

        // An array of metadata objects
        let metaname = data2;

        console.log(metaname);
        
        // Filter data where id = selected value after converting their types 
        // (bc meta.id is in integer format and selectValue from is in string format)
        let filteredData = metaname.filter((meta) => meta.name == selectedValue);
      
        // Assign the first object to obj variable
        let obj = filteredData[0]
        
        // Clear the child elements in div with id sample-metadata
        d3.select("#sample-metadata").html("");
  
        // Object.entries() is a built-in method in JavaScript 
        // This returns an array of a given object's own enumerable property [key, value]
        let entries = Object.entries(obj);
        
        // Iterate through the entries array
        // Add a h5 child element for each key-value pair to the div with id sample-metadata
        entries.forEach(([key, value]) => {
            if (key !== "lat" && key !== "lon") {
              let formattedValue = value;
              if (key === "savings" || key === "regular_price" || key === "sale_price") {
                formattedValue = "$" + value;
              }
              d3.select("#sample-metadata").append("h5").html(`<strong>${key}</strong>: ${formattedValue}`);
            }
          });

        // Log the entries Array
        console.log(entries);
    });
  }
  

// Make the bar chart
function bar() {
  // Fetch the JSON data and console log it
  d3.json(url1).then((data) => {
    console.log(data);

    // Extract the "made_in" array from the data
    let madeInData = data.made_in;

    // Clean up the data by removing leading/trailing spaces
    let cleanedData = madeInData.map((made_in) => made_in.trim());

    // Count the occurrences of each "made_in" value
    let counts = {};
    cleanedData.forEach((made_in) => {
      counts[made_in] = (counts[made_in] || 0) + 1;
    });

    // Convert the counts object into an array of objects
    let countData = Object.keys(counts).map((made_in) => ({
      made_in: made_in,
      count: counts[made_in]
    }));

    // Sort the countData array by count in descending order
    countData.sort((a, b) => b.count - a.count);

    // Slice the top 10 entries for the chart
    let slicedData = countData.slice(0, 10);

    // Extract the "made_in" and "count" values for the chart
    let xValues = countData.map((entry) => entry.count);
    let yValues = countData.map((entry) => entry.made_in);

    // Create the trace for the horizontal bar chart
    let trace = [{
      x: xValues,
      y: yValues,
      type: "bar",
      orientation: "h",
      marker: {
        color: "rgb(166, 172, 237)"
      }
    }];

    // Define the layout options for the chart
    let layout = {
      title: "Total of Wines by Country",
      xaxis: { title: "" },
      yaxis: { title: "" },
    margin: { l: 150 }
    };

    // Use Plotly to plot the data in a bar chart
    Plotly.newPlot("bar", trace, layout);
  });
}
  

// Make the gauge chart 
function gauge(selectedValue) {
    // Fetch the JSON data and console log it 
    d3.json(url2).then((data) => {
        // An array of metadata objects
        let metadata = data;
        
        // Filter data where id = selected value after converting their types 
        // (bc meta.id is in integer format and selectValue from is in string format)
        let filteredData = metadata.filter((meta) => meta.name == selectedValue);
      
        // Assign the first object to obj variable
        let obj = filteredData[0]

        let formattedValue = obj.alcohol_vol * 100;

        // Trace for the data for the gauge chart
        let trace = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: formattedValue,
            title: { text: "<b>Alcohol by Volume</b><br>(in %)", font: {size: 24}},
            type: "indicator", 
            mode: "gauge+number",
            gauge: {
                axis: {
                    range: [null, 30]
                }, 
                bar: {color: "rgb(102,0,51)"}
               
            }
        }];

         // Use Plotly to plot the data in a gauge chart
         Plotly.newPlot("gauge", trace);
    });
}

// Toggle to new plots when option changed
function optionChanged(selectedValue) {
    demo(selectedValue);
    // bubble(selectedValue);
    gauge(selectedValue)
}

init();