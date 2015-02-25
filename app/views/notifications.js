import Ember from "ember";

export default Ember.View.extend({
  animateNotification: function() {
    var box = Ember.$(".contain-to-grid");
    var notification = this.get("controller.nextNotification");
    if (!notification) { box.hide(); return; }
    if (box.is(":hidden")) {
      box.slideDown();
      Ember.run.later(this, this.removeNotification, notification, 6000);
    }
  }.observes("controller.[]").on("didInsertElement"),

  removeNotification: function(notification) {
    var controller = this.get("controller");
    var remove = function() { controller.removeObject(notification); };
    var newNotification = controller.retrieveNotification(1);
    if (newNotification) {
      remove();
      Ember.run.later(this, this.removeNotification, newNotification, 6000);
    } else {
      Ember.$(".contain-to-grid").slideUp(400, remove);
    }
  }
});
