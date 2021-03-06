// Filename: views/data/dataTab.js
define([
  'jquery',
  'underscore',
  'backbone',
  'toastr',
  'services/hub',
  'views/collection/dataStreams',
  'i18n!nls/strings',
  'text!templates/data/dataTab.html'
], function ($, _, Backbone, toastr, HubService, DataStreamsView, strings, dataTemplate) {
  return Backbone.View.extend({

    template: _.template(dataTemplate),

    events: {
      'viewDataStream': 'onViewDataStream',
      'deleteDataStream': 'onDeleteDataStream'
    },

    render: function () {
      this.$el.html(this.template({
        strings: strings
      }));

      HubService.getDataStreams(this, function (ctx, model) {
        if (this.dsView) {
          this.dsView.remove();
        }
        ctx.dsView = new DataStreamsView({model: model});
        ctx.$el.find('.data').html(
          ctx.dsView.render().el
        );
      }, function () {
        toastr.error(strings.ErrorOccurred);
      });


      return this;
    },

    onViewDataStream: function (event, ds) {
      var id = ds.get('@id');
      Backbone.history.navigate('#data/' + encodeURIComponent(id) + '/view', {trigger: true});
    },

    onDeleteDataStream: function (event, ds) {
      if (confirm(strings.AreYouSureYouWantToDelete + ' \"' + ds.get('name') + '\"?')) {
        UserService.deleteDataStream(this, ds.get('@id'), function () {
          toastr.success(strings.DataStreamDeleted);
          this.render();
        }, function () {
          toastr.error(strings.ErrorOccurred);
        });
      }
    }
  });
});
