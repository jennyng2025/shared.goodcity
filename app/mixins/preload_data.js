import Ember from 'ember';
import AjaxPromise from '../utils/ajax-promise';
import config from '../config/environment';

export default Ember.Mixin.create({

  preloadData: function(includePublicTypes) {
    var promises = [];
    var retrieve = types => types.map(type => this.store.findAll(type, { reload: true }));

    if (includePublicTypes) {
      promises = retrieve(config.APP.PRELOAD_TYPES);
    }

    if (this.get("session.authToken")) {
      promises.push(
        new AjaxPromise("/auth/current_user_profile", "GET", this.session.get("authToken"))
          .then(data => {
            this.store.pushPayload(data);
            this.store.pushPayload({ user: data.user_profile });
            this.notifyPropertyChange("session.currentUser");
          })
      );

      var offer_params = this.session.get("isAdminApp") ?
        { states: ["nondraft"] }:
        { states: ["for_donor"] };
      promises.push(
        this.store.query('offer', offer_params)
      );

      promises = promises.concat(retrieve(config.APP.PRELOAD_AUTHORIZED_TYPES));
    }

    return Ember.RSVP.all(promises);
  }
});
