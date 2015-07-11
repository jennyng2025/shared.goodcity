import Ember from 'ember';
import AjaxPromise from '../utils/ajax-promise';
import config from '../config/environment';
import preloadDataMixin from '../mixins/preload_data';

export default Ember.Route.extend(preloadDataMixin, {
  cordova: Ember.inject.service(),
  i18n: Ember.inject.service(),

  beforeModel: function (transition = []) {
    if (transition.queryParams.ln) {
      var language = transition.queryParams.ln === "zh-tw" ? "zh-tw" : "en";
      this.set('session.language', language);
    }

    var language = this.session.get("language");
    moment.locale(language);
    this.set("i18n.locale", language);

    Ember.onerror = window.onerror = error => this.handleError(error);

    return this.preloadData(true).catch(error => {
      if (error.status === 0) {
        this.transitionTo("offline");
      } else {
        this.handleError(error);
      }
    }).finally(() => {
      // don't know why but placing this before preloadData on iPhone 6 causes register_device request to fail with status 0
      if (this.session.get('isLoggedIn')) {
        this.get("cordova").appLoad();
      }
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

  handleError: function(reason) {
    try
    {
      if (reason.status === 401) {
        if (this.session.get('isLoggedIn')) {
          this.controllerFor("application").send('logMeOut');
        }
      } else if (reason.status === 404) {
        this.get("alert").show(this.get("i18n").t("404_error"));
      } else if (reason.status === 0) {
        // status 0 means request was aborted, this could be due to connection failure
        // but can also mean request was manually cancelled
        this.get("alert").show(this.get("i18n").t("offline_error"));
      } else {
        this.get("logger").error(reason);
        this.get("alert").show(this.get("i18n").t("unexpected_error"));
      }
    } catch (err) {}
  },

  actions: {
    setLang: function(language) {
      this.session.set("language", language);
      window.location.reload();
    },
    loading: function() {
      Ember.$(".loading-indicator").remove();
      var view = this.container.lookup('view:loading').append();
      this.router.one('didTransition', view, 'destroy');
    },
    // this is hopefully only triggered from promises from routes
    // so in this scenario redirect to home for 404
    error: function(reason) {
      try {
        if ([403, 404].indexOf(reason.status) >= 0) {
          this.get("alert").show(this.get("i18n").t(reason.status+"_error"), () => this.transitionTo("/"));
        } else {
          this.handleError(reason);
        }
      } catch (err) {}
    }
  }
});
