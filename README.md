# TiPushNotification
Yes you can use it with your self-hosted server or any other cloud services like Parse.com or Appcelerator cloud.

## Get it [![gitTio](http://gitt.io/badge.svg)](http://gitt.io/component/dk.napp.drawer)
Download the latest distribution ZIP-file and consult the [Titanium Documentation](http://docs.appcelerator.com/titanium/latest/#!/guide/Using_a_Module) on how install it, or simply use the [gitTio CLI](http://gitt.io/cli):

`$ gittio install TiPushNotification`

## Prepare
Titanium has APIs for iOS push notifications, but unfortunately you need module to for Android.

1- Install GCM module by [Jeroen van Vianen](https://github.com/morinel/nl.vanvianen.android.gcm)

`$ gittio install nl.vanvianen.android.gcm`

2- Install this CommonJS module

`$ gittio install TiPushNotification`

3- Add this code into your app.js or alloy.js

```javascript
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
}

// load library
var TiPushFactory = require('TiPushNotification');

// create instance with your own or the user's username and password
var tiPush = new TiPushFactory.TiPush({
  backendUrl: "http://domain.tld/register.php"
});

// register this device
tiPush.registerDevice({
  pnOptions: pnOptions,
  onReceive: onReceive
});
```

4- Configure your server with GCM and APN

### Contributions
Your issues and pull requests are most welcome.

### Credits
This module is based on [ACS Push Notifications](https://github.com/ricardoalcocer/acspushmod) CommonJS module by my Ricardo Alcocer.
