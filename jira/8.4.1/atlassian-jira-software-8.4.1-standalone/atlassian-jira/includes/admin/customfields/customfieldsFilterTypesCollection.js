define('jira/customfields/customfieldsFilterTypesCollection', ['jira/backbone-1.3.3', 'wrm/context-path'], function (Backbone, contextPath) {
    'use strict';

    return Backbone.Collection.extend({
        url: contextPath() + '/rest/globalconfig/1/customfieldtypes',
        id: 'types',
        name: 'types',
        parse: function parse(data) {
            var _data$types = data.types,
                types = _data$types === undefined ? [] : _data$types;

            return types.map(function (type) {
                return {
                    //CF types don't have an id and are unique by key
                    id: type.key,
                    name: type.name,
                    description: type.description
                };
            });
        }
    });
});