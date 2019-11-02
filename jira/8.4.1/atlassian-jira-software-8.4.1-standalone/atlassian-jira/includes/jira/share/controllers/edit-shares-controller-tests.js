AJS.test.require(["jira.webresources:share-types", "jira/share/entities/share-type/group-share", "jira/share/entities/share-permission"], function () {
    "use strict";

    var EditSharesController = require("jira/share/controllers/edit-shares-controller");
    var GroupShare = require("jira/share/entities/share-type/group-share");
    var SharePermission = require("jira/share/entities/share-permission");
    var ShareFactory = require('jira/share/share-factory');

    var groupShare = void 0;

    module("EditSharesController", {
        setup: function setup() {
            this.sandbox = sinon.sandbox.create();
            this.mode = "editors";
            this.sandbox.stub(window, "confirm", function () {
                return false;
            });

            this.modeEditors = "editors";
            this.modeViewers = "viewers";

            this.mockEvent = {
                preventDefault: function preventDefault() {}
            };
            this.preventDefault = sinon.spy(this.mockEvent, "preventDefault");

            groupShare = new GroupShare(this.modeEditors);
            this.sandbox.stub(groupShare, "getDisplayFromUI", function () {
                return {
                    permission: new SharePermission("group", "jira-servicedesk-users", null)
                };
            });

            var duplicateFinder = ShareFactory.findDuplicatesInOtherModes.bind(ShareFactory);
            var preventSave = ShareFactory.preventSaveHandler.bind(ShareFactory);
            this.editorController = new EditSharesController(this.modeEditors, duplicateFinder, preventSave);
            this.editorController.registerShareType(groupShare);
            this.sandbox.stub(this.editorController, "getCurrentShareType", function () {
                return groupShare;
            });
            this.addDisplay = this.sandbox.stub(this.editorController.view, "addDisplay");
            this.sandbox.stub(this.editorController, "getNewContainer", function () {
                return true;
            });

            this.viewerController = new EditSharesController(this.modeViewers, duplicateFinder, preventSave);
            this.viewerController.shares = [{
                id: 0,
                permission: new SharePermission("group", "jira-administrators-users", null)
            }];
            this.removeShare = this.sandbox.stub(this.viewerController, "remove");

            var getController = this.sandbox.stub(ShareFactory, "getController");
            getController.withArgs("editors").returns(this.editorController);
            getController.withArgs("viewers").returns(this.viewerController);
        },
        teardown: function teardown() {
            this.sandbox.restore();
        }
    });

    test("No warning is shown if there was no share type nor value changes", function () {
        this.editorController.defaultShareType = "group";
        this.editorController.selectedShareTypeChanged = false;

        this.editorController.saveCallback(this.mockEvent);
        sinon.assert.notCalled(this.preventDefault);
    });

    test("Dirty warning is shown if the selected share type has been changed", function () {
        this.editorController.defaultShareType = "user";
        this.editorController.selectedShareTypeChanged = true;
        this.editorController.shares = [];

        this.editorController.saveCallback(this.mockEvent);
        sinon.assert.calledOnce(this.preventDefault);
    });

    test("Dirty warning is shown if the share type hasn't been changed but the given value has", function () {
        this.editorController.defaultShareType = "group";
        this.editorController.selectedShareTypeChanged = false;
        this.editorController.shares = [];
        groupShare.dirty = true;

        this.editorController.saveCallback(this.mockEvent);
        sinon.assert.calledOnce(this.preventDefault);
    });

    test("No warning is shown if there are changes, but they have already been saved", function () {
        this.editorController.selectedShareTypeChanged = true;
        this.editorController.shares = [{
            id: 0,
            permission: new SharePermission("group", "jira-servicedesk-users", null)
        }];

        this.editorController.saveCallback(this.mockEvent);
        sinon.assert.notCalled(this.preventDefault);
    });

    test("Can't add edit share if view share already exists and user doesn't confirm", function () {
        var shareDisplay = {
            permission: new SharePermission("group", "jira-servicedesk-users", null)
        };
        this.editorController.shares = [{
            id: 0,
            permission: new SharePermission("group", "jira-servicedesk-users", null)
        }];
        notOk(this.viewerController.addShare(shareDisplay), "Can't add the duplicate share");
    });

    test("Can't add view share if edit share already exists", function () {
        var shareDisplay = {
            permission: new SharePermission("group", "jira-administrators-users", null)
        };
        notOk(this.editorController.addShare(shareDisplay), "Can't add the duplicate share");
    });

    test("Can add duplicate edit share if it is first deleted from view shares", function () {
        window.confirm.restore();
        var confirm = this.sandbox.stub(window, "confirm", function () {
            return true;
        });
        var shareDisplay = {
            permission: new SharePermission("group", "jira-administrators-users", null)
        };
        this.editorController.addShare(shareDisplay);
        sinon.assert.calledOnce(confirm);
        sinon.assert.calledOnce(this.removeShare);
        sinon.assert.calledOnce(this.addDisplay);
    });
});