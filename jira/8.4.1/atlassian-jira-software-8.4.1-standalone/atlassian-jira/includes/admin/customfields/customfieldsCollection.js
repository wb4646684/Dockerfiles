/**
 * A pageableCollection for fetching paginated customfields
 */
define('jira/customfields/customfieldsCollection', ['jira/backbone/backbone-paginator', 'wrm/context-path'], function (PageableCollection, contextPath) {
    'use strict';

    return PageableCollection.extend({
        url: contextPath() + '/rest/api/2/customFields',
        state: {
            pageSize: 25
        },
        queryParams: {
            currentPage: "startAt",
            pageSize: "maxResults",
            search: function search() {
                return this.searchTerm;
            },
            projectIds: function projectIds() {
                return this.getFilterValues('projectIds');
            },
            types: function types() {
                return this.getFilterValues('types');
            },
            screenIds: function screenIds() {
                return this.getFilterValues('screenIds');
            }
        },
        filters: {
            projectIds: [],
            types: [],
            screenIds: []
        },
        parseState: function parseState(resp) {
            return { totalRecords: resp.total };
        },
        parseRecords: function parseRecords(resp) {
            return resp.values;
        },

        getFilterValues: function getFilterValues(name) {
            return Array.isArray(this.filters[name]) && this.filters[name].length ? this.filters[name] : undefined;
        }
    });
});