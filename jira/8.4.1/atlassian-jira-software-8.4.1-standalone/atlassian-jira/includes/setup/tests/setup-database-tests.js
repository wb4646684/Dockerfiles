AJS.test.require("jira.webresources:jira-setup", function () {
    var $ = require("jquery");
    var _ = require("underscore");

    var dbData = function dbData(name, selected) {
        var isSelected = !!selected;
        return { selected: isSelected, text: name, value: name };
    };

    var viewConfiguration = {
        errors: {},
        databaseOptions: {},
        externalDatabases: [dbData("mssql", true), dbData("mysql"), dbData("oracle10g"), dbData("postgres72")],
        helpPaths: {
            migration: "migtation.url",
            external: "external.url"
        },
        fieldValues: {}
    };

    module("JIRA Db Select page tests", {
        setup: function setup() {

            this.orgFormat = AJS.format;

            // we need this mock to render links that are passed to getText method in Soy as parameters
            AJS.format = function () {
                return arguments[1] + arguments[0] + arguments[2];
            };

            var markup = JIRA.Templates.Setup.layoutContent({
                content: JIRA.Templates.Setup.Database.pageContents(_.extend({
                    globalErrors: []
                }, viewConfiguration))
            });

            var className = "jira-setup-database-page";

            this.sandbox = sinon.sandbox.create({
                useFakeServer: true
            });

            $("#qunit-fixture").append($("<div></div>").addClass(className).html(markup));

            this.setupTrackerMock = {
                insert: sinon.spy(),
                sendUserClickedOnMigrationsLink: sinon.spy(),
                sendUserClickedOnConnectingJiraToDatabaseLink: sinon.spy(),
                sendUserPickedDatabase: sinon.spy()
            };

            this.mockedContext = AJS.test.mockableModuleContext();
            // we need to 'mock' those resources with themselves because cashew is removing prototype chain
            // which results in instanceof checks breaking
            this.mockedContext.mock("jira/ajs/contentretriever/dom-content-retriever", require("jira/ajs/contentretriever/dom-content-retriever"));
            this.mockedContext.mock("jira/ajs/contentretriever/content-retriever", require("jira/ajs/contentretriever/content-retriever"));
            this.mockedContext.mock("jira/setup/setup-tracker", this.setupTrackerMock);

            var View = this.mockedContext.require("jira/setup/setup-database-view");

            this.initializeView = function () {
                this.view = new View({
                    el: "." + className
                });
            };
        },

        teardown: function teardown() {
            this.sandbox.restore();
            this.view.remove();
            AJS.format = this.orgFormat;
        }
    });

    test("Error messages are displayed in the notifications area", function () {

        this.initializeView();

        this.view.testConnection();

        this.sandbox.server.requests[0].respond(200, { "Content-Type": "application/json" }, JSON.stringify({
            data: _.extend({
                dbTestSuccessful: false,
                databaseMessagesContent: [],
                globalErrors: ["errorFoo", "errorBar"]
            }, viewConfiguration)
        }));

        deepEqual(_.map(this.view.ui.errorMessages.children(), function (element) {
            return $(element).html();
        }), ["errorFoo", "errorBar"], "Errors are displayed on the page");
        equal(0, this.view.ui.successMessages.length, "Success message is not displayed.");
    });

    test("DB fields are hidden and shown on changing db type.", function () {

        this.initializeView();

        var dbTypeSelect = this.view.ui.dbType;
        var setDbType = function setDbType(value) {
            dbTypeSelect.val(value);
            dbTypeSelect.children().removeAttr("selected").filter(function (num, el) {
                return $(el).html() == value;
            }).attr("selected", "");
            dbTypeSelect.trigger("change");
        };
        var checkFields = function checkFields(oldDb, newDb) {
            equal(AJS.$(".db-type-" + oldDb).filter(function (num, el) {
                return !$(el).hasClass("db-type-" + newDb);
            }).filter(function (num, el) {
                return !$(el).hasClass("hidden");
            }).length, 0, "Should hide all " + oldDb + " specific fields.");
            equal(AJS.$(".db-type-" + newDb).filter(function (num, el) {
                return $(el).hasClass("hidden");
            }).length, 0, "None of the " + newDb + " should be hidden.");
        };
        var morphIntoPairs = function morphIntoPairs(firstElement, nextElements) {
            var s = firstElement;
            return _.map(nextElements, function (e) {
                var r = { oldDb: s, newDb: e };
                s = e;
                return r;
            });
        };

        _.each(morphIntoPairs("mssql", ["mysql", "oracle10g", "postgres72"]), function (dbs) {
            setDbType(dbs.newDb);
            checkFields(dbs.oldDb, dbs.newDb);
        });
    });

    test("Analytics event is sent after clicking in migrations link", function () {
        this.initializeView();

        this.view.ui.migrations.click();

        ok(this.setupTrackerMock.sendUserClickedOnMigrationsLink.calledOnce);
    });

    test("Analytics event is sent after clicking in connecting Jira to DB link", function () {
        this.initializeView();

        this.view.ui.connectingJiraToDB.click();

        ok(this.setupTrackerMock.sendUserClickedOnConnectingJiraToDatabaseLink.calledOnce);
    });

    test("Analytics event is sent after user submited form", function () {
        this.initializeView();
        this.sandbox.stub(this.view.ui.form, "submit");

        this.view.onSubmit({
            preventDefault: function preventDefault() {}
        });

        ok(this.setupTrackerMock.sendUserPickedDatabase.calledOnce);
    });
});