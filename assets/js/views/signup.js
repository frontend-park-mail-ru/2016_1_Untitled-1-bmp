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
      this.inputs = {
        'password': this.$el.find('#js-signup-form__password'),
        'login': this.$el.find('#js-signup-form__login'),
        'email': this.$el.find('#js-signup-form__email')
      };
      this.errorFields = {
        'password': this.$el.find('.js-signup-form__password-error'),
        'login': this.$el.find('.js-signup-form__login-error'),
        'email': this.$el.find('.js-signup-form__email-error')
      };
    },

    render: function() {
      var html = this.template();
      this.$el.html(html);
    },

    submit: function(e) {
      e.preventDefault();

      var uData = {
        login: this.inputs.login.val(),
        email: this.inputs.email.val(),
        password: this.inputs.password.val()
      };

      var u = new User();
      var errors = u.validate(uData);

      _.each(this.errorFields, function(item) {
        item.text('');
      });

      _.each(this.inputs, function(item) {
        item.parent().removeClass('signup-form__field_error');
      });

      if(errors != undefined && errors.length) {
        var errorFields = this.errorFields;
        var inputs = this.inputs;
        _.each(errors, function(error) {
          if(errorFields[error.field] !== undefined) {
            errorFields[error.field].text(error.error);
            inputs[error.field].parent().addClass('signup-form__field_error');
          }
        });
      }
      else
      {
        alert('submit!');
      }
      return false;
    },

    show: function(parent) {
      this.trigger('show')
      this.delegateEvents();
      parent.html(this.el);
    },

    hide: function() {
    }
  });

  return SignupView;
});
