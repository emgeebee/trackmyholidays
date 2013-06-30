
//Time variables
var currentDate = new Date();
var currentYear = currentDate.getFullYear();
var _TIMEALLOWED = 30 * 7.5;
var timeAllowed = _TIMEALLOWED;
var weekendDays = ['0','6'];
var hoursTaken;
var hoursPlanned;
var carriedOver = 0;
var month = 8;
var hasStartMonthBeenChanged = false;
var defaultDates = {"-yearStart": "8","dateList": {}}

window['dateList'] = new Object();
var dateList = window['dateList'];

window['dateRange'] = new Object();

var dateListObject = {
	addHoliday : function(date, isHoliday, title, dateRange, dateRangeFormattedString, halfday){
		window['dateList'][date] = new holidayObject(isHoliday, title, dateRange, halfday);
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
	}
}

//var dateList = new Object();

function holidayObject (isHoliday, title, dateRange, halfday){
	//new Object();
	this['isHoliday'] = isHoliday;
	this['isBankHoliday'] = !isHoliday;
	this['holidayNotes'] = title;
	this['dateRange'] = dateRange;
	this['halfday'] = halfday;
	return this;
}

function dateRangeObject (title, dateRangeFormattedString){
	//new Object();
	this['holidayNotes'] = title;
	this['dateRangeFormattedString'] = dateRangeFormattedString;
	return this;
}

// loops through the dates in the datelist and makes sure that they are all added to the calendar

function renderDatesToCalendar(){
	var i = 0;
	YAHOO.calendar.cal1.removeRenderers();
	for (var i = weekendDays.length - 1; i >= 0; i--) {
		var weekenedDay = parseInt(weekendDays[i]) + 1;
		showError('weekend renderer for ' + weekenedDay)
		YAHOO.calendar.cal1.addWeekdayRenderer(weekenedDay, weekendRenderer);
	};
	YAHOO.calendar.cal1.setYear(currentYear);
	YAHOO.calendar.cal1.setMonth(month);

	for (date in dateList) {
		if (dateList[date].isHoliday){
			if('halfday' in dateList[date] && dateList[date]['halfday'] == true){
				YAHOO.calendar.cal1.addRenderer(date, halfdayRenderer);
			} else {
				YAHOO.calendar.cal1.addRenderer(date, holidayRenderer);
			}
		} else if (dateList[date].isBankHoliday) {
			YAHOO.calendar.cal1.addRenderer(date, bankHolidayRenderer);
		}
	}
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
		if(holidayNode['-yearStart']){
			month = parseInt(holidayNode['-yearStart']);
		} else {
			month = 8;
		}
		showError('set month to be ' + month);
	}
	showError('using month ' + month);
	if (currentDate.getMonth() < month){
		currentYear = parseInt(currentDate.getFullYear()) - 1;
	} else {
		currentYear = parseInt(currentDate.getFullYear());
	}
	showError('using currentYear ' + currentYear);
	startYear = currentYear;
	endYear = currentYear + 1;
	var jsmonth = parseInt(month) + 1;
	if(parseInt(jsmonth)<10){
		$('#monthstart').val('0'+jsmonth);
	} else {
		$('#monthstart').val(''+jsmonth);
	}
	setYearPeriod();
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
		var isBankHoliday = false;
		if(date != null){
			if(date.isBankHoliday){
				isBankHoliday = true;
			}
		}
		if (!isBankHoliday && weekendDays.indexOf(dateIterator.getDay()+"") == -1) {
			dateArray.push(workingDateFormatted);
		}
		dateIterator.setDate(dateIterator.getDate() + 1);
	}
	return dateArray;
}


//the handler for when a date range is selected

