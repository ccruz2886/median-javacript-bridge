import * as plugins from './plugins';
import { android, app, general, ios } from './commands';
import { AnyData, AddListenerType, ListenersType, CallbacksType, AddCallbackType } from './types';

class Median {
  // Utils
  #listeners: ListenersType = {};
  #callbacks: CallbacksType = {};

  #setGlobalListener = (functionName: AnyData, callbackFunctions: Record<string, (...data: AnyData) => void>) => {
    (window[functionName] as AnyData) = function (...args: AnyData) {
      Object.keys(callbackFunctions).forEach((key) => {
        const callbackFunction = callbackFunctions[key];
        if (typeof callbackFunction === 'function') {
          callbackFunction(...args);
        }
      });
    };
  };

  #addListener: AddListenerType = (callback, functionName) => {
    const functionId = `${functionName}_${Math.random().toString(36).slice(2)}`;

    if (typeof callback !== 'function') {
      return functionId;
    }

    this.#listeners[functionName] = this.#listeners[functionName] || {};
    const callbackFunctions = this.#listeners[functionName];
    callbackFunctions[functionId] = callback;

    this.#setGlobalListener(functionName, callbackFunctions);

    return functionId;
  };

  #removeListener = (functionName: string, functionId: string) => {
    if (!functionName || !functionId) {
      return;
    }

    this.#listeners[functionName] = this.#listeners[functionName] || {};
    const callbackFunctions = this.#listeners[functionName];
    delete callbackFunctions[functionId];

    this.#setGlobalListener(functionName, callbackFunctions);
  };

  #addCallback: AddCallbackType = (callback, functionName) => {
    if (typeof callback !== 'function') {
      return;
    }

    this.#callbacks[functionName] = this.#callbacks[functionName] || [];
    const callbackFunctions = this.#callbacks[functionName];
    callbackFunctions.push(callback);

    (window[functionName as AnyData] as AnyData) = function (...args: AnyData) {
      callbackFunctions.forEach((callbackFunction) => {
        if (typeof callbackFunction === 'function') {
          callbackFunction(...args);
        }
      });
    };
  };

  // iOS
  ios = ios;

  // Android
  android = android;

  // General
  clipboard = general.clipboard;
  config = general.config;
  connectivity = general.connectivity;
  deviceInfo = general.deviceInfo;
  internalExternal = general.internalExternal;
  keyboard = general.keyboard;
  nativebridge = general.nativebridge;
  navigationLevels = general.navigationLevels;
  navigationMaxWindows = general.navigationMaxWindows;
  navigationTitles = general.navigationTitles;
  open = general.open;
  registration = general.registration;
  run = general.run;
  screen = general.screen;
  share = general.share;
  sidebar = general.sidebar;
  statusbar = general.statusbar;
  tabNavigation = general.tabNavigation;
  webview = general.webview;
  window = general.window;

  // Plugins
  admob = plugins.admob;
  appreview = plugins.appreview;
  appsflyer = plugins.appsflyer;
  auth = plugins.auth;
  auth0 = plugins.auth0;
  autorefresh = plugins.autorefresh;
  backgroundLocation = plugins.backgroundLocation;
  backgroundMedia = plugins.backgroundMedia;
  barcode = plugins.barcode;
  beacon = plugins.beacon;
  braze = plugins.braze;
  card_io = plugins.card_io;
  contacts = plugins.contacts;
  cordial = plugins.cordial;
  documentScanner = plugins.documentScanner;
  downloads = plugins.downloads;
  esmiley = plugins.esmiley;
  facebook = plugins.facebook;
  firebaseAnalytics = plugins.firebaseAnalytics;
  haptics = plugins.haptics.haptics;
  iap = plugins.iap;
  intercom = plugins.intercom;
  kaltura = plugins.kaltura;
  localpreferences = plugins.localpreferences;
  modal = plugins.modal;
  moengage = plugins.moengage;
  moxo = plugins.moxo;
  onesignal = plugins.onesignal;
  opentok = plugins.opentok;
  permissions = plugins.permissions;
  plaid = plugins.plaid;
  purchase = plugins.iap.purchase;
  socialLogin = plugins.socialLogin;
  storage = {
    app: plugins.localpreferences.nonpersistent,
    cloud: plugins.localpreferences.persistent,
    filesystem: plugins.localpreferences.filesystem,
  };
  twilio = plugins.twilio;

  // Functions
  isNativeApp = () => {
    return !!window?.webkit?.messageHandlers?.JSBridge || !!window?.JSBridge;
  };

  // median_library_ready
  onReady = (callback: () => void) => {
    if (typeof callback === 'function') {
      let callbackFunction: (() => void) | null = callback;
      let counter = 0;

      const intervalFunction = setInterval(() => {
        if (this.isNativeApp() && callbackFunction) {
          callbackFunction();
          callbackFunction = null;
          return;
        }

        counter += 1;
        if (counter >= 20 || !callbackFunction) {
          clearInterval(intervalFunction);
          return;
        }
      }, 500);
    }
  };

  // median_app_resumed
  appResumed = app.appResumed(this.#addListener, this.#removeListener);

  // median_device_shake
  deviceShake = plugins.haptics.deviceShake(this.#addListener, this.#removeListener);

  // median_share_to_app
  shareToApp = plugins.share.shareToApp(this.#addCallback);
}

export default new Median();
