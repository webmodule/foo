(function(foo) {

	var PATH;
	
	var origin = (foo.location ? foo.location.origin : "") || "http://nourl.com";
	
	PATH = function PATH(path, context) {
		var context = context || "";
		if (PATH.isRemote(path)) {
			return path;
		} else if (path.indexOf('/') == 0) {
			return PATH.clean(path);
		} else {
			return PATH.clean("/" + context + "/" + path);
		}
	};
	PATH.isRemote = function(path) {
		return path.indexOf('http://') == 0 || path.indexOf('https://') == 0;
	};
	PATH.info = function(_path,_context) {
		var path = PATH(_path,_context);
		var info;
		if(PATH.isRemote(path)){
			info = new foo.URL(path);
		} else {
			info = new foo.URL(origin+path);
		}
    	var x = info.pathname.split('/');
    	info.isFile = (_path.split('/').length===1);
    	info.file = x.pop();
    	info.dir = x.join('/');
    	return info;
	};
	PATH.clean = function(url) {
		url = url.replace(/[\/]+/g, '/');
		var ars = url.split('/');
		var domain = ars.shift();
		var parents = [];
		for ( var i in ars) {
			switch (ars[i]) {
			case '.':
				// Don't need to do anything here
				break;
			case '..':
				parents.pop()
				break;
			default:
				parents.push(ars[i]);
				break;
			}
		}
		return (domain + '/' + parents.join('/')).replace(/(\/)+/g, '/');
	};
	foo.path = PATH;

})(this);