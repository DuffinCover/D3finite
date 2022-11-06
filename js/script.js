


async function loadData() {
    const satData = await d3.json('data/satellites.json');

    return satData;
}