define('jira/share/entities/share-type/group-share', ['jira/share/entities/display', 'jira/share/entities/share-permission', 'jira/share/i18n', 'jquery'], function (Display, SharePermission, i18n, jQuery) {
    'use strict';

    /**
     * Object that represents the "Group" ShareType.
     */

    function GroupShare(parentClass) {
        this.type = 'group';
        this.singleton = false;
        this.parentElement = document.querySelector('.' + parentClass);
        this.dirty = false;
    }

    GroupShare.prototype = {
        /**
         * Called after the DOM is ready to be used.
         */
        initialise: function initialise() {

            var that = this;

            this.groupSelect = this.getSubElement('group-share');
            if (this.groupSelect) {

                jQuery(this.groupSelect).change(function (e) {
                    that.groupChangeCallback(e);
                });
            }
        },

        inputChangesExist: function inputChangesExist() {
            return this.dirty;
        },

        /**
         * Return the Display that needs to be rendered when the user configures a new GROUP "ShareType" using
         * the GUI.
         */
        getDisplayFromUI: function getDisplayFromUI() {
            if (!this.groupSelect) {
                return;
            }

            var value = this.groupSelect.options[this.groupSelect.selectedIndex].value;
            var newPermission = new SharePermission(this.type, value, null);
            return new Display(this.getDisplayString(value), this.getDescriptionString(value, true), this.singleton, newPermission);
        },

        /**
         * Return a simple description that can be used as a title for a GROUP "ShareType".
         * This should be more descriptive that than the display but not too verbose
         */
        getDisplayDescriptionFromUI: function getDisplayDescriptionFromUI() {
            if (!this.groupSelect) {
                return '';
            }

            var group = this.groupSelect.options[this.groupSelect.selectedIndex].value;
            return this.getDescriptionString(group, false);
        },

        /**
         * Return the Display that that should be rendered for the passed permission.
         *
         * @param permission the permission to get the Display for.
         */
        getDisplayFromPermission: function getDisplayFromPermission(permission) {
            if (!permission || permission.type !== this.type || !permission.param1) {
                return null;
            }
            var newPermission = new SharePermission(this.type, permission.param1, permission.param2);
            return new Display(this.getDisplayString(newPermission.param1), this.getDescriptionString(permission.param1, true), this.singleton, newPermission);
        },

        /**
         * Return the HTML that should be used to render the a UI representation of a "GROUP" ShareType.
         *
         * @param group the group associated with this share.
         */
        getDisplayString: function getDisplayString(group) {
            var inner = i18n.getMessage('share_group_display');
            return i18n.formatMessage(inner, group);
        },

        /**
         * Return a description of a group permission from a passed in group.
         *
         * @param group         The group to describe.
         * @param unescaped     Whether or not params will be escaped when substituted.
         */
        getDescriptionString: function getDescriptionString(group, unescaped) {
            var inner = i18n.getMessage('share_group_description');
            if (unescaped) {
                return i18n.formatMessageUnescaped(inner, group);
            } else {
                return i18n.formatMessage(inner, group);
            }
        },

        updateSelectionFromPermission: function updateSelectionFromPermission(sharePermission) {
            if (!this.groupSelect) {
                return;
            }
            var groupName = sharePermission.param1;
            var options = this.groupSelect.options;
            for (var i = 0; i < options.length; i++) {
                if (options[i].value === groupName) {
                    options[i].selected = true;
                }
            }
        },

        /**
         * The onclick handler for the group selector
         */
        groupChangeCallback: function groupChangeCallback() {
            this.dirty = true;
        },

        getDisplayWarning: function getDisplayWarning() {
            return '';
        },

        /**
         * Return an element by class name inside the root container.
         *
         * @param className     The class name of searching element
         */
        getSubElement: function getSubElement(className) {
            return this.parentElement.querySelector('.' + className);
        }
    };

    return GroupShare;
});