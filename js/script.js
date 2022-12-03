

const globalState = {
    originalData: null,
    satelliteData: null,
    sampleSatellites: null,
    detail: null,
    table: null,
    worldView: null,
    lineChart: null,
    cuttoffYear: null,
    group: {
        "Class of Orbit": null,
        "Date of Launch": null,
        "Country of Operator/Owner": null,
        "Purpose": null,
    },
    selection: [],
    color_pallette: [
        '#f36688', '#da3182', '#9e316b',
        '#bb3ad3', '#684dda', '#5033db',
        '#261a5a', '#1a1044', '#4c5c87',
        '#69809e','#95c5ac'
    ]
};



async function loadData() {
    const satData = await d3.json('data/satellites.json');
    // const satSampleData =  await d3.json("data/satellites_sample.json")
    return satData;
}

loadData().then(data => {
    console.log(data);

    globalState.originalData = data; 
    globalState.satelliteData = takeSample(200);
    globalState.table = new SatelliteTable(globalState);
    globalState.worldView = new Worldview(globalState);
    globalState.lineChart = new VisualSatelliteChart(globalState);
    globalState.detail = new SatelliteDetails(globalState);

});

function takeSample(sampleSize){
    let sampleSet = new Set()
    for( let i = 0; i < sampleSize; i++){
      sampleSet.add(globalState.originalData[Math.floor(Math.random() * sampleSize)])
    }
    if(globalState.group)
    return [...sampleSet]
}

function updateAllGroup() {
    globalState.table.updateGroup();
   globalState.worldView.updateGroup();
    globalState.lineChart.update();
    globalState.detail.update();
}

function updateAllSelection() {
    console.log("Updating Selection",globalState.selection);
    globalState.table.updateSelection();
    globalState.lineChart.update();
    globalState.detail.update();
}

function updateSort() {
    globalState.lineChart.update();
}

function applyGrouping() {
    let group = globalState.group;

    //let groupedData = globalState.satelliteData.filter( d => )
    let groupedData = [...globalState.satelliteData]


    for (let [key, value] of group.entries()) {
        if (value === null) {

        } else {
            let newData = groupedData.filter(d => d[key] === value);
            groupedData = newData;
        }
    }

    return groupedData;


    // Map of pairs {key , condition}


    // E.g. ['Class of Orbit','LEO']


}

function updateSample(percent){
    globalState.satelliteData = takeSample(globalState.originalData.length*percent)
    globalState.lineChart.update()
    globalState.worldView.newSampleUpdate()
};