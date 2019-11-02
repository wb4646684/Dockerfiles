/**
 * This view is a container (acts as <aui-dropdown-menu>) for filters in
 * collection and their search field and clear button
 */
define('jira/customfields/customfieldsFilterDropdownView', ['atlassian/libs/underscore-1.8.3', 'jira/marionette-4.1', 'jira/util/formatter', 'jira/util/logger', 'jira/customfields/customfieldsFilterCollectionView'], function (_, Marionette, formatter, logger, CustomfieldFilterCollectionView) {
    'use strict';

    return Marionette.View.extend({
        tagName: 'aui-dropdown-menu',
        template: JIRA.Templates.Admin.Customfields.filterDropdownContainer,
        templateContext: function templateContext() {
            var title = '';
            var placeholder = '';
            switch (this.collection.name) {
                case 'projects':
                    title = formatter.I18n.getText('common.filters.allprojects');
                    placeholder = formatter.I18n.getText('common.filters.findprojects');
                    break;
                case 'screens':
                    title = formatter.I18n.getText('common.filters.all.screens');
                    placeholder = formatter.I18n.getText('common.filters.find.screens');
                    break;
                case 'types':
                    title = formatter.I18n.getText('common.filters.all.customfield.types');
                    placeholder = formatter.I18n.getText('common.filters.find.customfield.types');
                    break;
            }
            return {
                title: title,
                placeholder: placeholder,
                isAnySelected: this.options.customfieldCollection.filters[this.collection.id].length > 0
            };
        },

        ui: {
            'searchFilter': '.customfield-filter-text-search-input',
            'clearButton': '.clear-selected',
            'selectedItemsContainer': '.customfield-filter-selected-items-container',
            'unselectedItemsContainer': '.unselected-items-container',
            'heading': '.aui-dropdown2-heading'
        },
        regions: {
            allItems: {
                el: '.unselected-items',
                replaceElement: true
            },
            selectedItems: {
                el: '.selected-items',
                replacement: true
            }
        },
        events: {
            'input @ui.searchFilter': 'onSearchFilterChange',
            'click @ui.clearButton': 'onFilterClear',
            'blur @ui.searchFilter': 'focusField'
        },
        childViewEvents: {
            'filter:changed': 'onChildviewFilterChanged'
        },
        initialize: function initialize() {
            this.filtersCollectionView = new CustomfieldFilterCollectionView({
                collection: this.collection,
                customfieldCollection: this.options.customfieldCollection
            });
            this.selectedFiltersCollectionView = new CustomfieldFilterCollectionView({
                collection: this.collection,
                customfieldCollection: this.options.customfieldCollection
            });
            // showChildView does not render automatically because aui-dropdown-menu injects content in the element tricking marionette into thinking view is already rendered
            this.render();
        },
        onRender: function onRender() {
            this.showChildView('allItems', this.filtersCollectionView);
            this.showChildView('selectedItems', this.selectedFiltersCollectionView);
        },

        onChildviewFilterChanged: function onChildviewFilterChanged(childView) {
            this.triggerMethod('filter:changed', childView);
            this.focusField();
        },
        onSearchFilterChange: _.debounce(function (event) {
            event.preventDefault();
            var searchString = event.currentTarget.value;
            if (searchString.length > 0) {
                this.filtersCollectionView.setFilter(false);
                this.selectedFiltersCollectionView.setFilter(function (child) {
                    return child.model.get('name').search(new RegExp(event.currentTarget.value, 'i')) >= 0;
                }, { preventRender: true });
                this.filtersCollectionView.render();
                this.selectedFiltersCollectionView.render();
                this.getUI('clearButton').hide();
                this.getUI('selectedItemsContainer').toggleClass('aui-dropdown2-section', false).show();
                this.getUI('unselectedItemsContainer').hide();
            } else {
                this.reorderItems();
                this.focusField();
            }
            logger.trace("cf.filter.search.change");
        }, 300),
        onFilterClear: function onFilterClear() {
            this.getOption('customfieldCollection').filters[this.collection.id].length = 0;
            this.reorderItems();
            this.triggerMethod('filter:cleared', this.collection);
            this.focusField();
        },
        startLoading: function startLoading() {
            this.getUI('searchFilter').hide();
            this.getUI('heading').hide();
            this.getUI('unselectedItemsContainer').hide();
            this.getUI('selectedItemsContainer').hide();
            this.$el.spin('medium');
        },
        stopLoading: function stopLoading() {
            this.fetched = true;
            this.getUI('searchFilter').show();
            this.getUI('heading').show();
            this.getUI('unselectedItemsContainer').show();
            this.getUI('selectedItemsContainer').show();
            this.$el.spinStop();
        },
        reorderItems: function reorderItems() {
            var _this = this;

            if (!this.fetched) {
                this.startLoading();
                this.fetchProgress = this.fetchProgress || this.collection.fetch().then(function () {
                    _this.stopLoading();
                    _this.splitColumns();
                });
            } else {
                this.splitColumns();
            }
        },
        splitColumns: function splitColumns() {
            var selectedItems = this.getOption('customfieldCollection').filters[this.collection.id];
            var isEmptyFilter = !selectedItems.length;
            this.getUI('searchFilter').val('');
            this.getUI('unselectedItemsContainer').show();

            this.filtersCollectionView.setFilter(function (child) {
                return !_.contains(selectedItems, child.model.get('id').toString());
            }, { preventRender: true });
            this.selectedFiltersCollectionView.setFilter(function (child) {
                return _.contains(selectedItems, child.model.get('id').toString());
            }, { preventRender: true });
            this.filtersCollectionView.render();
            this.selectedFiltersCollectionView.render();

            if (isEmptyFilter) {
                this.getUI('clearButton').hide();
                this.getUI('selectedItemsContainer').toggleClass('aui-dropdown2-section', false).hide();
            } else {
                this.getUI('clearButton').show();
                this.getUI('selectedItemsContainer').toggleClass('aui-dropdown2-section', true).show();
            }
        },
        focusField: function focusField() {
            var _this2 = this;

            // To prevent loosing focus we should wait until blur action is done.
            // Also on triggering dropdown open it is shown after event firing,
            // not before. That's why timeout added
            return setTimeout(function () {
                return _this2.getUI('searchFilter').focus();
            }, 0);
        }
    });
});