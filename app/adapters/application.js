import Ember from 'ember';
import config from '../config/environment';
import ActiveModelAdapter from 'active-model-adapter';

export default ActiveModelAdapter.extend({

  // Ember Data 2.0 Reload behavior
  // shouldReloadRecord: function() { return true; },
  // shouldReloadAll: function() { return true; },
  // shouldBackgroundReloadRecord: function() { return true; },
  // shouldBackgroundReloadAll: function() { return true; },

  namespace: config.APP.NAMESPACE,
  host:      config.APP.API_HOST_URL,
  session:   Ember.inject.service(),

  headers: Ember.computed("session.authToken", function(){
    return {
      "Authorization":  'Bearer ' + this.get('session.authToken'),
      "Accept-Language": this.get('session.language'),
      "X-GOODCITY-APP-NAME": config.APP.NAME,
      "X-GOODCITY-APP-VERSION": config.APP.VERSION,
      "X-GOODCITY-APP-SHA": config.APP.SHA,
      "X-GOODCITY-APP-SHARED-SHA": config.APP.SHARED_SHA
    };
  })
});
