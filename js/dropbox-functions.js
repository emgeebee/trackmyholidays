var startDropbox = function(){
	client = new Dropbox.Client({
		key: "EBhC3DUlS5A=|kbF6WcFI0ZOEcAiUEHKFAuX1N54D22DYxcpFHOIyhg==", sandbox: true
	});
	client.authDriver(new Dropbox.Drivers.Redirect({'rememberUser':true}));
}
var callDropbox = function(){
	client.authenticate(function(error, data) {
		if (error) { return showError(error); }
		doLoad();
		replaceDropboxButtons();
	});
};