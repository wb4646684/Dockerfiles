define("jira/project/browse/projects-empty-view",["jira/marionette-4.1","jira/util/formatter"],function(e,t){"use strict";return e.View.extend({tagName:"tr",template:JIRA.Templates.Common.emptySearchTableRow,templateContext:function(){return{extraClasses:"no-project-results",colspan:6,name:t.I18n.getText("jira.auditing.category.projects")}}})});