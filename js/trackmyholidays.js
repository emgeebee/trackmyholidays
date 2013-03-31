var showError = function(a) {
};
function loadServerDates() {
  $.ajax({type:"GET", url:"http://trackmyholidays.com/js/bankholidayJSON.json", dataType:"json", success:function(a, b) {
    bankHolidays = a;
    serverVersion = a.holidays["-issue"];
    loadBankHolidaysFromXml();
    renderDatesToCalendar()
  }, data:{}, async:!1})
}
function writeDatesBackToXML() {
  dates.dateList[currentYear] || (dates.dateList[currentYear] = {});
  currentYearNode.date = [];
  dates.dateList[currentYear] = currentYearNode;
  for(date in dateList) {
    dateList[date].isHoliday && dates.dateList[currentYear].date.push({"-id":date, "-dateRangeFormatted":dateRange[dateList[date].dateRange].dateRangeFormattedString, "-dateRange":dateList[date].dateRange, "-notes":dateRange[dateList[date].dateRange].holidayNotes})
  }
  0 != month && (dates.yearStart = month)
}
function saveXML() {
  writeDatesBackToXML();
  var a = JSON.stringify(dates);
  client && 1 != client.authState ? client.writeFile("savedHolidayDates.json", a, function(a, c) {
    if(a) {
      return showError(a)
    }
  }) : localStorage.holidayTrackerDates = a
}
function doLoad() {
  showError("loading" + currentYear);
  null != client && 1 != client.authState ? (showError("loading from dropbox"), client.readFile("savedHolidayDates.json", function(a, b) {
    if(a) {
      return showError(a)
    }
    dates = $.parseJSON(b);
    showError(dates);
    loadHolidaysFromXml(dates);
    loadBankHolidaysFromXml();
    renderDatesToCalendar()
  })) : (localStorage.holidayTrackerDates ? (showError("loading from local storage"), dates = $.parseJSON(localStorage.holidayTrackerDates), showError(dates), loadHolidaysFromXml(dates), loadBankHolidaysFromXml()) : (dates = defaultDates, showError("loading default dates"), showError(dates), loadHolidaysFromXml(dates)), renderDatesToCalendar())
}
function loadBankHolidaysFromXml() {
  bankHolidays && bankHolidays.holidays && $.each(bankHolidays.holidays.bankHolidaydateList, function(a) {
    if(this["-id"] == currentYear || this["-id"] == currentYear + 1) {
      for(a = 0;a < this.bankHolidayList.bankHoliday.length;a++) {
        holidayDate = this.bankHolidayList.bankHoliday[a]["-id"], dateListObject.addHoliday(holidayDate, !1, this.bankHolidayList.bankHoliday[a].notes)
      }
    }
  })
}
function loadHolidaysFromXml(a) {
  dateListObject.clearDateList();
  var b, c, d;
  carriedOver = 0;
  timeAllowed = _TIMEALLOWED;
  currentYearNode = a.dateList[currentYear];
  showError("loading date " + currentYear);
  if(null == currentYearNode) {
    currentYearNode = {}, currentYearNode["-carriedOver"] = carriedOver, currentYearNode["-timeAllowed"] = timeAllowed, currentYearNode.date = []
  }else {
    currentYearNode["-carriedOver"] && (carriedOver = currentYearNode["-carriedOver"]);
    currentYearNode["-timeAllowed"] && (timeAllowed = currentYearNode["-timeAllowed"]);
    for(var e = 0;e < currentYearNode.date.length;e++) {
      a = currentYearNode.date[e], b = a["-id"], c = "", a["-dateRange"] && (c = a["-dateRange"]), d = "", a["-dateRangeFormatted"] && (d = a["-dateRangeFormatted"]), notes = "", a["-notes"] && (notes = a["-notes"]), dateListObject.addHoliday(b, !0, notes, c, d)
    }
  }
}
function setMonth() {
  !0 == confirm("Are you sure you want to change the start month? Doing this will erase all dates saved.") && (month = $("#monthstart").val(), month = parseInt(month - 1), dates["-yearStart"] = month, dates.dateList = {}, window.dateList = {}, window.dateRange = {}, YAHOO.calendar.cal1.deselect(YAHOO.calendar.cal1.getSelectedDates()), renderDatesToCalendar(), holidayTakenSoFar(), YAHOO.calendar.cal1.setMonth(month), YAHOO.calendar.cal1.render(), updateTotalSpareDays(), saveXML())
}
;var startDropbox = function() {
  client = new Dropbox.Client({key:"EBhC3DUlS5A=|kbF6WcFI0ZOEcAiUEHKFAuX1N54D22DYxcpFHOIyhg==", sandbox:!0});
  client.authDriver(new Dropbox.Drivers.Redirect({rememberUser:!0}))
}, callDropbox = function() {
  client.authenticate(function(a, b) {
    if(a) {
      return showError(a)
    }
    showError("authenticated");
    doLoad();
    replaceDropboxButtons()
  })
};
var hoursTakenSoFarHTML, daysTakenSoFarHTML, hoursPlannedHTML, daysPlannedHTML, totalHoursHTML, totalDaysHTML, totalSpareHoursHTML, totalSpareDaysHTML, carriedOverHoursHTML, carriedOverDaysHTML, hoursAllowedHTML, daysAllowedHTML;
function setHTMLVariables() {
  hoursTakenSoFarHTML = $("#hoursTakenSoFar");
  daysTakenSoFarHTML = $("#daysTakenSoFar");
  hoursPlannedHTML = $("#hoursPlanned");
  daysPlannedHTML = $("#daysPlanned");
  totalHoursHTML = $("#totalHours");
  totalDaysHTML = $("#totalDays");
  totalSpareHoursHTML = $("#totalSpareHours");
  totalSpareDaysHTML = $("#totalSpareDays");
  carriedOverHoursHTML = $("#carriedOver");
  carriedOverDaysHTML = $("#carriedOverDays");
  hoursAllowedHTML = $("#timeAllowed");
  daysAllowedHTML = $("#daysAllowed");
  hoursAllowedHTML.val(timeAllowed)
}
var replaceDropboxButtons = function() {
  $("#useDropbox,#logout").toggle()
}, resetSelectOptions = function() {
  $("#selectedDate").text("Select the first and last date of each holiday");
  $(".selectedDateControls>button").hide();
  $(".selectedDateDescription").hide()
};
function setButtons() {
  $("#prevYear").click(function() {
    prevYear()
  });
  $("#nextYear").click(function() {
    nextYear()
  });
  carriedOverHoursHTML.change(function() {
    updateCarriedOverTime();
    saveXML()
  });
  carriedOverDaysHTML.change(function() {
    updateCarriedOverDays();
    saveXML()
  });
  hoursAllowedHTML.change(function() {
    updateTimeAllowed();
    saveXML()
  });
  daysAllowedHTML.change(function() {
    updateDaysAllowed();
    saveXML()
  });
  $("#updateYearStart").click(function() {
    setMonth()
  });
  $("#useDropbox").click(function() {
    callDropbox()
  });
  $("#config,#control-close").click(function() {
    $("#controls").toggle();
    $("body").toggleClass("config");
    $("#controls").tabs({active:1})
  });
  $("#dayshourscolumn").click(function() {
    $(".timeTableDays,.timeTableHours").toggle()
  });
  $("body").on("click", function() {
    !0 == clicktodeselect && !isCalendarLink && !$(event.target).hasClass("selector") && !($(event.target).hasClass("btn") || "dateDescription" == $(event.target).attr("id")) ? (dateRangeSelection = 0, YAHOO.calendar.cal1.deselect(YAHOO.calendar.cal1.getSelectedDates()), YAHOO.calendar.cal1.render(), resetSelectOptions(), clicktodeselect = !1) : isCalendarLink && (clicktodeselect = !0, isCalendarLink = !1)
  });
  $("#closefocus").on("click", function() {
  });
  $("#nextMonth").click(function() {
    $(".selectedgroup").removeClass("selectedgroup").next().addClass("selectedgroup");
    0 < $(".selectedgroup.last-of-type").length ? $("#nextMonth").hide() : $("#nextMonth").show();
    $("#prevMonth").show()
  });
  $("#prevMonth").click(function() {
    $(".selectedgroup").removeClass("selectedgroup").prev().addClass("selectedgroup");
    0 < $(".selectedgroup.first-of-type").length ? $("#prevMonth").hide() : $("#prevMonth").show();
    $("#nextMonth").show()
  });
  $("#monthstart").on("change", function() {
    $("#updateYearStart").show()
  });
  $("#comfortableview,#compactview").on("click", function() {
    $("#comfortableview,#compactview").toggle();
    $("body").toggleClass("big")
  });
  $("#logout,#compactview").hide();
  $("#controls").tabs()
}
var populateControlBox = function(a, b, c, d) {
  $(".groupcal").removeClass("selectedGroup");
  $(".selected").parents(".groupcal").addClass("selectedgroup");
  $("#wrapper").addClass("focused");
  0 < $(".selectedgroup.last-of-type").length ? $("#nextMonth").hide() : $("#nextMonth").show();
  0 < $(".selectedgroup.first-of-type").length ? $("#prevMonth").hide() : $("#prevMonth").show();
  var e = "";
  $("#selectedDate").html(d);
  1 == b ? (e = window.dateRange[a.dateRange].holidayNotes, $("#selectButton").hide(), $("#deselectButton,#updateButton").show(), $("#deselectButton").unbind("click"), $("#deselectButton").on("click", function() {
    myDeselectCell(a.dateRange)
  }), $("#updateButton").unbind("click"), $("#updateButton").on("click", function() {
    myUpdateCell(a.dateRange)
  })) : 2 == b ? (e = a.holidayNotes, $("#deselectButton,#updateButton,#selectButton").hide()) : 0 == b && ($("#deselectButton,#updateButton").hide(), $("#selectButton").show(), $("#selectButton").unbind("click"), $("#selectButton").on("click", function() {
    mySelectCell(c, d)
  }));
  isCalendarLink = !0;
  $(".selectedDateDescription").show();
  $("#dateDescription").val(e)
};
function mySelectCell(a, b) {
  dateRangeSelection = 0;
  for(var c = a.split(","), d = $("#dateDescription").val(), e, f = 0;f < c.length;f++) {
    e = dateListObject.addHoliday(c[f], !0, d, a, b)
  }
  renderDatesToCalendar();
  populateControlBox(e, 1, a, b);
  saveXML();
  $(".groupcal").removeClass("selectedgroup");
  resetSelectOptions()
}
function myUpdateCell(a) {
  window.dateRange[a].holidayNotes = $("#dateDescription").val();
  saveXML();
  $(".groupcal").removeClass("selectedgroup");
  resetSelectOptions()
}
function myDeselectCell(a) {
  dateArray = a.split(",");
  for(a = 0;a < dateArray.length;a++) {
    dateListObject.removeHoliday(dateArray[a])
  }
  renderDatesToCalendar();
  populateControlBox("", 0, "", "");
  saveXML();
  $(".groupcal").removeClass("selectedgroup");
  resetSelectOptions()
}
;var currentDate = new Date, currentYear = currentDate.getFullYear(), _TIMEALLOWED = 225, timeAllowed = _TIMEALLOWED, hoursTaken, hoursPlanned, carriedOver = 0, month = 8, hasStartMonthBeenChanged = !1, defaultDates = {"-yearStart":"8", dateList:{}};
window.dateList = {};
var dateList = window.dateList;
window.dateRange = {};
var dateListObject = {addHoliday:function(a, b, c, d, e) {
  window.dateList[a] = new holidayObject(b, c, d);
  !window.dateRange[d] && b && (window.dateRange[d] = new dateRangeObject(c, e));
  return window.dateList[a]
}, removeHoliday:function(a) {
  delete window.dateList[a]
}, clearDateList:function() {
  window.dateList = {};
  dateList.length = 0
}};
function holidayObject(a, b, c) {
  ({});
  this.isHoliday = a;
  this.isBankHoliday = !a;
  this.holidayNotes = b;
  this.dateRange = c;
  return this
}
function dateRangeObject(a, b) {
  ({});
  this.holidayNotes = a;
  this.dateRangeFormattedString = b;
  return this
}
function renderDatesToCalendar() {
  var a = 0;
  YAHOO.calendar.cal1.removeRenderers();
  YAHOO.calendar.cal1.addWeekdayRenderer(1, weekendRenderer);
  YAHOO.calendar.cal1.addWeekdayRenderer(7, weekendRenderer);
  for(date in dateList) {
    dateList[date].isHoliday ? (YAHOO.calendar.cal1.addRenderer(date, holidayRenderer), a++) : dateList[date].isBankHoliday && YAHOO.calendar.cal1.addRenderer(date, bankHolidayRenderer)
  }
  dateListObject.length = a;
  countHolidays();
  holidayTakenSoFar();
  hoursTakenSoFarHTML.html(hoursTaken);
  daysTakenSoFarHTML.html(hoursTaken / 7.5);
  hoursPlannedHTML.html(hoursPlanned);
  daysPlannedHTML.html(hoursPlanned / 7.5);
  totalHoursHTML.html(hoursPlanned + hoursTaken);
  totalDaysHTML.html((hoursPlanned + hoursTaken) / 7.5);
  carriedOverHoursHTML.val(carriedOver);
  carriedOverDaysHTML.val(carriedOver / 7.5);
  hoursAllowedHTML.val(timeAllowed);
  daysAllowedHTML.val(timeAllowed / 7.5);
  updateTotalSpareDays();
  YAHOO.calendar.cal1.render()
}
function setStartYear(a) {
  isNaN(month) && (month = a.yearStart ? a.yearStart : 8);
  currentDate.getMonth() < month && (currentYear = parseInt(currentDate.getFullYear()) - 1);
  startYear = currentYear;
  endYear = currentYear + 1;
  a = parseInt(month) + 1;
  10 > parseInt(a) ? $("#monthstart").val("0" + a) : $("#monthstart").val("" + a)
}
function getRangeOfDates(a, b) {
  var c = new Date;
  c.setFullYear(a[0][0][0], parseInt(a[0][0][1] - 1), a[0][0][2]);
  var d = new Date;
  d.setFullYear(b[0][0][0], parseInt(b[0][0][1] - 1), b[0][0][2]);
  var e = c;
  d < c && (e = d, d = c);
  for(c = [];e <= d;) {
    var f = workingDateFromDateObject(e);
    !window.dateList[f] && (0 != e.getDay() && 6 != e.getDay()) && c.push(workingDateFromDateObject(e));
    e.setDate(e.getDate() + 1)
  }
  return c
}
function dateRangeFormattedString(a) {
  return a[0] + " - " + a[a.length - 1] + " (" + a.length + " days)"
}
function selectDateRange(a, b) {
  var c = workingDateFromArray(b), d = window.dateList[c];
  d ? (dateRangeSelection = 0, d.isBankHoliday ? populateControlBox(d, 2, c, c) : d.isHoliday && populateControlBox(d, 1, d.dateRange, window.dateRange[d.dateRange].dateRangeFormattedString)) : dateRangeSelection ? (c = getRangeOfDates(startDate, b), dateRangeSelection = 0, YAHOO.calendar.cal1.cfg.setProperty("selected", c.join(","), !1), YAHOO.calendar.cal1.render(), populateControlBox("", 0, c.join(","), dateRangeFormattedString(c))) : (startDate = b, dateRangeSelection = 1, populateControlBox("", 
  0, workingDateFromArray(b), workingDateFromArray(startDate)))
}
function workingDateFromDateObject(a) {
  return parseInt(parseInt(a.getMonth()) + 1) + "/" + a.getDate() + "/" + a.getFullYear()
}
function holidayTakenSoFar() {
  var a = 0, b = 0;
  for(c in dateList) {
    if(!0 == dateList[c].isHoliday) {
      var c = c.split("/"), c = new Date(c[2], c[0] - 1, c[1]);
      c.getTime() < currentDate.getTime() ? a++ : b++
    }
  }
  hoursTaken = 7.5 * a;
  hoursPlanned = 7.5 * b
}
function setYearPeriod() {
  var a = parseFloat(currentYear) + 1;
  $("#yearPeriod").html(currentYear + " - " + a)
}
function updateCarriedOverDays() {
  carriedOver = 7.5 * carriedOverDaysHTML.val();
  carriedOverHoursHTML.val(carriedOver);
  currentYearNode["-carriedOver"] = carriedOver;
  updateTotalSpareDays()
}
function updateCarriedOverTime() {
  carriedOver = carriedOverHoursHTML.val();
  carriedOverDaysHTML.html(carriedOver / 7.5);
  currentYearNode["-carriedOver"] = carriedOver;
  updateTotalSpareDays()
}
function updateDaysAllowed() {
  timeAllowed = 7.5 * daysAllowedHTML.val();
  hoursAllowedHTML.html(timeAllowed);
  currentYearNode["-timeAllowed"] = timeAllowed;
  updateTotalSpareDays()
}
function updateTimeAllowed() {
  timeAllowed = hoursAllowedHTML.val();
  daysAllowedHTML.val(timeAllowed / 7.5);
  currentYearNode["-timeAllowed"] = timeAllowed;
  updateTotalSpareDays()
}
function updateTotalSpareDays() {
  var a = parseFloat(parseFloat(timeAllowed) + parseFloat(carriedOver) - parseFloat(hoursPlanned) - parseFloat(hoursTaken));
  totalSpareHoursHTML.html(a);
  totalSpareDaysHTML.html(parseFloat(a / 7.5))
}
function prevYear() {
  changeYear(-1)
}
function nextYear() {
  changeYear(1)
}
function changeYear(a) {
  currentYear = parseFloat(currentYear) + parseFloat(a);
  holidayTakenSoFar();
  YAHOO.calendar.cal1.setYear(currentYear);
  doLoad();
  YAHOO.calendar.cal1.render();
  setYearPeriod();
  populateControlBox("", "", "", "");
  updateCarriedOverTime();
  updateTimeAllowed()
}
function countHolidays() {
}
;YAHOO.namespace("calendar");
function workingDateFromArray(a) {
  return a[0][0][1] + "/" + a[0][0][2] + "/" + a[0][0][0]
}
var weekendRenderer = function(a, b) {
  b.innerHTML = "X";
  return YAHOO.widget.Calendar.STOP_RENDER
};
function weekdayRenderer(a, b) {
  a.getDate();
  a.getMonth();
  a.getFullYear();
  b.title = "";
  return YAHOO.widget.Calendar.STOP_RENDER
}
function bankHolidayRenderer(a, b) {
  YAHOO.calendar.cal1.styleCellDefault(a, b);
  var c = a.getDate();
  addContentsToCell(b, c, "highlight4");
  return YAHOO.widget.Calendar.STOP_RENDER
}
function normalRenderer(a, b) {
  YAHOO.calendar.cal1.styleCellDefault(a, b)
}
function holidayRenderer(a, b) {
  YAHOO.calendar.cal1.styleCellDefault(a, b);
  var c = a.getDate();
  addContentsToCell(b, c, "highlight3");
  return YAHOO.widget.Calendar.STOP_RENDER
}
function addContentsToCell(a, b, c) {
  YAHOO.util.Dom.addClass(a, c);
  a.innerHTML = b
}
;var dateRangeSelection = 0, startDate, client = null, clicktodeselect = !1, isCalendarLink = !1, bankHolidays;
init = function() {
  setHTMLVariables();
  setStartYear();
  YAHOO.calendar.cal1 = new YAHOO.widget.CalendarGroup("calendarContainer", {PAGES:12});
  YAHOO.calendar.cal1.selectEvent.subscribe(selectDateRange, YAHOO.calendar.cal1, !0);
  resetSelectOptions();
  loadServerDates();
  setButtons();
  setYearPeriod();
  YAHOO.calendar.cal1.setYear(currentYear);
  YAHOO.calendar.cal1.setMonth(month);
  renderDatesToCalendar();
  startDropbox();
  doLoad();
  setStartYear()
};
$(document).ready(init());
var _gaq = _gaq || [];
_gaq.push(["_setAccount", "UA-28963119-5"]);
_gaq.push(["_trackPageview"]);
(function() {
  var a = document.createElement("script");
  a.type = "text/javascript";
  a.async = !0;
  a.src = ("https:" == document.location.protocol ? "https://ssl" : "http://www") + ".google-analytics.com/ga.js";
  var b = document.getElementsByTagName("script")[0];
  b.parentNode.insertBefore(a, b)
})();

