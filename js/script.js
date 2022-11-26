

const globalState = {
    originalData: null,
    satelliteData: null,
    sampleSatellites: null,
    table: null,
    worldView: null,
    lineChart: null,
    cuttoffYear: null,
    group: [],
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
}

function updateAllSelection() {
    console.log("Updating Selection",globalState.selection);
    globalState.table.updateSelection();
    globalState.lineChart.update();
}

function updateSort() {
    //globalState.lineChart.update();
}

function updateSample(percent){
    globalState.satelliteData = takeSample(globalState.originalData.length*percent)
    globalState.lineChart.update()
    globalState.worldView.newSampleUpdate()
};