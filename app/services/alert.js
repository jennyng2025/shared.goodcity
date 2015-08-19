import Ember from "ember";

export default Ember.Service.extend({

  show: function(message, okCallback) {

    // todo use ember approach to implementing this
    var alertView = this.container.lookup("view:alert").append();
    Ember.run.schedule("afterRender", function() {
      if (message.string) { message = message.string; } // unwrap SafeString object
      Ember.$("#errorMessage").text(message);

      // workaround https://github.com/zurb/foundation/issues/5721
      Ember.$("#errorModal").removeClass("open");
      Ember.$("#errorModal").foundation("reveal", "open");
      Ember.$(".loading-indicator").remove();

      $(document).trigger("cancel-loading-timer");
      Ember.$("#errorModal .button").click(() => {
        Ember.run.next(function() {
          Ember.$("#errorModal").foundation("reveal", "close");
          alertView.destroy();
          if (okCallback) {
            okCallback();
          }
        })
      });
    });
  }
});
