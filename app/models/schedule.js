import DS from 'ember-data';

var attr = DS.attr,
    hasMany = DS.hasMany;

export default DS.Model.extend({
  resource:    attr('string'),
  slot:        attr('number'),
  slotName:    attr('string'),
  zone:        attr('string'),
  scheduledAt: attr('date'),

  deliveries:   hasMany('delivery'),

  dayTime: function() {
    var slot  = this.get('slotName');
    var value = slot ? slot.split(',') : [];
    if(value.length > 1) {
      value = value[0];
    } else {
      value = slot.split(':')[0];
      value = (parseInt(value) > 8 && parseInt(value) < 12 ) ? "morning" : "afternoon";
    }
    return Ember.I18n.t("day." + value.toLowerCase());
  }.property("slotName"),
});
