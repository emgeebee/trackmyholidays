
function workingDateFromArray(workingDate){
	return workingDate[0][0][1] + '/' + workingDate[0][0][2] + '/' + workingDate[0][0][0];
}

var weekendRenderer = function(workingDate, cell){
	cell.innerHTML = "X";
	return YAHOO.widget.Calendar.STOP_RENDER;
}

function weekdayRenderer(workingDate, cell){
	var dateDay = workingDate.getDate();
	var workingDateFormatted = (workingDate.getMonth() + 1) + '/' + dateDay + '/' + workingDate.getFullYear();
	cell.title = '';
	return YAHOO.widget.Calendar.STOP_RENDER;
}

function bankHolidayRenderer(workingDate, cell){
	YAHOO.calendar.cal1.styleCellDefault(workingDate, cell);
	var dateDay = workingDate.getDate();

	addContentsToCell(cell, dateDay, "highlight4");
	return YAHOO.widget.Calendar.STOP_RENDER;
}

function normalRenderer(workingDate, cell) {
	YAHOO.calendar.cal1.styleCellDefault(workingDate, cell);
}

function holidayRenderer(workingDate, cell){
	YAHOO.calendar.cal1.styleCellDefault(workingDate, cell);
	var dateDay = workingDate.getDate();

	addContentsToCell(cell, dateDay, "highlight3");
	return YAHOO.widget.Calendar.STOP_RENDER;
}

function addContentsToCell(cell, dateDay, style){
	YAHOO.util.Dom.addClass(cell, style);
	cell.innerHTML = dateDay;
}

init = function(){
	setStartYear();
	setHTMLVariables();
	YAHOO.calendar.cal1 = new YAHOO.widget.CalendarGroup("calendarContainer", {
		PAGES: 12
	});
	YAHOO.calendar.cal1.selectEvent.subscribe(selectDateRange, YAHOO.calendar.cal1, true);

	//YAHOO.calendar.cal1.cfg.setProperty('MULTI_SELECT', true);
	resetSelectOptions();
	loadServerDates();
	setButtons();
	setYearPeriod();
	YAHOO.calendar.cal1.setYear(currentYear);
	YAHOO.calendar.cal1.setMonth(month);
	renderDatesToCalendar();
	startDropbox();
	doLoad();
}