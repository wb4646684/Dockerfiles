define('jira/share/entities/share-type/authenticated-user-share', ['jira/share/entities/display', 'jira/share/entities/share-permission', 'jira/share/i18n'], function (Display, SharePermission, i18n) {
    'use strict';

    /**
     * Object that represents the AUTHENTICATED ShareType.
     */

    function AuthenticatedUserShare() {
        this.type = "loggedin";
        this.singleton = true;
    }

    AuthenticatedUserShare.prototype = {
        /**
         * Return the Display that needs to be rendered when the user configures a new GLOBAL "ShareType" using
         * the GUI.
         */
        getDisplayFromUI: function getDisplayFromUI() {
            var newPermission = new SharePermission(this.type, null, null);
            var inner = i18n.getMessage("share_authenticated_display");
            return new Display(inner, this.getDisplayDescriptionFromUI(), this.singleton, newPermission);
        },

        inputChangesExist: function inputChangesExist() {
            return false;
        },

        /**
         * Reurn a simple description that can be used as a title for a AUTHENTICATED "ShareType".
         * This should be more descriptive that than the display but not too verbose
         */
        getDisplayDescriptionFromUI: function getDisplayDescriptionFromUI() {
            return i18n.getMessage("share_authenticated_description");
        },

        /**
         * Return the Display that that should be rendered for the passed permission.
         *
         * @param permission the permission to get the Display for.
         */
        getDisplayFromPermission: function getDisplayFromPermission(permission) {
            if (!permission || permission.type != this.type) {
                return null;
            }

            var newPermission = new SharePermission(this.type, null, null);
            var inner = i18n.getMessage("share_authenticated_display");
            return new Display(inner, this.getDisplayDescriptionFromUI(), this.singleton, newPermission);
        },
        getDisplayWarning: function getDisplayWarning() {
            return "";
        }
    };

    return AuthenticatedUserShare;
});