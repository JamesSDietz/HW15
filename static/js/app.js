//James Dietz
//HW belly button biodiversity
//Javascript

function buildMetadata(sample) {

// Building the metadata panel

  // Fetch the metadata for a sample
  var url = `/metadata/sample`;
 
  // d3 to select the panel with id of `#sample-metadata`
  d3.json(url).then(function(sample){
    var sampleMetadata = d3.select("#sample-metadata");

    //checking...
    console.log("Sample Metadata: ", sampleMetadata);

    // Use `.html("") to clear any existing metadata
    sampleMetadata.html("");


    // `Object.entries` to add each key and value pair to the panel
    // d3 to append new tags for each key-value in the metadata.
    Object.entries(sample).forEach(function ([key, value]) {
      var row = sampleMetadata.append("p");
      row.text(`${key}: ${value}`);
      
      //checking...
      console.log("sample window row: ", row)

});
  }
)};


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(function(data) {

    // @TODO: Build a Bubble Chart using the sample data
    var xValues = data.otu_ids;
    var yValues = data.sample_values;
    var markerSize = data.sample_values;
    var markerColors = data.otu_ids; 
    var textValues = data.otu_labels;

    //checking to see what i got....

    console.log("x values/otu_ids: ", xValues);
    console.log("y values/sample values: ", yValues);
    console.log("text values/otu.labels: ", textValues);

    
    //setting up trace

    var trace1 = {
      x: xValues,
      y: yValues,
      text: textValues,
      mode: 'markers',
      marker: {
        color: markerColors,
        size: markerSize
      } 
    };
  
    //organizing and building the plot
    var data = [trace1];

    var layout = {
      xaxis: { title: "Specimen ID"},
    };

    Plotly.newPlot('bubble', data, layout);
   

    // Pie Chart: fetch similar to above
    d3.json(url).then(function(data) {  
    var pieValues = data.sample_values.slice(0,10);
      var pieIds = data.otu_ids.slice(0,10);
      var pieHover = data.otu_labels.slice(0,10);

      console.log("Pie Values: ", pieValues);
      console.log("Pie Labels: ", pieIds);
      console.log("Pie Hover Texts: ", pieHover);

      var data = [{
        values: pieValues,
        labels: pieIds,
        hovertext: pieHover,
        type: 'pie'
      }];

      Plotly.newPlot('pie', data);

    });
  });   
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const defaultSample = sampleNames[0];
    buildCharts(defaultSample);
    buildMetadata(defaultSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
