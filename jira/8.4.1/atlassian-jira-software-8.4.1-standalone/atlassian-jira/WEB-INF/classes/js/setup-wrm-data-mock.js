(function (globalWRM, AJS) {
    "use strict";

    var WRM = window.WRM = globalWRM || {};
    WRM.data = WRM.data || {};
    WRM.data.claim = WRM.data.claim || function () {};

    AJS = AJS || {};
    AJS.I18n = AJS.I18n || {};
    AJS.I18n.getText = function (key) {
        return key;
    };

    define("wrm/data", [], function () {
        return WRM.data;
    });
})(window.WRM, window.AJS);