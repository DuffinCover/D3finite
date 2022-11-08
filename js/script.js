


async function loadData() {
    // const satData = await d3.json('data/satellites.json');
    const satData = 'this is fake'
    return satData;
}

let satData = loadData()

const worldView = new Worldview(satData);

// let worldView = new Worldview('this is fake data');