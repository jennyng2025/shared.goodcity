import Ember from "ember";

export default Ember.Service.extend({
  show: function(message, successCallback) {

    // todo use ember approach to implementing this
    var confirmView = this.container.lookup("view:confirm").append();
    var _this = this;
    Ember.run.schedule("afterRender", function() {
      var value;
      Ember.$("#confirmMessage").html(message);

      // workaround https://github.com/zurb/foundation/issues/5721
      Ember.$("#confirmModal").removeClass("open");
      Ember.$("#confirmModal").foundation("reveal", "open");
      Ember.$(".loading-indicator").remove();

      Ember.$("#confirmModal .cancel").click(() => {
        _this.closeModal(confirmView);
      });
      Ember.$("#confirmModal .ok").click(() => {
        _this.closeModal(confirmView);
        successCallback();
      });
    });
  },

  closeModal: function(confirmView) {
    Ember.run.next(function() {
      Ember.$("#confirmModal").foundation("reveal", "close");
      confirmView.destroy();
    })
  }
});
