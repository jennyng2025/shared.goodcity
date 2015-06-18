import Ember from "ember";

export default Ember.Handlebars.makeBoundHelper(function(state) {
  switch(state) {
    case 'draft': return Ember.I18n.t("item_log.added");
    case 'submitted' : return Ember.I18n.t("item_log.added");
    case 'accepted' : return Ember.I18n.t("item_log.accepted");
    case 'rejected' : return Ember.I18n.t("item_log.rejected");
    default:  return Ember.I18n.t("item_log.edited");
  }
});
