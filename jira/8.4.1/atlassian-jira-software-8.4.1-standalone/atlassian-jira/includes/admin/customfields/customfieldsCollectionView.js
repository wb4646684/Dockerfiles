/**
 * This view is a container (acts as <table>) for a customfieldRow views (<tr>) per custom field in collection
 */
define('jira/customfields/customfieldCollectionView', ['jira/marionette-4.1', 'jira/util/data/meta', 'jira/util/formatter', 'jira/customfields/customfieldRowView'], function (Marionette, meta, formatter, CustomfieldRowView) {
    'use strict';

    return Marionette.CollectionView.extend({
        tagName: 'table',
        id: 'custom-fields-table',
        className: 'aui',
        template: JIRA.Templates.Admin.Customfields.customfieldsTableContent,
        childView: CustomfieldRowView,
        childViewContainer: 'tbody',
        childViewOptions: function childViewOptions() {
            return { isMultiLingual: meta.get('is-multilingual') };
        },

        emptyView: Marionette.View.extend({
            tagName: 'tr',
            template: function template(data) {
                data.extraClasses = 'no-project-results';
                data.colspan = 5;
                data.name = formatter.I18n.getText('admin.issuefields.customfields.no.results.name');
                return JIRA.Templates.Common.emptySearchTableRow(data);
            }
        })
    });
});