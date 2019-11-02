define('jira/project/browse/projectview', ['jquery', 'jira/marionette-4.1', 'jira/util/data/meta', 'jira/moment', 'wrm/context-path', 'aui/flag', 'jira/ajs/ajax/ajax-util', 'jira/dialog/form-dialog'], function ($, Marionette, meta, moment, contextPath, flag, ajaxUtil, FormDialog) {
    'use strict';

    return Marionette.View.extend({
        template: JIRA.Templates.Project.Browse.projectRow,
        templateContext: function templateContext() {
            var data = {
                isAdminMode: meta.get('in-admin-mode'),
                archivingEnabled: meta.get('archiving-enabled')
            };

            var archivedTimestamp = this.model.get('archivedTimestamp');
            if (archivedTimestamp) {
                data.archivedDate = moment(archivedTimestamp).format("Do MMM YYYY");
            }
            var lastUpdatedTimestamp = this.model.get('lastUpdatedTimestamp');
            if (lastUpdatedTimestamp) {
                data.lastUpdatedDate = moment(lastUpdatedTimestamp).format("Do MMM YYYY");
            }

            return data;
        },

        ui: {
            'name': 'td.cell-type-name a',
            'leadUser': 'td.cell-type-user a',
            'category': 'td.cell-type-category a',
            'url': 'td.cell-type-url a',
            'archive': '.aui-list-truncate li a.archive-project',
            'restore': '.aui-list-truncate li a.restore-project'
        },
        triggers: {
            'click @ui.name': {
                event: 'project-view.click-project-name',
                preventDefault: false
            },
            'click @ui.leadUser': {
                event: 'project-view.click-lead-user',
                preventDefault: false
            },
            'click @ui.category': {
                event: 'project-view.click-category'
            },
            'click @ui.url': {
                event: 'project-view.click-url',
                preventDefault: false
            }
        },
        onRender: function onRender() {
            this.unwrapTemplate();
            // AUI takes the element outside of the view element hence the direct handler
            this.ui.archive.on("click", this.archiveProject.bind(this));
            this.ui.restore.on("click", this.restoreProject.bind(this));
        },
        archiveProject: function archiveProject(event) {
            var _this = this;

            event.preventDefault();
            var dialog = new FormDialog({
                id: event.target.id + '-dialog',
                refreshOnSubmit: false,
                ajaxOptions: {
                    url: event.target.href,
                    data: {
                        decorator: "dialog",
                        inline: true
                    }
                },
                onSuccessfulSubmit: function onSuccessfulSubmit() {
                    // little work around to remove model from collection without sending a request/accessing collection from model
                    _this.model.trigger('destroy', _this.model);
                }
            });
            dialog.show();
        },
        restoreProject: function restoreProject(event) {
            var _this2 = this;

            event.preventDefault();
            var projectKey = this.model.get('key');
            $.ajax({
                url: contextPath() + ('/rest/api/2/project/' + projectKey + '/restore'),
                type: 'PUT',
                dataType: 'text'
            }).success(function () {
                // little work around to remove model from collection without sending a request/accessing collection from model
                _this2.model.trigger('destroy', _this2.model);
                flag({
                    type: 'success',
                    close: 'manual',
                    body: JIRA.Templates.Project.Browse.restoreSuccessFlag({
                        projectKey: projectKey
                    })
                });
            }).error(function (xhr) {
                var errorMessage = ajaxUtil.getErrorMessageFromXHR(xhr);
                flag({
                    type: 'error',
                    close: 'manual',
                    body: errorMessage
                });
            });
        }
    });
});