import Ember from "ember";
import config from "../config/environment";
const { getOwner } = Ember;

function run(func) {
  if (func) {
    func();
  }
}

export default Ember.Controller.extend({

  notifications: Ember.inject.controller(),
  socket: null,
  lastOnline: Date.now(),
  deviceTtl: 0,
  deviceId: Math.random().toString().substring(2),
  logger: Ember.inject.service(),
  i18n: Ember.inject.service(),
  messagesUtil: Ember.inject.service("messages"),
  status: {
    online: false,
    hidden: true,
    text: ""
  },

  updateStatus: Ember.observer('socket', function () {
    var socket = this.get("socket");
    var online = navigator.connection ? navigator.connection.type !== "none" : navigator.onLine;
    online = socket && socket.connected && online;
    var hidden = !this.session.get("isLoggedIn") || (online && config.environment === "production" && config.staging !== true);
    var text = !online ? this.get("i18n").t("socket_offline_error") :
      "Online - " + this.session.get("currentUser.fullName") + " (" + socket.io.engine.transport.name + ")";
    this.set("status", {"online": online, "hidden": hidden, "text": text});

    if(!this.session.get("currentUser.fullName") && online) {
      var currentUrl = getOwner(this).lookup("router:main").get("url");
      if (currentUrl == "/offline") {
        this.transitionTo("/");
      } else {
        window.location.reload();
      }
    }
  }),

  // resync if offline longer than deviceTtl
  checkdeviceTtl: Ember.observer('online', function () {
    var online = this.get("online");
    var deviceTtl = this.get("deviceTtl");
    if (online && deviceTtl !== 0 && (Date.now() - this.get("lastOnline")) > deviceTtl * 1000) {
      this.resync();
    } else if (!online) {
      this.set("lastOnline", Date.now());
    }
  }),

  initController: Ember.on('init', function() {
    this.set("status.text", this.get("i18n").t("offline_error"));
    var updateStatus = Ember.run.bind(this, this.updateStatus);
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
  }),

  actions: {
    wire() {
      var updateStatus = Ember.run.bind(this, this.updateStatus);
      var connectUrl = config.APP.SOCKETIO_WEBSERVICE_URL +
        "?token=" + encodeURIComponent(this.session.get("authToken")) +
        "&deviceId=" + this.get("deviceId") +
        "&meta=appName:" + config.APP.NAME;
        // pass mutilple meta values by seperating '|' like this
        // "&meta=appName:" + config.APP.NAME +"|version:" + config.APP.NAME;

      var socket = io(connectUrl, {autoConnect:false,forceNew:true});
      this.set("socket", socket);
      socket.on("connect", function() {
        updateStatus();
        socket.io.engine.on("upgrade", updateStatus);
      });
      socket.on("disconnect", updateStatus);
      socket.on("error", Ember.run.bind(this, function(reason) {
        // ignore xhr post error related to no internet connection
        if (typeof reason !== "object" || reason.type !== "TransportError" && reason.message !== "xhr post error") {
          this.get("logger").error(reason);
        }
      }));
      socket.on("notification", Ember.run.bind(this, this.notification));
      socket.on("update_store", Ember.run.bind(this, this.update_store));
      socket.on("_batch", Ember.run.bind(this, this.batch));
      socket.on("_resync", Ember.run.bind(this, this.resync));
      socket.on("_settings", Ember.run.bind(this, function(settings) {
        this.set("deviceTtl", settings.device_ttl);
        this.set("lastOnline", Date.now());
      }));
      socket.connect(); // manually connect since it's not auto-connecting if you logout and then back in
    },

    unwire() {
      var socket = this.get("socket");
      if (socket) {
        socket.close();
        this.set("socket", null);
      }
    },

    unloadNotifications() {
      this.get("notifications").send("unloadNotifications")
    }
  },

  batch: function(events, success) {
    events.forEach(function(args) {
      var event = args[0];
      this[event].apply(this, args.slice(1));
    }, this);

    run(success);
  },

  resync: function() {
    window.location.reload();
  },

  notification: function(data, success) {
    data.date = new Date(data.date);
    this.get("notifications.model").pushObject(data);
    run(success);
  },

  // each action below is an event in a channel
  update_store: function(data, success) {
    this.store.pushPayload(data.sender);

    var type = Object.keys(data.item)[0];
    // use extend to make a copy of data.item[type] so object is not normalized for use by
    // messagesUtil in mark message read code below
    var item = Ember.$.extend({}, data.item[type]);
    this.store.normalize(type, item);

    var existingItem = this.store.peekRecord(type, item.id);

    // update_store message is sent before response to APP save so ignore
    var fromCurrentUser = parseInt(data.sender.user.id) === parseInt(this.session.get("currentUser.id"));
    var hasNewItemSaving = this.store.peekAll(type).any(function(o) { return o.id === null && o.get("isSaving"); });
    var existingItemIsSaving = existingItem && existingItem.get("isSaving"); // isSaving is true during delete as well
    if (fromCurrentUser && (data.operation === "create" && hasNewItemSaving || existingItemIsSaving)) {
      run(success);
      return;
    }

    if (data.operation === "update" && !existingItem) {
      this.store.findRecord(type, item.id);
    } else if (["create","update"].contains(data.operation)) {
        var payload = {};
        payload[type] = item;
        this.store.pushPayload(payload);
    } else if (existingItem) { //delete
      this.store.unloadRecord(existingItem);
    }

    run(success);

    // mark message as read if message will appear in current view
    if (type === "message") {
      var router = this.get("target");
      var currentUrl = window.location.href.split("#").get("lastObject");

      var messageRoute = this.get("messagesUtil").getRoute(data.item[type]);
      var messageUrl = router.generate.apply(router, messageRoute);
      var messageUrl = messageUrl.split("#").get("lastObject");

      if (currentUrl.indexOf(messageUrl) >= 0) {
        var message = this.store.peekRecord("message", item.id);
        if(message && !message.get("isRead")) {
          this.get("messagesUtil").markRead(message);

          var scrollOffset;
          if(Ember.$(".message-textbar").length > 0) {
            scrollOffset = Ember.$(document).height();
          }

          var screenHeight = document.documentElement.clientHeight;
          var pageHeight = document.documentElement.scrollHeight;

          if(scrollOffset && pageHeight > screenHeight) {
            Ember.run.later(this, function() {
              window.scrollTo(0, scrollOffset);
            });
          }

        }
      }
    }
  }
});
