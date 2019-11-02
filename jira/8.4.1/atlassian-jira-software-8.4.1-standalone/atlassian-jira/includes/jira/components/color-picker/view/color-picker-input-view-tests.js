AJS.test.require(["jira.webresources:color-picker"], function () {
    "use strict";

    var Backbone = require('backbone');
    var $ = require('jquery');

    var ORIGINAL_COLOR = 'black';

    var ATTACH_ELEMENT_SELECTOR = '#qunit-fixture';

    module('Color picker input view component', {
        setup: function setup() {
            this.sandbox = sinon.sandbox.create();

            this.stubColorPicker();

            this.model = new Backbone.Model({
                color: ORIGINAL_COLOR,
                colorDefined: true
            });

            var ColorPickerInput = require('jira/components/color-picker/view/color-picker-input-view').extend({
                el: ATTACH_ELEMENT_SELECTOR
            });

            this.colorPickerView = new ColorPickerInput({
                model: this.model
            });
            this.onColorSelectedStub = this.sandbox.stub();
            this.colorPickerView.on('color:selected', this.onColorSelectedStub);

            this.colorPickerView.render();
        },
        stubColorPicker: function stubColorPicker() {
            var _this = this;

            this.sandbox.stub($.fn, 'ColorPicker', function (options) {
                _this.colorPickerOnSubmit = options.onSubmit;
                _this.colorPickerOnChange = options.onChange;
            });

            this.sandbox.stub($.fn, 'ColorPickerSetColor');
            this.sandbox.stub($.fn, 'ColorPickerShow');
            this.sandbox.stub($.fn, 'ColorPickerHide');
        },
        teardown: function teardown() {
            this.sandbox.restore();
        },
        getInput: function getInput() {
            return $(ATTACH_ELEMENT_SELECTOR + " input");
        },
        getPreview: function getPreview() {
            return $(ATTACH_ELEMENT_SELECTOR + " .color-preview");
        },
        triggerKeyUp: function triggerKeyUp(newVal) {
            this.getInput().val(newVal);
            this.getInput().trigger('keyup');
        }
    });

    test('When model triggers color change, input field changes value', function () {
        var NEW_COLOR = 'yellow';

        equal(this.getInput().val(), ORIGINAL_COLOR);
        equal(this.getPreview().get(0).style.backgroundColor, ORIGINAL_COLOR);

        this.model.set('color', NEW_COLOR);

        equal(this.getInput().val(), NEW_COLOR);
        equal(this.getPreview().get(0).style.backgroundColor, NEW_COLOR);
        ok(this.getInput().ColorPickerSetColor.calledOnce);
        ok(this.getInput().ColorPickerSetColor.calledWith(NEW_COLOR));
    });

    test('When model triggers color defined change, color preview may disappear', function () {
        this.model.set('colorDefined', true);
        ok(this.getPreview().is(':visible'));

        this.model.set('colorDefined', false);
        notOk(this.getPreview().is(':visible'));
    });

    test('When someone type into field, event is triggered', function () {
        ok(this.onColorSelectedStub.notCalled);

        var newValue = 'new value';
        this.triggerKeyUp(newValue);

        ok(this.onColorSelectedStub.calledOnce);
        ok(this.onColorSelectedStub.calledWith(newValue));

        var newValue_V2 = 'new value version 2';
        this.triggerKeyUp(newValue_V2);

        ok(this.onColorSelectedStub.calledTwice);
        ok(this.onColorSelectedStub.calledWith(newValue_V2));
    });

    test('When someone change value in color picker, event is triggered', function () {
        ok(this.onColorSelectedStub.notCalled);

        var newVal = 'new val';
        this.colorPickerOnChange('color', newVal);

        ok(this.onColorSelectedStub.calledOnce);
        ok(this.onColorSelectedStub.calledWith("#" + newVal));
        ok(this.getInput().ColorPickerHide.notCalled);
    });

    test('When someone submit value in color picker, event is triggered and picker is hidden', function () {
        ok(this.onColorSelectedStub.notCalled);
        ok(this.getInput().ColorPickerHide.notCalled);

        var newVal = 'new val 2';
        this.colorPickerOnSubmit('color', newVal);

        ok(this.onColorSelectedStub.calledOnce);
        ok(this.onColorSelectedStub.calledWith("#" + newVal));
        ok(this.getInput().ColorPickerHide.calledOnce);
    });
});