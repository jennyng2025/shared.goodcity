import Ember from 'ember';
import addressDetails from './address_details';
import AjaxPromise from './../../utils/ajax-promise';

export default addressDetails.extend({
  needs: ["delivery"],

  actions: {
    saveContactDetails: function() {
      var controller = this;
      var addressProperties = this.getProperties('street', 'flat', 'building');
      addressProperties.districtId  = this.selectedDistrict.id;
      addressProperties.addressType = 'collection';

      var contactProperties    = {};
      contactProperties.name   = Ember.$('#userName').val();
      contactProperties.mobile = "+852" + Ember.$('#mobile').val();

      var deliveryId = this.get('controllers.delivery').get('model.id');
      var delivery   = this.store.getById('delivery', deliveryId);
      var offer      = delivery.get('offer');
      var schedule   = delivery.get('schedule');

      var loadingView = this.container.lookup('view:loading').append();
      var handleError = error => { loadingView.destroy(); throw error; };

      contactProperties.addressAttributes = addressProperties;

      var properties = {
        delivery: {
          id: delivery.id,
          deliveryType: delivery.get("deliveryType"),
          offerId: offer.id,
          scheduleAttributes: schedule._attributes,
          contactAttributes: contactProperties }
      };

      new AjaxPromise("/confirm_delivery", "POST", controller.get('session.authToken'), properties)
        .then(function(data) {
          controller.store.pushPayload(data);
          controller.set("inProgress", false);
          loadingView.destroy();

          controller.transitionToRoute('delivery.thank_offer')
            .then(newRoute => newRoute.controller.set('contact', delivery.get('contact')));
        }).catch(error => {
          loadingView.destroy();
          throw error;
      });
    }
  }
});
