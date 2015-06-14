'use strict';

class Dates {
  constructor (UserData) {

    this.UserData = UserData;
    this.currentDate = new Date();

  }

  getCurrentYear() {
    var month = this.UserData.getYearStart();
    if (this.currentDate.getMonth() < month){
      this.currentYear = parseInt(this.currentDate.getFullYear()) - 1;
    } else {
      this.currentYear = parseInt(this.currentDate.getFullYear());
    }
    return this.currentYear;
  }

  getHolidaysForCurrentYear() {
    return this.getDatesForCurrentYear(false);
  }

  getBankHolidaysForCurrentYear() {
    return this.getDatesForCurrentYear(true);
  }

  getDatesForCurrentYear(qualifier) {
    var currentYear = this.getCurrentYear();
    var fullDates = this.UserData.getDates();
    var data = fullDates[currentYear].date;

    var holidays = [];
    for (var i = data.length - 1; i >= 0; i--) {
      if (data[i]['-isBankHoliday'] === qualifier) {
        continue;
      }
      holidays.push(data[i]);
    };
    return holidays;
  }

}

Dates.$inject = ['UserData'];

export default Dates;