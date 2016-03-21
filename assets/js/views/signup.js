define(function(require) {
  var Backbone = require('backbone');
  var User = require('models/user');
  var template = require('templates/signup');

  var SignupView = Backbone.View.extend({
    events: {
      'submit .signup-form': 'submit'
    },

    initialize: function() {
      this.template = template;
      this.render();
      this.fields = {
        'name': this.$el.find('.signup-form__name'),
        'login': this.$el.find('.signup-form__login'),
        'email': this.$el.find('.signup-form__email')
      };
      this.errorFields = {
        'name': this.$el.find('.signup-form__name-error'),
        'login': this.$el.find('.signup-form__login-error'),
        'email': this.$el.find('.signup-form__email-error')
      };
    },

    render: function() {
      var html = this.template();
      this.$el.html(html);
    },

    submit: function(e) {
      e.preventDefault();

      var uData = {
        name: this.fields.name.val(),
        login: this.fields.login.val(),
        email: this.fields.email.val()
      };

      var u = new User();
      var errors = u.validate(uData);

      _.each(this.errorFields, function(item) {
        item.text('');
      });

      if(errors != undefined && errors.length) {
        var errorFields = this.errorFields;
        _.each(errors, function(error) {
          if(errorFields[error.field] !== undefined) {
            errorFields[error.field].text(error.error);
          }
        });
      }
      else
      {
        alert('submit!');
      }
    },

    show: function(parent) {
      this.trigger('show')
      parent.html(this.el);
    },

    hide: function() {
    }
  });

  return SignupView;
});
