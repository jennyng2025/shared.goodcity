import Ember from 'ember';
import '../computed/local-storage';
import config from '../config/environment';

export default Ember.Service.extend({
  authToken: Ember.computed.localStorage(),
  otpAuthKey: Ember.computed.localStorage(),
  isLoggedIn: Ember.computed.notEmpty("authToken"),
  language: Ember.computed.localStorage(),

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
  }
});
