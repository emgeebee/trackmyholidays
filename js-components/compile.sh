rm ./libraries/trackmyholidays.js
rm ../js/trackmyholidays-compiled.js

java -jar compiler.jar \
	--js logging.js \
	--js calendar-data.js \
	--js dropbox-functions.js \
	--js calendar-dates.js \
	--js calendar-functions.js \
	--js calendar-social.js \
	--js analytics.js \
	--js icalcreator.js \
	--js calendar-UI.js \
	--js calendar-start.js \
	--js webonly.js \
	--js_output_file ./libraries/trackmyholidays.js

java -jar compiler.jar \
	--js ./libraries/yahoo-dom-event.js \
	--js ./libraries/date-math.js \
	--js ./libraries/calendar-min.js \
	--js ./libraries/jquery.js \
	--js ./libraries/jquery-ui.js \
	--js ./libraries/dropbox.js \
	--js ./libraries/trackmyholidays.js \
	--formatting pretty_print \
	--warning_level QUIET \
	--js_output_file ../js/trackmyholidays-compiled.js
