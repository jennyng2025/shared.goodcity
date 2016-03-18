import Ember from "ember";

export default Ember.Component.extend({

  animateNotification: Ember.observer('currentController.model.[]', function () {
    var box = Ember.$(".contain-to-grid.notification");
    var notification = this.get("currentController").retrieveNotification();

    if (!notification) { box.hide(); return; }
    if (box.is(":hidden")) {
      box.slideDown();
      Ember.$(".sticky_title_bar").animate({
            top : '5%',
        }, 400);
      Ember.run.later(this, this.removeNotification, notification, 6000);
    }
  }).on("didInsertElement"),

  removeNotification: function(notification) {
    var controller = this.get("currentController");
    if(controller) {
      var remove = function() { controller.get("model").removeObject(notification); };
      var newNotification =  controller.retrieveNotification(1);
      if (newNotification) {
        remove();
        Ember.run.later(this, this.removeNotification, newNotification, 6000);
      } else {
        Ember.$(".contain-to-grid.notification").slideUp(400, remove);
        Ember.$(".sticky_title_bar").animate({
              top : '0',
          }, 400);
      }
    }
  }
});
