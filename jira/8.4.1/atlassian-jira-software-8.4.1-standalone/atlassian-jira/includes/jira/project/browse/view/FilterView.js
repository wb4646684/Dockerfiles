define('jira/project/browse/filterview', ['underscore', 'jira/marionette-4.1', 'jira/util/data/meta'], function (_, Marionette, meta) {
    'use strict';

    return Marionette.View.extend({
        template: JIRA.Templates.Project.Browse.filter,
        ui: {
            'contains': '.text'
        },
        events: {
            'change @ui.contains': 'inputContains',
            'keydown @ui.contains': 'inputContains',
            'submit form': 'formSubmit'
        },
        modelEvents: {
            'change:category': 'render',
            'change:projectType': 'render'
        },
        templateContext: function templateContext() {
            return { isAdminMode: meta.get('in-admin-mode') };
        },

        inputContains: _.debounce(function () {
            var filter = this.ui.contains.val();
            this.model.set('contains', filter);
        }, 300),
        formSubmit: function formSubmit(e) {
            e.preventDefault();
        }
    });
});