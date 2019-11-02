define('jira/share/share-factory', ['jira/share/controllers/edit-shares-controller', 'jira/share/controllers/select-single-share-type-controller', 'jira/share/entities/share-type/authenticated-user-share', 'jira/share/entities/share-type/project-share', 'jira/share/entities/share-type/global-share', 'jira/share/entities/share-type/group-share', 'jira/share/entities/share-type/any-share', 'jira/share/entities/share-type/user-share', 'jira/share/i18n', 'jquery', "jira/featureflags/feature-manager"], function (EditSharesController, SelectSingleShareTypeController, AuthenticatedUserShare, ProjectShare, GlobalShare, GroupShare, AnyShare, UserShare, i18n, jQuery, FeatureManager) {
    'use strict';

    function ShareFactory() {
        this.registeredControllers = new Map();
        this.saveStopped = false;
    }

    ShareFactory.prototype = {
        /**
         * Called when the page loads to initialise state and register to edit "ShareTypes".
         */
        registerEditShareTypes: function registerEditShareTypes(mode) {
            var duplicateFinder = this.findDuplicatesInOtherModes.bind(this);
            var preventSaveHandler = this.preventSaveHandler.bind(this);
            var editController = new EditSharesController(mode, duplicateFinder, preventSaveHandler);
            editController.registerShareType(new GlobalShare());
            editController.registerShareType(new AuthenticatedUserShare());
            editController.registerShareType(new GroupShare(mode));
            editController.registerShareType(new ProjectShare(mode));
            editController.registerShareType(new UserShare(mode));

            this.registeredControllers.set(mode, editController);
            jQuery(document).ready(function () {
                editController.initialise();
            });
        },


        /**
         * Called when the page loads to initialise state and register to select "ShareTypes".
         */
        registerSelectShareTypes: function registerSelectShareTypes(parentClass) {
            var selectController = new SelectSingleShareTypeController();
            selectController.registerShareType(new AnyShare());
            selectController.registerShareType(new GroupShare(parentClass));
            selectController.registerShareType(new ProjectShare(parentClass));
            if (FeatureManager.isFeatureEnabled("com.atlassian.jira.sharedEntityEditRights")) {
                selectController.registerShareType(new UserShare(parentClass));
            }
            jQuery(document).ready(function () {
                selectController.initialise();
            });
        },
        findDuplicatesInOtherModes: function findDuplicatesInOtherModes(share, mode) {
            var otherMode = mode === 'editors' ? 'viewers' : 'editors';
            var otherController = this.getController(otherMode);
            if (!otherController) {
                return false;
            }
            var shareId = otherController.findShareIndex(share);
            if (shareId !== -1) {
                return this.preventAddingDuplicate(shareId, mode);
            }
            return false;
        },


        /**
         * Remembers and informs whether the save was already stopped by previous mode
         * @param msg
         */
        preventSaveHandler: function preventSaveHandler(msg) {
            var previousSaveStopped = this.saveStopped;
            this.saveStopped = msg;
            return previousSaveStopped;
        },
        preventAddingDuplicate: function preventAddingDuplicate(share, mode) {
            if (mode === 'editors') {
                if (confirm(i18n.getMessage('common.sharing.duplicate.viewers.warning'))) {
                    this.getController('viewers').remove(share);
                    return false;
                }
                return true;
            } else {
                this.getController('editors').animateShare(share);
                return true;
            }
        },
        getController: function getController(mode) {
            return this.registeredControllers.get(mode);
        }
    };

    return new ShareFactory();
});

// INC-71 - Polyfilling globals back :(
AJS.namespace('JIRA.Share.i18n', null, require('jira/share/i18n'));
AJS.namespace('JIRA.Share.toggleElements', null, require('jira/share/util').toggleElements);
AJS.namespace('JIRA.Share.SharePermission', null, require('jira/share/entities/share-permission'));
AJS.namespace('JIRA.Share.Display', null, require('jira/share/entities/display'));
AJS.namespace('JIRA.Share.AnyShare', null, require('jira/share/entities/share-type/any-share'));
AJS.namespace('JIRA.Share.GroupShare', null, require('jira/share/entities/share-type/group-share'));
AJS.namespace('JIRA.Share.GlobalShare', null, require('jira/share/entities/share-type/global-share'));
AJS.namespace('JIRA.Share.ProjectShare', null, require('jira/share/entities/share-type/project-share'));
AJS.namespace('JIRA.Share.AuthenticatedUserShare', null, require('jira/share/entities/share-type/authenticated-user-share'));
AJS.namespace('JIRA.Share.SelectSingleShareTypeController', null, require('jira/share/controllers/select-single-share-type-controller'));
AJS.namespace('JIRA.Share.EditSharesController', null, require('jira/share/controllers/edit-shares-controller'));
AJS.namespace('JIRA.Share.registerEditShareTypes', null, require('jira/share/share-factory').registerEditShareTypes);
AJS.namespace('JIRA.Share.registerSelectShareTypes', null, require('jira/share/share-factory').registerSelectShareTypes);
/** @deprecated */
AJS.namespace("atlassian.jira.share", window, window.JIRA.Share);