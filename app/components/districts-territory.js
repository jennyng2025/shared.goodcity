import Ember from 'ember';
import { translationMacro as t } from "ember-i18n";

export default Ember.Component.extend({
  attributeBindings: ['selected_id'],
  classNames: ['district-selection'],
  currentSelected: {id: null},
  selected_id: null,
  i18n: Ember.inject.service(),

  currentSelectedObserver: function(){
    var selectedDistrictId = this.getWithDefault('currentSelected.id');
    if(selectedDistrictId) { this.set('selected_id', selectedDistrictId); }
  }.observes('currentSelected'),

  districtsByTerritory: function(key, value) {
    var store = this.get('targetObject.store');
    return (arguments.length > 1 && value !== '' ? value : store.peekAll('district').sortBy('name'));
  }.property(),

  allTerritory: function(){
    var store = this.get('targetObject.store');
    return store.peekAll('territory').sortBy('name');
  }.property(),

  selectDistrictLabel: t("select_district"),

  actions: {
    findDistrictbyTerritory: function(territory){
      var districts = territory ? territory.get('districts').sortBy('name') : '';
      this.set('districtsByTerritory', districts);
    }
  },

  didInsertElement: function(){

    Ember.$().ready(function (){
      Ember.$(".radio").click(function(){
        Ember.$(".radio").removeClass('active');
        Ember.$(this).addClass('active');
      });
    });
  }
});
