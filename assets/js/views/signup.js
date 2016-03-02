define(function(require) {
  var Backbone = require('backbone');
  var User = require('models/user');

  var SignupView = Backbone.View.extend({
    events: {
      'submit .signup-form': 'submit'
    },

    initialize: function() {
      this.template = require('templates/signup');
      this.render();
      this.$name = this.$el.find('.signup-form__name');
      this.$login = this.$el.find('.signup-form__login');
      this.$email = this.$el.find('.signup-form__email');
    },

    render: function() {
      var html = this.template();
      this.$el.html(html);
    },

    submit: function(e) {
      e.preventDefault();

      var uData = {
        name: this.$name.val(),
        login: this.$login.val(),
        email: this.$email.val()
      };

      var u = new User();
      var errors = u.validate(uData);

      $([this.$name, this.$login, this.$email]).parent().removeClass('has-error');
      _.each(['name', 'login', 'email'], function(field) {
        $('.signup-form__' + field + '-error').text('');
      });

      if(errors != undefined && errors.length > 0) {
        _.each(errors, function(error) {
          $('.signup-form__' + error.field).parent().addClass('has-error');
          $('.signup-form__' + error.field + '-error').text(error.error);
        });
      }
      else
      {
        alert('submit!');
      }
    }
  });

  return new SignupView();
});
