import VerifyOfferStateRoute from './verify_offer_state';

export default VerifyOfferStateRoute.extend({

  setupController: function(controller, model){
    controller.set('model', model);

    if(model.get("wasDropOff")){
      var selectedSlot = model.get('schedule.slot').toString();
      var timeslot = controller.get('slots').filterBy('id', selectedSlot).get('firstObject');
      controller.set('selectedDate', model.get('schedule.scheduledAt'));
      controller.set('selectedId', timeslot);
    } else {
      controller.set('selectedDate', null);
      controller.set('selectedId', null);
    }
  }

});
