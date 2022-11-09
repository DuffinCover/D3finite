
async function loadData() {
    // const satData = await d3.json('data/satellites.json');
    let satData = 'this is fake'
    return satData;
}
loadData().then(data => {
    console.log(data);

    let SatTable = new SatelliteTable(data);
    let worldView = new Worldview(data);
});

