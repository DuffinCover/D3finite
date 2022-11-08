class SatelliteTable{
    /*TODO this should be the more "search engine-y" portion of our visualization */

    /**
     * Constructor for SatelliteTable object
     * @param {*} data JSON object of data
     */
    constructor(data) {
        this.data = data;

        // This sets up the table elements based on the data passed in
        let tableSelect = d3.select('#table');
        
        // Stores table body selection
        let bodySelect = tableSelect.select('#tableBody');
        
        bodySelect.selectAll('tr').data(this.data).join('tr')
        .text(d => d);
    }

    
}
