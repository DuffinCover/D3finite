class VisualSatelliteChart{
    /*TODO this should be the place where we produce clever visualzations.  */
    //-MINE!

    constructor(global_state) {
        let data = global_state.satelliteData;

        this.global_state = global_state;

        let colors = global_state.color_pallette;

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
        this.CHART_WIDTH = 1000;

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
                //color: '#82d7d9'
                axis: null,
                color: colors[10]
            }, {
                name: 'Dry Mass (kg.)',
                scale: null,
                //color: '#ebc48d'
                axis: null,
                color: colors[1]
            }, {
                name: 'Launch Mass (kg.)',
                scale: null,
                //color: '#8d70ba'
                axis: null,
                color: colors[2]
            }, {
                name: 'Period (minutes)',
                scale: null,
                //color: '#cf5f91'
                axis: null,
                color: colors[3]
            }, {
                name: 'Inclination (degrees)',
                scale: null,
                //color: '#cf5f91'
                axis: null,
                color: colors[4]
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
            .attr('y', 25)
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

        let hlContainer = visuals.append('g')
            .attr('id', 'highlight-container');

        this.drawChart();
    }

    drawChart() {
        //let chart = this;
        let global_state = this.global_state;

        //let data = global_state.satelliteData;
        let data = applyGrouping();

        this.max_rows = 300;

        let satData = data;

        //if (global_state.group.length > 0) {
        //    satData = global_state.group;
        //}



        //satData = satData.filter((d, i) => i < 2001);

        

        let c_size = satData.length;
        if (c_size < this.MIN_HEIGHT) {
            c_size = this.MIN_HEIGHT;
        }

        let expand = c_size / satData.length;

        this.CHART_HEIGHT = c_size;

        let VSC_svg = d3.select('#VSC_SVG')
            .attr('height', this.CHART_HEIGHT);

        

        let cols = VSC_svg.selectAll('g');
        let n = 0;
        this.xScales = [];
        for (let col of this.sat_columns) {
            let max_val = d3.max(satData.map(d => d[col.name]));
            
            let scale = d3.scaleLinear()
                .domain([0, max_val])
                .range([this.v_border + this.h_pad, this.vizWidth1 - (this.h_Margin + this.v_border + this.h_pad)])
                .nice();

            let base_axis = d3.axisTop()
                .scale(scale)
                .ticks(5);
               

            col.scale = scale;
            col.axis = base_axis;

            let h = d3.select(`#top-${n}`).select('#vsc_header')

            h.select('g').remove()

            h.append('g')
                .attr('transform', `translate(${n * this.vizWidth1},50)`)
                .call(col.axis);


            n++;

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

        this.alt_yScale2 = d3.scaleLinear()
            .domain([0, satData.length])
            .range([this.v_Margin + this.v_border, this.CHART_HEIGHT - (this.v_border + sel_adjust + sel_adjust)]);
        

        let visuals = cols.select('#vsc_visual');

        visuals.selectAll('rect')
            .attr('height', this.CHART_HEIGHT - (this.v_Margin));

        let barContainer = visuals.select('#bar-container');

        let hlContainer = visuals.select('#highlight-container');

        let selection = globalState.selection;

        let sel_finder = satData.map((d, i) => [d['Name of Satellite, Alternate Names'], i]).filter((d, i) => selection.includes(d[0]));
        
        //let header_axes = cols.selectAll('#vsc_header')
        //    .data(this.sat_columns)
        //    .join('g')
        //    .call((d,i) => {
        //        console.log('anything?',i)
        //        return d.axis;
        //    }
        //    );

        



        //Draw the bars:

        
        

        if (sel_finder.length > 0) {
            //console.log('sel finder', sel_finder);

            

            

            if (sel_finder.length > 1) {
                let sel_idx1 = sel_finder[0][1];
                let sel_idx2 = sel_finder[1][1];

                if (sel_idx1 > sel_idx2) {
                    sel_idx1 = sel_idx2;
                    sel_idx2 = sel_finder[0][1];
                }


                //console.log(sel_idx);
                //console.log(this.alt_yScale.invert(sel_idx))

                let sel_data = satData.filter((d, i) => (i === sel_idx1 || i === sel_idx2));

                console.log('multi: ',sel_data);

                let y_loc = this.alt_yScale2.invert(sel_idx1);

                let scroll = 0;

                if (y_loc > this.MIN_HEIGHT) {
                    scroll = y_loc - (this.MIN_HEIGHT / 2);
                }

                document.getElementById("chart-body").scrollTop = scroll;


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
                    .attr('y', (d, i) => {
                        //(i > sel_idx) ? this.alt_yScale(i) + sel_adjust : this.alt_yScale(i))
                        let res = 0;
                        if (i > sel_idx2) {
                            res = this.alt_yScale2(i) + sel_adjust + sel_adjust
                        } else if (i > sel_idx1) {
                            res = this.alt_yScale2(i) + sel_adjust 
                        } else {
                            res = this.alt_yScale2(i)
                        }
                        return res;
                    })
                    .attr('width', d => d[0] === "" ? 0 : this.sat_columns[d[1]].scale(d[0]))
                    .attr('height', expand)
                    .attr('fill', d => color_shift(this.sat_columns[d[1]].color,30))
                    .attr('stroke-width', '0px')


                let highlight1 = bars.filter((d, i) => i === sel_idx1)
                    .attr('height', sel_height - 2)
                    .attr('y', this.alt_yScale2(sel_idx1) + 1)
                    .attr('fill', d => this.sat_columns[d[1]].color)
                    .attr('stroke-width', '1px')
                    .attr('stroke', 'black')

                let highlight2 = bars.filter((d, i) => i === sel_idx2)
                    .attr('height', sel_height - 2)
                    .attr('y', this.alt_yScale2(sel_idx2) + 1 + sel_adjust)
                    .attr('fill', d => this.sat_columns[d[1]].color)
                    .attr('stroke-width', '1px')
                    .attr('stroke', 'black')



                let row_highlight1 = hlContainer.selectAll('rect')
                    .data((d, i) => {
                        let output = sel_data.map((n,j) => {
                            return [n[d.name], i, j];
                        });
                        //console.log('hl',output);
                        return output;
                    })
                    .join('rect')
                    .attr('x', (d) => d[0] === "" ? 1 + (d[1] * this.vizWidth1) + this.h_pad : 1 + (d[1] * this.vizWidth1) + this.h_pad + this.sat_columns[d[1]].scale(d[0]))
                    .attr('y', d=> d[2] > 0 ? this.alt_yScale2(sel_idx2) + 1 + sel_adjust: this.alt_yScale2(sel_idx1) + 1)
                    .attr('height', sel_height - 2)
                    .attr('width', d => d[0] === "" ? this.vizWidth1 - ((2 * this.h_pad) + this.h_Margin) : this.vizWidth1 - (this.sat_columns[d[1]].scale(d[0]) + (2 * this.h_pad) + this.h_Margin))
                    .attr('fill', '#EAEAEA')
                    .attr('stroke-width', '0px')

            } else {


                let sel_idx = sel_finder[0][1];

                //console.log(sel_idx);
                //console.log(this.alt_yScale.invert(sel_idx))

                let sel_data = satData.filter((d, i) => i === sel_idx);

                let y_loc = this.alt_yScale.invert(sel_idx);

                let scroll = 0;

                if (y_loc > this.MIN_HEIGHT) {
                    scroll = y_loc - (this.MIN_HEIGHT / 2);
                }

                document.getElementById("chart-body").scrollTop = scroll;


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
                    //.attr('width', d => this.sat_columns[d[1]].scale(d[0]))
                    .attr('width', d => d[0] === "" ? 0 : this.sat_columns[d[1]].scale(d[0]))
                    .attr('height', expand)
                    .attr('fill', d => color_shift(this.sat_columns[d[1]].color, 30))
                    .attr('stroke-width', '0px')


                let highlight = bars.filter((d, i) => i === sel_idx)
                    .attr('height', sel_height - 2)
                    .attr('y', this.alt_yScale(sel_idx) + 1)
                    .attr('stroke-width', '1px')
                    .attr('stroke', 'black')



                let row_highlight = hlContainer.selectAll('rect')
                    .data((d, i) => {
                        let output = sel_data.map(n => {
                            return [n[d.name], i];
                        });
                        //console.log('hl',output);
                        return output;
                    })
                    .join('rect')
                    .attr('x', (d) => d[0] === "" ? 1 + (d[1] * this.vizWidth1) + this.h_pad : 1 + (d[1] * this.vizWidth1) + this.h_pad + this.sat_columns[d[1]].scale(d[0]))
                    .attr('y', this.alt_yScale(sel_idx) + 1)
                    .attr('height', sel_height - 2)
                    .attr('width', d => d[0] === "" ? this.vizWidth1 - ((2 * this.h_pad) + this.h_Margin) : this.vizWidth1 - (this.sat_columns[d[1]].scale(d[0]) + (2 * this.h_pad) + this.h_Margin))
                    .attr('fill', '#EAEAEA')
                    .attr('stroke-width', '0px')

            }

            ////console.log(sel_idx);
            ////console.log(this.alt_yScale.invert(sel_idx))

            //let sel_data = satData.filter((d, i) => i === sel_idx);

            //let y_loc = this.alt_yScale.invert(sel_idx);

            //let scroll = 0;

            //if (y_loc > this.MIN_HEIGHT) {
            //    scroll = y_loc - (this.MIN_HEIGHT / 2);
            //}

            //document.getElementById("chart-body").scrollTop = scroll;


            //let bars = barContainer.selectAll('rect')
            //    .data((d, i) => {
            //        let output = satData.map(n => {
            //            return [n[d.name], i]
            //        });
            //        //console.log(output);
            //        return output;
            //    })
            //    .join('rect')
            //    .attr('x', (d) => (d[1] * this.vizWidth1) + this.h_pad)
            //    .attr('y', (d, i) => (i > sel_idx) ? this.alt_yScale(i) + sel_adjust : this.alt_yScale(i))
            //    .attr('width', d => this.sat_columns[d[1]].scale(d[0]))
            //    .attr('height', expand)
            //    .attr('fill', d => this.sat_columns[d[1]].color)
            //    .attr('stroke-width', '0px')


            //let highlight = bars.filter((d, i) => i === sel_idx)
            //    .attr('height', sel_height - 2)
            //    .attr('y', this.alt_yScale(sel_idx) + 1)
            //    .attr('stroke-width', '1px')
            //    .attr('stroke', 'black')



            //let row_highlight = hlContainer.selectAll('rect')
            //    .data((d, i) => {
            //        let output = sel_data.map(n => {
            //            return [n[d.name], i];
            //        });
            //        //console.log('hl',output);
            //        return output;
            //    })
            //    .join('rect')
            //    .attr('x', (d) => 1 + (d[1] * this.vizWidth1) + this.h_pad + this.sat_columns[d[1]].scale(d[0]))
            //    .attr('y', this.alt_yScale(sel_idx) + 1)
            //    .attr('height', sel_height - 2)
            //    .attr('width', d => this.vizWidth1 - (this.sat_columns[d[1]].scale(d[0]) + (2 * this.h_pad) + this.h_Margin))
            //    .attr('fill', '#EAEAEA')
            //    .attr('stroke-width', '0px')



            
            

                //.attr('stroke', 'black')
        } else {

            hlContainer.selectAll('rect').remove();

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
                //.attr('width', d => this.sat_columns[d[1]].scale(d[0]))
                .attr('width', d => d[0] === "" ? 0 : this.sat_columns[d[1]].scale(d[0]))
                .attr('height', expand)
                .attr('fill', d => this.sat_columns[d[1]].color)
                .attr('stroke-width', '0px')
                //.attr('stroke', 'black')

        }

    }

    update() {
        this.drawChart();
    }

    updateGroup() {
        this.drawChart();
    }

    updateSelection() {
        this.drawChart();
    }

}