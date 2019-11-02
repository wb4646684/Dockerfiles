AJS.test.require('jira.webresources:browseprojects', function () {
    'use strict';

    require(['underscore', 'jquery', 'backbone', 'jira/util/users/logged-in-user', 'jira/util/data/meta', 'jira/project/browse/app', 'jira/util/navigation'], function (_, $, Backbone, loggedInUser, meta, BrowseProjectsApp, navigation) {

        var initialQueryParams = window.location.search;

        function generateCategories(number) {
            var categories = [];
            for (var i = 1; i <= number; i++) {
                categories.push({
                    name: 'Cat ' + i,
                    id: "cat" + i,
                    description: ''
                });
            }
            categories.push({
                id: 'archived',
                name: 'Archived projects',
                description: 'Archived projects',
                selected: false
            });
            return categories;
        }

        function generateProjects(number, categories) {
            var projects = [];
            var category = void 0;
            for (var i = 1; i <= number; i++) {
                category = (i - 1) % categories.length;

                projects.push({
                    id: 'p' + i,
                    name: 'Project ' + i,
                    projectCategoryId: categories[category].id,
                    key: 'PRJ' + i,
                    hasDefaultAvatar: true,
                    lead: 'admin',
                    admin: i % 2 !== 0,
                    projectAdmin: i % 2 === 0,
                    archived: i === 4 || i === 5, // one each for testing actions of admin and PLA
                    archivedBy: i === 4 || i === 5 ? "admin" : undefined,
                    archivedByLink: i === 4 || i === 5 ? "link" : undefined,
                    archivedTimestamp: i === 4 || i === 5 ? 60 : undefined,
                    lastUpdatedTimestamp: 60,
                    issueCount: 8
                });
            }
            return projects;
        }

        module('BrowseProjectApp', {
            setup: function setup() {
                var _this = this;

                this.sandbox = sinon.sandbox.create();
                this.context = AJS.test.mockableModuleContext();

                this.navigation = navigation;
                this.sandbox.spy(this.navigation, 'navigate');
                this.navigation.pushStateSupported = true;
                this.context.mock('jira/util/navigation', this.navigation);

                this.userUtils = _.extend(loggedInUser, {
                    username: this.sandbox.stub().returns('admin')
                });
                this.context.mock('jira/util/users/logged-in-user', this.userUtils);

                this.inAdminMode = false;
                this.archivingEnabled = true;
                this.sandbox.stub(meta, 'get', function (key) {
                    if (key === "in-admin-mode") {
                        return _this.inAdminMode;
                    }
                    if (key === "archiving-enabled") {
                        return _this.archivingEnabled;
                    }
                });
                this.context.mock('jira/util/data/meta', meta);

                this.$container = $('<div id="browse-projects-page">\n                        <div class="aui-page-panel-inner">\n                            <div id="browse-projects-sidebar">\n                                <div class="project-type-nav"></div>\n                                <div class="category-nav"></div>\n                            </div>\n                            <div class="aui-page-panel-content">\n                                <div class="module">\n                                    <div class="mod-header" id="filter-projects"></div>\n                                    <div class="mod-content" id="projects"></div>\n                                </div>\n                                <div id="pagination"></div>\n                            </div>\n                        </div>\n                    </div>').appendTo($('#qunit-fixture'));

                this.categories = generateCategories(4);
                this.projects = generateProjects(100, this.categories);
                this.categories.push({ name: 'All Projects', id: 'all' });
                this.changeContainsFilter = function (filter) {
                    var clock = this.sandbox.useFakeTimers();
                    this.$container.find('#project-filter-text').val(filter).trigger('change');
                    clock.tick(310);
                };
                this.startApplication = function (selectedCategory, projects, categories) {
                    projects = projects || this.projects;
                    categories = categories || this.categories;

                    this.BrowseProjectsApp = new BrowseProjectsApp({
                        projects: projects,
                        categories: categories,
                        selectedCategory: selectedCategory,
                        region: "#browse-projects-page"
                    });

                    this.BrowseProjectsApp.start();
                };
            },
            teardown: function teardown() {
                var _this2 = this;

                this.sandbox.restore();

                var root = navigation.getRoot();
                Backbone.history.navigate(root + initialQueryParams);
                Backbone.history.stop();

                _.each(this.BrowseProjectsApp.layout.regions, function (selector, region) {
                    var childView = _this2.BrowseProjectsApp.layout.getChildView(region);
                    if (childView) {
                        childView.destroy();
                    }
                });
                this.BrowseProjectsApp.layout.destroy();
                this.BrowseProjectsApp.destroy();
            }
        });

        test('should select default category on start', function () {
            //this test will fail if you refreshing the qunit test page to re-run tests, due to text filter "asdef" from previous run remains in url
            this.startApplication("cat1");

            equal(this.$container.find('.projects-list tr:first td.cell-type-category a').text(), "Cat 1");
            equal(this.$container.find('.projects-list tr').length, 20);
        });

        test('should update UI with selected category', function () {
            this.startApplication("all");

            this.$container.find('.projects-list tr:nth-child(2) td.cell-type-category a').click();

            equal(this.$container.find('.category-nav #cat2-panel-tab').hasClass('aui-nav-selected'), true);
            equal(this.$container.find('#filter-projects h2').text(), 'Cat 2');
        });

        test('should switch pages when clicking on pagination', function () {
            this.startApplication("all");

            equal(this.$container.find('.aui-nav-pagination .aui-nav-selected').text(), "1", "First page is selected");
            equal(this.$container.find('.projects-list tr:first td.cell-type-name a').text(), "Project 1");
            equal(this.$container.find('.projects-list tr:last td.cell-type-name a').text(), "Project 27");

            this.$container.find('.aui-nav-pagination a:eq(2)').click();

            equal(this.$container.find('.aui-nav-pagination .aui-nav-selected').text(), "3", "Third page is selected");
            equal(this.$container.find('.projects-list tr:first td.cell-type-name a').text(), "Project 53");
            equal(this.$container.find('.projects-list tr:last td.cell-type-name a').text(), "Project 77");
        });

        test('should filter projects when changing criteria', function () {
            this.startApplication("all");

            this.changeContainsFilter('Project 100');

            equal(this.$container.find('.projects-list tr:first td.cell-type-name a').text(), "Project 100");
            equal(this.$container.find('.projects-list tr').length, 1);
        });

        test('should filter by category on click', function () {
            this.startApplication("all");

            this.$container.find('.category-nav #cat3-panel-tab-lnk').click();
            equal(this.$container.find('.projects-list tr:first td.cell-type-category a').text(), "Cat 3");
            equal(this.$container.find('.projects-list tr').length, 20);
        });

        test('should update url with current state', function () {
            this.startApplication("all");

            this.$container.find('.aui-nav-pagination a:eq(1)').click();
            sinon.assert.calledOnce(this.navigation.navigate);
            sinon.assert.calledWith(this.navigation.navigate, {
                selectedCategory: 'all',
                s: "view_projects",
                selectedProjectType: '',
                contains: false,
                page: 2,
                sortColumn: 'name',
                sortOrder: 'ascending'
            });

            this.changeContainsFilter('Project 100');

            sinon.assert.calledTwice(this.navigation.navigate);
            sinon.assert.calledWith(this.navigation.navigate, {
                selectedCategory: 'all',
                s: "view_projects",
                selectedProjectType: '',
                contains: 'Project 100',
                sortColumn: 'name',
                sortOrder: 'ascending'
            });

            this.$container.find('.category-nav #cat3-panel-tab-lnk').click();
            sinon.assert.calledThrice(this.navigation.navigate);
            sinon.assert.calledWith(this.navigation.navigate, {
                selectedCategory: 'cat3',
                selectedProjectType: '',
                contains: 'Project 100',
                sortColumn: 'name',
                sortOrder: 'ascending'
            });
        });

        test("should display message when there no projects match criteria", function () {
            this.startApplication("all");
            this.changeContainsFilter('asdef');

            equal(this.$container.find('.projects-list tr').length, 1);
            equal(this.$container.find('.projects-list .no-project-results').length, 1);
        });

        test('should hide sidebar for logged out user when there is only one category', function () {
            this.userUtils.username.returns('');

            this.startApplication("one", [{ id: 'first', projectCategoryId: 'one', key: 'frst' }], [{ id: 'one', name: 'One' }]);

            equal(this.$container.find('.category-nav').hasClass('hidden'), true);
            equal(this.$container.find('.category-nav').children().length, 0);
        });

        test('should still show sidebar for logged in user when there is only one category', function () {
            this.startApplication("one", [{ id: 'first', projectCategoryId: 'one', key: 'frst' }], [{ id: 'one', name: 'One' }]);

            equal(this.$container.find('.category-nav').hasClass('hidden'), false);
            equal(this.$container.find('.category-nav').children().length, 1);
        });

        test('should not display sidebar when rendered inside administration', function () {
            this.inAdminMode = true;
            this.startApplication("all");

            ok(this.$container.find('#browse-projects-sidebar').hasClass('hidden'));
        });

        test('should display sidebar when rendered outside administration', function () {
            this.inAdminMode = false;
            this.startApplication("all");

            notOk(this.$container.find('#browse-projects-sidebar').hasClass('hidden'));
        });

        test('should not render filters heading when rendered inside administration', function () {
            this.inAdminMode = true;
            this.startApplication("all");

            notOk(this.$container.find('#filter-projects').find('h2').size());
        });

        test('should render filters heading when rendered outside administration', function () {
            this.inAdminMode = false;
            this.startApplication("all");

            ok(this.$container.find('#filter-projects').find('h2').size());
        });

        test('should render actions field when rendered inside administration', function () {
            this.inAdminMode = true;
            this.startApplication("all");

            ok(this.$container.find('#projects .project-list-actions').size());
        });

        test('should not render actions field when rendered outside administration', function () {
            this.inAdminMode = false;
            this.startApplication("all");

            notOk(this.$container.find('#projects .project-list-actions').size());
        });

        test('should render edit, archive and delete actions for sys admins under administration', function () {
            this.inAdminMode = true;
            this.startApplication("all");

            ok(this.$container.find('#projects .project-list-actions').size());
            // edit button, meatballs button and dropdown content
            equal(this.$container.find('.projects-list tr:first td.cell-type-actions .aui-buttons').children().size(), 2);
            equal(this.$container.find('.projects-list tr:first td.cell-type-actions .aui-buttons .aui-dropdown2 li:eq(0) a').text(), "common.words.edit");
            equal(this.$container.find('.projects-list tr:first td.cell-type-actions .aui-buttons .aui-dropdown2 li:eq(1) a').text(), "common.words.archive");
            equal(this.$container.find('.projects-list tr:first td.cell-type-actions .aui-buttons .aui-dropdown2 li:eq(2) a').text(), "common.words.delete");
        });

        test('should render edit and delete actions for sys admins under administration when archiving is disabled', function () {
            this.inAdminMode = true;
            this.archivingEnabled = false;
            this.startApplication("all");

            ok(this.$container.find('#projects .project-list-actions').size());
            // edit button, meatballs button and dropdown content
            equal(this.$container.find('.projects-list tr:first td.cell-type-actions .aui-buttons').children().size(), 2);
            equal(this.$container.find('.projects-list tr:first td.cell-type-actions .aui-buttons .aui-dropdown2 li:eq(0) a').text(), "common.words.edit");
            equal(this.$container.find('.projects-list tr:first td.cell-type-actions .aui-buttons .aui-dropdown2 li:eq(1) a').text(), "common.words.delete");
        });

        test('should only render edit action for PLA under administration', function () {
            this.inAdminMode = true;
            this.startApplication("all");

            ok(this.$container.find('#projects .project-list-actions').size());
            equal(this.$container.find('.projects-list tr:eq(1) td.cell-type-actions .aui-buttons a').size(), 1);
            equal(this.$container.find('.projects-list tr:eq(1) td.cell-type-actions .aui-buttons a').text(), "common.words.edit");
        });

        test('project icon and name should not be clickable for archived projects', function () {
            this.inAdminMode = true;
            this.startApplication("all");
            this.$container.find('.category-nav #archived-panel-tab-lnk').click();

            notOk(this.$container.find('.projects-list tr:first td.cell-type-name a').size());
            notOk(this.$container.find('.projects-list tr:first td.cell-type-icon a').size());
            equal(this.$container.find('.projects-list tr:first td.cell-type-name').text(), 'Project 4');
        });

        test('archived projects should only have restore and delete action for admins', function () {
            this.inAdminMode = true;
            this.startApplication("all");
            this.$container.find('.category-nav #archived-panel-tab-lnk').click();

            ok(this.$container.find('#projects .project-list-actions').size());
            equal(this.$container.find('.projects-list tr:eq(1) td.cell-type-actions .aui-list-truncate').children().size(), 2);

            equal(this.$container.find('.projects-list tr:eq(1) td.cell-type-actions .aui-list-truncate li:first a').text(), "common.words.restore");
            equal(this.$container.find('.projects-list tr:eq(1) td.cell-type-actions .aui-list-truncate li:eq(1) a').text(), "common.words.delete");
        });

        test('PLA should not have archive or delete action for archived projects', function () {
            this.inAdminMode = true;
            this.startApplication("all");
            this.$container.find('.category-nav #archived-panel-tab-lnk').click();

            ok(this.$container.find('#projects .project-list-actions').size());
            notOk(this.$container.find('.projects-list tr:first td.cell-type-actions .operations-list li').size());
            notEqual(this.$container.find('.projects-list tr:first td.cell-type-actions .operations-list li:first a').text(), "common.words.restore");
            notEqual(this.$container.find('.projects-list tr:first td.cell-type-actions .operations-list li:eq(1) a').text(), "common.words.delete");
        });

        test('PLA in all view projects should not have archived date and archived by', function () {
            this.startApplication("all");
            // Workaround (looks like by default we are taking all projects)
            this.$container.find('.category-nav #archived-panel-tab-lnk').click();
            this.$container.find('.category-nav #all-panel-tab-lnk').click();

            notOk(this.$container.find('.project-list-archived-date').size());
            notOk(this.$container.find('.project-list-archived-by').size());
            notOk(this.$container.find('.projects-list td.cell-type-archived-date').size());
            notOk(this.$container.find('.projects-list td.cell-type-archived-by').size());
        });

        test('PLA in all view projects should have archived date and not archived by', function () {
            this.startApplication("archived");
            this.$container.find('.category-nav #archived-panel-tab-lnk').click();

            ok(this.$container.find('.project-list-archived-date').size());
            notOk(this.$container.find('.project-list-archived-by').size());
            ok(this.$container.find('.projects-list td.cell-type-archived-date').size());
            notOk(this.$container.find('.projects-list td.cell-type-archived-by').size());
        });

        test('Admin in all view projects should not have archived date and archived by', function () {
            this.inAdminMode = true;
            this.startApplication("all");
            // Workaround (looks like by default we are taking all projects)
            this.$container.find('.category-nav #archived-panel-tab-lnk').click();
            this.$container.find('.category-nav #all-panel-tab-lnk').click();

            notOk(this.$container.find('.project-list-archived-date').size());
            notOk(this.$container.find('.project-list-archived-by').size());
            notOk(this.$container.find('.projects-list td.cell-type-archived-date').size());
            notOk(this.$container.find('.projects-list td.cell-type-archived-by').size());
        });

        test('Admin in all view projects should have archived date and not archived by', function () {
            this.inAdminMode = true;
            this.startApplication("archived");
            this.$container.find('.category-nav #archived-panel-tab-lnk').click();

            ok(this.$container.find('.project-list-archived-date').size());
            ok(this.$container.find('.project-list-archived-by').size());
            ok(this.$container.find('.projects-list td.cell-type-archived-date').size());
            ok(this.$container.find('.projects-list td.cell-type-archived-by').size());
        });

        test('PLA in view projects should not have archived date and archived by after switching categories', function () {
            this.startApplication("all");
            this.$container.find('.category-nav #archived-panel-tab-lnk').click();
            this.$container.find('.category-nav #all-panel-tab-lnk').click();

            notOk(this.$container.find('.project-list-archived-date').size());
            notOk(this.$container.find('.project-list-archived-by').size());
            notOk(this.$container.find('.projects-list td.cell-type-archived-date').size());
            notOk(this.$container.find('.projects-list td.cell-type-archived-by').size());
        });

        test('Admin in view projects should not have archived date and archived by after switching categories', function () {
            this.inAdminMode = true;
            this.startApplication("all");
            this.$container.find('.category-nav #archived-panel-tab-lnk').click();
            this.$container.find('.category-nav #all-panel-tab-lnk').click();

            notOk(this.$container.find('.project-list-archived-date').size());
            notOk(this.$container.find('.project-list-archived-by').size());
            notOk(this.$container.find('.projects-list td.cell-type-archived-date').size());
            notOk(this.$container.find('.projects-list td.cell-type-archived-by').size());
        });

        test('Admin in all view projects should have last updated date and issue count', function () {
            this.inAdminMode = true;
            this.startApplication("all");
            this.$container.find('.category-nav #archived-panel-tab-lnk').click();
            this.$container.find('.category-nav #all-panel-tab-lnk').click();

            ok(this.$container.find('.project-list-issue-count').size());
            ok(this.$container.find('.project-list-updated-date').size());
            ok(this.$container.find('.projects-list td.cell-type-issue-count').size());
            ok(this.$container.find('.projects-list td.cell-type-updated-date').size());
        });

        test('PLA in all view projects should not have last updated date and issue count', function () {
            this.startApplication("all");
            this.$container.find('.category-nav #archived-panel-tab-lnk').click();
            this.$container.find('.category-nav #all-panel-tab-lnk').click();

            notOk(this.$container.find('.project-list-issue-count').size());
            notOk(this.$container.find('.project-list-updated-date').size());
            notOk(this.$container.find('.projects-list td.cell-type-issue-count').size());
            notOk(this.$container.find('.projects-list td.cell-type-updated-date').size());
        });

        test('Admin in view archived projects should not have last updated date and issue count', function () {
            this.inAdminMode = true;
            this.startApplication("all");
            // this.$container.find('.category-nav #all-panel-tab-lnk').click();
            this.$container.find('.category-nav #archived-panel-tab-lnk').click();

            notOk(this.$container.find('.project-list-issue-count').size());
            notOk(this.$container.find('.project-list-updated-date').size());
            notOk(this.$container.find('.projects-list td.cell-type-issue-count').size());
            notOk(this.$container.find('.projects-list td.cell-type-updated-date').size());
        });

        test('Should display archived projects empty state without action button when there are no archived projects', function () {
            this.inAdminMode = false;
            this.projects = [];
            this.startApplication("all");
            this.$container.find('.category-nav #archived-panel-tab-lnk').click();
            ok(this.$container.find('.no-projects-container').size());
            notOk(this.$container.find('.no-projects-container').find('a.aui-button.aui-button-primary').size());
        });

        test('Admin in view projects should display archived projects empty state with action button when there are no archived projects', function () {
            this.inAdminMode = true;
            this.projects = [];
            this.startApplication("all");
            this.$container.find('.category-nav #archived-panel-tab-lnk').click();

            ok(this.$container.find('.no-projects-container').size());
            ok(this.$container.find('.no-projects-container').find('a.aui-button.aui-button-primary').size());
        });
    });
});