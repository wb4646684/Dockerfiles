define('jira/project/browse/tabsview', ['jquery', 'jira/backbone.radio-2.0', 'jira/marionette-4.1'], function ($, BackboneRadio, Marionette) {
    'use strict';

    return Marionette.View.extend({
        template: JIRA.Templates.Project.Browse.tabs,
        events: {
            'click a': 'categoryClick'
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
        categoryClick: function categoryClick(e) {
            var $link = $(e.currentTarget);
            var id = $link.attr('rel');

            e.preventDefault();
            this.triggerMethod('category-change', id);
            this.analyticsChannel.trigger('browse-projects.category-change', id);
        }
    });
});