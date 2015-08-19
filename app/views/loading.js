import Ember from 'ember';

export default Ember.View.extend({
  templateName: 'loading',
  classNames: ["loading-indicator"],
  alert: Ember.inject.service(),
  logger: Ember.inject.service(),
  i18n: Ember.inject.service(),
  timer: null,

  didInsertElement: function() {
    var timer = Ember.run.later(() => {
      this.get("logger").error(new Error(this.get("i18n").t("loading_timeout_error")));
      this.get("alert").show(this.get("i18n").t("loading_timeout"), () => {
        this.destroy();
        window.location.reload();
      });
    }, 30000);

    this.set("timer", timer);
    $(document).on("cancel-loading-timer", () => Ember.run.cancel(timer));
  },

  willDestroyElement: function() {
    Ember.run.cancel(this.get("timer"));
    $(document).off("cancel-loading-timer");
  }
});
