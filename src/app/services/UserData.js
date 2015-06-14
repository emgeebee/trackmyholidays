'use strict';

class UserData {
  constructor () {
    var data = window.localStorage.holidayTrackerDates;
    this.version = 0.1;
    if (data) {
        var dataObj = JSON.parse(data);

        var dates = dataObj.dateList;
        if (data.version === undefined) {
            dates = this.convertOldDates(dataObj.dateList);
        }

        this.dates = dates;
        this.weekdays = dataObj['-weekendDays'];
        this.country = dataObj['-country'];
        this.yearStart = dataObj['-yearStart'];
    } else {
        this.dates = null;
    }
  }

  getDates() {
    return this.dates;
  }

  setDates(dates) {
    this.dates = dates;
  }

  getYearStart() {
    return this.yearStart - 1;
  }

  setYearStart(yearStart) {
    this.yearStart = yearStart;
  }

  convertOldDates(oldDates) {
    for (var year in oldDates) {
      var yearDates = oldDates[year]['date']
      for (var date in yearDates) {
        if (yearDates[date]['-isBankHoliday'] === false) {
          var rangeArray = yearDates[date]['-dateRange'].split(',');
          yearDates[date]['holidayCalendars'] = [1];
          yearDates[date]['rangeStart'] = rangeArray[0];
          yearDates[date]['rangeEnd'] = rangeArray[rangeArray.length - 1];    
        } else {
          yearDates[date]['holidayCalendars'] = [0];
        }
      }
    }
    return oldDates;
  }

  getDatesForYear(workingYear) {
    return this.dates[workingYear]['date'];
  }

  workingDateFromDateObject(date) {
    return parseInt(parseInt(date.getMonth()) + 1) + '/' + date.getDate() + '/' + date.getFullYear();
  }

}

export default UserData;