AJS.test.require(["jira.webresources:color-picker"], function () {
    "use strict";

    var Marionette = require('jira/marionette-3.1');

    module('Color picker component', {
        setup: function setup() {
            this.context = AJS.test.mockableModuleContext();

            this.colorPickerView = Marionette.View.extend({
                render: function render() {}
            });
            this.context.mock('jira/components/color-picker/view/color-picker-view', this.colorPickerView);

            this.ControllerClass = this.context.require('jira/components/color-picker/color-picker-controller');
        }
    });

    test('Model is initialized with passed parameters', function () {
        var id = "random id";
        var errorMessage = "error message";
        var name = "name";

        var controller = new this.ControllerClass({
            id: id,
            errorMessage: errorMessage,
            name: name
        });

        equal(controller.model.get('color'), null);
        equal(controller.model.get('colorDefined'), false);
        equal(controller.model.get('id'), id);
        equal(controller.model.get('errorMessage'), errorMessage);
        equal(controller.model.get('name'), name);
    });

    test('When initial value is passed to constructor, model is initialised with it', function () {
        var color = "my new and shiny color";

        var controller = new this.ControllerClass({
            value: color
        });

        equal(controller.model.get('color'), color);
        equal(controller.model.get('colorDefined'), true);
    });

    test('When event is triggered, new color is set', function () {
        var color = "my new and shiny color";

        var controller = new this.ControllerClass({});

        controller.view.trigger('colorChanged', color);

        equal(controller.model.get('color'), color);
        equal(controller.model.get('colorDefined'), true);
    });

    test('When event is triggered but color is empty, it is removed from model', function () {
        var color = "my new and shiny color";

        var controller = new this.ControllerClass({
            value: color
        });

        controller.view.trigger('colorChanged', undefined);

        equal(controller.model.get('color'), null);
        equal(controller.model.get('colorDefined'), false);
    });
});