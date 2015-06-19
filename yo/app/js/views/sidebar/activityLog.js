// Filename: views/activityLog.js
define([
	'jquery',
	'underscore',
	'backbone',
	'moment',
	'views/sidebar/activityLogEntry',
	'i18n!nls/strings'
], function($, _, Backbone, moment, ActivityLogEntryView, strings) {

	var ActivitiesView = Backbone.View.extend({
		tagName: 'table',

		className: 'activities',

		attributes: {
			'width': '100%'
		},

		subviews: [],

		remove: function() {
			for (var i = 0; i < this.subviews.length; i++) {
				this.subviews[i].remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			var lastHeaderString = null;
			var lastTimeString = null;
			var now = moment();
			var yesterday = moment().subtract(1, 'day');
			for (var i = 0; i < this.model.length; i++) {
				var activity = this.model.at(i);
				var activityTime = moment(activity.get('timestamp'));
				var newHeader = this.formatDate2(activityTime, now, yesterday);
				if (!lastHeaderString || lastHeaderString !== newHeader) {
					this.$el.append('<tr><td></td><td class="header"><h2>' + newHeader + '</h2></td></tr>');
					lastHeaderString = newHeader;
				}
				if (activity) {
					var timeString = activityTime.format('h:mm A');
					var activityView = new ActivityLogEntryView({model: activity, timeString: (timeString !== lastTimeString) ? timeString : ''});
					if (lastTimeString !== timeString) {
						lastTimeString = timeString;
					}
					this.$el.append(activityView.render().el);
					this.subviews.push(activityView);
				}
			}
			return this;
		},

		formatDate2: function(time, now, yesterday) {
			if (time.isSame(now, 'day')) {
				return 'Today';
			} else if (time.isSame(yesterday, 'day')) {
				return 'Yesterday';
			} else {
				return time.format('dddd, MMMM D');
			}
		},

		formatDate: function (MMDD) {
		    MMDD = new Date(MMDD);

		    var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		    var strDate = "";

		    var today = new Date();
		    today.setHours(0, 0, 0, 0);

		    var yesterday = new Date();
		    yesterday.setHours(0, 0, 0, 0);
		    yesterday.setDate(yesterday.getDate() - 1);

		    var tomorrow = new Date();
		    tomorrow.setHours(0, 0, 0, 0);
		    tomorrow.setDate(tomorrow.getDate() + 1);

		    console.log(MMDD.getTime(),today.getTime(),MMDD.getTime()==today.getTime());

		    if (MMDD.getTime() >= today.getTime() && MMDD.getTime() < today.getTime() + 86400000) {
		        strDate = "Today";
		    } else if (MMDD.getTime() >= yesterday.getTime() && MMDD.getTime() < yesterday.getTime() + 86400000) {
		        strDate = "Yesterday";
		    } else if (tomorrow.getTime() == MMDD.getTime()) {
		        strDate = "Tomorrow";
		    } else {
		        strDate = months[MMDD.getMonth()] + "-" + MMDD.getDate();
		    }

		    return strDate;
		}
	});

	return ActivitiesView;
});