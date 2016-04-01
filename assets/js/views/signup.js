define(function(require) {
  var Backbone = require('backbone');
  var User = require('models/user');
  var template = require('templates/signup');
  var app = require('app');

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
      this.button = this.$el.find('.js-signup-form__button');
    },

    render: function() {
      var html = this.template();
      this.$el.html(html);
    },

    clearErrors: function() {
      _.each(this.errorFields, function(item) {
        item.text('');
      });

      _.each(this.inputs, function(item) {
        item.parent().removeClass('signup-form__field_error');
      });
    },

    handleError: function(error) {
      if(this.errorFields[error.field] !== undefined) {
        this.errorFields[error.field].text(error.error);
        this.inputs[error.field].parent().addClass('signup-form__field_error');
      }
    },

    submit: function(e) {
      e.preventDefault();

      var uData = {
        login: this.inputs.login.val(),
        email: this.inputs.email.val(),
        password: this.inputs.password.val()
      };

      this.clearErrors();

      var u = new User();
      var errors = u.validate(uData);

      if(errors != undefined && errors.length) {
        _.each(errors, (function(error) {
          this.handleError(error);
        }).bind(this));
      }
      else
      {
        this.button.prop('disabled', true);
        var user = app.getUser();

        user.once('register', (function(result) {
          this.button.prop('disabled', false);
          if(!result.result) {
            this.handleError(result.error);
          }
        }).bind(this));

        user.register(uData);
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
