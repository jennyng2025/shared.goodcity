import Ember from 'ember';
import config from '../config/environment';

export default function(url, type, authToken, data, args) {
  return new Ember.RSVP.Promise(function(resolve, reject) {
    Ember.$.ajax(Ember.$.extend({}, {
      type: type,
      dataType: "json",
      data: data,
      url: url.indexOf('http') === -1 ? config.APP.SERVER_PATH + url : url,
      headers: authToken ? { Authorization: "Bearer " + authToken } : {},
      success: function(data) { Ember.run(function() { resolve(data); }); },
      error: function(jqXHR) {
        jqXHR.url = url;
        Ember.run(function() { reject(jqXHR); });
      }
    }, args));
  });
}
