/**
 * This view renders options for filtering custom fields
 */
define('jira/customfields/customfieldsFilterItemView', ['jira/marionette-4.1', 'atlassian/libs/underscore-1.8.3'], function (Marionette, _) {
    'use strict';

    return Marionette.View.extend({
        ui: {
            filter: 'input[type="checkbox"]'
        },
        triggers: {
            'change @ui.filter': 'item:clicked'
        },
        tagName: 'li',
        template: JIRA.Templates.Admin.Customfields.filterDropdownItem,
        templateContext: function templateContext() {
            return {
                checked: _.contains(this.options.filterState, this.model.id.toString())
            };
        }
    });
});