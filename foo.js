(function(foo) {

	"use strict";

	foo.registerModule = function registerModule(root, modeulName, cb) {

		if (root.utils && typeof root.utils.define === 'function') {
			// Utils Package System
			return utils.define(modeulName).as(cb);
		} else {
			var factory = function() {
				var X = {};
				cb(X);
				return X;
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
})(this);
