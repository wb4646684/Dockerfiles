define("jira/project/browse/projectmodel",["jira/backbone-1.3.3","jira/project/browse/projecttypesservice"],function(e,r){"use strict";return e.Model.extend({parse:function(e,t){var o=t.categories;if(o&&e.projectCategoryId){var c=o.get(e.projectCategoryId);c&&(e.projectCategoryName=c.get("name"))}return e.projectTypeIcon=r.getProjectTypeIcon(e.projectTypeKey),e}})});