define('jira/share/i18n', ['jira/util/strings', 'exports'], function (strings, exports) {
    'use strict';

    /**
     * Return an I18N'zed message given the passed key.
     *
     * @param key the key of the I18N'zed message.
     */

    exports.getMessage = function (key) {
        if (this[key]) {
            return this[key];
        }
        return "unknown";
    };

    exports._formatMessage = function (message, escapeFunc, parameters) {
        var regex;
        var currentValue;

        for (var i = 0; i < parameters.length; i++) {
            currentValue = String(parameters[i]);
            if (escapeFunc) {
                currentValue = escapeFunc(currentValue);
            }
            regex = new RegExp("\\{" + i + "\\}", "g");
            while (message.search(regex) >= 0) {
                message = message.replace(regex, currentValue);
            }
        }
        return message;
    };
    /**
     * Substitute the passed parameters into the passed message. The params will be escaped. The parameters in the
     * passed message are represented as {0}, {1},....{n}.
     *
     * @param message the message to format.
     */
    exports.formatMessage = function (message) {
        var parameters = Array.prototype.slice.call(arguments, 1);
        return exports._formatMessage(message, strings.escapeHtml, parameters);
    };

    /**
     * Substitute the passed parameters into the passed message. These param are unescaped. The parameters in the
     * passed message are represented as {0}, {1},....{n}.
     *
     * @param message the message to format.
     */
    exports.formatMessageUnescaped = function (message) {
        var parameters = Array.prototype.slice.call(arguments, 1);
        return exports._formatMessage(message, null, parameters);
    };
});