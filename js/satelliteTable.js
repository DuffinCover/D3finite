class SatelliteTable{
    /*TODO this should be the more "search engine-y" portion of our visualization */

    /**
     * Constructor for SatelliteTable object
     * @param {*} data JSON object of data
     */
    constructor(global_state) {
        let data = global_state.satelliteData;
        this.global_state = global_state;
        this.selectedRows = [];
        this.originalData = globalState.satelliteData;
        this.data = data;
        // Information for the dropdown menus
        this.dropdownData = [
            {
                name: 'Country of Operator/Owner',
                filtered: false,
                clicks: 0,
                filterElement: null
            },
            {
                name: 'Purpose',
                filtered: false,
                clicks: 0,
                filterElement: null
            },
            {
                name: 'Type of Orbit',
                filtered: false,
                clicks: 0,
                filterElement: null
            },
            {
                name: 'Launch Site',
                filtered: false,
                clicks: 0,
                filterElement: null
            }, 
            {
                name: 'Launch Vehicle',
                filtered: false,
                clicks: 0,
                filterElement: null
            }
        ];

        // Information for the column headers on the table
        this.headerData = [
            {
                sorted: false,
                ascending: false,
                key: 'Name of Satellite, Alternate Names',
                id: 'SatName',
                drop: 'DropS',
                alterFunc: null
            },
            {
                sorted: false,
                ascending: false,
                key: 'Country of Operator/Owner',
                id: 'Country',
                drop: 'DropCountry',
                alterFunc: null
            },
            {
                sorted: false,
                ascending: false,
                key: 'Contractor',
                id: 'Contractor',
                drop: 'DropContractor',
                alterFunc: null
            },
            {
                sorted: false,
                ascending: false,
                key: 'Purpose',
                id: 'Use',
                drop: 'DropUse',
                alterFunc: null
            },
            {
                sorted: false,
                ascending: false,
                key: 'Type of Orbit',
                id: 'Orbit',
                drop: 'DropOrbit',
                alterFunc: null
            },
            {
                sorted: false,
                ascending: false,
                key: 'Launch Mass (kg.)',
                id: 'LaunchMass',
                drop: 'DropLMass',
                alterFunc: null
            },
            {
                sorted: false,
                ascending: false,
                key: 'Expected Lifetime (yrs.)',
                id: 'Lifetime',
                drop: 'DropLifetime',
                alterFunc: null
            },
            {
                sorted: false,
                ascending: false,
                key: 'Launch Site',
                id: 'LaunchSite',
                drop: 'DropSite',
                alterFunc: null
            },
            {
                sorted: false,
                ascending: false,
                key: 'Launch Vehicle',
                id: 'LaunchVehicle',
                drop: 'DropVehicle',
                alterFunc: null
            },
            {
                sorted: false,
                ascending: false,
                key: 'Dry Mass (kg.)',
                id: 'DryMass',
                drop: 'DropMass',
                alterFunc: null
            },
            {
                sorted: false,
                ascending: false,
                key: 'Period (minutes)',
                id: 'Period',
                drop: 'DropPeriod',
                alterFunc: null
            },
            {
                sorted: false,
                ascending: false,
                key: 'Inclination (degrees)',
                id: 'Inclination',
                drop: 'DropInclination',
                alterFunc: null
            },
            {
                sorted: false,
                ascending: false,
                key: 'Date of Launch',
                id: 'LaunchDate',
                drop: 'DropDate',
                alterFunc: d => new Date(d)
            }
        ]
        
        // Adding in rectangle elements
        this.buildTable();
        this.attachSortHandlers();

        // Attaching update handlers to the dropdown menus
        // Must be done after the table is already built
        d3.select('#Country').on('change', event => this.update(event));
        d3.select('#Use').on('change', event => this.update(event));
        d3.select('#Orbit').on('change', event => this.update(event));
        d3.select('#LaunchSite').on('change', event => this.update(event));
        d3.select('#LaunchVehicle').on('change', event => this.update(event));
    }

    /**
     * Fills in all cells in the table
     */
    buildTable() {
        // Retrieves the current filtered grouping from the global state
        this.data = applyGrouping();
        if(this.data.length === 0) {
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
            if (globalState.selection.includes(d['Name of Satellite, Alternate Names'])) {
                globalState.selection = globalState.selection.filter((el) => el !== d['Name of Satellite, Alternate Names']);
                updateAllSelection();
            } else {
                // If there are 2 items selected then remove the first
                if(globalState.selection.length > 1) {
                    globalState.selection = globalState.selection.splice(1);
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
        // This is a date object instead of a text element
        cellSelect.filter(d => d.type === 'LaunchDate').text(d=>d.value === '' ? 'N/A' : new Date(d.value).toLocaleString().split(',')[0]);
    }

    /**
     * Attaches sort handlers for each column in the table. Will sort alphabetically
     * or numerically depending on data type
     */
    attachSortHandlers() 
    {
        // Attaching on click handler for the reset button
        d3.select('#FilterReset').on('click', event => this.resetFilters());
        
        // Attaches a dropdown menu to the appropriate columns of the table
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


        // Attaches a a sort handler for each column in the table
        d3.select('#columnHeaders')
            .selectAll('th')
            .data(this.headerData)
            .on('click', (event, d) => 
            {
                // Sort ascending by default, otherwise flip it
                const sortAscending = d.sorted ? !d.ascending : true;
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
                updateSort();
            });
    }


    /**
     * Takes in a JSON object and translates it into separate containers 
     * for each cell
     * @param {*} d 
     * @returns 
     */
    rowToCellDataTransform(d) {
        // Creating data groupings
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
        // Builds rows in the table, appending the selected class by default
        let rowSelection = d3.select('#tableBody')
        .selectAll('tr')
        .data(this.data)
        .join('tr')
        .classed('selectedTable', true);
        // If a row is selected highlight it, otherwise do not highlight it
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
        // Sorting data by key
        this.data.sort((a, b) =>
            {
                let sortKey = key;
                let x = a[sortKey];
                let y = b[sortKey];
                
                // Reverse the sort
                if (!ascend)
                {
                    [x, y] = [y, x]
                }
                // If this is a datetime object, use the alternative sorting
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
        // Send this data to the global state
        globalState.satelliteData = this.data;
        updateSort();
    }

    /**
     * Updates the table to show the data with a filter applied
     */
    updateGroup(reset) {
        if(reset) { 
            this.resetFilters();
        }
        this.buildTable();
        this.updateRows();
        this.attachSortHandlers();
    }

    /**
     * Updates the list of selected elements based on user input
     */
    updateSelection() {
        this.updateRows();
    }

    /**
     * Adds in the dropdown menu items based on current filtering
     */
    addFilters() {
        // Selecting dropdown elements
        let CountrySelect = d3.select('#Country');
        let PurposeSelect = d3.select('#Use');
        let OrbitSelect = d3.select('#Orbit');
        let LaunchSselect = d3.select('#LaunchSite');
        let LaunchVSelect = d3.select('#LaunchVehicle');

        // Create a set of values to be used in the dropdown menu
        let CountryData = [...new Set(this.data.map(d => d['Country of Operator/Owner'] === '' ? 'Unknown' : d['Country of Operator/Owner'])), '', ' All'].sort();
        let PurposeData = [...new Set(this.data.map(d => d['Purpose'] === '' ? 'Unknown' : d['Purpose'])), '', ' All'].sort();
        let OrbitData = [...new Set(this.data.map(d => d['Type of Orbit'] === '' ? 'Unknown' : d['Type of Orbit'])), '', ' All'].sort();
        let LaunchSData = [...new Set(this.data.map(d => d['Launch Site'] === '' ? 'Unknown' : d['Launch Site'])), '', ' All'].sort();
        let LaunchVData = [...new Set(this.data.map(d => d['Launch Vehicle'] === '' ? 'Unknown' : d['Launch Vehicle'])), '', ' All'].sort();

        // If the data is filterd, set the dropdown menu to only display the selected filter and an 'all' element
        if(this.dropdownData.find(el => el.name === 'Country of Operator/Owner').filtered){
            let value = this.dropdownData.find(el => el.name === 'Country of Operator/Owner').filterElement;
            CountryData = [value, ' All'];
        }
        if(this.dropdownData.find(el => el.name === 'Purpose').filtered){
            let value = this.dropdownData.find(el => el.name === 'Purpose').filterElement;
            PurposeData = [value, ' All'];
        }
        if(this.dropdownData.find(el => el.name === 'Type of Orbit').filtered){
            let value = this.dropdownData.find(el => el.name === 'Type of Orbit').filterElement;
            OrbitData = [value, ' All'];
        }
        if(this.dropdownData.find(el => el.name === 'Launch Site').filtered){
            let value = this.dropdownData.find(el => el.name === 'Launch Site').filterElement;
            LaunchSData = [value, ' All'];
        }
        if(this.dropdownData.find(el => el.name === 'Launch Vehicle').filtered){
            let value = this.dropdownData.find(el => el.name === 'Launch Vehicle').filterElement;
            LaunchVData = [value, ' All'];
        }
        

        // Updating the options in the dropdown menu
        CountrySelect
        .selectAll('option')
        .data(CountryData)
        .join('option')
        .text(d=>d);

        PurposeSelect
        .selectAll('option')
        .data(PurposeData)
        .join('option')
        .text(d=> d);

        OrbitSelect
        .selectAll('option')
        .data(OrbitData)
        .join('option')
        .text(d=> d);

        LaunchSselect
        .selectAll('option')
        .data(LaunchSData)
        .join('option')
        .text(d=> d);

        LaunchVSelect
        .selectAll('option')
        .data(LaunchVData)
        .join('option')
        .text(d=> d);

    }

    /**
     * Updates the global and local filtering meta data
     * @param {*} event 
     */
    update(event) {
        // pulling the element we want to filter by and which column it is in
        let filter = d3.select(`#${event.path[0].id}`).property('value');
        let tempKey = event.path[1].id;
        
        // Setting the filter in the global state so each view knows what filter to use
        for(let g of globalState.group) {
            if(g[0] === tempKey) {
                if(filter === 'All' || filter === ' All') {
                    g[1] = null;
                }
                else {
                    g[1] = filter;                   
                }
            }
        }

        // Setting meta data for filtering in the local scope
        for(let el of this.dropdownData) {
            if(el.name === tempKey) {
                if(filter === 'All') {
                    el.filtered = false;
                    el.filterElement = null;
                }
                else {
                    el.filtered = true;
                    el.filterElement = filter;
                }
            }
        }
        updateAllGroup();
    }

    /**
     * Resets all dropdown menus
     */
    resetFilters() {
        for (let el of globalState.group) {
            el[1] = null;
        };
        for(let el of this.dropdownData) {
            el.filtered = false;
            el.filterElement = null;
        }
        updateAllGroup();
        this.addFilters();
    }
    
}
