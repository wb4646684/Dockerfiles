define('jira/project/browse/projectcollection', ['underscore', 'jira/backbone/backbone-paginator', 'jira/project/browse/projectmodel'], function (_, PageableCollection, ProjectModel) {
    'use strict';

    return PageableCollection.extend({
        model: ProjectModel,
        initialize: function initialize(items, options) {
            this.originalCollection = items;
            this.categories = options.categories;
        },
        /**
         * Returns an appropriate comparator depending on a type of values in the column,
         * this avoids repeatedly checking type of value in each iteration for better performance
         * @param column - the name of the column
         * @returns {*} - the comparator
         */
        getSortValueCallback: function getSortValueCallback(column) {

            if (column === 'issueCount') {
                return function (model) {
                    return model.get(column) ? parseInt(model.get(column).replace(',', ''), 10) : null;
                };
            }

            if (_.isString(this.models[0].attributes[column])) {
                return function (model) {
                    return model.get(column) ? model.get(column).toLowerCase() : null;
                };
            } else {
                return function (model) {
                    return model.get(column);
                };
            }
        },
        updateSorting: function updateSorting(sortColumn, sortOrder) {
            this.setSorting(sortColumn, sortOrder === 'ascending' ? -1 : 1, {
                sortValue: this.getSortValueCallback(sortColumn)
            });

            this.fullCollection.sort();
        }
    });
});