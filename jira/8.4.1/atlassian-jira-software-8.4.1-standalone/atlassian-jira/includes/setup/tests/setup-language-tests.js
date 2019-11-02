AJS.test.require("jira.webresources:jira-setup", function () {

    var $ = require("jquery");
    var markup = JIRA.Templates.Setup.layoutContent({});
    var View = require("jira/setup/setup-language-view");

    var DEFAULT_LOCALE = "en_UK";

    module("JIRA setup language dialog", {
        setup: function setup() {
            this.sandbox = sinon.sandbox.create({
                useFakeServer: true
            });
            this.lastRequestIndexToRespond = 0;

            $("#qunit-fixture").html(markup);

            this.view = new View({
                el: "#jira-setup-language-dialog",
                reloadFunction: this.reloadFunctionSpy,
                reloadFunctionContext: this.reloadFunctionContext
            });

            this.view.showInitial();
        },

        respondToLastRequest: function respondToLastRequest(status, data) {
            var data = data || {};
            var lastIndex = this.sandbox.server.requests.length - 1;

            equal(lastIndex, this.lastRequestIndexToRespond, "expecting particular number of requests in the queue");

            this.sandbox.server.requests[lastIndex].respond(status, { "Content-Type": "application/json" }, JSON.stringify(data));
            this.lastRequestIndexToRespond++;
        },

        respondToGetInitialListOfInstalledLocales: function respondToGetInitialListOfInstalledLocales() {
            this.respondToLastRequest(200, {
                "currentLocale": DEFAULT_LOCALE,
                "locales": {
                    "de_DE": "Deutsch (Deutschland)",
                    "en_UK": "English (UK)"
                }
            });
        },

        respondToGetInitialListOfInstalledLocalesWithError: function respondToGetInitialListOfInstalledLocalesWithError() {
            this.respondToLastRequest(500);
        },

        respondToLocaleChangeWithNewI18nTexts: function respondToLocaleChangeWithNewI18nTexts() {
            this.respondToLastRequest(200, {
                "button": "button"
            });
        },

        respondToLocaleChangeWithError: function respondToLocaleChangeWithError() {
            this.respondToLastRequest(500);
        },

        selectLocale: function selectLocale(locale) {
            var descriptor = this.view.ui.select.find("option[value='" + locale + "']").data("descriptor");

            this.view.langSingleSelect.setSelection(descriptor);
        },

        startView: function startView() {
            this.view.start();
            this.respondToGetInitialListOfInstalledLocales();
        },

        /**
         * Executes a function with 'this' context after expected MutationObserver callbacks are run.
         * Needed for aui-button 'busy' method extension to 'button' elements via skatejs.
         *
         * For native MO implementation Promise micro-task is enough:
         *  Promise.resolve().then(() => { ... }).catch((e) => { done(); throw e; });
         *
         * @param action function to run after expected MutationObserver callbacks are run
         */
        waitForMutationObserver: function waitForMutationObserver(action) {
            var _this = this;

            setTimeout(function () {
                action.call(_this);
            });
        },

        teardown: function teardown() {
            this.view.remove();
            this.sandbox.restore();
        }
    });

    test("after dialog is open should request installed locales and allow to select a new locale only after successful response", function () {
        // given
        this.view.start();

        // then
        equal(this.view.ui.spinner.length, 1, "spinner is visible");
        equal(this.view.ui.select.length, 0, "language select is not present");

        // when
        this.respondToGetInitialListOfInstalledLocales();

        // then
        equal(this.view.ui.spinner.length, 0, "spinner is not present");
        equal(this.view.ui.select.length, 1, "language select is present");
        equal(this.view.ui.select.val(), DEFAULT_LOCALE, "default locale is selected");
        equal(this.view.ui.button.is(":disabled"), true, "submit button is disabled");
    });

    test("should show a warning if cannot obtain list of installed locales from the server", function () {
        // given
        this.view.start();

        // when
        this.respondToGetInitialListOfInstalledLocalesWithError();

        // then
        equal(this.view.ui.spinner.length, 0, "spinner is not present");
        equal(this.view.ui.button.is(":disabled"), true, "submit button is disabled");
        equal(this.view.ui.warning.length, 1, "warning is present");

        // given
        var handler = this.sandbox.spy();
        this.view.on("cancel-requested", handler);

        // when
        this.view.ui.cancel.click();

        // then
        sinon.assert.calledOnce(handler, "cancel link works as expected");
    });

    test("save button should be enabled only if locale different than current is chosen", function (assert) {
        var _this2 = this;

        assert.expect(7);
        var done = assert.async();

        // given
        this.startView();

        // when
        this.selectLocale(DEFAULT_LOCALE);
        this.waitForMutationObserver(function () {
            // then
            equal(_this2.sandbox.server.requests.length, 1, "no request made if the same locale as current selected");
            equal(_this2.view.ui.button.is(":disabled"), true, "submit button is disabled");

            // when
            _this2.selectLocale("de_DE");
            _this2.respondToLocaleChangeWithNewI18nTexts();
            _this2.waitForMutationObserver(function () {
                // then
                equal(_this2.view.ui.button.is(":disabled"), false, "submit button is enabled");

                // when
                _this2.selectLocale(DEFAULT_LOCALE);
                _this2.respondToLocaleChangeWithNewI18nTexts();
                _this2.waitForMutationObserver(function () {
                    // then
                    equal(_this2.view.ui.button.is(":disabled"), true, "submit button is disabled");

                    done();
                });
            });
        });
    });

    test("after new locale is selected, should get list of texts in new language and apply them", function (assert) {
        var _this3 = this;

        assert.expect(4);
        var done = assert.async();

        // given
        this.startView();
        this.waitForMutationObserver(function () {
            // then
            equal(_this3.view.ui.button.text(), "common.words.save", "button has default label");

            // when
            _this3.selectLocale("de_DE");
            _this3.respondToLocaleChangeWithNewI18nTexts();

            // then
            equal(_this3.view.ui.button.text(), "button", "button's label is changed");

            done();
        });
    });

    test("should show a warning if cannot obtain list of texts in new language from the server", function (assert) {
        var _this4 = this;

        assert.expect(6);
        var done = assert.async();

        // given
        this.startView();
        this.waitForMutationObserver(function () {
            // when
            _this4.selectLocale("de_DE");
            _this4.respondToLocaleChangeWithError();
            _this4.waitForMutationObserver(function () {
                // then
                equal(_this4.view.ui.button[0].isBusy(), false, "spinner is hidden");
                equal(_this4.view.ui.button.is(":disabled"), true, "submit button is disabled");
                equal(_this4.view.ui.warning.length, 1, "warning is present");

                // given
                var handler = _this4.sandbox.spy();
                _this4.view.on("cancel-requested", handler);

                // when
                _this4.view.ui.cancel.click();

                // then
                sinon.assert.calledOnce(handler, "cancel link works as expected");
                done();
            });
        });
    });

    test("while making request for texts language select and submit button should be disabled and spinner should be visible", function (assert) {
        var _this5 = this;

        assert.expect(8);
        var done = assert.async();

        // given
        this.startView();
        this.waitForMutationObserver(function () {
            // when
            _this5.selectLocale("de_DE");

            // then
            equal(_this5.view.langSingleSelect.$container.hasClass("aui-disabled"), true, "language select is disabled");
            equal(_this5.view.ui.button.is(":disabled"), true, "submit button is disabled");
            equal(_this5.view.ui.button[0].isBusy(), true, "footer spinner is visible");

            // when
            _this5.respondToLocaleChangeWithNewI18nTexts();
            _this5.waitForMutationObserver(function () {
                // then
                equal(_this5.view.langSingleSelect.$container.hasClass("aui-disabled"), false, "language select is enabled");
                equal(_this5.view.ui.button.is(":disabled"), false, "submit button is enabled");
                equal(_this5.view.ui.button[0].isBusy(), false, "footer spinner is hidden");
                done();
            });
        });
    });

    test("clicking on cancel link raises an event", function () {
        // given
        this.startView();
        var handler = this.sandbox.spy();
        this.view.on("cancel-requested", handler);

        // when
        this.view.ui.cancel.click();

        // then
        sinon.assert.calledOnce(handler, "cancel link works as expected");
    });

    test("saving new locale should disable form, request the server to change the language and finally reload the page", function (assert) {
        var _this6 = this;

        assert.expect(8);
        var done = assert.async();

        // given
        var langChangeHandlerStub = this.sandbox.stub(this.view, "_languageChangeComplete");
        this.startView();
        this.waitForMutationObserver(function () {
            // when
            _this6.selectLocale("de_DE");
            _this6.respondToLocaleChangeWithNewI18nTexts();
            _this6.waitForMutationObserver(function () {
                _this6.view.ui.button.click();

                // then
                equal(_this6.view.langSingleSelect.$container.hasClass("aui-disabled"), true, "language select is disabled");
                equal(_this6.view.ui.button.is(":disabled"), true, "submit button is disabled");
                equal(_this6.view.ui.button[0].isBusy(), true, "footer spinner is visible");

                // when
                var changeLanguageReq = _this6.sandbox.server.requests[2];
                changeLanguageReq.respond(200, { "Content-Type": "application/json" }, JSON.stringify({}));

                // then
                notEqual(changeLanguageReq.url.indexOf("!changeLanguage.jspa"), -1, "should call the correct action");
                equal(changeLanguageReq.requestBody, "jiraLanguage=de_DE", "should send chosen locale");
                sinon.assert.calledOnce(langChangeHandlerStub, "should reload page");

                done();
            });
        });
    });
});