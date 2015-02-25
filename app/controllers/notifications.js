import Ember from "ember";
import messagesUtil from "../utils/messages";

export default Ember.ArrayController.extend({
  sortProperties: ["date"],
  sortAscending: true,

  nextNotification: function() {
    //retrieveNotification is not implemented here because it needs to call itself
    return this.retrieveNotification();
  }.property("[]"),

  retrieveNotification: function(index) {
    // not sure why but model.firstObject is undefined when there's one notification
    var notification = this.get("model")[index || 0];
    if (!notification) {
      return null;
    }

    this.setRoute(notification);

    // if current url matches notification view action url then dismiss notification
    var router = this.get("target");
    var currentUrl = router.get("url");
    var actionUrl = router.generate.apply(router, notification.route);

    if (currentUrl === actionUrl) {
      this.removeObject(notification);
      return this.retrieveNotification(index);
    }

    return notification;
  },

  itemImageUrl: function() {
    var itemId = this.get("nextNotification.entity.item_id");
    return itemId ? this.store.getById("item", itemId).get("displayImageUrl") : null;
  }.property("nextNotification"),

  showItemImage: Ember.computed.notEmpty("itemImageUrl"),

  senderImageUrl: function() {
    var notification = this.get("nextNotification");
    if (!notification) { return null; }
    var userId = notification.entity_type === "message" ?
      notification.entity.sender_id :
      notification.entity.created_by_id;
    return this.store.getById("user", userId).get("displayImageUrl");
  }.property("nextNotification"),

  setRoute: function(notification) {
    if (notification.entity_type === "message") {
      notification.route = messagesUtil.getRoute(this.container, notification.entity);
    } else if (notification.entity_type === "offer") {
      var routeName = this.get("session.currentUser.isDonor") ? "offer" : "review_offer";
      notification.route = [routeName, notification.entity.id];
    }
  },

  actions: {
    view: function() {
      var notification = this.get("nextNotification");
      this.removeObject(notification);
      this.transitionToRoute.apply(this, notification.route);
    }
  }
});
