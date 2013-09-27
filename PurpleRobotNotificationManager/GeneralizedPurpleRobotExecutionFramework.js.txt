// ***** GENERALIZED IN-PURPLE-ROBOT JAVASCRIPT EXECUTION FRAMEWORK *****
// Author: evan.story@northwestern.edu
// Created: 20130926


/**
 * Detects the current execution context: 
 *  0 = Purple Robot
 *  1 = Node.js
 *  2 = Browser.
 * Src: http://stackoverflow.com/questions/4224606/how-to-check-whether-a-script-is-running-under-node-js
 * @return {[type]} [description]
 */
var currentExecutionContext = (function () {

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this; 

  // Create a refeence to this
  var _ = new Object();

  var isNode = false;

  if (this['PurpleRobot'] != null) {
    return 0;
  }
  // Export the Underscore object for **CommonJS**, with backwards-compatibility
  // for the old `require()` API. If we're not in CommonJS, add `_` to the
  // global object.
  else if (typeof module !== 'undefined' && module.exports) {
      // module.exports = _;
      // root._ = _;
      // isNode = true;
    return 1;
  } else {
      // root._ = _;
    return 2;
  }
})();


// PR-specific code: We need these things at the top-level context, so that all sub-contexts can rely-upon their existence.
// Defining them here means we define them without external configuration knowledge.
switch(currentExecutionContext) {
  // Purple Robot
  case 0:
    PurpleRobot.log('*** PurpleRobotNotificationManager execution context: Purple Robot ***');
    PurpleRobot.loadLibrary('underscore.js');
    PurpleRobot.loadLibrary('date.js');
    break;
  // Node.js
  case 1:
    console.warn('*** PurpleRobotNotificationManager execution context: Node.js ***');
    _ = require('underscore');
    require('./date.js');
    break;
  // browser
  case 2:
    console.warn('*** PurpleRobotNotificationManager execution context: Browser (reference JS libs from <script> tags) ***');
    break;
}


/**
 * Returns the string representing an ICal-formatted Date string. EX: "20130101T123400" (as seen on: http://tech.cbits.northwestern.edu/purple-robot-javascript-api/)
 * @return {[type]} [description]
 */
Date.prototype.toICal = function() { var fn = 'Date.prototype.toICal';
  var  yy = this.getFullYear()
      ,MM = this.clone().addMonths(1).getMonth()
      ,dd = this.getDate()
      ,hh = this.getHours()
      ,mm = this.getMinutes()
      ,ss = this.getSeconds();

  var ret = ''
    + yy.toString()
    + ((MM < 10) ? '0' + MM : MM.toString())
    + ((dd < 10) ? '0' + dd : dd.toString())
    + 'T'
    + ((hh < 10) ? '0' + hh : hh.toString())
    + ((mm < 10) ? '0' + mm : mm.toString())
    + ((ss < 10) ? '0' + ss : ss.toString())
    ;
  return ret;
};



