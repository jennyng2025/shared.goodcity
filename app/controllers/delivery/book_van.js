import AjaxPromise from './../../utils/ajax-promise';
import addressDetails from './address_details';

export default addressDetails.extend({
  needs: ['delivery'],

  timeSlots: [
    {id: "600", name: "10:00 AM" },
    {id: "630", name: "10:30 AM"},
    {id: "660", name: "11:00 AM"},
    {id: "690", name: "11:30 AM"},
    {id: "720", name: "12:00 PM"},
    {id: "750", name: "12:30 PM"},
    {id: "780", name: "1:00 PM"},
    {id: "810", name: "1:30 PM"},
    {id: "840", name: "2:00 PM"},
    {id: "870", name: "2:30 PM"},
    {id: "900", name: "3:00 PM"},
    {id: "930", name: "3:30 PM"},
    {id: "960", name: "4:00 PM"},
  ],

  selectedDate: null,
  selectedTime: null,
  speakEnglish: false,
  borrowTrolley: false,
  porterage: false,

  actions: {
    bookVan: function(){
      var controller = this;

      var selectedDate = controller.get('selectedDate');
      var deliveryId = controller.get('controllers.delivery').get('id');
      var delivery = controller.store.getById('delivery', deliveryId);

      selectedDate.setMinutes(selectedDate.getMinutes() + parseInt(controller.get('selectedTime.id')));

      var requestProperties = {};
      requestProperties.pickupTime = selectedDate;
      requestProperties.slot = this.get('selectedTime.name');
      requestProperties.districtId = controller.get('selectedDistrict.id');
      requestProperties.territoryId = controller.get('selectedTerritory.id');
      requestProperties.needEnglish = controller.get("speakEnglish");
      requestProperties.needCart = controller.get("borrowTrolley");
      requestProperties.needCarry = controller.get("porterage");
      requestProperties.offerId = delivery.get('offer.id');

      var order = controller.store.createRecord('gogovan_order', requestProperties);
      order.set('delivery', delivery);

      new AjaxPromise("/gogovan_orders/calculate_price", "POST", controller.get('session.authToken'), requestProperties).then(function(data) {
          order.set('baseFee', data['base']);
          controller.transitionToRoute('delivery.confirm_van');
        });
    },
  }
});
