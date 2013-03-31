//HTML variables
var hoursTakenSoFarHTML;
var daysTakenSoFarHTML;
var hoursPlannedHTML;
var daysPlannedHTML;
var totalHoursHTML;
var totalDaysHTML;
var totalSpareHoursHTML;
var totalSpareDaysHTML;
var carriedOverHoursHTML;
var carriedOverDaysHTML;
var hoursAllowedHTML;
var daysAllowedHTML;


function setHTMLVariables(){
	hoursTakenSoFarHTML = $('#hoursTakenSoFar');
	daysTakenSoFarHTML = $('#daysTakenSoFar');
	hoursPlannedHTML = $('#hoursPlanned');
	daysPlannedHTML = $('#daysPlanned');
	totalHoursHTML = $('#totalHours');
	totalDaysHTML = $('#totalDays');
	totalSpareHoursHTML = $('#totalSpareHours');
	totalSpareDaysHTML = $('#totalSpareDays');
	carriedOverHoursHTML = $('#carriedOver');
	carriedOverDaysHTML = $('#carriedOverDays');
	hoursAllowedHTML = $('#timeAllowed');
	daysAllowedHTML = $('#daysAllowed');
	hoursAllowedHTML.val(timeAllowed);
}

var replaceDropboxButtons = function(){
	$('#useDropbox,#logout').toggle();
}

var resetSelectOptions = function(){
	$('#selectedDate').text('Select the first and last date of each holiday');
	$('.selectedDateControls>button').hide();
	$('.selectedDateDescription').hide();
}

function setButtons(){
	$('#prevYear').click(function(){prevYear()});
	$('#nextYear').click(function(){nextYear()});
	carriedOverHoursHTML.change(function(){
		updateCarriedOverTime();
		saveXML();
	});
	carriedOverDaysHTML.change(function(){
		updateCarriedOverDays();
		saveXML();
	});
	hoursAllowedHTML.change(function(){
		updateTimeAllowed();
		saveXML();
	});
	daysAllowedHTML.change(function(){
		updateDaysAllowed();
		saveXML();
	});
	$('#updateYearStart').click(function(){
		setMonth();
	})
	$('#useDropbox').click(function(){
		callDropbox();
	})
	$('#config,#control-close').click(function(){
		$('#controls').toggle();
		$('body').toggleClass('config');
		$("#controls").tabs({active: 1});
	});
	$('#dayshourscolumn').click(function(){
		$('.timeTableDays,.timeTableHours').toggle();
	});
	$('body').on('click',function(){
		if(clicktodeselect == true && !isCalendarLink && !($(event.target).hasClass('selector') || $(event.target).hasClass('btn') || $(event.target).attr('id') == 'dateDescription')){		
			dateRangeSelection = 0;
			YAHOO.calendar.cal1.deselect(YAHOO.calendar.cal1.getSelectedDates());
			YAHOO.calendar.cal1.render();
			resetSelectOptions();
			clicktodeselect = false;
		} else if(isCalendarLink){
			clicktodeselect = true;
			isCalendarLink = false;
		}
	});
	$('#closefocus').on('click',function(){
	});
	$('#nextMonth').click(function(){
		$('.selectedgroup').removeClass('selectedgroup').next().addClass('selectedgroup');
		if($('.selectedgroup.last-of-type').length > 0){
			$('#nextMonth').hide();
		} else {
			$('#nextMonth').show();
		}
		$('#prevMonth').show();
	});
	$('#prevMonth').click(function(){
		$('.selectedgroup').removeClass('selectedgroup').prev().addClass('selectedgroup');
		if($('.selectedgroup.first-of-type').length > 0){
			$('#prevMonth').hide();
		} else {
			$('#prevMonth').show();
		}
		$('#nextMonth').show();
	});
	$('#monthstart').on('change', function(){
		$('#updateYearStart').show();
	});
	$('#comfortableview,#compactview').on('click', function(){
		$('#comfortableview,#compactview').toggle();
		$('body').toggleClass('big');
	})
	$('#logout,#compactview').hide();
	$( "#controls" ).tabs();
}



var populateControlBox = function(date, type, dateRange, formattedString){

	$('.groupcal').removeClass('selectedGroup');
	$('.selected').parents('.groupcal').addClass('selectedgroup');
	$('#wrapper').addClass('focused');
	if($('.selectedgroup.last-of-type').length > 0){
		$('#nextMonth').hide();
	} else {
		$('#nextMonth').show();
	}
	if($('.selectedgroup.first-of-type').length > 0){
		$('#prevMonth').hide();
	} else {
		$('#prevMonth').show();
	}

	var dateTitle = "";
	$('#selectedDate').html(formattedString);
	if (type == 1) {
		dateTitle = window.dateRange[date.dateRange]['holidayNotes'];
		$('#selectButton').hide();
		$('#deselectButton,#updateButton').show();
		$("#deselectButton").unbind("click");
		$('#deselectButton').on('click',function(){
			myDeselectCell(date.dateRange);
		});
		$("#updateButton").unbind("click");
		$('#updateButton').on('click',function(){
			myUpdateCell(date.dateRange);
		});
	} else if (type == 2) {
		dateTitle = date['holidayNotes'];
		$('#deselectButton,#updateButton,#selectButton').hide();
	} else if (type == 0){
		$('#deselectButton,#updateButton').hide();
		$('#selectButton').show();
		$("#selectButton").unbind("click");
		$('#selectButton').on('click',function(){
			mySelectCell(dateRange, formattedString);
		});
	}
	isCalendarLink = true;	
	$('.selectedDateDescription').show();
	$('#dateDescription').val(dateTitle);
};


//loads up the button commands 
function mySelectCell(dateRange, formattedString){
	dateRangeSelection = 0;
	var dateArray = dateRange.split(',');
	var title = $('#dateDescription').val();
	var date;
	for (var i = 0; i < dateArray.length; i++){
		date = dateListObject.addHoliday(dateArray[i], true, title, dateRange, formattedString);
	}
	renderDatesToCalendar();
	populateControlBox(date , 1, dateRange, formattedString);
	saveXML();
	$('.groupcal').removeClass('selectedgroup');
	resetSelectOptions();
};

function myUpdateCell(dateString){
	window.dateRange[dateString].holidayNotes = $('#dateDescription').val();
	saveXML();
	$('.groupcal').removeClass('selectedgroup');
	resetSelectOptions();
};

function myDeselectCell(dateString){
	dateArray = dateString.split(',');
	for (var i = 0; i < dateArray.length; i++){
		dateListObject.removeHoliday(dateArray[i]);
	}
	renderDatesToCalendar();
	populateControlBox("" , 0, "", "");
	saveXML();
	$('.groupcal').removeClass('selectedgroup');
	resetSelectOptions();
};
