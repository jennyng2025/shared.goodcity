import Ember from 'ember';
import config from '../config/environment';
import AjaxPromise from '../utils/ajax-promise';
import preloadDataMixin from '../mixins/preload_data';

export default Ember.Route.extend(preloadDataMixin, {

  beforeModel: function(transition) {
    var _this = this;
    Ember.run(function(){
      _this.controllerFor('application').send('logMeIn');
    });
    return this.preloadData();
  },

  afterModel: function() {
    // After everthying has been loaded, redirect user to requested url
    var attemptedTransition = this.controllerFor('login').get('attemptedTransition');
    if (attemptedTransition) {
      attemptedTransition.retry();
      this.set('attemptedTransition', null);
    } else {
      var currentUser = this.get('session.currentUser');
      if (this.get('session.isAdminApp')) {
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
