<?php
	// 是否开发环境，决定了资源的加载方式
	$debug = true;
	// web根目录
	$context_path = '..';
	// 静态资源目录
	$static_dir = $debug ? $context_path.'/assets' : $context_path.'/assets-build';
	// 资源原件md5信息
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
