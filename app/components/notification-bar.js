import Ember from "ember";

export default Ember.Component.extend({

  animateNotification: Ember.observer('_controller.[]', function () {
    var box = Ember.$(".contain-to-grid");
    var notification = this.get("_controller.nextNotification");
    if (!notification) { box.hide(); return; }
    if (box.is(":hidden")) {
      box.slideDown();
      Ember.run.later(this, this.removeNotification, notification, 6000);
    }
  }).on("didInsertElement"),

  removeNotification: function(notification) {
    var controller = this.get("_controller");
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
