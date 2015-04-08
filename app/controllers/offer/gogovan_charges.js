import Ember from 'ember';

export default Ember.Controller.extend({
  info: function() {
    return "<div>" + Ember.I18n.t("gogovan_charges.info").replace(/\n\n/g, "</div><div>") + "</div>";
  }.property()
});
