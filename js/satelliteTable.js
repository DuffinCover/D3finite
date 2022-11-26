class SatelliteTable{
    /*TODO this should be the more "search engine-y" portion of our visualization */

    /**
     * Constructor for SatelliteTable object
     * @param {*} data JSON object of data
     */
    constructor(global_state) {
        let data = global_state.sampleSatellites;
        this.global_state = global_state;
        this.selectedRows = [];
        this.originalData = data;
        this.data = data;
        this.rowSvgWidth = 300;
        this.rowSvgHeight = 50;
        this.rowBarHeight = 40;

        this.headerData = [
            {
                sorted: false,
                ascending: false,
                key: 'Name of Satellite, Alternate Names'
            },
            {
                sorted: false,
                ascending: false,
                key: 'Country of Operator/Owner',
            },
            {
                sorted: false,
                ascending: false,
                key: 'Contractor'
            },
            {
                sorted: false,
                ascending: false,
                key: 'Purpose'
            },
            {
                sorted: false,
                ascending: false,
                key: 'Type of Orbit'
            },
            {
                sorted: false,
                ascending: false,
                key: 'Launch Mass (kg.)',
            },
            {
                sorted: false,
                ascending: false,
                key: 'Expected Lifetime (yrs.)'
            },
            {
                sorted: false,
                ascending: false,
                key: 'Launch Site'
            },
            {
                sorted: false,
                ascending: false,
                key: 'Launch Vehicle'
            }
        ]
        

        // let lifeSvg = lifeSelect.selectAll('svg').data(d => [d])
        // .join('svg')
        // .attr('width', this.rowSvgWidth)
        // .attr('height', this.rowSvgHeight);

        // let svgSelect = weightSelect.selectAll('svg').data(d => [d])
        // .join('svg')
        // .attr('width',this.rowSvgWidht)
        // .attr('height',this.rowSvgHeight);
        // Adding in rectangle elements
        this.buildTable();
        this.attachSortHandlers();
        // this.addRectangles(lifeSvg);
        // this.addRectangles(svgSelect);
    }

    /**
     * Fills in all cells in the table
     */
    buildTable() {
        // Sets data based on global state grouping
        if(this.global_state.group.length > 0) {
            this.data = this.global_state.group;
        }
        else {
            this.data = this.originalData;
        }
        // Stores table body selection and appends table rows
        let rowSelection = d3.select('#tableBody')
        .selectAll('tr')
        .data(this.data)
        .join('tr')
        .classed('unselectedTable', true);

        // Adding even handler to each row ---- Should change background when selected
        rowSelection.on('click', (event, d) => {
            // If the row is not in the selected rows, add it, else remove it
            if (this.global_state.selection.includes(d['Name of Satellite, Alternate Names'])) {
                this.global_state.selection = this.global_state.selection.filter((el) => el !== d['Name of Satellite, Alternate Names']);
                updateAllSelection();
            } else {
                if(this.global_state.selection.length > 0) {
                    this.global_state.selection = [];
                }
                this.global_state.selection.push(d['Name of Satellite, Alternate Names']);
                updateAllSelection();
            }
        });



        // Stores individual cell selections
        let cellSelect = rowSelection.selectAll('td')
        .data(this.rowToCellDataTransform)
        .join('td');

        // Adding in cell values
        cellSelect.filter(d => d.type === 'Name').text(d => d.value === '' ? 'Unknown' : d.value);
        cellSelect.filter(d => d.type === 'OriginCountry').text(d=>d.value === '' ? 'Unknown' : d.value);
        cellSelect.filter(d => d.type ==='Contractor').text(d => d.value === '' ? 'Unknown' : d.value);
        cellSelect.filter(d => d.type === 'Use').text(d=>d.value === '' ? 'N/A' : d.value);
        cellSelect.filter(d => d.type ==='Orbit').text(d=>d.value === '' ? 'N/A' : d.value);
        cellSelect.filter(d => d.type === 'LWeight').text(d=>d.value === '' ? 'N/A' : d.value);
        cellSelect.filter(d => d.type ==='Lifetime').text(d=>d.value === '' ? 'N/A' : d.value);
        cellSelect.filter(d => d.type === 'LaunchSite').text(d => d.value === '' ? 'Unknown' : d.value);
        cellSelect.filter(d => d.type === 'LaunchVehicle').text(d => d.value === '' ? 'Unknown' : d.value);
    }

    /**
     * Attaches sort handlers for each column in the table. Will sort alphabetically
     * or numerically depending on data type
     */
    attachSortHandlers() 
    {
        // Filters data for selections
        d3.select('#groupButtons')
            .selectAll('td')
            .data(this.headerData)
            .text('group')
            .on('click', (event, d) => 
            {
                if(d.key === 'Country of Operator/Owner') {
                    this.global_state.group = this.originalData.filter(n => n[d.key] === 'USA');
                }
                else {
                    this.global_state.group = [];
                }
                updateAllGroup();
                // this.buildTable();
                // this.updateRows();
            });

        d3.select('#columnHeaders')
            .selectAll('th')
            .data(this.headerData)
            .on('click', (event, d) => 
            {

                const sortAscending = d.sorted ? !d.ascending : true; // sort ascending by default, otherwise flip it.
                this.sortData(d.key, sortAscending, d.alterFunc);
                // reset state
                for (let header of this.headerData)
                {
                    header.sorted = false;
                }
                // set new state for this node
                d.sorted = true;
                d.ascending = sortAscending;
                this.buildTable();
                this.updateRows();
            });
    }

    /**
     * Adds rectangles to the chart
     * @param {*} selection 
     */
    addRectangles(selection) {
        let xScale = d3.scaleLinear().domain([0, d3.max(this.data.map(d => d['Launch Mass (kg.)']))])
        .range([0, this.rowSvgWidth]);

        selection.selectAll('rect').data(d => d)
        .enter('rect')
        .append('rect')
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

        let contractor = {
            type: 'Contractor',
            value: d['Contractor']
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

        let lifetime = {
            type: 'Lifetime',
            value: d['Expected Lifetime (yrs.)']
        };

        let launchSite = {
            type: 'LaunchSite',
            value: d['Launch Site']
        };

        let launchVehicle = {
            type: 'LaunchVehicle',
            value: d['Launch Vehicle']
        };

        let dataList = [name, origin, contractor, use, orbit, LWeight, lifetime, launchSite, launchVehicle];
        return dataList;
    }


    /**
     * Updates the row selection
     */
    updateRows() {
        let rowSelection = d3.select('#tableBody')
        .selectAll('tr')
        .data(this.data)
        .join('tr')
        .classed('selectedTable', true);

        rowSelection.classed('selectedTable', (d) => this.global_state.selection.includes(d['Name of Satellite, Alternate Names']));
        rowSelection.classed('unselectedTable', (d) => !this.global_state.selection.includes(d['Name of Satellite, Alternate Names']))
    }

    /**
     * Sorts data either alphabetically, or numerically
     * @param {*} key 
     * @param {*} ascend 
     * @param {*} alterFunc 
     */
    sortData(key, ascend, alterFunc)
    {
        this.data.sort((a, b) =>
            {
                let sortKey = key;
                let x = a[sortKey];
                let y = b[sortKey];
                

                if (!ascend)
                {
                    [x, y] = [y, x] // swap variables
                }
                if (alterFunc)
                {
                    x = alterFunc(x);
                    y = alterFunc(y);
                }
                if (x < y)
                {
                    return -1
                }
                else if (x > y)
                {
                    return 1
                }
                return 0;
            }
        );

        this.global_state.satelliteData = this.data;
        updateSort();
    }

    updateGroup() {
        this.buildTable();
        this.updateRows();
    }

    updateSelection() {
        this.updateRows();
    }
    
}
