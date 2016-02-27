export default Ember.Service.extend({
  i18n: Ember.inject.service(),

  alert: function(message, callback) {
    this.custom(message, this.get("i18n").t("okay"), callback);
  },

  confirm: function(message, callback) {
    this.custom(message, this.get("i18n").t("okay"), callback, this.get("i18n").t("cancel"));
  },

  custom: function(message, btn1Text, btn1Callback, btn2Text,
    btn2Callback, messageComponent, messageModal) {

    Ember.$(".loading-indicator").remove();
    $(document).trigger("cancel-loading-timer");

    var view = this.container.lookup("component:message-box").append();
    view.set("btn1Text", btn1Text);
    view.set("btn1Callback", btn1Callback);
    view.set("btn2Text", btn2Text);
    view.set("btn2Callback", btn2Callback);
    view.set("message", message);
    view.set("messageComponent", messageComponent);
    view.set("messageModal", messageModal);
  }
});
