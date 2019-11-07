function d3Sandbox() {

    $(document).ready( initSandbox );
    
    // TODO: The following values would be loaded from the server regarding the Site floor plan
    var componentSize = { width: 1024, height: 768 }; // Dimensions of the space this component can occupy
    var floorPlanSize = { width: 1963, height: 1330 }; // Dimensions of the floor plan background image
    var floorPlanUrl = "images/cabanas.png";
    
    // TODO: The following values would either be attributes of this component or also loaded with the above variables
    var svgPadding = { x: 10, y: 12 }; // For some reason, there is padding on the image within the SVG
    var viewPortScaleBounds = [1, 6];
    
    var sandboxDiv;
    var svg;
    var viewPort;
    var floorPlan;
    
    function initSandbox() {
        var sandboxDiv = d3.select('#d3-sandbox');

        svg = sandboxDiv.append("svg")
            .attr("width", componentSize.width)
            .attr("height", componentSize.height)
            .attr('viewBox', "0 0 " + floorPlanSize.width + " " + floorPlanSize.height);

        viewPort = svg.append( "g" );

        floorPlan = viewPort.append("svg:image")
            .attr('x', -svgPadding.x)
            .attr('y', -svgPadding.y)
            .attr('width', floorPlanSize.width + (3 * svgPadding.x)) // Adding 3 * the padding will center the image without padding
            .attr('height', floorPlanSize.height + (3 * svgPadding.y))
            .attr("xlink:href", floorPlanUrl)

        svg.call(d3.zoom()
                 .extent([[0, 0], [floorPlanSize.width, floorPlanSize.height]])
                 .scaleExtent( viewPortScaleBounds )
                 .translateExtent([[0,0], [floorPlanSize.width, floorPlanSize.height]])
                 .on("zoom", scaleViewPort)
                );
    }

    function scaleViewPort() { 
        viewPort.attr("transform", d3.event.transform); 
    }
}

d3Sandbox();