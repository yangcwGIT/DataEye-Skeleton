<div class="resource-filter-container">
	<div class="btn-group" role="group">
		<button type="button" class="btn btn-default">资源位</button>
		<button type="button" class="btn btn-default" on-click="openPanel">选择资源位</button>
	</div>

	{{#isOpen}}
	<div class="resource-filter-panel">
		<div>
			<strong>资源位选择</strong>
			<div class="pull-right">
				<input type="text" class="form-control" on-keyup="search" value="{{keyword}}">
			</div>
		</div>
		<div class="row">
			<div class="col-md-3">
				<ul>
					{{#types}}
						<li class="{{checked}}" on-click="showSubMenus:{{value}}">{{label}}</li>
					{{/types}}
				</ul>
			</div>
			<div class="col-md-3">
				<ul>
					{{#subTypes}}
						<li class="{{checked}}" on-click="showItems:{{value}}">{{label}}</li>
					{{/subTypes}}
				</ul>
			</div>
			<div class="col-md-6">
				<ul>
					{{#items}}
						<li class="{{checked}}" on-click="toggleStatus">{{label}}</li>
					{{/items}}
				</ul>
			</div>
		</div>

		<div class="row">
			<button class="btn btn-primary">确定</button>
			<button class="btn btn-default" on-click="closePanel">取消</button>
		</div>
	</div>
	{{/isOpen}}
</div>
