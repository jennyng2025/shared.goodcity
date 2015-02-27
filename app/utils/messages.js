export default {
  markRead: function(container, message) {
    var adapter = container.lookup("adapter:application");
    var url = adapter.buildURL("message", message.id) + "/mark_read";
    adapter.ajax(url, "PUT").then(function(response) {
      message.setProperties(response.message);
    });
  },

  getRoute: function(container, message) {
    var isDonor = container.lookup("session:main").get("currentUser.isDonor");
    var offerId = message.get ? message.get("offer.id") : message.offer_id;
    var itemId = message.get ? message.get("item.id") : message.item_id;
    var isPrivate = message.get ? message.get("isPrivate") : message.is_private;

    if (isDonor) {
      if (itemId) {
        return ["item.messages", offerId, itemId];
      } else {
        return ["offer.messages", offerId];
      }
    } else if (isPrivate) {
      if (itemId) {
        return ["review_item.supervisor_messages", offerId, itemId];
      } else {
        return ["offer.supervisor_messages", offerId];
      }
    } else {
      if (itemId) {
        return ["review_item.donor_messages", offerId, itemId];
      } else {
        return ["offer.donor_messages", offerId];
      }
    }
  }
};
