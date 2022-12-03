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

    wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}

    update() {
        let sel = this.global_state.selection;
        let satData = this.global_state.satelliteData;

        let details = this.details;

        if (sel.length > 0) {
            let sel_finder = satData.map((d, i) => [i, d[details[0].key], d[details[1].key], d[details[2].key], d[details[3].key]]).filter((d, i) => sel.includes(d[1]));

            //let details = d3.select('#details_svg').selectAll('text')
            this.fields.text((d,i) => {
                //console.log(d)
                //console.log(sel_finder[0], '0i: ', sel_finder[0][0])

                //return this.wrap(`${d.title}: ${(sel_finder[0][i+1])}`,40);
                return (`${d.title}: ${(sel_finder[0][i + 1])}`);
            })
                //.call(this.wrap,40);

        } else {
            this.fields.text('N/A');

        }





    }

}