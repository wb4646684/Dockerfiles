/**
 * Populates calendar's day/month names from moment js if available. Moment.js day month names are in initially populated
 * from java's current locale (see moment.jira.i18n.js).
 * This file must be loaded after loading calendar specific localization file (e.g calendar-en.js) in order
 * to override values provided by it (this is done by CalendarResourceIncluder.java).
 */

define("jira/calendar/localisation-moment", ["require"], function(require) {
    "use strict";

    var moment = require("jira/moment");
    var Calendar = require("jira/libs/calendar");

    var localeData = moment.localeData('jira');
    if (localeData === null || typeof localeData !== 'object') {
        return;
    }

    if (typeof Calendar !== 'function') {
        return;
    }

    //Calendar.js needs 8 element array for days (starting and ending with sunday)
    Calendar._DN = localeData._weekdays.concat(localeData._weekdays[0]);
    Calendar._SDN = localeData._weekdaysShort.concat(localeData._weekdaysShort[0]);

    Calendar._MN = [].concat(localeData._months);
    Calendar._SMN = [].concat(localeData._monthsShort);
});
require("jira/calendar/localisation-moment");
