import Ember from "ember";

export default Ember.Component.extend({

  animateNotification: Ember.observer('_controller.[]', function () {
    var box = Ember.$(".contain-to-grid.notification");
    var notification = this.get("_controller.nextNotification");
    var hasCustomNavbar = Ember.$('.custom_nav').length;

    if (!notification) { box.hide(); return; }
    if (box.is(":hidden")) {
      if(hasCustomNavbar) {
        box.show();
      } else {
        box.slideDown();
      }
      Ember.run.later(this, this.removeNotification, notification, 6000);
    }
  }).on("didInsertElement"),

  removeNotification: function(notification) {
    var controller = this.get("_controller");
    if(controller) {
      var remove = function() { controller.removeObject(notification); };
      var newNotification =  controller.retrieveNotification(1);
      if (newNotification) {
        remove();
        Ember.run.later(this, this.removeNotification, newNotification, 6000);
      } else {
        var hasCustomNavbar = Ember.$('.custom_nav').length;

        if(hasCustomNavbar) {
          Ember.$(".contain-to-grid.notification").hide();
        } else {
          Ember.$(".contain-to-grid.notification").slideUp(400, remove);
        }
      }
    }
  }
});
