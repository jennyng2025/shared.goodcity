import Ember from 'ember';
import '../computed/local-storage';
import config from '../config/environment';

export default Ember.Service.extend({
  authToken: Ember.computed.localStorage(),
  otpAuthKey: Ember.computed.localStorage(),
  isLoggedIn: Ember.computed.notEmpty("authToken"),
  language: Ember.computed.localStorage(),

  currentUser: Ember.computed(function(){
    var store = this.container.lookup('store:main');
    return store.peekAll('user_profile').get('firstObject') || null;
  }).volatile(),

  isAdminApp: Ember.computed(function(){
    return config.APP.NAME === "admin.goodcity";
  }),

  isDonorApp: Ember.computed('isAdminApp', function(){
    return this.get('isAdminApp') === false;
  }),

  clear: function() {
    this.set("authToken", null);
    this.set("otpAuthKey", null);
  }
});
