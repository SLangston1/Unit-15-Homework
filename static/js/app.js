function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
   // Use d3 to select the pane`#sample-metadata`);
console.log(sample);
//d3.select(`#sample-metadata`);
const url_meta = "/metadata/" + sample;
console.log(url_meta);
    // Use `.html("") to clear any existing metadata
//$samplemetadata.innerHTML = null;
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    Plotly.d3.json(url_meta, function (error, MetaData) {
      if (error) return console.warn(error);
    console.log(MetaData)
    var resKeys = Object.keys(MetaData);

    // Accesses the division in HTML
    var $sampleMetadata = document.querySelector("#sample-metadata");

    // clears panel
    $sampleMetadata.innerHTML = null;

    // iterates through keys and creates p element for each key
    for (var i=0; i<resKeys.length; i++){
        var $newDataLine = document.createElement('p');
        $newDataLine.innerHTML = resKeys[i] + ": " + MetaData[resKeys[i]];
        $sampleMetadata.appendChild($newDataLine)
    };
  });


  

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data
    const url_sample = "/samples/" + sample;
console.log(url_sample);
Plotly.d3.json(url_sample, function (error, SampleData) {
  if (error) return console.warn(error);
console.log(SampleData)
var otuIDs = Object.values(SampleData.otu_ids);
var sampleValues = Object.values(SampleData.sample_values);
console.log(otuIDs)
console.log(sampleValues)
var trace1 = {
          x: otuIDs,
          y: sampleValues,
        mode: 'markers',
        type: 'scatter',
        marker: {
          size: sampleValues,
          color: otuIDs,
          colorscale: 'Rainbow'
      },
        
      };
      
      var data = [trace1];

      var layout = {

        showlegend: false,
        xaxis:{
            title : "OTU(Operational Taxonomic Unit) ID"
        },

        yaxis:{
            title : "Sample Values"
        },
        height: 600,
        width: 1200
      };
   
      Plotly.newPlot('bubble', data, layout);

});

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    const pie_url_sample = "/samples/" + sample;
    console.log(pie_url_sample);
    Plotly.d3.json(pie_url_sample, function (error,PieSampleData) {
      if (error) return console.warn(error);
    console.log(PieSampleData)
    var pieOtuIDs = Object.values(PieSampleData.otu_ids).slice(0,10);
    var pieSampleValues = Object.values(PieSampleData.sample_values).slice(0,10);
    console.log(pieOtuIDs)
    console.log(pieSampleValues)
    var data = [{
      values: pieSampleValues,
      labels: pieOtuIDs,
      type: 'pie'
}];

// sets up layout for pie chart
var layout = {
       height: 500,
       title: "Top 10 Sample Counts for " + sample
      };

// plots piechart
Plotly.newPlot('pie', data, layout);





})};

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
    const firstSample = sampleNames[0];
    console.log(firstSample);
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
