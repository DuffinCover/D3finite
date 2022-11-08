


async function loadData() {
    // const satData = await d3.json('data/satellites.json');
    const satData = 'this is fake'
    console.log('loaded')
    let worldView = new Worldview(satData);
    return satData;
}

// let worldView = new Worldview('this is fake data');