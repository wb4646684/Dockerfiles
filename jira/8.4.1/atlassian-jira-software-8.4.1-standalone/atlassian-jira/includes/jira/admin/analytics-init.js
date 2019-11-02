require(['underscore', 'jira/util/data/meta', 'jira/util/init-on-dcl', 'jira/admin/analytics'], function (_, Meta, initOnDCL, adminAnalytics) {
    /**
     * Capture some events that better explain how people use JIRA administration in general.
     */
    initOnDCL(function () {
        var activeTab = Meta.get('admin.active.tab');

        _.defer(function () {
            adminAnalytics.bindEvents();

            if (activeTab === "view_project_workflows") {
                adminAnalytics.sendLoadWorkflowsTabEvent();
            }
        });
    });
});