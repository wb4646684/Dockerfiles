/**
 * This view is a container (acts as <ul>) for a customfieldFilterItem views (<li>) per filter in collection
 */
define('jira/customfields/customfieldsFilterCollectionView', ['jira/marionette-4.1', 'jira/customfields/customfieldsFilterItemView', 'jira/customfields/customfieldsFilterEmptyView'], function (Marionette, CustomfieldFilterItemView, CustomfieldFilterEmptyView) {
	'use strict';

	return Marionette.CollectionView.extend({
		tagName: 'ul',
		childViewTriggers: {
			'item:clicked': 'filter:changed'
		},
		childView: CustomfieldFilterItemView,
		childViewOptions: function childViewOptions() {
			return {
				filterState: this.options.customfieldCollection.filters[this.collection.id]
			};
		},

		emptyView: CustomfieldFilterEmptyView
	});
});