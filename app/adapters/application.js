import DS from 'ember-data';
import Ember from 'ember';
import config from '../config/environment';

export default DS.ActiveModelAdapter.extend({
  namespace: config.APP.NAMESPACE,
  host:      config.APP.API_HOST_URL,
  headers: function() {
    return {
      "Authorization":  'Bearer ' + this.get('session.authToken'),
      "Accept-Language": Ember.I18n.translations.language,
      "X-GOODCITY-APP-NAME": config.APP.NAME,
      "X-GOODCITY-APP-VERSION": config.APP.VERSION,
      "X-GOODCITY-APP-SHA": config.APP.SHA
    };
  }.property("session.authToken"),

  ajaxError: function(jqXHR){
    if (jqXHR && jqXHR.status === 500) {
      alert("Server Error. Please try again later.");
    }
    return this._super(jqXHR);
  }
});
