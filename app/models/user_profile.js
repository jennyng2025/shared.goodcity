import Ember from 'ember';
import DS from 'ember-data';
import Addressable from './addressable';

var attr = DS.attr,
  hasMany = DS.hasMany;;

export default Addressable.extend({
  firstName:   attr('string'),
  lastName:    attr('string'),
  mobile:      attr('string'),
  reviewedOffers: hasMany('offers', { inverse: 'reviewedBy' }),

  permission:  DS.belongsTo('permission'),

  isDonor: Ember.computed.empty("permission.name"),
  isStaff: Ember.computed.notEmpty("permission.name"),
  isReviewer: Ember.computed.equal("permission.name", "Reviewer"),
  isSupervisor: Ember.computed.equal("permission.name", "Supervisor"),

  fullName: function(){
    return (this.get('firstName') + " " + this.get('lastName'));
  }.property('firstName', 'lastName')
});
