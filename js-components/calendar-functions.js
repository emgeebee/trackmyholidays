YAHOO.namespace("calendar");

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
