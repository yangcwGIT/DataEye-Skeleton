require.config(App.requireConfig)

define('app', function() {
	return App
})

require(['base'], function() {
	require(['jquery', 'app/config', 'app', 'router', 'query-string'], function($, RoutesTable, App, Router, queryString) {
		/**
		 * 查询字符串解析到params上（不包含hash）
		 */
		if (location.search) {
			App.params = queryString.parse(location.search)
		}

		var router = new Router()

		function loadRouteByUrl(url, scriptName) {
			if (!url) throw Error('url参数错误')

			url = url[0] !== '/' ? '/' + url : url
			scriptName = scriptName || url.replace(/\//g, '_').slice(1)

			router.on(url, function() {
				require([scriptName], function(View) {
					if (!View || !$.isFunction(View.render)) {
						throw new Error('代码不规范，请返回一个带有render方法的对象')
					}

					View.render()
				})
			})
		}

		router.configure({
			/**
			 * 下一个路由进入时自动解析hash中的查询字符串
			 */
			before: function() {
				if (location.hash.indexOf('?') > -1) {
					var fragments = location.hash.split('?')[1]

					App.queryString = queryString.parse(fragments)
				}
			},
			/**
			 * 404页面
			 */
			notfound: function() {
				throw Error('404 page not found!')
			},
			on: function() {},
			/**
			 * 上一个路由离开时触发，如果首次加载则不会执行
			 */
			after: function() {}
		})

		/**
		 * 从单独的路由配置脚本中加载路由配置
		 */
		for(var key in RoutesTable) {
			loadRouteByUrl(key, RoutesTable[key])
		}

		App.router = router
		App.addRoute = loadRouteByUrl

		router.init(location.hash || App.defaultRoute)

	})
})
