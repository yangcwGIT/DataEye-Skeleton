<?php include './header.php' ?>

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

<?php include './footer.php' ?>
