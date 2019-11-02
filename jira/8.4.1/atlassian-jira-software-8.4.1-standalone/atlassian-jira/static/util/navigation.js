var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

define('jira/util/navigation', ['backbone', 'underscore', 'jira/libs/parse-uri'], function (Backbone, _, parseUri) {
    'use strict';

    return {
        pushStateSupported: !!window.history.pushState,
        getBackboneHistoryRoot: function getBackboneHistoryRoot() {
            return this.pushStateSupported ? '' : this.getRoot();
        },
        getRoot: function getRoot() {
            return window.location.pathname;
        },
        navigate: function navigate(location, options) {
            if ((typeof location === 'undefined' ? 'undefined' : _typeof(location)) === 'object') {
                location = this.buildQuery(location);
            }
            if (this.pushStateSupported) {
                location = this.getRoot() + location;
            }
            Backbone.history.navigate(location, options);
        },
        replaceUrlParam: function replaceUrlParam(url, paramName, paramValue) {
            if (paramValue == null) {
                paramValue = '';
            }
            var pattern = new RegExp('\\b(' + paramName + '=).*?(&|#|$)');
            if (url.search(pattern) >= 0) {
                return url.replace(pattern, '$1' + paramValue + '$2');
            }
            url = url.replace(/[?#]$/, '');
            return url + (url.indexOf('?') >= 0 ? '&' : '?') + paramName + '=' + paramValue;
        },
        addParam: function addParam(param, options) {
            var key = Object.keys(param)[0];
            var value = param[key];
            var queryString = window.location.search;
            var location = this.replaceUrlParam(queryString, key, value);
            if (this.pushStateSupported) {
                location = this.getRoot() + location;
            }
            Backbone.history.navigate(location, options);
        },
        getParam: function getParam(name, includeHash, location) {
            location = location || window.location;
            var uri = parseUri(location);
            var params = uri.queryKey;

            if (includeHash && uri.anchor) {
                uri.anchor.split('&').forEach(function (i) {
                    var param = i.split('=');
                    if (param.length === 2) {
                        params[param[0]] = param[1];
                    }
                });
            }
            return typeof params[name] === 'undefined' ? undefined : decodeURIComponent(params[name].replace(/\+/g, ' '));
        },
        buildQuery: function buildQuery(params) {
            var queryString = _.reduce(params, function (query, value, param) {
                if (value !== false) {
                    return query + '&' + encodeURIComponent(param) + '=' + encodeURIComponent(value).replace(/%20/g, '+');
                }
                return query;
            }, '');

            return this.pushStateSupported ? queryString.replace('&', '?') : queryString.substr(1);
        }
    };
});