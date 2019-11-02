define('jira/project/browse/projects-empty-view-with-action', ['jquery', 'jira/marionette-4.1', 'jira/analytics', 'jira/util/formatter', 'jira/util/data/meta', 'jira/project/project-type-keys'], function ($, Marionette, analytics, formatter, meta, ProjectTypeKeys) {
    "use strict";

    return Marionette.View.extend({
        template: JIRA.Templates.Project.Browse.emptyRowWithCallToAction,
        events: {
            "click .empty-state-add-project-button": "_handleAddProjectClicked"
        },
        templateContext: function templateContext() {
            var templateParams = {};
            var projectType = this.options.filters.get("projectType").key;
            if (projectType === ProjectTypeKeys.SOFTWARE) {
                templateParams = {
                    headerText: formatter.I18n.getText("browse.projects.software.projects.title"),
                    descriptionText: formatter.I18n.getText("browse.projects.software.projects.description"),
                    callToActionText: formatter.I18n.getText("browse.projects.create.new.project.link"),
                    projectType: projectType
                };
            } else if (projectType === ProjectTypeKeys.SERVICE_DESK) {
                templateParams = {
                    headerText: formatter.I18n.getText("browse.projects.servicedesk.projects.title"),
                    descriptionText: formatter.I18n.getText("browse.projects.servicedesk.projects.description"),
                    callToActionText: formatter.I18n.getText("browse.projects.create.new.project.link"),
                    projectType: projectType
                };
            } else if (projectType === ProjectTypeKeys.BUSINESS) {
                templateParams = {
                    imageClassName: "create-business-project-image",
                    headerText: formatter.I18n.getText("browse.projects.business.projects.not.created"),
                    descriptionText: formatter.I18n.getText("browse.projects.business.projects.description"),
                    callToActionText: formatter.I18n.getText("browse.projects.create.new.project.link"),
                    projectType: projectType
                };
            }

            templateParams.isAdmin = meta.get("is-admin");
            return templateParams;
        },
        onRender: function onRender() {
            this.unwrapTemplate();
        },
        _handleAddProjectClicked: function _handleAddProjectClicked(e) {
            analytics.send({
                name: "projects.browse.empty.state.add.projects.clicked",
                properties: {
                    projectTypeKey: $(e.target).data("project-type")
                }
            });
        }
    });
});