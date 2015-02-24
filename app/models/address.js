import Ember from 'ember';
import DS from 'ember-data';

var attr = DS.attr,
    belongsTo = DS.belongsTo;

export default DS.Model.extend({
  flat:        attr('string'),
  building:    attr('string'),
  street:      attr('string'),
  addressType: attr('string'),

  district:    belongsTo('district'),

  addressableType: attr('string'),
  addressable:     belongsTo('addressable', { polymorphic: true }),

  fullAddress: function(){
    var addressDetails = [this.get('flat'), this.get('building'), this.get('street')];
    addressDetails = Ember.isBlank(addressDetails.compact()) ? [this.get('district.name'), this.get('district.territory.name')] : addressDetails;
    var formattedAddress = addressDetails.join('<br>');
    return new Ember.Handlebars.SafeString(formattedAddress);
  }.property('flat','building','street')
});
