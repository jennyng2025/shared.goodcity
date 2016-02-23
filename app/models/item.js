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
  packages:             hasMany('package', { async: false }),
  messages:             hasMany('message', { async: true }),
  images:               hasMany('image', { async: false }),
  offer:                belongsTo('offer', { async: false }),
  packageType:          belongsTo('package_type', { async: false }),
  donorCondition:       belongsTo('donor_condition', { async: false }),
  donorConditionId:     foreignKey('donorCondition.id'),
  rejectionReason:      belongsTo('rejection_reason', { async: false }),
  saleable:             attr('boolean'),
  state_event:          attr('string'),

  isAccepted: Ember.computed.equal("state", "accepted"),
  isRejected: Ember.computed.equal("state", "rejected"),
  isDrafted:  Ember.computed.equal("state", "draft"),

  canUpdated: Ember.computed("hasReceivedPackages", "offer.state", function(){
    return !(this.get("hasReceivedPackages") || this.get("offer.isFinished"));
  }),

  isDraft: Ember.computed('offer.state', function(){
    return this.get('offer.state') === 'draft';
  }),

  isSubmitted: Ember.computed('state', 'offer.state', function(){
    return this.get('state') === 'submitted' && this.get('offer.state') === 'submitted';
  }),

  isUnderReview: Ember.computed('state', 'offer.state', function(){
    return this.get('state') === 'submitted' && this.get('offer.state') === 'under_review';
  }),

  hasReceivedPackages: Ember.computed('packages.@each.state', function(){
    return this.get('packages').filterBy('isReceived', true).length > 0;
  }),

  displayImage: Ember.computed('images.@each.favourite', function(){
    return this.get("images").filterBy("favourite").get("firstObject") ||
      this.get("images").sortBy("id").get("firstObject") || null;
  }),

  nonFavouriteImages: Ember.computed('images.@each.favourite', function(){
    return this.get("images").rejectBy("favourite", true);
  }),

  displayImageUrl: Ember.computed('displayImage', function(){
    return this.get('displayImage.thumbImageUrl') || "assets/images/default_item.jpg";
  }),

  imageCount: Ember.computed.alias("images.length"),

  // unread messages
  unreadMessages: Ember.computed('messages.@each.state', function(){
    return this.get('messages').filterBy('state', 'unread').sortBy('createdAt');
  }),

  // unread offer-messages by donor
  hasUnreadDonorMessages: Ember.computed('unreadMessages', function(){
    return this.get('unreadMessages').filterBy('isPrivate', false).length > 0;
  }),

  // unread offer-messages by supervisor-reviewer
  hasUnreadPrivateMessages: Ember.computed('unreadMessages', function(){
    return this.get('unreadMessages').filterBy('isPrivate', true).length > 0;
  }),

  unreadMessagesCount: Ember.computed('unreadMessages', function(){
    var count = this.get('unreadMessages').length;
    return count > 0 ? count : null ;
  }),

  // last message
  lastMessage: Ember.computed('messages.[]', function(){
    return this.get('messages').sortBy('createdAt').get('lastObject');
  }),

  // to sort on offer-details page for updated-item and latest-message
  latestUpdatedTime: Ember.computed('lastMessage', function(){
    var value;
    switch(Ember.compare(this.get('lastMessage.createdAt'), this.get('updatedAt'))) {
      case 0 :
      case 1 : value = this.get('lastMessage.createdAt'); break;
      case -1 : value = this.get('updatedAt'); break;
    }
    return value;
  }),

  statusBarClass: Ember.computed("state", function(){
    if(this.get("offer.isCancelled")) { return "is-closed"; }
    else if(this.get("isSubmitted")) { return "is-submitted"; }
    else if(this.get("isUnderReview")) { return "is-under-review"; }
    else if(this.get("isAccepted")) { return "is-accepted"; }
    else if(this.get("isRejected")) { return "is-rejected"; }
  }),

  pageLink: Ember.computed("state", function(){
     return this.get("isRejected") ? 'review_item.reject' : 'review_item.accept';
  }),
});
