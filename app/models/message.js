import Ember from 'ember';
import DS from 'ember-data';

var attr = DS.attr,
    belongsTo = DS.belongsTo;

export default DS.Model.extend({

  body:        attr('string'),
  isPrivate:   attr('boolean'),
  createdAt:   attr('date'),
  updatedAt:   attr('date'),
  state:       attr('string', {defaultValue: 'read'}),
  sender:      belongsTo('user'),
  item:        belongsTo('item'),
  offer:       belongsTo('offer'),
  myMessage:   false,

  itemImageUrl: Ember.computed.alias("item.displayImageUrl")
});
