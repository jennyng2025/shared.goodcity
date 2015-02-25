import Ember from 'ember';
import config from '../config/environment';

export default Ember.ObjectController.extend({
  needs: ['subscriptions'],

  isLoggedIn: Ember.computed.notEmpty('session.authToken'),
  currentLanguage: Ember.computed.readOnly('Ember.I18n.translations.language'),

  initSubscriptions: function() {
    if (this.get("isLoggedIn")) {
      this.send('setSubscriptions');
    }
  }.on("init"),

  actions: {
    logMeOut: function(){
      this.get('controllers.subscriptions').send('unwire');
      this.session.clear();
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
