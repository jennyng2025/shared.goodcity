import Ember from 'ember';

var AuthorizeRoute =  Ember.Route.extend({
  beforeModel: function(transition) {
    if (!this.controllerFor('application').get('isLoggedIn')) {
      alert('You must log in!');
      var loginController = this.controllerFor('login');
      loginController.set('attemptedTransition', transition);
      this.transitionTo('login');
    }
  },
});

export default AuthorizeRoute;
