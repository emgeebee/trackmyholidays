var icalTemplate = [
	"BEGIN:VCALENDAR",
	"VERSION:2.0",
	"PRODID:trackMyHolidays",
	"X-WR-CALNAME:trackMyHolidays",
	"X-WR-CALDESC:trackMyHolidays",
	"CALSCALE:GREGORIAN",
	"CONTENT",
	"END:VCALENDAR"
]

var eventTemplate = function(){
	var d = new Date();
	this.BEGIN = "VEVENT";
	this.UID = d.getTime();
	this.DTSTAMP = DTSTAMP = getICALDate(d.getFullYear(), (parseInt(d.getMonth())+1), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds());
	this.TITLE = "";
	this.DTSTART = "";
	this.DTEND = "";
	this.DESCRIPTION = "";
	this.SUMMARY = "";
	this.CLASS = "PUBLIC";
	this.CATEGORIES = "HOLIDAY";
	this.LOCATION = "Annual Leave";
	this.ALARM = $('#ical-reminder').val();
	this.END = "VEVENT";
};

var alarmTemplate = function(){
	this.BEGIN =  "VALARM";
	this.TRIGGER = "-PT" + $('#ical-reminder').val() + "M";
	this.ACTION =  "DISPLAY";
	this.DESCRIPTION =  "Reminder";
	this.END =  "VALARM";
}

var generateIcal = function(element){
	var string = "";
	for (var i = 0; i < icalTemplate.length; i++){
		if(icalTemplate[i] == "CONTENT"){
			string = generateEvents(string);
		} else {
			string += "" + icalTemplate[i];
			if(i < icalTemplate.length - 1){
				string += "\n";
			}
		}
	}
	showError(string);
	showError(escape(string));
	//window.open("data:text/calendar;charset=utf8," + escape(string));
	string = "data:text/calendar;charset=utf8," + escape(string);
	$(element).attr('href',string);
	$(element).attr('type','text/calendar');
}

var generateEvents = function(string){
	for(dateRangeItem in dateRange){
		if(dateRangeItem){
			showError(dateRangeItem);
			var eventItem = new eventTemplate();
			var dateArray = dateRangeItem.split(',');
			var startDate = dateArray[0];
			var startDateArray = startDate.split('/');
			eventItem.DTSTART = getICALDate(startDateArray[2], startDateArray[0], startDateArray[1], 0, 0 , 0);
			var endDate = dateArray[dateArray.length - 1];
			var endDateArray = endDate.split('/');
			eventItem.DTEND = getICALDate(endDateArray[2],endDateArray[0],endDateArray[1],23,59,59);
			eventItem.TITLE = $.trim(dateRange[dateRangeItem]['dateRangeFormattedString']);
			eventItem.DESCRIPTION = $.trim(dateRange[dateRangeItem]['dateRangeFormattedString'] + " " + dateRange[dateRangeItem]['holidayNotes']);
			eventItem.SUMMARY = $.trim(dateRange[dateRangeItem]['dateRangeFormattedString'] + " " + dateRange[dateRangeItem]['holidayNotes']);
			
			for(item in eventItem){
				showError("" + item + ':' + eventItem[item]);
				if (item == "ALARM"){
					if (eventItem[item] != "none"){
						string = generateAlarm(string);
					}
					continue;
				}
				string += "" + item + ':' + eventItem[item];
				string += "\n";
			}
		}
	}
	return string;
}

var generateAlarm = function(string){
	var alarmItem = new alarmTemplate();
	for(item in alarmItem){
		string += "" + item + ':' + alarmItem[item];
		string += "\n";
	}
	return string;
}

var getICALDate = function(year, month, day, hour, minute, second){
	var string = "";
	string += year;
	if (month < 10){
		string += '0' + month;
	} else {
		string += month;
	}
	if (day < 10){
		string += '0' + day;
	} else {
		string += day;
	}
	string += 'T';
	if (hour < 10){
		string += '0' + hour;
	} else {
		string += hour;
	}
	if (minute < 10){
		string += '0' + minute;
	} else {
		string += minute;
	}
	if (second < 10){
		string += '0' + second;
	} else {
		string += second;
	}
	return string;
}