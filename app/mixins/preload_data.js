import Ember from 'ember';
import AjaxPromise from '../utils/ajax-promise';
import config from '../config/environment';

export default Ember.Mixin.create({
  preloadData: function(promises = []){
    if (this.session.get('authToken')) {
      promises = promises.concat(this.retrieve(config.APP.PRELOAD_AUTHORIZED_TYPES));
      promises.push(
        new AjaxPromise("/auth/current_user_profile", "GET", this.session.get("authToken"))
          .then(data => {
            this.store.pushPayload(data);
            this.store.push('user', data.user_profile);
          })
      );
    }

    return Ember.RSVP.all(promises).catch(error => {
      if (error.status === 0) {
        this.transitionTo("offline");
      } else {
        this.handleError(error);
      }
    });
  },

  preloadOffers: function(){
    var current_user_id = parseInt(this.session.get('currentUser.id'));
    return current_user_id ? this.store.find("offer", {created_by_id: current_user_id}) : "";
  },


  retrieve: function(types){
    var promises = types => types.map(type => this.store.find(type));
    return promises(types);
  },
});
