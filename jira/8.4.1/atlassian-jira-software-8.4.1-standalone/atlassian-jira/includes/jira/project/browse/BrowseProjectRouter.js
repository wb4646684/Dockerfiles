define('jira/project/browse/router', ['underscore', 'backbone', 'jira/util/navigation'], function (_, Backbone, Navigation) {
    'use strict';

    return Backbone.Router.extend({
        initialize: function initialize(options) {
            this.route(/(.*)/, 'every', this.handleRouteChange);

            this.application = options.application;

            this.listenTo(this.application.layout.paginationView, 'navigate', function (pageNumber) {
                var params = _.extend(this.application.filter.getQueryParams(false), {
                    'page': pageNumber
                });
                Navigation.navigate(params);
            });

            this.listenTo(this.application.layout.projectCollectionView, 'sorted', function (sortColumn, sortOrder) {
                var params = _.extend(this.application.filter.getQueryParams(false), {
                    'sortColumn': sortColumn,
                    'sortOrder': sortOrder
                });
                Navigation.navigate(params);
            });

            this.application.filter.on('filter', function (params) {
                Navigation.navigate(params);
            });
        },
        handleRouteChange: function handleRouteChange() {
            var page = +Navigation.getParam('page', true) || 1;
            var contains = Navigation.getParam('contains', true) || '';
            var categoryId = Navigation.getParam('selectedCategory') || '';
            var sortColumn = Navigation.getParam('sortColumn') || '';
            var sortOrder = Navigation.getParam('sortOrder') || '';
            var projectTypeId = Navigation.getParam('selectedProjectType') || '';
            var category = this.application.categories.selectCategory(categoryId);
            var projectType = this.application.availableProjectTypes.selectProjectType(projectTypeId);

            if (contains) {
                this.application.filter.set('contains', contains, { silent: true });
            }
            if (category !== false) {
                this.application.filter.set('category', category.toJSON(), { silent: true });
            }
            if (projectType !== false) {
                this.application.filter.set('projectType', projectType.toJSON(), { silent: true });
            }
            if (sortColumn) {
                this.application.filter.set('sortColumn', sortColumn, { silent: true });
            }
            if (sortOrder) {
                this.application.filter.set('sortOrder', sortOrder, { silent: true });
            }

            if (sortOrder && sortColumn) {
                this.application.projects.updateSorting(sortColumn, sortOrder);
            }

            this.application.filter.filterCollection();
            if (page && page !== this.application.projects.state.currentPage) {
                this.application.projects.getPage(page);
            }
            this.application.layout.render();
        }
    });
});