function selectDateRange(operation, workingDate){
	var workingDateFormatted = formattedDateFromArray(workingDate);
	var workingDateString = workingDateFromArray(workingDate);
	var date = window['dateList'][workingDateString];
	if (date){
		dateRangeSelection = 0;
		if (date.isBankHoliday){
			populateControlBox(date, 2, workingDateString, workingDateFormatted);
		} else if (date.isHoliday) {
			populateControlBox(date, 1, date.dateRange, window.dateRange[date.dateRange]['dateRangeFormattedString']);
		}
	} else if(dateRangeSelection){
		var dateArray = getRangeOfDates(startDate, workingDate);
		dateRangeSelection = 0;
		YAHOO.calendar.cal1.cfg.setProperty('selected', dateArray.join(','), false);
		YAHOO.calendar.cal1.render();
		populateControlBox("", 3, dateArray.join(','), dateRangeFormattedString(dateArray));
	} else {
		startDate = workingDate;
		dateRangeSelection = 1;
		populateControlBox("", 3, workingDateFromArray(workingDate), formattedDateFromArray(startDate));
	}
}


// formats the date range string

function dateRangeFormattedString(dateArray){
	if(dateArray.length > 1){
		return formattedDateFromStringDate(dateArray[0]) + " - " + formattedDateFromStringDate(dateArray[dateArray.length - 1]) + " (" + dateArray.length + " days)";
	} else {
		return formattedDateFromStringDate(dateArray[0])
	}
};

function formattedDateFromStringDate(stringDate){
	var dateArray = stringDate.split('/');
	if(dateFormat == 'uk'){
		return dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2];
	} else {
		return dateArray[0] + '/' + dateArray[1] + '/' + dateArray[2];
	}
}

function workingDateFromArray(workingDate){
	return workingDate[0][0][1] + '/' + workingDate[0][0][2] + '/' + workingDate[0][0][0];
}

function formattedDateFromArray(workingDate){
	if(dateFormat == 'uk'){
		return workingDate[0][0][2] + '/' + workingDate[0][0][1] + '/' + workingDate[0][0][0];
	} else {
		return workingDate[0][0][1] + '/' + workingDate[0][0][2] + '/' + workingDate[0][0][0];
	}
};

function formattedDateFromDateObject(date){
	if(dateFormat == 'uk'){
		return date.getDate() + '/' + parseInt(parseInt(date.getMonth()) + 1) + '/' + date.getFullYear();
	} else {
		return parseInt(parseInt(date.getMonth()) + 1) + '/' + date.getDate() + '/' + date.getFullYear();
	}
};

function workingDateFromDateObject(date){
	return parseInt(parseInt(date.getMonth()) + 1) + '/' + date.getDate() + '/' + date.getFullYear();
}

function holidayTakenSoFar(){
	var i = 0;
	var j = 0;
	for (date in dateList) {
		if(date == null || date == ""){
			delete dateList[date];
			continue;
		}
		if (dateList[date]['isHoliday'] != true){
			continue;
		}
		var dateSplit = date.split('/');
		var dateobj = new Date(dateSplit[2], dateSplit[0] - 1, dateSplit[1]);
		if (dateobj.getTime() < currentDate.getTime()) {
			i++;
			if('halfday' in dateList[date]){
				if (dateList[date]['halfday'] != true){
					i++
				}
			}
		} else {
			j++;
			if('halfday' in dateList[date]){
				if (dateList[date]['halfday'] != true){
					j++
				}
			}
		}
	}
	hoursTaken = i * 7.5 / 2;
	hoursPlanned = j * 7.5 / 2;
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
	totalSpareDaysHTML.html(parseInt(10*sum/7.5)/10);
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
	gotNewDates(dates);
	YAHOO.calendar.cal1.render();

	setYearPeriod();
	resetSelectOptions();
	updateCarriedOverTime();
	updateTimeAllowed();
}

function countHolidays(){
	var numberOfHolidays = dateListObject.length;
};

function resetFormattedDates(){
	for (date in dateRange){
		if(date != ""){
			var dateArray = date.split(',');
			dateRange[date].dateRangeFormattedString = dateRangeFormattedString(dateArray);
		}
	}
}

