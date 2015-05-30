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
      var params = this.get("session.isAdminApp") ? {states: ["nondraft"]} : {};
      promises.push(this.store.find("offer", params));
      promises.push(
        new AjaxPromise("/auth/current_user_profile", "GET", this.session.get("authToken"))
          .then(data => {
            this.store.pushPayload(data);
            this.store.push("user", data.user_profile);
          })
      );
    }

    return Ember.RSVP.all(promises);
  }
});
