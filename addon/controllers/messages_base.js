import Ember from "ember";

export default Ember.ArrayController.extend({
  needs: ["offer"],
  sortProperties: ["createdAt"],
  sortAscending: true,
  isPrivate: false,
  offer: Ember.computed.alias("controllers.offer.model"),
  // disabled: Ember.computed.alias("offer.isFinished"),
  // item: null,

  disabled: function(){
    return this.get('offer.isFinished') || this.get('item.isDraft');
  }.property('offer', 'item'),

  actions: {
    sendMessage: function() {
      var values = this.getProperties("body", "offer", "item", "isPrivate");
      values.createdAt = new Date();
      values.sender = this.store.getById("user", this.get("session.currentUser.id"));

      var message = this.store.createRecord("message", values);
      message.save()
        .then(() => this.set("body", ""))
        .catch(error => {
          this.store.unloadRecord(message);
          throw error;
        });

      Ember.$("body").animate({ scrollTop: Ember.$(document).height() }, 1000);
    }
  }
});
