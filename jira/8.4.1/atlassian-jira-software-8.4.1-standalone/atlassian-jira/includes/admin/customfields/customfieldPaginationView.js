define('jira/customfields/customfieldsPaginationView', ['jira/pagination/paginationview'], function (PaginationView) {
    'use strict';

    return PaginationView.extend({
        // overriding since I don't want to unwrap
        onRender: function onRender() {
            //this.unwrapTemplate();
        }
    });
});