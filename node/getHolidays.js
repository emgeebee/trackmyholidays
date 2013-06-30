
var doList = function(){
	var list;
	fs.readFile("../bankHolidays/list.json", function(err, data) {
	    if(err) {
	        console.log(err);
	    } else {
	        list = JSON.parse(data);
			for (country in list){
				getHolidays(country, list[country]);
			}
	    }
	});
}

var getHolidays = function(country, options){
	if(options.port == "8080"){
		var protocol = http;
	} else {
		var protocol = https;
	}
	protocol.get(options, function(res) {
		res.setEncoding('utf8');
		var data;
		console.log("Got response: " + res.statusCode + " for " + country + " at " + options.hostname + options.path);
		res.on('data', function (chunk) {
			data += chunk;
		});
		res.on('end', function () {
			var newJson = chopical(data);
			writeFile(country, newJson);
		});
	}).on('error', function(e) {
		console.log("Got error trying to get the ics for " + country + " at " + options.hostname + options.path + "\nErrcode = " + e.message);
	});
};

var mergeOldAndNew = function(newJson, oldJson){
	var newDate;
	var updated = false;
	for(year in newJson.bankHolidaydateList){
		for (date in newJson.bankHolidaydateList[year]){
			newDate = newJson["bankHolidaydateList"][year][date];
			if(!oldJson.bankHolidaydateList[year][date]){
				oldJson.bankHolidaydateList[year][date] = newDate;
				console.log('new date added');
				console.log(newDate);
				updated = true;
			}
		}
	};
	if(updated){
		oldJson["-issue"] = parseInt(oldJson["-issue"]) + 1;
	} else {
		console.log("The " + country + " file has no new holidays");
	};
	return oldJson;
}

var isFile = function(path){
	try {
		stats = fs.lstatSync('/the/path');

		// Is it a directory?
		if (stats.isFile()) {
			return true;
		}
	}
	catch (e) {
		return false;
	}
}

var writeFile = function(country, newJson){
	var path = "../bankHolidays/"+country+".json";
	console.log("Checking path " + path);

	var exists = isFile(path);

    // Is it a directory?
    if (exists) {
		fs.readFile("../bankHolidays/"+country+".json", function(err, data) {
			if(err) {
				console.log(err);
			} else {
				var oldJson = JSON.parse(data);
				var mergedJson = mergeOldAndNew(newJson, oldJson);

				fs.writeFile(path, JSON.stringify(mergedJson), function(err) {
					if(err) {
						console.log(err);
					} else {
						console.log("The " + country + " file was saved!");
					}
				}); 

			}
		});
	} else {
		fs.writeFile(path, JSON.stringify(newJson), function(err) {
			if(err) {
				console.log(err);
			} else {
				console.log("The " + country + " file was saved!");
			}
		}); 
	}

}

var chopical = function(text){
	var lines = text.split('\n');
	var line,lineKey,lineValue;
	var newdate = false;
	var json = {"-issue":"1","bankHolidaydateList":{}};
	var arraylist = new Array();
	var date = new Object();
	for (var i = 0; i < lines.length; i++){
		line = lines[i].split(':');
		if(!line[0] || !line[1]){
			continue;
		}
		lineKey = line[0];
		lineValue = (line[1]).trim();
		if(newdate){
			date = new Object();
			newdate = false;
		}
		if(lineKey == "BEGIN" && lineValue == "VEVENT"){
			newdate = true;
		} else if(lineKey == "END" && lineValue == "VEVENT"){
			arraylist.push(date);
		} else if (lineKey == "DTSTART;VALUE=DATE"){
			date["-id"] =  parseInt(lineValue.substr(4,2)) + '/' + parseInt(lineValue.substr(6,2)) + '/' + parseInt(lineValue.substr(0,4));
			date["year"] = lineValue.substr(0,4);
		} else if(lineKey == "SUMMARY"){
			date["notes"] = lineValue;
		}
	}

	for(var i = 0; i < arraylist.length; i++){
		date = arraylist[i];
		if (!json.bankHolidaydateList[date["year"]]){
			json.bankHolidaydateList[date["year"]] = {};
		}
		json.bankHolidaydateList[date.year][date['-id']] = date;
	}
	return json;
};

var path = require('path');
var http = require('http');
var https = require('https');
var fs = require('fs');
doList();


//getHolidays("England", "https://www.gov.uk/bank-holidays/england-and-wales.ics");
//getHolidays("Australia", "https://www.google.com/calendar/ical/en.australian%23holiday%40group.v.calendar.google.com/public/basic.ics");