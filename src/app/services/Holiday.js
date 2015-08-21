class Holiday {
    constructor(id, notes, rangeArray, calendars, halfDay = false, date) {
        this.monthsArray = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

        if (rangeArray.length === 0) {
            rangeArray = [id, id, 1];
        }
        if (rangeArray.length === 1) {
            rangeArray = [id, id, 1];
        }
        if (typeof calendars === 'string' || typeof calendars === 'number') {
            calendars = [calendars];
        }
        this.notes = notes;
        this.id = id;
        this.halfDay = halfDay;
        this.holidayCalendars = calendars;
        this.classes = {};
        this.date = date.getTime();

        this.prepareClasses();

        var rangeStart = rangeArray[0];
        this.rangeStart = rangeStart;

        var rangeEnd = rangeArray[1];
        this.rangeEnd = rangeEnd;

        this.rangeLength = rangeArray[2];
        this.range = this.formatRange(rangeStart, rangeEnd);
    }

    formatRange(start, end) {
        var dayString = "";
        var monthString = "";
        var yearString = "";
        var datesSpan = false;
        if (start.getTime() === end.getTime()) {
            return this.getFormattedDate(start);
        }
        if (start.getMonth() === end.getMonth()) {
            monthString = start.getMonth();
        } else {
            datesSpan = true;
        };
        if (start.getYear() === end.getYear()) {
            yearString = start.getYear();
        } else {
            datesSpan = true;
        };

        return this.getFormattedDate(start) + ' - ' + this.getFormattedDate(end) + ' (' + this.rangeLength + ')';
    }

    getFormattedDate(dateObj, format = 'd/m/y') {
        var output = format
            .replace(/Y/g, dateObj.getFullYear())
            .replace(/y/g, dateObj.getFullYear().toString().slice(2,4))
            .replace(/G/g, dateObj.getHours())
            .replace(/i/g, dateObj.getMinutes())
            .replace(/j/g, dateObj.getDate())
            .replace(/d/g, ("0" + dateObj.getDate()).slice(-2))
            .replace(/M/g, this.monthsArray[dateObj.getMonth()])
            .replace(/m/g, ("0" + (dateObj.getMonth()+1)).slice(-2))
            .replace(/n/g, dateObj.getMonth()+1);
        return output;
    }


    prepareClasses() {

        for (var i = this.holidayCalendars.length - 1; i >= 0; i--) {
            this.classes['calendar-' + this.holidayCalendars[i]] = true;
        }

        if (this.halfDay) {
            this.classes['half-day'] = true;
        }
    }

}

export default Holiday;