import Ember from 'ember';
import './computed/local-storage';
import config from './config/environment';

export default Ember.Object.extend({
  authToken: Ember.computed.localStorage(),
  otpAuthKey: Ember.computed.localStorage(),
  language: Ember.computed.localStorage(),
  isLoggedIn: Ember.computed.notEmpty("authToken"),

  currentUser: function() {
    var store = this.container.lookup('store:main');
    return store.all('user_profile').get('firstObject') || null;
  }.property().volatile(),

  isAdmin: function() {
    return config.APP.NAME === "admin.goodcity";
  }.property(),

  clear: function() {
    this.set("authToken", null);
    this.set("otpAuthKey", null);
  },

  isAdmin: function(){
    return config.APP.NAME === 'admin.goodcity';
  }.property(),
});
