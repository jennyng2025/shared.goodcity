import DS from 'ember-data';

var attr = DS.attr,
  hasMany = DS.hasMany;

export default DS.Model.extend({
  name:           attr('string'),
  code:           attr('string'),
  isItemTypeNode: attr('boolean', {defaultValue: false}),

  items:          hasMany('item', { async: false }),
  packages:       hasMany('package', { async: false }),
});
