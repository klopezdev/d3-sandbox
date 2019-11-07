function d3Sandbox() {

    $(document).ready( startup );
    
    // TODO: The following values would be loaded from the server regarding the Site floor plan
    var componentSize = { width: 1024, height: 768 }; // Dimensions of the space this component can occupy
    var floorPlanSize = { width: 1923, height: 1081 }; // Dimensions of the floor plan background image
    var floorPlanUrl = "images/cabanas.png";
    
    // TODO: The following values would either be attributes of this component or also loaded with the above variables
    var svgPadding = { x: 10, y: 12 }; // For some reason, there is padding on the image within the SVG
    var viewPortScaleBounds = [1, 6];
    
    var rightSideDiv;
    var sandboxDiv;
    var svg;
    var viewPort;
    var floorPlan;
    
    function startup() {
        rightSideDiv = $( '#rightSide' );
        $( '#click' ).click( toggleSlidePanel );
        window.addEventListener('resize', resizeViewer );
        initSandbox();
    }
    
    function initSandbox() {
        sandboxDiv = d3.select('#d3-sandbox');
        
        var viewPortWidth = floorPlanSize.width;
        var viewPortHeight = floorPlanSize.height;

        svg = sandboxDiv.append("svg")
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('viewBox', "0 0 " + viewPortWidth + " " + viewPortHeight);

        viewPort = svg.append( "g" );

        floorPlan = viewPort.append("svg:image")
            .attr('width', viewPortWidth)
            .attr('height', viewPortHeight)
            .attr("xlink:href", floorPlanUrl)

        svg.call(d3.zoom()
                 .extent([[0, 0], [floorPlanSize.width, floorPlanSize.height]])
                 .scaleExtent( viewPortScaleBounds )
                 .translateExtent([[0,0], [floorPlanSize.width, floorPlanSize.height]])
                 .on("zoom", scaleViewPort)
                );
        
        resizeViewer();
    }

    function scaleViewPort() { 
        viewPort.attr("transform", d3.event.transform); 
    }
    
    var open = false;
    function toggleSlidePanel() {
        $( "#leftSide" ).animate( { width:'toggle' } , 100 );

        open = !open;
        $( "#click" ).css( { left: open ? 210 : 0 } );
        $( "#click" ).html( open ? "&#9664;" : "&#9654;" );
        $( "#rightSide" ).css( { marginLeft: open ? 210 : 0 } );
    }
    
    function resizeViewer() {
        var availableHeight = rightSideDiv.innerHeight();
        var availableWidth = rightSideDiv.innerWidth();
        
        console.log(availableHeight + " " + availableWidth);
        
        svg.attr('height', availableHeight);
        svg.attr('width', availableWidth);
    }
}

d3Sandbox();
