React-XRouter
====

>React-XRouter 是一个类似ReactRouter的类库。

--------
	
##依赖
    <label>无</label>
    
--------
	
##安装：
    >npm install react-xrouter --save
	
--------
## 使用

```

var Router = require('react-xrouter');

Router.route({
	'/': {
		enter: function () {
			require.ensure([], function(require){
				//可以做些统计写日志的工作
    			var HomePage = require('./pages/home/HomePage.js');
				ReactDOM.render(<HomePage/>, document.querySelector('#pinzhi'));
			});
		}
	},
	'/detail/:id': {
		enter: function (param) {
			require.ensure([], function(require){
    			var DetailPage = require('./pages/detail/DetailPage.js');
				ReactDOM.render(<DetailPage params={param}/>, document.querySelector('#pinzhi'));
			});
		},
		leave: function(){
		
		}
	},
	'default': {
		redirect: '/'
	}
});


```

--------
## API

```

var Router = require('react-xrouter');

Router.back();

Router.redirect(path);

```