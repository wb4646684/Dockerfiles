AJS.test.require(["jira.webresources:toggle-block"], function () {
    "use strict";

    module("ToggleBlock", {
        setup: function setup() {
            var ToggleBlock = require("jira/toggleblock/toggle-block");
            this.toggleBlock = new ToggleBlock();
        }
    });

    test("checkIsPermlink", function () {
        var urlBase = "http://localhost:8090/jira/browse/HSP-1";
        var toggleBlock = this.toggleBlock;

        ok(toggleBlock.checkIsPermlink(urlBase + "?focusedCommentId=xxx"));
        ok(toggleBlock.checkIsPermlink(urlBase + "?focusedWorklogId=xxx"));
        ok(toggleBlock.checkIsPermlink(urlBase + "?focusedCommentId=xxx#zzz"));
        ok(toggleBlock.checkIsPermlink(urlBase + "?focusedCommentId=10000&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-10000"));

        ok(!toggleBlock.checkIsPermlink(urlBase));
        ok(!toggleBlock.checkIsPermlink(urlBase + "?page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-10000"));
    });

    module("ToggleBlock LocalStorage", {
        setup: function setup() {
            this.sandbox = sinon.sandbox.create();
            this.context = AJS.test.mockableModuleContext();

            this.original$ = require("jquery");
            this.$ = sinon.sandbox.stub();
            this.$.returns({
                is: function is() {
                    return false;
                }, // early exit, e.g. don't care about is(blockSelector)
                data: function data() {}, // ignore uid
                delegate: function delegate() {} // ignore events
            });
            this.$.extend = function (target) {
                for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    sources[_key - 1] = arguments[_key];
                }

                return Object.assign.apply(Object, [target].concat(sources));
            };
            this.$.inArray = function (needle, array) {
                return array.indexOf(needle) !== -1;
            };
            this.context.mock("jquery", this.$);

            this.getItemMock = sinon.sandbox.stub();
            this.setItemMock = sinon.sandbox.spy();
            this.context.mock("jira/data/local-storage", {
                getItem: this.getItemMock,
                setItem: this.setItemMock
            });

            this.context.mock("jira/util/events", {
                bind: function bind() {} // ignore events
            });

            var ToggleBlock = this.context.require("jira/toggleblock/toggle-block");
            this.toggleBlock = new ToggleBlock();
        },
        teardown: function teardown() {
            this.sandbox.restore();
        },
        verifyNoExceptionThrown: function verifyNoExceptionThrown(cb) {
            cb();
            ok(true);
        },
        getStorageKey: function getStorageKey() {
            return "twixi-blocks";
        }
    });

    // #_collapseTwiciBlocksFromStorage
    // 1) if $ not called <- the whole content in local storage was incorrect and filtered out
    test("Should not fail when all ids were filtered out", function () {
        // given
        var storageValue = '#not;so.correct"id,#another[one';
        this.getItemMock.returns(storageValue);
        this.$.reset();

        // when
        this.toggleBlock._collapseTwiciBlocksFromStorage();

        // then
        sinon.assert.notCalled(this.$);
    });

    // #_collapseTwiciBlocksFromStorage
    // 2) assert what's been called
    [{
        'name': 'Should filter incorrect ids out',
        'in': '#abc,#not;so.correct,#good-one,#bad[one',
        'out': '#abc,#good-one'
    }, {
        'name': 'Should handle extra commas and not fail',
        'in': ',#greenhopper-agile',
        'out': '#greenhopper-agile'
    }, {
        'name': 'Should filter empty & bad ids out and not fail',
        'in': ',#abc,,#bad[one,no-hash,',
        'out': '#abc'
    }, {
        'name': 'Should keep correct ids',
        'in': '#greenhopper-agile-issue-web-panel,#hipchat-viewissue-panel',
        'out': '#greenhopper-agile-issue-web-panel,#hipchat-viewissue-panel'
    }].forEach(function (spec) {
        test("" + spec.name, function () {
            var _this = this;

            // given
            this.getItemMock.returns(spec.in);
            this.$.reset();

            // when
            this.toggleBlock._collapseTwiciBlocksFromStorage();

            // then
            sinon.assert.calledOnce(this.$);
            sinon.assert.calledWithExactly(this.$, spec.out);
            this.verifyNoExceptionThrown(function () {
                return _this.original$(spec.out);
            });
        });
    });

    // #_updateTwixiBlockIdInStorage
    // 1) there's the early quit when given blockId is incorrect
    [{
        'id': '#one,#two'
    }, {
        'id': '#bad;one'
    }, {
        'id': 'no-hash'
    }, {
        'id': '#incorrect.id'
    }].forEach(function (spec) {
        test("Should ignore an invalid id: " + spec.id, function () {
            // given
            this.getItemMock.reset();

            // when
            this.toggleBlock._updateTwixiBlockIdInStorage(spec.id);

            // then
            sinon.assert.notCalled(this.getItemMock);
        });
    });

    // #_updateTwixiBlockIdInStorage
    // 2) should add ids to the storage (no extra commas)
    [{
        'id': '#good-one',
        'storageIn': '',
        'storageOut': '#good-one'
    }, {
        'id': '#correct-id__v2',
        'storageIn': '#good-one',
        'storageOut': '#good-one,#correct-id__v2'
    }, {
        'id': '#a-We__SoM---e1D-000',
        'storageIn': '#correct-id__v2,#good-one',
        'storageOut': '#correct-id__v2,#good-one,#a-We__SoM---e1D-000'
    }].forEach(function (spec) {
        test("Should add the id=" + spec.id + " to the storage with initial content: " + spec.storageIn, function () {
            // given
            this.getItemMock.returns(spec.storageIn);
            this.setItemMock.reset();

            // when
            this.toggleBlock._updateTwixiBlockIdInStorage(spec.id);

            // then
            sinon.assert.calledOnce(this.setItemMock);
            sinon.assert.calledWithExactly(this.setItemMock, this.getStorageKey(), spec.storageOut);
        });
    });

    // #_updateTwixiBlockIdInStorage
    // 3) should remove ids to the storage (no extra commas)
    [{
        'id': '#good-one',
        'storageIn': '#good-one',
        'storageOut': ''
    }, {
        'id': '#good-one',
        'storageIn': '#good-one,#correct-id__v2',
        'storageOut': '#correct-id__v2'
    }, {
        'id': '#correct-id__v2',
        'storageIn': '#good-one,#correct-id__v2',
        'storageOut': '#good-one'
    }, {
        'id': '#a-We__SoM---e1D-000',
        'storageIn': '#correct-id__v2,#a-We__SoM---e1D-000,#good-one',
        'storageOut': '#correct-id__v2,#good-one'
    }].forEach(function (spec) {
        test("Should remove the id=" + spec.id + " from the storage with initial content: " + spec.storageIn, function () {
            // given
            this.getItemMock.returns(spec.storageIn);
            this.setItemMock.reset();

            // when
            this.toggleBlock._updateTwixiBlockIdInStorage(spec.id);

            // then
            sinon.assert.calledOnce(this.setItemMock);
            sinon.assert.calledWithExactly(this.setItemMock, this.getStorageKey(), spec.storageOut);
        });
    });

    // #_updateTwixiBlockIdInStorage
    // 4) should filter/clear local storage key (incorrect values disappear on save)
    [{
        'id': '#good-one',
        'storageIn': ',#good-one',
        'storageOut': ''
    }, {
        'id': '#good-one',
        'storageIn': '#good-one,',
        'storageOut': ''
    }, {
        'id': '#good-one',
        'storageIn': '#bad.one,#correct-id__v2,',
        'storageOut': '#correct-id__v2,#good-one'
    }, {
        'id': '#a-We__SoM---e1D-000',
        'storageIn': '00,#abc,no-hash,#good-one,#bad;one,,+_),\',",&,^,:,*,+,[,],,,',
        'storageOut': '#abc,#good-one,#a-We__SoM---e1D-000'
    }].forEach(function (spec) {
        test("Should filter out incorrect values on save from the storage with initial content: " + spec.storageIn, function () {
            // given
            this.getItemMock.returns(spec.storageIn);
            this.setItemMock.reset();

            // when
            this.toggleBlock._updateTwixiBlockIdInStorage(spec.id);

            // then
            sinon.assert.calledOnce(this.setItemMock);
            sinon.assert.calledWithExactly(this.setItemMock, this.getStorageKey(), spec.storageOut);
        });
    });
});