import DS from 'ember-data';
var attr = DS.attr,
    hasMany = DS.hasMany ;

export default DS.Model.extend({
  name: attr('string'),
  districts:  hasMany('district', { async: false })
});
