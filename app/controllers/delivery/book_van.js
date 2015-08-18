import AjaxPromise from './../../utils/ajax-promise';
import addressDetails from './address_details';
import { translationMacro as t } from "ember-i18n";

export default addressDetails.extend({
  needs: ['delivery'],

  selectedDate: null,
  selectedTime: null,
  speakEnglish: false,
  borrowTrolley: false,
  porterage: false,

  datePrompt: t("gogovan.book_van.date"),
  timePrompt: t("gogovan.book_van.time"),
  offer: Ember.computed.alias("delivery.offer"),
  i18n: Ember.inject.service(),

  gogovanOptions: function() {
    var allOptions = this.store.all('gogovan_transport');
    return allOptions.rejectBy('isDisabled', true).sortBy('id');
  }.property(),

  selectedGogovanOption: function(){
    return this.get("offer.gogovanTransport.id") || this.get('gogovanOptions.firstObject.id');
  }.property('gogovanOptions', 'offer'),

  timeSlots: function(){
    var options = [];
    var slots = {"600": "10:00", "630": "10:30",
      "660": "11:00",  "690": "11:30",
      "720": "12:00", "750": "12:30",
      "780": "1:00",  "810": "1:30",
      "840": "2:00", "870": "2:30",
      "900": "3:00", "930": "3:30",
      "960": "4:00"}
    for(var minutes in slots) {
      var period = parseInt(minutes) >= 720 ? this.locale("gogovan.book_van.pm") : this.locale("gogovan.book_van.am");
      options.push({id: minutes, name: slots[minutes] + " " + period});
    }
    return options;

  }.property(),

  locale: function(str) {
    return this.get("i18n").t(str);
  },

  actions: {
    bookVan: function(){
      var controller = this;
      var loadingView = controller.container.lookup('view:loading').append();
      var selectedDate = controller.get('selectedDate');
      var deliveryId = controller.get('controllers.delivery').get('model.id');
      var delivery = controller.store.getById('delivery', deliveryId);
      var gogovanOptionId = controller.get('selectedGogovanOption');

      selectedDate.setMinutes(selectedDate.getMinutes() + parseInt(controller.get('selectedTime.id')));

      var requestProperties = {};
      requestProperties.pickupTime = selectedDate;
      requestProperties.slot = this.get('selectedTime.name');
      requestProperties.districtId = controller.get('selectedDistrict');
      requestProperties.territoryId = controller.get('selectedTerritory');
      requestProperties.needEnglish = controller.get("speakEnglish");
      requestProperties.needCart = controller.get("borrowTrolley");
      requestProperties.needCarry = controller.get("porterage");
      requestProperties.offerId = delivery.get('offer.id');
      requestProperties.gogovanOptionId = gogovanOptionId;

      var order = controller.store.createRecord('gogovan_order', requestProperties);
      order.set('delivery', delivery);
      new AjaxPromise("/gogovan_orders/calculate_price", "POST", controller.get('session.authToken'), requestProperties).then(function(data) {
          order.set('baseFee', data['base']);
          loadingView.destroy();
          controller.transitionToRoute('delivery.confirm_van', {queryParams: {placeOrder: true}});
        });
    },
  }
});
