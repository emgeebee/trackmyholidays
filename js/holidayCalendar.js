/**
* @author matrulesok2
*/

YAHOO.namespace("calendar");

var bankHolidays;

//Time variables
var currentDate = new Date();
var currentYear = currentDate.getFullYear();
var _TIMEALLOWED = 30 * 7.5;
var timeAllowed = _TIMEALLOWED;
var hoursTaken;
var hoursPlanned;
var carriedOver = 0;
var month = 08;
var hasStartMonthBeenChanged = false;
var defaultDates = {"-yearStart": "8","dateList": {}}

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

//State variables
var dateRangeSelection = 0;
var startDate;
var client = null;
var clicktodeselect = false;
var isCalendarLink = false;

window['dateList'] = new Object();
var dateList = window['dateList'];

window['dateRange'] = new Object();

var dateListObject = {
	addHoliday : function(date, isHoliday, title, dateRange, dateRangeFormattedString){
		window['dateList'][date] = new holidayObject(isHoliday, title, dateRange);
		if(!window['dateRange'][dateRange] && isHoliday){
			window['dateRange'][dateRange] = new dateRangeObject(title, dateRangeFormattedString);
		}
		return window['dateList'][date];
	},

	removeHoliday : function(date){
		delete window['dateList'][date];
	},

	clearDateList : function(){
		window['dateList'] = new Object();
		dateList.length = 0;
	}
}

//var dateList = new Object();

function holidayObject (isHoliday, title, dateRange){
	new Object();
	this['isHoliday'] = isHoliday;
	this['isBankHoliday'] = !isHoliday;
	this['holidayNotes'] = title;
	this['dateRange'] = dateRange;
	return this;
}

function dateRangeObject (title, dateRangeFormattedString){
	new Object();
	this['holidayNotes'] = title;
	this['dateRangeFormattedString'] = dateRangeFormattedString;
	return this;
}

// loops through the dates in the datelist and makes sure that they are all added to the calendar

function renderDatesToCalendar(){
	var i = 0;
	YAHOO.calendar.cal1.removeRenderers();
	YAHOO.calendar.cal1.addWeekdayRenderer(1, weekendRenderer);
	YAHOO.calendar.cal1.addWeekdayRenderer(7, weekendRenderer);
	for (date in dateList) {
		if (dateList[date].isHoliday){
			YAHOO.calendar.cal1.addRenderer(date, holidayRenderer);
			i++;
		} else if (dateList[date].isBankHoliday) {
			YAHOO.calendar.cal1.addRenderer(date, bankHolidayRenderer);
		}
	}
	dateListObject.length = i;
	countHolidays();
	holidayTakenSoFar();
	hoursTakenSoFarHTML.html(hoursTaken);
	daysTakenSoFarHTML.html(hoursTaken/7.5);
	hoursPlannedHTML.html(hoursPlanned);
	daysPlannedHTML.html(hoursPlanned/7.5);
	totalHoursHTML.html(hoursPlanned + hoursTaken);
	totalDaysHTML.html((hoursPlanned + hoursTaken)/7.5);

	carriedOverHoursHTML.val(carriedOver);
	carriedOverDaysHTML.val(carriedOver/7.5);
	hoursAllowedHTML.val(timeAllowed);
	daysAllowedHTML.val(timeAllowed/7.5);

	updateTotalSpareDays();
	YAHOO.calendar.cal1.render();
}

//called on initial load. Sets the data for the start month and sets up the calendar accordingly

function setStartYear(holidayNode){
	if(isNaN(month)){
		if(holidayNode.yearStart){
			month = holidayNode.yearStart;
		} else {
			month = 08;
		}
	}
	if (currentDate.getMonth() < month){
		currentYear--;
	}
	startYear = currentYear;
	endYear = currentYear + 1;
	var jsmonth = parseInt(month) + 1;
	if(parseInt(jsmonth)<10){
		$('#monthstart').val('0'+jsmonth);
	} else {
		$('#monthstart').val(''+jsmonth);
	}
}

//based on the selected dates, calculates which are valid dates (i.e. not bank holidays and weekends)

