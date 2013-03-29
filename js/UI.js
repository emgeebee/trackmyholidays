var replaceDropboxButtons = function(){
	$('#useDropbox,#logout').toggle();
}

var resetSelectOptions = function(){
	$('#selectedDate').text('Select the first and last date of each holiday');
	$('.selectedDateControls>button').hide();
	$('.selectedDateDescription').hide();
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
		setMonth();
	})
	$('#useDropbox').click(function(){
		callDropbox();
	})
	$('#config,#control-close').click(function(){
		$('#controls').toggle();
		$('body').toggleClass('config');
		$("#controls").tabs({active: 0});
	});
	$('#dayshourscolumn').click(function(){
		$('.timeTableDays,.timeTableHours').toggle();
	});
	$('body').on('click',function(){
		if(clicktodeselect == true && !isCalendarLink && !($(event.target).hasClass('selector') || $(event.target).hasClass('btn') || $(event.target).attr('id') == 'dateDescription')){		
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
	})
	$('#logout,#compactview').hide();
	$( "#controls" ).tabs();
}