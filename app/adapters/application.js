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

  // without this, error is wrapped like this {__reason_with_error_thrown__:jqXHR,message:"",stack:""}
  // it does add a stacktrace that would otherwise be missing but only relates to adapter
  // instead of calling code so not that useful
  ajaxError: function(jqXHR) {
    return this._super(jqXHR);
  }
});
