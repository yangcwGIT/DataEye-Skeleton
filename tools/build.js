/**
 * 前端构建工具，使用requirejs optimizer
 * 先使用requirejs根据配置文件构建基础内容
 * 然后读取配置文件中的paths以及modules输出manifest.json
 * 最后前端从manifest.json中配置增量更新信息
 */
var rjs = require('requirejs')
var Promise = require('bluebird')
var _ = require('lodash')
var glob = require('glob')

var fs = require('fs')
var crypto = require('crypto')
var path = require('path')

var globAysnc = Promise.promisify(glob, glob)
Promise.promisifyAll(fs)

var configFilePath = __dirname + '/config.js'
var manifestFilePath = __dirname + '/manifest.json'
var hashLength = 8

var configFile = fs.readFileSync(configFilePath, 'utf8')
var config = eval('(' + configFile + ')')

function md5(str) {
	return crypto.createHash('md5').update(str).digest('hex')
}

function log(msg) {
	console.log(msg)
}

rjs.optimizeAsync = function(config) {
	return new Promise(function(resolve, reject) {
		log('optimizing for ' + config.dir)

		// r.js会把config.paths的路径全部转换为绝对路径
		rjs.optimize(_.extend({}, config), function (buildResponse) {
			resolve(buildResponse)
		}, function(err) {
			reject(e)
		})
	})
}

/**
 * 做一些清除准备工作，比如删除自动生成代码(防止不必要的压缩等)、备份等
 */
function clean() {
	var modules = _.filter(config.modules, {create: true})
	var devJSPath = config.appDir + '/' + config.baseUrl + '/'

	log('cleaning before build for ' + devJSPath)

	return Promise.map(modules, function(module) {
		return new Promise(function(resolve) {
			var filepath = devJSPath + config.paths[module.name] + '.js'
			// 先要文件是否存在
			fs.exists(filepath, function(isExist) {
				resolve(isExist && filepath)
			})
		})
	}).then(function(files) {
		files = _.filter(files, function(i) {return !!i})
		return Promise.map(files, function(filepath) {
			log('clean file ' + filepath)

			return fs.unlinkAsync(filepath)
		})
	})
}

/**
 * 获取到指定文件的所有md5信息
 * @param  {[String]} pattern [glob支持的模式匹配（https://github.com/isaacs/node-glob）]
 * @param  {[Object]} options [glob配置]
 */
function manifest(pattern, options) {
	return new Promise(function(resolve, reject) {
		var filenames
		globAysnc(config.dir + pattern, options).then(function(files) {
			filenames = files
			return Promise.map(files, function(file) {
				return fs.readFileAsync(file, 'utf8')
			})
		}).then(function(files) {
			var json = {}
			var basePath = path.resolve(config.dir)

			_.each(files, function(file, i) {
				// 如果直接使用r.js处理过的config对象，需要将绝对路径移除
				var absPath = path.resolve(filenames[i])
				var filename = absPath.replace(basePath, '').replace(/\\/g, '/')

				json[filename] = md5(file).slice(0, hashLength)

				log('manifest is ready for ' + filename)
			})

			resolve(json)
		}).catch(function(e) {
			reject(e)
		})
	})
}

/**
 * 为开发环境生成兼容脚本（合并后的文件比如base.js在开发环境中不存在）
 */
function devCompat() {
	var modules = _.filter(config.modules, {create: true})
	var devJSPath = config.appDir + '/' + config.baseUrl + '/'

	return Promise.map(modules, function(module) {
		var filepath = config.paths[module.name]
		if (!filepath) {
			console.error(module.name + '缺少对应的paths配置')
			process.exit(1)
			return
		}

		filepath = devJSPath + filepath + '.js'
		// 代码模板
		var content = `
		/*! ~.~ auto generated code for module: ${module.name}, do not edit. ~.~ */
		define(function() {
			// orginal include is ${module.include.join(', ')}
			require([
				"${module.include.join('",\n"')}"
			])
		})`

		log('compat for ' + module.name + ' at ' + filepath)

		return fs.writeFileAsync(filepath, content.trim().replace(/\t/g, ''))
	})
}

clean().then(function() {
	return rjs.optimizeAsync(config)
}).then(devCompat)
.then(function() {
	return manifest('/**/*.js')
}).then(function(json) {
	return [manifest('/**/*.css'), json]
}).spread(function(css, js) {
	_.extend(css, js)
	return fs.writeFileAsync(manifestFilePath, JSON.stringify(css, null, '\t'))
}).catch(function(e) {
	throw e
}).finally(function() {
	log('EOF')
})
