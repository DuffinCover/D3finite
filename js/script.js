

const globalState = {
    originalData: null,
    satelliteData: null,
    sampleSatellites: null,
    table: null,
    worldView: null,
    lineChart: null,
    cuttoffYear: 2022,
    group: [
        ["Type of Orbit", null],
        ["Date of Launch", null],
        ["Country of Operator/Owner", null],
        ["Purpose", null],
        ["Launch Site", null],
        ["Launch Vehicle", null]
    ],
    selection: [],
    color_pallette: [
        '#f36688', '#da3182', '#9e316b',
        '#bb3ad3', '#684dda', '#5033db',
        '#261a5a', '#1a1044', '#4c5c87',
        '#69809e','#95c5ac'
    ], 
    comparedSatellites:[]
};



async function loadData() {
    const satData = await d3.json('data/satellites.json');
    return satData;
}

loadData().then(data => {
    //console.log(data);

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
    //console.log("Apply Grouping");
    globalState.table.updateGroup();
    globalState.worldView.updateGroup();
    globalState.lineChart.update();
}

function updateAllSelection() {
    //console.log("Updating Selection",globalState.selection);
    globalState.table.updateSelection();
    globalState.lineChart.update();
}

function updateSort() {
    //globalState.lineChart.update();
}

function applyGrouping() {
    let group = globalState.group;

    //let groupedData = globalState.satelliteData.filter( d => )
    let groupedData = [...globalState.satelliteData]
    //console.log(groupedData);
    for (let [key, value] of group) {
        //console.log(key);
        //console.log(value);
        if (value === null) {

        } else {
            let newData = groupedData.filter(d => d[key] === value);
            //console.log(newData);
            groupedData = newData;
        }
    }
    // console.log(groupedData);
    return filterByYear(groupedData);


    // Map of pairs {key , condition}


    // E.g. ['Class of Orbit','LEO']


}
function filterByYear(groupData) {
    let selectedYear = groupData.filter((d) => {
      let thisLaunch = d["Date of Launch"].slice(-2);
      if (thisLaunch <= 22) {
        thisLaunch = "20" + thisLaunch;
      } else {
        thisLaunch = "19" + thisLaunch;
      }
      return parseInt(thisLaunch) <= parseInt(globalState.cuttoffYear);
    });

    console.log(selectedYear)
    return selectedYear;

  }


function updateSample(percent){
    globalState.cuttoffYear = 2022
    globalState.satelliteData = takeSample(globalState.originalData.length*percent)
    globalState.lineChart.update()
    globalState.worldView.newSampleUpdate()
};