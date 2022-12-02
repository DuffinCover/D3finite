class SatelliteTable{
    /*TODO this should be the more "search engine-y" portion of our visualization */

    /**
     * Constructor for SatelliteTable object
     * @param {*} data JSON object of data
     */
    constructor(global_state) {
        /**
         * *************************************
         * Make it so you can do two selections
         * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
         * *************************************
         */
        //console.log(globalState);
        let data = global_state.satelliteData;
        this.global_state = global_state;
        this.selectedRows = [];
        this.originalData = globalState.satelliteData;
        this.data = data;
        this.rowSvgWidth = 300;
        this.rowSvgHeight = 50;
        this.rowBarHeight = 40;
        this.dropdownData = [
            {
                name: 'Country of Operator/Owner',
                filtered: false,
                clicks: 0
            },
            {
                name: 'Purpose',
                filtered: false,
                clicks: 0
            },
            {
                name: 'Type of Orbit',
                filtered: false,
                clicks: 0
            },
            {
                name: 'Launch Site',
                filtered: false,
                clicks: 0
            }, 
            {
                name: 'Launch Vehicle',
                filtered: false,
                clicks: 0
            }
        ];

        this.headerData = [
            {
                sorted: false,
                ascending: false,
                key: 'Name of Satellite, Alternate Names',
                id: 'SatName',
                drop: 'DropS'
            },
            {
                sorted: false,
                ascending: false,
                key: 'Country of Operator/Owner',
                id: 'Country',
                drop: 'DropCountry'
            },
            {
                sorted: false,
                ascending: false,
                key: 'Contractor',
                id: 'Contractor',
                drop: 'DropContractor'
            },
            {
                sorted: false,
                ascending: false,
                key: 'Purpose',
                id: 'Use',
                drop: 'DropUse'
            },
            {
                sorted: false,
                ascending: false,
                key: 'Type of Orbit',
                id: 'Orbit',
                drop: 'DropOrbit'
            },
            {
                sorted: false,
                ascending: false,
                key: 'Launch Mass (kg.)',
                id: 'LaunchMass',
                drop: 'DropLMass'
            },
            {
                sorted: false,
                ascending: false,
                key: 'Expected Lifetime (yrs.)',
                id: 'Lifetime',
                drop: 'DropLifetime'
            },
            {
                sorted: false,
                ascending: false,
                key: 'Launch Site',
                id: 'LaunchSite',
                drop: 'DropSite'
            },
            {
                sorted: false,
                ascending: false,
                key: 'Launch Vehicle',
                id: 'LaunchVehicle',
                drop: 'DropVehicle'
            },
            {
                sorted: false,
                ascending: false,
                key: 'Dry Mass (kg.)',
                id: 'DryMass',
                drop: 'DropMass'
            },
            {
                sorted: false,
                ascending: false,
                key: 'Period (degrees)',
                id: 'Period',
                drop: 'DropPeriod'
            },
            {
                sorted: false,
                ascending: false,
                key: 'Inclination (degrees)',
                id: 'Inclination',
                drop: 'DropInclination'
            },
            {
                sorted: false,
                ascending: false,
                key: 'Launch Date',
                id: 'LaunchDate',
                drop: 'DropDate'
            }
        ]
        
        // Adding in rectangle elements
        this.buildTable();
        this.attachSortHandlers();
        /**
         * **************************
         * FIX THIS
         * **************************
         */
        d3.select('#Country').on('change', event => this.update(event)).on('click', event => this.dropDownUpdate(event));
        d3.select('#Use').on('change', event => this.update(event)).on('click', event => this.dropDownUpdate(event));
        d3.select('#Orbit').on('change', event => this.update(event)).on('click', event => this.dropDownUpdate(event));
        d3.select('#LaunchSite').on('change', event => this.update(event)).on('click', event => this.dropDownUpdate(event));
        d3.select('#LaunchVehicle').on('change', event => this.update(event)).on('click', event => this.dropDownUpdate(event));
    }

    /**
     * Fills in all cells in the table
     */
    buildTable() {
        // Sets data based on global state grouping
        // if(globalState.group.length > 0) {
        //     this.data = globalState.group;
        // }
        // else {
        //     this.data = globalState.satelliteData;
        // }
        this.data = applyGrouping();
        if(this.data.length === 0) {
            this.data = this.originalData;
        }
        // console.log(applyGrouping());
        // //console.log(this.data);
        // Stores table body selection and appends table rows
        let rowSelection = d3.select('#tableBody')
        .selectAll('tr')
        .data(this.data)
        .join('tr')
        .classed('unselectedTable', true);

        // Adding even handler to each row ---- Should change background when selected
        rowSelection.on('click', (event, d) => {
            // If the row is not in the selected rows, add it, else remove it
            if (globalState.selection.includes(d['Name of Satellite, Alternate Names'])) {
                globalState.selection = globalState.selection.filter((el) => el !== d['Name of Satellite, Alternate Names']);
                updateAllSelection();
            } else {
                if(globalState.selection.length > 0) {
                    globalState.selection = [];
                }
                globalState.selection.push(d['Name of Satellite, Alternate Names']);
                updateAllSelection();
            }
        });



        // Stores individual cell selections
        let cellSelect = rowSelection.selectAll('td')
        .data(this.rowToCellDataTransform)
        .join('td').attr('class', 'tableRow');

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
        
        cellSelect.filter(d => d.type === 'DryMass').text(d=>d.value === '' ? 'N/A' : d.value);
        cellSelect.filter(d => d.type === 'Period').text(d=>d.value === '' ? 'N/A' : d.value);
        cellSelect.filter(d => d.type === 'Inclination').text(d=>d.value === '' ? 'N/A' : d.value);
        cellSelect.filter(d => d.type === 'LaunchDate').text(d=>d.value ? 'N/A' : d.value);
    }

    /**
     * Attaches sort handlers for each column in the table. Will sort alphabetically
     * or numerically depending on data type
     */
    attachSortHandlers() 
    {

        /**
         * ***************************
         * FIX THIS
         * ***************************
         */
        d3.select('#FilterReset').on('click', event => {
            for (let [key, value] of globlaState.group.entries()) {
                globalState.group[key] = null;
            }; 
            updateAllGroup()});
        

        const dropData = this.dropdownData.map(d => d.name);
        for(let index in this.headerData) {
            let item = this.headerData[index];
            if(dropData.includes(item.key)){
                d3.select(`#${item.drop}`)
                .attr('id', item.key)
                .append('select')
                .attr('id', item.id);
            }
        }
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
         * Dry Mass
         * Period
         * Inclination
         * Date of Launch
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
        
        let dryMass = {
            type: 'DryMass',
            value: d['Dry Mass (kg.)']
        };

        let period = {
            type: 'Period',
            value: d['Period (minutes)']
        };

        let inclination = {
            type: 'Inclination',
            value: d['Inclination (degrees)']
        };

        let launchDate = {
            type: 'LaunchDate',
            value: d['Date of Launch']
        };

        let dataList = [name, origin, contractor, use, orbit, LWeight, lifetime, launchSite, launchVehicle, dryMass, period, inclination, launchDate];
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

        rowSelection.classed('selectedTable', (d) => globalState.selection.includes(d['Name of Satellite, Alternate Names']));
        rowSelection.classed('unselectedTable', (d) => !globalState.selection.includes(d['Name of Satellite, Alternate Names']))
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

        globalState.satelliteData = this.data;
        updateSort();
    }

    updateGroup() {
        
        this.buildTable();
        this.updateRows();
        this.attachSortHandlers();
    }

    updateSelection() {
        this.updateRows();
    }

    /**
     * Adding in the dropdown menu filters
     */
    addFilters() {

        /**
         * **********************************
         * Add on click that checks if col is already filtered
         * and reset if it has, otherwise allow the dropdown
         * **********************************
         */
        let newData = [... new Set(this.data.map(d => d['Country of Operator/Owner']))];
        let nn = [...new Set(this.data.map(d=>d['Purpose']))];
        //console.log(nn)

        let CountrySelect = d3.select('#Country');
        let PurposeSelect = d3.select('#Use');
        let OrbitSelect = d3.select('#Orbit');
        let LaunchSselect = d3.select('#LaunchSite');
        let LaunchVSelect = d3.select('#LaunchVehicle');

        
        CountrySelect
        .selectAll('option')
        .data([...new Set(this.data.map(d => d['Country of Operator/Owner'] === '' ? 'Unknown' : d['Country of Operator/Owner']))].sort())
        .join('option')
        .text(d=> d);

        PurposeSelect
        .selectAll('option')
        .data([...new Set(this.data.map(d => d['Purpose'] === '' ? 'Unknown' : d['Purpose']))].sort())
        .join('option')
        .text(d=> d);

        OrbitSelect
        .selectAll('option')
        .data([...new Set(this.data.map(d => d['Type of Orbit'] === '' ? 'Unknown' : d['Type of Orbit']))].sort())
        .join('option')
        .text(d=> d);

        LaunchSselect
        .selectAll('option')
        .data([...new Set(this.data.map(d => d['Launch Site'] === '' ? 'Unknown' : d['Launch Site']))].sort())
        .join('option')
        .text(d=> d);

        LaunchVSelect
        .selectAll('option')
        .data([...new Set(this.data.map(d => d['Launch Vehicle'] === '' ? 'Unknown' : d['Launch Vehicle']))].sort())
        .join('option')
        .text(d=> d);

    }

    update(event) {
        /*
            Work this out so it can filter multiple selections together
            Need to have filters for Orbit and Launch Site?
        */
        //console.log(event);
        let filter = d3.select(`#${event.path[0].id}`).property('value');
        //console.log(filter);
        let tempKey = event.path[1].id;
        //console.log(tempKey);
        //console.log(filter);
        

        for(let g of globalState.group) {
            if(g[0] === tempKey) {
                if(filter === 'All') {
                    g[1] = null;
                }
                else {
                    g[1] = filter;
                    
                }
            }
        }

        for(let el of this.dropdownData) {
            if(el.name === tempKey) {
                el.filtered = true;
            }
        }
        updateAllGroup();
    }

    dropDownUpdate(event) {
        let key = event.path[1].id;
        for(let el of this.dropdownData) {
            //console.log(el);
            if(el.name === key) {
                if(el.filtered) {
                    if(el.clicks > 0) {
                        this.resetFilter(key);
                        el.clicks = 0;
                    }
                    else{
                        console.log(el.clicks)
                        el.clicks = el.clicks + 1;
                    }
                }
            }
        }
    }

    resetFilter(key) {

        for(let g of globalState.group) {
            if(g[0] === key) {
                g[1] = null;
            }
        }
        updateAllGroup();
    }
    
}
