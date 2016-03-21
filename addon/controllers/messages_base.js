import Ember from "ember";

export default Ember.Controller.extend({

  body: "",
  offerController: Ember.inject.controller('offer'),
  isPrivate: false,
  inProgress: false,
  offer: Ember.computed.alias("offerController.model"),
  sortProperties: ["createdAt:asc"],
  sortedElements: Ember.computed.sort("messagesAndVersions", "sortProperties"),
  isItemThread: Ember.computed.notEmpty("item"),

  disabled: Ember.computed('offer.isFinished', 'item.isDraft', function(){
    return this.get('offer.isFinished') || this.get('item.isDraft');
  }),

  groupedElements: Ember.computed("sortedElements.[]", function(){
    return this.groupBy(this.get("sortedElements"), "createdDate");
  }),

  allMessages: Ember.computed(function() {
    return this.store.peekAll("message");
  }),

  messages: Ember.computed("allMessages.[]", "offer", "item", function() {
    var messages = this.get("allMessages");
    messages = this.get("isItemThread") ?
      messages.filterBy("item.id", this.get("item.id")) :
      messages.filterBy("offer.id", this.get("offer.id")).filterBy("item", null);
    return messages.filterBy("isPrivate", this.get("isPrivate"));
  }),

  messagesAndVersions: Ember.computed("messages.[]", "itemVersions", "packageVersions", "offerVersions", function(){
    var messages = this.get("messages").toArray();
    var itemVersions = this.get("itemVersions").toArray();
    var packageVersions = this.get("packageVersions").toArray();
    var offerVersions = this.get("offerVersions").toArray();
    return messages.concat(itemVersions, packageVersions, offerVersions);
  }),

  itemVersions: Ember.computed("item.id", "allVersions.[]", "isItemThread", function(){
    if (!this.get("isItemThread")) { return []; }
    var itemId = parseInt(this.get("item.id"));
    return this.get('allVersions').filterBy("itemId", itemId).
      filterBy('itemType', 'Item');
  }),

  packageVersions: Ember.computed("item.packages", "allVersions.[]", "isItemThread", function(){
    if (!this.get("isItemThread")) { return []; }
    var packageIds = (this.get("item.packages") || []).mapBy("id");
    return this.get('allVersions').filterBy('itemType', 'Package').filter(function(log){
      return (packageIds.indexOf(String(log.get("itemId"))) >= 0) && (["received", "missing"].indexOf(log.get("state")) >= 0);
    });
  }),

  allVersions: Ember.computed(function(){
    return this.get("store").peekAll("version");
  }),

  offerVersions: Ember.computed("allVersions.[]", "offer.id", "isItemThread", function(){
    if (this.get("isItemThread")) { return []; }
    var offerId = parseInt(this.get("offer.id"));
    return this.get('allVersions').filterBy('itemType', 'Offer').filterBy("itemId", offerId);
  }),

  groupBy: function(content, key) {
    var result = [];
    var object, value;

    content.forEach(function(item) {
      value = item.get ? item.get(key) : item[key];
      object = result.findBy('value', value);
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

  messagesUtil: Ember.inject.service("messages"),

  actions: {
    sendMessage() {
      // To hide soft keyboard
      Ember.$("textarea").trigger('blur');

      this.set("inProgress", true);
      var values = this.getProperties("body", "offer", "item", "isPrivate");
      values.createdAt = new Date();
      values.sender = this.store.peekRecord("user", this.get("session.currentUser.id"));

      var message = this.store.createRecord("message", values);
      message.save()
        .then(() => { this.set("body", ""); })
        .catch(error => {
          this.store.unloadRecord(message);
          throw error;
        })
        .finally(() => this.set("inProgress", false));

      Ember.$("body").animate({ scrollTop: Ember.$(document).height() }, 1000);
    },

    markRead() {
      this.get("messages")
        .filterBy('state', 'unread')
        .forEach(m => this.get("messagesUtil").markRead(m));
    }
  }
});
