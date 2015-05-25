import DS from 'ember-data';

var attr = DS.attr,
    belongsTo = DS.belongsTo;

export default DS.Model.extend({
  name:          attr('string'),
  mobile:        attr('string'),

  bookingId:     attr('number'),
  status:        attr('string'),
  pickupTime:    attr('date'),
  slot:          attr('string'),
  districtId:    attr('number'),
  territoryId:   attr('number'),
  offerId:       attr('number'),
  completedAt:     attr('date'),

  needEnglish:   attr('boolean'),
  needCart:      attr('boolean'),
  needCarry:     attr('boolean'),
  baseFee:       attr('string'),

  price:         attr('number'),
  driverName:    attr('string'),
  driverMobile:  attr('string'),
  driverLicense: attr('string'),
  ggvUuid:       attr('string'),
  delivery:      belongsTo('delivery'),

  isPending: Ember.computed.equal("status", "pending"),
  isActive: Ember.computed.equal("status", "active"),
  isCompleted: Ember.computed.equal("status", "completed"),
  isCancelled: Ember.computed.equal("status", "cancelled"),
  isPickedUp: Ember.computed.or("isActive", "isCompleted"),
  nonCompleted: Ember.computed.or("isActive", "isPending"),
});
