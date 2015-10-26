import Ember from "ember";

export default Ember.View.extend({

  animateNotification: Ember.observer('controller.[]', function () {
    var box = Ember.$(".contain-to-grid.notification");
    var notification = this.get("controller.nextNotification");
    if (!notification) { box.hide(); return; }
    if (box.is(":hidden")) {
      box.slideDown();
      Ember.$(".contain-to-grid.message_nav_bar").addClass("slide_for_notification");
      Ember.run.later(this, this.removeNotification, notification, 6000);
    }
  }).on("didInsertElement"),

  removeNotification: function(notification) {
    var controller = this.get("controller");
    var remove = function() { controller.removeObject(notification); };
    var newNotification = controller.retrieveNotification(1);
    if (newNotification) {
      remove();
      Ember.run.later(this, this.removeNotification, newNotification, 6000);
    } else {
      Ember.$(".contain-to-grid.message_nav_bar").removeClass("slide_for_notification")
      Ember.$(".contain-to-grid.notification").slideUp(400, remove);
    }
  }
});
