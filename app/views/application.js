import Init from './init';
import Ember from 'ember';

export default Init.extend({

  socketStatus: Ember.computed.alias('controller.controllers.subscriptions.online'),

  currentUser: Ember.computed.alias('controller.session.currentUser'),

  observeUserStatus: function() {
    var view = this;
    window.currentView = view;
    view.updateOnlineStatus();

    window.addEventListener('online',  view.updateOnlineStatus);
    window.addEventListener('offline', view.updateOnlineStatus);
  }.observes('socketStatus', 'currentUser').on("didInsertElement"),

  updateOnlineStatus: function() {
    var status = Ember.$("#status");
    var view = this.isView ? this : this.currentView;
    var isOnline = (view.get('currentUser') ? view.get('socketStatus') : true) && navigator.onLine;

    if(!isOnline) {
      status.removeClass("online").addClass("offline");
      Ember.$("#status span").text("Attempting to connect to app.goodcity.hk...");
    } else {
      var statusText = view.get('currentUser') ? (" - " + view.get("currentUser.fullName")) : "";
      Ember.$("#status span").text("Online" + statusText );
      status.removeClass("offline").addClass("online");
    }
  },

});
