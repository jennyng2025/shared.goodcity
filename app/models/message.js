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

  myMessage: function() {
    var session = this.container.lookup("service:session");
    return this.get("sender.id") === session.get("currentUser.id");
  }.property(),

  isMessage: function() {
    return true;
  }.property('this'),

  createdDate: function() {
    return new Date(this.get("createdAt")).toDateString();
  }.property(),

  itemImageUrl: Ember.computed.alias("item.displayImageUrl")
});
