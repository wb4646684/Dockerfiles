define("jira/customfields/customfieldsView",["jquery","jira/marionette-4.1","jira/message","jira/dialog/error-dialog","jira/customfields/customfieldsCollection","jira/customfields/customfieldCollectionView","jira/customfields/customfieldsPaginationView","jira/customfields/customfieldsFilterView"],function(i,e,t,s,o,n,a,r){"use strict";return e.View.extend({template:JIRA.Templates.Admin.Customfields.customfieldsPageContent,getTemplate:function(){return this.collection.length?this.template:JIRA.Templates.Admin.Customfields.customfieldsEmptyPageContent},ui:{table:"#custom-fields-table",filters:"#custom-fields-filter",pagination:"#pagination-container"},regions:{customfields:{el:"@ui.table",replaceElement:!0},filters:{el:"@ui.filters"},pagination:"@ui.pagination"},childViewEvents:{"navigate:start":"displayLoadingIndicator","navigate:end":"hideLoadingIndicator","navigate:error":"handleErrorResponse","search:start":"displayLoadingIndicator","search:end":"hideLoadingIndicator"},initialize:function(){this.collection=new o,this.fetchData().done(this.render.bind(this)).fail(this.handleErrorResponse.bind(this))},onRender:function(){this.collection.length&&(this.showChildView("customfields",new n({collection:this.collection})),this.showChildView("filters",new r({collection:this.collection})),this.showChildView("pagination",new a({collection:this.collection})),this.initTooltips())},fetchData:function(){return this.displayLoadingIndicator(),this.collection.getFirstPage().done(this.hideLoadingIndicator.bind(this))},displayLoadingIndicator:function(){this.$el.addClass("active").spin("large")},hideLoadingIndicator:function(){this.$el.removeClass("active").spinStop(),this.initTooltips()},initTooltips:function(){this.$("tr td:first-child strong").tipsy(),this.$("tr td:first-child div.description").tipsy({html:!0})},handleErrorResponse:function(i){var e=i.status,t=i.responseText,s=this._parseResponse(t),o=JIRA.Templates.Admin.Customfields.applicationAccessError({messages:s,status:e});switch(e){case 401:case 403:var n=JIRA.Templates.Admin.Customfields.applicationAccessErrorHeading({status:e});this._showErrorDialogue(o,n);break;default:this._showErrorMessage(o)}},_parseResponse:function(i){try{var e=JSON.parse(i),t=e.errorMessages,s=e.message;if(t)return t;if(s)return[s]}catch(i){return null}},_showErrorMessage:function(i){t.showErrorMsg(i,{closeable:!0})},_showErrorDialogue:function(i,e){return new s({heading:e,message:i,mode:"warning"}).show()}})});