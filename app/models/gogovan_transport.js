import DS from 'ember-data';

var attr = DS.attr;

export default DS.Model.extend({
  name:     attr('string'),
  disabled: attr('boolean'),

  specialId: Ember.computed('id', function(){
    return this.get("id") + "_ggv";
  })
});
