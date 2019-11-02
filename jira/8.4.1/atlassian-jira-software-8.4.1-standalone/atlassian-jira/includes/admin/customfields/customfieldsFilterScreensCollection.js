define('jira/customfields/customfieldsFilterScreensCollection', ['jira/backbone-1.3.3', 'wrm/context-path'], function (Backbone, contextPath) {
    'use strict';

    return Backbone.Collection.extend({
        url: contextPath() + '/rest/api/2/screens',
        id: 'screenIds',
        name: 'screens'
    });
});