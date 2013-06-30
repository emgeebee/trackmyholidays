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

var replaceDropboxButtons = function(){
	$('#useDropbox,#logout').toggle();
}

var resetSelectOptions = function(){
	$('#selectedDate').text('Select the first and last date of each holiday');
	$('.selectedDateControls>button').addClass('hidden');
	$('.selectedDateControls>label').addClass('hidden');
	$('.selectedDateDescription').addClass('hidden');
}

function setButtons(){
	$('#prevYear').click(function(){prevYear()});
	$('#nextYear').click(function(){nextYear()});
	carriedOverHoursHTML.change(function(){
		updateCarriedOverTime();
		saveXML();
	});
	carriedOverDaysHTML.change(function(){
		updateCarriedOverDays();
		saveXML();
	});
	hoursAllowedHTML.change(function(){
		updateTimeAllowed();
		saveXML();
	});
	daysAllowedHTML.change(function(){
		updateDaysAllowed();
		saveXML();
	});
	$('#updateYearStart').click(function(){
		setMonth(true);
	});
	$('#startup-monthstart').click(function(){
		setMonth(false);
	});
	$('input[name="weekend"]').on('change',function(){
		showError('updating the weekendDays');
		weekendDays = [];
		$('input[name="weekend"]:checked').each(function(){
			weekendDays.push($(this).val());
		})
		showError(weekendDays);
		renderDatesToCalendar();
	});
	$('#config').click(function(){
		$('#controls').show();
		$('#wrapper,header').hide();
		$('body').addClass('config');
		$("#controls").tabs({active: 0});
	});
	$('#control-close').click(function(){
		$('#controls').hide();
		$('#wrapper,header').show();
		$('body').removeClass('config');
	});
	$('.dayshoursswitcher').click(function(){
		$('.timeTableDays,.timeTableHours').toggleClass('hidden');
	});
	$('body').on('click',function(event){
		if(clicktodeselect == true && !isCalendarLink && !($(event.target).parent().hasClass('selector') || $(event.target).parent().hasClass('btn') || $(event.target).parent().attr('id') == 'dateDescription' || $(event.target).hasClass('selector') || $(event.target).hasClass('btn') || $(event.target).attr('id') == 'dateDescription')){		
			dateRangeSelection = 0;
			YAHOO.calendar.cal1.deselect(YAHOO.calendar.cal1.getSelectedDates());
			YAHOO.calendar.cal1.render();
			resetSelectOptions();
			clicktodeselect = false;
		} else if(isCalendarLink){
			clicktodeselect = true;
			isCalendarLink = false;
		}
	});
	$('#closefocus').on('click',function(){
	});
	$('#nextMonth').click(function(){
		$('.selectedgroup').removeClass('selectedgroup').next().addClass('selectedgroup');
		if($('.selectedgroup.last-of-type').length > 0){
			$('#nextMonth').hide();
		} else {
			$('#nextMonth').show();
		}
		$('#prevMonth').show();
	});
	$('#prevMonth').click(function(){
		$('.selectedgroup').removeClass('selectedgroup').prev().addClass('selectedgroup');
		if($('.selectedgroup.first-of-type').length > 0){
			$('#prevMonth').hide();
		} else {
			$('#prevMonth').show();
		}
		$('#nextMonth').show();
	});
	$('#monthstart').on('change', function(){
		$('#updateYearStart').show();
	});
	$('#comfortableview,#compactview').on('click', function(){
		$('#comfortableview,#compactview').toggle();
		$('body').toggleClass('big');
	});
	$('#dateFormat').on('change', function(){
		dateFormat = $(this).val();
		if(dateFormat===undefined){
			dateFormat = 'uk';
			setDateFormat();
		}
		resetFormattedDates();
		saveXML();
	});
	$('#bankHolidays,#startup-bankHolidays').on('change', function(){
		country = $(this).val();
		loadServerDates();
		saveXML();
	});
	$('#exporttolist').on('click', function(){
		exportToList();
	});
	$('#exporttoics').on('mousedown', function(){
		generateIcal($(this));
	});
	$('#logout,#compactview').hide();
	$( "#controls" ).tabs();
	for (var i = weekendDays.length - 1; i >= 0; i--) {
		$('input[name="weekend"][value="'+weekendDays[i]+'"]').prop("checked", true);
	};
}

var setCountry = function(){
	$('#bankHolidays').val(country);
}

var setDateFormat = function(){
	$('#dateFormat').val(dateFormat);
};

var populateControlBox = function(date, type, dateRange, formattedString){
/*	$('.groupcal').removeClass('selectedGroup');
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
	}*/

	var dateTitle = "";
	var size = dateRange.split(',').length;
	if(size == 1 && (type != 2 && type != "")){
		$('#halfday').removeClass('hidden');
		if(dateList[dateRange] && dateList[dateRange].halfday == true){
			$('#halfday>input').prop("checked", true);
		} else {
			$('#halfday>input').prop("checked", false);
		}
	} else {
		$('#halfday').addClass('hidden');
	}
	if (type == 1) {
		dateTitle = window.dateRange[date.dateRange]['holidayNotes'];
		$('#selectButton').addClass('hidden');
		$('#deselectButton,#updateButton').removeClass('hidden');
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
		$('#deselectButton,#updateButton,#selectButton').addClass('hidden');
	} else if (type == 3){
		$('#deselectButton,#updateButton').addClass('hidden');
		$('#selectButton').removeClass('hidden');
		$("#selectButton").unbind("click");
		$('#selectButton').on('click',function(){
			mySelectCell(dateRange, formattedString);
		});
	} else {
		return;
	}
	$('#selectedDate').html(formattedString);
	isCalendarLink = true;
	$('.selectedDateDescription').removeClass('hidden');
	$('#dateDescription').val(dateTitle);
};

//loads up the button commands 
function mySelectCell(dateRange, formattedString, halfday){
	if($('#halfday>input:checked').length == 1){
		halfday = true;
	} else {
		halfday = false;
	}
	dateRangeSelection = 0;
	var dateArray = dateRange.split(',');
	var title = $('#dateDescription').val();
	var date;
	for (var i = 0; i < dateArray.length; i++){
		date = dateListObject.addHoliday(dateArray[i], true, title, dateRange, formattedString, halfday);
	}
	renderDatesToCalendar();
	populateControlBox(date , 1, dateRange, formattedString);
	saveXML();
	$('.groupcal').removeClass('selectedgroup');
	resetSelectOptions();
};

function myUpdateCell(dateString){
	if($('#halfday>input:checked').length == 1){
		dateList[dateString].halfday = true;
	} else {
		dateList[dateString].halfday = false;
	}
	window.dateRange[dateString].holidayNotes = $('#dateDescription').val();
	renderDatesToCalendar();
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
	populateControlBox("" , 3, "", "");
	saveXML();
	$('.groupcal').removeClass('selectedgroup');
	resetSelectOptions();
};
