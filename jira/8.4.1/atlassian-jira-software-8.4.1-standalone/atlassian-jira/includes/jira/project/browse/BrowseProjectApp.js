define('jira/project/browse/app', ['underscore', 'backbone', 'jira/marionette-4.1', 'jira/util/navigation', 'jira/project/browse/layout', 'jira/project/browse/projectcollection', 'jira/project/browse/filtermodel', 'jira/project/browse/categorycollection', 'jira/project/browse/projecttypecollection', 'jira/project/browse/router'], function (_, Backbone, Marionette, Navigation, Layout, ProjectCollection, FilterModel, CategoryCollection, ProjectTypeCollection, Router) {
    'use strict';

    return Marionette.Application.extend({
        initialize: function initialize(options) {
            this.categories = new CategoryCollection(options.categories);
            this.availableProjectTypes = new ProjectTypeCollection(options.availableProjectTypes);
            this.projects = new ProjectCollection(options.projects, {
                mode: 'client',
                state: {
                    pageSize: 25,
                    currentPage: 1
                },
                categories: this.categories,
                parse: true
            });

            this.categories.selectCategory(options.selectedCategory);

            if (options.availableProjectTypes) {
                //JC-430: If an invalid project is specified in the URL just go back to 'all'
                if (!this.availableProjectTypes.selectProjectType(options.selectedProjectType)) {
                    this.availableProjectTypes.selectProjectType("all");
                }
                this.filter = new FilterModel({
                    category: this.categories.getSelected().toJSON(),
                    projectType: this.availableProjectTypes.getSelected().toJSON()
                }, {
                    pageableCollection: this.projects
                });
            } else {
                this.filter = new FilterModel({
                    category: this.categories.getSelected().toJSON()
                }, {
                    pageableCollection: this.projects
                });
            }
        },
        onStart: function onStart() {
            this.layout = new Layout({
                el: this.getRegion().$el,
                categories: this.categories,
                availableProjectTypes: this.availableProjectTypes,
                projects: this.projects,
                filter: this.filter
            });

            new Router({
                // We pass reference to app to so that router doesn't need to have direct access to everything else
                application: this
            });

            if (!Backbone.History.started) {
                Backbone.history.start({
                    pushState: Navigation.pushStateSupported,
                    root: Navigation.getBackboneHistoryRoot()
                });
            }

            //rewrite old-style url to new style one:
            if (window.location.hash) {
                var categoryId = window.location.hash.substring(1);
                var category = this.categories.get(categoryId);
                if (category) {
                    this.layout.categoryChange(categoryId);
                }
            }
        }
    });
});