define('jira/share/entities/share-type/any-share', ['jira/share/i18n'], function (i18n) {
    'use strict';

    /**
     * Object that represents the ANY synthetic ShareType.  This is not a real
     * share type in the sense that it can be "shared" as such.  but it useful for
     * searching where you want to indicate that ANY share type is returned
     * including private ones (eg stuff that is not shared)
     *
     */

    function AnyShare() {
        this.type = "any";
        this.singleton = true;
    }

    AnyShare.prototype = {
        getDisplayDescriptionFromUI: function getDisplayDescriptionFromUI() {
            return i18n.getMessage("share_any_description");
        }
    };

    return AnyShare;
});