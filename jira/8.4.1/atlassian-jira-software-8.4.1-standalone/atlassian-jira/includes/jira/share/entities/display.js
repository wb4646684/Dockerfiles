define('jira/share/entities/display', ['wrm/context-path', 'jira/share/i18n', 'jquery'], function (wrmContextPath, i18n, jQuery) {
    'use strict';

    /**
     * Object that contains the state of a share that needs to be rendered.
     *
     * @param display the HTML code that should render the component.
     * @param singleton is the share a singleton or not.
     * @param permission the underlying permission associated with the share.
     */

    function Display(display, description, singleton, permission, key) {
        this.display = display;
        this.singleton = singleton;
        this.permission = permission;
        this.description = description;
        this.key = key;
    }

    Display.prototype = {
        updateDisplayName: function updateDisplayName() {
            if (!this.key) {
                return;
            }
            var that = this;
            jQuery.ajax({
                url: wrmContextPath() + "/rest/api/2/user?key=" + this.key,
                success: function success(data) {
                    that.swapNames(that.dataSpanId, data.displayName);
                }
            });
        },
        swapNames: function swapNames(dataSpanId, displayName) {
            if (!dataSpanId || !displayName) {
                return;
            }
            var dataSpan = document.getElementById(dataSpanId);
            if (dataSpan) {
                dataSpan.innerHTML = this.getMessage(displayName);
            }
        },
        getMessage: function getMessage(name) {
            var inner = i18n.getMessage('share_user_display');
            var message = i18n.formatMessage(inner, name);
            return message;
        }
    };

    return Display;
});