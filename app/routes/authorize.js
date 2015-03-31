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

  resourceNotFound: function(resource){
    var error = new Error();
    error.name = resource + "not found";
    error.status = 404;
    error.message = Ember.I18n.t(resource +"_not_found");
    throw error;
  },

  showAlertPopup: function(message){
    Ember.$("#errorMessage").text(message);
    Ember.$('#errorModal').foundation('reveal', 'open');
    Ember.$(".loading-indicator").hide();
  },

  actions: {
    error: function(error, transition) {
      var route = this;
      if(error.status === 404) {
        var view = this.container.lookup('view:alert').append();
        Ember.run.schedule("afterRender", function(){
          route.showAlertPopup(error.message || Ember.I18n.t("404_error"));
        });
      } else {
        return true;
      }
    }
  },
});
