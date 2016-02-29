import Ember from 'ember';
import config from '../config/environment';

export default Ember.Controller.extend({

  cordova: Ember.inject.service(),
  subscriptions: Ember.inject.controller(),

  initSubscriptions: Ember.on('init', function() {
    if (this.session.get("isLoggedIn")) {
      this.send('setSubscriptions');
    }
  }),

  supportGCLink: Ember.computed('session.language', function(){
    return this.get('session.language') === 'zh-tw' ? "https://www.goodcity.hk/get_involved_zh.html" : "https://www.goodcity.hk/get_involved.html";
  }),

  appVersion: Ember.computed(function(){
    return config.cordova.enabled ? config.APP.VERSION : null;
  }),

  actions: {
    logMeOut() {
      this.session.clear(); // this should be first since it updates isLoggedIn status
      this.get('subscriptions').send('unwire');
      this.get('subscriptions').send('unloadNotifications');
      this.store.unloadAll();
      var _this = this;
      config.APP.PRELOAD_TYPES.forEach(function(type) {
        _this.store.findAll(type);
      });
      this.transitionToRoute('login');
    },

    logMeIn() {
      this.send('setSubscriptions');
    },

    setSubscriptions() {
      this.get('subscriptions').send('wire');
    }
  }
});
