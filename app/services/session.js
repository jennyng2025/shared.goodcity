import Ember from 'ember';
import '../computed/local-storage';
import config from '../config/environment';

export default Ember.Service.extend({
  authToken: Ember.computed.localStorage(),
  otpAuthKey: Ember.computed.localStorage(),
  isLoggedIn: Ember.computed.notEmpty("authToken"),

  currentUser: function() {
    var store = this.container.lookup('store:main');
    return store.all('user_profile').get('firstObject') || null;
  }.property().volatile(),

  isAdminApp: function() {
    return config.APP.NAME === "admin.goodcity";
  }.property(),

  isDonorApp: function() {
    return this.get('isAdminApp') === false;
  }.property('isAdminApp'),

  clear: function() {
    this.set("authToken", null);
    this.set("otpAuthKey", null);
  },

  i18n: Ember.inject.service(),
  storedLanguage: Ember.computed.localStorage(),
  language: Ember.computed("storedLang", "i18n.locale", {
    get(key) {
      return this.get("storedLang") || this.get("i18n.locale");
    },
    set(key, value) {
      this.set("i18n.locale", value);
      this.set("storedLang", value);
    }
  })
});
