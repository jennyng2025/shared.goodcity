import VerifyOfferStateRoute from './verify_offer_state';

export default VerifyOfferStateRoute.extend({

  setupController(controller, model){
    this._super(controller, model);

    var isModifyingGGV = !this.get("backClick") && model.get('schedule') && !model.get("wasDropOff");
    var dateSelection, timeSelection;

    if(isModifyingGGV){
      var selectedSlot = model.get('schedule.slotName');
      timeSelection = controller.get('timeSlots').filterBy('name', selectedSlot).get('firstObject');
      dateSelection = model.get('schedule.scheduledAt');

      var district = model.get('contact.address.district');
      var territory = district.get('territory');
      controller.set('selectedTerritory', territory);
      controller.set('selectedDistrict', district);
      this.resetExtraRequirements(controller);

    } else if(this.get("backClick")) {
      dateSelection = controller.get('selectedDate');
      timeSelection = controller.get('selectedTime');
    } else {
      dateSelection = null;
      timeSelection = null;
      this.resetExtraRequirements(controller);
    }

    controller.set('selectedDate', dateSelection);
    controller.set('selectedTime', timeSelection);

    var offer = controller.get("deliveryController.model.offer");
    controller.set('offer', offer);
  },

  resetExtraRequirements: function(controller) {
    controller.set("speakEnglish", false);
    controller.set("borrowTrolley", false);
    controller.set("porterage", false);
  }

});
