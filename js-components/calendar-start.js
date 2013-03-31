//State variables
var dateRangeSelection = 0;
var startDate;
var client = null;
var clicktodeselect = false;
var isCalendarLink = false;
var bankHolidays;

init = function(){
	setHTMLVariables();
	setStartYear();
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
	setStartYear();
}

$(document).ready(init());