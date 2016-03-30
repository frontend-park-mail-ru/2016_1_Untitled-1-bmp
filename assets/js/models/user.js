define(function(require) {
  var $ = require('jquery');
  var Backbone = require('backbone');

  var User = Backbone.Model.extend({
    defaults: {
      login: 'guest',
      email: ''
    },

    urlRoot: '/api/user',

    initialize: function() {
    },

    validate: function(attrs, options) {
      var errors = [];

      _.each(['login', 'email'], function(v) {
        if(attrs[v] === undefined) {
          attrs[v] =  '';
        }
        attrs[v] = $.trim(attrs[v]);
      });


      if(attrs.login === '') {
        errors.push({
          field: 'login',
          error: 'Вы не указали логин'
        });
      }

      var emailRegexp = /^[-a-z0-9!#$%&'*+/=?^_`{|}~]+(\.[-a-z0-9!#$%&'*+/=?^_`{|}~]+)*@([a-z0-9]([-a-z0-9]{0,61}[a-z0-9])?\.)*(aero|arpa|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|[a-z][a-z])$/;

      if(attrs.email === '') {
        errors.push({
          field: 'email',
          error: 'Вы не указали email'
        });
      }
      else if(!emailRegexp.test(attrs.email)) {
        errors.push({
          field: 'email',
          error: 'Вы указали некорректный email'
        });
      }

      // password is optional
      if(attrs.password != undefined) {
        if(attrs.password.length < 6) {
          errors.push({
            field: 'password',
            error: 'Пароль слишком короткий'
          });
        }
      }

      if(errors.length) {
        return errors;
      }
    },

    register: function(attrs, cb) {
      if(this.isNew()) {
        this.save(attrs, {
          success: (function(obj, result) {
            this.trigger('register_success', result);
            this.fetch();
            if(typeof cb == 'function') {
              cb(true);
            }
          }).bind(this),
          error: function(obj, result) {
            this.trigger('register_fail', result);
            if(typeof cb == 'function') {
              cb(false);
            }
          }
        });
      }
    }
  });

  return User;
});
