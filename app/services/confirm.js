import Ember from "ember";

export default Ember.Service.extend({
  show: function(message, successCallback) {

    // function to find blank div
    Ember.$.expr[':'].blank = function(obj){
      return obj.innerText.trim().length === 0;
    };

    // todo use ember approach to implementing this
    var confirmView = this.container.lookup("view:confirm").append();
    var _this = this;
    Ember.run.schedule("afterRender", function() {
      var value;
      Ember.$("#confirmMessage").text(message);

      // workaround https://github.com/zurb/foundation/issues/5721
      Ember.$("#confirmModal").removeClass("open");
      Ember.$("#confirmModal").foundation("reveal", "open");

      // empty ember-view has minimum height of 100%, so removing them to
      // to avoid un-necessary long page.
      Ember.$(".loading-indicator").parent('.ember-view').remove();
      $('div.ember-view:blank').remove();

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
