define(function(require) {
  var Backbone = require('backbone');
  var _ = require('underscore');

  var template = require('templates/user');

  var UserLoginView = require('views/user-login');
  var UserSignupView = require('views/user-signup');

  var UserView = Backbone.View.extend({
    events: {
      'click .js-tab-link': 'onTabLinkClick'
    },

    initialize: function() {
      this.template = template;
      this.tabs = {
        login:  {
          view: new UserLoginView(),
          title: 'Войти'
        },
        signup: {
          view: new UserSignupView(),
          title: 'Зарегистрироваться'
        }
      };

      this.isRendered = false;
    },

    onTabLinkClick: function(e) {
      var $link = $(e.target);
      this.tab($link.data('tab'));

      return false;
    },

    tab: function(tab) {
      if(this.tabs[tab] === undefined || this.activeTab === tab) {
        return;
      }

      this.$el.find('.js-tab-active, .js-tab-link-active')
        .removeClass('js-tab-active js-tab-link-active page-user__tab-menu-el_active page-user__tab_active');

      _.each(this.tabs, function(tab) {
        tab.view.hide();
      });

      this.$el.find('.js-tab[data-tab="' + tab + '"]')
        .addClass('js-tab-active page-user__tab_active');
      this.$el.find('.js-tab-link[data-tab="' + tab + '"]')
        .addClass('js-tab-link-active page-user__tab-menu-el_active');
      this.tabs[tab].view.show();

      this.activeTab = tab;

      var router = require('router');
      router.goSilent('user/' + tab);
    },

    render: function() {
      var html = this.template({
        tabs: _.map(this.tabs, function(tab, key) {
          return { title: tab.title, key: key };
        })
      });
      this.$el.html(html);

      _.each(this.tabs, function(tab, key) {
        this.$el.find('.js-tab[data-tab="' + key + '"]').append(tab.view.$el);
      }.bind(this));
    },

    show: function(loader) {
      if(!this.isRendered) {
        this.render();
        this.tab(_.keys(this.tabs).shift());
      }

      loader(function(cb) {
        this.trigger('show');
        this.$el.show();
        cb();
      }.bind(this));
    },

    hide: function() {
      this.$el.hide();
    },

    showUserPanel: function() {
      return false;
    }
  });

  return UserView;
});
