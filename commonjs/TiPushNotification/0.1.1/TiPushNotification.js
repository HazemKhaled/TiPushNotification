/**
 * Yes you can use it with your self-hosted server or any other cloud services
 * like Parse.com or Appcelerator cloud.
 *
 * @auther Hazem Khaled <hazem.khaled@gmail.com>
 */

var ANDROID = Ti.Platform.name === 'android',
  IOS = !ANDROID && (Ti.Platform.name === 'iPhone OS');

if (ANDROID) {
  var GCM = require("nl.vanvianen.android.gcm");
}

function TiPush(e) {
  this.backendUrl = e.backendUrl;
  this.token = '';
}

TiPush.prototype.registerDevice = function(_prams) {
  var that = this,
    token = '',
    onReceive = _prams.onReceive,
    onStart = _prams.onStart || _prams.onReceive,
    onResume = _prams.onResume || _prams.onReceive,
    pnOptions = _prams.pnOptions;

  function deviceTokenSuccess(e) {
    if (ANDROID) {
      Ti.API.debug('[TiPush] Device Token: ' + e.registrationId);
      token = e.registrationId;
    } else if (IOS) {
      Ti.API.debug('[TiPush] Device Token: ' + e.deviceToken);
      token = e.deviceToken;
    }
    that.token = token;

    var xhr = Ti.Network.createHTTPClient({
      onload: function() {
        Ti.API.debug("[TiPush] Token sent to our backend");
      },
      onerror: function() {
        Ti.API.error("[TiPush] Can't send tokend to our backend");
      }
    });
    xhr.open("POST", that.backendUrl);
    xhr.send({
      token: token,
      // Make sure os Capital letters
      os: Ti.Platform.osname === 'android' ? 'Android' : 'iOS'
    });
  }

  function deviceTokenError(e) {
    Ti.API.error('[TiPush] Token Error: ' + e.error);
  }

  function receivePush(e) {
    Ti.API.debug("[TiPush] onReceive Push callback = " + JSON.stringify(event));

    if (IOS) {
      // Reset badge
      Titanium.UI.iPhone.appBadge = null;
    }

    onReceive(e.data);
    Ti.API.debug("[TiPush] Push notification received: Module " + JSON.stringify(e.data));
  }

  if (ANDROID) {

    GCM.registerPush({
      senderId: pnOptions.senderId,
      notificationSettings: pnOptions.notificationSettings,
      success: deviceTokenSuccess,
      error: deviceTokenError,
      callback: receivePush
    });

    /* When the app is started */
    var lastData = GCM.getLastData();
    if (lastData) {
      onStart({
        data: lastData
      });
      GCM.clearLastData();
    }

    /* And when the app is resumed */
    Ti.Android.currentActivity.addEventListener("resume", function() {
      var lastData = GCM.getLastData();
      if (lastData) {
        onResume({
          data: lastData
        });
        GCM.clearLastData();
      }
    });

  } else if (IOS) {
    // Check if the device is running iOS 8 or later
    if (parseInt(Ti.Platform.version.split(".")[0], 10) >= 8) {
      function registerForPush() {
        Ti.Network.registerForPushNotifications({
          success: deviceTokenSuccess,
          error: deviceTokenError,
          callback: receivePush
        });
        // Remove event listener once registered for push notifications
        Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush);
      }

      // Wait for user settings to be registered before registering for push notifications
      Ti.App.iOS.addEventListener('usernotificationsettings', registerForPush);

      // Register notification types to use
      Ti.App.iOS.registerUserNotificationSettings({
        types: pnOptions.types,
        categories: pnOptions.categories
      });

    } else {
      // For iOS 7 and earlier
      Ti.Network.registerForPushNotifications({
        // Specifies which notifications to receive
        types: pnOptions.types,
        success: deviceTokenSuccess,
        error: deviceTokenError,
        callback: receivePush
      });
    }

  } else {
    Ti.API.warn("[TiPush] Push notification not implemented yet into acspushmod for " + Ti.Platform.osname);
  }
};

TiPush.prototype.getToken = function() {
  return this.token;
};

exports.TiPush = TiPush;
