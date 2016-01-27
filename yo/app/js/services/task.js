// Filename: services/task.js
define([
	'jquery',
	'models/session',
	'models/itemList',
	'models/task'
], function($, session, ItemList, Task) {
	return {

		getTasks: function(ctx, success, error) {
			var url = session.getSelectedHub().get('tasks')['@id'] + '?expand=item';
			var tasks = new ItemList(
				null, 
				{url: url, model: Task}
			);
			tasks.fetch({
				context: ctx,
				success: function(model, response, options) {
					success(ctx, model);
				},
				error: function(model, response, options) {
					error('Error getting task list');
				}
			});
		}

	};
});