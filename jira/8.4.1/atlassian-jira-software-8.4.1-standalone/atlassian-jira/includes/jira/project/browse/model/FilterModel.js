define('jira/project/browse/filtermodel', ['jquery', 'jira/backbone-1.3.3', 'jira/backbone.radio-2.0', 'wrm/context-path', 'jira/util/navigation'], function ($, Backbone, BackboneRadio, wrmContextPath, Navigation) {
    'use strict';

    var contextPath = wrmContextPath();

    return Backbone.Model.extend({
        defaults: {
            contains: '',
            sortOrder: 'ascending',
            sortColumn: 'name'
        },
        initialize: function initialize(attributes, options) {
            this.pageableCollection = options.pageableCollection;
            this.analyticsChannel = BackboneRadio.channel('browse-projects-analytics');

            this.on('change:category change:contains change:projectType', this.filterCollection);
            this.on('change:category change:contains change:projectType', this.triggerFilterEvent);
        },
        changeCategory: function categoryChange(category) {
            if (category) {
                $.ajax({
                    url: contextPath + "/rest/api/1.0/browse-project/category/active",
                    data: JSON.stringify({
                        current: category.get("id")
                    }),
                    dataType: "json",
                    contentType: "application/json",
                    type: "POST"
                });
                this.set('category', category.toJSON());
            }
        },
        changeProjectType: function changeProjectType(projectType) {
            if (projectType) {
                $.ajax({
                    url: contextPath + "/rest/api/1.0/browse-project/project-type/active",
                    data: projectType.get("id"),
                    dataType: "json",
                    contentType: "application/json",
                    type: "POST"
                });
                this.set('projectType', projectType.toJSON());
            }
        },
        filterCollection: function filterCollection() {
            var filtered = this.pageableCollection.originalCollection;
            var categoryFilter = this.get('category') ? this.get('category').id : '';
            // "id" of projectType is a string value such as "business" or software.
            var projectTypeFilter = this.get('projectType') ? this.get('projectType').key : null;
            var textFilter = (this.get('contains') || '').toLowerCase();

            filtered = this.filterByProjectType(projectTypeFilter, filtered);
            filtered = this.filterByCategory(categoryFilter, filtered);
            filtered = this.filterByText(textFilter, filtered);

            this.pageableCollection.fullCollection.reset(filtered);
            this.pageableCollection.getPage(1);
        },
        filterByProjectType: function filterByProjectType(projectType, projectCollection) {
            // intentional non strict equality to handle null and undefined
            if (projectType == null || projectType === 'all') {
                return projectCollection;
            }
            return projectCollection.filter(function (project) {
                return project.projectTypeKey === projectType || projectType === '' && project.projectTypeKey === null; //we use empty string from the URL to represent a null project type.
            });
        },
        filterByCategory: function filterByCategory(category, projectCollecton) {
            // if no category is specified return all non archived projects
            if (!category) {
                return projectCollecton.filter(function (project) {
                    return !project.archived;
                });
            }
            // special case handled here so that we can eliminate all archived projects from further filtering
            if (category === 'archived') {
                return projectCollecton.filter(function (project) {
                    return project.archived;
                });
            }
            // for all categories other than "archived", we filter out archived projects
            projectCollecton = projectCollecton.filter(function (project) {
                return !project.archived;
            });

            return projectCollecton.filter(function (project) {
                switch (category) {
                    case 'all':
                        {
                            return true;
                        }
                    case 'none':
                        {
                            return !project.projectCategoryId;
                        }
                    case 'recent':
                        {
                            return project.recent;
                        }
                    default:
                        {
                            // a custom category
                            // category can be a string like "all", or a number, hence the forced string conversion
                            return project.projectCategoryId && project.projectCategoryId.toString() === category.toString();
                        }
                }
            });
        },
        filterByText: function filterByText(textFilter, projectCollection) {
            if (!textFilter) {
                return projectCollection;
            }
            return projectCollection.filter(function (project) {
                return project.name && project.name.toLowerCase().indexOf(textFilter) > -1 || project.key && project.key.toLowerCase().indexOf(textFilter) > -1 || project.lead && project.lead.toLowerCase().indexOf(textFilter) > -1;
            });
        },

        triggerFilterEvent: function triggerFilterEvent() {
            this.trigger('filter', this.getQueryParams(false));
            var numberOfProjects = this.pageableCollection && this.pageableCollection.originalCollection && this.pageableCollection.originalCollection.length;
            this.analyticsChannel.trigger('browse-projects.projects-render', numberOfProjects);
        },
        getQueryParams: function getQueryParams(urlFormat) {
            urlFormat = typeof urlFormat === 'undefined' ? true : urlFormat;

            var params = {
                selectedCategory: this.get('category') ? this.get('category').id : '',
                selectedProjectType: this.get('projectType') ? this.get('projectType').key : '',
                contains: this.get('contains') || false,
                sortColumn: this.get('sortColumn') || '',
                sortOrder: this.get('sortOrder') || ''
            };

            if (params.selectedCategory === "archived") {
                params.s = "view_archived_projects";
            } else if (params.selectedCategory === "all") {
                params.s = "view_projects";
            }

            return urlFormat ? Navigation.buildQuery(params) : params;
        }
    });
});