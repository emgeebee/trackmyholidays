
function loadServerDates(){
	var file;

    var json = $.ajax({
    	type: 'GET',
    	//url: "http://localhost/code/calendarApp/js/bankholidayJSON.json",
    	url: "http://trackmyholidays.com/js/bankholidayJSON.json",
    	dataType: 'json',
    	success: function(data,i){
			bankHolidays = data;
			serverVersion = data.holidays['-issue'];
			loadBankHolidaysFromXml();
			renderDatesToCalendar();
		},
    	data: {},
    	async: false
    });

};


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
		if(dateList[date].isHoliday){
			dates.dateList[currentYear]['date'].push({
				'-id':date,
				'-dateRangeFormatted':dateRange[dateList[date].dateRange]['dateRangeFormattedString'],
				'-dateRange':dateList[date].dateRange,
				'-notes': dateRange[dateList[date].dateRange]['holidayNotes']
			})
		}
	}
	if(month != 0){
		dates.yearStart = month;
	}
}

function saveXML() {
	writeDatesBackToXML();
	var outputString = JSON.stringify(dates);
	if(client && client.authState != 1){
		client.writeFile("savedHolidayDates.json", outputString, function(error, stat) {
			if (error) {
				return showError(error);  // Something went wrong.
			}
		});
	} else {
		localStorage.holidayTrackerDates = outputString;
	}
}


function doLoad() {
	showError('loading' + currentYear);
	if(client != null && client.authState != 1){
		showError('loading from dropbox');
		client.readFile("savedHolidayDates.json", function(error, data) {
			if (error) {
				return showError(error);  // Something went wrong.
			}
			dates = $.parseJSON(data);
			showError(dates);
			loadHolidaysFromXml(dates);
			loadBankHolidaysFromXml();
			renderDatesToCalendar();
		});
	} else {
		if (localStorage.holidayTrackerDates){
			showError('loading from local storage');
			dates = $.parseJSON(localStorage.holidayTrackerDates);
			showError(dates)
			loadHolidaysFromXml(dates);
			loadBankHolidaysFromXml();
		} else {
			dates = defaultDates;
			showError('loading default dates');
			showError(dates);
			loadHolidaysFromXml(dates);
		}
		renderDatesToCalendar();
	}
}

function loadBankHolidaysFromXml(){
	if(bankHolidays && bankHolidays.holidays){
		$.each(bankHolidays.holidays.bankHolidaydateList, function(holidayList){
			if(this['-id'] == currentYear || this['-id'] == currentYear+1 ){
				for (var i = 0; i < this.bankHolidayList.bankHoliday.length; i++){
					holidayDate = this.bankHolidayList.bankHoliday[i]['-id'];
					dateListObject.addHoliday(holidayDate, false, this.bankHolidayList.bankHoliday[i]['notes']);
				};

			}
		});
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
	currentYearNode = holidayNode.dateList[currentYear];


		showError('loading date ' + currentYear)

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
			notes = "";
			if(selectedDate['-notes']){
				notes = selectedDate['-notes'];
			}
			dateListObject.addHoliday(holidayDate, true, notes, dateRange, dateRangeFormattedString);
		}
	}
}

function setMonth(){
	var confirmation=confirm("Are you sure you want to change the start month? Doing this will erase all dates saved.");
	if (confirmation==true){
		month = $('#monthstart').val();
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
