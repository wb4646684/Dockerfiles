define('jira/project/browse/projecttypestabsview', ['jquery', 'jira/backbone.radio-2.0', 'jira/marionette-4.1'], function ($, BackboneRadio, Marionette) {
    'use strict';

    return Marionette.View.extend({
        template: JIRA.Templates.Project.Browse.projectTypesTabs,
        events: {
            'click a': 'projectTypeClick'
        },
        collectionEvents: {
            'change': 'render'
        },
        initialize: function initialize() {
            this.analyticsChannel = BackboneRadio.channel('browse-projects-analytics');
        },

        onRender: function onRender() {
            this.unwrapTemplate();
        },
        projectTypeClick: function projectTypeClick(e) {
            e.preventDefault();

            var $link = $(e.currentTarget);
            var id = $link.attr('rel');
            this.triggerMethod('project-type-change', id);
            this.analyticsChannel.trigger('browse-projects.project-type-change', id);
        }
    });
});