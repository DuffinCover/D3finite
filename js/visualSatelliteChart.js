class VisualSatelliteChart{
    /*TODO this should be the place where we produce clever visualzations.  */
    //-MINE!
<<<<<<< Updated upstream
=======
    constructor(global_state) {
        let data = global_state.satelliteData;
        this.max_rows = 300;

        let satData = data.filter( (d,i) => i < 300);
        this.vizWidth1 = 150;
        this.h_Margin = 5;
        this.v_Margin = 5;
        this.v_border = 3;
        this.headerHeight = 50;


        this.CHART_HEIGHT = 600;
        this.CHART_WIDTH = 600;

        this.selection = null;
        this.sel_height = 20;

        //console.log('satchart subset', satData);

        let chart = d3.select('#chart')
        let VSC_svg = chart.append('svg')
            .attr('width', this.CHART_WIDTH)
            .attr('height', this.CHART_HEIGHT)


        
        let sat_columns = [
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

        let cols = VSC_svg.selectAll('g')
            .data(sat_columns)
            .join('g')
            .attr('id', (d, i) => `col-${i}`);

        let headers = cols.append('g')
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

        this.xScales = [];
        for (let col of sat_columns) {
            let max_val = d3.max(satData.map(d => d[col.name]));

            let scale = d3.scaleLinear()
                .domain([0, max_val])
                .range([this.v_border, this.vizWidth1 - (this.h_Margin+ this.v_border)]);

            col.scale = scale;
        }

        this.yScale = d3.scaleLinear()
            .domain([0, satData.length])
            .range([this.headerHeight + this.v_Margin + this.v_border, this.CHART_HEIGHT - this.v_border]);

        this.top_yScale = d3.scaleLinear()
            .domain([0, satData.length])
            .range([this.headerHeight + this.v_Margin + this.v_border, this.CHART_HEIGHT - this.v_border]);

        let visuals = cols.append('g')
            .attr('id', 'vsc_visual');

        visuals.append('rect')
            .attr('x', (d, i) => i * this.vizWidth1)
            .attr('y', this.headerHeight + this.v_Margin)
            .attr('width', this.vizWidth1 - this.h_Margin)
            .attr('height', this.CHART_HEIGHT - (this.headerHeight + this.v_Margin))
            .attr('fill', 'white')
            .attr('stroke-width', '1px')
            .attr('stroke', 'black')
            
        let barContainer = visuals.append('g')
            .attr('id', 'bar-container');

        let bars = barContainer.selectAll('rect')
            .data((d,i) => {
                let output = satData.map(n => {
                    return [n[d.name], i]
                });
                //console.log(output);
                return output;
            })
            .join('rect')
            .attr('x', (d) => d[1] * this.vizWidth1)
            .attr('y', (d,i) => this.yScale(i))
            .attr('width', d=> sat_columns[d[1]].scale(d[0]))
            .attr('height', 1)
            .attr('fill', d => sat_columns[d[1]].color)
            .attr('stroke-width', '0px')
            //.attr('stroke', 'black')



    }



    
    


>>>>>>> Stashed changes

}