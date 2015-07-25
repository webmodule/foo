(function(foo) {

	"use strict";

	function ModuleContainer() {
		// module Container, framework is supposed to extend its prototype
	}

	var mix = function(obj, proto) {
		for ( var prop in proto) {
			if (proto.hasOwnProperty(prop)) {
				obj[prop] = proto[prop];
			}
		}
		return obj;
	};

	var namespace = function(_root, _nameSpace, _valObj) {
		var root = _root;
		var nameSpace = _nameSpace;
		var valObj = _valObj;
		if (typeof _root === "string") {
			root = foo;
			nameSpace = _root;
			valObj = _nameSpace;
		}
		var nspace = nameSpace.split('.');
		var win = root || foo;
		var retspace = nspace[0];
		for (var i = 0; i < nspace.length - 1; i++) {
			if (!win[nspace[i]])
				win[nspace[i]] = {};
			retspace = nspace[i];
			win = win[retspace];
		}
		if(valObj !== undefined){
			win[nspace[nspace.length - 1]] = valObj;
		}
		return win[nspace[nspace.length - 1]];
	};
	
	var _create_ = function(moduleName, fromModuleName, definition) {
		var fromModule = foo[fromModuleName] || {};
		var thisModule = Object.create(fromModule);
		return namespace(foo, moduleName, definition.call(this,thisModule)
				|| thisModule);
		foo[moduleName] = definition.call(this,thisModule) || thisModule;
		return foo[moduleName];
	};
	
	var _define_ = function(moduleName, fromModule, definition) {
			if (typeof definition === 'function'
				&& typeof fromModule === 'string') {
			return _create_.call(this,
					moduleName, fromModule, definition);
		} else if (typeof fromModule === 'function') {
			return _create_.call(this,
					moduleName, null, fromModule);
		} else if (typeof definition === 'object'
				&& typeof fromModule === 'string') {
			return _create_.call(this,moduleName, fromModule,
					function(thisModule) {
						mix(thisModule, definition);
					});
		} else if (typeof fromModule === 'object') {
			return _create_.call(this,moduleName, null, function(
					thisModule) {
				mix(thisModule, fromModule);
			});
		}
	}; 

	ModuleContainer.prototype = {
		define : function() {
			var mc = new ModuleContainer();
			mc.__modulePrototype__ = _define_.apply(mc, arguments);
			return mc;
		},
		module : function(moduleName) {
			if (moduleName !== undefined) {
				return foo[moduleName];
			} else if(this!==undefined){
				return this.__modulePrototype__;
			}
		},
		tag : function(tagName, definition) {
			return console.warn("No tag Registrar found");
		},
		require : function() {
			return console.warn("No tag Registrar found");
		}
	};

//	var _metaDef_ = {
//		define : ModuleContainer.prototype.define,
//		module : ModuleContainer.prototype.module,
//		tag : ModuleContainer.prototype.tag,
//		require : ModuleContainer.prototype.require,
//		namespace : namespace
//	};

	foo._define_ = ModuleContainer.prototype.define;
	foo._module_ = ModuleContainer.prototype.module;
	foo._tag_ = ModuleContainer.prototype.tag;
	foo._require_ = ModuleContainer.prototype.require;
	foo._namespace_ = namespace;

	["define","module","namespace"].map(function(prop){
		if(foo[prop]===undefined){
			foo[prop] = function(){
				return foo["_"+prop+"_"].apply(foo,arguments);
			};
		}
	});
	
	foo._setFoo_ = function(propName,propValue){
		return foo["_"+propName+"_"] = propValue;
	};

	foo.registerModule = function registerModule(root, modeulName, cb) {

		if (root.utils && typeof root.utils.define === 'function') {
			// Utils Package System
			return utils.define(modeulName).as(cb.bind(root));
		} else {
			var factory = function() {
				var X = {}, x;
				var _X = cb.bind(root)(X, x);
				return _X || X;
			};
			if (typeof root.define === 'function' && root.define.amd) {
				// AMD based package system
				root.define([], factory);
			} else if (window.define && window.define.get) {
				return define({
					"fileName" : modeulName
				}).content(factory);
			} else if (typeof exports === 'object') {
				// EXPORT based system
				module.exports = factory();
			} else {
				root[modeulName] = factory();
			}
		}

	};

	foo.mixin = mix;

})(this);

