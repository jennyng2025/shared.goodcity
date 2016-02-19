import Ember from "ember";
import AjaxPromise from './../utils/ajax-promise';

export default Ember.Controller.extend({
  sortProperties: ["date"],
  sortAscending: true,
  messagesUtil: Ember.inject.service("messages"),

  model: Ember.computed({
    get() {
      return [];
    },
    set(key, value) {
      return value;
    }
  }),

  nextNotification: Ember.computed('model.[]', function(){
    //retrieveNotification is not implemented here because it needs to call itself
    return this.retrieveNotification();
  }),

  retrieveNotification: function(index) {
    // not sure why but model.firstObject is undefined when there's one notification
    var notification = this.get("model") && this.get("model")[index || 0];
    if (!notification) {
      return null;
    }

    this.setRoute(notification);

    if(notification.route) {
      // if current url matches notification view action url then dismiss notification
      var router = this.get("target");
      var currentUrl = window.location.href.split("#").get("lastObject");

      var actionUrl = router.generate.apply(router, notification.route);
      var actionUrl = actionUrl.split("#").get("lastObject");

      if (currentUrl.indexOf(actionUrl) >= 0) {
        this.get("model").removeObject(notification);
        return this.retrieveNotification(index);
      }

      return notification;
    }
  },

  itemImageUrl: Ember.computed('nextNotification', function(){
    var itemId = this.get("nextNotification.item_id");
    return itemId ? this.store.peekRecord("item", itemId).get("displayImageUrl") : null;
  }),

  showItemImage: Ember.computed.notEmpty("itemImageUrl"),

  senderImageUrl: Ember.computed('nextNotification', function(){
    var notification = this.get("nextNotification");
    if (!notification) { return null; }
    var sender = this.store.peekRecord("user", notification.author_id);
    return sender ? sender.get("displayImageUrl") : "assets/images/default_user_image.jpg";
  }),

  setRoute: function(notification) {
    switch (notification.category) {
      case "message":
        notification.route = this.get("messagesUtil").getRoute(notification);
        break;

      case "new_offer":
      case "incoming_call":
        var routeName = this.get("session.isDonorApp") ? "offer" : "review_offer";
        notification.route = [routeName, notification.offer_id];
        break;

      case "offer_delivery":
        notification.route = ["review_offer.logistics", notification.offer_id];
        break;

      case "call_answered":
        notification.route = ["offer.donor_messages", notification.offer_id];
        break;
    }
  },

  acceptCall: function(notification) {
    new AjaxPromise("/twilio_inbound/accept_call", "GET", this.get('session.authToken'), { donor_id: notification.author_id })
  },

  actions: {
    view() {
      var notification = this.get("nextNotification");
      this.get("model").removeObject(notification);
      if (notification.category === "incoming_call") {
        this.acceptCall(notification);
      }
      this.transitionToRoute.apply(this, notification.route);
    },

    unloadNotifications() {
      this.set('model', []);
    }
  }
});