// Following Caolan's pattern for Node.js/Browser cross-compatibility: http://caolanmcmahon.com/posts/writing_for_node_and_the_browser/
var PRNM = (function(exports) {

    exports.test = function() {
      return 'hello world from exports';
    };


    // ctor
    // var ctor = function(d) {
    var ctor = function(d) { var fn = 'prnm:ctor';

      ctor.prototype.data = d;
      self = this;

      // this sets-up a function-reusability layer across Node.js, Purple Robot, and web browsers.
      ctor.prototype.setFunctionsAndLibraryRefsForEnv(d.env);

      // set the self.appCfg instance variable
      self.getAppCfg();

      ctor.prototype.debug('current date using date.js: ' + Date.today(),fn);

      ctor.prototype.log('exiting...', fn);
      return ctor.prototype;
    };


    // *Actually* define the object whose members will be referenced...
    ctor.prototype = {

      // ==================================
      // ========= CONSTS =================
      // ==================================

      // IF YOU WANT TO FIND SPECIFIC TRIGGERS IN THE TRIGGER LIST, YOU CAN LIST THEM HERE.
      triggerIdPrefixes: {
        // "self": "Purple Robot Notification Manager",
        "self": "unidentified-trigger",
        "medPrompt": "MedPrompt: ",
        "ema": "EMA: "
      },


      // ===============================================
      // ========= ENVIRONMENTAL SETUP =================
      // ===============================================

    // libs
    _: null,
    TimePeriod: null,

    // FNGROUP: internal references
    self: null,
    data: null,

      // FNGROUP: env-dependent functions to abstract
      debug: null,
      log: null,
      warn: null,
      error: null,

      playDefaultTone: null,
      persistEncryptedString: null,
      fetchEncryptedString: null,
      persistString: null,
      fetchString: null,
      scheduleScript: null,
      showNativeDialog: null,
      updateWidget: null,
      updateTrigger: null,
      fetchTriggerIds: null,
      fetchTrigger: null,
      deleteTrigger: null,
      launchUrl: null,
      launchApplication: null,
      loadLibrary: null,

      // FNGROUP: biz-logic
      getUserCfg: null,
      getAppCfg: null,
      actions: null,

      // env-specific consts passed-in from the client app
      envConsts: null,
      userCfg: null,
      appCfg: null,
      execCtx: null,


      /**
       * Sets the functions to use given an environment parameter.
       * Enables execution of same-named functions in different environments, which may in-turn carry the semantic of having a different purpose.
       * @param {[type]} env [description]
       */
      setFunctionsAndLibraryRefsForEnv: function(env) { var fn = 'setFunctionsAndLibraryRefsForEnv'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        self.envConsts = env;

        // jump to the appropriate block for the execution context of this script
        switch(self.execCtx) {


          // *** Purple Robot ***
          case 0:
            
            // * set function ptrs *
            // PR fns
            self.debug = function(s, fn) { if(self.appCfg.logLevel >= 4) { PurpleRobot.log('[DBG]' + (!(fn == null || fn == undefined || fn == 'null') ? '[' + fn + '] ' : ' ') + s); } };
            self.log = function(s, fn) { if(self.appCfg.logLevel >= 3) { PurpleRobot.log('[INF]' + (!self.isNullOrUndefined(fn) ? '[' + fn + '] ' : ' ') + s); } };
            self.warn = function(s, fn) { if(self.appCfg.logLevel >= 2) { PurpleRobot.log('[WRN]' + (!self.isNullOrUndefined(fn) ? '[' + fn + '] ' : ' ') + s); } };
            self.error = function(s, fn) { if(self.appCfg.logLevel >= 1) { PurpleRobot.log('[ERR]' + (!self.isNullOrUndefined(fn) ? '[' + fn + '] ' : ' ') + s); } };
            self.playDefaultTone = function() { PurpleRobot.playDefaultTone(); };
            self.persistEncryptedString = function(namespace, key, value) { return PurpleRobot.persistEncryptedString(namespace,key,value); };
            self.fetchEncryptedString = function(namespace, key) { return PurpleRobot.fetchEncryptedString(namespace,key); };
            self.persistString = function(namespace, key, value) { return PurpleRobot.persistString(namespace,key,value); };
            self.fetchString = function(namespace, key) { return PurpleRobot.fetchString(namespace,key); };
            self.scheduleScript = function(id, date, action) { return PurpleRobot.scheduleScript(id, date, action); };
            self.showNativeDialog = function(title, msg, confirmTitle, cancelTitle, confirmScript, cancelScript) { return PurpleRobot.showNativeDialog(title, msg, confirmTitle, cancelTitle, confirmScript, cancelScript); };
            self.updatePurpleRobotConfiguration = function(jsonPrConfig) { var fn = "updatePurpleRobotConfiguration"; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
              self.debug('entered',fn);
              if(!self.isNullOrUndefined(jsonPrConfig)) {
                self.debug('Updating PR config using jsonPrConfig = ' + JSON.stringify(jsonPrConfig), fn);
                PurpleRobot.updateConfig(jsonPrConfig);
              }
              else { self.warn('Purple Robot configuration not updated; jsonPrConfig was null or undefined.', fn); }
              self.debug('exiting',fn);
            },
            self.updateWidget = function(params) { return PurpleRobot.updateWidget(params); };
            self.updateTrigger = function(triggerId, triggerObj) { return PurpleRobot.updateTrigger(triggerId, triggerObj) };
            self.fetchTriggerIds = function() { return PurpleRobot.fetchTriggerIds(); };
            self.fetchTrigger = function(triggerId) { return PurpleRobot.fetchTrigger(triggerId); };
            self.deleteTrigger = function(triggerId) { return PurpleRobot.deleteTrigger(triggerId); };
            self.launchUrl = function(url) { return PurpleRobot.launchUrl(url); };
            self.launchApplication = function(applicationFullName) { return PurpleRobot.launchApplication(applicationFullName); };
            self.loadLibrary = function(nameOrPath, keyOfLibInstanceToReturn) { var fn='loadLibrary'; 
              self.debug('nameOrPath = ' + nameOrPath + '; keyOfLibInstanceToReturn = ' + keyOfLibInstanceToReturn,fn);
              PurpleRobot.loadLibrary(nameOrPath); 
              if(keyOfLibInstanceToReturn != null) {
                self.debug('this[keyOfLibInstanceToReturn] = ' + this[keyOfLibInstanceToReturn], fn);
                return this[keyOfLibInstanceToReturn];
              }
            };
            self.vibrate = function(vibratePatternStr) { PurpleRobot.vibrate(vibratePatternStr); };

            // support fns
            /**
             * PR-case: assign the namespace and key values to the userCfgFetchParamsObj.namespace and userCfgFetchParamsObj.key values, respectively, and pass the userCfgFetchParamsObj to this function.
             * @param  {[type]} userCfgFetchParamsObj)    {            return self.fetchEncryptedString(userCfgFetchParamsObj.namespace [description]
             * @param  {[type]} userCfgFetchParamsObj.key [description]
             * @return {[type]}                           [description]
             */
            self.getUserCfg = function() { var fn = 'getUserCfg'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; } 
              self.debug('entered',fn);
              if(self.userCfg==null) { 
                self.debug('fetching userCfg on first call...', fn);
                self.userCfg = JSON.parse(self.fetchEncryptedString(self.envConsts.userCfg.namespace, self.envConsts.userCfg.key)); 
                self.debug('userCfg = ' + JSON.stringify(self.userCfg), fn);
              }
              self.debug('exiting',fn);
              return self.userCfg;
            };
            /**
             * PR-case: assign the namespace and key values to the userCfgFetchParamsObj.namespace and userCfgFetchParamsObj.key values, respectively, and pass the userCfgFetchParamsObj to this function.
             * @param  {[type]} userCfgFetchParamsObj)    {            return self.fetchEncryptedString(userCfgFetchParamsObj.namespace [description]
             * @param  {[type]} userCfgFetchParamsObj.key [description]
             * @return {[type]}                           [description]
             */
            self.getAppCfg = function() { var fn = 'getAppCfg'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; } 
              // self.debug('entered',fn);
              // if(self.appCfg==null) {
              var appCfg = self.appCfg != null ? '' + self.appCfg.toString() : null;
              if(appCfg == null || appCfg.search(/^\{/) != -1 || appCfg.search(/\}$/) != -1) {
                // self.debug('fetching appCfg on first call...', fn);
                self.appCfg = JSON.parse(self.fetchEncryptedString(self.envConsts.appCfg.namespace, self.envConsts.appCfg.key)); 
                self.debug('appCfg = ' + JSON.stringify(self.appCfg), fn);
                PurpleRobot.log('appCfg = ' + JSON.stringify(self.appCfg));
                PurpleRobot.log('appCfg.logLevel = ' + self.appCfg.logLevel);
              }
              self.debug('exiting',fn);
              return self.appCfg;
            };
            break;


          // *** Node.js ***
          case 1:

            // * set function ptrs *
            // PR fns
            self.debug = function(s, fn) { if(self.appCfg.logLevel >= 4) { console.log('[DBG]' + (!(fn == null || fn == undefined || fn == 'null') ? '[' + fn + '] ' : ' ') + s); } };
            self.log = function(s, fn) { if(self.appCfg.logLevel >= 3) { console.log('[INF]' + (!self.isNullOrUndefined(fn) ? '[' + fn + '] ' : ' ') + s); } };
            self.warn = function(s, fn) { if(self.appCfg.logLevel >= 2) { console.warn('[WRN]' + (!self.isNullOrUndefined(fn) ? '[' + fn + '] ' : ' ') + s); } };
            self.error = function(s, fn) { if(self.appCfg.logLevel >= 1) { console.error('[ERR]' + (!self.isNullOrUndefined(fn) ? '[' + fn + '] ' : ' ') + s); } };
            self.playDefaultTone = function() { var fn = 'playDefaultTone'; self.log('NOEXEC: playDefaultTone', fn); };
            self.persistEncryptedString = function(namespace, key, value) { var fn = 'persistEncryptedString'; 
              // self.log('NOEXEC: persistEncryptedString: namespace = \'' + namespace + '\'; key = \'' + key + '\'; value = \'' + value + '\'', fn);
              self.log('persistEncryptedString: namespace = \'' + namespace + '\'; key = \'' + key + '\'; value = \'' + value + '\'', fn);
              var fs = require('fs');
              var filePath = self.envConsts.appCfg.tmpPersistencePath + '/' + namespace + '.' + key + '.txt';
              if(!fs.existsSync(self.envConsts.appCfg.tmpPersistencePath)) { fs.mkdirSync(self.envConsts.appCfg.tmpPersistencePath); }
              return fs.writeFileSync(filePath, value);
            };
            self.fetchEncryptedString = function(namespace, key) { var fn = 'fetchEncryptedString'; 
              // self.log('NOEXEC: fetchEncryptedString: namespace = \'' + namespace + '\'; key = \'' + key + '\'', fn);
              var fs = require('fs');
              var filePath = self.envConsts.appCfg.tmpPersistencePath + '/' + namespace + '.' + key + '.txt';
              return fs.readFileSync(filePath);
            };
            self.persistString = function(namespace, key, value) { var fn = 'persistString'; self.log('NOEXEC: persistString: namespace = \'' + namespace + '\'; key = \'' + key + '\'; value = \'' + value + '\'', fn); };
            self.fetchString = function(namespace, key) { var fn = 'fetchString'; self.log('NOEXEC: fetchString: namespace = \'' + namespace + '\'; key = \'' + key + '\'', fn); };
            self.scheduleScript = function(id, date, action) { var fn = 'scheduleScript'; self.log('NOEXEC: scheduleScript: ' + self.getQuotedAndDelimitedStr([id, date, action],','), fn); };
            self.showNativeDialog = function(title, msg, confirmTitle, cancelTitle, confirmScript, cancelScript) { var fn = 'showNativeDialog'; self.log('NOEXEC: showNativeDialog: ' + self.getQuotedAndDelimitedStr([title, msg, confirmTitle, cancelTitle, confirmScript, cancelScript], ','), fn); };
            self.updatePurpleRobotConfiguration = function(jsonPrConfig) { var fn = "updatePurpleRobotConfiguration"; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
              self.debug('entered',fn);
              if(!self.isNullOrUndefined(jsonPrConfig)) {
                self.log('Would update PR config using the following config structure:\r\n' + JSON.stringify(jsonPrConfig), fn);
              }
              else { self.warn('Purple Robot configuration not updated; jsonPrConfig was null or undefined.', fn); }
              self.debug('exiting',fn);
            },
            self.updateWidget = function(params) { var fn = 'updateWidget'; self.log('NOEXEC: updateWidget: ' + JSON.stringify(params), fn); };
            self.updateTrigger = function(triggerId, triggerObj) { var fn = 'updateTrigger'; 
              // self.log('NOEXEC: updateTrigger: ' + self.getQuotedAndDelimitedStr([triggerId, JSON.stringify(triggerObj)],','), fn);
              self.log('updateTrigger: ' + self.getQuotedAndDelimitedStr([triggerId, JSON.stringify(triggerObj)],','), fn);
              var fs = require('fs');
              var triggerArray = fs.existsSync(self.envConsts.appCfg.triggerPath) ? JSON.parse(fs.readFileSync(self.envConsts.appCfg.triggerPath)) : null;
              if (triggerArray == null) { fs.writeFileSync(self.envConsts.appCfg.triggerPath, JSON.stringify([triggerObj])); }
              else {
                var existingTrigger = _.find(triggerArray, function(t) { return t.identifier == triggerId; });
                if (self.isNullOrUndefined(existingTrigger)) {
                  triggerArray.push(triggerObj);
                }
                else {
                  triggerArray = _.reject(triggerArray, function(t) { return t.identifier == triggerId; });
                  triggerArray.push(triggerObj);
                }

                fs.writeFileSync(self.envConsts.appCfg.triggerPath, JSON.stringify(triggerArray));
              }

              return triggerArray;
            };
            self.fetchTriggerIds = function() { var fn = 'fetchTriggerIds';
              //self.log('NOEXEC: fetchTriggerIds', fn);
              var fs = require('fs');
              var triggerArray = fs.existsSync(self.envConsts.appCfg.triggerPath) ? JSON.parse(fs.readFileSync(self.envConsts.appCfg.triggerPath)) : null;
              // self.debug('triggerArray = ' + triggerArray, fn);
              var triggerIds = null;
              if (triggerArray != null) {
                triggerIds = _.pluck(triggerArray, 'identifier');
              }
              self.debug('triggerIds = ' + triggerIds, fn);
              return triggerIds;
            };
            self.fetchTrigger = function(triggerId) { var fn = 'fetchTrigger'; 
              // self.log('NOEXEC: fetchTrigger: ' + triggerId, fn);
              var fs = require('fs');
              var triggerArray = fs.existsSync(self.envConsts.appCfg.triggerPath) ? JSON.parse(fs.readFileSync(self.envConsts.appCfg.triggerPath)) : null;
              var trigger = null;
              if(triggerArray != null) {
                var trigger = _.find(triggerArray, function(t) { return t.identifier == triggerId; });
                self.debug('JSON.stringify(trigger) = ' + JSON.stringify(trigger), fn);
              }
              return trigger;
            };
            self.deleteTrigger = function(triggerId) { var fn = 'deleteTrigger'; self.log('NOEXEC: deleteTrigger: ' + triggerId, fn); };
            self.launchUrl = function(url) { var fn = 'launchUrl'; self.log('NOEXEC: launchUrl: ' + url, fn); };
            self.launchApplication = function(applicationFullName) { var fn = 'launchApplication'; self.log('NOEXEC: launchApplication: ' + url, fn); };
            self.loadLibrary = function(nameOrPath, keyOfLibInstanceToReturn) { var lib = require(nameOrPath); return lib; };
            self.vibrate = function(vibratePatternStr) { var fn = 'vibrate'; self.log('NOEXEC: vibrate: ' + vibratePatternStr, fn); };

            // support fns
            /**
             * Node-case: assign the usercfg file-path as the userCfgFetchParamsObj.key value, and pass the userCfgFetchParamsObj to this function.
             * @param  {[type]} userCfgFetchParamsObj) {            var fileName = userCfgFetchParamsObj.key; var fs = require('fs'); var userCfg = fs.readFileSync(fileName); self.log('userCfg = ' + userCfg [description]
             * @return {[type]}                        [description]
             */
            self.getUserCfg = function() { var fn = 'getUserCfg'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; } 
              self.log('entered',fn);
              if(self.userCfg == null) {
                self.debug('fetching userCfg on first call...', fn); 
                var fs = require('fs'); 
                self.userCfg = JSON.parse(fs.readFileSync(self.envConsts.userCfg.cfgFilePath));
              }
              self.log('exiting',fn);
              return self.userCfg;
            };
            /**
             * Node-case: implement when use-case arises.
             * @param  {[type]} userCfgFetchParamsObj)    {            return self.fetchEncryptedString(userCfgFetchParamsObj.namespace [description]
             * @param  {[type]} userCfgFetchParamsObj.key [description]
             * @return {[type]}                           [description]
             */
            self.getAppCfg = function() { var fn = 'getAppCfg'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; } 
              // self.log('entered',fn);
              var appCfg = self.appCfg != null ? '' + self.appCfg.toString() : null;
              if(appCfg == null || appCfg.search(/^\{/) != -1 || appCfg.search(/\}$/) != -1) {
                // self.debug('fetching appCfg on first call...', fn); 
                var fs = require('fs'); 
                self.appCfg = JSON.parse(fs.readFileSync(self.envConsts.appCfg.cfgFilePath));
              }
              self.log('exiting',fn);
              return self.appCfg;
            };
            break;


          // *** Browser ***
          case 2:

            // *** set lib refs ***
            // NOTE FOR THIS ENVIRONMENT: You must include Underscore via a <script> reference and pass-in the object reference on the appropriate env.libRefs.* variable.
            _ = env.libRefs.underscore;
            Date.prototype = env.libRefs.datejs;
            
            // * set function ptrs *
            // PR fns
            self.debug = function(s, fn) { if(self.appCfg.logLevel >= 4) { console.log('[DBG]' + (!(fn == null || fn == undefined || fn == 'null') ? '[' + fn + '] ' : ' ') + s); } };
            self.log = function(s, fn) { if(self.appCfg.logLevel >= 3) { console.log('[INF]' + (!self.isNullOrUndefined(fn) ? '[' + fn + '] ' : ' ') + s); } };
            self.warn = function(s, fn) { if(self.appCfg.logLevel >= 2) { console.warn('[WRN]' + (!self.isNullOrUndefined(fn) ? '[' + fn + '] ' : ' ') + s); } };
            self.error = function(s, fn) { if(self.appCfg.logLevel >= 1) { console.error('[ERR]' + (!self.isNullOrUndefined(fn) ? '[' + fn + '] ' : ' ') + s); } };
            self.playDefaultTone = function() { var fn = 'playDefaultTone'; self.log('NOEXEC: playDefaultTone', fn); };
            self.persistEncryptedString = function(namespace, key, value) { var fn = 'persistEncryptedString'; self.log('NOEXEC: persistEncryptedString: namespace = \'' + namespace + '\'; key = \'' + key + '\'; value = \'' + value + '\'', fn); };
            self.fetchEncryptedString = function(namespace, key) { var fn = 'fetchEncryptedString'; self.log('NOEXEC: fetchEncryptedString: namespace = \'' + namespace + '\'; key = \'' + key + '\'', fn); };
            self.persistString = function(namespace, key, value) { var fn = 'persistString'; self.log('NOEXEC: persistString: namespace = \'' + namespace + '\'; key = \'' + key + '\'; value = \'' + value + '\'', fn); };
            self.fetchString = function(namespace, key) { var fn = 'fetchString'; self.log('NOEXEC: fetchString: namespace = \'' + namespace + '\'; key = \'' + key + '\'', fn); };
            self.scheduleScript = function(id, date, action) { var fn = 'scheduleScript'; self.log('NOEXEC: scheduleScript: ' + self.getQuotedAndDelimitedStr([id, date, action],','), fn); };
            self.showNativeDialog = function(title, msg, confirmTitle, cancelTitle, confirmScript, cancelScript) { var fn = 'showNativeDialog'; self.log('NOEXEC: showNativeDialog: ' + self.getQuotedAndDelimitedStr([title, msg, confirmTitle, cancelTitle, confirmScript, cancelScript],','), fn); };
            self.updatePurpleRobotConfiguration = function(jsonPrConfig) { var fn = "updatePurpleRobotConfiguration"; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
              self.debug('entered',fn);
              if(!self.isNullOrUndefined(jsonPrConfig)) {
                self.log('Would update PR config using the following config structure:\r\n' + JSON.stringify(jsonPrConfig), fn);
              }
              else { self.warn('Purple Robot configuration not updated; jsonPrConfig was null or undefined.', fn); }
              self.debug('exiting',fn);
            },
            self.updateWidget = function(params) { var fn = 'updateWidget'; self.log('NOEXEC: updateWidget: ' + JSON.stringify(params), fn); };
            self.updateTrigger = function(triggerId, triggerObj) { var fn = 'updateTrigger'; self.log('NOEXEC: updateTrigger: ' + triggerId, JSON.stringify(triggerObj), fn); };
            self.fetchTriggerIds = function() { var fn = 'fetchTriggerIds'; self.log('NOEXEC: fetchTriggerIds', fn); return []; };
            self.fetchTrigger = function(triggerId) { var fn = 'fetchTrigger'; self.log('NOEXEC: fetchTrigger: ' + triggerId, fn); };
            self.deleteTrigger = function(triggerId) { var fn = 'deleteTrigger'; self.log('NOEXEC: deleteTrigger: ' + triggerId, fn); };
            self.launchUrl = function(url) { var fn = 'launchUrl'; self.log('NOEXEC: launchUrl: ' + url, fn); };
            self.launchApplication = function(applicationFullName) { var fn = 'launchApplication'; self.log('NOEXEC: launchApplication: ' + url, fn); };
            self.loadLibrary = function(nameOrPath, keyOfLibInstanceToReturn) { var lib = require(nameOrPath); return lib; };
            self.vibrate = function(vibratePatternStr) { var fn = 'vibrate'; self.log('NOEXEC: vibrate: ' + vibratePatternStr, fn); };

            // support fns
            /**
             * Browser-case: assign the usercfg variable you already have (presumably) as the userCfgFetchParamsObj.key value, and pass the userCfgFetchParamsObj to this function.
             * @param  {[type]} userCfgFetchParamsObj [description]
             * @return {[type]}                       [description]
             */
            self.getUserCfg = function() { var fn = 'getUserCfg'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; } self.log('entered & exiting',fn); if(userCfg==null) { userCfg = self.envConsts.userCfg.key; } return userCfg; };
            /**
             * Node-case: implement when use-case arises.
             * @param  {[type]} userCfgFetchParamsObj)    {            return self.fetchEncryptedString(userCfgFetchParamsObj.namespace [description]
             * @param  {[type]} userCfgFetchParamsObj.key [description]
             * @return {[type]}                           [description]
             */
            self.getAppCfg = function() { var fn = 'getAppCfg'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; } 
              self.debug('entered',fn);
              self.warn('NOT IMPLEMENTED FOR THIS EXECUTION CONTEXT.', fn);
              self.debug('exiting',fn);
              return self.appCfg;
            };
            break;

          // Unknown environment
          default:
            // console.error('ERROR: invalid selected environment value: ', envConsts.selected);
            throw ('ERROR: invalid selected environment value: ' + self.execCtx);
            break;
        };
      },


      // ===================================================
      // ========= NON-ENVIRONMENTAL SETUP =================
      // ===================================================

      // =================
      // Utility functions
      // =================
      isNullOrUndefined: function(v) { var fn = 'isNullOrUndefined'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        // if(v == '"') { self.debug('v is a double-quote!', fn); return false; }
        return (v == null || v == undefined || v == 'null');
      },

      isStringGt0Len: function(s) { var fn = 'isString'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        var ret = !self.isNullOrUndefined(s) && _.isString(s) && s.length > 0;
        self.debug('s = ' + s + '; ret = ' + ret, fn);
        return ret;
      },





      // =================================================================================================
      //
      //
      //
      //
      //
      //
      // ========= ALL YOUR AWESOME FUNCTIONS TO IMPLEMENT YOUR AWESOME CODE GO HERE!!!! =================
      //
      //        Just like the 2 functions above: isNullOrUndefined and isStringGt0Len...
      //
      //
      //
      //
      // =================================================================================================




      /**
       * ENTRY-POINT to the rest of the application. (For flow-control clarity, not language-level requirement.)
       * @param  {[type]} args [decsription]
       * @return {[type]}      [description]
       */
      main: function(args) { var fn = 'main'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        self.log('entered: args: ' + args, fn);
        self.log('execution context: ' + self.execCtx, fn);

        //
        //
        // WHATEVER YOU WANT TO RUN WHEN PRNM IS EXECUTED BY PR, YOU PUT IN THIS "main" FUNCTION -- JUST LIKE IN MANY OTHER PROGRAMMING LANGUAGE!
        //
        //

        self.log('exiting...', fn);
      },


      test: function() {
      return 'hello world from PurpleRobotNotificationManager.test';
      }

    };

  
  // the exports object gets the constructor function, which the calling function will call to instantiate this object.
  exports.ctor = ctor;

  return exports;

});



var passedToPRNM = typeof exports === 'undefined' ? this['PurpleRobotNotificationManager'] = {} : exports;
var PurpleRobotNotificationManager = new PRNM(passedToPRNM);

exports = PurpleRobotNotificationManager;
exports.ctor.prototype.execCtx = currentExecutionContext;

if (currentExecutionContext == 0) { PurpleRobot.log('exports.ctor.prototype.execCtx = ' + exports.ctor.prototype.execCtx); }
else  { console.log('exports.ctor.prototype.execCtx = ' + exports.ctor.prototype.execCtx); }
