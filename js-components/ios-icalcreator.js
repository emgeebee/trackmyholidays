var cal;

var calendarSuccess = function(){
	var LOCATION = "Annual Leave";
	if(newEvents.length > 0){
		var newItem = newEvents.pop();
		showError('Adding calendar');
		showError(newItem.SUMMARY);
		cal.createEvent(newItem.SUMMARY,LOCATION,newItem.SUMMARY,newItem.DTSTART,newItem.DTEND,window.eventAlarm,calendarSuccess,calendarFail);
	}
}
var calendarDeleteSuccess = function(){
	showError('Removed calendars');
	var LOCATION = "Annual Leave";
	for(dateRangeItem in dateRange){
		if(dateRangeItem){

			showError(dateRangeItem);
			var item = {};
			var dateArray = dateRangeItem.split(',');
			var startDate = dateArray[0];
			var startDateArray = startDate.split('/');
			item.DTSTART = getICALDate(startDateArray[2], startDateArray[0], startDateArray[1], 0, 0 , 0);

			var endDate = dateArray[dateArray.length - 1];
			var endDateArray = endDate.split('/');
			item.DTEND = getICALDate(endDateArray[2],endDateArray[0],endDateArray[1],23,59,59);

			item.SUMMARY = $.trim(dateRange[dateRangeItem]['dateRangeFormattedString'] + " " + dateRange[dateRangeItem]['holidayNotes']);

			newEvents.push(item);
		}
	}
	if(newEvents.length > 0){
		var newItem = newEvents.pop();
		showError('Adding calendar');
		showError(newItem.SUMMARY);
		cal.createEvent(newItem.SUMMARY,LOCATION,newItem.SUMMARY,newItem.DTSTART,newItem.DTEND,window.eventAlarm,calendarSuccess,calendarFail);
	}
}

var calendarFail = function(){
	showError('Failed adding calendars');
}

var generateIcal = function(element){
	var LOCATION = "Annual Leave";
	window.newEvents = [];
	window.eventAlarm = $('#ical-reminder').val() * 60;
	cal.deleteEvent('',LOCATION,'','','', true, calendarDeleteSuccess, calendarFail);
}


function exportToList(){
	resetFormattedDates();
	var string = "";
	for (dateRangeItem in dateRange){
		if(dateRangeItem != ""){
			string += '\n' + dateRange[dateRangeItem]['dateRangeFormattedString'];
		}
	}
	
	cordova.exec(exportSuccess, exportFail, "calendarPlugin", "copydates", [string]);
	string += '\n\n These dates have also been added to your clipboard.';

	holalert(string);
}

var exportSuccess = function(){
	showError('Added clipboard data');
}

var exportFail = function(){
	showError('Failed adding clipboard data');
}


var getICALDate = function(year, month, day, hour, minute, second){
	var string = "";
	string += year;
	string += '-';
	if (month < 10){
		string += '0' + month;
	} else {
		string += month;
	}
	string += '-';
	if (day < 10){
		string += '0' + day;
	} else {
		string += day;
	}
	string += ' ';
	if (hour < 10){
		string += '0' + hour;
	} else {
		string += hour;
	}
	string += ':';
	if (minute < 10){
		string += '0' + minute;
	} else {
		string += minute;
	}
	string += ':';
	if (second < 10){
		string += '0' + second;
	} else {
		string += second;
	}
	return string;
}