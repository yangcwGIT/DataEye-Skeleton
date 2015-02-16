# DataEye-Skeleton

dataeye前端页面基本骨架，展示如何使用requirejs来构建前端项目，实现资源文件的合并压缩、增量更新。

## 目录说明

> * assets 静态资源
> * pages 前端页面
> * tools 构建脚本
> * assets-build 静态资源（构建后）

## 演示依赖

> * php（nginx / wamp）
> * iojs

## 演示说明

执行构建脚本

> * cd tools
> * npm install
> * npm start

然后访问 [localhost/pages/index.php](localhost/pages/index.php)

打开浏览器的开发者工具，选择Network。

修改`index.php`源码中的$debug变量查看脚本加载详情。

## 其它说明

在理想化的标准化开发模式中，我们的业务代码是不需要判断当前的执行环境是开发环境还是生产环境。追求业务编码的一致性是便利的，也是必要的。否则会带来很多代码维护上的问题。

本演示的实现方案的基本原则就是追求业务代码的一致性，不过又产生了新的问题。

requirejs配置文件(tools/config.js)中合并压缩产生的新文件在开发环境中不存在，所以即使在开发环境也需要先构建。构建目的就是为了自动生成兼容脚本，对应生产环境中合并的脚本。

## 兼容脚本

兼容脚本的内容十分简单，就是读取tools/config.js中的include配置，然后简单的require即可。详细内容参考assets/js/base.js


