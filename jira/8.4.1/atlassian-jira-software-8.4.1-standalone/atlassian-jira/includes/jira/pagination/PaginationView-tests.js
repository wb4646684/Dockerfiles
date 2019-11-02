AJS.test.require("jira.webresources:pagination-view", function () {
    'use strict';

    require(['jira/pagination/paginationview', 'jquery'], function (PaginationView, $) {
        module("PaginationView", {
            setup: function setup() {
                var $markup = $('<ol class="aui-nav aui-nav-pagination">' + '    <li class="aui-nav-previous"><a href="" data-page="1">Prev</a></li>' + '</ol>');
                this.view = new PaginationView({
                    el: $markup,
                    collection: {
                        getPage: sinon.stub(),
                        on: sinon.stub(),
                        off: sinon.stub(),
                        mode: 'client',
                        state: {
                            firstPage: 1,
                            lastPage: 20,
                            currentPage: 1
                        },
                        Events: []
                    },
                    model: {
                        getQueryParams: sinon.stub().returns(""),
                        on: sinon.stub(),
                        off: sinon.stub()
                    }
                });
                this.view.bindUIElements();
            }
        });

        test('Should change page and trigger navigate event on page click in client mode.', function () {
            var pageChangeHandler = sinon.spy();
            this.view.on('navigate', pageChangeHandler);
            $(this.view.ui.page[0]).click();

            sinon.assert.calledOnce(pageChangeHandler);
            sinon.assert.calledWith(pageChangeHandler, 1);
            sinon.assert.calledWith(this.view.collection.getPage, 1);
        });

        test('Should change page and trigger navigation events on page click in server mode.', function () {
            var pageChangeHandler = sinon.spy();
            var startHandler = sinon.spy();
            var endHandler = sinon.spy();
            this.view.collection.mode = 'server';
            this.view.collection.getPage.returns(new $.Deferred().resolve());
            this.view.on('navigate', pageChangeHandler);
            this.view.on('navigate:start', startHandler);
            this.view.on('navigate:end', endHandler);
            $(this.view.ui.page[0]).click();

            sinon.assert.calledOnce(pageChangeHandler);
            sinon.assert.calledWith(pageChangeHandler, 1);
            sinon.assert.calledOnce(startHandler);
            sinon.assert.calledOnce(endHandler);
            sinon.assert.calledWith(this.view.collection.getPage, 1);
        });

        test('Should not change page and trigger navigation error event on page click in server mode failure.', function () {
            var pageChangeHandler = sinon.spy();
            var startHandler = sinon.spy();
            var errorHandler = sinon.spy();
            var endHandler = sinon.spy();
            this.view.collection.mode = 'server';
            this.view.collection.getPage.returns(new $.Deferred().reject());
            this.view.on('navigate', pageChangeHandler);
            this.view.on('navigate:start', startHandler);
            this.view.on('navigate:error', errorHandler);
            this.view.on('navigate:end', endHandler);
            $(this.view.ui.page[0]).click();

            sinon.assert.notCalled(pageChangeHandler);
            sinon.assert.calledOnce(startHandler);
            sinon.assert.calledOnce(errorHandler);
            sinon.assert.calledOnce(endHandler);
            sinon.assert.calledWith(this.view.collection.getPage, 1);
        });

        test('First page should be calculated correctly', function () {
            this.view.collection.state.currentPage = 1;
            var result = this.view.templateContext();
            equal(result.firstPage, 1);

            this.view.collection.state.currentPage = 6;
            result = this.view.templateContext();
            equal(result.firstPage, 1);

            this.view.collection.state.currentPage = 7;
            result = this.view.templateContext();
            equal(result.firstPage, 2);

            this.view.collection.state.currentPage = 10;
            result = this.view.templateContext();
            equal(result.firstPage, 5);
        });

        test('Last page should be calculated correctly', function () {
            this.view.collection.state.currentPage = 20;
            var result = this.view.templateContext();
            equal(result.lastPage, 20);

            this.view.collection.state.currentPage = 15;
            result = this.view.templateContext();
            equal(result.lastPage, 20);

            this.view.collection.state.currentPage = 14;
            result = this.view.templateContext();
            equal(result.lastPage, 19);

            this.view.collection.state.currentPage = 10;
            result = this.view.templateContext();
            equal(result.lastPage, 15);
        });
    });
});