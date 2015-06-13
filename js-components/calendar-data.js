function gotServerDates(data){
	showError('GOT SERVER DATES');
	showError(data);
	data = $.parseJSON(data);
	bankHolidays = data;
	serverVersion = data['-issue'];
	for (checkdate in dateList){
		currdate = dateList[checkdate];
		if(currdate.isBankHoliday){
			dateListObject.removeHoliday(checkdate);
			var dateSplit = checkdate.split('/');
			var jsdate = new Date(dateSplit[2], dateSplit[0] - 1, dateSplit[1]);
			for(dateRangeItem in dateRange){
				var dateArray = dateRangeItem.split(',');
				var firstDate = dateArray[0].split('/');
				var endDate = dateArray[dateArray.length - 1].split('/');

				var dateIterator = new Date();
				dateIterator.setFullYear(firstDate[2], firstDate[0]- 1, firstDate[1]);
				var date2 = new Date();
				date2.setFullYear(endDate[2], endDate[0]- 1, endDate[1]);

				while (dateIterator <= date2){
					var workingDateFormatted = workingDateFromDateObject(dateIterator);
					var holiday = window['dateList'][workingDateFormatted];
					if (weekendDays.indexOf(dateIterator.getDay()) > -1) {
						dateListObject.addHoliday(workingDateFromDateObject(dateIterator), true, dateRange[dateRangeItem]['holidayNotes'], dateRangeItem, dateRange[dateRangeItem]['dateRangeFormattedString']);
					}
					dateIterator.setDate(dateIterator.getDate() + 1);
				}
			}
		}
	}
	loadBankHolidaysFromXml();
	renderDatesToCalendar();

}

function gotBankHolidayOptions(data){
	showError('GOT HOLIDAY OPTIONS');
	showError(data);
	data = $.parseJSON(data);
	for (thiscountry in data){
		$('#bankHolidays').append('<option value="'+thiscountry+'">'+thiscountry+'</option>');
		$('#startup-bankHolidays').append('<option value="'+thiscountry+'">'+thiscountry+'</option>');
	}
	$('#bankHolidays').val(country);
}

function writeDatesBackToXML(){
	if(dates.dateList[currentYear]){
		currentYearNode.date = [];
		dates.dateList[currentYear] = currentYearNode;
	} else {
		dates.dateList[currentYear] = {};
		currentYearNode.date = [];
		dates.dateList[currentYear] = currentYearNode;
	}

	for (date in dateList){
		if(dateList[date].isHoliday == true){
			dates.dateList[currentYear]['date'].push({
				'-id':date,
				'-dateRangeFormatted':dateRange[dateList[date].dateRange]['dateRangeFormattedString'],
				'-dateRange':dateList[date].dateRange,
				'-notes': dateRange[dateList[date].dateRange]['holidayNotes'],
				'-halfday': dateList[date]['halfday'],
				'-isBankHoliday': false
			})
		} else {
			dates.dateList[currentYear]['date'].push({
				'-id':date,
				'-notes': dateList['holidayNotes'],
				'-isBankHoliday': true
			})
		}
	}
	if(month != 0){
		dates['-yearStart'] = month;
	}
	dates['-country'] = country;
	dates['-dateFormat'] = dateFormat;
	dates['-weekendDays'] = weekendDays.join();
};

function saveXML() {
	writeDatesBackToXML();
	var outputString = JSON.stringify(dates);
	setLocalStorage(outputString);
	if(client != null && client.isAuthenticated()){
		client.writeFile("savedHolidayDates.json", outputString, function(error, stat) {
			if (error) {
				return showError(error);  // Something went wrong.
			}
		});
	}
}

function loadFromDropbox(){
	showError('loading from dropbox');
	firstTimeUser = false;
	closeStartup(false);
	client.readFile("savedHolidayDates.json", function(error, data) {
		if (error) {
			return showError(error);  // Something went wrong.
		}
		dates = $.parseJSON(data);
		gotNewDates(dates);
		setStartYear(dates);
	});
}

