const { getOwner } = Ember;

export default Ember.Service.extend({
  i18n: Ember.inject.service(),

  alert: function(message, callback) {
    this.custom(message, this.get("i18n").t("okay"), callback);
  },

  confirm: function(message, callback) {
    this.custom(message, this.get("i18n").t("cancel"), null, this.get("i18n").t("okay"), callback);
  },

  custom: function(message, btn1Text, btn1Callback, btn2Text, btn2Callback) {
    $(document).trigger("cancel-loading-timer");
    Ember.$(".loading-indicator").remove();

    var view = getOwner(this).lookup("component:message-box").append();
    view.set("btn1Text", btn1Text);
    view.set("btn1Callback", btn1Callback);
    view.set("btn2Text", btn2Text);
    view.set("btn2Callback", btn2Callback);
    view.set("message", message);
  }
});
