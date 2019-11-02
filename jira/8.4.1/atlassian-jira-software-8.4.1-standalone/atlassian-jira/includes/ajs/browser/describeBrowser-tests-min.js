AJS.test.require(["jira.webresources:util-lite"],function(){var s,e,t=require("jquery"),r=t("html");module("describeBrowser",{setup:function(){this.sandbox=sinon.sandbox.create(),s=require("jira/util/navigator"),e=require("jira/ajs/browser/describe-browser"),this.sandbox.stub(s,"isIE").returns(!1),this.sandbox.stub(s,"isEdge").returns(!1),this.sandbox.stub(s,"isMozilla").returns(!1),this.sandbox.stub(s,"isSafari").returns(!1),this.sandbox.stub(s,"isChrome").returns(!1),this.sandbox.stub(s,"isWebkit").returns(!1),this.sandbox.stub(s,"majorVersion"),this.sandbox.stub(s,"isOpera").returns(!1)},teardown:function(){this.sandbox.restore()},assertIEVersionClasses:function(s){ok(r.hasClass("msie"),"has class 'msie'");for(var e=6;e<s;e++)ok(!r.hasClass("msie-"+e),"no class 'msie-"+e+"'");ok(r.hasClass("msie-"+s),"has class 'msie-"+s+"'")},assertIEGreaterThanClasses:function(s){for(var e=6;e<s;e++)ok(r.hasClass("msie-gt-"+e),"has class 'msie-gt-"+e+"'");ok(!r.hasClass("msie-gt-5"),"no class 'msie-gt-5'"),ok(!r.hasClass("msie-gt-"+s),"no class 'msie-gt-"+s+"'")}}),QUnit.testStart=function(){r.removeAttr("class")},test("Edge",function(){s.isIE.returns(!0),s.isEdge.returns(!0),s.majorVersion.returns(12),e(),this.assertIEVersionClasses(12),this.assertIEGreaterThanClasses(12),ok(!r.hasClass("mozilla"),"ie11 or greater not reported as mozilla"),ok(r.hasClass("edge"),"has class edge")}),test("Internet Explorer 12",function(){s.isIE.returns(!0),s.majorVersion.returns(12),e(),this.assertIEVersionClasses(12),this.assertIEGreaterThanClasses(12),ok(!r.hasClass("mozilla"),"ie11 or greater not reported as mozilla")}),test("Internet Explorer 11",function(){s.isIE.returns(!0),s.majorVersion.returns(11),e(),this.assertIEVersionClasses(11),this.assertIEGreaterThanClasses(11),ok(!r.hasClass("mozilla"),"ie11 or greater not reported as mozilla")}),test("Internet Explorer 10",function(){s.isIE.returns(!0),s.majorVersion.returns(10),e(),this.assertIEVersionClasses(10),this.assertIEGreaterThanClasses(10)}),test("Internet Explorer 9",function(){s.isIE.returns(!0),s.majorVersion.returns(9),e(),this.assertIEVersionClasses(9),this.assertIEGreaterThanClasses(9)}),test("Internet Explorer 8",function(){s.isIE.returns(!0),s.majorVersion.returns(8),e(),this.assertIEVersionClasses(8),this.assertIEGreaterThanClasses(8)}),test("Firefox",function(){s.isMozilla.returns(!0),e(),ok(r.hasClass("mozilla")),ok(!/-gt-/gi.test(r.attr("class")),"Expected no version greater than classes expected (IE only)")}),test("Safari",function(){s.isSafari.returns(!0),s.isWebkit.returns(!0),e(),equal(r.hasClass("webkit"),!0),equal(r.hasClass("safari"),!0),equal(r.hasClass("chrome"),!1),ok(!/-gt-/gi.test(r.attr("class")),"Expected no version greater than classes expected (IE only)")}),test("Chrome",function(){s.isChrome.returns(!0),s.isWebkit.returns(!0),e(),equal(r.hasClass("webkit"),!0),equal(r.hasClass("safari"),!1),equal(r.hasClass("chrome"),!0),ok(!/-gt-/gi.test(r.attr("class")),"Expected no version greater than classes expected (IE only)")}),test("Opera",function(){s.isOpera.returns(!0),e(),ok(r.hasClass("opera")),ok(!/-gt-/gi.test(r.attr("class")),"Expected no version greater than classes expected (IE only)")}),test("No browsers detected",function(){this.sandbox.restore(),e(),ok(/opera|webkit|mozilla|msie/gi.test(r.attr("class")),"Expected to fall back to running browser string if not supplied")})});