function getRangeOfDates(startDate, endDate){
	var date1 = new Date();
	date1.setFullYear(startDate[0][0][0], parseInt(startDate[0][0][1] - 1), startDate[0][0][2]);
	var date2 = new Date();
	date2.setFullYear(endDate[0][0][0], parseInt(endDate[0][0][1] - 1), endDate[0][0][2]);
	var dateIterator = date1;
	if(date2 < date1){
		dateIterator = date2;
		var date2 = date1;
	}
	var dateArray = new Array();
	while (dateIterator <= date2){
		var workingDateFormatted = workingDateFromDateObject(dateIterator);
		var date = window['dateList'][workingDateFormatted];
		if (!date && dateIterator.getDay() != 0 && dateIterator.getDay() != 6) {
			dateArray.push(workingDateFromDateObject(dateIterator));
		}
		dateIterator.setDate(dateIterator.getDate() + 1);
	}
	return dateArray;
}

// formats the date range string

function dateRangeFormattedString(dateArray){
	return dateArray[0] + " - " + dateArray[dateArray.length - 1] + " (" + dateArray.length + " days)";
}

//the handler for when a date range is selected

function selectDateRange(operation, workingDate){
	var workingDateFormatted = workingDateFromArray(workingDate);
	var date = window['dateList'][workingDateFormatted];
	if (date){
		dateRangeSelection = 0;
		if (date.isBankHoliday){
			populateControlBox(date, 2, workingDateFormatted, workingDateFormatted);
		} else if (date.isHoliday) {
			populateControlBox(date, 1, date.dateRange, window.dateRange[date.dateRange]['dateRangeFormattedString']);
		}
	} else if(dateRangeSelection){
		var dateArray = getRangeOfDates(startDate, workingDate);
		dateRangeSelection = 0;
		YAHOO.calendar.cal1.cfg.setProperty('selected', dateArray.join(','), false);
		YAHOO.calendar.cal1.render();
		populateControlBox("", 0, dateArray.join(','), dateRangeFormattedString(dateArray));
	} else {
		startDate = workingDate;
		dateRangeSelection = 1;
		populateControlBox("", 0, workingDateFromArray(workingDate), workingDateFromArray(startDate));
	}
}

//loads up the button commands 

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

function workingDateFromDateObject(date){
	return parseInt(parseInt(date.getMonth()) + 1) + '/' + date.getDate() + '/' + date.getFullYear();
}


function holidayTakenSoFar(){
	var i = 0;
	var j = 0;
	for (date in dateList) {
		if (dateList[date]['isHoliday'] != true){
			continue
		}
		var dateSplit = date.split('/');
		var date = new Date(dateSplit[2], dateSplit[0] - 1, dateSplit[1]);
		if (date.getTime() < currentDate.getTime()) {
			i++;
		} else {
			j++
		}
	}
	hoursTaken = i * 7.5;
	hoursPlanned = j * 7.5;
}

function setYearPeriod(){
	var nextYear = parseFloat(currentYear) + 1;
	$('#yearPeriod').html(currentYear + " - " + nextYear);
}

function updateCarriedOverDays(){
	carriedOver = carriedOverDaysHTML.val()*7.5;
	carriedOverHoursHTML.val(carriedOver);
	currentYearNode['-carriedOver'] = carriedOver;
	updateTotalSpareDays();
}

function updateCarriedOverTime(){
	carriedOver = carriedOverHoursHTML.val();
	carriedOverDaysHTML.html(carriedOver/7.5);
	currentYearNode['-carriedOver'] = carriedOver;
	updateTotalSpareDays();
}

function updateDaysAllowed(){
	timeAllowed = daysAllowedHTML.val()*7.5;
	hoursAllowedHTML.html(timeAllowed);
	currentYearNode['-timeAllowed'] = timeAllowed;
	updateTotalSpareDays();
}

function updateTimeAllowed(){
	timeAllowed = hoursAllowedHTML.val();
	daysAllowedHTML.val(timeAllowed/7.5);
	currentYearNode['-timeAllowed'] = timeAllowed;
	updateTotalSpareDays();
}

function updateTotalSpareDays(){
	var sum = parseFloat(parseFloat(timeAllowed) + parseFloat(carriedOver) -  parseFloat(hoursPlanned) - parseFloat(hoursTaken));
	totalSpareHoursHTML.html(sum);
	totalSpareDaysHTML.html(parseFloat(sum/7.5));
}

function prevYear(){
	changeYear(-1)
};

function nextYear(){
	changeYear(1)
};

function changeYear(diff){
	currentYear = parseFloat(currentYear) + parseFloat(diff);
	holidayTakenSoFar();

	YAHOO.calendar.cal1.setYear(currentYear);
	doLoad();
	YAHOO.calendar.cal1.render();

	setYearPeriod();
	populateControlBox("", "", "", "");
	updateCarriedOverTime();
	updateTimeAllowed();
}

function countHolidays(){
	var numberOfHolidays = dateListObject.length;
};

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

$(document).ready(init());