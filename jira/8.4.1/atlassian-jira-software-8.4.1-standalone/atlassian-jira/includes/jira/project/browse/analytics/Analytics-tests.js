/*global AJS*/
AJS.test.require('jira.webresources:browseprojects', function () {
    'use strict';

    var BackboneRadio = require('jira/backbone.radio-2.0');
    var Analytics = void 0;

    module('Analytics', {
        setup: function setup() {
            this.sandbox = sinon.sandbox.create();
            this.mockSend = this.sandbox.stub();

            var context = AJS.test.mockableModuleContext();
            context.mock('jira/analytics', { send: this.mockSend });
            context.mock('jira/backbone.radio-2.0', BackboneRadio);

            Analytics = context.require('jira/project/browse/analytics');
            this.mockProject = {
                attributes: {
                    id: 'PROJT',
                    projectTypeKey: 'Test'
                }
            };
        },
        // method to be called after setting up spies on the constructor
        createAnalyticsInstance: function createAnalyticsInstance() {
            this.analytics = new Analytics();
            this.analyticsChannel = BackboneRadio.channel('browse-projects-analytics');
        },
        teardown: function teardown() {
            this.analytics.destroy();
            this.sandbox.restore();
        }
    });

    test('project type changed to business', function () {
        var projectType = 'business';
        var spy = this.sandbox.spy(Analytics.prototype, 'triggerProjectTypeChanged');
        this.createAnalyticsInstance();

        this.analyticsChannel.trigger('browse-projects.project-type-change', projectType);
        sinon.assert.called(spy);
        sinon.assert.calledWith(this.mockSend, {
            name: 'projects.browse.types.business'
        });
    });

    test('project type changed to software', function () {
        var projectType = 'software';

        var spy = this.sandbox.spy(Analytics.prototype, 'triggerProjectTypeChanged');
        this.createAnalyticsInstance();

        this.analyticsChannel.trigger('browse-projects.project-type-change', projectType);
        sinon.assert.called(spy);

        sinon.assert.calledWith(this.mockSend, {
            name: 'projects.browse.types.software'
        });
    });

    test('project type changed to service desk', function () {
        var projectType = 'service_desk';

        var spy = this.sandbox.spy(Analytics.prototype, 'triggerProjectTypeChanged');
        this.createAnalyticsInstance();

        this.analyticsChannel.trigger('browse-projects.project-type-change', projectType);
        sinon.assert.called(spy);

        sinon.assert.calledWith(this.mockSend, {
            name: 'projects.browse.types.servicedesk'
        });
    });

    test('project type changed to all', function () {
        var projectType = 'all';
        var spy = this.sandbox.spy(Analytics.prototype, 'triggerProjectTypeChanged');
        this.createAnalyticsInstance();

        this.analyticsChannel.trigger('browse-projects.project-type-change', projectType);
        sinon.assert.called(spy);

        sinon.assert.calledWith(this.mockSend, {
            name: 'projects.browse.types.all'
        });
    });

    test('category changed to all', function () {
        var category = 'all';
        var spy = this.sandbox.spy(Analytics.prototype, 'triggerCategoryChanged');
        this.createAnalyticsInstance();

        this.analyticsChannel.trigger('browse-projects.category-change', category);
        sinon.assert.called(spy);

        sinon.assert.calledWith(this.mockSend, {
            name: 'projects.browse.categories.all'
        });
    });

    test('category changed to recent', function () {
        var category = 'recent';
        var spy = this.sandbox.spy(Analytics.prototype, 'triggerCategoryChanged');
        this.createAnalyticsInstance();

        this.analyticsChannel.trigger('browse-projects.category-change', category);
        sinon.assert.called(spy);

        sinon.assert.calledWith(this.mockSend, {
            name: 'projects.browse.categories.recent'
        });
    });

    test('category changed to archived', function () {
        var category = 'archived';
        var spy = this.sandbox.spy(Analytics.prototype, 'triggerCategoryChanged');
        this.createAnalyticsInstance();

        this.analyticsChannel.trigger('browse-projects.category-change', category);
        sinon.assert.called(spy);

        sinon.assert.calledWith(this.mockSend, {
            name: 'projects.browse.categories.archived'
        });
    });

    test('category changed to user-defined category', function () {
        var category = 'test';
        var spy = this.sandbox.spy(Analytics.prototype, 'triggerCategoryChanged');
        this.createAnalyticsInstance();

        this.analyticsChannel.trigger('browse-projects.category-change', category);
        sinon.assert.called(spy);

        sinon.assert.calledWith(this.mockSend, {
            name: 'projects.browse.categories.select'
        });
    });

    test('project opened', function () {
        var position = 1;
        var spy = this.sandbox.spy(Analytics.prototype, 'triggerProjectOpened');
        this.createAnalyticsInstance();

        this.analyticsChannel.trigger('browse-projects.project-view.click-project-name', this.mockProject, position);
        sinon.assert.called(spy);

        sinon.assert.calledWith(this.mockSend, {
            name: 'projects.browse.openProject',
            data: {
                projectId: this.mockProject.attributes.id,
                projectType: this.mockProject.attributes.projectTypeKey,
                position: position
            }
        });
    });

    test('user profile lead user clicked', function () {
        var position = 1;

        var spy = this.sandbox.spy(Analytics.prototype, 'triggerProfileNameClicked');
        this.createAnalyticsInstance();

        this.analyticsChannel.trigger('browse-projects.project-view.click-lead-user', this.mockProject, position);
        sinon.assert.called(spy);

        sinon.assert.calledWith(this.mockSend, {
            name: 'projects.browse.openProfile',
            data: {
                projectId: this.mockProject.attributes.id,
                projectType: this.mockProject.attributes.projectTypeKey,
                position: position
            }
        });
    });

    test('project URL clicked', function () {
        var position = 1;

        var spy = this.sandbox.spy(Analytics.prototype, 'triggerProjectURLClicked');
        this.createAnalyticsInstance();

        this.analyticsChannel.trigger('browse-projects.project-view.click-url', this.mockProject, position);
        sinon.assert.called(spy);

        sinon.assert.calledWith(this.mockSend, {
            name: 'projects.browse.openURL',
            data: {
                projectId: this.mockProject.attributes.id,
                projectType: this.mockProject.attributes.projectTypeKey,
                position: position
            }
        });
    });

    test('project category clicked', function () {
        var position = 1;

        var spy = this.sandbox.spy(Analytics.prototype, 'triggerProjectCategoryClicked');
        this.createAnalyticsInstance();

        this.analyticsChannel.trigger('browse-projects.project-view.click-category', this.mockProject, position);
        sinon.assert.called(spy);

        sinon.assert.calledWith(this.mockSend, {
            name: 'projects.browse.openCategory',
            data: {
                projectId: this.mockProject.attributes.id,
                projectType: this.mockProject.attributes.projectTypeKey,
                position: position
            }
        });
    });

    test('navigate to page', function () {
        var pageNumber = 1;

        var spy = this.sandbox.spy(Analytics.prototype, 'triggerNavigateToPage');
        this.createAnalyticsInstance();

        this.analyticsChannel.trigger('browse-projects.navigate-to-page', pageNumber);
        sinon.assert.called(spy);

        sinon.assert.calledWith(this.mockSend, {
            name: 'projects.browse.pagination.goto',
            data: { pageNumber: pageNumber }
        });
    });

    test('navigate to previous page', function () {
        var spy = this.sandbox.spy(Analytics.prototype, 'triggerNavigateToPrevious');
        this.createAnalyticsInstance();

        this.analyticsChannel.trigger('browse-projects.navigate-to-previous');
        sinon.assert.called(spy);

        sinon.assert.calledWith(this.mockSend, { name: 'projects.browse.pagination.previous' });
    });

    test('navigate to next page', function () {
        var spy = this.sandbox.spy(Analytics.prototype, 'triggerNavigateToNext');
        this.createAnalyticsInstance();

        this.analyticsChannel.trigger('browse-projects.navigate-to-next');
        sinon.assert.called(spy);

        sinon.assert.calledWith(this.mockSend, { name: 'projects.browse.pagination.next' });
    });
});