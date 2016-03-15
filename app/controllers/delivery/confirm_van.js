import Ember from 'ember';
import config from './../../config/environment';
import AjaxPromise from './../../utils/ajax-promise';
const { getOwner } = Ember;

export default Ember.Controller.extend({
  deliveryController: Ember.inject.controller('delivery'),
  delivery: Ember.computed.alias("deliveryController.model"),
  user: Ember.computed.alias('delivery.offer.createdBy'),
  orderDetails: Ember.computed.alias('model'),

  mobileNumber: Ember.computed('user.mobile', function(){
    return this.get("user.mobile").replace(/\+852/, "");
  }),

  districtName: Ember.computed('model.districtId', function(){
    var district = this.store.peekRecord("district", this.get('model.districtId'));
    return district.get('name');
  }),

  actions: {

    confirmOrder() {
      var controller = this;
      var loadingView = getOwner(this).lookup('component:loading').append();
      var orderDetails = controller.get("orderDetails");

      // contact details
      var name = Ember.$("#userName").val();
      var mobile = config.APP.HK_COUNTRY_CODE + Ember.$("#mobile").val();
      var contactProperties = { name: name, mobile: mobile };

      // schedule details
      var scheduleProperties = { scheduledAt: orderDetails.get('pickupTime'), slotName: orderDetails.get('slot') };

      var delivery = controller.store.peekRecord("delivery", controller.get('deliveryController.model.id'));
      var offer = delivery.get('offer');

      orderDetails.setProperties({ name: name, mobile: mobile, offerId: offer.get('id') });
      var handleError = error => { loadingView.destroy(); throw error; };

      contactProperties.addressAttributes = { addressType: 'collection', districtId: orderDetails.get('districtId') }

      var properties = {
        delivery: {
          id: delivery.id,
          deliveryType: 'Gogovan',
          offerId: offer.id,
          scheduleAttributes: scheduleProperties  ,
          contactAttributes: contactProperties,
        },
        gogovanOrder: orderDetails.toJSON() };

      new AjaxPromise("/confirm_delivery", "POST", this.get('session.authToken'), properties)
        .then(function(data) {
          controller.store.pushPayload(data);
          controller.set("inProgress", false);
          offer.set('state', 'scheduled');
          loadingView.destroy();

          if(controller.get("session.isAdminApp")) {
            controller.transitionToRoute('review_offer.logistics', offer);
          } else {
            controller.transitionToRoute('offer.transport_details', offer);
          }
        }).catch(error => {
          loadingView.destroy();
          throw error;
      });
    }
  }
});
