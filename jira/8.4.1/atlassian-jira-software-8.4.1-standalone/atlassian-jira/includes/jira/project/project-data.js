define("jira/project/projectdata", ['wrm/data'], function (wrmData) {
    "use strict";

    var projectData = wrmData.claim('jira.core:jira-project-data-data.data');

    var projectDataObject = {

        /**
         * Possible project types are "software", "business", and "service_desk"
         */
        getProjectType: function getProjectType() {
            return projectData["projectType"];
        }
    };

    return projectDataObject;
});