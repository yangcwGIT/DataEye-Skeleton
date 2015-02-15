{
	// 资源文件目录
	appDir: '../assets',
	// 打包输出目录
	dir: '../assets-build',
	// 脚本所处目录
	baseUrl: 'js',
	// 合并压缩css
	optimizeCss: "standard",
	// 是否压缩，调试用
	optimize: 'none',
	removeCombined: true,
	// build预处理
	onBuildRead: function (moduleName, path, contents) {
		// IE 8兼容脚本合并
		if (moduleName === 'ie8/combined') {
			contents = '/* empty code */'
		}
		return contents
	},
	paths: {
		/**
		 * 合并生成新文件都要在这里配置（modules里面对应的模块配置的create要设置为true）
		 * 对于不符合amd规范的脚本参考ie8/combined配置（要在requirejs之前加载）
		 * 配置解释：key为模块名，value为真实路径，相对于baseUrl
		 */
		'base': './base',
		'utils': './utils',
		'utils-compat': './utils-compat'
	},
	/**
	 * 注意事项：
	 * 符合AMD规范的脚本，模块名和文件名要一致，不然生产环境和开发环境配置蛋疼
	 * 不符合AMD规范的脚本，要么改造为AMD风格脚本，要么在requirejs之前加载
	 * 文件合并时要么全部当做AMD脚本合并，要么全部暴露，不然也蛋疼
	 * 具体参考build.js的ie8/combined.js 和 base.js合并
	 */
	modules: [
		{
			// 模块名路径相对于baseUrl
			// 这个文件用于兼容IE 8
			name: 'ie8/combined',
			// 强制包含以下文件
			include: [
				'ie8/es5-shim',
				'ie8/html5shiv',
				'ie8/json2',
				'ie8/respond'
			]
		},
		{
			// jquery等页面开发基础库
			name: 'base',
			create: true,
			include: [
				'router',
				'jquery',
				'jquery.cookie',
				'npo.src',
				'query-string',
				'store'
			]
		},
		{
			// 页面开发高级功能: 语言增强、动画、时间处理、模板等
			name: 'utils',
			create: true,
			include: [
				'lodash',
				'moment',
				'velocity',
				'handlebars.amd'
			]
		},
		{
			name: 'utils-compat',
			create: true,
			include: [
				'lodash.compat',
				'moment',
				'handlebars.amd',
				'velocity',
			]
		}
	]
}
