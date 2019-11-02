/**
 * This view renders a message when there are no available customfields filters in dropdown
 */
define('jira/customfields/customfieldsFilterEmptyView', ['jira/marionette-4.1'], function (Marionette) {
    'use strict';

    return Marionette.View.extend({
        template: JIRA.Templates.Admin.Customfields.emptyFilterView
    });
});