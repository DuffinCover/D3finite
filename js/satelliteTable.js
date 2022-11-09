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
        .classed('selectedTable', false);

        // Adding even handler to each row ---- Should change background when selected
        rowSelection.on('click', (event, d) => {d.classed('selectedTable', true)});

        // Stores individual cell selections
        let cellSelect = rowSelection.selectAll('td')
        .data(this.rowToCellDataTransform)
        .join('td');

        // Adding in cell values
        cellSelect.filter(d => d.type === 'Name of Satellite, Alternate Names').text(d => d.value);
        // cellSelect.filter(d => d.type === 'test2').text(d=>d.value);
        // cellSelect.filter(d => d.type === 'test3').text(d=>d.value);
    }


    /**
     * Takes in a JSON object and translates it into separate containers 
     * for each cell
     * @param {*} d 
     * @returns 
     */
    rowToCellDataTransform(d) {
        let test1 = {
            type: 'test1',
            value: d.test1
        };

        let test2 = {
            type: 'test2',
            value: d.test2
        };

        let test3 = {
            type: 'test3',
            value: d.test3
        };

        let dataList = [test1, test2, test3];
        return dataList;
    }
    
}
