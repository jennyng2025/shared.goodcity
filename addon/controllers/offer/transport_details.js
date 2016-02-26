import Ember from 'ember';

export default Ember.Controller.extend({
  delivery: Ember.computed.alias('model.delivery'),
  contact: Ember.computed.alias('delivery.contact'),
  hasActiveGGVOrder: Ember.computed.alias('delivery.gogovanOrder.isActive'),
  messageBox: Ember.inject.service(),
  i18n: Ember.inject.service(),
  isDonorApp: Ember.computed.alias("session.isDonorApp"),

  user: Ember.computed(function(){
    var userId = this.get("model.createdBy.id") || this.session.get("currentUser.id");
    return this.store.peekRecord('user', userId);
  }).volatile(),

  userName: Ember.computed('contact.name', 'user.fullName', function(){
    return this.get('contact.name') || this.get("user.fullName");
  }),

  userMobile: Ember.computed('contact.mobile', 'user.mobile', function(){
    return this.get('contact.mobile') || this.get("user.mobile");
  }),

  district: Ember.computed('contact.address.district.name', 'user.address.district.name', function(){
    return this.get('contact.address.district.name') || this.get("user.address.district.name");
  }),

  actions: {
    handleBrokenImage() {
      this.get("model.reviewedBy").set("hasImage", null);
    },

    cancelDelivery() {
      if(this.get('hasActiveGGVOrder')) {
        // this.set('cancelBooking', true);
        this.transitionToRoute('delivery.cancel_booking', this.get('delivery'))
          .then(newRoute => newRoute.controller.set('isCancel', true));
      } else {
        this.send('removeDelivery', this.get('delivery'));
      }
    },

    modifyBooking() {
      if(this.get('hasActiveGGVOrder')) {
        this.transitionToRoute('delivery.cancel_booking', this.get('delivery'))
          .then(newRoute => newRoute.controller.set('isCancel', false));

      } else {
        this.transitionToRoute('offer.plan_delivery', this.get('delivery.offer'), {queryParams: {modify: true}});
      }
    },

    removeDelivery(delivery) {
      var _this = this;
      this.get("messageBox").confirm(this.get("i18n").t("delete_confirm"), () => {
        var loadingView = _this.container.lookup('component:loading').append();
        var offer = delivery.get('offer');

        delivery.destroyRecord()
          .then(function() {
            offer.set("state", "reviewed");
            var route = _this.get('session.isAdminApp') ? 'review_offer' : 'offer.offer_details';
            _this.transitionToRoute(route, offer);
          })
          .finally(() => loadingView.destroy());
      });
    }
  }
});
