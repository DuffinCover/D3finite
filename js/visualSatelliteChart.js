class VisualSatelliteChart{
    /*TODO this should be the place where we produce clever visualzations.  */
    //-MINE!

    constructor(global_state) {
        let data = global_state.satelliteData;

        this.global_state = global_state;

        /*this.max_rows = 300;*/

        //let satData = data.filter( (d,i) => i < 2000);
        let satData = data;
        this.vizWidth1 = 200;
        this.h_Margin = 5;
        this.v_Margin = 2;
        this.h_pad = 2;
        this.v_border = 3;
        this.headerHeight = 50;

        let c_size = satData.length;

        this.MIN_HEIGHT = 600 - 4;

        this.CHART_HEIGHT = c_size;
        this.CHART_WIDTH = 800;

        this.selection = null;
        this.min_sel_height = 20;

        //console.log('satchart subset', satData);

        let chart_top = d3.select('#chart-header').append('svg')
            .attr('width', this.CHART_WIDTH)
            .attr('height', this.headerHeight);

        let chart = d3.select('#chart-body')
        let VSC_svg = chart.append('svg')
            .attr('id','VSC_SVG')
            //.attr('class','scrollable2')
            .attr('width', this.CHART_WIDTH)
            .attr('height', this.CHART_HEIGHT)


        
        this.sat_columns = [
            {
                name: 'Expected Lifetime (yrs.)',
                scale: null,
                color: '#82d7d9'
            }, {
                name: 'Dry Mass (kg.)',
                scale: null,
                color: '#ebc48d'
            }, {
                name: 'Launch Mass (kg.)',
                scale: null,
                color: '#8d70ba'
            }, {
                name: 'Period (minutes)',
                scale: null,
                color: '#cf5f91'
            }];

        let top_cols = chart_top.selectAll('g')
            .data(this.sat_columns)
            .join('g')
            .attr('id', (d, i) => `top-${i}`);

        let cols = VSC_svg.selectAll('g')
            .data(this.sat_columns)
            .join('g')
            .attr('id', (d, i) => `col-${i}`);

        let headers = top_cols.append('g')
            .attr('id', 'vsc_header');

        headers.append('rect')
            .attr('x', (d, i) => i * this.vizWidth1)
            .attr('y', 0)
            .attr('width', this.vizWidth1 - this.h_Margin)
            .attr('height',this.headerHeight)
            .attr('fill', 'white')
            .attr('stroke-width', '1px')
            .attr('stroke', 'black')


        headers.append('text')
            .attr('x', (d, i) => (i + .5) * this.vizWidth1)
            .attr('y', 30)
            .text(d => d.name)
            .attr('text-anchor', 'middle')
            .attr('font-weight', 900)
            .style('font-size', '14px');

        let visuals = cols.append('g')
            .attr('id', 'vsc_visual');

        visuals.append('rect')
            .attr('x', (d, i) => i * this.vizWidth1)
            .attr('y', this.v_Margin)
            .attr('width', this.vizWidth1 - this.h_Margin)
            .attr('height', this.CHART_HEIGHT - (this.v_Margin))
            .attr('fill', 'white')
            .attr('stroke-width', '1px')
            .attr('stroke', 'black')

        let barContainer = visuals.append('g')
            .attr('id', 'bar-container');

        this.drawChart();
    }

    drawChart() {
        //let chart = this;
        let global_state = this.global_state;

        let data = global_state.satelliteData;

        this.max_rows = 300;

        let satData = data;

        if (global_state.group.length > 0) {
            satData = global_state.group;
        }

        satData = satData.filter((d, i) => i < 2001);

        

        let c_size = satData.length;
        if (c_size < this.MIN_HEIGHT) {
            c_size = this.MIN_HEIGHT;
        }

        let expand = c_size / satData.length;

        this.CHART_HEIGHT = c_size;

        let VSC_svg = d3.select('#VSC_SVG')
            .attr('height', this.CHART_HEIGHT);

        let cols = VSC_svg.selectAll('g');

        this.xScales = [];
        for (let col of this.sat_columns) {
            let max_val = d3.max(satData.map(d => d[col.name]));

            let scale = d3.scaleLinear()
                .domain([0, max_val])
                .range([this.v_border + this.h_pad, this.vizWidth1 - (this.h_Margin + this.v_border + this.h_pad)]);

            col.scale = scale;
        }

        this.yScale = d3.scaleLinear()
            .domain([0, satData.length])
            .range([this.v_Margin + this.v_border, this.CHART_HEIGHT - this.v_border]);


        let sel_height = 0;
        let sel_adjust = 0;

        if (this.min_sel_height > expand) {
            sel_height = this.min_sel_height;
            sel_adjust = sel_height - expand;
        } else {
            sel_height = expand;
        }
        //let sel_height = this.min_sel_height > expand ? this.min_sel_height : expand;


        this.alt_yScale = d3.scaleLinear()
            .domain([0, satData.length])
            .range([this.v_Margin + this.v_border, this.CHART_HEIGHT - (this.v_border + sel_adjust)]);




        let visuals = cols.select('#vsc_visual');

        visuals.selectAll('rect')
            .attr('height', this.CHART_HEIGHT - (this.v_Margin));

        let barContainer = visuals.select('#bar-container');


        let selection = globalState.selection;

        let sel_finder = satData.map((d, i) => [d['Name of Satellite, Alternate Names'], i]).filter((d, i) => selection.includes(d[0]));

        



        //Draw the bars:
        

        if (sel_finder.length > 0) {
            console.log(sel_finder);

            let sel_idx = sel_finder[0][1];
            console.log(sel_idx);
            let bars = barContainer.selectAll('rect')
                .data((d, i) => {
                    let output = satData.map(n => {
                        return [n[d.name], i]
                    });
                    //console.log(output);
                    return output;
                })
                .join('rect')
                .attr('x', (d) => (d[1] * this.vizWidth1) + this.h_pad)
                .attr('y', (d, i) => (i > sel_idx) ? this.alt_yScale(i) + sel_adjust : this.alt_yScale(i))
                .attr('width', d => this.sat_columns[d[1]].scale(d[0]))
                .attr('height', expand)
                .attr('fill', d => this.sat_columns[d[1]].color)
                .attr('stroke-width', '0px')


            let highlight = bars.filter((d, i) => i === sel_idx)
                .attr('height', sel_height - 2)
                .attr('y', this.alt_yScale(sel_idx) + 1)
                .attr('stroke-width', '1px')
                .attr('stroke', 'black')
            


                //.attr('stroke', 'black')
        } else {

            let bars = barContainer.selectAll('rect')
                .data((d, i) => {
                    let output = satData.map(n => {
                        return [n[d.name], i]
                    });
                    //console.log(output);
                    return output;
                })
                .join('rect')
                .attr('x', (d) => (d[1] * this.vizWidth1) + this.h_pad)
                .attr('y', (d, i) => this.yScale(i))
                .attr('width', d => this.sat_columns[d[1]].scale(d[0]))
                .attr('height', expand)
                .attr('fill', d => this.sat_columns[d[1]].color)
                .attr('stroke-width', '0px')
                //.attr('stroke', 'black')

        }

    }

    updateGroup() {
        this.drawChart();
    }

    updateSelection() {
        this.drawChart();
    }

}