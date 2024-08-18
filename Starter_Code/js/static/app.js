// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let resultArray = metadata.filter(sampleO => sampleO.id == sample);
    let result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let demopanel = d3.select('#sample-metadata');

    // Use `.html("")` to clear any existing metadata
    demopanel.html('');

    // Inside a loop, append new tags for each key-value in the filtered metadata 
    // xpert used here was having a hard time
    if (result) {
      Object.entries(result).forEach(([key, value]) => {
        demopanel.append('h6').text(`${key.toUpperCase()}: ${value}`);
      });
    } else {
      demopanel.append('h6').text('ERROR: Metadata not found');
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let filterSamples = samples.filter(selectedsamp => selectedsamp.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = filterSamples.otu_ids;
    let otu_labels = filterSamples.otu_labels;
    let sample_values = filterSamples.sample_values;

    // Build a Bubble Chart
    let bubbleChart = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
      }
    }];

    let bubbleRender = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Number of Bacteria" }
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleChart, bubbleRender);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    //xpert used here
    let yticks = otu_ids.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse();

    // Build a Bar Chart
    let barData = [{
      x: sample_values.slice(0, 10).reverse(),
      y: yticks,
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    }];
    let barLay = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: {title: 'Number of Bacteria'}
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLay);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let namesField = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownM = d3.select('#selDataset');

    // Use the list of sample names to populate the select options
    namesField.forEach((name) => {
      dropdownM.append('option').text(name).property('value', name);
    });

    // Get the first sample from the list
    let sampleOne = namesField[0];

    // Build charts and metadata panel with the first sample
    buildCharts(sampleOne);
    buildMetadata(sampleOne);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
