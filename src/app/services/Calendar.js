class Calendar {
    constructor(id, name, bankHolidays = false) {
    	this.name = name;
    	this.colour = '#0C0C0C';
    	this.class = 'calendar-' + id;
    	this.id = id;
    	this.bankHolidays = bankHolidays;
    	this.showCountdown = false;
    	return this;
    }

    setColour(c) {
    	this.colour(c);
    }
    switchView(c) {
    	console.log(this);
    	if (this.bankHolidays === true) {
    		return;
    	}
    	this.showCountdown = !this.showCountdown;
    }
}
export default Calendar;