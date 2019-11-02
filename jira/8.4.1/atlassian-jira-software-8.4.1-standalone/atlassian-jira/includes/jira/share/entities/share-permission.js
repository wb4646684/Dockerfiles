define('jira/share/entities/share-permission', [], function () {
    'use strict';

    /**
     * Represents a share.
     *
     * @param type type of the share.
     * @param param1 the first parameter for the share configuration.
     * @param param2 the second parameter for the share configuration.
     */

    function SharePermission(type, param1, param2) {
        this.type = type;
        if (param1) {
            this.param1 = param1;
        }
        if (param2) {
            this.param2 = param2;
        }
    }

    /**
     * Compares two "SharePermission" objects to see if they are equal.
     *
     * @param otherPermission the permission to compare against this.
     */
    SharePermission.prototype.equals = function (otherPermission) {
        return this.type === otherPermission.type && this.param1 === otherPermission.param1 && this.param2 === otherPermission.param2;
    };

    return SharePermission;
});