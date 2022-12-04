class SatelliteDetails {
    /*TODO
    This needs a picture of that type of satellite 
    show detail about it
    */

    constructor(global_state) {
        let data = global_state.satelliteData;

        this.global_state = global_state;

        this.colors = global_state.color_pallette;

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
                key: 'Users',
                title: 'User',
            }
            ,
            {
                key: 'Launch Site',
                title: 'Launch Site',
            }
            ,
            {
                key: 'Date of Launch',
                title: 'Launch Date',
            }
            ,
            {
                key: 'Comments',
                title: 'Notes',
            }
            ,
            {
                key: 'Launch Vehicle',
                title: 'Launch Vehicle',
            }
        ]

        let details_div = d3.select('#detail_div')
            .attr('class', 'detail')

        let title_div = d3.select('#title_div')
            .attr('class', 'detail_title')

        this.split1 = details_div.append('div')
            .attr('id', 'split1')
            .style('width', '100%')
            .style('float', 'left');
        this.split2 = details_div.append('div')
            .attr('id', 'split2')
            .style('width', '0%')
            .style('float', 'right');

        this.fields1 = this.split1.selectAll('#div')
            .data(this.details)
            .join('div')


        this.fields2 = this.split2.selectAll('#div')
            .data(this.details)
            .join('div')
    }


    update() {
        let sel = this.global_state.selection;
        let satData = this.global_state.satelliteData;

        let details = this.details;


        let resize = function (h, w) {
            let maxh = 200;
            let maxw = 200;
            let maxd = h > w ? h : w;


            //if (maxd > maxh) {

            //} else if (w > maxw) {

            //}

            if (maxd > maxh) {
                let scale = maxh / maxd;
                h = scale * h;
                w = scale * w;

            }


            return ([h, w])
        }


        if (sel.length > 0) {
            let sel_finder = satData.map((d, i) =>
                [i, d[details[0].key], d[details[1].key], d[details[2].key], d[details[3].key], d[details[4].key], d[details[5].key], d[details[6].key], d[details[7].key]]
            ).filter((d, i) => sel.includes(d[1]));

            let img1 = null;
            let img2 = null;
            let pic_src1 = '';
            let pic_src2 = '';
            let h = 0;
            let w = 0;

            let raw = '';

            let target1 = null;
            let target2 = null;

            if (sel_finder.length > 1) {
                this.fields1.html((d, i) => {

                    return (`${d.title}: ${(sel_finder[0][i + 1])}`);
                })
                    .style('background-color', (d, i) => color_shift(this.colors[i + 2], 150))
                    .append('hr')
                    .classed('hr_line', true);

                raw = sel_finder[0][8].split(" ")[0].split(".")[0]
                pic_src1 = `images/${raw.split("-")[0]}.png`;
                console.log(pic_src1);

                target1 = this.fields1.filter(d => d.title === 'Launch Vehicle');

                img1 = new Image();
                img1.src = pic_src1;
                img1.onload = function () {
                    h = img1.height;
                    w = img1.width;
                    console.log('loaded', h, w);
                    target1.insert('div', 'hr')
                        .append('img')
                        .attr('src', pic_src1)
                        .attr('width', resize(h, w)[1])
                        .attr('height', resize(h, w)[0]);
                }
                this.fields2.html((d, i) => {

                    return (`${d.title}: ${(sel_finder[1][i + 1])}`);
                })
                    .style('background-color', (d, i) => color_shift(this.colors[i + 2], 150))
                    .append('hr')
                    .classed('hr_line', true);


                raw = sel_finder[1][8].split(" ")[0].split(".")[0]
                pic_src2 = `images/${raw.split("-")[0]}.png`;
                console.log(pic_src2);

                target2 = this.fields2.filter(d => d.title === 'Launch Vehicle');

                img2 = new Image();
                img2.src = pic_src2;
                img2.onload = function () {
                    h = img2.height;
                    w = img2.width;
                    console.log('loaded', h, w);
                    target2.insert('div', 'hr')
                        .append('img')
                        .attr('src', pic_src2)
                        .attr('width', resize(h, w)[1])
                        .attr('height', resize(h, w)[0]);;
                }

                //this.fields2
                //    .style('background-color', (d, i) => color_shift(this.colors[i + 2], 150))
                //    .append('hr')
                //    .classed('hr_line', true);
                //}

                this.split1.style('width', '49%')
                    .style('border-right', 'solid')
                this.split2.style('width', '49%')
                    .style('border-left', 'solid')



            } else {
                this.fields1.html((d, i) => {

                    return (`${d.title}: ${(sel_finder[0][i + 1])}`);
                })
                    .style('background-color', (d, i) => color_shift(this.colors[i + 2], 150))
                    .append('hr')
                    .classed('hr_line', true);

                this.fields2.html('')
                this.split1.style('width', '100%')
                    .style('border', 'none')
                this.split2.style('width', '0%')
                    .style('border', 'none')


                raw = sel_finder[0][8].split(" ")[0].split(".")[0]
                pic_src1 = `images/${raw.split("-")[0]}.png`;
                console.log(pic_src1);

                target1 = this.fields1.filter(d => d.title === 'Launch Vehicle');

                img1 = new Image();
                img1.src = pic_src1;
                img1.onload = function () {
                    h = img1.height;
                    w = img1.width;

                    console.log('loaded', h, w);

                    //if (img.complete) {
                    /*                    console.log('FOUND')*/
                    target1.insert('div', 'hr')
                        .append('img')
                        .attr('src', pic_src1)
                        .attr('width', resize(h, w)[1])
                        .attr('height', resize(h, w)[0]);;
                }


            }


        } else {
            this.fields1.html('')
                .style('background-color', "white");
            this.fields1.selectAll('hr').remove;
            this.fields2.html('')
                .style('background-color', "white");
            this.fields2.selectAll('hr').remove;
            this.split1.style('width', '100%')
                .style('border', 'none')
            this.split2.style('width', '0%')
                .style('border', 'none')


        }





    }

}