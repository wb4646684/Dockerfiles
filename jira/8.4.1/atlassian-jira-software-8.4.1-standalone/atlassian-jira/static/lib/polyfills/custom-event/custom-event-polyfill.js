// Sourced from https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
//licensed under https://creativecommons.org/publicdomain/zero/1.0/
//https://developer.mozilla.org/en-US/docs/MDN/About#Copyrights_and_licenses
//Remove this polyfill once the support for Internet Explorer will be dropped
(function () {
    if (typeof window.CustomEvent === "function") return false;

    function CustomEvent(event, params) {
        params = params || {bubbles: false, cancelable: false, detail: undefined};
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();