import DS from 'ember-data';
import Ember from 'ember';

var attr = DS.attr,
    belongsTo = DS.belongsTo;

export default DS.Model.extend({
  start:         attr('date'),
  finish:        attr('date'),
  deliveryType:  attr('string'),

  offer:         belongsTo('offer'),
  contact:       belongsTo('contact'),
  schedule:      belongsTo('schedule'),
  gogovanOrder:  belongsTo('gogovan_order'),

  isGogovan: Ember.computed.equal("deliveryType", "Gogovan"),
  isDropOff: Ember.computed.equal("deliveryType", "Drop Off"),
  isAlternate: Ember.computed.equal("deliveryType", "Alternate"),

  noDropOff: function() {
    return this.get('deliveryType') !== 'Drop Off';
  }.property('deliveryType'),

  noGogovan: function() {
    return this.get('deliveryType') !== 'Gogovan';
  }.property('deliveryType'),
});
