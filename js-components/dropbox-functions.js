var startDropbox = function(){
	client = new Dropbox.Client({
		key: "EBhC3DUlS5A=|kbF6WcFI0ZOEcAiUEHKFAuX1N54D22DYxcpFHOIyhg==", sandbox: true
	});
	client.authDriver(new Dropbox.Drivers.Redirect({'rememberUser':true}));
	client.authenticate({interactive: false},function(error, data) {
		if (error) { return showError(error); }
		showError('authenticated');
		doLoad();
		replaceDropboxButtons();
	});
}

var callDropbox = function(){
	if(localStorage.holidayTrackerDates){
		var override = confirm("You have added some dates locally. By loading from dropbox you will lose the local changes that you have added.");
	} else {
		override = true;
	}
	if(override == true){
		client.authenticate(function(error, data) {
			if (error) { return showError(error); }
			showError('authenticated');
			doLoad();
			replaceDropboxButtons();
		});
	}
};