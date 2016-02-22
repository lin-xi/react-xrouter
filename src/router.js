define('Router', function(){
	function Router(routers){
		this.router = routers;
		this.parseUrl();
		this.init();

		this.currentPath = "";
		this.currentRouter = null;
		this.pageStack = [];
		//alert(location.href);

		var newUrl = location.href.replace(/&from=na\-iphone/g, '');
		history.replaceState({}, '', newUrl);

		var mats = location.hash.match(/#([^?]*?)\?(.*)/);
		if(mats && mats.length == 3){
			var s = mats[2].replace(/\?/g, '&');

			var url = location.href.replace(mats[0], '');
			if(location.search){
				url += '&' + s;
			} else {
				url += '?' + s;
			}
			url += '#' + mats[1];
			history.replaceState({}, '', url);
		}
		//alert(location.href);
		/*if(location.hash.indexOf('?from=') != -1 || location.hash.indexOf('&from=') != -1){
			var url = location.hash.replace(/\?from=.*$/, '')
			url = url.replace(/&from=.*$/, '');
			history.replaceState({}, '', url);
		}*/

		
		this.change();
	}

	Router.prototype.init = function(){
		var me = this;
		if (history.pushState) {
			window.addEventListener('popstate', pathChange);
		} else if ("onhashchange" in window && (!document.documentMode || document.documentMode >= 8)) {
			window.onhashchange = pathChange;
		}

		function pathChange(){
			//alert('popState');
			var hash = location.hash;
			me.change();
		}
	};

	Router.prototype.change = function(){
		var hash = location.hash.slice(1);
		if(!location.hash){
			this.dispatch('default');
		} else if(hash != this.currentPath){
			this.changePage(hash);
		}
	};

	Router.prototype.parseUrl = function(){
		var me = this;
		for(var r in me.router){
			if(r != 'default'){
				var reg =  r.replace(/\/:\w*?(\/|$)/, '/(\\w+)/');
				reg = reg.replace('/', '\\/');
				me.router[r].reg = reg.replace(/\/:\w*?(\/|$)/, '/(\\w+)/');
				me.router[r].path = r;
			}
		}
	};

	Router.prototype.dispatch = function(path){
		var me = this;
		var route = this.router[path];
		var params = {};
		if(!route){
			for(var r in me.router){
				var reg = new RegExp('^' + me.router[r].reg + '$');
				var tempPath = path;
				if(tempPath.slice(-1) != '/'){
					tempPath += '/';
				}
				var mats = tempPath.match(reg);
				if(mats){
					var count = 1;
					route = me.router[r];
					r.split('/').forEach(function(item, i){
						if(item.indexOf(':') == 0){
							params[item.slice(1)] = mats[count];
							count++;
						}
					});
					break;
				}
			}
		}
		if(route){
			if(route.redirect){
				me.dispatch(route.redirect);
				return;
			}
			me.loadPage(path, route, params);
		}
	};

	Router.prototype.changePage = function(path){
		if (history.pushState) {
			this.pageStack.push(this.currentPath);
        }
        this.dispatch(path);
	};

	Router.prototype.back = function(){
		var stack = this.pageStack;
		var path = stack.pop();
		if(path){
			this.dispatch(path);
		} else {
			var r = this.currentRouter;
			if(r.back){
				this.dispatch(r.back);
			} else {
				WMApp && WMApp.page.closePage();
			}
		}
	};

	Router.prototype.loadPage = function(path, route, params){
		var r = this.router[this.currentPath];
		r && r.leave && r.leave();
		route.enter && route.enter(params);
        this.currentPath = path;
        this.currentRouter = route;
        history.replaceState({}, '', '#' + path);
	};

	exports.route = function(routers){
		this.route = new Router(routers);
		return this;
	};

	exports.back = function(){
		if(this.route){
			this.route.back();
		}
	};
	/**
	 * 页面跳转
	 *@path 路径
	 *@canBack 保存历史记录
     */
	exports.redirect = function(path, canBack){
		if(this.route){
			if(canBack){
				this.route.changePage(path);
			} else {
				this.route.dispatch(path);
			}
		}
	};

});


