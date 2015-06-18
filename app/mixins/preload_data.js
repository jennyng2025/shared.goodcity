import Ember from 'ember';
import AjaxPromise from '../utils/ajax-promise';
import config from '../config/environment';

export default Ember.Mixin.create({

  preloadData: function(includePublicTypes) {
    var promises = [];
    var retrieve = types => types.map(type => this.store.find(type));

    if (includePublicTypes) {
      promises = retrieve(config.APP.PRELOAD_TYPES);
    }

    if (this.get("session.authToken")) {
      promises = promises.concat(retrieve(config.APP.PRELOAD_AUTHORIZED_TYPES));

      promises.push(
        new Ember.RSVP.Promise((accept, reject) => {
          new AjaxPromise("/auth/current_user_profile", "GET", this.session.get("authToken"))
            .then(data => {
              this.store.pushPayload(data);
              this.store.push('user', data.user_profile);
              var user_id = this.get("session.currentUser.id")
              var offer_params = this.session.get("isAdminApp") ?
                { states: ["nondraft"] }:
                { created_by_id: user_id, states: ["for_donor"] }

              this.store.find('offer', offer_params)
                .then(() => accept())
                .catch(error => reject(reject));
            })
            .catch(error => reject(reject));
          })
        )
    }

    return Ember.RSVP.all(promises);
  }
});
