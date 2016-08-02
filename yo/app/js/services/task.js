// Filename: services/task.js
define([
	'jquery',
	'models/session',
	'models/itemList',
	'models/task',
	'models/taskConditionClass',
	'models/taskActionClass'
], function($, session, ItemList, Task, TaskConditionClass, TaskActionClass) {
	return {

		getActionClasses: function(ctx, success, error) {
			var url = session.getSelectedHub().get('actionClasses')['@id'] + '?expand=item&constraints=true';
			new ItemList(null, {model: TaskActionClass, url: url, sort: 'name'}).fetch({
				context: ctx,
				success: success,
				error: error
			});
		},

		getConditionClasses: function(ctx, success, error) {
			var url = session.getSelectedHub().get('conditionClasses')['@id'] + '?expand=item&constraints=true';
			new ItemList(null, {model: TaskConditionClass, url: url, sort: 'name'}).fetch({
				context: ctx,
				success: success,
				error: error
			});
		},

		// returns a property container class with a specific id from a collection of property container classes
		findPropertyContainerClass: function(classes, id) {
			for (var i=0; i < classes.length; i++) {
				var pcc = classes.at(i);
				if (pcc.get('@id') === id) {
					return pcc;
				}
			}
		},

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
		},

		getTask: function(ctx, url, success, error) {
			var task = new Task({url: url + '?expand=conditions,actionSet'});
			task.fetch({
				context: ctx,
				success: success,
				error: error
			});
		},

		getTaskTriggerConditionIndex: function(taskConditions, conditionClasses) {
			for (var i=0; i < taskConditions.length; i++) {
				var c = taskConditions[i];
				var cc = this.findPropertyContainerClass(conditionClasses, c['@id']);
				if (cc.get('type') === 'trigger') {
					return i;
				}
			}
			return -1;
		},

		createNewTask: function() {
			return new Task({url: session.getSelectedHub().get('tasks')['@id']});
		},

    executeTask: function(ctx, url, success, error) {
      $.ajax(url, {
        context: ctx,
        type: 'POST',
        success: function(data, status, response) {
          success();
        },
        error: function(response, status, error) {
          error();
        }
      });
    }

	};
});
