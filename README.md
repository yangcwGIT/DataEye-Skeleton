# DataEye-Skeleton

dataeye前端页面基本骨架，主要展示使用requirejs来构建前端项目，从而实现资源文件的合并压缩、增量更新。

## 目录说明

> * assets 静态资源
> * pages 前端页面
> * tools 构建脚本
> * assets-build 静态资源（构建后）

## 演示依赖

> * php
> * node + npm

## 演示说明

先执行构建脚本

> * cd tools
> * npm install
> * npm start

然后访问 [localhost/pages/index.php](localhost/pages/index.php)

打开浏览器的开发者工具，选择Network。

修改`index.php`源码中的$debug变量查看脚本加载详情。

## 其它说明

有一个缺点就是即使开发环境，运行前也需要先构建一遍。

因为requirejs的配置文件(tools/config.js)中合并压缩产生的新文件在开发环境中是不存在的。

所以构建会在开发环境的资源目录生成对应的文件，这样来保证我们的业务代码的一致性(不需要判断是生产环境还是开发环境)


