// Filename: views/navbar.js
define([
  'jquery',
  'underscore',
  'backbone',
  'toastr',
  'models/session',
  'services/auth',
  'services/event',
  'services/hub',
  'models/session',
  'views/powerOffConfirm',
  'i18n!nls/strings',
  'text!templates/navbar.html'
], function ($, _, Backbone, toastr, session, AuthService, EventService, HubService, session, PowerOffConfirmView, strings, navbarTemplate) {
  return Backbone.View.extend({

    template: _.template(navbarTemplate),

    events: {
      'click #sidebar-button': 'onClickSidebar',
      'click #power-button': 'onClickPowerOff',
      'click #logout': 'onClickLogout',
      'click #away-button': 'onAway'
    },

    initialize: function () {
      this.subscription = this.onVariableUpdate.bind(this);
      this.subscription2 = this.onHubConfigUpdate.bind(this);
      this.subscription3 = this.onWebsocketStatusUpdate.bind(this);
      EventService.subscribe('taskExecute', this.subscription);
      EventService.subscribe('hubConfigurationUpdate', this.subscription2);
      EventService.subscribe('websocketStatus', this.subscription3);
    },

    remove: function () {
      EventService.unsubscribe(this.subscription);
      EventService.unsubscribe(this.subscription2);
      EventService.unsubscribe(this.subscription3);
      Backbone.View.prototype.remove.call(this);
    },

    onVariableUpdate: function (event) {
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

    onWebsocketStatusUpdate: function(status) {
      this.doRender();
    },

    render: function () {
      HubService.getHubConfiguration(this, function(model, response, options) {
        this.model = model;
        this.doRender();
      }.bind(this));

      return this;
    },

    doRender: function() {
      if (this.model) {
        this.away = this.model.get('values') ? this.model.get('values')['away'] : false;
        this.$el.html(
          this.template({
            strings: strings,
            user: session.hasUser() ? session.getUser().toJSON() : null,
            hub: session.hasSelectedHub() ? session.getSelectedHub().toJSON() : null,
            away: this.away,
            showDataStreams: session.hasDataStreams(),
            showAccount: session.showAccount(),
            showActivityLog: session.showActivityLog(),
            showPowerOff: session.showPowerOff(),
            showWebsocketBroken: !session.getWebsocketStatus(),
            fragment: Backbone.history.getFragment()
          })
        );
      }
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
