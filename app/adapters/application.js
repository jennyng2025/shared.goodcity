import Ember from 'ember';
import config from '../config/environment';
import ActiveModelAdapter from 'active-model-adapter';

export default ActiveModelAdapter.extend({
  namespace: config.APP.NAMESPACE,
  host:      config.APP.API_HOST_URL,
  session:   Ember.inject.service(),
  headers: function() {
    return {
      "Authorization":  'Bearer ' + this.get('session.authToken'),
      "Accept-Language": this.get('session.language'),
      "X-GOODCITY-APP-NAME": config.APP.NAME,
      "X-GOODCITY-APP-VERSION": config.APP.VERSION,
      "X-GOODCITY-APP-SHA": config.APP.SHA
    };
  }.property("session.authToken")
});
