import Ember from 'ember';
import DS from 'ember-data';
import Addressable from './addressable';

var attr = DS.attr;

export default Addressable.extend({
  firstName:   attr('string'),
  lastName:    attr('string'),
  mobile:      attr('string'),

  permission:  DS.belongsTo('permission', { async: false }),

  isDonor: Ember.computed.empty("permission.name"),
  isStaff: Ember.computed.notEmpty("permission.name"),
  isReviewer: Ember.computed.equal("permission.name", "Reviewer"),
  isSupervisor: Ember.computed.equal("permission.name", "Supervisor"),

  mobileWithCountryCode: Ember.computed('mobile', function(){
    return this.get('mobile') ? ("+852" + this.get('mobile')) : "";
  }),

  fullName: Ember.computed('firstName', 'lastName', function(){
    return (this.get('firstName') + " " + this.get('lastName'));
  })
});
