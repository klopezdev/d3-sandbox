$(document).ready( startup );

function startup() {
    var reservationsList = ReservationsList();
    reservationsList.enableClickToOpen();
    reservationsList.enableDrag();

    var floorPlanViewer = FloorPlanViewer();
    floorPlanViewer.init();

    var tableManagement = TableManagement( floorPlanViewer );
    tableManagement.addTable( 1, 20, 35, 40, 0 );
    tableManagement.addTable( 2, 20, 80, 40, 0 );
    tableManagement.addTable( 3, 20, 125, 40, 0 );
    tableManagement.addTable( 4, 20, 170, 40, 0 );
    tableManagement.addTable( 5, 20, 1260, 214, 40 );
    tableManagement.addTable( 6, 20, 1286, 180, 40 );
    tableManagement.addTable( 7, 20, 1337, 133, 55 );
    tableManagement.addTable( 8, 20, 1398, 102, 73 );
    tableManagement.addTable( 9, 20, 1466, 90, 88 );
}

function FloorPlanViewer() {
    
    return {
        // TODO: The following values would be loaded from the server regarding the Site floor plan
        floorPlanSize: { width: 1923, height: 1081 }, // Dimensions of the floor plan background image
        viewPortScaleBounds: [1, 6],
        
        floorPlanUrl: "images/cabanas.png",

        // DOM elements initiated by init
        rightSideDiv: undefined, 
        sandboxDiv: undefined,
        svg: undefined,
        viewPort: undefined,
        floorPlan: undefined,
        
        init: function() {
            this.sandboxDiv = d3.select('#d3-sandbox');

            var viewPortWidth = this.floorPlanSize.width;
            var viewPortHeight = this.floorPlanSize.height;

            this.svg = this.sandboxDiv.append("svg")
                .attr('preserveAspectRatio', 'xMidYMid meet')
                .attr('viewBox', "0 0 " + viewPortWidth + " " + viewPortHeight);

            this.viewPort = this.svg.append( "g" );

            this.floorPlan = this.viewPort.append("svg:image")
                .attr('width', viewPortWidth)
                .attr('height', viewPortHeight)
                .attr("xlink:href", this.floorPlanUrl)

            this.svg.call(d3.zoom()
                     .extent([[0, 0], [this.floorPlanSize.width, this.floorPlanSize.height]])
                     .scaleExtent( this.viewPortScaleBounds )
                     .translateExtent([[0,0], [this.floorPlanSize.width, this.floorPlanSize.height]])
                     .on("zoom", this.scaleViewPort)
                    );

            this.rightSideDiv = $( '#rightSide' );
            window.addEventListener('resize', this.resizeViewer );
            this.resizeViewer();
        },

        scaleViewPort: function() { 
            // TODO: Is there a way to reference the <g> viewPort by this objects reference?
            // Because this function is called by the on zoom handler, the this keyword does not point to this function's object
            d3.select(this.firstChild).attr("transform", d3.event.transform); 
        },
    
        resizeViewer: function() {
            var availableHeight = $('#rightSide').innerHeight();
            var availableWidth = $('#rightSide').innerWidth();

            d3.select('svg').attr('height', availableHeight);
            d3.select('svg').attr('width', availableWidth);
        }
    };
}

function ReservationsList() {
    
    return {
        
        open: false,
        
        enableClickToOpen: function() {
            $( '#click' ).click( this.toggleSlidePanel );
        },
        enableDrag: function() {
            $( '.reservations-item' ).draggable({
                helper: 'clone'
            });
        },
        
        toggleSlidePanel: function() {
            $( "#leftSide" ).animate( { width:'toggle' } , 100 );

            this.open = !this.open;
            $( "#click" ).css( { left: this.open ? 210 : 0 } );
            $( "#click" ).html( this.open ? "&#9664;" : "&#9654;" );
            $( "#rightSide" ).css( { marginLeft: this.open ? 210 : 0 } );
        }
    };
}

function TableManagement( floorPlanViewer ) {    
    
    return {
        
        __floorPlanViewer: floorPlanViewer,
        tables: [],
    
        addTable: function( id, height, x, y, rotation, container ) {
            var tableRotation = 'rotate(' + rotation + ', ' + (x + (height / 2)) + ', ' + (y + ( height / 2 )) + ')';

            var table = this.__floorPlanViewer.viewPort.append("rect")
                                                       .attr("x", x)
                                                       .attr("y", y)
                                                       .attr("width", height)
                                                       .attr("height", height)
                                                       .attr('transform', tableRotation)
                                                       .attr('fill', 'white');

            this.tables.push( table );
        }
    };
}