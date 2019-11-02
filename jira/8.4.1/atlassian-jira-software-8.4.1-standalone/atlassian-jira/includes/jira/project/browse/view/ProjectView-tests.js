AJS.test.require("jira.webresources:browseprojects", function () {
    require(['jquery', 'underscore'], function ($, _) {
        module("ProjectView", {
            setupView: function setupView(mixin) {
                var context = AJS.test.mockableModuleContext();
                var ProjectView = context.require('jira/project/browse/projectview');
                this.$projectRow = $(JIRA.Templates.Project.Browse.projectRow(_.extend({
                    id: "proj1",
                    url: '#',
                    name: "Project 1",
                    projectCategoryId: "cat1",
                    projectCategoryName: "Category 1",
                    lead: 'Test user',
                    leadProfileLink: '<a>#</a>'
                }, mixin)));

                this.projectView = new ProjectView({
                    el: this.$projectRow
                });
            }
        });

        test("should trigger event when project name is clicked", function () {
            this.setupView();

            var projectNameClickHandler = sinon.spy();
            this.projectView.on('project-view.click-project-name', projectNameClickHandler);

            this.$projectRow.find('td.cell-type-name a').click();

            sinon.assert.calledOnce(projectNameClickHandler);
            sinon.assert.calledWith(projectNameClickHandler, this.projectView);
        });

        test("should trigger event when project username is clicked", function () {
            this.setupView();

            var projectUserClickHandler = sinon.spy();
            this.projectView.on('project-view.click-lead-user', projectUserClickHandler);

            this.$projectRow.find('td.cell-type-user a').click();

            sinon.assert.calledOnce(projectUserClickHandler);
            sinon.assert.calledWith(projectUserClickHandler, this.projectView);
        });

        test("should trigger event when category is clicked", function () {
            this.setupView();

            var projectCategoryClickHandler = sinon.spy();
            this.projectView.on('project-view.click-category', projectCategoryClickHandler);

            this.$projectRow.find('td.cell-type-category a').click();

            sinon.assert.calledOnce(projectCategoryClickHandler);
            sinon.assert.calledWith(projectCategoryClickHandler, this.projectView);
        });

        test("should trigger event when project URL is clicked", function () {
            this.setupView({ isAdminMode: false });

            var projectUrlClickHandler = sinon.spy();
            this.projectView.on('project-view.click-url', projectUrlClickHandler);

            this.$projectRow.find('td.cell-type-url a').click();

            sinon.assert.calledOnce(projectUrlClickHandler);
            sinon.assert.calledWith(projectUrlClickHandler, this.projectView);
        });

        test("should not render URL in admin", function () {
            this.setupView({ isAdminMode: true });

            equal(this.$projectRow.find('td.cell-type-url a').length, 0);
        });
    });
});