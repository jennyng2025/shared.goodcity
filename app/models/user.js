import DS from 'ember-data';
import Addressable from './addressable';

var attr = DS.attr,
  belongsTo = DS.belongsTo,
  hasMany = DS.hasMany;

export default Addressable.extend({
  firstName:   attr('string'),
  lastName:    attr('string'),

  image:          belongsTo('image'),
  permission:     belongsTo('permission'),

  nameInitial: function() {
    return this.get('firstName').charAt(0).capitalize();
  }.property('firstName'),

  roleInitials: function(){
    if(this.get('isDonor')) {
      return "(D)";
    } else {
      var permission = this.get("permission.name") || "Donor";
      return "("+ permission.capitalize().charAt(0) +")";
    }
  }.property('permission'),

  displayImageUrl: function() {
    return this.get('image.thumbImageUrl') || "assets/images/default_user_image.jpg";
  }.property('image'),

  hasImage: function(key, value){
    if(arguments.length > 1) {
      return value;
    } else {
      return this.get('image.thumbImageUrl');
    }
  }.property('image'),

  fullName: function(){
    return (this.get('firstName') + " " + this.get('lastName'));
  }.property('firstName', 'lastName')
});
