// Filename: views/data/dataEdit.js
define([
  'jquery',
  'underscore',
  'backbone',
  'toastr',
  'services/hub',
  'views/data/dataStreamProperties',
  'i18n!nls/strings',
  'text!templates/data/dataEdit.html'
], function ($, _, Backbone, toastr, HubService, DataStreamProperties, strings, template) {

  return Backbone.View.extend({

    template: _.template(template),

    events: {
      'click #buttonCreate': 'onClickCreate'
    },

    initialize: function (options) {
      this.id = options ? options.id : null;
    },

    remove: function () {
      this.dataStreamPropertiesView.remove();
      Backbone.View.prototype.remove.call(this);
    },

    render: function () {
      this.$el.append(this.template({
        strings: strings,
        editMode: this.id
      }));

      this.dataStreamPropertiesView = new DataStreamProperties({
        dataStream: null
      });
      this.$el.find('#dataProperties').html(this.dataStreamPropertiesView.render().el);

      return this;
    },

    onClickCreate: function (e) {
      this.hideErrors();

      var name = this.$el.find('#dataStreamName').val();

      var errors = [];
      if (!name) {
        errors.push({message: strings.NeedsName});
      }
      if (this.dataStreamPropertiesView.model.length == 0) {
        errors.push({message: strings.NeedOneVariable});
      }

      if (errors.length > 0) {
        this.showErrors(this, errors);
      } else {
        // build data stream object
        var dataStream = {name: name, fields: []};
        for (var i in this.dataStreamPropertiesView.model) {
          dataStream.fields.push({
            name: this.dataStreamPropertiesView.model[i].name,
            variable: {
              '@id': this.dataStreamPropertiesView.model[i].variable['@id']
            }
          });
        }
        HubService.addDataStream(this, dataStream, function () {
          toastr.success(strings.DataStreamCreated);
        }, function (model, response, options) {
          if (response.status === 201) {
            toastr.success(strings.DataStreamCreated);
            Backbone.history.navigate('data', {trigger: true});
          } else if (response.status === 501) {
            toastr.error(strings.DataStreamCreationUnsupported);
          } else {
            toastr.error(strings.DataStreamCreationFailed);
          }
        });
      }
    },

    hideErrors: function () {
      this.$el.find('#error').css('display', 'none');
      this.$el.find('#errorMsg').html('');
    },

    showErrors: function (ctx, errors) {
      var msg = '<ul>';
      for (var i = 0; i < errors.length; i++) {
        msg += '<li>' + errors[i].message + '</li>';
      }
      msg += '</ul>';
      ctx.$el.find('#error').css('display', 'block');
      ctx.$el.find('#errorMsg').html(msg);
    }

  });

});
