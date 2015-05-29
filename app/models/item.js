import Ember from 'ember';
import DS from 'ember-data';
import '../computed/foreign-key';

var attr = DS.attr,
    belongsTo = DS.belongsTo,
    hasMany   = DS.hasMany,
    foreignKey = Ember.computed.foreignKey;

export default DS.Model.extend({
  donorDescription:     attr('string'),
  state:                attr('string'),
  rejectReason:         attr('string'),
  rejectionComments:    attr('string'),
  createdAt:            attr('date'),
  updatedAt:            attr('date'),
  packages:             hasMany('package'),
  messages:             hasMany('message'),
  images:               hasMany('image'),
  offer:                belongsTo('offer'),
  packageType:          belongsTo('package_type'),
  donorCondition:       belongsTo('donor_condition'),
  donorConditionId:     foreignKey('donorCondition.id'),
  rejectionReason:      belongsTo('rejection_reason'),
  saleable:             attr('boolean'),
  state_event:          attr('string'),

  isAccepted: Ember.computed.equal("state", "accepted"),
  isRejected: Ember.computed.equal("state", "rejected"),
  isDrafted: Ember.computed.equal("state", "draft"),

  isDraft: function(){
    return this.get('offer.state') === 'draft';
  }.property('offer.state'),

  isSubmitted: function(){
    return this.get('state') === 'submitted' && this.get('offer.state') === 'submitted';
  }.property('state', 'offer.state'),

  isUnderReview: function(){
    return this.get('state') === 'submitted' && this.get('offer.state') === 'under_review';
  }.property('state', 'offer.state'),

  displayImage: function() {
    return this.get("images").filterBy("favourite").get("firstObject") ||
      this.get("images").sortBy("id").get("firstObject") || null;
  }.property('images.@each.favourite'),

  nonFavouriteImages: function(){
    return this.get("images").rejectBy("favourite", true);
  }.property('images.@each.favourite'),

  displayImageUrl: function() {
    return this.get('displayImage.thumbImageUrl') || "assets/images/default_item.jpg";
  }.property('displayImage'),

  imageCount: Ember.computed.alias("images.length"),

  // unread messages
  unreadMessages: function() {
    return this.get('messages').filterBy('state', 'unread').sortBy('createdAt');
  }.property('messages.@each.state'),

  // unread offer-messages by donor
  hasUnreadDonorMessages: function(){
    return this.get('unreadMessages').filterBy('isPrivate', false).length > 0;
  }.property('unreadMessages'),

  // unread offer-messages by supervisor-reviewer
  hasUnreadPrivateMessages: function(){
    return this.get('unreadMessages').filterBy('isPrivate', true).length > 0;
  }.property('unreadMessages'),

  unreadMessagesCount: function() {
    var count = this.get('unreadMessages').length;
    return count > 0 ? count : null ;
  }.property('unreadMessages'),

  // last message
  lastMessage: function() {
    return this.get('messages').sortBy('createdAt').get('lastObject');
  }.property('messages.[]'),

  // to sort on offer-details page for updated-item and latest-message
  latestUpdatedTime: function(){
    var value;
    switch(Ember.compare(this.get('lastMessage.createdAt'), this.get('updatedAt'))) {
      case 0 :
      case 1 : value = this.get('lastMessage.createdAt'); break;
      case -1 : value = this.get('updatedAt'); break;
    }
    return value;
  }.property('lastMessage'),

  statusBarClass: function(){
    if(this.get("offer.isCancelled")) { return "is-closed"; }
    else if(this.get("isSubmitted")) { return "is-submitted"; }
    else if(this.get("isUnderReview")) { return "is-under-review"; }
    else if(this.get("isAccepted")) { return "is-accepted"; }
    else if(this.get("isRejected")) { return "is-rejected"; }
  }.property("state")
});
