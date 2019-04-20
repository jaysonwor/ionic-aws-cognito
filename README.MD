## Intro
Opinionated RBAC example using ionic aws cognito

### Scaffolding
* ionic g module auth --routing
* ionic g page auth/login
* ionic g page auth/register
* ionic g page auth/confirm

### Run Android
* pre-requisites
  * Android SDK
  * JDK 1.8
* ionic cordova build android
* ionic cordova platform list -> shows android installed

### Troubleshoot Android
* remove bad cordova packages
* uninstall @7.0.0 
  * ionic cordova platform rm android
* ionic cordova platform add android@6.4.0 --> npm install cordova-android@6.2.3 --save-exact
* ionic cordova prepare
* ionic cordova run android
* export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk/jdk1.8.0_201.jdk/Home/Contents

#### New Steps
* cordova platform rm android
* cordova platform add https://github.com/apache/cordova-android
* cordova build
* ionic cordova build android --prod --release

##### Important Tip
config.xml -> change name of widget id: io.sandbox.cognito
https://github.com/hughred22/YouTube-Video-Listing-Ionic-Mobile-App/wiki/Preparing-for-Release-and-Publishing-Your-Ionic-App


### Avatar
ionic cordova plugin add cordova-plugin-telerik-imagepicker -> don't use
ionic cordova plugin add https://github.com/abelabbesnabi/cordova-plugin-image-picker
https://ionicthemes.com/tutorials/about/ionic-2-image-handling
https://www.djamware.com/post/5ae9c9ca80aca714d19d5b9f/ionic-3-angular-5-and-cordova-base64-image-upload-example

### Crashing Android
If you run into problems like Android crashing try this:
First I cleaned my project
### rm -rf
rimraf .sourcemaps node_modules platforms plugins www
Then installed packages
npm i
Then deploy the app again
ionic cordova run android --device

###### debug
https://medium.com/@coderonfleek/debugging-an-ionic-android-app-using-chrome-dev-tools-6e139b79e8d2