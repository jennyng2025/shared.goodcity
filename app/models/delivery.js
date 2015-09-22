import DS from 'ember-data';
import Ember from 'ember';

var attr = DS.attr,
    belongsTo = DS.belongsTo;

export default DS.Model.extend({
  start:         attr('date'),
  finish:        attr('date'),
  deliveryType:  attr('string'),

  offer:         belongsTo('offer', { async: false }),
  contact:       belongsTo('contact', { async: false }),
  schedule:      belongsTo('schedule', { async: false }),
  gogovanOrder:  belongsTo('gogovan_order', { async: false }),

  isGogovan: Ember.computed.equal("deliveryType", "Gogovan"),
  isDropOff: Ember.computed.equal("deliveryType", "Drop Off"),
  isAlternate: Ember.computed.equal("deliveryType", "Alternate"),

  wasDropOff: Ember.computed.notEmpty('schedule.slot'),

  noDropOff: function() {
    return this.get('deliveryType') !== 'Drop Off';
  }.property('deliveryType'),

  noGogovan: function() {
    return this.get('deliveryType') !== 'Gogovan';
  }.property('deliveryType'),

  completedWithGogovan: function(){
    return this.get("isGogovan") && this.get("gogovanOrder.isCompleted");
  }.property('gogovanOrder', 'gogovanOrder.status')
});
