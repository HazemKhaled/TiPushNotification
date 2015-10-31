if (Ti.Platform.name === 'android') {
  // set android-only options
  var pnOptions = {
    senderId: 'XXXXXXXX', // It's the same as your project id
    notificationSettings: {
      sound: 'mysound.mp3', // Place soudn file in platform/android/res/raw/mysound.mp3
      smallIcon: 'appicon.png', // Place icon in platform/android/res/drawable/notification_icon.png
      largeIcon: 'appicon.png', // Same
      vibrate: true, // Whether the phone should vibrate
      insistent: true, // Whether the notification should be insistent
      group: 'News', // Name of group to group similar notifications together
      localOnly: false, // Whether this notification should be bridged to other devices
      priority: 2 // Notification priority, from -2 to 2
    }
  };

} else if (Ti.Platform.name === 'iPhone OS') { // set ios-only options.
  // Sets interactive notifications as well if iOS8 and above. Interactive notifications is optional.
  if (parseInt(Ti.Platform.version.split(".")[0], 10) >= 8) {
    var thumbUpAction = Ti.App.iOS.createUserNotificationAction({
      identifier: "THUMBUP_IDENTIFIER",
      title: "Agree",
      activationMode: Ti.App.iOS.USER_NOTIFICATION_ACTIVATION_MODE_BACKGROUND,
      destructive: false,
      authenticationRequired: false
    });

    var thumbDownAction = Ti.App.iOS.createUserNotificationAction({
      identifier: "THUMBDOWN_IDENTIFIER",
      title: "Disagree",
      activationMode: Ti.App.iOS.USER_NOTIFICATION_ACTIVATION_MODE_BACKGROUND,
      destructive: false,
      authenticationRequired: false
    });

    var thumbUpDownCategory = Ti.App.iOS.createUserNotificationCategory({
      identifier: "THUMBUPDOWN_CATEGORY",
      // The following actions will be displayed for an alert dialog
      actionsForDefaultContext: [thumbUpAction, thumbDownAction],
      // The following actions will be displayed for all other notifications
      actionsForMinimalContext: [thumbUpAction, thumbDownAction]
    });

    var pnOptions = {
      types: [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT, Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND],
      categories: [thumbUpDownCategory]
    };
  } else { //No support for interactive notifications, omit categories
    var pnOptions = {
      types: [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT, Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND]
    };
  }
}

// set cross-platform event
var onReceive = function(event) {
  // Your code here
};

// Create instance with base url
var tiPush = require('ti-push-notification').init({
  backendUrl: "http://domain.tld/register.php"
});

// register this device
tiPush.registerDevice({
  pnOptions: pnOptions,
  onReceive: onReceive
});
