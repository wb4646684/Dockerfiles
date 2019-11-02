define('jira/project/browse/archived-projects-empty-view', ['jira/marionette-4.1', 'jira/util/data/meta'], function (Marionette, meta) {
    "use strict";

    return Marionette.View.extend({
        template: JIRA.Templates.Project.Browse.archivedProjectsEmptyState,
        templateContext: function templateContext() {
            return { adminMode: meta.get('in-admin-mode') };
        },
        onRender: function onRender() {
            this.unwrapTemplate();
        }
    });
});