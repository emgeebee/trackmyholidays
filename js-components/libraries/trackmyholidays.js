var showError=function(a){console.log(a)};function gotServerDates(a){showError("GOT SERVER DATES");showError(a);bankHolidays=a=$.parseJSON(a);serverVersion=a["-issue"];for(checkdate in dateList)if(currdate=dateList[checkdate],currdate.isBankHoliday)for(dateRangeItem in dateListObject.removeHoliday(checkdate),checkdate.split("/"),dateRange){var b=dateRangeItem.split(",");a=b[0].split("/");var b=b[b.length-1].split("/"),c=new Date;c.setFullYear(a[2],a[0]-1,a[1]);a=new Date;for(a.setFullYear(b[2],b[0]-1,b[1]);c<=a;)workingDateFromDateObject(c),
-1<weekendDays.indexOf(c.getDay())&&dateListObject.addHoliday(workingDateFromDateObject(c),!0,dateRange[dateRangeItem].holidayNotes,dateRangeItem,dateRange[dateRangeItem].dateRangeFormattedString),c.setDate(c.getDate()+1)}loadBankHolidaysFromXml();renderDatesToCalendar()}
function gotBankHolidayOptions(a){showError("GOT HOLIDAY OPTIONS");showError(a);a=$.parseJSON(a);for(thiscountry in a)$("#bankHolidays").append('<option value="'+thiscountry+'">'+thiscountry+"</option>"),$("#startup-bankHolidays").append('<option value="'+thiscountry+'">'+thiscountry+"</option>");$("#bankHolidays").val(country)}
function writeDatesBackToXML(){dates.dateList[currentYear]||(dates.dateList[currentYear]={});currentYearNode.date=[];dates.dateList[currentYear]=currentYearNode;for(date in dateList)!0==dateList[date].isHoliday?dates.dateList[currentYear].date.push({"-id":date,"-dateRangeFormatted":dateRange[dateList[date].dateRange].dateRangeFormattedString,"-dateRange":dateList[date].dateRange,"-notes":dateRange[dateList[date].dateRange].holidayNotes,"-halfday":dateList[date].halfday,"-isBankHoliday":!1}):dates.dateList[currentYear].date.push({"-id":date,
"-notes":dateList.holidayNotes,"-isBankHoliday":!0});0!=month&&(dates["-yearStart"]=month);dates["-country"]=country;dates["-dateFormat"]=dateFormat;dates["-weekendDays"]=weekendDays.join()}function saveXML(){writeDatesBackToXML();var a=JSON.stringify(dates);setLocalStorage(a);null!=client&&client.isAuthenticated()&&client.writeFile("savedHolidayDates.json",a,function(a,c){if(a)return showError(a)})}
function loadFromDropbox(){showError("loading from dropbox");firstTimeUser=!1;closeStartup(!1);client.readFile("savedHolidayDates.json",function(a,b){if(a)return showError(a);dates=$.parseJSON(b);gotNewDates(dates);setStartYear(dates)})}
function loadFromLocal(){usingDropbox=!1;!0==isLocalStorage()?(firstTimeUser=!1,showError("loading from local storage"),dates=$.parseJSON(getLocalStorage())):(dates=defaultDates,firstTimeUser=!0,showError("loading default dates"));gotNewDates(dates);setStartYear(dates)}function doLoad(){tryDropboxLoad()}function gotNewDates(a){showError(a);loadHolidaysFromXml(a);loadBankHolidaysFromXml();renderDatesToCalendar()}
function loadBankHolidaysFromXml(){if(null!=bankHolidays&&bankHolidays.bankHolidaydateList)for(var a=currentYear,b;a<=currentYear+1;){for(index in bankHolidays.bankHolidaydateList[a])b=bankHolidays.bankHolidaydateList[a][index],dateListObject.addHoliday(index,!1,b.notes);a++}}
function loadHolidaysFromXml(a){dateListObject.clearDateList();var b,c,e;carriedOver=0;timeAllowed=_TIMEALLOWED;country=a["-country"];dateFormat=dates["-dateFormat"];void 0===dateFormat&&(dateFormat="uk",setDateFormat());month=dates["-yearStart"];if(null!=dates["-weekendDays"]){weekendDays=dates["-weekendDays"].split(",");for(var d=weekendDays.length-1;0<=d;d--)$('input[name="weekend"][value="'+weekendDays[d]+'"]').prop("checked",!0)}showError("dateFormat = "+dateFormat);showError("country = "+country);
setCountry();setDateFormat();showError("loading year "+currentYear);currentYearNode=a.dateList[currentYear];if(null==currentYearNode)currentYearNode={},currentYearNode["-carriedOver"]=carriedOver,currentYearNode["-timeAllowed"]=timeAllowed,currentYearNode.date=[];else{currentYearNode["-carriedOver"]&&(carriedOver=currentYearNode["-carriedOver"]);currentYearNode["-timeAllowed"]&&(timeAllowed=currentYearNode["-timeAllowed"]);for(d=0;d<currentYearNode.date.length;d++)a=currentYearNode.date[d],b=a["-id"],
c="",a["-dateRange"]&&(c=a["-dateRange"]),e="",a["-dateRangeFormatted"]&&(e=a["-dateRangeFormatted"]),halfday=a["-halfday"]?a["-halfday"]:!1,notes="",a["-notes"]&&(notes=a["-notes"]),dateListObject.addHoliday(b,!0==a["-isBankHoliday"]?!1:!0,notes,c,e,halfday)}}
function setMonth(a){if(!0==(!0==a?confirm("Are you sure you want to change the start month? Doing this will erase all dates saved."):!0))month=$("#monthstart").val(),showError(month),month=parseInt(month-1),dates["-yearStart"]=month,dates.dateList={},window.dateList={},window.dateRange={},YAHOO.calendar.cal1.deselect(YAHOO.calendar.cal1.getSelectedDates()),renderDatesToCalendar(),holidayTakenSoFar(),YAHOO.calendar.cal1.setMonth(month),YAHOO.calendar.cal1.render(),updateTotalSpareDays(),saveXML()}
;var startDropbox=function(){client=new Dropbox.Client({key:"EBhC3DUlS5A=|kbF6WcFI0ZOEcAiUEHKFAuX1N54D22DYxcpFHOIyhg==",sandbox:!0});client.authDriver(new Dropbox.Drivers.Redirect({rememberUser:!0}));client.authenticate({interactive:!1},function(a,b){if(a)return showError(a);showError("authenticated");doLoad();replaceDropboxButtons()})},callDropbox=function(){!0==(localStorage.holidayTrackerDates?confirm("You have added some dates locally. By loading from dropbox you will lose the local changes that you have added."):
!0)&&client.authenticate(function(a,b){if(a)return showError(a);showError("authenticated");doLoad();replaceDropboxButtons()})};var currentDate=new Date,currentYear=currentDate.getFullYear(),_TIMEALLOWED=225,timeAllowed=_TIMEALLOWED,weekendDays=["0","6"],hoursTaken,hoursPlanned,carriedOver=0,month=8,hasStartMonthBeenChanged=!1,defaultDates={"-yearStart":"8",dateList:{}};window.dateList={};var dateList=window.dateList;window.dateRange={};
var dateListObject={addHoliday:function(a,b,c,e,d,f){window.dateList[a]=new holidayObject(b,c,e,f);!window.dateRange[e]&&b&&(window.dateRange[e]=new dateRangeObject(c,d));return window.dateList[a]},removeHoliday:function(a){delete window.dateList[a]},clearDateList:function(){window.dateList={}}};function holidayObject(a,b,c,e){this.isHoliday=a;this.isBankHoliday=!a;this.holidayNotes=b;this.dateRange=c;this.halfday=e;return this}
function dateRangeObject(a,b){this.holidayNotes=a;this.dateRangeFormattedString=b;return this}
function renderDatesToCalendar(){var a=0;YAHOO.calendar.cal1.removeRenderers();for(a=weekendDays.length-1;0<=a;a--){var b=parseInt(weekendDays[a])+1;showError("weekend renderer for "+b);YAHOO.calendar.cal1.addWeekdayRenderer(b,weekendRenderer)}YAHOO.calendar.cal1.setYear(currentYear);YAHOO.calendar.cal1.setMonth(month);for(date in dateList)dateList[date].isHoliday?"halfday"in dateList[date]&&!0==dateList[date].halfday?YAHOO.calendar.cal1.addRenderer(date,halfdayRenderer):YAHOO.calendar.cal1.addRenderer(date,
holidayRenderer):dateList[date].isBankHoliday&&YAHOO.calendar.cal1.addRenderer(date,bankHolidayRenderer);holidayTakenSoFar();hoursTakenSoFarHTML.html(hoursTaken);daysTakenSoFarHTML.html(hoursTaken/7.5);hoursPlannedHTML.html(hoursPlanned);daysPlannedHTML.html(hoursPlanned/7.5);totalHoursHTML.html(hoursPlanned+hoursTaken);totalDaysHTML.html((hoursPlanned+hoursTaken)/7.5);carriedOverHoursHTML.val(carriedOver);carriedOverDaysHTML.val(carriedOver/7.5);hoursAllowedHTML.val(timeAllowed);daysAllowedHTML.val(timeAllowed/
7.5);updateTotalSpareDays();YAHOO.calendar.cal1.render()}
function setStartYear(a){isNaN(month)&&(month=a["-yearStart"]?parseInt(a["-yearStart"]):8,showError("set month to be "+month));showError("using month "+month);currentYear=currentDate.getMonth()<month?parseInt(currentDate.getFullYear())-1:parseInt(currentDate.getFullYear());showError("using currentYear "+currentYear);startYear=currentYear;endYear=currentYear+1;a=parseInt(month)+1;10>parseInt(a)?$("#monthstart").val("0"+a):$("#monthstart").val(""+a);setYearPeriod()}
function getRangeOfDates(a,b){var c=new Date;c.setFullYear(a[0][0][0],parseInt(a[0][0][1]-1),a[0][0][2]);var e=new Date;e.setFullYear(b[0][0][0],parseInt(b[0][0][1]-1),b[0][0][2]);var d=c;e<c&&(d=e,e=c);for(c=[];d<=e;){var f=workingDateFromDateObject(d),g=window.dateList[f],h=!1;null!=g&&g.isBankHoliday&&(h=!0);!h&&-1==weekendDays.indexOf(d.getDay()+"")&&c.push(f);d.setDate(d.getDate()+1)}return c}
function selectDateRange(a,b){var c=formattedDateFromArray(b),e=workingDateFromArray(b),d=window.dateList[e];d?(dateRangeSelection=0,d.isBankHoliday?populateControlBox(d,2,e,c):d.isHoliday&&populateControlBox(d,1,d.dateRange,window.dateRange[d.dateRange].dateRangeFormattedString)):dateRangeSelection?(c=getRangeOfDates(startDate,b),dateRangeSelection=0,YAHOO.calendar.cal1.cfg.setProperty("selected",c.join(","),!1),YAHOO.calendar.cal1.render(),populateControlBox("",3,c.join(","),dateRangeFormattedString(c))):
(startDate=b,dateRangeSelection=1,populateControlBox("",3,workingDateFromArray(b),formattedDateFromArray(startDate)))}function dateRangeFormattedString(a){return 1<a.length?formattedDateFromStringDate(a[0])+" - "+formattedDateFromStringDate(a[a.length-1])+" ("+a.length+" days)":formattedDateFromStringDate(a[0])}function formattedDateFromStringDate(a){a=a.split("/");return"uk"==dateFormat?a[1]+"/"+a[0]+"/"+a[2]:a[0]+"/"+a[1]+"/"+a[2]}
function workingDateFromArray(a){return a[0][0][1]+"/"+a[0][0][2]+"/"+a[0][0][0]}function formattedDateFromArray(a){return"uk"==dateFormat?a[0][0][2]+"/"+a[0][0][1]+"/"+a[0][0][0]:a[0][0][1]+"/"+a[0][0][2]+"/"+a[0][0][0]}function formattedDateFromDateObject(a){return"uk"==dateFormat?a.getDate()+"/"+parseInt(parseInt(a.getMonth())+1)+"/"+a.getFullYear():parseInt(parseInt(a.getMonth())+1)+"/"+a.getDate()+"/"+a.getFullYear()}
function workingDateFromDateObject(a){return parseInt(parseInt(a.getMonth())+1)+"/"+a.getDate()+"/"+a.getFullYear()}
function holidayTakenSoFar(){var a=0,b=0;for(date in dateList)if(null==date||""==date)delete dateList[date];else if(!0==dateList[date].isHoliday){var c=date.split("/");(new Date(c[2],c[0]-1,c[1])).getTime()<currentDate.getTime()?(a++,"halfday"in dateList[date]&&!0!=dateList[date].halfday&&a++):(b++,"halfday"in dateList[date]&&!0!=dateList[date].halfday&&b++)}hoursTaken=7.5*a/2;hoursPlanned=7.5*b/2}
function setYearPeriod(){var a=parseFloat(currentYear)+1;$("#yearPeriod").html(currentYear+" - "+a)}function updateCarriedOverDays(){carriedOver=7.5*carriedOverDaysHTML.val();carriedOverHoursHTML.val(carriedOver);currentYearNode["-carriedOver"]=carriedOver;updateTotalSpareDays()}function updateCarriedOverTime(){carriedOver=carriedOverHoursHTML.val();carriedOverDaysHTML.html(carriedOver/7.5);currentYearNode["-carriedOver"]=carriedOver;updateTotalSpareDays()}
function updateDaysAllowed(){timeAllowed=7.5*daysAllowedHTML.val();hoursAllowedHTML.html(timeAllowed);currentYearNode["-timeAllowed"]=timeAllowed;updateTotalSpareDays()}function updateTimeAllowed(){timeAllowed=hoursAllowedHTML.val();daysAllowedHTML.val(timeAllowed/7.5);currentYearNode["-timeAllowed"]=timeAllowed;updateTotalSpareDays()}
function updateTotalSpareDays(){var a=parseFloat(parseFloat(timeAllowed)+parseFloat(carriedOver)-parseFloat(hoursPlanned)-parseFloat(hoursTaken));totalSpareHoursHTML.html(a);totalSpareDaysHTML.html(parseInt(10*a/7.5)/10)}function prevYear(){changeYear(-1)}function nextYear(){changeYear(1)}
function changeYear(a){currentYear=parseFloat(currentYear)+parseFloat(a);holidayTakenSoFar();YAHOO.calendar.cal1.setYear(currentYear);gotNewDates(dates);YAHOO.calendar.cal1.render();setYearPeriod();resetSelectOptions();updateCarriedOverTime();updateTimeAllowed()}function countHolidays(){}function resetFormattedDates(){for(date in dateRange)if(""!=date){var a=date.split(",");dateRange[date].dateRangeFormattedString=dateRangeFormattedString(a)}};YAHOO.namespace("calendar");var weekendRenderer=function(a,b){b.innerHTML="X";return YAHOO.widget.Calendar.STOP_RENDER};function weekdayRenderer(a,b){a.getDate();a.getMonth();a.getFullYear();b.title="";return YAHOO.widget.Calendar.STOP_RENDER}function bankHolidayRenderer(a,b){YAHOO.calendar.cal1.styleCellDefault(a,b);var c=a.getDate();addContentsToCell(b,c,"highlight4");return YAHOO.widget.Calendar.STOP_RENDER}function normalRenderer(a,b){YAHOO.calendar.cal1.styleCellDefault(a,b)}
function holidayRenderer(a,b){YAHOO.calendar.cal1.styleCellDefault(a,b);var c=a.getDate();addContentsToCell(b,c,"highlight3");return YAHOO.widget.Calendar.STOP_RENDER}function halfdayRenderer(a,b){YAHOO.calendar.cal1.styleCellDefault(a,b);var c=a.getDate();addContentsToCell(b,c,"highlight2");return YAHOO.widget.Calendar.STOP_RENDER}function addContentsToCell(a,b,c){YAHOO.util.Dom.addClass(a,c);a.innerHTML=b};var loadLibrary=function(a,b,c,e){var d=a.getElementsByTagName(b)[0];a.getElementById(c)||(a=a.createElement(b),a.id=c,a.src=e,d.parentNode.insertBefore(a,d))};var _gaq=_gaq||[];_gaq.push(["_setAccount","UA-28963119-5"]);_gaq.push(["_trackPageview"]);try{(function(){var a=document.createElement("script");a.type="text/javascript";a.async=!0;a.src=("https:"==document.location.protocol?"https://ssl":"http://www")+".google-analytics.com/ga.js";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)})()}catch(e$$12){};var icalTemplate="BEGIN:VCALENDAR VERSION:2.0 PRODID:trackMyHolidays X-WR-CALNAME:trackMyHolidays X-WR-CALDESC:trackMyHolidays CALSCALE:GREGORIAN CONTENT END:VCALENDAR".split(" "),eventTemplate=function(){var a=new Date;this.BEGIN="VEVENT";this.UID=a.getTime();this.DTSTAMP=DTSTAMP=getICALDate(a.getFullYear(),parseInt(a.getMonth())+1,a.getDate(),a.getHours(),a.getMinutes(),a.getSeconds());this.SUMMARY=this.DESCRIPTION=this.DTEND=this.DTSTART=this.TITLE="";this.CLASS="PUBLIC";this.CATEGORIES="HOLIDAY";
this.LOCATION="Annual Leave";this.ALARM=$("#ical-reminder").val();this.END="VEVENT"},alarmTemplate=function(){this.BEGIN="VALARM";this.TRIGGER="-PT"+$("#ical-reminder").val()+"M";this.ACTION="DISPLAY";this.DESCRIPTION="Reminder";this.END="VALARM"},generateIcal=function(a){for(var b="",c=0;c<icalTemplate.length;c++)"CONTENT"==icalTemplate[c]?b=generateEvents(b):(b+=""+icalTemplate[c],c<icalTemplate.length-1&&(b+="\n"));showError(b);showError(escape(b));b="data:text/calendar;charset=utf8,"+escape(b);
$(a).attr("href",b);$(a).attr("type","text/calendar")},generateEvents=function(a){for(dateRangeItem in dateRange)if(dateRangeItem){showError(dateRangeItem);var b=new eventTemplate,c=dateRangeItem.split(","),e=c[0].split("/");b.DTSTART=getICALDate(e[2],e[0],e[1],0,0,0);c=c[c.length-1].split("/");b.DTEND=getICALDate(c[2],c[0],c[1],23,59,59);b.TITLE=$.trim(dateRange[dateRangeItem].dateRangeFormattedString);b.DESCRIPTION=$.trim(dateRange[dateRangeItem].dateRangeFormattedString+" "+dateRange[dateRangeItem].holidayNotes);
b.SUMMARY=$.trim(dateRange[dateRangeItem].dateRangeFormattedString+" "+dateRange[dateRangeItem].holidayNotes);for(item in b)showError(""+item+":"+b[item]),"ALARM"==item?"none"!=b[item]&&(a=generateAlarm(a)):(a+=""+item+":"+b[item],a+="\n")}return a},generateAlarm=function(a){var b=new alarmTemplate;for(item in b)a+=""+item+":"+b[item],a+="\n";return a},getICALDate=function(a,b,c,e,d,f){a=""+a;a=10>b?a+("0"+b):a+b;a=(10>c?a+("0"+c):a+c)+"T";a=10>e?a+("0"+e):a+e;a=10>d?a+("0"+d):a+d;return a=10>f?a+
("0"+f):a+f};var hoursTakenSoFarHTML,daysTakenSoFarHTML,hoursPlannedHTML,daysPlannedHTML,totalHoursHTML,totalDaysHTML,totalSpareHoursHTML,totalSpareDaysHTML,carriedOverHoursHTML,carriedOverDaysHTML,hoursAllowedHTML,daysAllowedHTML;
function setHTMLVariables(){hoursTakenSoFarHTML=$("#hoursTakenSoFar");daysTakenSoFarHTML=$("#daysTakenSoFar");hoursPlannedHTML=$("#hoursPlanned");daysPlannedHTML=$("#daysPlanned");totalHoursHTML=$("#totalHours");totalDaysHTML=$("#totalDays");totalSpareHoursHTML=$("#totalSpareHours");totalSpareDaysHTML=$("#totalSpareDays");carriedOverHoursHTML=$("#carriedOver");carriedOverDaysHTML=$("#carriedOverDays");hoursAllowedHTML=$("#timeAllowed");daysAllowedHTML=$("#daysAllowed");hoursAllowedHTML.val(timeAllowed)}
var replaceDropboxButtons=function(){$("#useDropbox,#logout").toggle()},resetSelectOptions=function(){$("#selectedDate").text("Select the first and last date of each holiday");$(".selectedDateControls>button").addClass("hidden");$(".selectedDateControls>label").addClass("hidden");$(".selectedDateDescription").addClass("hidden")};
function setButtons(){$("#prevYear").click(function(){prevYear()});$("#nextYear").click(function(){nextYear()});carriedOverHoursHTML.change(function(){updateCarriedOverTime();saveXML()});carriedOverDaysHTML.change(function(){updateCarriedOverDays();saveXML()});hoursAllowedHTML.change(function(){updateTimeAllowed();saveXML()});daysAllowedHTML.change(function(){updateDaysAllowed();saveXML()});$("#updateYearStart").click(function(){setMonth(!0)});$("#startup-monthstart").click(function(){setMonth(!1)});
$('input[name="weekend"]').on("change",function(){showError("updating the weekendDays");weekendDays=[];$('input[name="weekend"]:checked').each(function(){weekendDays.push($(this).val())});showError(weekendDays);renderDatesToCalendar()});$("#config").click(function(){$("#controls").show();$("#wrapper,header").hide();$("body").addClass("config");$("#controls").tabs({active:0})});$("#control-close").click(function(){$("#controls").hide();$("#wrapper,header").show();$("body").removeClass("config")});
$(".dayshoursswitcher").click(function(){$(".timeTableDays,.timeTableHours").toggleClass("hidden")});$("body").on("click",function(a){!0==clicktodeselect&&!isCalendarLink&&!$(a.target).parent().hasClass("selector")&&!$(a.target).parent().hasClass("btn")&&!("dateDescription"==$(a.target).parent().attr("id")||$(a.target).hasClass("selector")||$(a.target).hasClass("btn")||"dateDescription"==$(a.target).attr("id"))?(dateRangeSelection=0,YAHOO.calendar.cal1.deselect(YAHOO.calendar.cal1.getSelectedDates()),
YAHOO.calendar.cal1.render(),resetSelectOptions(),clicktodeselect=!1):isCalendarLink&&(clicktodeselect=!0,isCalendarLink=!1)});$("#closefocus").on("click",function(){});$("#nextMonth").click(function(){$(".selectedgroup").removeClass("selectedgroup").next().addClass("selectedgroup");0<$(".selectedgroup.last-of-type").length?$("#nextMonth").hide():$("#nextMonth").show();$("#prevMonth").show()});$("#prevMonth").click(function(){$(".selectedgroup").removeClass("selectedgroup").prev().addClass("selectedgroup");
0<$(".selectedgroup.first-of-type").length?$("#prevMonth").hide():$("#prevMonth").show();$("#nextMonth").show()});$("#monthstart").on("change",function(){$("#updateYearStart").show()});$("#comfortableview,#compactview").on("click",function(){$("#comfortableview,#compactview").toggle();$("body").toggleClass("big")});$("#dateFormat").on("change",function(){dateFormat=$(this).val();void 0===dateFormat&&(dateFormat="uk",setDateFormat());resetFormattedDates();saveXML()});$("#bankHolidays,#startup-bankHolidays").on("change",
function(){country=$(this).val();loadServerDates();saveXML()});$("#exporttolist").on("click",function(){exportToList()});$("#exporttoics").on("mousedown",function(){generateIcal($(this))});$("#logout,#compactview").hide();$("#controls").tabs();for(var a=weekendDays.length-1;0<=a;a--)$('input[name="weekend"][value="'+weekendDays[a]+'"]').prop("checked",!0)}
var setCountry=function(){$("#bankHolidays").val(country)},setDateFormat=function(){$("#dateFormat").val(dateFormat)},populateControlBox=function(a,b,c,e){var d="";1==c.split(",").length&&2!=b&&""!=b?($("#halfday").removeClass("hidden"),dateList[c]&&!0==dateList[c].halfday?$("#halfday>input").prop("checked",!0):$("#halfday>input").prop("checked",!1)):$("#halfday").addClass("hidden");if(1==b)d=window.dateRange[a.dateRange].holidayNotes,$("#selectButton").addClass("hidden"),$("#deselectButton,#updateButton").removeClass("hidden"),
$("#deselectButton").unbind("click"),$("#deselectButton").on("click",function(){myDeselectCell(a.dateRange)}),$("#updateButton").unbind("click"),$("#updateButton").on("click",function(){myUpdateCell(a.dateRange)});else if(2==b)d=a.holidayNotes,$("#deselectButton,#updateButton,#selectButton").addClass("hidden");else if(3==b)$("#deselectButton,#updateButton").addClass("hidden"),$("#selectButton").removeClass("hidden"),$("#selectButton").unbind("click"),$("#selectButton").on("click",function(){mySelectCell(c,
e)});else return;$("#selectedDate").html(e);isCalendarLink=!0;$(".selectedDateDescription").removeClass("hidden");$("#dateDescription").val(d)};function mySelectCell(a,b,c){c=1==$("#halfday>input:checked").length?!0:!1;dateRangeSelection=0;for(var e=a.split(","),d=$("#dateDescription").val(),f,g=0;g<e.length;g++)f=dateListObject.addHoliday(e[g],!0,d,a,b,c);renderDatesToCalendar();populateControlBox(f,1,a,b);saveXML();$(".groupcal").removeClass("selectedgroup");resetSelectOptions()}
function myUpdateCell(a){1==$("#halfday>input:checked").length?dateList[a].halfday=!0:dateList[a].halfday=!1;window.dateRange[a].holidayNotes=$("#dateDescription").val();renderDatesToCalendar();saveXML();$(".groupcal").removeClass("selectedgroup");resetSelectOptions()}
function myDeselectCell(a){dateArray=a.split(",");for(a=0;a<dateArray.length;a++)dateListObject.removeHoliday(dateArray[a]);renderDatesToCalendar();populateControlBox("",3,"","");saveXML();$(".groupcal").removeClass("selectedgroup");resetSelectOptions()};var dateRangeSelection=0,startDate,client=null,clicktodeselect=!1,isCalendarLink=!1,bankHolidays,dateFormat="uk",country,firstTimeUser=!1,usingDropbox=!1;$("#startup").hide();
var isFirstTime=function(){!0==firstTimeUser?($("#startup").show(),$("#wrapper").hide(),$("#controls,h1>.btn,#yearControlBlock").hide(),$("#startup-carriedOverDays").bind("change",function(){$("#carriedOverDays").val($(this).val());updateCarriedOverDays()}),$("#startup-carriedOver").bind("change",function(){$("#carriedOver").val($(this).val());updateCarriedOverTime()}),$("#startup-timeAllowed").bind("change",function(){$("#timeAllowed").val($(this).val());updateTimeAllowed()}),$("#startup-daysAllowed").bind("change",
function(){$("#daysAllowed").val($(this).val());updateDaysAllowed()}),$("#startup-bankHolidays").on("change",function(){$("#bankHolidays").val($(this).val())}),$("#startup-monthstart").on("change",function(){$("#monthstart").val($(this).val());setMonth(!1)}),$("#startup-dateFormat").on("change",function(){dateFormat=$(this).val();resetFormattedDates();$("#dateFormat").val($(this).val())}),$("body").removeClass("config")):$("#startup").remove();$("#startup-go").on("click",function(){closeStartup(!0)})},
closeStartup=function(a){!0==a&&holalert("To select your holiday simply click the start and end date for each holiday and save the dates. The amount of remaining leave will then be shown in the top right corner.");$("#startup").hide();$("#wrapper,h1>.btn,#yearControlBlock").show()};
init=function(){showError("starting up");setHTMLVariables();setStartYear();YAHOO.calendar.cal1=new YAHOO.widget.CalendarGroup("calendarContainer",{PAGES:12});YAHOO.calendar.cal1.selectEvent.subscribe(selectDateRange,YAHOO.calendar.cal1,!0);showError("starting up - prepared the calendar");resetSelectOptions();setButtons();setYearPeriod();showError("Done the UI");YAHOO.calendar.cal1.setYear(currentYear);YAHOO.calendar.cal1.setMonth(month);showError("Refreshed the calendar");renderDatesToCalendar();
doLoad();loadServerDates();getBankHolidayOptions();showError("Loaded the data");isFirstTime()};var baseUrl=location.href.split("#")[0];$(document).ready(function(){init();startDropbox();$("#useDropbox,#startup-Dropbox").on("click",function(){callDropbox();closeStartup(!1)});try{loadLibrary(document,"script","facebook-jssdk","//connect.facebook.net/en_GB/all.js#xfbml=1&appId=497594116968521"),loadLibrary(document,"script","twitter-wjs","//platform.twitter.com/widgets.js"),loadLibrary(document,"script","google-sdk","https://apis.google.com/js/plusone.js")}catch(a){}});$("#logout").hide();
function isLocalStorage(){return localStorage.holidayTrackerDates?!0:!1}function getLocalStorage(){return localStorage.holidayTrackerDates}function setLocalStorage(a){localStorage.holidayTrackerDates=a}function loadServerDates(){loadUrl=country?baseUrl+"bankHolidays/"+country+".json":baseUrl+"bankHolidays/England.json";$.ajax({type:"GET",url:loadUrl,dataType:"html",success:function(a,b){gotServerDates(a)},data:{},async:!1})}
function tryDropboxLoad(){showError("TRYING TO LOAD FROM DROPBOX");showError(client);null!=client&&client.isAuthenticated()?(usingDropbox=!0,loadFromDropbox()):(usingDropbox=!1,loadFromLocal())}function exportToList(){resetFormattedDates();var a="";for(dateRangeItem in dateRange)""!=dateRangeItem&&(a+="\n"+dateRange[dateRangeItem].dateRangeFormattedString);holalert(a)}
function getBankHolidayOptions(){$.ajax({type:"GET",url:baseUrl+"bankHolidays/list.json",dataType:"html",success:function(a,b){gotBankHolidayOptions(a)},data:{},async:!1})}function holalert(a){alert(a)};
