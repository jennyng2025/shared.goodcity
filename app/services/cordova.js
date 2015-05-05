import Ember from "ember";
import config from '../config/environment';
import AjaxPromise from '../utils/ajax-promise';

export default Ember.Service.extend({
  session: Ember.inject.service(),

  appLoad: function () {
    if (!config.cordova.enabled) {
      return;
    }

    var pushNotification, _this = this;

    function onDeviceReady() {
      document.addEventListener("backbutton", function (e) {
        if ($("#home").length > 0) {
          // call this to get a new token each time. don't call it to reuse existing token.
          //pushNotification.unregister(successHandler, errorHandler);
          e.preventDefault();
          navigator.app.exitApp();
        }
        else {
          navigator.app.backHistory();
        }
      }, false);

      pushNotification = window.plugins.pushNotification;
      if (device.platform == "android" || device.platform == "Android" || device.platform == "amazon-fireos") {
        pushNotification.register(
          successHandler,
          errorHandler,
          {
            "senderID": "266233825346",
            "ecb": onNotificationGCM
          }
        );
      }
//      } else if (device.platform === "iOS") {
//        pushNotification.register(
//          tokenHandler,
//          errorHandler,
//          {
//            "badge": "true",
//            "sound": "true",
//            "alert": "true",
//            "ecb": onNotificationAPN
//          }
//        );
//      } else if (device.platform === "Win32NT") {
//        pushNotification.register(
//          channelHandler,
//          errorHandler,
//          {
//            "channelName": channelName,
//            "ecb": "onNotificationWP8",
//            "uccb": "channelHandler",
//            "errcb": "jsonErrorHandler"
//          }
//        );
//      }
    }

    // handle APNS notifications for iOS
//    function onNotificationAPN(e) {
//      if (e.alert) {
//        $("#app-status-ul").append('<li>push-notification: ' + e.alert + '</li>');
//        // showing an alert also requires the org.apache.cordova.dialogs plugin
//        navigator.notification.alert(e.alert);
//      }
//
//      if (e.sound) {
//        // playing a sound also requires the org.apache.cordova.media plugin
//        var snd = new Media(e.sound);
//        snd.play();
//      }
//
//      if (e.badge) {
//        pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
//      }
//    }

    // handle GCM notifications for Android
    function onNotificationGCM(e) {
      switch (e.event) {
        case 'registered':
          if (e.regid.length > 0) {
            new AjaxPromise("/auth/register_device", "POST", _this.get("session.authToken"), {handle: e.regid, platform: "gcm"});
          }
          break;

        case 'message':
          // if this flag is set, this notification happened while we were in the foreground.
          // you might want to play a sound to get the user's attention, throw up a dialog, etc.
          if (e.foreground) {
            $("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');

            // on Android soundname is outside the payload.
            // On Amazon FireOS all custom attributes are contained within payload
            var soundfile = e.soundname || e.payload.sound;
            // if the notification contains a soundname, play it.
            // playing a sound also requires the org.apache.cordova.media plugin
            var my_media = new Media("/android_asset/www/" + soundfile);

            my_media.play();
          }
          else {  // otherwise we were launched because the user touched a notification in the notification tray.
            if (e.coldstart)
              $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
            else
              $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
          }

          $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
          //android only
          $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
          //amazon-fireos only
          $("#app-status-ul").append('<li>MESSAGE -> TIMESTAMP: ' + e.payload.timeStamp + '</li>');
          break;

        case 'error':
          window.alert(e.msg);
          break;

        default:
          window.alert("unknown event");
          break;
      }
    }

//    function tokenHandler(result) {
//      $("#app-status-ul").append('<li>token: ' + result + '</li>');
//      // Your iOS push server needs to know the token before it can push to this device
//      // here is where you might want to send it the token for later use.
//    }

    function successHandler(result) {
      window.alert(result);
    }

    function errorHandler(error) {
      window.alert(error);
    }

    document.addEventListener('deviceready', onDeviceReady, true);
  }
});
