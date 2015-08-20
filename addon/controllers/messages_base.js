import Ember from "ember";

export default Ember.ArrayController.extend({
  needs: ["offer"],
  isPrivate: false,
  inProgress: false,
  offer: Ember.computed.alias("controllers.offer.model"),
  sortProperties: ["createdAt:asc"],
  sortedElements: Ember.computed.sort("messagesAndVersions", "sortProperties"),
  isItemThread: Ember.computed.notEmpty("item"),

  disabled: function(){
    return this.get('offer.isFinished') || this.get('item.isDraft');
  }.property('offer.isFinished', 'item.isDraft'),

  groupedElements: function() {
    return this.groupBy(this.get("sortedElements"), "createdDate");
  }.property("sortedElements.[]"),

  messagesAndVersions: function(){
    var messages = this.get("model").toArray();
    var itemVersions = this.get("itemVersions").toArray();
    var packageVersions = this.get("packageVersions").toArray();
    var offerVersions = this.get("offerVersions").toArray();
    return messages.concat(itemVersions, packageVersions, offerVersions);
  }.property("model.[]", "itemVersions", "packageVersions", "offerVersions"),

  itemVersions: function(){
    if (!this.get("isItemThread")) { return []; }
    var itemId = parseInt(this.get("item.id"));
    return this.get('allVersions').filterBy("itemId", itemId).
      filterBy('itemType', 'Item');
  }.property("item.id", "allVersions.[]", "isItemThread"),

  packageVersions: function() {
    if (!this.get("isItemThread")) { return []; }
    var packageIds = (this.get("item.packages") || []).mapBy("id");
    return this.get('allVersions').filterBy('itemType', 'Package').filter(function(log){
      return (packageIds.indexOf(String(log.get("itemId"))) >= 0) && (["received", "missing"].indexOf(log.get("state")) >= 0);
    });
  }.property("item.packages", "allVersions.[]", "isItemThread"),

  offerVersions: function() {
    if (!this.get("isItemThread")) { return []; }
    var offerId = parseInt(this.get("offer.id"));
    return this.get('allVersions').filterBy('itemType', 'Offer').filterBy("itemId", offerId);
  }.property("allVersions.[]", "offer.id", "isItemThread"),

  allVersions: function() {
    return this.store.all("version");
  }.property(),

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
      this.set("inProgress", true);
      var values = this.getProperties("body", "offer", "item", "isPrivate");
      values.createdAt = new Date();
      values.sender = this.store.getById("user", this.get("session.currentUser.id"));

      var message = this.store.createRecord("message", values);
      message.save()
        .then(() => this.set("body", ""))
        .catch(error => {
          this.store.unloadRecord(message);
          throw error;
        })
        .finally(() => this.set("inProgress", false));

      Ember.$("body").animate({ scrollTop: Ember.$(document).height() }, 1000);
    }
  }
});
