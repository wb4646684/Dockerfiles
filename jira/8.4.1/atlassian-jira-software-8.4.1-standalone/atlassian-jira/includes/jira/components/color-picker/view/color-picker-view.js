define('jira/components/color-picker/view/color-picker-view', ['jira/marionette-3.1', 'jira/components/color-picker/view/sample-color-collection-view', 'jira/components/color-picker/view/color-picker-input-view'], function (Marionette, SampleColorCollectionView, ColorPickerInputView) {
    "use strict";

    return Marionette.View.extend({
        template: JIRA.Templates.Components.ColorPicker.colorPicker,

        childViewTriggers: {
            'color:selected': 'colorChanged'
        },

        regions: {
            sampleColors: {
                el: '.sample-colors',
                replaceElement: true
            },

            inputRegion: {
                el: '.color-picker-region',
                replaceElement: true
            }
        },

        onRender: function onRender() {
            this.showChildView('sampleColors', new SampleColorCollectionView({
                collection: this.options.sampleColors
            }));

            this.showChildView('inputRegion', new ColorPickerInputView({
                model: this.model
            }));
        }
    });
});