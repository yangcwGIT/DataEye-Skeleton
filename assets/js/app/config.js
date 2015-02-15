define(function() {
	// 页面url配置
	var pageUrls = [
		'/realtime',
		'/new',
		'/active',
		'/device'
	]

	var routes = {}

	pageUrls.forEach(function(url) {
		// 都位于app目录下
		routes[url] = 'app' + url
	})

	return routes
})
