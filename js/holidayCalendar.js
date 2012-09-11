/**
* @author matrulesok2
*/

YAHOO.namespace("calendar");

//XML variables
var xml;
var $xml;
var dates;
var bankHolidayXml;
var currentYearNode;

//Time variables
var currentDate = new Date();
var currentYear = currentDate.getFullYear();
var _TIMEALLOWED = 30 * 7.5;
var timeAllowed = _TIMEALLOWED;
var hoursTaken;
var hoursPlanned;
var carriedOver = 0;
var month;
var hasStartMonthBeenChanged = false;

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

function AddClassName(objElement, strClass, blnMayAlreadyExist) {
	if ( objElement.className ){
		var arrList = objElement.className.split(' ');
		if ( blnMayAlreadyExist ){
			var strClassUpper = strClass.toUpperCase();
			// find all instances and remove them
			for ( var i = 0; i < arrList.length; i++ ){
				// if class found
				if ( arrList[i].toUpperCase() == strClassUpper ){
					// remove array item
					arrList.splice(i, 1);
					// decrement loop counter as we have adjusted the array's contents
					i--;
				}
			}
		}
		// add the new class to end of list
		arrList[arrList.length] = strClass;
		// add the new class to beginning of list
		//arrList.splice(0, 0, strClass);
		// assign modified class name attribute
		objElement.className = arrList.join(' ');
	} else {
		// assign modified class name attribute
		objElement.className = strClass;
	}
}

function RemoveClassName(objElement, strClass) {
	// if there is a class
	if ( objElement.className ){
		// the classes are just a space separated list, so first get the list
		var arrList = objElement.className.split(' ');
		// get uppercase class for comparison purposes
		var strClassUpper = strClass.toUpperCase();
		// find all instances and remove them
		for ( var i = 0; i < arrList.length; i++ ){
			// if class found
			if ( arrList[i].toUpperCase() == strClassUpper ){
				// remove array item
				arrList.splice(i, 1);
				// decrement loop counter as we have adjusted the array's contents
				i--;
			}
		}
		// assign modified class name attribute
		objElement.className = arrList.join(' ');
	}
	// if there was no class
	// there is nothing to remove
}

function loadHolidaysFromXml (){

	dateListObject.clearDateList();
	var holidayYears = $xml.find('dateList');
	var selectedDate;
	var holidayDate;
	var dateRange;
	carriedOver = 0;
	timeAllowed = _TIMEALLOWED;


	var dateRangeFormattedString;
	currentYearNode = $('[id='+currentYear+']', $xml);
	if(currentYearNode.attr('carriedOver')){
		carriedOver = currentYearNode.attr('carriedOver');
	}
	if(currentYearNode.attr('timeAllowed')){
		timeAllowed = currentYearNode.attr('timeAllowed');
	}
	dates = currentYearNode.find('date');

	currentYearNode.find('date').each(function(){
		selectedDate = $(this);
		holidayDate = selectedDate.attr('id');
		dateRange = "";
		if(selectedDate.attr('daterange')){
			dateRange = selectedDate.attr('daterange');
		}
		dateRangeFormattedString = "";
		if(selectedDate.attr('daterangeformatted')){
			dateRangeFormattedString = selectedDate.attr('daterangeformatted');
		}
		notes = "";
		if(selectedDate.attr('notes')){
			notes = selectedDate.attr('notes');
		}
		dateListObject.addHoliday(holidayDate, true, notes, dateRange, dateRangeFormattedString);
	})
}

function loadBankHolidaysFromXml(){
	$(bankHolidayXml).find('bankHoliday').each(function(){
		holidayDate = $(this);
		dateListObject.addHoliday($(this).attr('id'), false, $(this).find('notes').text());
	});
}

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
	carriedOverDaysHTML.html(carriedOver/7.5);
	hoursAllowedHTML.val(timeAllowed);
	daysAllowedHTML.html(timeAllowed/7.5);

	updateTotalSpareDays();
	YAHOO.calendar.cal1.render();
}

function doLoad() {
	if(!hasStartMonthBeenChanged){
		var file = air.File.applicationStorageDirectory.resolvePath("dateList.xml");
		if (file.exists) {
			var fileStream = new air.FileStream();
			fileStream.open(file, air.FileMode.READ);
			xmlString = fileStream.readUTFBytes(fileStream.bytesAvailable);
			fileStream.close();
		} else {
			var xmlString = defaultXMLString();
			fileStream = new air.FileStream(); 
			fileStream.open(file, air.FileMode.WRITE);
			fileStream.writeUTFBytes(xmlString);
			fileStream.close();
		}
		var domParser = new DOMParser();
		xmldoc = $.parseXML(xmlString);
		$xml = $( xmldoc );
	}
	setYear();
	loadHolidaysFromXml();
	loadBankHolidaysFromXml();
	renderDatesToCalendar();
}

