<?php
	$debug = false;
	$context_path = '..';
	$static_dir = $debug ? $context_path.'/assets' : $context_path.'/assets-build';
	$manifest = file_get_contents('../tools/manifest.json');
	$manifestJSON = json_decode($manifest);
?>
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="renderer" content="webkit">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title>skeleton for dataeye</title>
		<link rel="stylesheet" href="<?php echo $static_dir?>/css/main.css">
	</head>
	<body>
		<ul>
			<!-- 菜单为了避免视觉闪动，直接JSP输出 -->
			<li><a href="#/realtime?startTime=20141027">实时概览</a></li>
			<li><a href="#/new">新增用户</a></li>
			<li><a href="#/active">活跃用户</a></li>
			<li><a href="#/device">设备分析</a></li>
			<li><a href="#/404">404</a></li>
		</ul>
		<!-- 内容页使用MVVM框架生成 -->
		<div id="container"></div>
    <!--[if lt IE 9]>
		<script src="<?php echo $static_dir?>/js/ie8/combined.js"></script>
		<![endif]-->
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
				// 默认路由
				defaultRoute: '/realtime',
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
				// 资源文件元信息
				manifest: <?php echo $manifest?>
			}

			;(function(manifest, config, paths, compat) {
				// 开发环境不换成脚本
				if (App.debug) {
					config.urlArgs = 'v=' + Date.now()
					return
				}

				// 根据manifest清单重写资源path
				for(var key in manifest) {
					var moduleName = key.replace(/(^\/js\/)|(\.js$)/g, '')
					paths[moduleName] = './' + moduleName + '.js?v=' + manifest[key]
				}

				// 非标准浏览器使用对应的兼容脚本
				if (App.outdated) {
					for(var name in compat) {
						paths[name] = paths[compat[name]]
						delete paths[compat[name]]
					}
				}
			})(App.manifest, App.requireConfig, App.requireConfig.paths, App.compat)
		</script>
		<script src="<?php echo $static_dir?>/js/require.js"></script>
		<script src="<?php echo $static_dir?>/js/app/main.js"></script>
	</body>
</html>
