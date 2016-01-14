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
  startReceivingAt: attr('date'),
  cancelReason:   attr('string'),

  gogovanTransport:    belongsTo('gogovan_transport', { async: false }),
  crossroadsTransport: belongsTo('crossroads_transport', { async: false }),
  cancellationReason:  belongsTo('cancellation_reason', { async: false }),

  // used for items of current-offer
  saleable:       attr('boolean'),

  items:          hasMany('item', { async: false }),
  messages:       hasMany('message', { async: false }),

  delivery:       belongsTo('delivery', { async: false }),
  createdBy:      belongsTo('user', { async: false }),
  reviewedBy:     belongsTo('user', { async: false }),
  closedBy:       belongsTo('user', { async: false }),
  receivedBy:     belongsTo('user', { async: false }),

  // User details
  userName:       attr('string'),
  userPhone:      attr('string'),

  crossroadsTruckCost: Ember.computed('crossroadsTransport', function(){
    return this.get('crossroadsTransport.cost');
  }),

  itemCount: Ember.computed('items.@each.state', function(){
    return this.get("items").rejectBy("state", "draft").length;
  }),

  packages: Ember.computed(function(){
    return this.store.filter("package", p => p.get("offerId") === parseInt(this.get("id")));
  }),

  itemPackages: Ember.computed(function(){
    return this.store.peekAll("package").filterBy("offerId", parseInt(this.get("id")));
  }),

  receivedCount: Ember.computed("packages.@each.state", function(){
    return this.get('packages').filterBy("state", "received").length;
  }),

  missingCount: Ember.computed("packages.@each.state", function(){
    return this.get('packages').filterBy("state", "missing").length;
  }),

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
  isReceiving: Ember.computed.equal("state", "receiving"),
  isCancelled: Ember.computed.equal("state", "cancelled"),
  preventNewItem: Ember.computed.alias("isFinished"),

  hasReceived: Ember.computed.or('isReceived', 'isReceiving'),
  isReviewing: Ember.computed.or('isUnderReview', 'isReviewed'),
  adminCurrentOffer: Ember.computed.or('isReviewing', 'isScheduled'),

  needReview: Ember.computed('isUnderReview', 'isSubmitted', 'isClosed', function(){
    return this.get('isUnderReview') || this.get('isSubmitted') || this.get("isClosed");
  }),

  isFinished: Ember.computed('isClosed', 'isReceived', 'isCancelled', function(){
    return this.get('isClosed') || this.get('isReceived') || this.get('isCancelled');
  }),

  activeItems: Ember.computed('items.@each.state', function(){
    return this.get('items').rejectBy("state", "draft");
  }),

  nonEmptyOffer: Ember.computed('items.[]', function(){
    return this.get('itemCount') > 0;
  }),

  allItemsReviewed: Ember.computed('items.@each.state', function(){
    var reviewedItems = this.get('activeItems').filterBy('state', 'submitted');
    return reviewedItems.get('length') === 0;
  }),

  readyForSchedule: Ember.computed('needReview', 'allItemsReviewed', function(){
    return this.get('needReview') && this.get('allItemsReviewed');
  }),

  allItemsRejected: Ember.computed('items.@each.state', 'needReview', function(){
    var rejectedItems = this.get('activeItems').filterBy('state', 'rejected');
    return this.get('needReview') && (rejectedItems.get('length') === this.get('itemCount'));
  }),

  displayImageUrl: Ember.computed('items.@each.displayImageUrl', function(){
    return this.get("activeItems.firstObject.displayImageUrl") || "assets/images/default_item.jpg";
  }),

  isCharitableSale: Ember.computed('items.@each.saleable', function(){
    var isSaleable = this.get("items").rejectBy("saleable", false).length > 0;
    return  isSaleable ? this.locale("yes") : this.locale("no");
  }),

  isAccepted: Ember.computed('items.@each.saleable', function(){
    return (this.get("approvedItems").length > 0) && this.get('isReviewed');
  }),

  status: Ember.computed('state', function(){
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
      case 'receiving' : return this.locale('offers.index.receiving');
    }
    return status;
  }),

  i18n: Ember.inject.service(),

  locale: function(text) {
    return this.get("i18n").t(text);
  },

  statusText: Ember.computed('status', 'itemCount', function(){
    return this.get("isDraft") ? this.get("status") : (this.get("status") + " ("+ this.get("itemCount") + " "+ this.locale("items_text") +")")
  }),

  scheduledStatus: function(){
    var deliveryType = this.get("delivery.deliveryType")
    switch(deliveryType) {
      case "Gogovan" : return this.get("gogovan_status");
      case "Drop Off" : return this.locale("offers.index.drop_off");
      case "Alternate" : return this.locale("offers.index.alternate");
    }
  },

  gogovan_status: Ember.computed("delivery.gogovanOrder.status", function(){
    var ggvStatus = this.get("delivery.gogovanOrder.status");
    switch(ggvStatus) {
      case "pending": return this.locale("offers.index.van_booked");
      case "active": return this.locale("offers.index.van_confirmed");
      case "completed": return this.locale("offers.index.picked_up");
    }
  }),

  isOffer: Ember.computed('this', function(){
    return this.get('constructor.modelName') === 'offer';
  }),

  // unread offer-items messages
  unreadMessagesCount: Ember.computed('messages.@each.state', function(){
    return this.get('messages').filterBy('state', 'unread').length;
  }),

  hasUnreadMessages: Ember.computed('unreadMessagesCount', function(){
    return this.get('unreadMessagesCount') > 0;
  }),

  // unread offer-messages
  unreadOfferMessages: Ember.computed('messages.@each.state', function(){
    return this.get('messages').filterBy('state', 'unread').filterBy('item', null).sortBy('createdAt');
  }),

  unreadOfferMessagesCount: Ember.computed('unreadOfferMessages', function(){
    var count = this.get('unreadOfferMessages.length');
    return count > 0 ? count : '';
  }),

  // unread offer-messages by donor
  hasUnreadDonorMessages: Ember.computed('unreadOfferMessages', function(){
    return this.get('unreadOfferMessages').filterBy('isPrivate', false).length > 0;
  }),

  // unread offer-messages by supervisor-reviewer
  hasUnreadPrivateMessages: Ember.computed('unreadOfferMessages', function(){
    return this.get('unreadOfferMessages').filterBy('isPrivate', true).length > 0;
  }),

  // recent offer message
  lastMessage: Ember.computed('messages.[]', function(){
    var messages = this.get('messages').filterBy('item', null).sortBy('createdAt');
    return messages.get('length') > 0 ? messages.get('lastObject') : null;
  }),

  hasCrossroadsTransport: Ember.computed('crossroadsTransport', function(){
    return this.get('crossroadsTransport') && this.get('crossroadsTransport.isVanAllowed')
  }),

  hasGogovanTransport: Ember.computed('gogovanTransport', function(){
    return this.get('gogovanTransport') && !this.get('gogovanTransport.disabled');
  }),

  // display "General Messages Thread"
  displayGeneralMessages: Ember.computed('isDraft', 'lastMessage', function(){
    return !(this.get('isDraft') && this.get('lastMessage') === null);
  }),

  // to sort on offer-details page for updated-offer and latest-message
  latestUpdatedTime: Ember.computed('lastMessage', function(){
    var value;
    switch(Ember.compare(this.get('lastMessage.createdAt'), this.get('updatedAt'))) {
      case 0 :
      case 1 : value = this.get('lastMessage.createdAt'); break;
      case -1 : value = this.get('updatedAt'); break;
    }
    return value;
  }),

  hasCompleteGGVOrder: Ember.computed('delivery.gogovanOrder.status', function(){
    return (this.get("delivery.gogovanOrder.status") || "") === "completed";
  }),

  showOfferIcons: Ember.computed('hasCompleteGGVOrder','itemCount', 'isClosed', 'hasReceived', function(){
    return this.get("itemCount") > 0 && !(this.get('isClosed') || this.get('hasReceived')) && !this.get("hasCompleteGGVOrder");
  }),

  statusBarClass: Ember.computed('state', function(){
    if(this.get("isSubmitted")){ return "is-submitted"}
    else if(this.get("isUnderReview")){ return "is-under-review"}
    else if(this.get("isReviewed")){return "is-reviewed"}
    else if(this.get("isScheduled")){return "is-scheduled"}
    else if(this.get("isClosed")){return "is-closed"}
    else if(this.get("hasReceived")){return "is-received"}
  }),

  showDeliveryDetails: Ember.computed('state', function(){
    return this.get("isScheduled") || this.get("isReceived") || this.get("isReceiving");
  }),

  hideBookingModification: Ember.computed("delivery.gogovanOrder", "delivery.gogovanOrder.status", function(){
    var session = this.container.lookup("service:session");
    return !session.get('isAdminApp') && this.get("delivery.isGogovan")
    && this.get("delivery.gogovanOrder.isCompleted");
  })

});
