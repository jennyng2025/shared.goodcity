import Ember from 'ember';
import config from './../../config/environment';

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

      // address details
      var district = controller.store.getById("district", orderDetails.get('districtId'));
      var addressProperties = {addressType: 'collection',
        district: district};

      // contact details
      var name = Ember.$("#userName").val();
      var mobile = config.APP.HK_COUNTRY_CODE + Ember.$("#mobile").val();
      var contactProperties = { name: name, mobile: mobile };

      // schedule details
      var scheduleProperties = { scheduledAt: orderDetails.get('pickupTime'), slotName: orderDetails.get('slot') };
      var schedule = controller.store.createRecord('schedule', scheduleProperties);

      var delivery = controller.store.getById("delivery", controller.get('controllers.delivery.id'));
      var offer = delivery.get('offer');

      orderDetails.setProperties({ name: name, mobile: mobile, offerId: offer.get('id') });
      var handleError = error => { loadingView.destroy(); throw error; };

      // save schedule
      schedule.save().then(function(schedule) {
        delivery.set('schedule', schedule);

        // save contact
        var contact = controller.store.createRecord('contact', contactProperties);
        contact.save().then(function(contact) {
          addressProperties.addressable = contact;
          var address = controller.store.createRecord('address', addressProperties);

          //save address
          address.save().then(function() {
            delivery.set('contact', contact);
            orderDetails.save().then(function(gogovan_order){
              delivery.set('gogovanOrder', gogovan_order);

              // save delivery
              delivery.save().then(function() {
                offer.set('state', 'scheduled');
                controller.set("inProgress", false);
                loadingView.destroy();

                if(controller.get("session.isAdmin")) {
                  controller.transitionToRoute('review_offer.logistics', offer);
                } else {
                  controller.transitionToRoute('offer.transport_details', offer);
                }
              }, handleError);
            }, handleError);
          }, handleError);
        }, handleError);
      })
      .catch(error => {
        loadingView.destroy();
        schedule.unloadRecord();
        throw error;
      });
    }
  }
});
