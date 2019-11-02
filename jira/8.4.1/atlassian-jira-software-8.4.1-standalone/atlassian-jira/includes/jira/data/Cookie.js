define('jira/data/cookie', ['wrm/context-path', 'atlassian/libs/cookie-1.0.0', 'underscore'], function (wrmContextPath, Cookie, _) {
    'use strict';

    var JiraCookie = _.clone(Cookie);

    var originalSave = JiraCookie.save;
    var originalSaveToConglomerate = JiraCookie.saveToConglomerate;
    JiraCookie.save = function (name, value, days) {
        return originalSave(name, value, days, wrmContextPath());
    };
    JiraCookie.saveToConglomerate = function (cookieName, name, value) {
        return originalSaveToConglomerate(cookieName, name, value, wrmContextPath());
    };

    return JiraCookie;
});