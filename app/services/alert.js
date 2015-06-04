import Ember from "ember";

export default Ember.Service.extend({

  show: function(message, okCallback) {

    // function to find blank div
    Ember.$.expr[':'].blank = function(obj){
      return obj.innerText.trim().length === 0;
    };

    // todo use ember approach to implementing this
    var alertView = this.container.lookup("view:alert").append();
    Ember.run.schedule("afterRender", function() {
      Ember.$("#errorMessage").text(message);

      // workaround https://github.com/zurb/foundation/issues/5721
      Ember.$("#errorModal").removeClass("open");

      Ember.$("#errorModal").foundation("reveal", "open");

      // empty ember-view has minimum height of 100%, so removing them to
      // to avoid un-necessary long page.
      Ember.$(".loading-indicator").parent('.ember-view').remove();
      $('.ember-view:blank').remove();

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
