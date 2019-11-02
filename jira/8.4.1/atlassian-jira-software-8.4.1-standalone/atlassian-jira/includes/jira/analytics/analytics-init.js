require(['jquery', 'jira/analytics', 'jira/util/data/meta'], function ($, analytics, meta) {
    'use strict';

    function addPrefixToAnalytics(name) {
        var analyticsPrefix = meta.get('analytics-prefix');
        if (analyticsPrefix) {
            name = analyticsPrefix + name;
        }
        return name;
    }

    /**
     * Capture analytics events from DOM elements with an appropriate attribute.
     * This saves us registering a number of redundant and repetitive
     * event handlers everywhere to track simple things.
     */
    function bindEvents() {
        // limitation, it does not work for dynamically added elements!
        // you may want to refactor this if you need such feature
        // one of possible solutions is using skate.js(MutationObserver) but it comes with a cost
        $("[data-track-pageview]").each(function (idx, element) {
            analytics.send({ name: addPrefixToAnalytics($(element).data("track-pageview")) });
        });
    }

    // We can register a delegated event handler immediately, since document will always exist
    $(document).on("click", "[data-track-click]", function () {
        analytics.send({ name: addPrefixToAnalytics($(this).data("track-click")) });
    });

    $(document).on("auxclick", "[data-track-auxclick]", function () {
        analytics.send({ name: addPrefixToAnalytics($(this).data("track-auxclick")) });
    });

    // Initialise on DomContentLoaded.
    $(bindEvents);
});