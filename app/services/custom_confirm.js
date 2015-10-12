import Ember from "ember";

export default Ember.Service.extend({
  show: function(message, button1_text, button2_text, successCallback, failureCallback) {
    // todo use ember approach to implementing this
    var confirmView = this.container.lookup("component:custom-confirm-box").append();
    var _this = this;
    Ember.run.schedule("afterRender", function() {
      var value;
      if (message.string) { message = message.string; } // unwrap SafeString object
      if (button1_text.string) { button1_text = button1_text.string; } // unwrap SafeString object
      if (button2_text.string) { button2_text = button2_text.string; } // unwrap SafeString object
      Ember.$("#customConfirmMessage").text(message);
      Ember.$("#customConfirmModal .action1").text(button1_text);
      Ember.$("#customConfirmModal .action2").text(button2_text);

      Ember.$("#customConfirmModal").removeClass("open"); // workaround https://github.com/zurb/foundation/issues/5721
      Ember.$("#customConfirmModal").foundation("reveal", "open");
      Ember.$(".loading-indicator").remove();
      Ember.$("#customConfirmModal .action1").click(() => {
        _this.closeModal(confirmView, failureCallback);
        // failureCallback();
      });
      Ember.$("#customConfirmModal .action2").click(() => {
        _this.closeModal(confirmView, successCallback);
      });
    });
  },

  closeModal: function(confirmView, callback) {
    Ember.run.next(function() {
      Ember.$("#customConfirmModal").foundation("reveal", "close");
      confirmView.destroy();
      callback();
    })
  }
});
