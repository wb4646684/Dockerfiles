/**
 * This view renders the custom field filters
 */
define('jira/customfields/customfieldsFilterView', ['atlassian/libs/underscore-1.8.3', 'jira/marionette-4.1', 'jira/util/formatter', 'jira/customfields/customfieldsFilterDropdownView', 'jira/customfields/customfieldsFilterProjectCollection', 'jira/customfields/customfieldsFilterTypesCollection', 'jira/customfields/customfieldsFilterScreensCollection'], function (_, Marionette, formatter, CustomfieldsFilterDropdownView, CustomfieldsFilterProject, CustomfieldsFilterTypes, CustomfieldsFilterScreens) {
    'use strict';

    return Marionette.View.extend({
        template: JIRA.Templates.Admin.Customfields.filterContainer,
        ui: {
            searchInput: '#custom-fields-filter-text',
            projectsTrigger: '#projects-dropdown-trigger',
            typesTrigger: '#types-dropdown-trigger',
            screensTrigger: '#screens-dropdown-trigger',
            projectsDropdown: '#projects-filter-dropdown',
            typesDropdown: '#types-filter-dropdown',
            screensDropdown: '#screens-filter-dropdown',
            container: '.customfield-filter-items'
        },
        regions: {
            screens: {
                el: '#screens-filter-dropdown',
                replaceElement: true
            },
            types: {
                el: '#types-filter-dropdown',
                replaceElement: true
            },
            projects: {
                el: '#projects-filter-dropdown',
                replaceElement: true
            }
        },
        events: {
            'input @ui.searchInput': 'performTextSearch',
            'aui-dropdown2-show @ui.projectsDropdown': function auiDropdown2ShowUiProjectsDropdown() {
                this.projectsDropdownView.reorderItems();
                this.projectsDropdownView.focusField();
            },
            'aui-dropdown2-show @ui.typesDropdown': function auiDropdown2ShowUiTypesDropdown() {
                this.typesDropdownView.reorderItems();
                this.typesDropdownView.focusField();
            },
            'aui-dropdown2-show @ui.screensDropdown': function auiDropdown2ShowUiScreensDropdown() {
                this.screensDropdownView.reorderItems();
                this.screensDropdownView.focusField();
            }
        },
        childViewEvents: {
            'filter:changed': 'onChildviewFilterChanged',
            'filter:cleared': 'onChildviewFilterCleared'
        },
        initialize: function initialize() {
            this.projectFilterCollection = new CustomfieldsFilterProject();
            this.typesFilterCollection = new CustomfieldsFilterTypes();
            this.screensFilterCollection = new CustomfieldsFilterScreens();

            this.projectsDropdownView = new CustomfieldsFilterDropdownView({
                collection: this.projectFilterCollection,
                id: 'projects-filter-dropdown',
                customfieldCollection: this.collection
            });
            this.typesDropdownView = new CustomfieldsFilterDropdownView({
                collection: this.typesFilterCollection,
                id: 'types-filter-dropdown',
                customfieldCollection: this.collection
            });
            this.screensDropdownView = new CustomfieldsFilterDropdownView({
                collection: this.screensFilterCollection,
                id: 'screens-filter-dropdown',
                customfieldCollection: this.collection
            });
        },

        onRender: function onRender() {
            this.unwrapTemplate();

            this.showChildView('projects', this.projectsDropdownView);
            this.showChildView('types', this.typesDropdownView);
            this.showChildView('screens', this.screensDropdownView);

            this.setButtonsText(this.projectFilterCollection);
            this.setButtonsText(this.screensFilterCollection);
            this.setButtonsText(this.typesFilterCollection);
        },
        onChildviewFilterChanged: function onChildviewFilterChanged(childView) {
            var filterCollection = childView.model.collection;
            var filterId = filterCollection.id;

            var item = childView.getUI('filter');
            var filterValue = item.val();
            var checked = item.prop('checked');

            var filter = this.collection.filters[filterId];

            if (checked && !_.contains(filter, filterValue)) {
                filter.push(filterValue);
            } else if (!checked && _.contains(filter, filterValue)) {
                filter.splice(filter.indexOf(filterValue), 1);
            }
            this.setButtonsText(filterCollection);
            this.performSearch();
        },
        onChildviewFilterCleared: function onChildviewFilterCleared(collection) {
            this.setButtonsText(collection);
            this.performSearch();
        },
        performSearch: function performSearch() {
            var _this = this;

            // show loading indicator //
            this.triggerMethod('search:start');
            this.collection.getFirstPage({ reset: true }).always(function () {
                // hide loading indicator
                _this.triggerMethod('search:end');
            }).fail(function (error) {
                return _this.triggerMethod('navigate:error', error);
            });
        },
        performTextSearch: _.debounce(function () {
            var _this2 = this;

            var input = this.getUI('searchInput');
            var searchTerm = input.val();

            // Because of IE11 triggers 'input' event on focus if input field has a placeholder,
            // let it be an additional check to prevent search loop
            if (searchTerm === this.currentInputValue) {
                return;
            }
            // show loading indicator //
            this.triggerMethod('search:start');
            // prevent user from input while loading
            input.blur();
            this.currentInputValue = searchTerm;
            this.collection.searchTerm = searchTerm;
            this.collection.getFirstPage({ reset: true }).always(function () {
                input.focus();
                // hide loading indicator
                _this2.triggerMethod('search:end');
            }).fail(function (error) {
                return _this2.triggerMethod('navigate:error', error);
            });
        }, 500),
        // for capability with IE11
        currentInputValue: '',
        setButtonsText: function setButtonsText(filterCollection) {
            var filterId = filterCollection.id,
                name = filterCollection.name;

            var button = this.getUI(name + 'Trigger');
            var filterValues = this.collection.filters[filterId] || [];
            var filterText = this._getAppliedFilterNames(name, filterValues);

            button.text(filterText);
        },
        _getDefaultButtonText: function _getDefaultButtonText(filterName) {
            var filterTitle = void 0;
            switch (filterName) {
                case 'projects':
                    filterTitle = formatter.I18n.getText('common.words.project');
                    break;
                case 'screens':
                    filterTitle = formatter.I18n.getText('admin.common.words.screen');
                    break;
                case 'types':
                    filterTitle = formatter.I18n.getText('admin.common.words.type');
                    break;
            }
            return filterTitle + ': ' + formatter.I18n.getText('common.words.all');
        },
        _getAppliedFilterNames: function _getAppliedFilterNames(filterName, filterValues) {
            if (!filterValues || !filterValues.length) {
                return this._getDefaultButtonText(filterName);
            }
            var filterCollection = void 0;

            switch (filterName) {
                case 'projects':
                    filterCollection = this.projectFilterCollection;
                    break;
                case 'screens':
                    filterCollection = this.screensFilterCollection;
                    break;
                case 'types':
                    filterCollection = this.typesFilterCollection;
                    break;
            }

            var names = filterCollection.reduce(function (accumulator, model) {
                if (_.contains(filterValues, model.id.toString()) && model.get('name').length > 0) {
                    accumulator.push(model.get('name'));
                }
                return accumulator;
            }, []);
            return names.join(', ');
        }
    });
});