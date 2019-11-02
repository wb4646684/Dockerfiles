define('jira/project/browse/projects-empty-view', ['jira/marionette-4.1', 'jira/util/formatter'], function (Marionette, formatter) {
    'use strict';

    return Marionette.View.extend({
        tagName: 'tr',
        template: JIRA.Templates.Common.emptySearchTableRow,
        templateContext: function templateContext() {
            return {
                extraClasses: 'no-project-results',
                colspan: 6,
                name: formatter.I18n.getText('jira.auditing.category.projects')
            };
        }
    });
});