import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),

  info: Ember.computed(function(){
    var emailLink = "<a href='mailto:" + config.APP.CONTACT_EMAIL + "'>" + config.APP.CONTACT_EMAIL + "</a>";
    var infoText = this.get("i18n").t("collection_charges.info", {"email":emailLink});
    return "<div>" + infoText.replace(/\n\n/g, "</div><div>") + "</div>";
  })
});
