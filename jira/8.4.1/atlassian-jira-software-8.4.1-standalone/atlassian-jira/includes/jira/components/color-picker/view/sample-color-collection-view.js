define('jira/components/color-picker/view/sample-color-collection-view', ['jira/marionette-3.1'], function (Marionette) {
    "use strict";

    var SampleColorItemView = Marionette.View.extend({
        template: JIRA.Templates.Components.ColorPicker.sampleColor,

        ui: {
            icon: '.sample-color'
        },

        events: {
            'click @ui.icon': 'handleClick'
        },

        handleClick: function handleClick(e) {
            e.preventDefault();
            this.trigger('color:selected', this.model.get('color'));
        }
    });

    return Marionette.CollectionView.extend({
        tagName: 'div',
        className: 'sample-color-container',
        childView: SampleColorItemView,

        childViewTriggers: {
            'color:selected': 'color:selected'
        }
    });
});