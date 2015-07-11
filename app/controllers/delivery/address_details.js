import Ember from 'ember';
import { translationMacro as t } from "ember-i18n";

export default Ember.Controller.extend({

  delivery: Ember.computed.alias("controllers.delivery.model"),
  user: Ember.computed.alias('delivery.offer.createdBy'),
  territoryId: Ember.computed.alias('user.address.district.territory.id'),
  districtId: Ember.computed.alias('user.address.district.id'),
  selectedTerritory: {id: null},
  selectedDistrict: {id: null},

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
