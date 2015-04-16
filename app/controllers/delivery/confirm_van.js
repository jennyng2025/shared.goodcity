import Ember from 'ember';
import config from './../../config/environment';
import AjaxPromise from './../../utils/ajax-promise';

export default Ember.ObjectController.extend({
  needs: ['delivery'],

  user: Ember.computed.alias('session.currentUser'),
  mobileNumber: Ember.computed.alias('user.mobile'),
  orderDetails: Ember.computed.alias('model'),

  districtName: function(){
    var district = this.store.getById("district", this.get('districtId'));
    return district.get('name');
  }.property('districtId'),

  actions: {

    confirmOrder: function(){
      var controller = this;
      var loadingView = this.container.lookup('view:loading').append();
      var orderDetails = controller.get("orderDetails");

      // contact details
      var name = Ember.$("#userName").val();
      var mobile = config.APP.HK_COUNTRY_CODE + Ember.$("#mobile").val();
      var contactProperties = { name: name, mobile: mobile };

      // schedule details
      var scheduleProperties = { scheduledAt: orderDetails.get('pickupTime'), slotName: orderDetails.get('slot') };

      var delivery = controller.store.getById("delivery", controller.get('controllers.delivery.id'));
      var offer = delivery.get('offer');

      orderDetails.setProperties({ name: name, mobile: mobile, offerId: offer.get('id') });
      var handleError = error => { loadingView.destroy(); throw error; };

      contactProperties.addressAttributes = { addressType: 'collection', districtId: orderDetails.get('districtId') }

      var properties = {
        delivery: {
          id: delivery.id,
          deliveryType: delivery.get("deliveryType"),
          offerId: offer.id,
          scheduleAttributes: scheduleProperties  ,
          contactAttributes: contactProperties,
        },
        gogovanOrder: orderDetails._attributes };

      new AjaxPromise("/confirm_ggv_order", "POST", this.get('session.authToken'), properties)
        .then(function(data) {
          controller.store.pushPayload(data);
          // offer.set('state', 'scheduled');
          controller.set("inProgress", false);
          loadingView.destroy();

          if(controller.get("session.isAdmin")) {
            controller.transitionToRoute('review_offer.logistics', offer);
          } else {
            controller.transitionToRoute('offer.transport_details', offer);
          }
        }).catch(error => {
        loadingView.destroy();
        schedule.unloadRecord();
        throw error;
      });
    }
  }
});
