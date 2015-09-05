import Ember from 'ember';
import AjaxPromise from './../../utils/ajax-promise';
import { translationMacro as t } from "ember-i18n";

export default Ember.Controller.extend({

  delivery: Ember.inject.controller(),
  selectedId: null,
  selectedDate: null,
  datePrompt: t("gogovan.book_van.date"),
  timePrompt: t("gogovan.book_van.time"),
  i18n: Ember.inject.service(),

  slots: function() {
    return this.store.peekAll('timeslot').sortBy('id');
  }.property('timeslot.@each'),

  available_dates: function(key, value){
    if (arguments.length > 1) {
      return value;
    } else {
      new AjaxPromise("/available_dates", "GET", this.get('session.authToken'), {schedule_days: 40})
        .then(data => this.set("available_dates", data));
      return value;
    }
  }.property('available_dates.[]'),

  actions: {
    bookSchedule: function() {
      var controller   = this;
      var loadingView  = this.container.lookup('view:loading').append();
      var selectedSlot = controller.get('selectedId');
      var slotName     = controller.get('slots').filterBy('id', selectedSlot.get('id')).get('firstObject.name');

      var scheduleProperties = {
        slot:        selectedSlot.id,
        scheduledAt: controller.get('selectedDate'),
        slotName:    slotName };

      var deliveryId = this.get('delivery.model.id');
      var delivery   = this.store.getById('delivery', deliveryId);
      var offer      = delivery.get("offer");
      var deliveryType = delivery.get("deliveryType");

      var properties = {
        delivery: {
          id: deliveryId,
          deliveryType: deliveryType,
          offerId: offer.id,
          scheduleAttributes: scheduleProperties }
      };

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
