import DS from 'ember-data';

var attr = DS.attr,
    hasMany = DS.hasMany;

export default DS.Model.extend({
  resource:    attr('string'),
  slot:        attr('number'),
  slotName:    attr('string'),
  zone:        attr('string'),
  scheduledAt: attr('date'),

  deliveries:  hasMany('delivery'),
  currentDeliveryId: attr('number'),

  dayTime: function() {
    var slot  = this.get('slotName');
    var value = slot.split(',');
    if(value.length > 1) {
      value = value[0];
    } else {
      value = slot.split(':')[0];
      value = (parseInt(value) > 8 && parseInt(value) < 12 ) ? "Morning" : "Afternoon";
    }
    return value;
  }.property("slotName"),
});
