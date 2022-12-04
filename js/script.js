

const globalState = {
    originalData: null,
    satelliteData: null,
    sampleSatellites: null,
    detail: null,
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
        ["Launch Vehicle", null],
        ["Class of Orbit", null]
    ],
    selection: [],
    color_pallette: [
        '#f36688', '#da3182', '#9e316b',
        '#bb3ad3', '#684dda', '#5033db',
        '#261a5a', '#1a1044', '#4c5c87',
        '#69809e','#95c5ac'
    ], 
};


function color_shift(hexColor, magnitude) {
    hexColor = hexColor.replace(`#`, ``);
    if (hexColor.length === 6) {
        const decimalColor = parseInt(hexColor, 16);
        let r = (decimalColor >> 16) + magnitude;
        r > 255 && (r = 255);
        r < 0 && (r = 0);
        let g = (decimalColor & 0x0000ff) + magnitude;
        g > 255 && (g = 255);
        g < 0 && (g = 0);
        let b = ((decimalColor >> 8) & 0x00ff) + magnitude;
        b > 255 && (b = 255);
        b < 0 && (b = 0);
        return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
    } else {
        return hexColor;
    }
}


async function loadData() {
    const satData = await d3.json('data/satellites.json');
    return satData;
}

loadData().then(data => {
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

function updateAllGroup(reset = false) {
    //console.log("Apply Grouping");
    globalState.table.updateGroup(reset);
    globalState.worldView.updateGroup();
    globalState.lineChart.update();
    globalState.detail.update();
}

function updateAllSelection() {
    //console.log("Updating Selection",globalState.selection);

    globalState.worldView.updateSelection();
    globalState.table.updateSelection();
    globalState.lineChart.update();
    globalState.detail.update();
}

function updateSort() {
    globalState.lineChart.update();
}

function applyGrouping() {
    let group = globalState.group;


    let groupedData = [...globalState.satelliteData]

    for (let [key, value] of group) {

        if (value === null) {

        } else {
            let newData = groupedData.filter(d => d[key] === value);

            groupedData = newData;
        }
    }

    // Filters data by year
    groupedData = filterByYear(groupedData);
    // Removes item from the selection if the filtering no longer contains that item
    for(let el of globalState.selection) {
        let groupNameMapping = groupedData.map(d => d['Name of Satellite, Alternate Names']);
        if(!groupNameMapping.includes(el)) {
            globalState.selection.splice(el);
        } 
    }
    return groupedData;


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

    //console.log(selectedYear)
    return selectedYear;

  }


function updateSample(percent){
    globalState.cuttoffYear = 2022
    globalState.satelliteData = takeSample(globalState.originalData.length*percent)
    globalState.lineChart.update()
    globalState.worldView.newSampleUpdate()
};