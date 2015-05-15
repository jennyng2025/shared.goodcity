import DS from 'ember-data';
import Addressable from './addressable';

var attr = DS.attr,
  belongsTo = DS.belongsTo,
  hasMany = DS.hasMany;

export default Addressable.extend({
  firstName:   attr('string'),
  lastName:    attr('string'),
  mobile:      attr('string'),
  createdAt:   attr('date'),

  lastConnected:    attr('date'),
  lastDisconnected: attr('date'),

  image:          belongsTo('image'),
  permission:     belongsTo('permission'),
  reviewedOffers: hasMany('offers', { inverse: 'reviewedBy' }),
  donations:      hasMany('offers', { inverse: 'createdBy' }),

  nameInitial: function() {
    return this.get('firstName').charAt(0).capitalize();
  }.property('firstName'),

  roleInitials: function() {
    var permission = this.get("permission.name") || "Donor";
    return "("+ permission.capitalize().charAt(0) +")";
  }.property('permission'),

  displayImageUrl: function() {
    return this.get('image.thumbImageUrl') || "assets/images/default_user_image.jpg";
  }.property('image'),

  hasImage: function(key, value) {
    if(arguments.length > 1) {
      return value;
    } else {
      return this.get('image.thumbImageUrl');
    }
  }.property('image'),

  fullName: function() {
    return (this.get('firstName') + " " + this.get('lastName'));
  }.property('firstName', 'lastName'),

  onlineStatus: function(){
    if(!this.get('lastConnected') && !this.get('lastDisconnected')) {
      return Ember.I18n.t('not_connected');
    } else if(this.get('lastDisconnected') > this.get('lastConnected')) {
      return false;
    } else if(this.get('lastDisconnected') < this.get('lastConnected')) {
      return Ember.I18n.t('online');
    }
  }.property('lastConnected', 'lastDisconnected'),

});
