define(['ractive', 'jquery', 'components/res-filter'], function(Ractive, $, ResFilter) {
	return {
		render: function() {
			var app = new Ractive({
				el: '#container',
				template: '#realtime'
			})
		}
	}
})
