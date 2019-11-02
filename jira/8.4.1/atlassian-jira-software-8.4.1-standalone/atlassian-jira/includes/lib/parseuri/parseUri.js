/*!
 * parseUri 1.2.2
 * (c) Steven Levithan <stevenlevithan.com>
 * MIT License
 * MODIFIED BY ATLASSIAN
 */

define('jira/libs/parse-uri', function() {

function parseUri (arg) {
	// prepare
    var	o   = parseUri.options,
        uri = {};
    uri[o.q.name] = {};
    for(var uriKey in o.key) {
    	uri[o.key[uriKey]] = "";
	}

    // just to be safe
    if (typeof arg === 'undefined' || !arg) {
    	return uri;
	}

	// detect IPv6 address
	var str = arg.toString();
    var anchor = document.createElement("a");
    anchor.href = str;
    var hostname = anchor.hostname;
    var isIpv6Address = hostname.indexOf(":") > -1; // Only IPv6 address contains ":" in the hostname
    var hasBrackets = hostname.indexOf("[") > -1 && hostname.indexOf("]") > -1;
    hostname = hasBrackets ? hostname : "[" + hostname + "]"; // Support for IE11
    var fakeHostname = "hostname";

    // temporarily change the IPv6 address to fake hostname for regular expressions to properly parse URL
    if (isIpv6Address) {
    	str = str.replace(hostname, fakeHostname);
    }

    // do the parsing
	var	m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str);

    for(var uriKey in o.key) {
        uri[o.key[uriKey]] = m[uriKey] || "";
    }

	uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
		if ($1) uri[o.q.name][$1] = $2;
	});

    // revert to the original IPv6 address
    if (isIpv6Address) {
       uri.host = hostname;
       uri.authority = uri.authority.replace(fakeHostname, uri.host);
       uri.source = uri.source.replace(fakeHostname, uri.host);
    }

	return uri;
};

parseUri.options = {
	strictMode: false,
	key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
	q:   {
		name:   "queryKey",
		parser: /(?:^|&)([^&=]*)=?([^&]*)/g
	},
	parser: {
		strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
		loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	}
};

return parseUri;
});
AJS.namespace("parseUri", null, require("jira/libs/parse-uri"));
