/*global famous*/
// import dependencies
var Engine = famous.core.Engine;
var Modifier = famous.core.Modifier;
var Transform = famous.core.Transform;
var Surface = famous.core.Surface;
var ContainerSurface = famous.surfaces.ContainerSurface;
var Scrollview = famous.views.Scrollview;
var GridLayout = famous.views.GridLayout
var EventHandler = famous.core.EventHandler;

// create the main context
var mainContext = Engine.createContext();

// left scroll view

var width = window.innerWidth * 0.5;
var height = window.innerHeight * 0.4;


var leftScrollViewModifier = new Modifier({
	align: [0, 0.5]
});


var leftScrollview = new Scrollview();
var leftSurfaces = [];
leftScrollview.sequenceFrom(leftSurfaces);

for (var i = 0, temp; i < 24; i++) {
    temp = new Surface({
         content: ""+i,
         size: [undefined, 50],
         properties: {backgroundColor: "#FFF",
	             color: "#AAA",
             lineHeight: "50px",
             textAlign: "center"
         }
    });

    temp.pipe(leftScrollview);
    leftSurfaces.push(temp);
}

var leftScrollViewContainer = new ContainerSurface({
	size:[width, height],
	properties: {
		overflow: 'hidden'
	}
});

leftScrollViewContainer.add(leftScrollview);

mainContext.add(leftScrollViewModifier)
			.add(leftScrollViewContainer);

// right Scroll

var rightScrollViewModifier = new Modifier({
	align: [0.5, 0.5]
});


var rightScrollview = new Scrollview();
var rightSurfaces = [];
rightScrollview.sequenceFrom(rightSurfaces);

for (var i = 0, temp; i < 56; i++) {
	if (i%5==0) {
    var pre = (i<10)?"0":"";
	    temp = new Surface({
	         content: pre+i,
	         size: [undefined, 50],
	         properties: {
	             backgroundColor: "#FFF",
	             color: "#AAA",
	             lineHeight: "50px",
	             textAlign: "center"
	         }
	    });
	    temp.pipe(rightScrollview);
    	rightSurfaces.push(temp);	
    };
}

var rightScrollViewContainer = new ContainerSurface({
	size:[width, height],
	properties: {
		overflow: 'hidden'
	}
});

rightScrollViewContainer.add(rightScrollview);

mainContext.add(rightScrollViewModifier)
			.add(rightScrollViewContainer);

// calendar
var selectedSurface = new Surface();
function createCalendarMonthView(offset){

	var currentMonth = Number(moment().format("M"));
	var absOffset = Math.abs(offset);
	var firstDay = 0;
	var month = 0;
	var year = 0;
	var momentAdjusted;

	if (offset < 0) {
		momentAdjusted = moment().subtract(absOffset, "months");
		month = Number(momentAdjusted.format("M"))-1;
		year = Number(momentAdjusted.format("YYYY"));
	}
	else {
		momentAdjusted = moment().add(absOffset, "months");
		month = Number(momentAdjusted.format("M"))-1;
		year = Number(momentAdjusted.format("YYYY"));
	}

	var today = Number(moment([year, month]).format("D"));
	firstDay = Number(moment([year, month]).subtract(today, "days").format('d'));
	console.log(firstDay);

	var	gridNumLines = 7;

	var gridContainerHeight = window.innerHeight * 0.5;
	var gridHeight = gridContainerHeight * 0.8;
	var gridTitleHeight = gridContainerHeight * 0.2;

	var grid = new GridLayout({
	    dimensions: [7, gridNumLines]
	});

	var gridCleanEventHandler = new EventHandler();
	

	var gridSurfaces = [];
	grid.sequenceFrom(gridSurfaces);

	var modDeselect = new Modifier({
		classes: ['unselectedDay']
	});

	var gridDaysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	var daysThisMonth = moment([year, month]).daysInMonth();
	for(var i = 0; i < daysThisMonth+firstDay+7; i++) {
	    var content;
	    if (i < 7) {
	    	content = gridDaysOfTheWeek[i];
	    }
	    else if (i > 6 && i < 7+firstDay) {
	    	content = "";
	    }
	    else {
	    	content = i - (6+firstDay);
	    }
	    
	    var squareSide = gridHeight / gridNumLines;

	    var daySurface = new Surface({
	        content: content,
	        size: [squareSide, squareSide],
	        classes: ['unselectedDay'],
	        properties: {
	            lineHeight: squareSide + 'px',
	            textAlign: 'center'
	        }
	    });
	    
	    if (i > 6+firstDay) {
	    	daySurface.on('click', function(data){
		    	selectedSurface.removeClass('selectedDay');
		    	this.removeClass('unselectedDay');
		    	this.addClass('selectedDay');
		    	selectedSurface = this;
		    });
	    };


	    var centerModifier = new Modifier({
	        align: [0.5, 0.5],
	        origin: [0.5, 0.5]
	    });

	    var dayContainerSurface = new ContainerSurface({size: [undefined, undefined]});
	    dayContainerSurface.add(centerModifier).add(daySurface);
	    
	    gridSurfaces.push(dayContainerSurface);
	}

	var gridContainer = new ContainerSurface({
		size:[undefined, gridHeight]
	});
	gridContainer.add(grid);

	var gridModifier = new Modifier({
		align: [0, 0.2]
	});

	// grid title
	var gridTitle = new Surface ({
		size: [undefined, gridTitleHeight],
		content: moment([year, month]).format("MMMM YYYY"),
		properties: {
			color: "black",
			textAlign: "center",
			lineHeight: gridTitleHeight + "px"
		}
	});
	// console.log(gridTitleHeight)
	var gridTitleModifier = new Modifier({
		align: [0, 0]
	});

	var gridTitleContainer = new ContainerSurface ({
		size: [undefined, gridTitleHeight]
	});
	gridTitleContainer.add(gridTitle);	

	// title and grid container
	var gridAndTitleContainer = new ContainerSurface({
		size: [undefined, gridContainerHeight]
	});

	gridAndTitleContainer.add(gridTitleModifier).add(gridTitleContainer);
	gridAndTitleContainer.add(gridModifier).add(gridContainer);

	return gridAndTitleContainer;
}

// calendar scroll view

var gridScrollview = new Scrollview({
	direction: 0, 
  	paginated: true
});
var gridSurfaces = [];
gridScrollview.sequenceFrom(gridSurfaces);

for (var i = 0, temp; i < 12; i++) {
    
		var gridAndTitleContainer = createCalendarMonthView(i);
	    gridAndTitleContainer.pipe(gridScrollview);
    	gridSurfaces.push(gridAndTitleContainer);	
    
}

mainContext.add(gridScrollview);
