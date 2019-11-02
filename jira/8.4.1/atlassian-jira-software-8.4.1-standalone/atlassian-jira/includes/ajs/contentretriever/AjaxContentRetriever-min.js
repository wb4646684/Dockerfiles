define("jira/ajs/contentretriever/ajax-content-retriever",["jira/ajs/contentretriever/content-retriever","jira/ajs/ajax/smart-ajax","jquery"],function(t,e,i){return t.extend({init:function(t){this.ajaxOptions=t,this.ajaxOptions.requestDelay||0===this.ajaxOptions.requestDelay||(this.ajaxOptions.requestDelay=75)},getAjaxOptions:function(){var t,e=this;return t="string"==typeof this.ajaxOptions?{url:this.ajaxOptions}:i.isFunction(this.ajaxOptions)?this.ajaxOptions():this.ajaxOptions,t.globalThrobber=!1,t.success=function(t,i,s){e._requestComplete(s,i,t,!0,null)},t.error=function(t,i){t.rc&&(t.status=t.rc),e._requestComplete(t,i,null,!1,null)},t},content:function(t){return i.isFunction(t)?(this.callback=t,this._makeRequest(t)):t&&this.callback&&(this.callback(t),delete this.callback),this.$content},startingRequest:function(t){t?this.startingCallback=t:this.startingCallback&&(this.locked=!0,this.startingCallback())},finishedRequest:function(t){t?this.finishedCallback=t:this.finishedCallback&&(this.locked=!1,this.finishedCallback())},failedRequest:function(t){t?this.failedCallback=t:this.failedCallback&&(this.locked=!1,this.failedCallback())},cache:function(t){return void 0!==t&&(this.getAjaxOptions().cache=t),this.getAjaxOptions().cache},isLocked:function(){return this.locked},_requestComplete:function(t,s,a,n,r){if("abort"===s)return void(this.locked=!1);var o,u,c=this.getAjaxOptions();if(e.SmartAjaxResult&&(u=e.SmartAjaxResult.apply(window,arguments)),n)o=i.isFunction(c.formatSuccess)?c.formatSuccess(a):i("<div>"+a+"</div>");else{if(i.isFunction(c.formatError))o=c.formatError(a);else if(u){var l=401===u.status?"aui-message-warning":"aui-message-error";o=i('<div class="aui-message '+l+'">'+e.buildSimpleErrorContent(u)+"</div>")}this.failedRequest()}this.content(o),this.finishedRequest()},_makeRequest:function(){var t=this;this.getAjaxOptions();this.outstandingRequest&&(this.outstandingRequest.abort(),this.outstandingRequest=null),clearTimeout(this._queuedRequest),this.isLocked()?this._queuedRequest=setTimeout(function(){t._makeRequest()},this.ajaxOptions.requestDelay):function(){t.startingRequest(),t.outstandingRequest=i.ajax(t.getAjaxOptions())}()}})}),AJS.namespace("AJS.AjaxContentRetriever",null,require("jira/ajs/contentretriever/ajax-content-retriever"));