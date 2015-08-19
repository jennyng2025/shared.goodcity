import Ember from 'ember';

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  info: function() {
    return "<div>" + this.get("i18n").t("gogovan_charges.info").replace(/\n\n/g, "</div><div>") + "</div>";
  }.property()
});
