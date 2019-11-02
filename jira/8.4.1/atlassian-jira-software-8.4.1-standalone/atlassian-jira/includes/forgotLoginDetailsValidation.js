require(['jira/util/init-on-dcl', 'jira/util/formatter'], function (initOnDCL, formatter) {
    'use strict';

    initOnDCL(function () {
        var forgotLoginForm = document.querySelector('#forgot-login');
        forgotLoginForm.addEventListener('submit', onFormSubmit);

        function onFormSubmit(event) {
            var visibleFieldGroup = forgotLoginForm.querySelector('.field-group:not(.hidden)');
            if (!visibleFieldGroup) {
                return;
            }

            var visibleInput = visibleFieldGroup.querySelector('input');
            if (!visibleInput) {
                return;
            }

            event.preventDefault();
            var visibleErrorElement = visibleFieldGroup.querySelector('.error');

            if (visibleInput.value === '') {
                if (!visibleErrorElement) {
                    var visibleInputName = visibleInput.getAttribute('name');
                    var errorElement = '<div class="error">' + getErrorMessage(visibleInputName) + '</div>';
                    visibleFieldGroup.insertAdjacentHTML('beforeend', errorElement);
                }
            } else {
                if (visibleErrorElement) {
                    visibleFieldGroup.removeChild(visibleErrorElement);
                }

                forgotLoginForm.submit();
            }

            function getErrorMessage(visibleInputName) {
                switch (visibleInputName) {
                    case 'username':
                        return formatter.I18n.getText('forgotlogindetails.error.username.required');
                    case 'email':
                        return formatter.I18n.getText('forgotlogindetails.error.email.required');
                    default:
                        return formatter.I18n.getText('forgotlogindetails.error.default');
                }
            }
        }
    });
});