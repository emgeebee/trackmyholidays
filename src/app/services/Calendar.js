class Calendar {
    constructor(id, name, bankHolidays = false) {
    	this.name = name;
    	this.colour = '#0C0C0C';
    	this.class = 'calendar-' + id;
    	this.id = id;
    	this.bankHolidays = bankHolidays;
    	return this;
    }

    setColour(c) {
    	this.colour(c);
    }
}
export default Calendar;