/**
 * This view renders a custom field model (at the moment just a normal backbone model with data from server) as a table row
 */
define('jira/customfields/customfieldRowView', ['jira/marionette-4.1'], function (Marionette) {
    'use strict';

    return Marionette.View.extend({
        tagName: 'tr',
        attributes: function attributes() {
            return { "data-custom-field-id": this.model.get("numericId") };
        },

        template: function template(data) {
            return JIRA.Templates.Admin.Customfields.customfield({
                multiLingual: data.multiLingual,
                customfield: data
            });
        },
        templateContext: function templateContext() {
            return {
                multiLingual: this.getOption('isMultiLingual')
            };
        }
    });
});