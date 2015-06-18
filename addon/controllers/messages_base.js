import Ember from "ember";

export default Ember.ArrayController.extend({
  needs: ["offer"],
  isPrivate: false,
  offer: Ember.computed.alias("controllers.offer.model"),
  // disabled: Ember.computed.alias("offer.isFinished"),
  // item: null,
  sortProperties: ["createdAt:asc"],
  sortedElements: Ember.computed.sort("messagesAndLogs", "sortProperties"),

  disabled: function(){
    return this.get('offer.isFinished') || this.get('item.isDraft');
  }.property('offer', 'item'),


  messagesAndLogs: function(){
    var messages = this.get("model").toArray();
    var logs = this.get("itemLogs").toArray();
    return messages.concat(logs);
  }.property("model", "item.messages.@each", "itemLogs.@each"),

  itemLogs: function(){
    var _this = this;
    var itemId = parseInt(_this.get("item.id"));
    return this.store.all('version').filterBy('itemType', 'Item').
      filterBy("itemId", itemId);
  }.property("item"),

  groupedElements: function() {
    return this.groupBy(this.get("sortedElements"), "createdDate");
  }.property("sortedElements"),

  groupBy: function(content, key) {
    var result = [];
    var object, value;

    content.forEach(function(item) {
      value = item.get ? item.get(key) : item[key];
      object = result.findProperty('value', value);
      if (!object) {
        object = {
          value: value,
          items: []
        };
        result.push(object);
      }
      return object.items.push(item);
    });
    return result.getEach('items');
  },

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
