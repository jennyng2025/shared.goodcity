import Ember from 'ember';

export default Ember.Controller.extend({

  i18n: Ember.inject.service(),

  info: Ember.computed(function(){
    var chargesInfo = this.get("i18n").t("gogovan_charges.info").string;
    return "<div>" + chargesInfo.replace(/\n\n/g, "</div><div>") + "</div>";
  })

});
