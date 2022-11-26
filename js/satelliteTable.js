class SatelliteTable{
    /*TODO this should be the more "search engine-y" portion of our visualization */

    /**
     * Constructor for SatelliteTable object
     * @param {*} data JSON object of data
     */
    constructor(global_state) {
        console.log(globalState);
        let data = global_state.satelliteData;
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
                key: 'Name of Satellite, Alternate Names',
                id: 'SatName'
            },
            {
                sorted: false,
                ascending: false,
                key: 'Country of Operator/Owner',
                id: 'Country'
            },
            {
                sorted: false,
                ascending: false,
                key: 'Contractor',
                id: 'Contractor'
            },
            {
                sorted: false,
                ascending: false,
                key: 'Purpose',
                id: 'Use'
            },
            {
                sorted: false,
                ascending: false,
                key: 'Type of Orbit',
                id: 'Orbit'
            },
            {
                sorted: false,
                ascending: false,
                key: 'Launch Mass (kg.)',
                id: 'LaunchMass'
            },
            {
                sorted: false,
                ascending: false,
                key: 'Expected Lifetime (yrs.)',
                id: 'Lifetime'
            },
            {
                sorted: false,
                ascending: false,
                key: 'Launch Site',
                id: 'LaunchSite'
            },
            {
                sorted: false,
                ascending: false,
                key: 'Launch Vehicle',
                id: 'LaunchVehicle'
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
        d3.select('#Country').on('change', event => this.update(event));
        d3.select('#Use').on('change', event => this.update(event));
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
            }});

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
        //Filters data for selections
        // d3.select('#groupButtons')
        //     .selectAll('td')
        //     .data(this.headerData)
        //     .text('group')
        //     .on('click', (event, d) => 
        //     {
        //         if(d.key === 'Country of Operator/Owner') {
        //             this.global_state.group = this.originalData.filter(n => n[d.key] === 'USA');
        //         }
        //         else {
        //             this.global_state.group = [];
        //         }
        //         updateAllGroup();
        //         // this.buildTable();
        //         // this.updateRows();
        //     });

        d3.select('#groupButtons')
        .selectAll('td')
        .data(this.headerData)
        .attr('id', d => d.key)
        .append('select')
        .attr('id', d => d.id);
        let that = this;




        //document.querySelector('#Country').addEventListener('change', console.log("this ran"));
        // console.log(that);
        this.addFilters();



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
     * Takes in a JSON object and translates it into separate containers 
     * for each cell
     * @param {*} d 
     * @returns 
     */
    rowToCellDataTransform(d) {

        /**
         * ********************************************
         * DATA TO ADD
         * ********************************************
         * 
         * 
         */
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
    }

    updateGroup() {
        this.buildTable();
        this.updateRows();
    }

    updateSelection() {
        this.updateRows();
    }

    addFilters() {
        let newData = [... new Set(this.data.map(d => d['Country of Operator/Owner']))];
        let nn = [...new Set(this.data.map(d=>d['Purpose']))];
        console.log(nn)

        let CountrySelect = d3.select('#Country');
        let PurposeSelect = d3.select('#Use');
        CountrySelect
        .selectAll('option')
        .data([...new Set(this.data.map(d => d['Country of Operator/Owner'] === '' ? 'All' : d['Country of Operator/Owner']))].sort())
        .join('option')
        .text(d=> d);

        PurposeSelect
        .selectAll('option')
        .data([...new Set(this.data.map(d => d['Purpose'] === '' ? 'All' : d['Purpose']))].sort())
        .join('option')
        .text(d=> d);
    }

    update(event) {
        console.log(event);
        /*
            Work this out so it can filter multiple selections together
        */
        // let country = d3.select('#Country').property('value');
        // let purpose = d3.select('#Use').property('value');
        let filter = d3.select(`#${event.path[0].__data__.id}`).property('value');

        // if(purpose === '') {
        //     purpose === 'All';
        // }
        // if(purpose === 'All') {
        //     // Old code
        //     // globalState.group = [];
        //     globalState.group = globalState.satelliteData;
        // }
        // else {
        //     // Old code
        //     // globalState.group = globalState.satelliteData.filter(d => d['Purpose'] === purpose);
        //     globalState.group = globalState.group.filter(d => d['Purpose'] === purpose);
        // }

        if(filter === '') {
            filter = 'All';
        }
        //console.log(table);
        console.log(filter);


        if(filter === 'All') {
            //console.log(table.global_state);

            // Old code
            // globalState.group = [];

            globalState.group = [];
        }
        else {
            //console.log(table);
            // Old code
            // globalState.group = globalState.satelliteData.filter(d => d['Country of Operation/Owner'] === country);
            globalState.group = globalState.satelliteData.filter(d => d[`${event.path[1].__data__.key}`] === filter);
        }
        updateAllGroup();
    }
    
}
