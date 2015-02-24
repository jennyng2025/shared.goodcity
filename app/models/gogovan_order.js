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

  needEnglish:   attr('boolean'),
  needCart:      attr('boolean'),
  needCarry:     attr('boolean'),
  baseFee:       attr('string'),

  delivery:      belongsTo('delivery'),
});
