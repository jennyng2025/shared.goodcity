import Ember from 'ember';

export default Ember.Component.extend({
  attributeBindings: ['selected_id'],
  classNames: ['district-selection'],
  currentSelected: {id: null},
  selected_id: null,

  currentSelectedObserver: function(){
    this.set('selected_id',this.getWithDefault('currentSelected.id'));
  }.observes('currentSelected'),

  districtsByTerritory: function(key, value) {
    var store = this.get('targetObject.store');
    return (arguments.length > 1 && value !== '' ? value : store.all('district').sortBy('name'));
  }.property(),

  allTerritory: function(){
    var store = this.get('targetObject.store');
    return store.all('territory').sortBy('name');
  }.property(),

  selectDistrictLabel: function() {
    return Ember.I18n.t("select_district");
  }.property(),

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
