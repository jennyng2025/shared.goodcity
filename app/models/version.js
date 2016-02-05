import Ember from 'ember';
import DS from 'ember-data';

var attr = DS.attr;

export default DS.Model.extend({
  event:          attr('string'),
  itemType:       attr('string'),
  itemId:         attr('number'),
  whodunnit:      attr('string'),
  whodunnitName:  attr('string'),
  state:          attr('string'),
  createdAt:      attr('date'),

  createdDate: Ember.computed(function(){
    return this.get("createdAt").toDateString();
  }),

  i18n: Ember.inject.service(),

  displayMessage: Ember.computed(function(){
    switch (this.get("state")) {
      case 'draft': return this.get("i18n").t("item_log.added", {name: this.get("whodunnitName")});
      case 'submitted' : return this.get("i18n").t("item_log.submitted", {name: this.get("whodunnitName")});
      case 'accepted' : return this.get("i18n").t("item_log.accepted", {name: this.get("whodunnitName")});
      case 'rejected' : return this.get("i18n").t("item_log.rejected", {name: this.get("whodunnitName")});
      case 'received' : return this.get("i18n").t("item_log.received", {name: this.get("whodunnitName")});
      case 'missing' : return this.get("i18n").t("item_log.missing", {name: this.get("whodunnitName")});
    }

    switch (this.get("event")) {
      case 'admin_called':
      case 'donor_called': return this.get("i18n").t("offer_log.donor_called", {name: this.get("whodunnitName")});
      case 'call_accepted' : return this.get("i18n").t("offer_log.call_accepted", {name: this.get("whodunnitName")});
    }

    return this.get("i18n").t("item_log.updated", {name: this.get("whodunnitName")});
  })
});
