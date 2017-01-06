// Filename: views/navbar.js
define([
  'jquery',
  'underscore',
  'backbone',
  'toastr',
  'services/auth',
  'services/event',
  'services/hub',
  'models/session',
  'views/powerOffConfirm',
  'i18n!nls/strings',
  'text!templates/navbar.html'
], function ($, _, Backbone, toastr, AuthService, EventService, HubService, session, PowerOffConfirmView, strings, navbarTemplate) {
  return Backbone.View.extend({

    template: _.template(navbarTemplate),

    events: {
      'click #sidebar-button': 'onClickSidebar',
      'click #power-button': 'onClickPowerOff',
      'click #logout': 'onClickLogout',
      'click #away-button': 'onAway'
    },

    initialize: function () {
      this.subscription = this.onVarUpdate.bind(this);
      this.subscription2 = this.onHubConfigUpdate.bind(this);
      EventService.subscribe('taskExecute', this.subscription);
      EventService.subscribe('hubConfigurationUpdate', this.subscription2);
    },

    remove: function () {
      EventService.unsubscribe(this.subscription);
      EventService.unsubscribe(this.subscription2);
      Backbone.View.prototype.remove.call(this);
    },

    onVarUpdate: function (event) {
      toastr.info('Task executed: ' + event.name);
    },

    onHubConfigUpdate: function(event) {
      var t = this.$el;
      if (event && event.configuration && event.configuration.away) {
        t.find('#home-label-container').fadeOut('fast', function() {
          t.find('#away-label-container').fadeIn('fast', function() {
            t.find('#away-button').addClass('away');
          });
        });
        this.away = true;
      } else  {
        t.find('#away-label-container').fadeOut('fast', function() {
          t.find('#home-label-container').fadeIn('fast', function() {
            t.find('#away-button').removeClass('away');
          });
        });
        this.away = false;
      }
    },

    render: function () {
      HubService.getHubConfiguration(this, function(model, response, options) {
        options.context.away = model.get('values') ? model.get('values')['away'] : false;
        options.context.$el.html(
          options.context.template({
            strings: strings,
            user: session.hasUser() ? session.getUser().toJSON() : null,
            hub: session.hasSelectedHub() ? session.getSelectedHub().toJSON() : null,
            away: options.context.away,
            showDataStreams: session.hasDataStreams(),
            showAccount: session.showAccount(),
            showActivityLog: session.showActivityLog(),
            showPowerOff: session.showPowerOff(),
            fragment: Backbone.history.getFragment()
          })
        );
      });

      return this;
    },

    updateTabs: function () {
      var fragment = Backbone.history.getFragment();
      this.$el.find('.subnav-item a').each(function (index, e) {
        var el = $(e);
        if (fragment.indexOf(el.attr('id')) > -1) {
          el.addClass('active');
        } else {
          el.removeClass('active');
        }
      });
    },

    onClickSidebar: function () {
      $.sidr('toggle', 'sidr');
    },

    onClickPowerOff: function () {
      var url = session.hasSelectedHub() && session.getSelectedHub().get('links') ? session.getSelectedHub().get('links').powerOff : null;
      if (url) {
        var el = this.$el.find('#power-off-modal');
        el.html(new PowerOffConfirmView({url: url}).render().el);
        el.foundation('reveal', 'open');
      }
    },

    onClickLogout: function () {
      AuthService.logout();
    },

    onAway: function(e) {
      HubService.setHubAwayMode(!this.away, function() {
      }.bind(this), function() {
        toastr.error(strings.ErrorOccurred);
      }.bind(this));
    }

  });

});
