import Ember from 'ember';
import config from '../config/environment';

export default Ember.Controller.extend({
  subscriptions: Ember.inject.controller(),
  cordova: Ember.inject.service(),

  initSubscriptions: function() {
    if (this.session.get("isLoggedIn")) {
      this.send('setSubscriptions');
    }
  }.on("init"),

  actions: {
    logMeOut: function(){
      if (config.cordova.enabled) {
        this.get("cordova").unregisterDevice();
      }
      this.session.clear(); // this should be first since it updates isLoggedIn status
      this.get('subscriptions').send('unwire');
      this.store.init();
      var _this = this;
      config.APP.PRELOAD_TYPES.forEach(function(type) {
        _this.store.findAll(type);
      });
      this.transitionToRoute('login');
    },
    logMeIn: function() {
      this.send('setSubscriptions');
    },
    setSubscriptions: function() {
      this.get('subscriptions').send('wire');
    }
  }
});
