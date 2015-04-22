import Ember from 'ember';

export default Ember.View.extend({
  templateName: 'loading',
  alert: Ember.inject.service(),
  logger: Ember.inject.service(),
  timer: null,

  onInit: function() {
    this.set("timer", Ember.run.later(() => {
      this.get("logger").error(new Error("Loading view timeout reached."));
      this.get("alert").show(Ember.I18n.t("loading_timeout"), () => {
        this.destroy();
        window.location.reload();
      });
    }, 30000));
  }.on("init"),

  willDestroyElement: function() {
    Ember.run.cancel(this.get("timer"));
  }
});
