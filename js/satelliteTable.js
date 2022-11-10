class SatelliteTable{
    /*TODO this should be the more "search engine-y" portion of our visualization */

    /**
     * Constructor for SatelliteTable object
     * @param {*} data JSON object of data
     */
    constructor(data) {
        this.data = data;
        // this.fakeData = [{"test1": "11", "test2": "12", "test3": "13"}, {"test1": "21", "test2": "22", "test3": "23"}, {"test1": "31", "test2": "32", "test3": "33"},
        // {"test1": "11", "test2": "12", "test3": "13"}, {"test1": "21", "test2": "22", "test3": "23"}, {"test1": "31", "test2": "32", "test3": "33"},
        // {"test1": "11", "test2": "12", "test3": "13"}, {"test1": "21", "test2": "22", "test3": "23"}, {"test1": "31", "test2": "32", "test3": "33"},
        // {"test1": "11", "test2": "12", "test3": "13"}, {"test1": "21", "test2": "22", "test3": "23"}, {"test1": "31", "test2": "32", "test3": "33"},
        // {"test1": "11", "test2": "12", "test3": "13"}, {"test1": "21", "test2": "22", "test3": "23"}, {"test1": "31", "test2": "32", "test3": "33"},
        // {"test1": "11", "test2": "12", "test3": "13"}, {"test1": "21", "test2": "22", "test3": "23"}, {"test1": "31", "test2": "32", "test3": "33"},
        // {"test1": "11", "test2": "12", "test3": "13"}, {"test1": "21", "test2": "22", "test3": "23"}, {"test1": "31", "test2": "32", "test3": "33"},
        // {"test1": "11", "test2": "12", "test3": "13"}, {"test1": "21", "test2": "22", "test3": "23"}, {"test1": "31", "test2": "32", "test3": "33"},
        // {"test1": "11", "test2": "12", "test3": "13"}, {"test1": "21", "test2": "22", "test3": "23"}, {"test1": "31", "test2": "32", "test3": "33"},
        // {"test1": "11", "test2": "12", "test3": "13"}, {"test1": "21", "test2": "22", "test3": "23"}, {"test1": "31", "test2": "32", "test3": "33"}];
        
        // Stores table body selection and appends table rows
        let rowSelection = d3.select('#tableBody')
        .selectAll('tr')
        .data(this.data)
        .join('tr')
        .classed('unselectedTable', true);

        // Adding even handler to each row ---- Should change background when selected
        rowSelection.on('click', (event, d) => {d.classed('selectedTable', true)});

        // Stores individual cell selections
        let cellSelect = rowSelection.selectAll('td')
        .data(this.rowToCellDataTransform)
        .join('td');

        // Adding in cell values
        cellSelect.filter(d => d.type === 'Name').text(d => d.value);
        cellSelect.filter(d => d.type === 'OriginCountry').text(d=>d.value);
        cellSelect.filter(d => d.type === 'Use').text(d=>d.value);
        cellSelect.filter(d => d.type ==='Orbit').text(d=>d.value);
    }


    /**
     * Takes in a JSON object and translates it into separate containers 
     * for each cell
     * @param {*} d 
     * @returns 
     */
    rowToCellDataTransform(d) {
        let name = {
            type: 'Name',
            value: d['Name of Satellite, Alternate Names']
        };

        let origin = {
            type: 'OriginCountry',
            value: d['Country of Operator/Owner']
        };

        let use = {
            type: 'Use',
            value: d['Purpose']
        };

        let orbit = {
            type: 'Orbit',
            value: d['Type of Orbit']
        };

        let dataList = [name, origin, use, orbit];
        return dataList;
    }
    
}
