import Ember from 'ember';

var cancelTimer;

export default Ember.View.extend({
  templateName: 'loading',
  alert: Ember.inject.service(),
  logger: Ember.inject.service(),

  didInsertElement: function() {
    var timer = Ember.run.later(() => {
      this.get("logger").error(new Error("Loading view timeout reached."));
      this.get("alert").show(Ember.I18n.t("loading_timeout"), () => {
        this.destroy();
        window.location.reload();
      });
    }, 30000);

    cancelTimer = () => Ember.run.cancel(timer);
    $(document).on("cancel-loading-timer", cancelTimer);
  },

  willDestroyElement: function() {
    cancelTimer();
    $(document).off("cancel-loading-timer", cancelTimer);
  }
});
