define('jira/project/browse/layout', ['jira/backbone.radio-2.0', 'jira/marionette-4.1', 'jira/util/data/meta', 'jira/util/users/logged-in-user', 'jira/project/browse/projecttypestabsview', 'jira/project/browse/tabsview', 'jira/project/browse/filterview', 'jira/project/browse/projectcollectionview', 'jira/pagination/paginationview'], function (BackboneRadio, Marionette, meta, User, ProjectTypesTabsView, ProjectCategoriesTabsView, FilterView, ProjectCollectionView, PaginationView) {
    'use strict';

    return Marionette.View.extend({
        ui: {
            sidebar: '#browse-projects-sidebar',
            categoryNav: '.category-nav',
            projectTypeNav: '.project-type-nav',
            filter: '#filter-projects',
            content: '#projects',
            pagination: '#pagination'
        },
        regions: {
            sidebar: '@ui.sidebar',
            categoryNav: '@ui.categoryNav',
            projectTypeNav: '@ui.projectTypeNav',
            filter: '@ui.filter',
            content: '@ui.content',
            pagination: '@ui.pagination'
        },
        childViewEvents: {
            'project-type-change': 'projectTypeChange',
            'project-view.click-category': function projectViewClickCategory(project) {
                var categoryId = project.get('projectCategoryId');
                this.categoryChange(categoryId);
            },
            'category-change': 'categoryChange',
            'navigate': 'clickPage',
            'navigate-previous': 'clickPrevious',
            'navigate-next': 'clickNext'
        },
        initialize: function initialize(options) {
            this.mergeOptions(options, ['projects', 'categories', 'availableProjectTypes', 'filter']);

            this.analyticsChannel = BackboneRadio.channel('browse-projects-analytics');

            this.projectTypesTabsView = new ProjectTypesTabsView({
                collection: this.availableProjectTypes
            });

            this.projectCategoriesTabsView = new ProjectCategoriesTabsView({
                collection: this.categories
            });

            this.filterView = new FilterView({
                model: this.filter
            });

            this.projectCollectionView = new ProjectCollectionView({
                model: this.filter,
                collection: this.projects
            });

            this.paginationView = new PaginationView({
                collection: this.projects
            });

            this.hideSidebarIfAdmin();
        },
        render: function render() {
            this.setUpProjectTypesView();
            this.setUpProjectCategoriesView();

            this.showChildView('filter', this.filterView);

            this.showChildView('content', this.projectCollectionView);

            this.showChildView('pagination', this.paginationView);
        },
        setUpProjectTypesView: function setUpProjectTypesView() {
            if (this.availableProjectTypes.length) {
                this.showChildView('projectTypeNav', this.projectTypesTabsView);
            } else {
                this.getUI('projectTypeNav').addClass('hidden');
            }
        },
        setUpProjectCategoriesView: function setUpProjectCategoriesView() {
            if (User.username() !== '' || this.categories.length > 1) {
                this.showChildView('categoryNav', this.projectCategoriesTabsView);
            } else {
                this.getUI('categoryNav').addClass('hidden');
            }
        },

        projectTypeChange: function projectTypeChange(projectTypeId) {
            var projectType = this.availableProjectTypes.selectProjectType(projectTypeId);
            if (projectType) {
                this.filter.changeProjectType(projectType);
            }
        },
        categoryChange: function categoryChange(categoryId) {
            var oldCategory = this.categories.getSelected().id;
            var category = this.categories.selectCategory(categoryId);

            var projectCollectionView = this.getChildView('content');
            if (category && oldCategory !== categoryId) {
                this.filter.changeCategory(category);

                if (categoryId === 'archived' || oldCategory === 'archived') {
                    //Force render view because of possible columns changes
                    projectCollectionView.render();
                }
            }
        },
        hideSidebarIfAdmin: function hideSidebarIfAdmin() {
            // we are in administration, not global browse projects
            var isAdminMode = meta.get('in-admin-mode');
            if (isAdminMode) {
                /* for some reason the "Layout" is never rendered, and there is no cached jquery element.
                 * a marionette version update (one glorious day...) would get rid of the layout itself, so we do this for now.
                 */
                this.getUI('sidebar').addClass('hidden');
            }
        },

        clickPage: function clickPage(pageNumber) {
            this.analyticsChannel.trigger('browse-projects.navigate-to-page', pageNumber);
        },
        clickPrevious: function clickPrevious() {
            this.analyticsChannel.trigger('browse-projects.navigate-to-previous');
        },
        clickNext: function clickNext() {
            this.analyticsChannel.trigger('browse-projects.navigate-to-next');
        }
    });
});