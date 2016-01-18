import Ember from 'ember';
import config from './../config/environment';

export default Ember.Controller.extend({
  user: Ember.computed.alias('model.createdBy'),
  contact: Ember.computed.alias('model.delivery.contact'),
  districtName: Ember.computed.alias('contact.address.district.name'),

  gmapUrl: Ember.computed(function(){
    return config.APP.GMAP_URL;
  }),

  userName: Ember.computed('contact.name', 'user', function(){
    return this.get('contact.name') || this.get("user.fullName");
  }),

  userMobile: Ember.computed('contact.mobile', 'user', function(){
    var mobile = this.get('contact.mobile') || this.get("user.mobile");
    return mobile ? mobile.split("+852")[1] : "";
  }),
});
