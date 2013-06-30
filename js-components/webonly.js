var baseUrl = location.href.split('#')[0];

$(document).ready(function(){
	init();
	startDropbox();
	$('#useDropbox,#startup-Dropbox').on('click', function(){
		callDropbox();
		closeStartup(false);
	});

	try{
		loadLibrary(document, 'script', 'facebook-jssdk', '//connect.facebook.net/en_GB/all.js#xfbml=1&appId=497594116968521');
		loadLibrary(document, 'script', 'twitter-wjs', '//platform.twitter.com/widgets.js');
		loadLibrary(document, 'script', 'google-sdk', 'https://apis.google.com/js/plusone.js');
	} catch(e){}
})

$('#logout').hide();

function isLocalStorage(){
	if (localStorage.holidayTrackerDates){
		return true;
	} else {
		return false;
	}
}

function getLocalStorage(){
	return localStorage.holidayTrackerDates;
}

function setLocalStorage(value){
	localStorage.holidayTrackerDates = value;
}

function loadServerDates(){
	var file;

	if(!country){
		loadUrl = baseUrl + "bankHolidays/England.json";
	} else {
		loadUrl = baseUrl + "bankHolidays/" + country + ".json";
	}
    var json = $.ajax({
    	type: 'GET',
    	url: loadUrl,
    	dataType: 'html',
    	success: function(data,i){
    		gotServerDates(data);
		},
    	data: {},
    	async: false
    });
};

function tryDropboxLoad(){
	showError('TRYING TO LOAD FROM DROPBOX');
	showError(client);
	if(client != null && client.isAuthenticated()){
		usingDropbox = true;
		loadFromDropbox();
	} else {
		usingDropbox = false;
		loadFromLocal()
	}
}

function exportToList(){
	resetFormattedDates();
	var string = "";
	for (dateRangeItem in dateRange){
		if(dateRangeItem != ""){
			string += '\n' + dateRange[dateRangeItem]['dateRangeFormattedString'];
		}
	}
	holalert(string);
}

function getBankHolidayOptions(){
	var json = $.ajax({
    	type: 'GET',
    	url: baseUrl + "bankHolidays/list.json",
    	//url: "/bankHolidays/list.json",
    	dataType: 'html',
    	success: function(data,i){
			gotBankHolidayOptions(data);
		},
    	data: {},
    	async: false
    });
};

function holalert(message){
	alert(message)
}