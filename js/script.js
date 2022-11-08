
async function loadData() {
    const satData = await d3.json('data/satellites.json');

    return satData;
}
loadData().then(data => {
    let SatTable = new SatelliteTable(data);
    let worldView = new Worldview(data);
});

