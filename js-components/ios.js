//app.initialize();
function linkDropbox(){ // start the Dropbox link process, make a button call this function on click
	cordova.exec(linkDropboxCB, linkDropboxFail, "PhoneGapDropBox", "link", [""]);
	//startFilesystemLoad();
}
 
function linkDropboxCB(){ // this callback fires if the link method in PhoneGapDropbox.m is successful
	showError('dropbox is linked - lets get the dates')
	firstTimeUser = false;
}

function linkDropboxFail(err){ // this fail callback fires if the link method in PhoneGapDropbox.m fails
	holalert('Unfortunately linking/unlinking with dropbox failed. This might be because the file isn\'t synced with your local device. Please try again later.');
}

function unlinkDropbox(){ // start the Dropbox link process, make a button call this function on click
	cordova.exec(unlinkDropboxCB, linkDropboxFail, "PhoneGapDropBox", "unlink", [""]);
	//startFilesystemLoad();
}

function unlinkDropboxCB(err){ // this fail callback fires if the link method in PhoneGapDropbox.m fails
	replaceDropboxButtons();
}

function tryDropboxLoad(){
	cordova.exec(loadFromDropboxios, loadFromLocal, "PhoneGapDropBox", "checkAuth", [""]);
}

function loadFromDropboxios(){
	showError('user has previously authed');
	usingDropbox = true;
	cordova.exec(downloadDropboxCB, linkDropboxFail, "PhoneGapDropBox", "download", [""]);
}

function authDropboxFinished(){ // this will be called from AppDelegate.m once Dropbox has linked & authenticated
	window.localStorage.setItem("authDropbox", "true"); // setting local storage variable noting this app has linked with Dropbox
	showError('?>>>> dropbox authenticated');
	//console.log("app successfully linked and authenticated with dropbox");
	// At this point you can start making Dropbox API calls - will need to call more methods in PhoneGapDropbox.m to upload/download
	cordova.exec(downloadDropboxCB, linkDropboxFail, "PhoneGapDropBox", "download", [""]);
}

function downloadDropboxCB(){ // this callback fires if the link method in PhoneGapDropbox.m is successful
	showError('?>>>>> NEW');
}

function showFileContents(file){
	usingDropbox = true;
	dates = $.parseJSON(file);
	gotNewDates(dates);
	replaceDropboxButtons();
}

function fail(evt) {
    showError(evt.target.error.code);
}

function startLoad() {
	showError('device is ready - starting up!');
	cal = cordova.require("cordova/plugin/calendarPlugin");
	$('#useDropbox,#startup-Dropbox').on('click', function(){
		linkDropbox();
		closeStartup(false);
	});
	$('#logout').on('click', function(){
		unlinkDropbox();
	});
	showError('init');
	init();
}

function holalert(message){
	navigator.notification.alert(message, null, 'trackMyHolidays','Okay got it.')
}

function loadServerDates(){
	if(!country){
		country = "England";
	}
	showError('country = ' + country);
	cordova.exec(downloadDropboxCB, linkDropboxFail, "PhoneGapDropBox", "downloadserverdates", [country]);
}

function getBankHolidayOptions(){
	cordova.exec(downloadDropboxCB, linkDropboxFail, "PhoneGapDropBox", "downloadbankholidayoptions", [""]);
}

function isLocalStorage(){
	if (window.localStorage.getItem("holidayTrackerDates") != null){
		return true;
	} else {
		return false;
	}
}

function getLocalStorage(){
	return window.localStorage.getItem("holidayTrackerDates");
}

function setLocalStorage(value){
	window.localStorage.setItem("holidayTrackerDates", value);
	cordova.exec(uploadDropboxCB, uploadDropboxFail, "PhoneGapDropBox", "upload", [value]);
}

function uploadDropboxCB(){

}

function uploadDropboxFail(){
	showError('Uploading back to DropBox has failed.');
}

document.addEventListener("deviceready", startLoad, false);