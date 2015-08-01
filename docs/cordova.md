## Cordova

### Setup
* `npm install -g cordova` (note 5.1.1 has problems installing plugins from git url on windows use 5.0.0 instead)
* `ember cordova:prepare` (mainly needed to create symlink between dist <=> cordova/www)
* `cd cordova`
* `cordova prepare android` (or ios/windows)


### Android
* Install stand alone SDK tools - https://developer.android.com/sdk/installing/index.html
* set environment variables<br/>
  `export ANDROID_HOME=/<installation location>/android-sdk`<br/>
  `export PATH=${PATH}:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools`
* start SDK manager from terminal `android`
  - install "Android 5.1.1 (API 22)/SDK Platform"
  - install "Tools/Android SDK Build-tools" (latest version)
  - install "Tools/Android SDK Platform-tools" (latest version)
* `sudo apt-get install ant`

**Android Emulator setup (not needed if using a real phone)**
* start SDK manager from terminal `android`
  - install "Android 5.1.1 (API 22)/Google APIs Intel x86 Atom System Image"
* open from menu "Tools > Manage AVDs > Create"
* fill out create new AVD and click ok


### Windows Phone
* Install Visual Studio - https://www.visualstudio.com/
* During install under optional features tick "Apache Cordova" (or look to install Visual Studio Tools for Apache Cordova)
* Register your phone by using the "Windows Phone Developer Registration Tool"


### iOS
* Install Xcode - https://developer.apple.com/xcode/downloads/
* Ask to be signed up as a developer of the Crossroads Apple Developer Team
* In XCode download the certs via "Settings > Accounts > View Details > Refresh"
* Register your phone under https://developer.apple.com/account/ios/device/deviceList.action
* `npm install -g ios-deploy`


### Running in an Emulator
To start app in emulator

`ember cordova emulate android`

To deploy to connected device

```bash
ember cordova run windows -- --phone --device (WP8.1)
ember cordova run android --device
ember cordova run ios --device
```


### Debugging

To deploy to Android you need to have USB debugging enabled, to do so:

* enable `settings > developer options > android debugging`

If developer options is missing:

* go to `settings > about phone`
* tap `build number` seven times

For Android you can use Chrome for remote debugging of the app on your phone:
https://developer.chrome.com/devtools/docs/remote-debugging

For iOS you can use Safari and under develop menu to remotely debug app on iPhone.

For Windows Phone you can use Visual Studio to deploy app and debug by opening `platforms/windows/CordovaApp.Phone.jsproj`.

Note if you are using an IDE (e.g. XCode/VisualStudio/AndroidStudio) then after running `ember build` to make code changes, you'll need to run `cordova build <platform>` before deploying so that `cordova/www` is copied to `cordova/platforms/<platform>/www`.



### Building the App
#### Release Build

`ember cordova:build --environment=production --platform=<android|wp8|ios|windows>`

#### Debug Build
```sh
cd cordova
ember build --environment=production
cordova build android --debug
```

For Android release build it needs to be manually signed (key not in repo):
http://developer.android.com/tools/publishing/app-signing.html#signing-manually



### Other Commands
`ember cordova <arguments>`
http://cordova.apache.org/docs/en/4.0.0/guide_cli_index.md.html
