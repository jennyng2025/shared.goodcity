import Ember from 'ember';

var transportDetails =  Ember.ObjectController.extend({
  delivery: Ember.computed.alias('model.delivery'),

  hasActiveGGVOrder: Ember.computed.alias('delivery.gogovanOrder.isActive'),

  user: function(){
    var userId = this.session.get("currentUser.id");
    return this.store.getById('user_profile', userId);
  }.property().volatile(),

  userName: function(){
    return this.get('delivery.contact.name') || this.get("user.fullName");
  }.property('delivery.contact.name', 'user'),

  userMobile: function(){
    return this.get('delivery.contact.mobile') || this.get("user.mobile");
  }.property('delivery.contact.mobile', 'user'),

  district: function(){
    return this.get('delivery.contact.address.district.name') || this.get("user.address.district.name");
  }.property('user', 'delivery'),

  actions: {
    handleBrokenImage: function() {
      this.get("reviewedBy").set("hasImage", null);
    },

    cancelDelivery: function(){
      if(this.get('hasActiveGGVOrder')) {
        this.set('cancelBooking', true);
        this.transitionToRoute('delivery.cancel_booking', this.get('delivery'))
          .then(newRoute => newRoute.controller.set('isCancel', true));
      } else {
        this.send('removeDelivery', this.get('delivery'));
      }
    },

    modifyBooking: function(){
      if(this.get('hasActiveGGVOrder')) {
        this.transitionToRoute('delivery.cancel_booking', this.get('delivery'))
          .then(newRoute => newRoute.controller.set('isCancel', false));

      } else {
        this.transitionToRoute('offer.plan_delivery', this.get('delivery.offer'), {queryParams: {modify: true}});
      }
    },

    removeDelivery: function(delivery){
      if(confirm("Are you sure? This cannot be undone.")) {
        var loadingView = this.container.lookup('view:loading').append();
        var offer = delivery.get('offer');
        var _this = this;

        delivery.destroyRecord()
          .then(function() {
            var route = _this.get('session.isAdmin') ? 'review_offer' : 'offer.offer_details';
            _this.transitionToRoute(route, offer);
          })
          .finally(() => loadingView.destroy());
        }
    }
  }
});

export default transportDetails;
