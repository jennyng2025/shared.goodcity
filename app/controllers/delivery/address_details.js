import Ember from 'ember';

export default Ember.ObjectController.extend({

  user: Ember.computed.alias('session.currentUser'),
  territoryId: Ember.computed.alias('user.address.district.territory.id'),
  districtId: Ember.computed.alias('user.address.district.id'),
  selectedTerritory: {id: null},
  selectedDistrict: {id: null},

  territories: function(){
    return this.store.all('territory');
  }.property(),

  districtsByTerritory: function() {
    if(this.selectedTerritory && this.selectedTerritory.id) {
      return this.selectedTerritory.get('districts');
    } else {
      return this.store.all('district');
    }
  }.property('selectedTerritory'),
});
