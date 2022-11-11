class SatelliteTable{
    /*TODO this should be the more "search engine-y" portion of our visualization */

    /**
     * Constructor for SatelliteTable object
     * @param {*} data JSON object of data
     */
    constructor(data) {
        this.data = data;
        this.rowSvgWidth = 300;
        this.rowSvgHeight = 50;
        this.rowBarHeight = 40;
        
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
        cellSelect.filter(d => d.type === 'Use').text(d=>d.value === '' ? 'N/A' : d.value);
        cellSelect.filter(d => d.type ==='Orbit').text(d=>d.value === '' ? 'N/A' : d.value);
        

        let weightSelect = cellSelect.filter(d => d.type === 'LWeight');

        let svgSelect = weightSelect.selectAll('svg').data(d => [d])
        .join('svg')
        .attr('width',this.rowSvgWidht)
        .attr('height',this.rowSvgHeight);
        // Adding in rectangle elements
        this.addRectangles(svgSelect);
    }

    /**
     * Adds rectangles to the chart
     * @param {*} selection 
     */
    addRectangles(selection) {
        let xScale = d3.scaleLinear().domain([0, d3.max(this.data.map(d => d['Launch Mass (kg.)']))])
        .range([0, this.rowSvgWidth]);

        selection.selectAll('rect').data(d => d)
        .join('rect')
        .attr('x', xScale(0))
        .attr('y', 0)
        .attr('width', d => {console.log(d.value); return xScale(d.value)})
        .attr('height', 40)
        .attr('fill', 'black');
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

        let LWeight = {
            type: 'LWeight',
            value: d['Launch Mass (kg.)']
        };

        let dataList = [name, origin, use, orbit, LWeight];
        return dataList;
    }
    
}
