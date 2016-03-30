define(function(require) {
  var Backbone = require('backbone');
  var template = require('templates/login');
  var app = require('app');

  var LoginView = Backbone.View.extend({
    events: {
      'submit .login-form': 'submit'
    },

    initialize: function() {
      this.template = template;
      this.render();
      this.inputs = {
        'password': this.$el.find('#js-login-form__password'),
        'login': this.$el.find('#js-login-form__login')
      };
      this.errorFields = {
        'password': this.$el.find('.js-login-form__password-error'),
        'login': this.$el.find('.js-login-form__login-error')
      };
      this.button = this.$el.find('.js-login-form__button');
    },

    render: function() {
      var html = this.template();
      this.$el.html(html);
    },

    submit: function(e) {
      e.preventDefault();

      var uData = {
        login: this.inputs.login.val(),
        password: this.inputs.password.val()
      };

      var session = app.getSession();
      var errors = session.validate(uData);

      _.each(this.errorFields, function(item) {
        item.text('');
      });

      _.each(this.inputs, function(item) {
        item.parent().removeClass('login-form__field_error');
      });

      if(errors != undefined && errors.length) {
        var errorFields = this.errorFields;
        var inputs = this.inputs;
        _.each(errors, function(error) {
          if(errorFields[error.field] !== undefined) {
            errorFields[error.field].text(error.error);
            inputs[error.field].parent().addClass('login-form__field_error');
          }
        });
      }
      else
      {
        this.button.prop('disabled', true);

        session.once('auth_success', (function(data) {
          Backbone.history.navigate("", { trigger: true });
        }).bind(this));

        session.tryLogin(uData.login, uData.password);
      }
      return false;
    },

    show: function(parent) {
      this.trigger('show');
      parent.html(this.el);
    },

    hide: function() {
    }
  });

  return LoginView;
});
