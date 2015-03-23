import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function(transition) {
    if (!this.session.get('isLoggedIn')) {
      alert('You must log in!');
      var loginController = this.controllerFor('login');
      loginController.set('attemptedTransition', transition);
      this.transitionTo('login');
    }
  },

  actions: {
    error: function() {
      var resource = (this.routeName.indexOf("offer") > -1) ? "offer" : "item";
      var message = Ember.I18n.t("resource_not_found", {resource: resource});
      Ember.$("#errorMessage").text(message);
      Ember.$('#errorModal').foundation('reveal', 'open');
    }
  }
});
