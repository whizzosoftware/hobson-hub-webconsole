// Filename: views/plugins.js
define([
	'jquery',
	'underscore',
	'backbone',
  'services/event',
	'views/settings/plugin',
	'i18n!nls/strings'
], function($, _, Backbone, EventService, PluginView, strings) {

	return Backbone.View.extend({

		tagName: 'ul',

		className: 'plugins small-block-grid-1 medium-block-grid-2 large-block-grid-3',

		initialize: function(options) {
			this.subviews = {};
			this.showLocal = options.showLocal;
			this.noPluginsPrompt = false;

      // listen for devVarsUpdate events and pass along if applicable
      this.subscription = this.onPluginStatusChange.bind(this);
      EventService.subscribe('pluginStatusChange', this.subscription);
		},

		remove: function() {
      EventService.unsubscribe(this.subscription);
			for (var ix in this.subviews) {
				this.subviews[ix].remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			var p;
			if (this.model.length > 0) {
				for (var i = 0; i < this.model.length; i++) {
					this.addPluginView(this.model.at(i));
				}
			} else {
				if (this.showLocal) {
					this.$el.html('<p class="notice">' + strings.NoPluginsInstalled + '</p>');
				} else {
					this.$el.html('<p class="notice">' + strings.NoPluginsAvailable + '</p>');
				}
				this.noPluginsPrompt = true;
			}

			return this;
		},

		reRender: function(plugins) {
			if (plugins.length > 0) {
				if (this.noPluginsPrompt) {
					this.$el.html('');
					this.noPluginsPrompt = false;
				}
				for (var ix=0; ix < plugins.length; ix++) {
					var plugin = plugins[ix];
					var view = this.subviews[plugin.get('@id')];
					if (view) {
						view.reRender(plugin);
					} else {
						this.addPluginView(plugin);
					}
				}
			}
		},

		addPluginView: function(plugin) {
			var pluginView = new PluginView({model: plugin});
			this.subviews[plugin.get('@id')] = pluginView;
			this.$el.append(pluginView.render().el);
		},

    onPluginStatusChange: function(event) {
		  if (event.status.code === 'INITIALIZING' || event.status.code === 'RUNNING') {
        for (var i in this.subviews) {
          var model = this.subviews[i].model;
          if (model.get('pluginId') == event.pluginId) {
            var code = model.get('status')['code'];
            model.set('status', event.status);
            if (code === 'NOT_CONFIGURED') {
              this.subviews[i].render();
            } else if (code === 'NOT_INSTALLED') {
              const v = this.subviews[i];
              v.$el.fadeOut(250, function () {
                v.remove();
              });
              break;
            }
          }
        }
      }
    }

  });

});
