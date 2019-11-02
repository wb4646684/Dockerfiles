require(['jquery', 'jira/issue/configureissuefieldscheme'], function ($, ConfigureIssueFieldSchemeView) {
    'use strict';

    $(function () {
        new ConfigureIssueFieldSchemeView({
            el: '#configure-priority-scheme-form',
            ui: {
                defaultOptionSelect: '#default-priority-select',
                addAllButton: '#addAllAvailablePriorities',
                removeAllButton: '#removeAllSelectedPriorities',
                selectedOptions: '#selectedPriorities',
                availableOptions: '#availablePriorities'
            },
            optionsKey: 'selectedPriorities'
        });
    });
});