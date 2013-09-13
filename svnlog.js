/*jslint browser: true, vars: true, indent: 4 */

(function (self, d3) {
    'use strict';
    
    var width = 960,
        height = 136,
        cellSize = 17; // cell size 
    var day = d3.time.format("%w"),
        week = d3.time.format("%U"),
        format = d3.time.format("%Y-%m-%d");
    var color = d3.scale.quantize()
            .domain([0, 25])
            .range(d3.range(6).map(function (d) {
                return "q" + d + "-11";
            }));
    
    function monthPath(t0) {
        var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
            d0 = +day(t0),
            w0 = +week(t0),
            d1 = +day(t1),
            w1 = +week(t1);
        return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize + "H"
            + w0 * cellSize + "V" + 7 * cellSize + "H" + w1 * cellSize
            + "V" + (d1 + 1) * cellSize + "H" + (w1 + 1) * cellSize
            + "V0" + "H" + (w0 + 1) * cellSize + "Z";
    }
    
    var svg = d3.select("body").selectAll("svg")
            .data(d3.range(2010, 2014))
            .enter().append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "RdYlGn")
            .append("g")
            .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

    svg.append("text")
        .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
        .style("text-anchor", "middle")
        .text(function (d) {
            return d;
        });

    var rect = svg.selectAll(".day")
        .data(function (d) {
            return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1));
        })
        .enter().append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function (d) {
            return week(d) * cellSize;
        })
        .attr("y", function (d) {
            return day(d) * cellSize;
        })
        .datum(format);

    rect.append("title")
        .text(function (d) {
            return d;
        });

    svg.selectAll(".month")
        .data(function (d) {
            return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1));
        })
        .enter().append("path")
        .attr("class", "month")
        .attr("d", monthPath);

    d3.xml("data-maven.xml", function (error, xml) {
        var raw = xml.getElementsByTagName("logentry");
        var min = raw[0];
        var max = raw[raw.length - 1];
        var data = d3.nest()
            .key(function (d) {
                var str = d.getElementsByTagName('date')[0].textContent;
                return str.split('T')[0];
            })
            .rollup(function (d) {
                return d.length;
            })
            .map(raw);

        rect.filter(function (d) {
            return data.hasOwnProperty(d);
        })
            .attr("class", function (d) {
                return "day " + color(data[d]);
            })
            .select("title")
            .text(function (d) {
                return d + ": " + data[d];
            });
    });

    d3.select(self.frameElement).style("height", "2910px");
}(window.self, window.d3));