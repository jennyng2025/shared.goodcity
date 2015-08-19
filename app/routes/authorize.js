import Ember from 'ember';

export default Ember.Route.extend({
  alert: Ember.inject.service(),
  i18n: Ember.inject.service(),

  beforeModel: function(transition) {
    if (!this.session.get('isLoggedIn')) {
      this.get('alert').show(this.get("i18n").t('must_login'), () => {
        var loginController = this.controllerFor('login');
        loginController.set('attemptedTransition', transition);
        this.transitionTo('login');
      });
      return false;
    }
  }
});
