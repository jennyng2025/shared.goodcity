import Ember from "ember";

export default Ember.ArrayController.extend({
  needs: ["offer"],
  sortProperties: ["createdAt"],
  sortAscending: true,
  isPrivate: false,
  offer: Ember.computed.alias("controllers.offer.model"),
  item: null,

  actions: {
    sendMessage: function() {
      var values = this.getProperties("body", "offer", "item", "isPrivate");
      values.createdAt = new Date();
      values.sender = this.store.getById("user", this.get("session.currentUser.id"));

      var message = this.store.createRecord("message", values);
      message.save();

      this.set("body", "");
      Ember.$("body").animate({ scrollTop: Ember.$(document).height() }, 1000);
    }
  }
});