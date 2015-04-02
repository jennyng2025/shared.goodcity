import Ember from "ember";

export default Ember.Service.extend({
  show: function(message) {
    // todo use ember approach to implementing this
    var alertView = this.container.lookup("view:alert").append();
    Ember.run.schedule("afterRender", function() {
      Ember.$("#errorMessage").text(message);
      Ember.$("#errorModal").foundation("reveal", "open");
      Ember.$(".loading-indicator").hide();
      Ember.$("#errorModal .button").click(() => {
        Ember.$("#errorModal").foundation("reveal", "close");
        alertView.destroy();
      });
    });
  }
});
