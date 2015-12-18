"use strict";

import React from "react-native";
let { DeviceEventEmitter, Platform, AppRegistry } = require("react-native");
import CodePush from "react-native-code-push";
let NativeCodePush = React.NativeModules.CodePush;
import createTestCaseComponent from "../../utils/createTestCaseComponent";
let PackageMixins = require("react-native-code-push/package-mixins.js")(NativeCodePush);
import assert from "assert";

let remotePackage = {
  description: "Angry flappy birds",
  appVersion: "1.5.0",
  label: "2.4.0",
  isMandatory: false,
  isAvailable: true,
  updateAppVersion: false,
  packageHash: "hash240",
  packageSize: 1024
};

let InstallModeOnNextResumeTest = createTestCaseComponent(
  "InstallModeOnNextResumeTest",
  "App should boot up the new version after it is installed and resumed",
  () => {
    if (Platform.OS === "android") {
      remotePackage.downloadUrl = "http://10.0.3.2:8081/CodePushDemoAppTests/InstallUpdateTests/resources/PassInstallModeOnNextResumeTest.includeRequire.runModule.bundle?platform=android&dev=true"
    } else if (Platform.OS === "ios") {
      remotePackage.downloadUrl = "http://localhost:8081/CodePushDemoAppTests/InstallUpdateTests/resources/PassInstallModeOnNextResumeTest.includeRequire.runModule.bundle?platform=ios&dev=true"
    }
    
    remotePackage = Object.assign(remotePackage, PackageMixins.remote);
    return Promise.resolve();
  },
  () => {
    remotePackage.download()
      .then((localPackage) => {
        return localPackage.install(NativeCodePush.codePushInstallModeOnNextResume);
      })
      .then(() => {
        CodePush.restartApp();
      });
  },
  /*passAfterRun*/ false
);

AppRegistry.registerComponent("InstallModeOnNextResumeTest", () => InstallModeOnNextResumeTest);