function loadFromLocal(){
	usingDropbox = false;
	if (isLocalStorage() == true){
		firstTimeUser = false;
		showError('loading from local storage');
		dates = $.parseJSON(getLocalStorage());
		gotNewDates(dates);
		setStartYear(dates);
	} else {
		dates = defaultDates;
		firstTimeUser = true;
		showError('loading default dates');
		gotNewDates(dates);
		setStartYear(dates);
	}
}

function doLoad() {
	tryDropboxLoad();
}

function gotNewDates(dates) {
	showError(dates);
	loadHolidaysFromXml(dates);
	loadBankHolidaysFromXml();
	renderDatesToCalendar();
}

function loadBankHolidaysFromXml(){
	if(bankHolidays != null && bankHolidays['bankHolidaydateList']){
		var yearToCheck = currentYear;
		var thisDate;
		while(yearToCheck <= currentYear + 1){
			for (index in bankHolidays['bankHolidaydateList'][yearToCheck]){
				thisDate = bankHolidays['bankHolidaydateList'][yearToCheck][index];
				dateListObject.addHoliday(index, false, thisDate['notes']);
			};
			yearToCheck++;
		};
	}
}

function loadHolidaysFromXml (holidayNode){
	dateListObject.clearDateList();
	var selectedDate;
	var holidayDate;
	var dateRange;
	var dateRangeFormattedString;
	carriedOver = 0;
	timeAllowed = _TIMEALLOWED;

	country = holidayNode['-country'];
	dateFormat = dates['-dateFormat'];
	if(dateFormat===undefined){
		dateFormat = 'uk';
		setDateFormat();
	}
	month = dates['-yearStart'];
	if(dates['-weekendDays'] != null){
		weekendDays = dates['-weekendDays'].split(',');
		for (var i = weekendDays.length - 1; i >= 0; i--) {
			$('input[name="weekend"][value="'+weekendDays[i]+'"]').prop("checked", true);
		};
	}
	showError('dateFormat = ' + dateFormat);
	showError('country = ' + country);
	setCountry();
	setDateFormat();
	showError('loading year ' + currentYear);
	currentYearNode = holidayNode.dateList[currentYear];

	if(currentYearNode == null){
		currentYearNode = {};
		currentYearNode['-carriedOver'] = carriedOver;
		currentYearNode['-timeAllowed'] = timeAllowed;
		currentYearNode.date = [];
	} else {
		if(currentYearNode['-carriedOver']){
			carriedOver = currentYearNode['-carriedOver'];
		}
		if(currentYearNode['-timeAllowed']){
			timeAllowed = currentYearNode['-timeAllowed'];
		}

		for (var i = 0; i < currentYearNode['date'].length; i++){
			selectedDate = currentYearNode['date'][i];
			holidayDate = selectedDate['-id'];
			dateRange = "";
			if(selectedDate['-dateRange']){
				dateRange = selectedDate['-dateRange'];
			}
			dateRangeFormattedString = "";
			if(selectedDate['-dateRangeFormatted']){
				dateRangeFormattedString = selectedDate['-dateRangeFormatted'];
			}
			if(selectedDate['-halfday']){
				halfday = selectedDate['-halfday'];
			} else {
				halfday = false;
			}
			notes = "";
			if(selectedDate['-notes']){
				notes = selectedDate['-notes'];
			}
			if(selectedDate['-isBankHoliday'] == true){
				var isHoliday = false;
			} else {
				var isHoliday = true;
			}
			dateListObject.addHoliday(holidayDate, isHoliday, notes, dateRange, dateRangeFormattedString,halfday);
		}
	}
}

function setMonth(askQuestion){
	if(askQuestion == true){
		var confirmation=confirm("Are you sure you want to change the start month? Doing this will erase all dates saved.");
	} else {
		confirmation = true;
	}
	if (confirmation==true){
		month = $('#monthstart').val();
		showError(month);
		month = parseInt(month - 1);
		dates['-yearStart'] = month;
		dates.dateList = {};
		window['dateList'] = new Object();
		window['dateRange'] = new Object();	
		YAHOO.calendar.cal1.deselect(YAHOO.calendar.cal1.getSelectedDates());
		renderDatesToCalendar();
		holidayTakenSoFar();
		YAHOO.calendar.cal1.setMonth(month);
		YAHOO.calendar.cal1.render();
		updateTotalSpareDays();
		saveXML();
	}
}
