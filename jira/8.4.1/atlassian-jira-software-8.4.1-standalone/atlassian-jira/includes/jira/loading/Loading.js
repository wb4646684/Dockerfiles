/**
 * Functions for managing a full-page modal loading indicator
 *
 * @module jira/loading/loading
 */
define('jira/loading/loading', ['jquery'], function ($) {
    'use strict';

    var _isVisible = false;
    var _spinnerElement = $('<div class="jira-spinner-container"><aui-spinner size="medium" class="jira-page-loading-indicator"></aui-spinner></div>');

    function show() {
        if (_isVisible) {
            return;
        }

        $('body').append(_spinnerElement);
        _isVisible = true;
    }

    function hide() {
        if (!_isVisible) {
            return;
        }

        _spinnerElement.remove();
        _isVisible = false;
    }

    return (/** @alias module:jira/loading/loading */{
            /**
             * Show the loading indicator
             */
            showLoadingIndicator: show,

            /**
             * Hide the loading indicator, if it's currently visible.
             */
            hideLoadingIndicator: hide,

            /**
             * Returns whether the progress indicator is currently visible.
             *
             * @returns {boolean}
             */
            isVisible: function isVisible() {
                return _isVisible;
            }
        }
    );
});
AJS.namespace('JIRA.Loading', null, require('jira/loading/loading'));