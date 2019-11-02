define('jira/components/color-picker/color-picker-controller', ['jira/marionette-3.1', 'backbone', 'jira/components/color-picker/view/color-picker-view', 'jira/components/color-picker/sample-color/sample-colors-factory'], function (Marionette, Backbone, ColorPickerView, sampleColorsFactory) {
    "use strict";

    return Marionette.Object.extend({
        initialize: function initialize(_ref) {
            var _this = this;

            var value = _ref.value,
                id = _ref.id,
                name = _ref.name,
                errorMessage = _ref.errorMessage;

            this.model = new Backbone.Model({
                color: null,
                colorDefined: false,
                errorMessage: errorMessage,
                id: id,
                name: name
            });

            this.sampleColorsCollection = sampleColorsFactory();

            if (value) {
                this.model.set({
                    color: value,
                    colorDefined: true
                });
            }

            this.view = new ColorPickerView({
                model: this.model,
                sampleColors: this.sampleColorsCollection
            });

            this.view.on('colorChanged', function (color) {
                _this.onColorChange(_this.model, color);
            });

            this.view.render();
        },
        onColorChange: function onColorChange(model, color) {
            if (color) {
                model.set({
                    color: color,
                    colorDefined: true
                });
            } else {
                model.set({
                    color: null,
                    colorDefined: false
                });
            }
        },
        renderIntoElement: function renderIntoElement($el) {
            $el.append(this.view.$el);
        }
    });
});