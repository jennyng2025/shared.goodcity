import Ember from 'ember';
import { translationMacro as t } from "ember-i18n";

export default Ember.Controller.extend({

  i18n: Ember.inject.service(),
  delivery: Ember.computed.alias("controllers.delivery.model"),
  user: Ember.computed.alias('delivery.offer.createdBy'),
  selectedTerritory: null,
  selectedDistrict: null,

  initSelectedTerritories: function() {
    this.set("selectedTerritory", this.get("user.address.district.territory.id"));
    this.set("selectedDistrict", this.get("user.address.district.id"));
  }.on("init"),

  territoriesPrompt: t("all"),
  destrictPrompt: t("delivery.select_district"),

  territories: function(){
    return this.store.all('territory');
  }.property(),

  districtsByTerritory: function() {
    if(this.selectedTerritory && this.selectedTerritory.id) {
      return this.selectedTerritory.get('districts').sortBy('name');
    } else {
      return this.store.all('district').sortBy('name');
    }
  }.property('selectedTerritory'),
});
