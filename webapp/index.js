$(document).ready( startup );

function startup() {
    
    var reservationsList = ReservationsList();
    var floorPlanViewer = FloorPlanViewer();
    var tableManagement = TableManagement( floorPlanViewer );
    
    window.infor = { isc: {
        rservationsList: reservationsList,
        floorPlanViewer: floorPlanViewer,
        tableManagement: tableManagement
    } };
    
    reservationsList.init();

    floorPlanViewer.init();
    
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
        container: undefined,
        sandboxDiv: undefined,
        svg: undefined,
        viewPort: undefined,
        floorPlan: undefined,
        
        init: function() {
            this.container = $('#rightSide');
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

            window.addEventListener('resize', this.resizeViewer );
            this.resizeViewer();
        },

        scaleViewPort: function() { 
            // Because this function is called by the on zoom handler, the 'this' keyword does not point to this function's object, use 'my' to get back to it
            var my = window.infor.isc.floorPlanViewer;
            my.viewPort.attr("transform", d3.event.transform); 
        },
    
        resizeViewer: function() {
            // Because this function is called by the on resize handler, the 'this' keyword does not point to this function's object, use 'my' to get back to it
            var my = window.infor.isc.floorPlanViewer;
            
            var availableHeight = my.container.innerHeight();
            var availableWidth = my.container.innerWidth();

            my.svg.attr('height', availableHeight);
            my.svg.attr('width', availableWidth);
        }
    };
}

function ReservationsList() {
    
    return {
        
        reservationItemClass: '.reservations-item',
        
        open: false,
        
        container: undefined,
        slideButton: undefined,
        
        init: function() {
            this.container = $( "#leftSide" );
            this.slideButton = $( "#click" );
            
            this.slideButton.click( this.toggleSlidePanel );
            this.enableDrag();
        },
        enableDrag: function() {
            $( this.reservationItemClass ).draggable({
                helper: 'clone',
                stop: this.toggleSlidePanel
            });
        },
        toggleSlidePanel: function() {
            // Because this function is called by the on click handler, the 'this' keyword does not point to this function's object, use 'my' to get back to it
            var my = window.infor.isc.rservationsList;
            my.container.animate( { width:'toggle' } , 100 );

            my.open = !my.open;
            my.slideButton.css( { left: my.open ? 210 : 0 } );
            my.slideButton.html( my.open ? "&#9664;" : "&#9654;" );
            $( "#rightSide" ).css( { marginLeft: my.open ? 210 : 0 } );
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