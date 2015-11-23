(function(foo) {

	var PATH;

	var origin = (foo.location ? foo.location.origin : "")
			|| "http://nourl.com";

	PATH = function PATH(path, context) {
		var context = context || "";
		if (PATH.isRemote(path)) {
			return path;
		} else if (path.indexOf('/') == 0) {
			return PATH.resolve(path);
		} else if(PATH.isRemote(context)) {
			return PATH.resolve(context+"/" + path);
		} else {
			return PATH.resolve("/" + context + "/" + path);
		}
	};
	PATH.isRemote = function(path) {
		return path.indexOf('http://') == 0 || path.indexOf('https://') == 0;
	};
	PATH.info = function(_path, _context) {
		var path = PATH(_path, _context);
		var info;
		if (PATH.isRemote(path)) {
			info = new foo.URL(path);
		} else {
			info = new foo.URL(origin + path);
		}
		var x = info.pathname.split('/');
		info.isFile = (_path.split('/').length === 1);
		info.file = x.pop();
		info.dir = x.join('/');
    if(_path.indexOf("?")===0 || _path.indexOf("#")===0){
      info.pathname = foo.location ? foo.location.pathname : "";
    }
		return info;
	};
	
	PATH.clean = function(url){
		return url.replace(/[\/]+/g, '/');
	};
	
	PATH.resolve = function(url) {
		var protocol = null;
		if(PATH.isRemote(url)){
			var urls = url.split("://");
			protocol = urls[0];
			url = urls[1];
		}
		url = PATH.clean(url);
		var ars = url.split('/');
		var context = ars.shift();
		var parents = [];
		for ( var i in ars) {
			switch (ars[i]) {
			case '.':
				// Don't need to do anything here
				break;
			case '..':
				parents.pop();
				break;
			default:
				parents.push(ars[i]);
				break;
			}
		}
		if(protocol){
			return protocol +"://"+ ( context + '/' + parents.join('/')).replace(/(\/)+/g, '/');
		}
		return (context + '/' + parents.join('/')).replace(/(\/)+/g, '/');
	};
	PATH.decode = function(p) {
		var params = {};
		var pairs = p.split('&');
		for (var i = 0; i < pairs.length; i++) {
			if (pairs[i]) {
				var pair = pairs[i].split('=');
				var accessors = [];
				var name = decodeURIComponent(pair[0]), value = decodeURIComponent(pair[1].replace(/[\+]/g, "%20"));

				var name = name.replace(/\[([^\]]*)\]/g, function(k, acc) {
					accessors.push(acc);
					return "";
				});
				accessors.unshift(name);
				var o = params;

				for (var j = 0; j < accessors.length - 1; j++) {
					var acc = accessors[j];
					var nextAcc = accessors[j + 1];
					if (!o[acc]) {
						if ((nextAcc == "") || (/^[0-9]+$/.test(nextAcc)))
							o[acc] = [];
						else
							o[acc] = {};
					}
					o = o[acc];
				}
				acc = accessors[accessors.length - 1];
				if (acc == "")
					o.push(value);
				else
					o[acc] = value;
			}
		}
		return params;
	};

	var r20 = /%20/g, rbracket = /\[\]$/;

	PATH.buildParams = function(prefix, obj, add) {
		var name, key, value;
		if (foo.is.Array(obj)) {
			for ( var key in obj) {
				value = obj[key];
				if (rbracket.test(prefix))
					add(prefix, value);
				else
					PATH.buildParams(prefix + "["
              + (typeof value === "object" ? key : "") + "]", value,
							add);
			}
		} else if (foo.is.Object(obj)) {
			for (name in obj)
				PATH.buildParams(prefix + "[" + name + "]", obj[name], add);
		} else
			add(prefix, obj);
	};

	PATH.param = PATH.encode = function(obj) {
		var prefix, key, value;
		serialized = [], add = function(key, value) {
			value = foo.is.Function(value) ? value() : (value == null ? ""
					: value);
			serialized[serialized.length] = encodeURIComponent(key) + "="
					+ encodeURIComponent(value);
		};

		if (foo.is.Array(obj)) {
			for (key in obj) {
				value = obj[key];
				add(key, value);
			}
		} else {
			for (prefix in obj)
				PATH.buildParams(prefix, obj[prefix], add);
		}

		return serialized.join('&').replace(r20, '+');
	};

	foo.URI = PATH;

})(this);