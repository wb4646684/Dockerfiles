define("jira/field/init-favourite-pickers",["jira/field/favourite-picker","jira/util/events/reasons","jira/util/events/types","jira/util/events"],function(i,e,t,n){n.bind(t.NEW_CONTENT_ADDED,function(t,n,a){a===e.pageLoad&&i.init(n)})});