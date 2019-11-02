define('jira/share/entities/share-type/user-share', ['jira/share/entities/display', 'jira/share/entities/share-permission', 'jira/share/i18n', 'jquery'], function (Display, SharePermission, i18n, jQuery) {
    'use strict';

    /**
     * Object that represents the "User" ShareType.
     */

    function UserShare(parentClass) {
        this.type = 'user';
        this.singleton = false;
        this.parentElement = document.querySelector('.' + parentClass);
        this.userKey = null;
        this.singleSelectController = null;
        this.dirty = false;
    }

    UserShare.prototype = {
        /**
         * Called after the DOM is ready to be used.
         */
        initialise: function initialise() {
            var that = this;

            this.userSelect = this.getSubElement('user-share-select');
            if (this.userSelect) {
                jQuery(this.userSelect).on('selected', function (event, selectedItem, singleSelectController) {
                    that.userKey = selectedItem.properties ? selectedItem.properties.userKey : selectedItem.value();
                    if (that.userSelect.selectedOptions) {
                        UserShare.lastOption = that.userSelect.selectedOptions[0];
                    }
                    that.dirty = true;
                    if (!that.singleSelectController) {
                        that.singleSelectController = singleSelectController;
                    }
                });
            }
        },
        /**
         * Return a simple description that can be used as a title for a User "ShareType".
         * This should be more descriptive that than the display but not too verbose
         */
        getDisplayDescriptionFromUI: function getDisplayDescriptionFromUI() {
            return '';
        },
        /**
         * Return the Display that needs to be rendered when the user configures a new User "ShareType" using
         * the GUI. Calls on the "Add" and "Save" buttons click.
         */
        getDisplayFromUI: function getDisplayFromUI(preventClear) {
            var result = null;
            if (this.singleSelectController && this.userKey) {
                if (!preventClear) {
                    this.singleSelectController.clear();
                }
                var newPermission = new SharePermission(this.type, this.userKey, null);
                result = new Display(this.getDisplayString(this.userKey), this.getDescriptionString(this.userKey, true), this.singleton, newPermission, this.userKey);
            }
            return result;
        },
        /**
         * Returns a boolean indicating whether the value has changed
         */
        inputChangesExist: function inputChangesExist() {
            return this.dirty;
        },
        /**
         * Return the HTML that should be used to render the a UI representation of a "User" ShareType.
         *
         * @param user the user associated with this share.
         */
        getDisplayString: function getDisplayString(user) {
            var inner = i18n.getMessage('share_user_display');
            return i18n.formatMessage(inner, user);
        },
        /**
         * Return a description of a user permission from a passed in user.
         *
         * @param user         The user to describe.
         * @param unescaped     Whether or not params will be escaped when substituted.
         */
        getDescriptionString: function getDescriptionString(user, unescaped) {
            var inner = i18n.getMessage('share_user_description');
            if (unescaped) {
                return i18n.formatMessageUnescaped(inner, user);
            } else {
                return i18n.formatMessage(inner, user);
            }
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
            var newPermission = new SharePermission(this.type, permission.param1, null);
            return new Display(this.getDisplayString(newPermission.param1), this.getDescriptionString(permission.param1, true), this.singleton, newPermission, newPermission.param1);
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
        },
        /**
         * After post-search reloading re-add selected user to input
         *
         * @param sharePermission selected user login returned from server
         */
        updateSelectionFromPermission: function updateSelectionFromPermission(sharePermission) {
            var selectedUser = UserShare.lastOption;
            if (selectedUser && sharePermission.param1 === selectedUser.value) {
                this.userSelect.append(selectedUser);
            }
        }
    };

    return UserShare;
});