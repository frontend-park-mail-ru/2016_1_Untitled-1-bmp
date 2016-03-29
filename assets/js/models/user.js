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

      if(errors.length) {
        return errors;
      }
    },

    register: function(attrs) {
      this.save(attrs, {
        success: function() {
          console.log('success');
        },
        error: function() {
          console.log('error');
        }
      });
    }
  });

  return User;
});
