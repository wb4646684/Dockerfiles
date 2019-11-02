define('jira/project/browse/analytics', ['jira/analytics', 'jira/marionette-4.1'], function (analytics, Marionette) {
    'use strict';

    return Marionette.MnObject.extend({
        channelName: 'browse-projects-analytics',
        radioEvents: {
            'browse-projects.projects-render': 'triggerProjectsRender',
            'browse-projects.project-view.click-project-name': 'triggerProjectOpened',
            'browse-projects.project-view.click-lead-user': 'triggerProfileNameClicked',
            'browse-projects.project-view.click-category': 'triggerProjectCategoryClicked',
            'browse-projects.project-view.click-url': 'triggerProjectURLClicked',
            'browse-projects.project-type-change': 'triggerProjectTypeChanged',
            'browse-projects.category-change': 'triggerCategoryChanged',
            'browse-projects.navigate-to-page': 'triggerNavigateToPage',
            'browse-projects.navigate-to-previous': 'triggerNavigateToPrevious',
            'browse-projects.navigate-to-next': 'triggerNavigateToNext'
        },
        triggerProjectTypeChanged: function triggerProjectTypeChanged(projectType) {
            if (projectType === 'business') {
                analytics.send({ name: 'projects.browse.types.business' });
            } else if (projectType === 'software') {
                analytics.send({ name: 'projects.browse.types.software' });
            } else if (projectType === 'service_desk') {
                analytics.send({ name: 'projects.browse.types.servicedesk' });
            } else if (projectType === 'all') {
                analytics.send({ name: 'projects.browse.types.all' });
            }
        },
        triggerCategoryChanged: function triggerCategoryChanged(categoryId) {
            if (categoryId === 'all') {
                analytics.send({ name: 'projects.browse.categories.all' });
            } else if (categoryId === 'recent') {
                analytics.send({ name: 'projects.browse.categories.recent' });
            } else if (categoryId === 'archived') {
                analytics.send({ name: 'projects.browse.categories.archived' });
            } else {
                // The specific category can be user-defined, and so will not be recorded due to privacy concerns.
                analytics.send({ name: 'projects.browse.categories.select' });
            }
        },
        triggerProjectsRender: function triggerProjectsRender(numProjects) {
            analytics.send({
                name: 'projects.browse.view',
                data: { numProjects: numProjects }
            });
        },
        triggerProjectOpened: function triggerProjectOpened(project, position) {
            analytics.send({
                name: 'projects.browse.openProject',
                data: {
                    projectId: project.attributes.id,
                    projectType: project.attributes.projectTypeKey,
                    position: position
                }
            });
        },
        triggerProfileNameClicked: function triggerProfileNameClicked(project, position) {
            analytics.send({
                name: 'projects.browse.openProfile',
                data: {
                    projectId: project.attributes.id,
                    projectType: project.attributes.projectTypeKey,
                    position: position
                }
            });
        },
        triggerProjectURLClicked: function triggerProjectURLClicked(project, position) {
            analytics.send({
                name: 'projects.browse.openURL',
                data: {
                    projectId: project.attributes.id,
                    projectType: project.attributes.projectTypeKey,
                    position: position
                }
            });
        },
        triggerProjectCategoryClicked: function triggerProjectCategoryClicked(project, position) {
            analytics.send({
                name: 'projects.browse.openCategory',
                data: {
                    projectId: project.attributes.id,
                    projectType: project.attributes.projectTypeKey,
                    position: position
                }
            });
        },
        triggerNavigateToPage: function triggerNavigateToPage(pageNumber) {
            analytics.send({
                name: 'projects.browse.pagination.goto',
                data: { pageNumber: pageNumber }
            });
        },
        triggerNavigateToPrevious: function triggerNavigateToPrevious() {
            analytics.send({ name: 'projects.browse.pagination.previous' });
        },
        triggerNavigateToNext: function triggerNavigateToNext() {
            analytics.send({ name: 'projects.browse.pagination.next' });
        }
    });
});