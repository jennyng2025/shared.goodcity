import Ember from 'ember';
import config from '../config/environment';

export default Ember.Controller.extend({
  needs: ['subscriptions'],

  initSubscriptions: function() {
    if (this.session.get("isLoggedIn")) {
      this.send('setSubscriptions');
    }
  }.on("init"),

  actions: {
    logMeOut: function(){
      this.session.clear(); // this should be first since it updates isLoggedIn status
      this.get('controllers.subscriptions').send('unwire');
      this.store.init();
      var _this = this;
      config.APP.PRELOAD_TYPES.forEach(function(type) {
        _this.store.find(type);
      });
      this.transitionToRoute('login');
    },
    logMeIn: function() {
      this.send('setSubscriptions');
    },
    setSubscriptions: function() {
      this.get('controllers.subscriptions').send('wire');
    }
  }
});
