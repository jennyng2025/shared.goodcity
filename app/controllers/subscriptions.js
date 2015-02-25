import Ember from "ember";
import config from "../config/environment";
import messagesUtil from "../utils/messages";

function run(func) {
  if (func) {
    func();
  }
}

export default Ember.Controller.extend({
  needs: ["notifications", "application"],
  socket: null,
  lastOnline: Date.now(),
  deviceTtl: 0,
  online: true,
  deviceId: Math.random().toString().substring(2),

  updateStatus: function() {
    var socket = this.get("socket");
    var online = socket && socket.connected && navigator.onLine;
    var status = online ? "Online" : "Offline";
    status += " - " + this.session.get("currentUser.fullName");
    if (socket && socket.io.engine) {
      status += " (" + socket.io.engine.transport.name + ")";
    }
    Ember.$("#ws-status").text(status);
    this.set("online", online);
  }.observes("socket"),

  // resync if offline longer than deviceTtl
  checkdeviceTtl: function() {
    var online = this.get("online");
    var deviceTtl = this.get("deviceTtl");
    if (online && deviceTtl !== 0 && (Date.now() - this.get("lastOnline")) > deviceTtl * 1000) {
      this.resync();
    } else if (!online) {
      this.set("lastOnline", Date.now());
    }
  }.observes("online"),

  initController: function() {
    var updateStatus = Ember.run.bind(this, this.updateStatus);
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
  }.on("init"),

  actions: {
    wire: function() {
      var updateStatus = Ember.run.bind(this, this.updateStatus);
      var connectUrl = config.APP.SOCKETIO_WEBSERVICE_URL +
        "?token=" + encodeURIComponent(this.session.get("authToken")) +
        "&deviceId=" + this.get("deviceId");
      var socket = io(connectUrl, {autoConnect:false,forceNew:true});
      this.set("socket", socket);
      socket.on("connect", function() {
        updateStatus();
        socket.io.engine.on("upgrade", updateStatus);
      });
      socket.on("disconnect", updateStatus);
      socket.on("error", Ember.run.bind(this, function(data) { throw new Error("websocket: " + data); }));
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

    unwire: function() {
      var socket = this.get("socket");
      if (socket) {
        socket.close();
        this.set("socket", null);
      }
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
    window.location = window.location.href;
  },

  notification: function(data, success) {
    data.date = new Date(data.date);
    this.get("controllers.notifications").pushObject(data);
    run(success);
  },

  // each action below is an event in a channel
  update_store: function(data, success) {
    this.store.pushPayload(data.sender);

    var type = Object.keys(data.item)[0];
    var item = this.store.normalize(type, data.item[type]);

    if (type === "address") {
      item.addressable = item.addressable_id;
      delete item.addressable_id;
    }

    var existingItem = this.store.getById(type, item.id);

    // update_store message is sent before response to APP save so ignore
    var fromCurrentUser = parseInt(data.sender.user.id) === parseInt(this.session.get("currentUser.id"));
    var hasNewItemSaving = this.store.all(type).some(function(o) { return o.id === null && o.get("isSaving"); });
    var existingItemIsSaving = existingItem && existingItem.get("isSaving"); // isSaving is true during delete as well
    if (fromCurrentUser && (data.operation === "create" && hasNewItemSaving || existingItemIsSaving)) {
      run(success);
      return;
    }

    if (data.operation === "update" && !existingItem) {
      this.store.find(type, item.id);
    } else if (["create","update"].contains(data.operation)) {
        this.store.push(type, item);
    } else if (existingItem) { //delete
      this.store.unloadRecord(existingItem);
    }

    run(success);

    // mark message as read if message will appear in current view
    if (type === "message") {
      var router = this.get("target");
      var currentUrl = router.get("url");
      var messageRoute = messagesUtil.getRoute(this.container, data.item[type]);
      var messageUrl = router.generate.apply(router, messageRoute);

      if (currentUrl === messageUrl) {
        var message = this.store.getById("message", item.id);
        messagesUtil.markRead(this.container, message);
      }
    }
  }
});
