AJS.test.require(["jira.webresources:viewcustomfields"], function () {
    "use strict";

    var _ = require("underscore");
    var $ = require("jquery");
    var CustomfieldsPageView = require("jira/customfields/customfieldsView");

    module("CustomfieldsPageView", {
        setup: function setup() {
            this.sandbox = sinon.sandbox.create({ useFakeServer: true });
            this.customFields = [{
                "name": "CF 1",
                "type": "Number Field",
                "contextSchemesCount": 1,
                "screensCount": 1
            }, {
                "name": "CF 2",
                "type": "Magic Field",
                "searcherKey": "nosearcher",
                "contextSchemesCount": 10,
                "screensCount": 0
            }];

            $('#qunit-fixture').html('<section id="customfields-container"> </section>');

            this.mockCustomfieldsResponse();
            this.customfieldsPageView = new CustomfieldsPageView({ el: '#customfields-container' });
        },
        teardown: function teardown() {
            this.sandbox.restore();
        },
        mockCustomfieldsResponse: function mockCustomfieldsResponse() {

            this.sandbox.server.respondWith([200, {
                'Content-Type': 'application/json'
            }, JSON.stringify({
                "maxResults": 25,
                "startAt": 0,
                "total": this.customFields.length,
                "isLast": true,
                "values": this.customFields.map(function (field, idx) {
                    return _.extend({
                        "id": "customfield_" + (10000 + idx),
                        "self": "http://localhost:8090/jira/rest/api/2/customFields/customfield_" + (10000 + idx),
                        "numericId": 10000 + idx,
                        "isLocked": false,
                        "isManaged": false,
                        "searcherKey": "asdsda"
                    }, field);
                })
            })]);
        }
    });

    test("Custom fields list is rendered", function () {
        this.sandbox.server.respond();

        var $tbody = $('#qunit-fixture #custom-fields-table tbody');
        var names = $tbody.find('tr>td:first-child>strong').map(function (i, el) {
            return el.innerHTML;
        }).get();
        var types = $tbody.find('tr>td:first-child+td>span').map(function (i, el) {
            return el.innerHTML;
        }).get();

        deepEqual(names, _.pluck(this.customFields, "name"), "Names are rendered");
        deepEqual(types, _.pluck(this.customFields, "type"), "Types are rendered");
    });

    test("Displays progress indicator on load", function () {

        var $container = $('#qunit-fixture #customfields-container');

        ok($container.hasClass('active'), "has progress indicator overlay");
        ok($container.has('aui-spinner').length, "has aui spinner");

        this.sandbox.server.respond();

        notOk($container.hasClass('active'), "has no progress indicator overlay after data is loaded");
        notOk($container.has('aui-spinner').length, "hides aui spinner after data is loaded");
    });

    asyncTest("Displays progress indicator on search", function () {
        var _this = this;

        this.sandbox.server.respond();
        // Response for filters
        this.sandbox.server.respondWith([200, { 'Content-Type': 'application/json' }, JSON.stringify([])]);
        this.sandbox.server.respond();

        var $container = $('#qunit-fixture #customfields-container');
        var $searchInput = $container.find('#custom-fields-filter-text');
        //stop(); // pause the test
        $searchInput.val('blah').trigger("input");

        // wait for the debounce delay
        setTimeout(function () {
            ok($container.hasClass('active'), "has progress indicator overlay");
            ok($container.has('aui-spinner').length, "has aui spinner");

            _this.sandbox.server.respond();

            notOk($container.hasClass('active'), "has no progress indicator overlay after data is loaded");
            notOk($container.has('aui-spinner').length, "hides aui spinner after data is loaded");
            start();
        }, 1000);
    });

    asyncTest("Displays empty search results view on empty search", function () {
        var _this2 = this;

        this.sandbox.server.respond();
        // Response for filters
        this.sandbox.server.respondWith([200, { 'Content-Type': 'application/json' }, JSON.stringify([])]);
        this.sandbox.server.respond();

        var $container = $('#qunit-fixture #customfields-container');
        var $searchInput = $container.find('#custom-fields-filter-text');
        //stop(); // pause the test
        $searchInput.val('blah').trigger("input");

        // wait for the debounce delay
        setTimeout(function () {
            _this2.sandbox.server.respondWith([200, { 'Content-Type': 'application/json' }, JSON.stringify({
                "maxResults": 25,
                "startAt": 0,
                "total": 0,
                "isLast": true,
                "values": []
            })]);
            _this2.sandbox.server.respond();

            var $emptyViewRow = $('#qunit-fixture #custom-fields-table tbody tr');
            ok($emptyViewRow.length, "only one row for empty result message is rendered");
            ok($emptyViewRow.find('.jira-adbox.no-project-results').length, "empty view is displayed");

            notOk($container.hasClass('active'), "has no progress indicator overlay on empty screen");
            notOk($container.has('aui-spinner').length, "hides aui spinner after displaying empty screen");

            start();
        }, 1000);
    });

    asyncTest("Displays error flag on search failure", function () {
        var _this3 = this;

        this.sandbox.server.respond();

        var $container = $('#qunit-fixture #customfields-container');
        var $searchInput = $container.find('#custom-fields-filter-text');
        //stop(); // pause the test
        $searchInput.val('blah').trigger("input");

        // wait for the debounce delay
        setTimeout(function () {

            _this3.sandbox.server.respondWith([404, {}, ""]);
            _this3.sandbox.server.respond();

            var $auiMessage = $('#aui-flag-container .aui-message');
            ok($auiMessage.length, "error message is displayed");
            equal($auiMessage.text(), 'rest.error.internal', "error message is correct");

            notOk($container.hasClass('active'), "has no progress indicator overlay after search failure");
            notOk($container.has('aui-spinner').length, "hides aui spinner after search failure");

            start();
        }, 1000);
    });

    test("Projects link is correctly displayed", function () {

        this.customFields = [{
            name: "CF 3",
            type: "Number Field",
            isAllProjects: true,
            projectsCount: 0,
            screensCount: 1
        }, {
            name: "CF 4",
            type: "Number Field",
            isAllProjects: false,
            projectsCount: 0,
            screensCount: 1
        }, {
            name: "CF 5",
            type: "Test Field",
            searcherKey: "nosearcher",
            isAllProjects: false,
            projectsCount: 10,
            screensCount: 3
        }];
        this.mockCustomfieldsResponse();
        this.sandbox.server.respond();

        var $customFieldsTableBody = $('#qunit-fixture #customfields-container #custom-fields-table tbody');

        equal($customFieldsTableBody.find('tr:first td:eq(2)').text(), "admin.issuefields.customfields.global.all.projects", "displays global projects read onlytext");

        equal($customFieldsTableBody.find('tr:eq(1) td:eq(2)').text(), "admin.issuefields.customfields.projects.conditional", "displays 0 projects read only text");
        notOk($customFieldsTableBody.find('tr:eq(1) td:eq(2)').has('a').length, "0 projects text is read only");

        equal($customFieldsTableBody.find('tr:eq(2) td:eq(2)').text(), "admin.issuefields.customfields.projects.conditional", "displays n projects text");
        ok($customFieldsTableBody.find('tr:eq(2) td:eq(2)').has('a').length, "n projects text is clickable link");
    });

    asyncTest("Focus on search input field should not cause search execution (IE11)", function () {
        var _this4 = this;

        this.sandbox.server.respond();

        var $container = $('#qunit-fixture #customfields-container');
        var $searchInput = $container.find('#custom-fields-filter-text');
        this.customfieldsPageView.collection.getFirstPage = this.sandbox.spy();
        //stop(); // pause the test
        $searchInput.focus().trigger('focus');

        // wait for the debounce delay
        setTimeout(function () {
            notOk($container.hasClass('active'), "doesn't have progress indicator overlay");
            notOk($container.has('aui-spinner').length, "doesn't have aui spinner");

            sinon.assert.notCalled(_this4.customfieldsPageView.collection.getFirstPage);
            start();
        }, 1000);
    });
});