function setYear(){
	if(isNaN(month)){
		if($xml.find("holidays").attr('yearStart')){
			month = $xml.find("holidays").attr('yearStart');
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

function loadServerDates(){
	var file = air.File.applicationStorageDirectory.resolvePath("bankHolidayDateList.xml");
	if (file.exists) {
		var fileStream = new air.FileStream();
		fileStream.open(file, air.FileMode.READ);
		xmlString = fileStream.readUTFBytes(fileStream.bytesAvailable);
		fileStream.close();
	} else {
		var xmlString = defaultXMLString();
		fileStream = new air.FileStream(); 
		fileStream.open(file, air.FileMode.WRITE);
		fileStream.writeUTFBytes(xmlString);
		fileStream.close();
	}
	var domParser = new DOMParser();
	bankHolidayXml = $(domParser.parseFromString(xmlString, "text/xml"));
	var bankHolidayXmlObj = new XMLHttpRequest(); 
	bankHolidayXmlObj.open( "GET", "http://www.emgeebee.com/calendar/bankHolidayDateList.xml", true );
	bankHolidayXmlObj.send( null );
	bankHolidayXmlObj.onreadystatechange=function() {
		if (bankHolidayXmlObj.readyState == 4) {
			var responseXML = $(bankHolidayXmlObj.responseXML);
			var serverVersion = 0;
			var localVersion = 0;
			if($(responseXML).find('holidays').attr('issue')){
				serverVersion = $(responseXML).find('holidays').attr('issue');
			}
			if($(bankHolidayXml).find('holidays').attr('issue')){
				localVersion = $(bankHolidayXml).find('holidays').attr('issue');
			}
			if(parseFloat(serverVersion) > parseFloat(localVersion)){
				bankHolidayXml = responseXML;
				var serializer = new XMLSerializer();
				var outputString = serializer.serializeToString($(responseXML)[0]);
				var xmlStartTag = '<\?xml version="1.0" encoding="utf-8"\?\>';
				var xmlOutputString = xmlStartTag.concat(outputString);
				fileStream = new air.FileStream(); 
				fileStream.open(file, air.FileMode.WRITE);
				fileStream.writeUTFBytes(xmlOutputString);
				fileStream.close();

				alert('New bank holiday dates added from server');
				loadBankHolidaysFromXml();
				renderDatesToCalendar();
				return;
			}
		}
	}
};

function defaultXMLString(){
	var domParser = new DOMParser();
	xmlString = '<?xml version="1.0" encoding="utf-8"?><holidays><dateList></dateList></holidays>';
	return xmlString;
}

function writeDatesBackToXML(){
	if(hasStartMonthBeenChanged){
		$xml.find('dateList').remove();
	}
	if($('[id='+currentYear+']', $xml).length > 0){
		$xml.find('[id='+currentYear+']').empty();
	} else {
		var dateListNode = $('<dateList></dateList>');
		dateListNode.attr('id', currentYear).appendTo($xml.find('holidays'));
	}
	for (date in dateList){
		if(dateList[date].isHoliday){
			$('<date></date>')
				.attr('id', date)
				.attr('dateRangeFormatted', dateRange[dateList[date].dateRange]['dateRangeFormattedString'])
				.attr('notes', dateRange[dateList[date].dateRange]['holidayNotes'])
				.attr('dateRange', dateList[date].dateRange)
				.appendTo($('[id='+currentYear+']', $xml));
		}
	}
	if(month != 0){
		$xml.find('holidays').attr('yearStart', month);
	}
}

function saveXML() {
	writeDatesBackToXML();
	var serializer = new XMLSerializer();
	var outputString = serializer.serializeToString($xml[0]);
	if (outputString.substring(0,4) == "<hol") {
		var xmlStartTag = '<\?xml version="1.0" encoding="utf-8"\?\>';
		var xmlOutputString = xmlStartTag.concat(outputString);
		var file = air.File.applicationStorageDirectory.resolvePath("dateList.xml");
		fileStream = new air.FileStream(); 
		fileStream.open(file, air.FileMode.WRITE);
		fileStream.writeUTFBytes(xmlOutputString);
		fileStream.close();
	}
}

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

function dateRangeFormattedString(dateArray){
	return dateArray[0] + " - " + dateArray[dateArray.length - 1] + " (" + dateArray.length + " days)";
}

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

var populateControlBox = function(date, type, dateRange, formattedString){
	var dateTitle = "";
	$('#selectedDate').html(formattedString);
	if (type == 1) {
		dateTitle = window.dateRange[date.dateRange]['holidayNotes'];
		$('#selectButton').hide();
		$('#deselectButton,#updateButton').show();
		$('#deselectButton').click(function(){
			myDeselectCell(date.dateRange);
		});
		$('#updateButton').click(function(){
			myUpdateCell(date.dateRange);
		});
	} else if (type == 2) {
		dateTitle = date['holidayNotes'];
		$('#deselectButton,#updateButton,#selectButton').hide();
	} else if (type == 0){
		$('#deselectButton,#updateButton').hide();
		$('#selectButton').show();
		$('#selectButton').click(function(){
			mySelectCell(dateRange, formattedString);
		});
	}
	$('#selectOptions').show();
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
};

function myUpdateCell(dateString){
	window.dateRange[dateString].holidayNotes = $('#dateDescription').val();
	saveXML();
};

function myDeselectCell(dateString){
	dateArray = dateString.split(',');
	for (var i = 0; i < dateArray.length; i++){
		dateListObject.removeHoliday(dateArray[i]);
	}
	renderDatesToCalendar();
	populateControlBox("" , 0, "", "");
	saveXML();
};

function workingDateFromDateObject(date){
	return parseInt(parseInt(date.getMonth()) + 1) + '/' + date.getDate() + '/' + date.getFullYear();
}

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

function updateCarriedOverTime(){
	carriedOver = carriedOverHoursHTML.val();

	carriedOverDaysHTML.html(carriedOver/7.5);
	currentYearNode.attr('carriedOver', carriedOver);
	updateTotalSpareDays();
}

function updateTimeAllowed(){
	timeAllowed = hoursAllowedHTML.val();
	daysAllowedHTML.html(timeAllowed/7.5);
	currentYearNode.attr('timeAllowed', timeAllowed);
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
	doLoad(YAHOO.calendar.cal1);
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

function setButtons(){
	$('#prevYear').click(function(){prevYear()});
	$('#nextYear').click(function(){nextYear()});
	carriedOverHoursHTML.change(function(){
		updateCarriedOverTime();
		saveXML();
	});
	hoursAllowedHTML.change(function(){
		updateTimeAllowed();
		saveXML();
	});
	$('#updateYearStart').click(function(){
		setMonth();
	})
	$('#config,#control-close').click(function(){
		$('#controls').toggle();
	});
	$('#dayshourscolumn').click(function(){
		$('.timeTableDays,.timeTableHours').toggle();
	})
}

function setMonth(){
	var confirmation=confirm("Are you sure you want to change the start month? Doing this will erase all dates saved.");
	if (confirmation==true){
		hasStartMonthBeenChanged = true;
		month = $('#monthstart').val();
		month = parseInt(month - 1);
		$xml.find('date').remove();
		window['dateList'] = new Object();
		window['dateRange'] = new Object();
		doLoad(YAHOO.calendar.cal1);
		holidayTakenSoFar();
		YAHOO.calendar.cal1.setMonth(month);
		YAHOO.calendar.cal1.render();
		updateTotalSpareDays();
		saveXML();
	}
}

YAHOO.calendar.init = function(){
air.Introspector.Console.log('start');
	setHTMLVariables();
	YAHOO.calendar.cal1 = new YAHOO.widget.CalendarGroup("calendarContainer", {
		PAGES: 12
	});
	YAHOO.calendar.cal1.selectEvent.subscribe(selectDateRange, YAHOO.calendar.cal1, true);

	//YAHOO.calendar.cal1.cfg.setProperty('MULTI_SELECT', true);
	YAHOO.calendar.cal1.setYear(currentYear);
air.Introspector.Console.log('0');
	loadServerDates();
air.Introspector.Console.log('1');
	doLoad();
	setButtons();
	YAHOO.calendar.cal1.setMonth(month);

	setYearPeriod();
	YAHOO.calendar.cal1.render();
}


$(document).ready(YAHOO.util.Event.onDOMReady(YAHOO.calendar.init));