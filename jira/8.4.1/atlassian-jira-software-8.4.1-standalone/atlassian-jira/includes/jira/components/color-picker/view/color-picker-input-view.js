/* eslint-disable new-cap */

define('jira/components/color-picker/view/color-picker-input-view', ['jira/marionette-3.1', 'jira/util/key-code', 'underscore'], function (Marionette, keyCode, _) {
    "use strict";

    return Marionette.View.extend({
        template: JIRA.Templates.Components.ColorPicker.colorPickerInput,
        className: 'color-picker-wrapper',

        ui: {
            input: 'input',
            colorPreview: '.color-preview'
        },

        events: {
            'keyup @ui.input': 'onInputKeyup',
            'keydown @ui.input': 'onInputKeydown',
            'focus @ui.input': 'openPicker',
            'click @ui.input': 'openPicker',
            'click @ui.colorPreview': 'onColorPreviewClick'
        },

        modelEvents: {
            'change:color': 'onColorChange',
            'change:colorDefined': 'onColorDefinedChange'
        },

        onInputKeyup: function onInputKeyup() {
            this._triggerColorChange(this.getUI('input').val());
        },
        onInputKeydown: function onInputKeydown(e) {
            if (_.contains([keyCode.TAB, keyCode.ENTER, keyCode.ESCAPE], e.keyCode)) {
                this.getColorPickerHandler().ColorPickerHide();
            }
        },
        onColorPreviewClick: function onColorPreviewClick(e) {
            e.preventDefault();
            this.getUI('input').focus();
        },
        openPicker: function openPicker() {
            this.getColorPickerHandler().ColorPickerShow();
        },
        onInputBlur: function onInputBlur() {
            this.getColorPickerHandler().ColorPickerHide();
        },
        onColorChange: function onColorChange(model, color) {
            this.getUI('input').val(color);
            this.getUI('colorPreview').css('backgroundColor', color);

            if (color) {
                this.getColorPickerHandler().ColorPickerSetColor(color);
            }
        },
        onColorDefinedChange: function onColorDefinedChange(model, colorDefined) {
            if (colorDefined) {
                this.getUI('colorPreview').show();
            } else {
                this.getUI('colorPreview').hide();
            }
        },
        getColorPickerHandler: function getColorPickerHandler() {
            return this.getUI('input');
        },
        _triggerColorChange: function _triggerColorChange(color) {
            this.triggerMethod('color:selected', color);
        },
        _setUpColorPicker: function _setUpColorPicker() {
            var _this = this;

            this.getColorPickerHandler().ColorPicker({
                onSubmit: function onSubmit(hsb, hex) {
                    _this._triggerColorChange('#' + hex);
                    _this.getColorPickerHandler().ColorPickerHide();
                },
                onChange: function onChange(hsb, hex) {
                    _this._triggerColorChange('#' + hex);
                },
                onBeforeShow: function onBeforeShow() {
                    if (_this.model.get('colorDefined')) {
                        _this.getColorPickerHandler().ColorPickerSetColor(_this.model.get('color'));
                    }
                }
            });
        },
        onRender: function onRender() {
            if (!this.model.get('colorDefined')) {
                this.getUI('colorPreview').hide();
            }

            this._setUpColorPicker();
        }
    });
});