// is Utility functions
(function(foo) {

	foo.debounce = function debounce(func, wait, immediate) {
		var timeout, args, context, timestamp, result;
		return function() {
			context = this;
			args = arguments;
			timestamp = new Date();
			var later = function() {
				var last = (new Date()) - timestamp;
				if (last < wait) {
					timeout = setTimeout(later, wait - last);
				} else {
					timeout = null;
					if (!immediate)
						result = func.apply(context, args);
				}
			};
			var callNow = immediate && !timeout;
			if (!timeout) {
				timeout = setTimeout(later, wait);
			}
			if (callNow)
				result = func.apply(context, args);
			return result;
		};
	};

	foo.getUUID = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
				function(c) {
					var r = Math.random() * 16 | 0, v = c == 'x' ? r
							: (r & 0x3 | 0x8);
					return v.toString(16);
				});
	};

	foo.preventPropagation = function(event) {
		if (!event)
			var event = window.event;
		if (event) {
			if (event.preventDefault !== undefined) {
				event.preventDefault && event.preventDefault();
			}
			event.cancelBubble = true;
			event.returnValue = false;
			if (event.stopPropagation !== undefined) {
				event.stopPropagation();
			}
			if (event.stopImmediatePropagation !== undefined) {
				event.stopImmediatePropagation();
			}
			return false;
		}
	};

})(this);

// is Resolver
(function(foo) {
	function getType(obj) {
		return Object.prototype.toString.call(obj).slice(8, -1);
	}
	function is(type, obj) {
		var clas = getType(obj);
		return obj !== undefined && obj !== null && clas === type;
	}
	is.Function = function(obj) {
		return is("Function", obj);
	};
	is.Object = function(obj) {
		return is("Object", obj);
	};
	is.Array = function(obj) {
		return is("Array", obj);
	};
	is.Null = function(obj) {
		return is("Null", obj);
	};
	is.Undefined = function(obj) {
		return is("Undefined", obj);
	};
	is.Number = function(obj) {
		return is("Number", obj);
	};
	is.String = function(obj) {
		return is("String", obj);
	};
	is.Value = function(obj) {
		var clas = getType(obj);
		return !(clas === "Undefined" || clas === "Null");
	};
	is.Empty = function(obj) {
		var clas = getType(obj);
		switch (clas) {
		case "Undefined":
		case "Null":
			return true;
			break;
		case "Boolean":
			return obj;
			break;
		case "Number":
			return obj === 0;
		case "String":
		case "Array":
			return (obj.length === 0);
			break;
		default:
			for ( var key in obj) {
				if (hasOwnProperty.call(obj, key))
					return false;
			}
			return true;
			break;
		}
		return !(is.Undefined(obj) || is.Null(obj));
	};
	is.Valid = function(condition,message){
		if(!condition && is.String(message)){
			throw Error(message);
		} return !!condition;
	};
	foo.is = is;
	
})(this);

(function(foo) {
	var when = (foo.is.Function(document.addEventListener)) 
	? (function (f){/ing/.test(document.readyState)?document.addEventListener('DOMContentLoaded',f):f();})
	: (function (f){/in/.test(document.readyState)?setTimeout(function(){f()},9):f()}) ;

	when.ready = function(f){
		return when(f);
	};
	foo.when = when;
})(this);

