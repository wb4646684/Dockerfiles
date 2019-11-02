define('jira/project/browse/projectcollectionview', ['jquery', 'jira/backbone.radio-2.0', 'jira/marionette-4.1', 'jira/util/formatter', 'jira/util/users/logged-in-user', 'jira/util/data/meta', 'jira/project/browse/projectview', 'jira/project/project-type-keys', 'jira/project/browse/projects-empty-view', 'jira/project/browse/projects-empty-view-with-action', 'jira/project/browse/archived-projects-empty-view'], function ($, BackboneRadio, Marionette, formatter, loggedInUser, meta, ProjectView, ProjectTypeKeys, EmptyView, EmptyViewWithAction, ArchivedEmptyView) {
    "use strict";

    return Marionette.CollectionView.extend({
        template: JIRA.Templates.Project.Browse.projects,
        templateContext: function templateContext() {
            return {
                // dude is an admin
                isAdmin: loggedInUser.isSysadmin() || loggedInUser.isAdmin(),
                // we are in administration, not global browse projects
                isAdminMode: meta.get('in-admin-mode')
            };
        },

        events: {
            'click th.sortable': function clickThSortable(event) {
                this._sort($(event.currentTarget).data('sort-key'));
            }
        },
        childView: ProjectView,
        childViewContainer: 'tbody',
        childViewEvents: {
            'project-view.click-project-name': function projectViewClickProjectName(childView) {
                var project = childView.model;
                var position = this.collection.indexOf(project);
                this.trigger('project-view.click-project-name', project, position);
                this.analyticsChannel.trigger('browse-projects.project-view.click-project-name', project, position);
            },
            'project-view.click-lead-user': function projectViewClickLeadUser(childView) {
                var project = childView.model;
                var position = this.collection.indexOf(project);
                this.trigger('project-view.click-lead-user', project, position);
                this.analyticsChannel.trigger('browse-projects.project-view.click-lead-user', project, position);
            },
            'project-view.click-category': function projectViewClickCategory(childView) {
                var project = childView.model;
                var position = this.collection.indexOf(project);
                this.triggerMethod('project-view.click-category', project, position);
                this.analyticsChannel.trigger('browse-projects.project-view.click-category', project, position);
            },
            'project-view.click-url': function projectViewClickUrl(childView) {
                var project = childView.model;
                var position = this.collection.indexOf(project);
                this.trigger('project-view.click-url', project, position);
                this.analyticsChannel.trigger('browse-projects.project-view.click-url', project, position);
            }
        },
        emptyViewOptions: function emptyViewOptions() {
            return {
                filters: this.model,
                hasArchivedProjects: this.hasArchivedProjects()
            };
        },
        emptyView: function emptyView() {
            if (!this.hasArchivedProjects() && this.model.get('category').id === 'archived') {
                return ArchivedEmptyView;
            }
            if (this.shouldUseCallToActionTemplate()) {
                return EmptyViewWithAction;
            } else {
                return EmptyView;
            }
        },
        initialize: function initialize() {
            this.analyticsChannel = BackboneRadio.channel('browse-projects-analytics');
        },

        onRender: function onRender() {
            this.unwrapTemplate();
        },
        _sort: function _sort(sortColumn) {
            if (this.model.get('sortOrder') === 'ascending' && this.model.get('sortColumn') === sortColumn) {
                this.model.set('sortOrder', 'descending');
            } else {
                this.model.set('sortOrder', 'ascending');
                this.model.set('sortColumn', sortColumn);
            }
            this.collection.updateSorting(sortColumn, this.model.get('sortOrder'));
            this.trigger('sorted', sortColumn, this.model.get('sortOrder'));
            this.render();
        },
        hasArchivedProjects: function hasArchivedProjects() {
            return !!this.model.filterByCategory("archived", this.collection.originalCollection).length;
        },
        shouldUseCallToActionTemplate: function shouldUseCallToActionTemplate() {
            var validProjectTypes = [ProjectTypeKeys.SOFTWARE, ProjectTypeKeys.SERVICE_DESK, ProjectTypeKeys.BUSINESS];
            return this.model.get("projectType") && this.model.get("category").id === "all" && this.model.get("contains") === "" && validProjectTypes.indexOf(this.model.get("projectType").key) !== -1;
        }
    });
});