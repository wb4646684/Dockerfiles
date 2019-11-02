define("jira/ajs/dropdown/dropdown-list-item",["jira/ajs/layer/layer-constants","jira/ajs/control","jira/ajs/input/mouse","underscore","jquery","jira/util/top-same-origin-window"],function(t,e,i,s,n,o){var a=o(window),r=e.extend({CLASS_SIGNATURE:"AJS_DROPDOWN_LISTITEM",init:function(t){this._setOptions(t),this.$element=n(this.options.element),this.$element.find("a").attr({role:"menuitem",tabindex:-1}),this.hasFocus=!1,this._ensureIdOf(this.$element),this._assignEvents("instance",this),this._assignEvents("element",this.$element)},_getDefaultOptions:function(){return{element:null,autoScroll:!0,focusClass:t.ACTIVE_CLASS}},_ensureIdOf:function(t){var e=t.attr("id");return s.isEmpty(e)&&(e=t.attr("id",s.uniqueId(this.CLASS_SIGNATURE+"__"))),e},_events:{instance:{focus:function(t){this.hasFocus=!0,this.$element.addClass(this.options.focusClass),t.noscrolling||(r.MOTION_DETECTOR.unbind(),this.isWaitingForMove=!0,this.options.autoScroll&&this.$element.scrollIntoView(r.SCROLL_INTO_VIEW_OPTIONS))},blur:function(){this.hasFocus=!1,this.$element.removeClass(this.options.focusClass)},accept:function(){var t=new n.Event("click"),e=this.$element.is("a[href]")?this.$element:this.$element.find("a[href]");e.trigger(t),t.isDefaultPrevented()||(a.location=e.attr("href"))}},element:{mousemove:function(){(this.isWaitingForMove&&r.MOTION_DETECTOR.moved&&!this.hasFocus||!this.hasFocus)&&(this.isWaitingForMove=!1,this.trigger({type:"focus",noscrolling:!0}))}}}});return r.MOTION_DETECTOR=new i.MotionDetector,r.SCROLL_INTO_VIEW_OPTIONS={duration:100,callback:function(){r.MOTION_DETECTOR.wait()}},r}),AJS.namespace("AJS.Dropdown.ListItem",null,require("jira/ajs/dropdown/dropdown-list-item"));