(function(foo) {

	"use strict";
	// By default, Underscore uses ERB-style template delimiters, change the
	// following template settings to use alternative delimiters.
	// evaluate : /<%([\s\S]+?)%>/g,
	// interpolate : /<%=([\s\S]+?)%>/g,
	// escape : /<%-([\s\S]+?)%>/g
	var _ = {
		templateSettings : {
			evaluate : /<!--\ ([\s\S]+?)\ -->/g,
			interpolate : /{{([\s\S]+?)}}/g,
			escape : /<!--\\([\s\S]+?)-->/g,
			variable : 'data'
		}
	};

	// When customizing `templateSettings`, if you don't want to define an
	// interpolation, evaluation or escaping regex, we need one that is
	// guaranteed not to match.
	var noMatch = /(.)^/;

	// Certain characters need to be escaped so that they can be put into a
	// string literal.
	var escapes = {
		"'" : "'",
		'\\' : '\\',
		'\r' : 'r',
		'\n' : 'n',
		'\t' : 't',
		'\u2028' : 'u2028',
		'\u2029' : 'u2029'
	};

	var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

	// JavaScript micro-templating, similar to John Resig's implementation.
	// Underscore templating handles arbitrary delimiters, preserves whitespace,
	// and correctly escapes quotes within interpolated code.

	foo.template = function(text, data, settings) {
		var render;
		settings = $.extend({}, foo.template.settings, settings);

		// Combine delimiters into one regular expression via alternation.
		var matcher = new RegExp([ (settings.escape || noMatch).source,
				(settings.interpolate || noMatch).source,
				(settings.evaluate || noMatch).source ].join('|')
				+ '|$', 'g');

		// Compile the template source, escaping string literals appropriately.
		var index = 0;
		var source = "__p+='";
		text.replace(matcher, function(match, escape, interpolate, evaluate,
				offset) {
			source += text.slice(index, offset).replace(escaper,
					function(match) {
						return '\\' + escapes[match];
					});

			if (escape) {
				source += "'+\n((__t=(" + escape
						+ "))==null?'':_.escape(__t))+\n'";
			}
			if (interpolate) {
				source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
			}
			if (evaluate) {
				source += "';\n" + evaluate + "\n__p+='";
			}
			index = offset + match.length;
			return match;
		});
		source += "';\n";

		// If a variable is not specified, place data values in local scope.
		if (!settings.variable)
			source = 'with(obj||{}){\n' + source + '}\n';

		source = "var __t,__p='',__j=Array.prototype.join,"
				+ "print=function(){__p+=__j.call(arguments,'');};\n" + source
				+ "return __p;\n";

		try {
			render = new Function(settings.variable || 'obj', '_', source);
		} catch (e) {
			e.source = source;
			throw e;
		}

		if (data)
			return render(data, _);
		var template = function(data) {
			return render.call(this, data, _);
		};

		// Provide the compiled function source as a convenience for
		// precompilation.
		template.source = 'function(' + (settings.variable || 'obj') + '){\n'
				+ source + '}';

		return template;
	};

	foo.template.settings = _.templateSettings;

})(this);

