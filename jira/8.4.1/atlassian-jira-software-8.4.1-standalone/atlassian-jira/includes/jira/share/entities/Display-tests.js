AJS.test.require(["jira.webresources:share-types", "jira/share/entities/display"], function () {
    "use strict";

    var Display = require('jira/share/entities/display');
    var jQuery = require('jquery');

    module("Display", {
        setup: function setup() {
            this.key = "userKey";
            var spanId = "span_id";

            this.sandbox = sinon.sandbox.create();
            this.display = new Display(this.key, "", "", "", this.key);
            this.dataSpan = document.createElement('span');
            jQuery('body').append(this.dataSpan);
            this.dataSpan.id = spanId;
            this.dataSpan.innerHTML = this.key;
            this.display.dataSpanId = spanId;
        },
        teardown: function teardown() {
            this.sandbox.restore();
            this.dataSpan.remove();
        }
    });

    test("Leaves the userKey in place if fails to fetch the displayName", function () {
        expect(2);
        var that = this;

        var ajax = this.sandbox.stub(jQuery, "ajax");
        this.display.updateDisplayName();

        window.setTimeout(function () {
            sinon.assert.calledOnce(ajax);
            sinon.assert.match(that.dataSpan.innerHTML, that.key);
            QUnit.start();
        }, 0);

        QUnit.stop();
    });

    test("Swaps userKey for displayName if possible", function () {
        expect(4);
        var that = this;
        var displayName = "Display Name";
        var data = { "displayName": displayName };

        var ajax = this.sandbox.stub(jQuery, "ajax").yieldsTo("success", data);
        var update = this.sandbox.spy(this.display, "swapNames");
        var getMsg = this.sandbox.stub(this.display, "getMessage", function () {
            return displayName;
        });

        this.display.updateDisplayName();

        window.setTimeout(function () {
            sinon.assert.calledOnce(ajax);
            sinon.assert.calledOnce(update);
            sinon.assert.calledOnce(getMsg);
            sinon.assert.match(that.dataSpan.innerHTML, displayName);
            QUnit.start();
        }, 0);

        QUnit.stop();
    });
});