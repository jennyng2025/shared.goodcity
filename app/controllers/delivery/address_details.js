import Ember from 'ember';
import { translationMacro as t } from "ember-i18n";

export default Ember.Controller.extend({

  i18n: Ember.inject.service(),
  delivery: Ember.computed.alias("deliveryController.model"),
  user: Ember.computed.alias('delivery.offer.createdBy'),
  selectedTerritory: null,
  selectedDistrict: null,

  initSelectedTerritories: Ember.on('init', function() {
    if(this.get("selectedDistrict") === null) {
      this.set("selectedTerritory", this.get("user.address.district.territory"));
      this.set("selectedDistrict", this.get("user.address.district"));
    }
  }),

  territoriesPrompt: t("all"),
  destrictPrompt: t("delivery.select_district"),

  territories: Ember.computed(function(){
    return this.store.peekAll('territory');
  }),

  districtsByTerritory: Ember.computed('selectedTerritory', function(){
    if(this.selectedTerritory && this.selectedTerritory.id) {
      return this.selectedTerritory.get('districts').sortBy('name');
    } else {
      return this.store.peekAll('district').sortBy('name');
    }
  }),
});
