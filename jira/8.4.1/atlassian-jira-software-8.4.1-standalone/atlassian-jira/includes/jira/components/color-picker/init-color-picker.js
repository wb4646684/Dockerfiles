require(['jira/skate', 'jquery', 'jira/components/color-picker/color-picker-controller'], function (skate, $, ColorPickerController) {
    "use strict";

    return skate('jira-color-picker', {
        type: skate.type.ELEMENT,

        template: function template(element) {
            var $el = $(element);
            var options = this.getOptions(element);

            var controller = new ColorPickerController(options);
            controller.renderIntoElement($el);
        },
        getOptions: function getOptions(element) {
            var options = {};

            function setOptionIfExists(attributeName, optionName) {
                if (element.hasAttribute(attributeName)) {
                    options[optionName] = element.getAttribute(attributeName);
                }
            }

            setOptionIfExists('data-id', 'id');
            setOptionIfExists('data-name', 'name');
            setOptionIfExists('data-value', 'value');
            setOptionIfExists('data-error-message', 'errorMessage');

            return options;
        }
    });
});