(function(foo) {
	var md5_define = function() {
		/*
		 * Add integers, wrapping at 2^32. This uses 16-bit operations
		 * internally to work around bugs in some JS interpreters.
		 */
		function safe_add(x, y) {
			var lsw = (x & 0xFFFF) + (y & 0xFFFF), msw = (x >> 16) + (y >> 16)
					+ (lsw >> 16);
			return (msw << 16) | (lsw & 0xFFFF);
		}

		/*
		 * Bitwise rotate a 32-bit number to the left.
		 */
		function bit_rol(num, cnt) {
			return (num << cnt) | (num >>> (32 - cnt));
		}

		/*
		 * These functions implement the four basic operations the algorithm
		 * uses.
		 */
		function md5_cmn(q, a, b, x, s, t) {
			return safe_add(
					bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
		}
		function md5_ff(a, b, c, d, x, s, t) {
			return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
		}
		function md5_gg(a, b, c, d, x, s, t) {
			return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
		}
		function md5_hh(a, b, c, d, x, s, t) {
			return md5_cmn(b ^ c ^ d, a, b, x, s, t);
		}
		function md5_ii(a, b, c, d, x, s, t) {
			return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
		}

		/*
		 * Calculate the MD5 of an array of little-endian words, and a bit
		 * length.
		 */
		function binl_md5(x, len) {
			/* append padding */
			x[len >> 5] |= 0x80 << (len % 32);
			x[(((len + 64) >>> 9) << 4) + 14] = len;

			var i, olda, oldb, oldc, oldd, a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;

			for (i = 0; i < x.length; i += 16) {
				olda = a;
				oldb = b;
				oldc = c;
				oldd = d;

				a = md5_ff(a, b, c, d, x[i], 7, -680876936);
				d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
				c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
				b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
				a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
				d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
				c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
				b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
				a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
				d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
				c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
				b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
				a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
				d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
				c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
				b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

				a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
				d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
				c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
				b = md5_gg(b, c, d, a, x[i], 20, -373897302);
				a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
				d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
				c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
				b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
				a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
				d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
				c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
				b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
				a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
				d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
				c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
				b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

				a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
				d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
				c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
				b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
				a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
				d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
				c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
				b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
				a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
				d = md5_hh(d, a, b, c, x[i], 11, -358537222);
				c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
				b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
				a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
				d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
				c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
				b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

				a = md5_ii(a, b, c, d, x[i], 6, -198630844);
				d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
				c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
				b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
				a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
				d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
				c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
				b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
				a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
				d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
				c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
				b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
				a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
				d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
				c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
				b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

				a = safe_add(a, olda);
				b = safe_add(b, oldb);
				c = safe_add(c, oldc);
				d = safe_add(d, oldd);
			}
			return [ a, b, c, d ];
		}

		/*
		 * Convert an array of little-endian words to a string
		 */
		function binl2rstr(input) {
			var i, output = '';
			for (i = 0; i < input.length * 32; i += 8) {
				output += String
						.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
			}
			return output;
		}

		/*
		 * Convert a raw string to an array of little-endian words Characters
		 * >255 have their high-byte silently ignored.
		 */
		function rstr2binl(input) {
			var i, output = [];
			output[(input.length >> 2) - 1] = undefined;
			for (i = 0; i < output.length; i += 1) {
				output[i] = 0;
			}
			for (i = 0; i < input.length * 8; i += 8) {
				output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
			}
			return output;
		}

		/*
		 * Calculate the MD5 of a raw string
		 */
		function rstr_md5(s) {
			return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
		}

		/*
		 * Calculate the HMAC-MD5, of a key and some data (raw strings)
		 */
		function rstr_hmac_md5(key, data) {
			var i, bkey = rstr2binl(key), ipad = [], opad = [], hash;
			ipad[15] = opad[15] = undefined;
			if (bkey.length > 16) {
				bkey = binl_md5(bkey, key.length * 8);
			}
			for (i = 0; i < 16; i += 1) {
				ipad[i] = bkey[i] ^ 0x36363636;
				opad[i] = bkey[i] ^ 0x5C5C5C5C;
			}
			hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
			return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
		}

		/*
		 * Convert a raw string to a hex string
		 */
		function rstr2hex(input) {
			var hex_tab = '0123456789abcdef', output = '', x, i;
			for (i = 0; i < input.length; i += 1) {
				x = input.charCodeAt(i);
				output += hex_tab.charAt((x >>> 4) & 0x0F)
						+ hex_tab.charAt(x & 0x0F);
			}
			return output;
		}

		/*
		 * Encode a string as utf-8
		 */
		function str2rstr_utf8(input) {
			return unescape(encodeURIComponent(input));
		}

		/*
		 * Take string arguments and return either raw or hex encoded strings
		 */
		function raw_md5(s) {
			return rstr_md5(str2rstr_utf8(s));
		}
		function hex_md5(s) {
			return rstr2hex(raw_md5(s));
		}
		function raw_hmac_md5(k, d) {
			return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d));
		}
		function hex_hmac_md5(k, d) {
			return rstr2hex(raw_hmac_md5(k, d));
		}

		function md5(string, key, raw) {
			if (!key) {
				if (!raw) {
					return hex_md5(string);
				}
				return raw_md5(string);
			}
			if (!raw) {
				return hex_hmac_md5(key, string);
			}
			return raw_hmac_md5(key, string);
		}
		return md5;
	};

	foo.md5 = md5_define();
	foo.md5._definition_ = md5_define;

	var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

	foo.encode64 = function(input) {
		input = escape(input);
		var output = "";
		var chr1, chr2, chr3 = "";
		var enc1, enc2, enc3, enc4 = "";
		var i = 0;
		do {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2)
					+ keyStr.charAt(enc3) + keyStr.charAt(enc4);
			chr1 = chr2 = chr3 = "";
			enc1 = enc2 = enc3 = enc4 = "";
		} while (i < input.length);
		return output;
	}

	foo.decode64 = function(input) {
		var output = "";
		var chr1, chr2, chr3 = "";
		var enc1, enc2, enc3, enc4 = "";
		var i = 0;

		// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
		var base64test = /[^A-Za-z0-9\+\/\=]/g;
		if (base64test.exec(input)) {
			throw ("There were invalid base64 characters in the input text.\n"
					+ "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n"
					+ "Expect errors in decoding.");
		}
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		do {
			enc1 = keyStr.indexOf(input.charAt(i++));
			enc2 = keyStr.indexOf(input.charAt(i++));
			enc3 = keyStr.indexOf(input.charAt(i++));
			enc4 = keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

			chr1 = chr2 = chr3 = "";
			enc1 = enc2 = enc3 = enc4 = "";

		} while (i < input.length);

		return unescape(output);
	}

})(this);
