var loadLibrary = function(d,s,id,url){
	var js,fjs=d.getElementsByTagName(s)[0];
	if(!d.getElementById(id)){
		js=d.createElement(s);
		js.id=id;
		js.src=url;
		fjs.parentNode.insertBefore(js,fjs);
	}
}