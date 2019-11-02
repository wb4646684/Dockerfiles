/**
 * This view renders the view custom field page
 * It initializes the pagable collection for custom fields, fetches the data from server and renders the (filters, table view and pagination) or empty message
 * depending on the number of custom fields
 */
define('jira/customfields/customfieldsView', ['jquery', 'jira/marionette-4.1', 'jira/message', 'jira/dialog/error-dialog', 'jira/customfields/customfieldsCollection', 'jira/customfields/customfieldCollectionView', 'jira/customfields/customfieldsPaginationView', 'jira/customfields/customfieldsFilterView'], function ($, Marionette, Messages, ErrorDialog, Customfields, CustomfieldsCollectionView, PaginationView, FilterView) {
    'use strict';

    return Marionette.View.extend({
        template: JIRA.Templates.Admin.Customfields.customfieldsPageContent,
        /*
         * When there are no custom fields on the instance we display an empty view here instead of inside the collection view,
         * Because there is no need to render the views outside the collction view such as filters, pagination etc
         * */
        getTemplate: function getTemplate() {
            if (!this.collection.length) {
                return JIRA.Templates.Admin.Customfields.customfieldsEmptyPageContent;
            }
            return this.template;
        },

        ui: {
            table: '#custom-fields-table',
            filters: '#custom-fields-filter',
            pagination: '#pagination-container'
        },
        regions: {
            customfields: {
                el: '@ui.table',
                replaceElement: true
            },
            filters: {
                el: '@ui.filters'
            },
            pagination: '@ui.pagination'
        },
        childViewEvents: {
            'navigate:start': 'displayLoadingIndicator',
            'navigate:end': 'hideLoadingIndicator',
            'navigate:error': 'handleErrorResponse',
            'search:start': 'displayLoadingIndicator',
            'search:end': 'hideLoadingIndicator'
        },
        initialize: function initialize() {
            this.collection = new Customfields();
            this.fetchData().done(this.render.bind(this)).fail(this.handleErrorResponse.bind(this));
        },

        onRender: function onRender() {
            if (!this.collection.length) {
                // we rendered empty view
                return;
            }
            this.showChildView('customfields', new CustomfieldsCollectionView({
                collection: this.collection
            }));

            this.showChildView('filters', new FilterView({
                collection: this.collection
            }));

            this.showChildView('pagination', new PaginationView({
                collection: this.collection
            }));
            this.initTooltips();
        },
        fetchData: function fetchData() {
            this.displayLoadingIndicator();
            return this.collection.getFirstPage().done(this.hideLoadingIndicator.bind(this));
        },
        displayLoadingIndicator: function displayLoadingIndicator() {
            this.$el.addClass('active').spin('large');
        },
        hideLoadingIndicator: function hideLoadingIndicator() {
            this.$el.removeClass('active').spinStop();
            this.initTooltips();
        },
        initTooltips: function initTooltips() {
            this.$('tr td:first-child strong').tipsy();
            this.$('tr td:first-child div.description').tipsy({ html: true });
        },

        handleErrorResponse: function handleErrorResponse(errorObj) {
            var status = errorObj.status,
                responseText = errorObj.responseText;

            var messages = this._parseResponse(responseText);

            var message = JIRA.Templates.Admin.Customfields.applicationAccessError({
                messages: messages,
                status: status
            });

            switch (status) {
                case 401:
                case 403:
                    var heading = JIRA.Templates.Admin.Customfields.applicationAccessErrorHeading({
                        status: status
                    });
                    this._showErrorDialogue(message, heading);
                    break;
                default:
                    this._showErrorMessage(message);
                    break;
            }
        },

        _parseResponse: function _parseResponse(responseText) {
            try {
                var errors = JSON.parse(responseText);
                var errorMessages = errors.errorMessages,
                    message = errors.message;


                if (errorMessages) {
                    return errorMessages;
                } else if (message) {
                    return [message];
                }
            } catch (e) {
                return null;
            }
        },

        _showErrorMessage: function _showErrorMessage(html) {
            Messages.showErrorMsg(html, {
                closeable: true
            });
        },

        _showErrorDialogue: function _showErrorDialogue(message, heading) {
            return new ErrorDialog({
                heading: heading,
                message: message,
                mode: "warning"
            }).show();
        }
    });
});