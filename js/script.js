async function loadData() {
    // const satData = await d3.json('data/satellites.json');

    // return satData;
}
loadData().then(data => {
    console.log(data);

    let SatTable = new SatelliteTable(data);
    
});