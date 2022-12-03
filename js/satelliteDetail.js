class SatelliteDetails{
    /*TODO
    This needs a picture of that type of satellite 
    show detail about it
    */

    constructor(global_state) {
        let data = global_state.satelliteData;

        this.global_state = global_state;

        let colors = global_state.color_pallette;

        this.details = [
            {
                key: 'Name of Satellite, Alternate Names',
                title: 'Name',
            }
            ,
            {
                key: 'Country of Operator/Owner',
                title: 'Country',
            }
            ,
            {
                key: 'Purpose',
                title: 'Use',
            }
            ,
            {
                key: 'Comments',
                title: 'Notes',
            }
        ]

        let details_div = d3.select('#detail_div').append('svg')
            .attr('id', 'details_svg')
            .attr('height', '400')
            .attr('width', 600)

        this.containers = details_div.selectAll('g')
            .data(this.details)
            .join('g')
            .attr('transform', (d, i) => `translate(10,${(i * 40)+50})`)

        let underline = this.containers.append('rect')
            .attr('height', 5)
            .attr('width', 200)
            .attr('fill', (d, i) => colors[i + 2])


        this.fields = this.containers.append('text')
            .attr('x', 5)
            .attr('y', -2)
            .style('font-size', '20px');

    }

    update() {
        let sel = this.global_state.selection;
        let satData = this.global_state.satelliteData;

        let details = this.details;

        if (sel.length > 0) {
            let sel_finder = satData.map((d, i) => [i, d[details[0].key], d[details[1].key], d[details[2].key], d[details[3].key]]).filter((d, i) => sel.includes(d[1]));

            //let details = d3.select('#details_svg').selectAll('text')
            this.fields.text((d,i) => {
                console.log(d)
                console.log(sel_finder[0], '0i: ', sel_finder[0][0])
                return (sel_finder[0][i+1]);
            });

        } else {
            this.fields.text('N/A');

        }





    }

}