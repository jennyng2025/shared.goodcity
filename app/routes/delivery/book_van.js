import VerifyOfferStateRoute from './verify_offer_state';

export default VerifyOfferStateRoute.extend({

  setupController: function(controller, model){
    controller.set('model', model);

    var isModifyingGGV = !this.get("backClick") && model.get('schedule') && !model.get("wasDropOff");
    var dateSelection, timeSelection;

    if(isModifyingGGV){
      var selectedSlot = model.get('schedule.slotName');
      timeSelection = controller.get('timeSlots').filterBy('name', selectedSlot).get('firstObject');
      dateSelection = model.get('schedule.scheduledAt');
    } else if(this.get("backClick")) {
      dateSelection = controller.get('selectedDate');
      timeSelection = controller.get('selectedTime');
    } else {
      dateSelection = null;
      timeSelection = null;
    }

    controller.set('selectedDate', dateSelection);
    controller.set('selectedTime', timeSelection);
  }

});
