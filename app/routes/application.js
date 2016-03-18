import Ember from 'ember';
import AjaxPromise from '../utils/ajax-promise';
import config from '../config/environment';
import preloadDataMixin from '../mixins/preload_data';
const { getOwner } = Ember;

export default Ember.Route.extend(preloadDataMixin, {
  cordova: Ember.inject.service(),
  i18n: Ember.inject.service(),

  _loadDataStore: function(){
    return this.preloadData(true).catch(error => {
      if (error.status === 0 || (error.errors && error.errors[0].status === "0")) {
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

  beforeModel(transition = []) {
    if (transition.queryParams.ln) {
      var language = transition.queryParams.ln === "zh-tw" ? "zh-tw" : "en";
      this.set('session.language', language);
    }

    var language = this.session.get("language") || "en";
    moment.locale(language);
    this.set("i18n.locale", language);

    Ember.onerror = window.onerror = error => this.handleError(error);
    return this._loadDataStore();
  },

  renderTemplate() {
    this.render(); // default template

    this.render('notifications', {   // the template to render
      into: 'application',      // the template to render into
      outlet: 'notifications', // the name of the outlet in that template
      controller: 'notifications'   // the controller to use for the template
    });

    if(this.get("session.isAdminApp")){
      this.render('notification_link', {
        into: 'application',
        outlet: 'notification_link',
        controller: 'notification_link'
      });
    }
  },

  logger: Ember.inject.service(),
  messageBox: Ember.inject.service(),

  handleError: function(reason) {
    try
    {
      var status;
      try { status = parseInt(reason.errors[0].status); }
      catch (err) { status = reason.status; }

      if (status === 401) {
        if (this.session.get('isLoggedIn')) {
          this.controllerFor("application").send('logMeOut');
        }
      } else if ([403, 404].indexOf(status) >= 0) {
        this.get("logger").error(reason);
        this.get("messageBox").alert(this.get("i18n").t(status+"_error"));
      } else if (status === 0) {
        // status 0 means request was aborted, this could be due to connection failure
        // but can also mean request was manually cancelled
        this.get("messageBox").alert(this.get("i18n").t("offline_error"));
      } else {
        this.get("logger").error(reason);
        this.get("messageBox").alert(this.get("i18n").t("unexpected_error"));
      }
    } catch (err) {}
  },

  actions: {
    setLang(language) {
      this.session.set("language", language);
      window.location.reload();
    },
    loading() {
      Ember.$(".loading-indicator").remove();
      var view = getOwner(this).lookup('component:loading').append();
      this.router.one('didTransition', view, 'destroy');
    },
    // this is hopefully only triggered from promises from routes
    // so in this scenario redirect to home for 404
    error(reason) {
      try {
        var errorStatus = parseInt(reason.status || reason.errors && reason.errors[0].status)
        if ([403, 404].indexOf(errorStatus) >= 0) {
          this.get("messageBox").alert(this.get("i18n").t(errorStatus+"_error"), () => this.transitionTo("/"));
        } else {
          this.handleError(reason);
        }
      } catch (err) {}
    },

    willTransition(transition) {
      Ember.run.next(function() {
        // before transitioning close all foundation-dialog box
        Ember.$(".reveal-modal").foundation("reveal", "close");

        // remove joyride-popup if not assigned for page
        if($(".joyride-list").length === 0) {
          Ember.$('.joyride-tip-guide').remove();
        }
      });
    }
  }
});
