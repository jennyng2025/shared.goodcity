import Ember from 'ember';

export default Ember.Controller.extend({
  delivery: Ember.computed.alias('model.delivery'),
  contact: Ember.computed.alias('delivery.contact'),
  hasActiveGGVOrder: Ember.computed.alias('delivery.gogovanOrder.isActive'),

  user: function(){
    var userId = this.session.get("currentUser.id");
    return this.store.getById('user_profile', userId);
  }.property().volatile(),

  userName: function(){
    return this.get('contact.name') || this.get("user.fullName");
  }.property('contact.name', 'user.fullName'),

  userMobile: function(){
    return this.get('contact.mobile') || this.get("user.mobile");
  }.property('contact.mobile', 'user.mobile'),

  district: function(){
    return this.get('contact.address.district.name') || this.get("user.address.district.name");
  }.property('contact.address.district.name', 'user.address.district.name'),

  actions: {
    handleBrokenImage: function() {
      this.get("model.reviewedBy").set("hasImage", null);
    },

    cancelDelivery: function(){
      if(this.get('hasActiveGGVOrder')) {
        // this.set('cancelBooking', true);
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
      if (confirm(Ember.I18n.t("delete_confirm"))) {
        var loadingView = this.container.lookup('view:loading').append();
        var offer = delivery.get('offer');
        var _this = this;

        delivery.destroyRecord()
          .then(function() {
            var route = _this.get('session.isAdminApp') ? 'review_offer' : 'offer.offer_details';
            _this.transitionToRoute(route, offer);
          })
          .finally(() => loadingView.destroy());
        }
    }
  }
});
