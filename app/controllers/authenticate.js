import Ember from 'ember';
import AjaxPromise from '../utils/ajax-promise';
import config from '../config/environment';

export default Ember.Controller.extend({

  alert: Ember.inject.service(),
  attemptedTransition: null,
  pin: "",

  mobile: Ember.computed('mobilePhone', function(){
    return config.APP.HK_COUNTRY_CODE + this.get('mobilePhone');
  }),

  actions: {

    authenticateUser() {
      Ember.$('.auth_error').hide();
      var pin = this.get('pin');
      var otp_auth_key = this.get('session.otpAuthKey');
      var _this = this;

      var loadingView = this.container.lookup('component:loading').append();
      new AjaxPromise("/auth/verify", "POST", null, {pin: pin, otp_auth_key: otp_auth_key})
        .then(function(data) {
          _this.setProperties({pin:null});
          _this.set('session.authToken', data.jwt_token);
          _this.set('session.otpAuthKey', null);
          _this.store.pushPayload(data.user);
          _this.setProperties({pin: null});
          _this.transitionToRoute('post_login');
        })
        .catch(function(jqXHR) {
          Ember.$('#pin').closest('div').addClass('error');
          _this.setProperties({pin: null});
          if (jqXHR.status === 422 && jqXHR.responseJSON.errors && jqXHR.responseJSON.errors.pin) {
            _this.send("openAlertModal", jqXHR.responseJSON.errors.pin);
          }
          console.log("Unable to authenticate");
        })
        .finally(() => loadingView.destroy());
    },

    resendPin() {
      var mobile = this.get('mobile');
      var loadingView = this.container.lookup('component:loading').append();

      new AjaxPromise("/auth/send_pin", "POST", null, {mobile: mobile})
        .then(data => {
          this.set('session.otpAuthKey', data.otp_auth_key);
          this.setProperties({pin:null});
          this.transitionToRoute('/authenticate');
        })
        .catch(error => {
          if ([422, 403].contains(error.status)) {
            Ember.$('#mobile').closest('.mobile').addClass('error');
            return;
          }
          throw error;
        })
        .finally(() => loadingView.destroy());
    }
  }
});
