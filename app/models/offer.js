import Ember from 'ember';
import DS from 'ember-data';

var attr = DS.attr,
    hasMany = DS.hasMany,
    belongsTo = DS.belongsTo;

export default DS.Model.extend({
  language:       attr('string'),
  state:          attr('string', {defaultValue: 'draft'}),
  origin:         attr('string'),
  stairs:         attr('boolean'),
  parking:        attr('boolean'),
  estimatedSize:  attr('string'),
  notes:          attr('string'),
  createdAt:      attr('date'),
  updatedAt:      attr('date'),
  submittedAt:    attr('date'),
  cancelledAt:    attr('date'),
  state_event:    attr('string'),
  reviewedAt:     attr('date'),
  receivedAt:     attr('date'),
  reviewCompletedAt: attr('date'),
  deliveredBy:    attr('string'),

  gogovanTransport:    belongsTo('gogovan_transport'),
  crossroadsTransport: belongsTo('crossroads_transport'),

  // used for items of current-offer
  saleable:       attr('boolean'),

  items:          hasMany('item'),
  messages:       hasMany('message'),

  delivery:       belongsTo('delivery'),
  createdBy:      belongsTo('user'),
  reviewedBy:     belongsTo('user'),
  closedBy:       belongsTo('user'),

  // User details
  userName:       attr('string'),
  userPhone:      attr('string'),

  crossroadsTruckCost: function(){
    return this.get('crossroadsTransport.cost');
  }.property('crossroadsTransport'),

  itemCount: function() {
    return this.get("items").rejectBy("state", "draft").length;
  }.property('items.@each.state'),

  packages: function() {
    return this.store.filter("package", p => p.get("offerId") === parseInt(this.get("id")));
  }.property(),

  itemPackages: function() {
    return this.store.all("package").filterBy("offerId", parseInt(this.get("id")));
  }.property(),

  approvedItems: Ember.computed.filterBy("items", "state", "accepted"),
  rejectedItems: Ember.computed.filterBy("items", "state", "rejected"),
  submittedItems: Ember.computed.filterBy("items", "state", "submitted"),
  isDraft: Ember.computed.equal("state", "draft"),
  isSubmitted: Ember.computed.equal("state", "submitted"),
  isScheduled: Ember.computed.equal("state", "scheduled"),
  isUnderReview: Ember.computed.equal("state", "under_review"),
  isReviewed: Ember.computed.equal("state", "reviewed"),
  isClosed: Ember.computed.equal("state", "closed"),
  isReceived: Ember.computed.equal("state", "received"),
  isCancelled: Ember.computed.equal("state", "cancelled"),
  preventNewItem: Ember.computed.alias("isFinished"),

  activeItems: function(){
    return this.get('items').rejectBy("state", "draft");
  }.property('items.@each.state'),

  isReviewing: function(){
    return this.get('isUnderReview') || this.get('isReviewed');
  }.property('isUnderReview', 'isReviewed'),

  adminCurrentOffer: function() {
    return this.get("isReviewing") || this.get("isScheduled");
  }.property('isReviewing', 'isScheduled'),

  needReview: function(){
    return this.get('isUnderReview') || this.get('isSubmitted') || this.get("isClosed");
  }.property('isUnderReview', 'isSubmitted', 'isClosed'),

  isFinished: function() {
    return this.get('isClosed') || this.get('isReceived') || this.get('isCancelled');
  }.property('isClosed', 'isReceived', 'isCancelled'),

  nonEmptyOffer: function(){
    return this.get('itemCount') > 0;
  }.property('items.@each'),

  allItemsReviewed: function(){
    var reviewedItems = this.get('activeItems').filterBy('state', 'submitted');
    return this.get('needReview') && reviewedItems.get('length') === 0;
  }.property('items.@each.state', 'needReview'),

  allItemsRejected: function(){
    var rejectedItems = this.get('activeItems').filterBy('state', 'rejected');
    return this.get('needReview') && (rejectedItems.get('length') === this.get('itemCount'));
  }.property('items.@each.state', 'needReview'),

  displayImageUrl: function(){
    return this.get("activeItems.firstObject.displayImageUrl") || "assets/images/default_item.jpg";
  }.property('items.@each.displayImageUrl'),

  isCharitableSale: function() {
    var isSaleable = this.get("items").rejectBy("saleable", false).length > 0;
    return  isSaleable ? this.locale("yes") : this.locale("no");
  }.property('items.@each.saleable'),

  isAccepted: function() {
    return (this.get("approvedItems").length > 0) && this.get('isReviewed');
  }.property('items.@each.saleable'),

  status: function(){
    var state = this.get('state');
    var status;
    switch(state) {
      case 'draft': return this.locale('offers.index.complete_offer');
      case 'under_review' : return this.locale('offers.index.in_review');
      case 'submitted' : return this.locale('offers.index.awaiting_review');
      case 'reviewed' : return this.locale('offers.index.arrange_transport');
      case 'scheduled' : return this.scheduledStatus();
      case 'closed' : return this.locale('offers.index.closed');
      case 'received' : return this.locale('offers.index.received');
    }
    return status;
  }.property('state'),

  i18n: Ember.inject.service(),
  locale: function(text) {
    return this.get("i18n").t(text);
  },

  statusText: function(){
    return this.get("isDraft") ? this.get("status") : (this.get("status") + " ("+ this.get("itemCount") + " "+ this.locale("items_text") +")")
  }.property('status'),

  scheduledStatus: function(){
    var deliveryType = this.get("delivery.deliveryType")
    switch(deliveryType) {
      case "Gogovan" : return this.get("gogovan_status");
      case "Drop Off" : return this.locale("offers.index.drop_off");
      case "Alternate" : return this.locale("offers.index.alternate");
    }
  },

  gogovan_status: function(){
    var ggvStatus = this.get("delivery.gogovanOrder.status");
    switch(ggvStatus) {
      case "pending": return this.locale("offers.index.van_booked");
      case "active": return this.locale("offers.index.van_confirmed");
      case "completed": return this.locale("offers.index.picked_up");
    }
  }.property("delivery.gogovanOrder.status"),

  isOffer: function() {
    return this.get('constructor.typeKey') === 'offer';
  }.property('this'),

  // unread offer-items messages
  unreadMessagesCount: function() {
    return this.get('messages').filterBy('state', 'unread').length;
  }.property('messages.@each.state'),

  hasUnreadMessages: function() {
    return this.get('unreadMessagesCount') > 0;
  }.property('unreadMessagesCount'),

  // unread offer-messages
  unreadOfferMessages: function(){
    return this.get('messages').filterBy('state', 'unread').filterBy('item', null).sortBy('createdAt');
  }.property('messages.@each.state'),

  unreadOfferMessagesCount: function(){
    var count = this.get('unreadOfferMessages.length');
    return count > 0 ? count : '';
  }.property('unreadOfferMessages'),

  // unread offer-messages by donor
  hasUnreadDonorMessages: function(){
    return this.get('unreadOfferMessages').filterBy('isPrivate', false).length > 0;
  }.property('unreadOfferMessages'),

  // unread offer-messages by supervisor-reviewer
  hasUnreadPrivateMessages: function(){
    return this.get('unreadOfferMessages').filterBy('isPrivate', true).length > 0;
  }.property('unreadOfferMessages'),

  // recent offer message
  lastMessage: function() {
    var messages = this.get('messages').filterBy('item', null).sortBy('createdAt');
    return messages.get('length') > 0 ? messages.get('lastObject') : null;
  }.property('messages.[]'),

  hasCrossroadsTransport: function(){
    return this.get('crossroadsTransport') && this.get('crossroadsTransport.isVanAllowed')
  }.property('crossroadsTransport'),

  hasGogovanTransport: function(){
    return this.get('gogovanTransport') && this.get('gogovanTransport.name') !== this.get("i18n").t("offer.disable");
  }.property('gogovanTransport'),

  // display "General Messages Thread"
  displayGeneralMessages: function(){
    return !(this.get('isDraft') && this.get('lastMessage') === null);
  }.property('isDraft', 'lastMessage'),

  // to sort on offer-details page for updated-offer and latest-message
  latestUpdatedTime: function(){
    var value;
    switch(Ember.compare(this.get('lastMessage.createdAt'), this.get('updatedAt'))) {
      case 0 :
      case 1 : value = this.get('lastMessage.createdAt'); break;
      case -1 : value = this.get('updatedAt'); break;
    }
    return value;
  }.property('lastMessage'),

  showOfferIcons:  function(){
    return this.get("itemCount") > 0 && !(this.get('isClosed') || this.get('isReceived'));
  }.property('itemCount', 'isClosed', 'isReceived'),

  statusBarClass: function(){
    if(this.get("isSubmitted")){ return "is-submitted"}
    else if(this.get("isUnderReview")){ return "is-under-review"}
    else if(this.get("isReviewed")){return "is-reviewed"}
    else if(this.get("isScheduled")){return "is-scheduled"}
    else if(this.get("isClosed")){return "is-closed"}
    else if(this.get("isReceived")){return "is-received"}
  }.property("state"),

  showDeliveryDetails: function(){
    return this.get("isScheduled") || this.get("isReceived");
  }.property("state"),

  hideBookingModification: function(){
    var session = this.container.lookup("service:session");
    return !session.get('isAdminApp') && this.get("delivery.isGogovan")
    && this.get("delivery.gogovanOrder.isCompleted");
  }.property("delivery.gogovanOrder", "delivery.gogovanOrder.status")

});
