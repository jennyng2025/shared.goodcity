import Ember from 'ember';
import config from '../config/environment';

export default Ember.Route.extend({

  beforeModel: function() {
    var _this = this;
    Ember.run(function(){
      _this.controllerFor('application').send('logMeIn');
    });
    var promises = config.APP.PRELOAD_AUTHORIZED_TYPES
      .map(function(type) { return _this.store.find(type); });
    return Ember.RSVP.allSettled(promises);
  },

  afterModel: function() {
    // After everthying has been loaded, redirect user to requested url
    var attemptedTransition = this.controllerFor('login').get('attemptedTransition');
    if (attemptedTransition) {
      attemptedTransition.retry();
      this.set('attemptedTransition', null);
    } else {
      var currentUser = this.get('session.currentUser');
      if (currentUser.get('isStaff')) {
        var myOffers = this.store.all('offer').filterBy('reviewedBy.id', currentUser.get('id'));
        if(myOffers.get('length') > 0) {
          this.transitionTo('my_list');
        } else {
          this.transitionTo('offers');
        }
      } else {
        this.transitionTo('/offers');
      }
    }
  }

});
