/**
 * 应用和资源位筛选框，支持多选和搜索
 */

define(['ractive', 'jquery', 'lodash'], function(Ractive, $, _) {
	var widget = Ractive.extend({
		template: $('#res_filter_tmpl').html(),
		isolated: true,
		onrender: function() {
		 	var self = this, timer

			// 根据大类展示小类
			self.on('showSubMenus', function(e, val) {
				var target = _.find(this.get('types'), {value: val})
				if (!target) return

				var keypath = e ? e.keypath : 'types.0'
				// 清除大类和小类
				this.set('types.*.checked', '')
				this.set('subTypes', target.children)
				this.set(keypath + '.checked', true)

				// 自动加载第一个小类的全部叶子节点
				this.fire('showItems', null, target.children[0].value)
			})

			// ajax获取叶子节点
			self.on('showItems', function(e, val) {
				var type = _.find(this.get('types'), {checked: true})
				var keypath = e ? e.keypath : 'subTypes.0'

				$.getJSON(this.get('itemsUrl'), {
					// TODO 后台应该直接根据小类ID查询
					type: type && type.value,
					subType: val
				}).then(function(json) {
					self.set('items', json.data)

					self.set('subTypes.*.checked', '')
					self.set(keypath + '.checked', true)
				})
			})

			// 更改叶子选中状态
			self.on('toggleStatus', function(e) {
				this.toggle(e.keypath + '.checked')
			})

			// 手动查询
			self.on('search', function(e) {
				if (timer) clearTimeout(timer)

				timer = setTimeout(function() {
					var keyword = self.get('keyword')
					if (!keyword) return

					$.getJSON(self.get('searchUrl')).then(function(json) {
						// 搜索结果并不一定属于单个大类或小类，所以清除大类小类的选中状态
						self.set('types.*.checked', '')
						self.set('subTypes.*.checked', '')
						self.set('items', json.data)
					})
				}, 250)
			})

			// 打开面板
			self.on('openPanel', function() {
				if (this.get('isOpen')) return

				this.set('isOpen', true)

				$.getJSON(this.get('typesUrl')).then(function(json) {
					self.set('types', json.data)

					self.fire('showSubMenus', null, json.data[0].value)
				})
			})

			// 关闭面板
			self.on('closePanel', function() {
				this.set('isOpen', false)
			})
		}
	})

	Ractive.components.ResFilter = widget

	return widget
})
