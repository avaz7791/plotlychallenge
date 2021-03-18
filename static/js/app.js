/*
This JS app calls multiple functions and utilizes it using the HTML ID tags in the Index.


*/



function dropdown(sampleID) {
    
    // selDataset tag 
    var dropdownSelection = d3.select("#selDataset");

    // load data 
    d3.json("samples.json").then((data)=> {
        console.log(data)

        // populate data into dropdown in selDataset option
        data.names.forEach(function(name) {
            dropdownSelection.append("option").text(name).property("value");
        });
    
    }); //d3.json end
    
}

// this function update the demographics on the side
function updateDemographics(demo){
    // select sample-metadata
    var selectDemo = d3.select("#sample-metadata");
    //console.log(selectDemo)

    //clear tag
    selectDemo.html("");

    // get data and append it to H5 header      
    //Simplify the code 
    Object.entries(demo[0]).forEach((key) => {   
         selectDemo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
    });
}

function optionChanged (sampleID){

    d3.json("samples.json").then((data)=> {
        var demo = data.metadata;
        var sampleIDs = data.samples;
        
        //console.log(demo);
        //console.log(sampleIDs);
        
        //create a function to find the id that has been selected
        function ID(sample){ return sample.id == sampleID;}

        // variables for my demographics side bar
        var filteredDemo = demo.filter(ID);
        var filteredSample = sampleIDs.filter(ID);

        //call function updateDemographics()
        updateDemographics(filteredDemo);
        
        //call charts
        //declare variables for bar chart
        //
        var OTU_ID = filteredSample[0].otu_ids;
        var OTU_Values = filteredSample[0].sample_values;
        var OTU_lbl = filteredSample[0].sample_labels;
        // call bar plot
        CallPlots(sampleID, OTU_ID, OTU_Values, OTU_lbl);

    });//d3.json end

}

function CallPlots(sampleID, ID, Values, lbl){
        // variables pulled from function
        let  OTU_ID= ID;
        console.log(OTU_ID);
        
		let OTU_Values =  Values;
        console.log(OTU_Values);
        
		let OTU_lbl = lbl;
        console.log (OTU_lbl);

        //reverse the samples 
        var OTU_ID_Reversed =(OTU_ID.slice(0, 10)).reverse();
        var OTU_Values_Reversed =(OTU_Values.slice(0, 10)).reverse();
        
        console.log(OTU_ID_Reversed);
        //update the OTU_ID 
        var OTU_id_upd = OTU_ID_Reversed.map(x => "OTU " + x);
        console.log(OTU_id_upd);
              
        //create trace 
        var bar_data = {
            x: OTU_Values_Reversed,
            y: OTU_id_upd,
            text: OTU_lbl,
            marker:{color:'light blue'},
            type:"bar",
            orientation:"h"
            
        }; 
        // crete the variable for bar data
        var data1=[bar_data];
        //console.log(data1);
        //layout for bar chart
        var bar_layout ={
            title:`Top 10 OTU for ID ${sampleID}`,
            height: 500,
            margin :{ l:100, r:100, t:100, b:35 }

        };
        Plotly.newPlot("bar", data1, bar_layout);

        //Bubble Plot Section -------------------------
        var bubble_data = {
            x: OTU_id_upd,
            y: OTU_Values_Reversed,
            mode: "markers",
            marker: {
                size: OTU_Values_Reversed,
                color: 'Inferno',
                colorscale: OTU_id_upd
            },
            text:  OTU_lbl

        };
        var data2= [bubble_data];
        //console.log(data2);
        // Layout for bubble chart
        var bubble_layout = {
            title: "Sample Distribution",
            xaxis:{
                title: `OTU ID ${sampleID}`},
            height: 600,
            width: 1000,
            yaxis:{
                title:"Sample Value"
            }
        };

        // create the bubble plot
        Plotly.newPlot("bubble", data2, bubble_layout); 


}



d3.json("samples.json").then((data)=> {
    var sampleID = data.names;
    dropdown(sampleID);

    //call onChangeOption function and only pull the first column to pass in
    optionChanged(sampleID[0]);

});