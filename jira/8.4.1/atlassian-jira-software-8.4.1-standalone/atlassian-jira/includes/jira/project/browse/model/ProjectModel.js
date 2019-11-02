define('jira/project/browse/projectmodel', ['jira/backbone-1.3.3', 'jira/project/browse/projecttypesservice'], function (Backbone, ProjectTypesService) {
    'use strict';

    return Backbone.Model.extend({
        parse: function parse(attributes, options) {
            var categories = options.categories;

            if (categories && attributes.projectCategoryId) {
                var category = categories.get(attributes.projectCategoryId);
                if (category) {
                    attributes.projectCategoryName = category.get('name');
                }
            }
            attributes.projectTypeIcon = ProjectTypesService.getProjectTypeIcon(attributes.projectTypeKey);
            return attributes;
        }
    });
});