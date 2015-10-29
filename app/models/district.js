import DS from 'ember-data';
var attr = DS.attr,
    belongsTo = DS.belongsTo;

export default DS.Model.extend({
  name:      attr('string'),
  territory: belongsTo('territory', { async: false })
});
