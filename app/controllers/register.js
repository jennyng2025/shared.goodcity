import Ember from 'ember';
import AjaxPromise from '../utils/ajax-promise';
import config from '../config/environment';

export default Ember.Controller.extend({
  actions: {
    registerUser: function() {
      var _this = this;
      Ember.$('.loader_image').show();
      var mobilePhone = config.APP.HK_COUNTRY_CODE + this.get('mobilePhone');
      var firstName = this.get('firstName');
      var lastName = this.get('lastName');
      var district_id = Ember.$('.district-selection').attr('selected_id') || null;
      var user_auth = { mobile: mobilePhone, first_name: firstName, last_name: lastName,
        address_attributes: {district_id: district_id, address_type: "profile"}};

      new AjaxPromise("/auth/signup", "POST", null, {user_auth: user_auth})
        .then(function(data) {
          _this.set('session.otpAuthKey', data.otp_auth_key);
          _this.setProperties({mobilePhone:null, firstName:null, lastName:null});
          _this.transitionToRoute('/authenticate');
        })
        .catch(function(xhr) {
          Ember.$('#mobile_error').text(xhr.responseJSON.error.text);
        })
        .finally(function() {
          Ember.$('.loader_image').hide();
        });
    }
  }
});
