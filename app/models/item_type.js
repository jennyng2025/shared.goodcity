import DS from 'ember-data';

var attr = DS.attr;

export default DS.Model.extend({
  name: attr('string'),
  code: attr('string'),
  parentId: attr('number'),
  isItemTypeNode: attr('boolean', {defaultValue: false}),
  text: ""
});
