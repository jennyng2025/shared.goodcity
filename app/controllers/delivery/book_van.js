import AjaxPromise from './../../utils/ajax-promise';
import addressDetails from './address_details';
import { translationMacro as t } from "ember-i18n";
const { getOwner } = Ember;

export default addressDetails.extend({
  deliveryController: Ember.inject.controller('delivery'),

  selectedDate: null,
  selectedTime: null,
  speakEnglish: false,
  borrowTrolley: false,
  porterage: false,

  datePrompt: t("gogovan.book_van.date"),
  timePrompt: t("gogovan.book_van.time"),
  i18n: Ember.inject.service(),

  offer: Ember.computed("deliveryController", {
    get() {
      return this.get("deliveryController.model.offer");
    },
    set(key, value) {
      return value;
    }
  }),

  available_dates: Ember.computed('available_dates.[]', {
    get: function() {
      new AjaxPromise("/available_dates", "GET", this.get('session.authToken'), {schedule_days: 120})
        .then(data => this.set("available_dates", data));
    },
    set: function(key, value) {
      return value;
    }
  }),

  gogovanOptions: Ember.computed(function(){
    var allOptions = this.store.peekAll('gogovan_transport');
    return allOptions.rejectBy('disabled', true).sortBy('id');
  }),

  selectedGogovanOption: Ember.computed('gogovanOptions', 'offer', function(){
    return this.get("offer.gogovanTransport.id") || this.get('gogovanOptions.firstObject.id');
  }),

  timeSlots: Ember.computed(function(){
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
  }),

  locale: function(str) {
    return this.get("i18n").t(str);
  },

  actions: {
    bookVan() {
      var controller = this;
      var loadingView = getOwner(controller).lookup('component:loading').append();
      var selectedDate = controller.get('selectedDate');
      var deliveryId = controller.get('deliveryController.model.id');
      var delivery = controller.store.peekRecord('delivery', deliveryId);
      var gogovanOptionId = controller.get('selectedGogovanOption');

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
