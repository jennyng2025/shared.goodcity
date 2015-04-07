import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Controller.extend({
  info: function() {
    var emailLink = "<a href='mailto:" + config.APP.CONTACT_EMAIL + "'>" + config.APP.CONTACT_EMAIL + "</a>";
    var infoText = Ember.I18n.t("collection_charges.info", {"email":emailLink});
    return "<div>" + infoText.replace(/\n\n/g, "</div><div>") + "</div>";
  }.property()
});
