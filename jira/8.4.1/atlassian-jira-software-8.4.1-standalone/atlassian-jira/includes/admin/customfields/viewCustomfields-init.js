/**
 * Bootstraps the JavaScript components for view custom fields page
 */
require(['jquery', 'jira/util/data/meta', 'jira/customfields/customfieldsView'], function ($, meta, CustomfieldsPageView) {
    'use strict';

    $(function () {
        if (meta.get('is-custom-field-types-exist')) {
            new CustomfieldsPageView({ el: '#customfields-container' });
        }
    });
});