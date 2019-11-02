/**
 * This is a Marionette component that renders pagination controls based on the state of a backbone.paginator 2.x collection
 * that is passed to it as "collection".
 * Currently it handles "client" and "server" modes ("infinite" mode could be added in future if needed)
 * This component communicates with outside world using following events:
 * 'navigate' (pageNumber): triggered when a navigation occurs. Receives page number as the argument
 * 'navigate:start': triggered when  server side navigation is initiated. Useful for displaying a loading indicator
 * 'navigate:error' (error): triggered when  server side navigation fails. Receives error object as argument
 * 'navigate:end': triggered when  server side navigation completes regardless of success or failure.
 */
define('jira/pagination/paginationview', ['jquery', 'underscore', 'jira/marionette-3.1'], function ($, _, Marionette) {
    'use strict';

    return Marionette.View.extend({
        template: JIRA.Templates.Common.pagination,
        ui: {
            page: 'li a',
            previous: 'li.aui-nav-previous a',
            next: 'li.aui-nav-next a'
        },
        events: {
            'click @ui.page': 'clickPage',
            'click @ui.previous': 'clickPrevious',
            'click @ui.next': 'clickNext'
        },
        collectionEvents: {
            reset: 'render',
            sync: 'render'
        },
        onRender: function onRender() {
            this.unwrapTemplate();
        },
        templateContext: function templateContext() {
            var data = _.extend({}, this.collection.state);
            data.firstPage = Math.max(data.currentPage - 5, data.firstPage);
            data.totalPages = data.lastPage;
            data.lastPage = Math.min(data.currentPage + 5, data.lastPage);
            return data;
        },
        clickPage: function clickPage(e) {
            var _this = this;

            e.preventDefault();
            var pageNumber = +$(e.target).attr('data-page');
            if (pageNumber) {
                // response = (XMLHttpRequest | PageableCollection) depending on mode
                var response = this.collection.getPage(pageNumber);
                if (this.collection.mode === 'client') {
                    this.triggerMethod('navigate', pageNumber);
                } else if (this.collection.mode === 'server') {
                    this.triggerMethod('navigate:start');
                    response.done(function () {
                        return _this.triggerMethod('navigate', pageNumber);
                    }).fail(function (error) {
                        return _this.triggerMethod('navigate:error', error);
                    }).always(function () {
                        return _this.triggerMethod('navigate:end');
                    });
                }
            }
        },
        clickPrevious: function clickPrevious() {
            this.triggerMethod('navigate-previous');
        },
        clickNext: function clickNext() {
            this.triggerMethod('navigate-next');
        }
    });
});