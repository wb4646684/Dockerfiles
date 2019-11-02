require(['wrm/data', 'jquery', 'jira/project/browse/app', 'jira/project/browse/projecttypesservice', 'jira/project/browse/analytics'], function (wrmData, $, App, ProjectTypesService, Analytics) {
    'use strict';

    $(function () {
        var $browseContainer = $('#browse-projects-page');
        if ($browseContainer.length) {
            ProjectTypesService.init(wrmData.claim('com.atlassian.jira.project.browse:projectTypes'));

            var browseProjectsApp = new App({
                projects: wrmData.claim('com.atlassian.jira.project.browse:projects'),
                categories: wrmData.claim('com.atlassian.jira.project.browse:categories'),
                selectedCategory: wrmData.claim('com.atlassian.jira.project.browse:selectedCategory'),
                availableProjectTypes: wrmData.claim('com.atlassian.jira.project.browse:availableProjectTypes'),
                selectedProjectType: wrmData.claim('com.atlassian.jira.project.browse:selectedProjectType'),
                region: '#browse-projects-page'
            });

            new Analytics();

            browseProjectsApp.start();

            $(".projects-list a[title]").tooltip({ gravity: "e" });
        }
    });
});