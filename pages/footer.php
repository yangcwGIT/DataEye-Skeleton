<script>
	var App = {
		// debug模式不会执行css和js合并压缩，分多个请求执行
		debug: <?php echo json_encode($debug);?>,
		// 是否是非标准浏览器（< IE 9）
		outdated: !window.JSON && !window.addEventListener,
		// web根目录
		contextPath: '<?php echo $context_path?>',
		// 静态资源目录
		staticPath: '<?php echo $static_dir?>',
		// location.search中包含的查询字符串
		params: {},
		// 兼容脚本映射表
		compat: {
			'ractive': 'ractive-legacy',
			'utils': 'utils-compat'
		},
		// requirejs默认配置项目
		requireConfig: {
			baseUrl: '<?php echo $static_dir?>/js',
			paths: {}
		},
		// 资源文件md5信息
		manifest: <?php echo $manifest?>
	}

	;(function(manifest, config, paths, compat) {
		// 开发环境不缓存脚本
		if (App.debug) {
			config.urlArgs = 'v=' + Date.now()
			return
		}

		// 根据manifest重写js资源path
		for (var key in manifest) {
			var moduleName = key.replace(/(^\/js\/)|(\.js$)/g, '')
			paths[moduleName] = './' + moduleName + '.js?v=' + manifest[key]
		}

		// 非标准浏览器使用对应的兼容脚本
		if (App.outdated) {
			for (var name in compat) {
				var compatModule = paths[compat[name]]
				if (compatModule) {
					paths[name] = compatModule
				}
			}
		}
	})(App.manifest, App.requireConfig, App.requireConfig.paths, App.compat)
</script>
<!--[if lt IE 9]>
<script src="<?php echo $static_dir?>/js/ie8/combined.js"></script>
<![endif]-->
<script src="<?php echo $static_dir?>/js/require.js"></script>
<script src="<?php echo $static_dir?>/js/app/main.js"></script>
