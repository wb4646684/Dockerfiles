AJS.test.require(["jira.webresources:jira-global"], function () {

    var $ = require('jquery');

    module("jira/dialog/init-generic-dialogs", {
        setup: function setup() {
            this.ajax = sinon.spy($, "ajax");
        },

        teardown: function teardown() {
            $.ajax.restore();
            $('#-dialog').remove();
            $('.aui-blanket').remove();
        }
    });

    test("Dialog shows after clicking a link", function () {
        var link = $('<a class="trigger-dialog" href="#">Test</a>');
        $('#qunit-fixture').append(link);
        link.click();
        ok(this.ajax.calledOnce);
        link.remove();
    });

    test("Dialog shows after clicking aui-dropdown", function () {
        var link = $('<aui-item-link class="trigger-dialog" href="#">Test</aui-item-link>');
        $('#qunit-fixture').append(link);
        link.click();
        ok(this.ajax.calledOnce);
        link.remove();
    });

    test("No dialog without trigger-dialog class", function () {
        var link = $('<a href="http://test.com">Test</a>');
        $('#qunit-fixture').append(link);
        link.click();
        ok(this.ajax.notCalled);
        link.remove();
    });
});