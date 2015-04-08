import Ember from 'ember';
import AjaxPromise from '../utils/ajax-promise';
import config from '../config/environment';

export default Ember.Route.extend({
  beforeModel: function (transition) {
    var _this = this;

    var language = this.session.get("language") || Ember.I18n.default_language;
    Ember.I18n.translations = Ember.I18n.translation_store[language];

    Ember.onerror = function(error) {
      transition.send("error", error);
    };

    window.onerror = function(error){
      transition.send("error", error);
    };

    //preload data
    var retrieve = function(types) {
      return types.map(function(type) { return _this.store.find(type); });
    };
    var promises = retrieve(config.APP.PRELOAD_TYPES);

    //if logged in
    if (_this.session.get('authToken')) {
      promises.push(
        new AjaxPromise("/auth/current_user_profile", "GET", _this.session.get("authToken"))
          .then(function(data) {
            _this.store.pushPayload(data);
            _this.store.push('user', data.user_profile);
          })
      );
      promises = promises.concat(retrieve(config.APP.PRELOAD_AUTHORIZED_TYPES));
    }

    return Ember.RSVP.all(promises).catch(function(error) {
      if (error.status === 0) {
        _this.transitionTo("offline");
        return;
      }
      //will get error if you use _this instead of transition
      transition.send("error", error);
    });
  },

  renderTemplate: function() {
    this.render(); // default template
    if (this.session.get("isLoggedIn")){
      this.render('notifications', {   // the template to render
        into: 'application',      // the template to render into
        outlet: 'notifications', // the name of the outlet in that template
        controller: 'notifications'   // the controller to use for the template
      });
    }
  },

  logger: Ember.inject.service(),
  alert: Ember.inject.service(),

  actions: {
    setLang: function(language) {
      this.session.set("language", language);
      window.location.reload();
    },
    loading: function() {
      var view = this.container.lookup('view:loading').append();
      this.router.one('didTransition', view, 'destroy');
    },
    error: function(reason) {
      if (reason.status === 401) {
        if (this.session.get('isLoggedIn')) {
          this.controllerFor("application").send('logMeOut');
        }
        else {
          this.transitionTo('login');
        }
      } else if (reason.status === 404) {
        this.get("alert").show(Ember.I18n.t("404_error"));
      } else if (reason.status === 0) {
        // status 0 means request was aborted, this could be due to connection failure
        // but can also mean request was manually cancelled
        this.get("alert").show(Ember.I18n.t("offline_error"));
      } else {
        this.get("logger").error(reason);
        this.get("alert").show(Ember.I18n.t("unexpected_error"));
      }
    }
  }
});
