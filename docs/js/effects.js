async function drawEffects() {
    // Put all code in here

    var width = 960,
        height = 600;

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    var g = svg.append("g");

    var zoom = d3.behavior.zoom()
        .translate([0, 0])
        .scale(1)
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

    //svg.call(zoom) // delete this line to disable free zooming
    //    .call(zoom.event);

    // Align center of Brazil to center of map
    var projection = d3.geo.mercator()
        .scale(650)
        .center([-52, -15])
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    // Load data (asynchronously)
    d3_queue.queue()
        .defer(d3.json, "./br-states.json")
        .await(ready);

    function ready(error, shp) {
        if (error) throw error;

        // Extracting polygons and contours
        var states = topojson.feature(shp, shp.objects.estados);
        var states_contour = topojson.mesh(shp, shp.objects.estados);

        // Desenhando estados
        g.selectAll(".estado")
            .data(states.features)
            .enter()
            .append("path")
            .attr("class", "state")
            .attr("d", path);

        g.append("path")
            .datum(states_contour)
            .attr("d", path)
            .attr("class", "state_contour");
    }

    // What to do when zooming
    function zoomed() {
        g.style("stroke-width", 1.5 / d3.event.scale + "px");
        g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }
    d3.select(self.frameElement).style("height", height + "px");
}


drawEffects();