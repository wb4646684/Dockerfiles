define('jira/customfields/customfieldsFilterProjectCollection', ['jira/backbone-1.3.3', 'wrm/context-path', 'jira/util/formatter'], function (Backbone, contextPath, formatter) {
    'use strict';

    return Backbone.Collection.extend({
        url: contextPath() + '/rest/api/2/project',
        id: 'projectIds',
        name: 'projects',
        parse: function parse() {
            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            var defaultAvatar = contextPath() + '/secure/projectavatar?size=xsmall';

            var result = data.map(function (project) {
                return {
                    id: project.id,
                    name: project.name + ' (' + project.key + ')',
                    description: project.name,
                    avatarUrl: project.avatarUrls && project.avatarUrls['16x16'] ? project.avatarUrls['16x16'] : defaultAvatar
                };
            });

            result.unshift({
                id: 'admin.issuefields.customfields.global.all.projects',
                name: formatter.I18n.getText('admin.issuefields.customfields.global.all.projects'),
                description: '',
                avatarUrl: defaultAvatar
            });

            return result;
        }
    });
});