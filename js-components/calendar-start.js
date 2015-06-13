//State variables
var dateRangeSelection = 0;
var startDate;
var client = null;
var clicktodeselect = false;
var isCalendarLink = false;
var bankHolidays;
var dateFormat = 'uk';
var country;
var firstTimeUser = false;
var usingDropbox = false;
$('#startup').hide();

var isFirstTime = function(){
	if(firstTimeUser == true){
		$('#startup').show();
		$('#wrapper').hide();
		$('#controls,h1>.btn,#yearControlBlock').hide();
		$("#startup-carriedOverDays").bind("change", function() {
			$("#carriedOverDays").val($(this).val());
			updateCarriedOverDays();
		});
		$("#startup-carriedOver").bind("change", function() {
			$("#carriedOver").val($(this).val());
			updateCarriedOverTime();
		});
		$("#startup-timeAllowed").bind("change", function() {
			$("#timeAllowed").val($(this).val());
			updateTimeAllowed();
		});
		$("#startup-daysAllowed").bind("change", function() {
			$("#daysAllowed").val($(this).val());
			updateDaysAllowed();
		});
		$("#startup-bankHolidays").on("change", function() {
			$("#bankHolidays").val($(this).val());
		});
		$('#startup-monthstart').on('change',function(){
			$("#monthstart").val($(this).val());
			setMonth(false);
		});
		$("#startup-dateFormat").on("change", function() {
			dateFormat = $(this).val();
			resetFormattedDates();
			$("#dateFormat").val($(this).val());
		});
		$('body').removeClass('config');
	} else {
		$('#startup').remove();
	}
	$('#startup-go').on('click', function(){
		closeStartup(true);
	})
	
}

var closeStartup = function(showWarning){
	if(showWarning == true){
		holalert('To select your holiday simply click the start and end date for each holiday and save the dates. The amount of remaining leave will then be shown in the top right corner.');
	}
	$('#startup').hide();
	$('#wrapper,h1>.btn,#yearControlBlock').show();
}


init = function(){
	showError('starting up');
	setHTMLVariables();
	setStartYear();
	YAHOO.calendar.cal1 = new YAHOO.widget.CalendarGroup("calendarContainer", {
		PAGES: 12
	});
	YAHOO.calendar.cal1.selectEvent.subscribe(selectDateRange, YAHOO.calendar.cal1, true);
	showError('starting up - prepared the calendar');
	//YAHOO.calendar.cal1.cfg.setProperty('MULTI_SELECT', true);
	resetSelectOptions();
	setButtons();
	setYearPeriod();
	showError('Done the UI');
	YAHOO.calendar.cal1.setYear(currentYear);
	YAHOO.calendar.cal1.setMonth(month);
	showError('Refreshed the calendar');
	renderDatesToCalendar();
	doLoad();
	loadServerDates();
	getBankHolidayOptions();
	showError('Loaded the data');
	isFirstTime();
}