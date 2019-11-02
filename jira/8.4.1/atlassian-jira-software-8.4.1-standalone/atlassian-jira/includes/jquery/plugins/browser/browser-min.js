var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};/*! THIS FILE HAS BEEN MODIFIED BY ATLASSIAN. Modified lines are marked below, search "ATLASSIAN" */
/*!
 * jQuery Browser Plugin 0.1.0
 * https://github.com/gabceb/jquery-browser-plugin
 *
 * Original jquery-browser code Copyright 2005, 2015 jQuery Foundation, Inc. and other contributors
 * http://jquery.org/license
 *
 * Modifications Copyright 2015 Gabriel Cebrian
 * https://github.com/gabceb
 *
 * Released under the MIT license
 *
 * Date: 05-07-2015
 */
!function(e){"function"==typeof define&&define.amd?define(["jquery"],function(r){return e(r)}):"object"===("undefined"==typeof module?"undefined":_typeof(module))&&"object"===_typeof(module.exports)?module.exports=e(require("jquery")):e(window.jQuery)}(function(e){"use strict";function r(e){void 0===e&&(e=window.navigator.userAgent),e=e.toLowerCase();var r=/(edge)\/([\w.]+)/.exec(e)||/(opr)[\/]([\w.]+)/.exec(e)||/(chrome)[ \/]([\w.]+)/.exec(e)||/(iemobile)[\/]([\w.]+)/.exec(e)||/(version)(applewebkit)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(e)||/(webkit)[ \/]([\w.]+).*(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(e)||/(webkit)[ \/]([\w.]+)/.exec(e)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e)||/(msie) ([\w.]+)/.exec(e)||e.indexOf("trident")>=0&&/(rv)(?::| )([\w.]+)/.exec(e)||e.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e)||[],o=/(ipad)/.exec(e)||/(ipod)/.exec(e)||/(windows phone)/.exec(e)||/(iphone)/.exec(e)||/(kindle)/.exec(e)||/(silk)/.exec(e)||/(android)/.exec(e)||/(win)/.exec(e)||/(mac)/.exec(e)||/(linux)/.exec(e)||/(cros)/.exec(e)||/(playbook)/.exec(e)||/(bb)/.exec(e)||/(blackberry)/.exec(e)||[],i={},n={browser:r[5]||r[3]||r[1]||"",version:r[2]||r[4]||"0",versionNumber:r[4]||r[2]||"0",platform:o[0]||""};if(n.browser&&(i[n.browser]=!0,i.version=n.version,i.versionNumber=parseInt(n.versionNumber,10)),n.platform&&(i[n.platform]=!0),(i.android||i.bb||i.blackberry||i.ipad||i.iphone||i.ipod||i.kindle||i.playbook||i.silk||i["windows phone"])&&(i.mobile=!0),(i.cros||i.mac||i.linux||i.win)&&(i.desktop=!0),(i.chrome||i.opr||i.safari)&&(i.webkit=!0),i.rv||i.iemobile){n.browser="msie",i.msie=!0}if(i.edge){delete i.edge;n.browser="msedge",i.msedge=!0}if(i.safari&&i.blackberry){n.browser="blackberry",i.blackberry=!0}if(i.safari&&i.playbook){n.browser="playbook",i.playbook=!0}if(i.bb){var a="blackberry";n.browser=a,i[a]=!0}if(i.opr){n.browser="opera",i.opera=!0}if(i.safari&&i.android){n.browser="android",i.android=!0}if(i.safari&&i.kindle){n.browser="kindle",i.kindle=!0}if(i.safari&&i.silk){n.browser="silk",i.silk=!0}return i.name=n.browser,i.platform=n.platform,i}var o;
//! FOLLOWING REMOVED BY ATLASSIAN: exporting as global variable
return o=r(window.navigator.userAgent),o.uaMatch=r,e&&(e.browser=o),o});