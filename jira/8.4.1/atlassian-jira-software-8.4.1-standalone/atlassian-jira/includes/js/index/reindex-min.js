require(["jquery","jira/util/init-on-dcl","jira/util/urls"],function(t,i,n){"use strict";function e(i){var e=t("#start-reindex"),r="atl_token="+n.atl_token(),a="indexingStrategy="+i.attr("value");e.attr("href",i.attr("boundAction")+"?"+r+"&"+a),"true"===i.attr("continueInDialog")?e.addClass("trigger-dialog"):e.removeClass("trigger-dialog")}i(function(){t("input[type=radio][name=indexingStrategy]").on("change",function(){e(t(this))}),e(t("input[type=radio][checked]"))})});