import DS from 'ember-data';
import Addressable from './addressable';

var attr = DS.attr,
  belongsTo = DS.belongsTo;

export default Addressable.extend({
  name:   attr('string'),
  mobile: attr('string'),

  delivery: belongsTo('delivery', { async: false })
});
