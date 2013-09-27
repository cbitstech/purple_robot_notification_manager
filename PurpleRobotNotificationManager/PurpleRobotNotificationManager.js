// ***** UMB Medprompt trigger *****
// Author: evan.story@northwestern.edu
// Created: 20130409


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


      /**
       * Generates a Date object, using today's date, with the time specified in the timeStr.
       * @param  {[type]} timeStr [description]
       * @return {[type]}         [description]
       */
      genDateFromTime: function(timeStr) { var fn = 'genDateFromTime'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        var tarr = timeStr.split(':');
        var th = parseInt(tarr[0], 10),
            tm = parseInt(tarr[1], 10),
            ts = parseInt(tarr[2], 10);
        var date = Date.today().set({ hour: th, minute: tm, second: ts});
        // self.debug(self.getQuotedAndDelimitedStr([timeStr,th,tm,ts,date],','),fn);
        return date;
      },


      /**
       * Converts an ICal-formatted date string into a JS Date object.
       * @param  {[type]} iCalStr [description]
       * @return {[type]}         [description]
       */
      iCalToDate: function(iCalStr) { var fn = 'iCalToDate'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        var  yy = iCalStr.substr(0,4)
            ,MM = (parseInt(iCalStr.substr(4,2), 10)) - 1
            ,dd = iCalStr.substr(6,2)
            ,hh = iCalStr.substr(9,2)
            ,mm = iCalStr.substr(11,2)
            ,ss = iCalStr.substr(13,2);

        var d = new Date(yy,MM,dd,hh,mm,ss);
        // self.debug('iCalStr = ' + iCalStr + '; d = ' + d, fn);
        return d;
      },


      /**
       * Returns a single-quoted string representing a set of values in an array.
       * @param  {[type]} paramArray [description]
       * @return {[type]}            [description]
       */
      getQuotedAndDelimitedStr: function(paramArray, delim, quoteChar, doNotQuoteTokens) { var fn = 'getQuotedAndDelimitedStr'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        // self.log('entered and exiting, with paramArray = ' + paramArray,fn);
        var qc = self.isNullOrUndefined(quoteChar) ? '\'' : quoteChar;
        if(self.isNullOrUndefined(paramArray) || paramArray.length == 0) { return ''; }
        return _.reduce(_.map(paramArray, function(param) { 
            return !self.isNullOrUndefined(doNotQuoteTokens) && _.isArray(doNotQuoteTokens) && _.contains(doNotQuoteTokens, param)
              ? param
              : qc + param + qc;
          }),
          function(memo, val) {
            return paramArray.length == 1 ? val : memo + delim + val;
        });
      },


      // ==============================
      // Biz-logic (GENERIC)
      // ==============================


      /**
       * Gets a Date object representing a randomly-selected time within a range. Useful for randomizing when a prompt must load.
       * @return {[type]} [description]
       */
      getRandomDateTimeWithinRange: function(startDateTime, endDateTime) { var fn = 'getRandomDateTimeWithinRange'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        // apparently doing a date-diff in terms of milliseconds is way-simpler than I thought: http://stackoverflow.com/questions/327429/whats-the-best-way-to-calculate-date-difference-in-javascript
        var msInTimeSpan = endDateTime - startDateTime;
        // randomly-select an offset between 0 and msInTimeSpan, inclusive.
        var randVal = Math.random();
        var randOffsetInMs = (Math.floor(randVal * msInTimeSpan));
        var randDateTime = startDateTime.clone().addMilliseconds(randOffsetInMs);
        // self.debug('randVal = ' + randVal + '; randDateTime = ' + randDateTime,fn);
        return randDateTime;
      },


      /**
       * Sets a trigger of the datetime type.
       * @param  {[type]} type             [description]
       * @param  {[type]} name             [description]
       * @param  {[type]} actionScriptText [description]
       * @param  {[type]} startDateTime    [description]
       * @param  {[type]} endDateTime      [description]
       * @param  {[type]} repeatStr)       {            var fn = 'setDateTimeTrigger'; if(!this.CURRENTLY_IN_TRIGGER [description]
       * @return {[type]}                  [description]
       */
      setDateTimeTrigger: function(id, type, name, actionScriptText, startDateTime, endDateTime, repeatStr) { var fn = 'setDateTimeTrigger'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        self.debug('entered, for trigger name = ' + name,fn);
        // self.debug('actionScriptText = ' + actionScriptText, fn);

        switch(self.execCtx) {
          // PR and Node.js paths
          case 0:
          case 1:
            // self.log('PR path',fn);

            var dsical = startDateTime.toICal();
            var deical = endDateTime.toICal();
            
            // deletes the trigger if it already exists
            if(_.contains(self.fetchTriggerIds(), id)) { self.log('Deleting trigger: ' + id, fn); self.deleteTrigger(id); }

            // sets a trigger
            // self.debug('Trigger params: ' + self.getQuotedAndDelimitedStr([name,actionScriptText,startDateTime,dsical,endDateTime,deical], ','));
            
            var action = 
                'PurpleRobot.log(\'***** TRIGGER START! *****\'); '
              + actionScriptText
              + '; PurpleRobot.log(\'***** TRIGGER END! *****\');'
              ;
            
            var actionKey = id + '-actionScriptText';

            self.persistString(self.envConsts.appCfg.namespace, actionKey, action);
            // self.debug('Stored action string at [' + self.envConsts.appCfg.namespace + ',' + actionKey + '] of: ' + self.fetchString(self.envConsts.appCfg.namespace, actionKey) ,fn);
            var actionCharsToDisplay = 150 > action.length ? (action.length / 2) : 150;
            self.debug('Stored action string at [' + self.envConsts.appCfg.namespace + ',' + actionKey + '] of (displaying first and last ' + actionCharsToDisplay + ' chars): ' + action.substr(0,actionCharsToDisplay) + ' ... ' + action.substr(action.length - actionCharsToDisplay,actionCharsToDisplay),fn);

              var triggerObj = {
                'identifier': id,
                'type': 'datetime',
                'name': name,
                'action': ''
                  + 'var actionScriptText = PurpleRobot.fetchString(\'' + self.envConsts.appCfg.namespace + '\',\'' + actionKey + '\'); '
                  + 'PurpleRobot.log("[IN TRIGGER ACTION] eval()ing: " + actionScriptText);'
                  + 'eval(\'\' + actionScriptText);'
                  + 'PurpleRobot.log("[IN TRIGGER ACTION] did it eval?");'
                ,
                'datetime_start': dsical,
                'datetime_end': deical,
                'datetime_repeat': repeatStr
              };
              self.debug('triggerObj = ' + JSON.stringify(triggerObj), fn);
              self.updateTrigger(id, triggerObj);

              // // store trigger history
              // self.getAppCfg();
              // var trgWithState = self.appCfgGetTriggerState(fn, (self.appConfigCompletionStates()).NotStarted, null, triggerObj);
              // self.appCfg.triggerState.push(trgWithState);
              // self.debug('Saving trigger state = ' + JSON.stringify(trgWithState), fn);
              // self.appConfigUpsert(self.envConsts.appCfg.namespace, self.envConsts.appCfg.key, self.appCfg);
            
            break;

          case 2:
            self.warn('Not implemented for self.execCtx = ' + self.execCtx, fn);
            break;

          default:
            self.error('Invalid env: ' + self.execCtx, fn);
            break;
        }

        self.debug('exiting',fn);
      },


      /**
       * Provides the CRUD functions for an appConfig in PR's database.
       * @type {Object}
       */
      // appConfig: {
        appConfigSampleTrigger: function() {
          return {
            'createdOn': '20130523T150900',
            'createdInFn': '',
            'completionState': 0,
            'completedOn': null,
            'dstUrl': 'your-router-path-here',
            'triggerDef': {
              'identifier': 'test_id',
              'type': 'test_type',
              'name': 'test_name',
              'action': 'test_actionScriptText',
              'datetime_start': 'test_datetime_start',
              'datetime_end': 'test_datetime_end'
            }
          };
        },


        /**
         * A convenience function to get a trigger-state object for storing in the triggerState variable.
         * @param  {[type]} createdInFn     [description]
         * @param  {[type]} completionState [description]
         * @param  {[type]} dstUrl          [description]
         * @param  {[type]} triggerDef      [description]
         * @return {[type]}                 [description]
         */
        appCfgGetTriggerState: function(createdInFn, completionState, dstUrl, triggerDef) {
          var trgWithState = self.appConfigSampleTrigger();
          
          trgWithState.createdOn = (new Date()).toICal();
          trgWithState.createdInFn = createdInFn;
          trgWithState.completionState = completionState;
          trgWithState.dstUrl = dstUrl;
          trgWithState.triggerDef = triggerDef;
          return trgWithState;
        },


        // *** CRUD fns ***

        /**
         * Creates an app-config structure in PR. Should only be used on initial, first load of PRNM.
         *
         *  * purpleWarehouseSendMessageQueue: A queue of Purple Robot Importer messages for delivery to Purple Warehouse. See PR Importer unit-tests for example messages.
         *  * triggerState: Contains a history of all triggers for the app.
         * 
         * Trigger completionState values:
         *    NotStarted            = not started
         *    PromptedNoResponse    = prompted, user provided no response yet (ever?)
         *    PromptedPressedButton = prompted, user pressed one of the prompt's buttons
         *    PromptedEnteredApp    = prompted, user successfully entered PhoneGap app
         *    PromptedInProgress    = prompted, user is in-progress (user has completed >= 1 step of the path-to-completion AND has not completed it)
         *    PromptedCompleted     = prompted, user completed the trigger's lifecycle
         *    CanceledByTrigger     = trigger was canceled by another trigger
         *    CanceledByApp         = trigger was canceled by the PhoneGap app (e.g. )
         * 
         * Intended usage:
         *    On PRNM first-load,
         *      If appConfig does not exist, then run appConfigCreate.
         *    On trigger-create,
         *      Create a trigger-state object in the triggerState array. This will include the trigger definition (so that after the trigger runs, even if deleted, we have a copy available to us).
         *      Set the trigger-state object's completionState value to NotStarted.
         *    On trigger-prompt,
         *      Set the trigger-state object's completionState value to PromptedNoResponse.
         *    On prompt-redirects-to-PhoneGap (typically, 'Yes/OK' button-press),
         *      PhoneGap app navigates (using its router) to the location specified by dstUrl.
         *      Set the trigger-state object's completionState value to PromptedPressedButton.
         *    On PhoneGap-app-loads-destination-page,
         *      Set the trigger-state object's completionState value to PromptedEnteredApp.
         *    On PhoneGap-app-detects-user-in-progress,
         *      Set the trigger-state object's completionState value to PromptedInProgress.
         *    On PhoneGap-app-completes-prompt,
         *      trigger-state object's completionState value to PromptedCompleted.
         *      Set the trigger's completedOn = current date.
         *      
         * @param  {[type]} namespace [description]
         * @param  {[type]} keyInPR   [description]
         * @return {[type]}           [description]
         */
        appConfigCompletionStates: function() { var fn = 'appConfigCompletionStates'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
          return {
            'NotStarted': 'NotStarted',
            'PromptedNoResponse': 'PromptedNoResponse',
            'PromptedPressedButton': 'PromptedPressedButton',
            'PromptedEnteredApp': 'PromptedEnteredApp',
            'PromptedInProgress': 'PromptedInProgress',
            'PromptedCompleted': 'PromptedCompleted',
            'CanceledByTrigger': 'CanceledByTrigger',
            'CanceledByApp': 'CanceledByApp'
          };
        },

        appConfigCreate: function(namespace, keyInPR) { var fn = 'appConfigCreate'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
          var appCfg = self.getAppCfg();
          if(appCfg == null) {
            self.warn('Creating appCfg in PR database.', fn);
            self.persistEncryptedString(namespace, keyInPR, JSON.stringify({
                'staticOrDefault': {
                  'transition': {}
                },
                'dynamicOrModified': {
                  'transition': {}
                },
                'triggerState': []
              })
            );
          }
          else {
            self.warn('appCfg already exists in PR database; not creating.', fn);

            // // ensure triggerState exists
            // if(self.isNullOrUndefined(appCfg.triggerState)) {
            //   self.log('Updating and persisting appCfg for: ("' + namespace + '", "' + keyInPR + '"); reason: no triggerState array.');
            //     // clone the appCfg, update, then persist: http://heyjavascript.com/4-creative-ways-to-clone-objects/
            //     appCfg.triggerState = [];
            //     self.appConfigUpsert(namespace, keyInPR, appCfg);
            //   // self.persistEncryptedString(namespace, keyInPR, JSON.stringify(appCfg));
            //   self.appCfg = appCfg;
            //   // self.debug('self.appCfg = ' + JSON.stringify(self.appCfg), fn);
            //   var storedAppCfg = self.fetchEncryptedString(namespace, keyInPR);
            //   self.debug('storedAppCfg = ' + storedAppCfg, fn);
            // }
          }

          self.debug('CREATE(' + [namespace,keyInPR] + ')');
          return appCfg;
        },
        /**
         * Gets a namespaced key's value.
         * @param  {[type]} namespace [description]
         * @param  {[type]} keyInPR   [description]
         * @return {[type]}           [description]
         */
        appConfigRead: function(namespace, keyInPR) { var fn = 'appConfigRead'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
          var appCfg = self.fetchEncryptedString(namespace, keyInPR);
          self.debug('READ(' + [namespace,keyInPR] + ')');
          return appCfg;
        },
        /**
         * Inserts or updates a namespaced key.
         * @param  {[type]} namespace    [description]
         * @param  {[type]} keyInPR      [description]
         * @param  {[type]} appConfigObj [description]
         * @return {[type]}              [description]
         */
        appConfigUpsert: function(namespace, keyInPR, appConfigObj) { var fn = 'appConfigUpsert'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
          var upsertable = JSON.stringify(appConfigObj);
          self.persistEncryptedString(namespace, keyInPR, upsertable);
          self.debug('UPSERT(' + [namespace,keyInPR,upsertable] + ')');
        },
        /**
         * 'Deletes' (actually, marks empty) a namespaced key.
         * @param  {[type]} namespace [description]
         * @param  {[type]} keyInPR   [description]
         * @return {[type]}           [description]
         */
        appConfigDelete: function(namespace, keyInPR) { var fn = 'appConfigDelete'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
          self.persistEncryptedString(namespace, keyInPR, null);
          self.debug('DELETE(' + [namespace,keyInPR] + ')');
        },

        // *** Convenience fns ***

        appConfigSetUrl: function(namespace, keyInPR, triggerId, newUrl) { var fn = 'appConfigSetUrl'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
          var appCfg = self.appConfig.get(namespace, keyInPR);
          var trigger = _.findWhere(appCfg.triggerState, {triggerDef: triggerId});
          trigger.dstUrl = newUrl;
          self.appConfig.set(namespace, keyInPR, trigger);
        },
      // },





      /*
       ==============================
       Biz-logic (UMB-specific)
       ==============================
       Decisions driving this logic (as of 20130514): 
  
        From UMB - Daily Issues Call - notes: https://docs.google.com/document/d/1adAqQqhkyDSM-a6qwpVKfdewoRVAlhVtY-0Ti9yV68c/edit?pli=1

          *** 2013-04-15 ***
          Decision (from Julie & Seth): Time rule: patients always take their medication at the time specified, regardless of time-zone. (e.g. if it’s at 4PM in GMT-6, then it’s at 4PM in GMT-0, too).


          *** 2013-04-09 ***
          Decision: “Last Medprompt of day is the last time we can survey someone.” [MB]
          Decision: All EMAs will prompt after MP1 and before MP3, randomly-scheduled within the 30min bounds around each of the MP times. [MB] Therefore, the time-ordering is as follows:
            MP1 + 30min < (EMA1..n) < MP2 - 30min && MP2 + 30min < (EMA2..n) < MP3.

          Decision: We will not handle the possibility of EMAs colliding w/ Medprompts.


          *** 2013-04-05 ***
          [MB, Julie] MedPrompt complete after first yes/no question in the PhoneGap app (“did you take XX?”)
          [MB, Julie] EMA: not complete until they complete the last yes/no question.

          If prompt not answered:
            EMAs will wait 30 mins to prompt only 1 time.
            If after second prompt for same EMA the EMA is not answered, do not prompt a third time.

            Users have the ability to go-back on their own and take an EMA they didn’t complete earlier.
            If user does this, it will cancel-out the next EMA of that type for that day. (i.e., manually taking SE cancels the next SE EMA for 24h)

          Timing of prompts:
            MedPrompt at scheduled times.
            EMA at random times, outside boundaries around the MedPrompt times.

      */

      /*** EMA / Assessments ***/

      replaceTokensForEMA: function(inStr, schedObj) { var fn = 'replaceTokensForEMA'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        var outStr = inStr;
        // self.debug('outStr = ' + outStr, fn);
        // provide some nice tokenizing string-replacement for ID-setting
        //    %N = the assessment name
        //    %T = the assessment time
        //    %APOS = an apostrpohe char ("'")
        _.each([
           {'%N': schedObj.name}
          ,{'%T': (_.isDate(schedObj.time) ? schedObj.time.toString('HH:mm:ss') : schedObj.time.substr(11,8)) }
          // ,{'%APOS': '&#39;'}
          ], function(replacementPair) {
            var key = _.keys(replacementPair)[0];
            outStr = outStr.replace(key, replacementPair[key]);
        });
        // self.debug('exiting; outStr = ' + outStr,fn);
        return outStr;
      },


      /**
       * Generates an EMA prompt trigger ID.
       * @param  {[type]} schedObj) {            var fn = 'genEMAPromptTriggerId'; if(!this.CURRENTLY_IN_TRIGGER [description]
       * @return {[type]}           [description]
       */
      genEMAPromptTriggerId: function(schedObj) { var fn = 'genEMAPromptTriggerId'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        self.debug('entered',fn);
        var id = self.replaceTokensForEMA((self.getAppCfg()).staticOrDefault.showNativeDialog.assessment.identifier, schedObj);
        return id;
      },

      
      /**
       * Returns the set of time ranges that are open/available for scheduling events, constrained by:
       * 		1) A wake time (inclusive).
       * 		2) A sleep time (exclusive.
       * 		3) A "buffer zone" of time (in minutes) around specified other datetimes during which scheduling is not permitted.
       *
       * Ranges must be defined according to this constraint hierarchy, with each higher (shallower) level taking precedence over its succeeding lower (deeper) level:
       *   wake/sleep times
       *     MedPrompts
       *       EMAs
       * @param  {[type]} medPromptTriggerDateTimes [description]
       * @param  {[type]} rangeBoundsBufferMinutes) {            var fn = 'getOpenTimeRanges'; if(!this.CURRENTLY_IN_TRIGGER [description]
       * @return {[type]}                           [description]
       */
      getOpenTimeRanges: function(wakeTime, sleepTime, medPromptTriggerDateTimes, rangeBoundsBufferMinutes) { var fn = 'getOpenTimeRanges'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        self.debug('entered; medPromptTriggerDateTimes = ' + medPromptTriggerDateTimes + '; rangeBoundsBufferMinutes = ' + rangeBoundsBufferMinutes,fn);

        var openTimeRanges = [];

        var medPromptsDefined = !self.isNullOrUndefined(medPromptTriggerDateTimes) && medPromptTriggerDateTimes.length > 0;

        /* append a range between the wake time and the first MedPrompt boundary */
        var startTime = self.genDateFromTime(wakeTime);
        var endTime = medPromptsDefined
        	? medPromptTriggerDateTimes[0].clone().addMinutes(-(rangeBoundsBufferMinutes))
        	: self.genDateFromTime(sleepTime);
        if (startTime < endTime) {
	        openTimeRanges.push({ 'start': startTime, 'end': endTime });
	      }

	      // If no MedPrompts are defined, then our only range is the wake time to the sleep time -- so return here.
	      // Else, process the MedPrompt times and append the range after the last MedPrompt.
	      if(medPromptsDefined) {

	        /* append the MedPrompt-based time ranges, with time boundaries, EXCLUSIVE of wake/sleep times */
	        for(var i = 0; i < medPromptTriggerDateTimes.length; i++) {
	          if(i < medPromptTriggerDateTimes.length - 1) {
	            // compute the start and end time boundaries.
	            startTime = medPromptTriggerDateTimes[i].clone().addMinutes(rangeBoundsBufferMinutes);
	            endTime = medPromptTriggerDateTimes[i+1].clone().addMinutes(-(rangeBoundsBufferMinutes));
	            // if a valid time range is found, then include it for return
	            if(endTime > startTime) {
	              openTimeRanges.push({ 'start': startTime, 'end': endTime });
	            }
	          }
	        }

	        /* append a range between the last MedPrompt boundary and the sleep time */
	        startTime = medPromptTriggerDateTimes[medPromptTriggerDateTimes.length - 1].clone().addMinutes(rangeBoundsBufferMinutes),
	        endTime = self.genDateFromTime(sleepTime);
	        if (startTime < endTime) {
		        openTimeRanges.push({ 'start': startTime, 'end': endTime });
	        }
				}

        self.debug('exiting; openTimeRanges = ' + JSON.stringify(openTimeRanges), fn);
        return openTimeRanges;






        // // V2: ABORT THIS; looked initially like a good idea, but let's rewrite...
        // self.debug('entered; medPromptTriggerDateTimes = ' + medPromptTriggerDateTimes + '; rangeBoundsBufferMinutes = ' + rangeBoundsBufferMinutes,fn);

        // var openTimeRanges = [];

        // var medPromptsDefined = !self.isNullOrUndefined(medPromptTriggerDateTimes) && medPromptTriggerDateTimes.length > 0;

        // /* append a range between the wake time and the first MedPrompt boundary */
        // var startTime = self.genDateFromTime(wakeTime);
        // var initEndDateTime = self.genDateFromTime(wakeTime);
        // var firstEndTimeIsMedPromptNotSleepTime = medPromptsDefined ? initEndDateTime > medPromptTriggerDateTimes[0] : false;
        // var endTime = medPromptsDefined
        //   ? (
        //       firstEndTimeIsMedPromptNotSleepTime
        //       ? medPromptTriggerDateTimes[0].clone().addMinutes(-(rangeBoundsBufferMinutes))
        //       : initEndDateTime
        //     )
        //   : initEndDateTime;
        // if (startTime < endTime) {
        //   openTimeRanges.push({ "start": startTime, "end": endTime });
        // }

        // // If no MedPrompts are defined, then our only range is the wake time to the sleep time -- so return here.
        // // Else, process the MedPrompt times and append the range after the last MedPrompt.
        // if(medPromptsDefined) {

        //   /* append the MedPrompt-based time ranges, with time boundaries, EXCLUSIVE of wake/sleep times */
        //   for(var i = 0; i < medPromptTriggerDateTimes.length; i++) {
        //     if(i < medPromptTriggerDateTimes.length - 1) {
        //       // compute the start and end time boundaries.
        //       startTime = medPromptTriggerDateTimes[i].clone().addMinutes(rangeBoundsBufferMinutes);
        //       endTime = medPromptTriggerDateTimes[i+1].clone().addMinutes(-(rangeBoundsBufferMinutes));
        //       // if a valid time range is found, then include it for return
        //       if(endTime > startTime) {
        //         openTimeRanges.push({ "start": startTime, "end": endTime });
        //       }
        //     }
        //   }

        //   /* append a range between the last MedPrompt boundary and the sleep time */
        //   startTime = medPromptTriggerDateTimes[medPromptTriggerDateTimes.length - 1].clone().addMinutes(rangeBoundsBufferMinutes),
        //   endTime = self.genDateFromTime(sleepTime);
        //   if (startTime < endTime) {
        //     openTimeRanges.push({ "start": startTime, "end": endTime });
        //   }
        // }

        // self.debug('exiting; openTimeRanges = ' + JSON.stringify(openTimeRanges), fn);
        // return openTimeRanges;
        

        // // V3: rewrite the algo to loop-over the set of MPs, and for each, 
        // // compare the appropriate start/end times before assigning (slightly more computationally-expensive than above, 
        // // but more-elegant and probably more easily-provable)
        // // // wakeTime, sleepTime, medPromptTriggerDateTimes, rangeBoundsBufferMinutes
        // var openTimeRanges = [];

        // var currDateTime = new Date();
        // var currentWakeDateTime = self.genDateFromTime(wakeTime);
        // var currentSleepDateTime = self.genDateFromTime(sleepTime);

        // // compute next wake-sleep period for cases in which the if we are currently beyond a wake-time start, then wake-time analysis should be for next day, not today.
        // // same goes for sleep time.
        // var nextWakeDateTime = currentWakeDateTime.clone().addDays(1);
        // var nextSleepDateTime = currentSleepDateTime.clone().addDays(1);

        // var medPromptsDefined = !self.isNullOrUndefined(medPromptTriggerDateTimes) && medPromptTriggerDateTimes.length > 0;

        // if(medPromptsDefined) {
        // 	++

        //   for(var i = 0; i < medPromptTriggerDateTimes.length ; i++) {
        //     var mptStartTime = medPromptTriggerDateTimes[i].clone().addMinutes(rangeBoundsBufferMinutes);
        //     var mptEndTime = medPromptTriggerDateTimes[i+1].clone().addMinutes(-(rangeBoundsBufferMinutes));

        //     if(mptStartTime)
        //   }

        // }
        // // no MedPrompts => set 1 range = wake:sleep
        // else {
        //   openTimeRanges.push({ "start": currentWakeDateTime, "end": currentSleepDateTime })
        // }

        // for(var i = 0; i < )

        // return openTimeRanges;
      },


      /**
       * Returns a randomly-selected datetime in the set of open/available time ranges.
       * @param  {[type]} openTimeRanges) {            var fn = 'getRandomDateTimeAcrossAllOpenRanges'; if(!this.CURRENTLY_IN_TRIGGER [description]
       * @return {[type]}                 [description]
       */
      getRandomDateTimeAcrossAllOpenRanges: function(openTimeRanges) { var fn = 'getRandomDateTimeAcrossAllOpenRanges'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        self.debug('entered; openTimeRanges = ' + JSON.stringify(openTimeRanges), fn);
        var randomlySelectedDateTime = null;

        if(openTimeRanges.length > 0) {
          var randIdx = Math.floor((Math.random()*openTimeRanges.length));
          // self.debug('randIdx = ' + randIdx, fn);
          var startTime = openTimeRanges[randIdx].start;
          var endTime = openTimeRanges[randIdx].end;
          self.debug('startTime = ' + startTime + '; endTime = ' + endTime, fn);
          randomlySelectedDateTime = self.getRandomDateTimeWithinRange(
            // openTimeRanges[randIdx].start,
            // openTimeRanges[randIdx].end
            startTime,
            endTime
            );
        }

        self.debug('exiting; randomlySelectedDateTime = ' + randomlySelectedDateTime, fn);
        return randomlySelectedDateTime;
      },



      /**
       * Gets the open time ranges multiplied by the scheduling frequency specified.
       * @param  {[type]} openTimeRanges            [description]
       * @param  {[type]} schedulingFrequencyAsICal [description]
       * @return {[type]}                           [description]
       */
      getOpenTimeRangesMultipliedForSchedulingFrequencyAsICal: function(openTimeRanges, schedulingFrequencyAsICal) { var fn = 'getOpenTimeRangesMultipliedForSchedulingFrequencyAsICal'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        self.debug('entered; openTimeRanges = ' + JSON.stringify(openTimeRanges) + '; schedulingFrequencyAsICal = ' + schedulingFrequencyAsICal, fn);
// self.debug('_.isDate(openTimeRanges[0].start) = ' + _.isDate(openTimeRanges[0].start));

        switch(schedulingFrequencyAsICal) {
          case 'DAILY':
            return openTimeRanges;
            break;
          case 'WEEKLY':
            var openTimeRangesFor1Week = [];

            _.each(openTimeRanges,
              function(otr) {
                for (var i = 0; i < 6; i++) {
                   openTimeRangesFor1Week.push({ 'start': otr.start.clone().addDays(i), 'end': otr.end.clone().addDays(i) });
                }
              }
            );

            return openTimeRangesFor1Week;
            break;
          case 'MONTHLY':
            // return _.map(openTimeRanges, function(otr) {
            //     return { 'start': otr.startTime, 'end': otr.endTime };
            //   });
            throw "NotImplemented; use DAILY or WEEKLY instead, or implement.";
            break;
        }
      },


      /**
       * Determines the scheduled and 
       * @param  {[type]} medPromptTriggerDateTimes) {            var fn = 'getScheduledAndUnscheduledEMAs'; if(!this.CURRENTLY_IN_TRIGGER [description]
       * @return {[type]}                            [description]
       */
      getScheduledAndUnscheduledEMAs: function(medPromptTriggerDateTimes, schedulingFrequencyAsICal) { var fn = 'getScheduledAndUnscheduledEMAs'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        self.debug('entered; medPromptTriggerDateTimes = ' + medPromptTriggerDateTimes,fn);

        // get available open time ranges
        var wakeTime = self.userCfg.promptBehavior.wakeSleepTimes.daily.wakeTime;
        var sleepTime = self.userCfg.promptBehavior.wakeSleepTimes.daily.sleepTime;
        var openTimeRangesFor1Day = self.getOpenTimeRanges(wakeTime, sleepTime, medPromptTriggerDateTimes, self.appCfg.staticOrDefault.showNativeDialog.assessment.minTimeFromMedPromptMins);

        // get all open time ranges for the specified period
        var openTimeRanges = self.getOpenTimeRangesMultipliedForSchedulingFrequencyAsICal(openTimeRangesFor1Day, schedulingFrequencyAsICal);

        // get the set of EMAs from-which to randomly-select and randomly schedule
        // var emaTransitionObjs = _.keys(self.appCfg.staticOrDefault.transition.onEMAYes);
        var emaTransitionObjs = 
          _.filter(
            _.keys(self.appCfg.staticOrDefault.showNativeDialog.assessment.frequencyAsICal),
            function(k) {
              return self.appCfg.staticOrDefault.showNativeDialog.assessment.frequencyAsICal[k] == schedulingFrequencyAsICal;
            }
          );
        self.debug('emaTransitionObjs = ' + emaTransitionObjs, fn);

        // generate the time ranges between which EMAs may be prompted
        var scheduledEMAs = _.map(emaTransitionObjs, function(key) {
          var survSched = {
            'name': key,
            'time': self.getRandomDateTimeAcrossAllOpenRanges(openTimeRanges),
            'parentId': null,
            'childId': null,
            'triggerId': null
          };
          // survSched.id = self.appCfg.staticOrDefault.namespace + survSched.name + survSched.time;
          survSched.id = self.getEMAIDStr(self.appCfg.staticOrDefault.namespace, survSched.name, survSched.time);
          self.debug('survSched = ' + JSON.stringify(survSched),fn);
          return survSched;
        });
        self.debug('scheduledEMAs = ' + JSON.stringify(scheduledEMAs));

        // if any EMA does not have a time-slot, then barf-up an error; else, schedule them...
        var unscheduledEMAs = _.filter(scheduledEMAs, function(o) { return o.time == null; });
        // self.debug('unscheduledEMAs = ' + self.getQuotedAndDelimitedStr(unscheduledEMAs, ',', "'"), fn);
        self.debug('unscheduledEMAs = ' + JSON.stringify(unscheduledEMAs), fn);

        return [scheduledEMAs, unscheduledEMAs];
      },


      /**
       * Sets scheduled EMAs in Purple Robot.
       * @param {[type]} schedObj                  [description]
       * @param {[type]} schedulingFrequencyAsICal [description]
       */
      setScheduledEMA: function(schedObj, emaTransitionAndScheduleObjs, schedulingFrequencyAsICal) { var fn = 'setScheduledEMA'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        var schedObjStr = JSON.stringify(schedObj);
        self.debug('schedObj = ' + schedObjStr, fn);
        
        var sdt = schedObj.time;
        self.debug('sdt = ' + sdt, fn);
        var  type = 'datetime'
            // ,name = self.triggerIdPrefixes.medPrompt + schedObj.medication + ' at ' + schedObj.time
            ,triggerId = self.genEMAPromptTriggerId(schedObj)
            ,actionScriptText = null
            ,startDateTime = sdt
            ,endDateTime = sdt.clone().addMinutes(1)
            ,untilDateTime = (new Date())
              .addDays(1)
            ;
        // var repeatStr = 'FREQ=DAILY;INTERVAL=1;UNTIL=' + untilDateTime.toICal();
        var repeatStr = 'FREQ=' + schedulingFrequencyAsICal + ';INTERVAL=1;UNTIL=' + untilDateTime.toICal();
        self.debug('triggerId = ' + triggerId, fn);

        // map the schedule ID to the trigger ID
        schedObj.triggerId = triggerId;
        // ...in parent...
        if(schedObj.childId == null) {
          var parent = _.find(emaTransitionAndScheduleObjs, function(o) { return o.id == schedObj.parentId; });
          parent.childTriggerId = triggerId;
        }

        var showNativeDialogParams = self.getQuotedAndDelimitedStr([
          self.replaceTokensForEMA(self.appCfg.staticOrDefault.showNativeDialog.assessment.title, schedObj)
          ,self.replaceTokensForEMA(self.appCfg.staticOrDefault.showNativeDialog.assessment.message, schedObj)
          ,'OK'
          ,null
          // v3 - WORKS!!!!!
          // In the parameters to the specified function (e.g. the parameters to onMedPromptYes are specified in the array passed as the second param to convertFnToString):
          // 
          // The idea here is to mock the 'self' object using the specified function's current context.
          // Then, specify all the function dependencies in-order in the array string here.
          // Then, functions that live in PRNM can access other functions that live in PRNM -- enabling code-reuse.
          // Then, append the current dose as a string.
          // All of this gets eval'd in the trigger action, including the dose string (making it a dose obj after eval) and ready for use in the trigger.
          ,self.convertFnToString(self.actions.onEMAYes, [
              self.actionFns.getCommonFnSetForActions()
            + self.actionFns.getTriggerFns() 
            + self.actionFns.getEMAPromptFns()
            + self.actionFns.getAppCfgFns()
            + 'var schedObj = ' + schedObjStr + ';'
            + 'var triggerId = "' + triggerId + '";'
            + 'var childTriggerId = ' + (schedObj.childId == null ? null : '"' + schedObj.childTriggerId + '"') + ';'
            ])
          ,null
          ], ',', "'", [null]);

        // the generated action to execute in a trigger
        actionScriptText = 
            'PurpleRobot.vibrate("'+ self.appCfg.staticOrDefault.vibratePattern +'");'
          + 'PurpleRobot.showNativeDialog(' + showNativeDialogParams + ');';
        
        // self.debug('actionScriptText = ' + actionScriptText,fn);
        // var name = self.appCfg.staticOrDefault.showNativeDialog.assessment.title;
        var name = self.appCfg.staticOrDefault.showNativeDialog.assessment.title + ', EMA@' + startDateTime.toString('MM/dd h:mmtt');
        self.setDateTimeTrigger(triggerId, type, name, actionScriptText, startDateTime, endDateTime, repeatStr);

      },
      

      /**
       * Determine whether it's time to run the weekly scheduling.
       * @param  {[type]}  currDateTime) {            var fn = 'isDayToRunWeeklyScheduling'; if(!this.CURRENTLY_IN_TRIGGER [description]
       * @return {Boolean}               [description]
       */
      isDayToRunWeeklyScheduling: function(currDateTime) { var fn = 'isDayToRunWeeklyScheduling'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        var calcDate = self.isNullOrUndefined(currDateTime) ? (new Date()) : currDateTime;
        self.debug('entered; run day = ' + self.appCfg.staticOrDefault.weeklyScheduleRunDay + '; calcDate = ' + calcDate, fn);
        self.getAppCfg();
        return calcDate.getDay() == Date.getDayNumberFromName(self.appCfg.staticOrDefault.weeklyScheduleRunDay);
      },


      /**
       * Generates an EMA ID string.
       * @param  {[type]} namespace [description]
       * @param  {[type]} name      [description]
       * @param  {[type]} time      [description]
       * @return {[type]}           [description]
       */
      getEMAIDStr: function(namespace, name, time) {
        return namespace + name + time;
      },


      /**
       * Sets all EMA prompts (survey prompts) for the following 24 hours.
       * @param  {[type]} ) {            var fn = 'setAllEMAPrompts'; if(!this.CURRENTLY_IN_TRIGGER [description]
       * @return {[type]}   [description]
       */
      // setAllEMAPrompts: function(createdMedPromptTriggerIds) { var fn = 'setAllEMAPrompts'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
      //  self.debug('entered; createdMedPromptTriggerIds = ' + createdMedPromptTriggerIds,fn);
      setAllEMAPrompts: function(medPromptTriggerDateTimes) { var fn = 'setAllEMAPrompts'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        self.debug('entered; medPromptTriggerDateTimes = ' + medPromptTriggerDateTimes,fn);

        // get the configs necessary to run, if not done already.
        self.getUserCfg();
        self.getAppCfg();

        // for each scheduling frequency we handle...
        _.each(['DAILY', 'WEEKLY'], function(schedulingFrequencyAsICal) {

          // Skip the WEEKLY scheduling unless the current day is the specified day of the week.
          if(schedulingFrequencyAsICal == 'WEEKLY' && !self.isDayToRunWeeklyScheduling()) {
            return;
          }

          // get the scheduled and unscheduled EMAs
          var scheduledAndUnscheduledEMAs = self.getScheduledAndUnscheduledEMAs(medPromptTriggerDateTimes, schedulingFrequencyAsICal);
          var scheduledEMAs = scheduledAndUnscheduledEMAs[0];
          var unscheduledEMAs = scheduledAndUnscheduledEMAs[1];

          // if a scheduling error occurred...
          if(unscheduledEMAs.length > 0) {
            var msg = "ERROR: the following EMAs do not have a randomly-scheduled time: " + _.pluck(unscheduledEMAs, 'name');
            self.error(msg, fn);
            self.updateWidget({
              'identifier': self.envConsts.appCfg.namespace,
              'title': self.appCfg.staticOrDefault.updateWidget.title,
              'message': msg,
              'action': 'PurpleRobot.launchApplication("com.google.android.gm");'
            });
          }
          else {
            // Implementing the logic of:
            //    If prompt not answered:
            //      EMAs will wait 30 mins to prompt only 1 time.
            //      If after second prompt for same EMA the EMA is not answered, do not prompt a third time.
            // Let's do this by simply creating a second trigger for each EMA trigger. This second trigger will be deleted on user button-press; else, it will execute.
            scheduledEMAs = scheduledEMAs.concat(
              _.map(scheduledEMAs, function(o) {
                // shallow-copy the object; this is OK because it's only 1-level deep anyway.
                var sched2 = _.clone(o);
                sched2.time       = sched2.time.clone().addMinutes(self.appCfg.staticOrDefault.updateWidget.widgetState.nonResponsive.TTLinMins);
                sched2.parentId   = o.id;
                // sched2.id         = self.appCfg.staticOrDefault.namespace + sched2.name + sched2.time;
                sched2.id         = self.getEMAIDStr(self.appCfg.staticOrDefault.namespace, sched2.name, sched2.time);
                sched2.triggerId  = null;
                o.childId         = sched2.id;
                return sched2;
              })
            );
            self.debug('*** scheduledEMAs.length = ' + scheduledEMAs.length, fn);
            self.debug('*** JSON.stringify(scheduledEMAs) = ' + JSON.stringify(scheduledEMAs), fn);

            // reverse the array so we work from leaf-nodes up -- this makes getting the triggerId of children much simpler!
            scheduledEMAs.reverse();

            // set EMA triggers
            _.each(scheduledEMAs, function(schedObj) { self.setScheduledEMA(schedObj, scheduledEMAs, schedulingFrequencyAsICal); });
          }

        });

        self.debug('exiting',fn);
      },


      /*** MedPrompt ***/

      replaceTokensForMedPrompt: function(inStr, dose) { var fn = 'replaceTokensForMedPrompt'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        var outStr = inStr;
        self.debug('entered; outStr = ' + outStr + '; dose = ' + JSON.stringify(dose), fn);
        var timeFormat = (self.getAppCfg()).staticOrDefault.timeFormat;

        // self.debug('replacing tokens in: ' + outStr, fn);
        // provide some nice tokenizing string-replacement for ID-setting
        //    %M = the dose medication
        //    %T = the dose time
        //    %S = the dose strength
        //    %U = the dispensation unit
        //    %O = a time offset string for the name string in Purple Robot
        _.each([
           {'%M': dose.medication}
           // {'%M': (function() { self.debug('dose = ' + JSON.stringify(dose)); return dose.medication; })()}
          ,{'%T': (self.genDateFromTime(dose.time)).toString(timeFormat) }
          ,{'%S': dose.strength}
          ,{'%U': dose.dispensationUnit}
          ,{'%O': dose.timeOffsetStr ? dose.timeOffsetStr : ''}
          ], function(replacementPair) {
            // self.debug('replacementPair = ' + replacementPair, fn);
            // self.debug('dose = ' + JSON.stringify(dose), fn);
            var key = _.keys(replacementPair)[0];
            outStr = outStr.replace(key, replacementPair[key]);
        });
        self.debug('exiting; outStr = ' + outStr,fn);
        return outStr;
      },


      replaceTokensForUser: function(inStr) { var fn = 'replaceTokensForUser'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        var outStr = inStr;
        var userCfg = (self.getUserCfg());
        // provide some nice tokenizing string-replacement for ID-setting
        //    %USER = username
        _.each([
          { '%USER': (
            function() {
              // find the first patient (there should only be 1) from a trial/project's userCfg.people array, and return either its 
              // self.debug("userCfg.people = " + JSON.stringify(userCfg.people), fn);
              var person = _.find(userCfg.people, function(p) { return p.type == 'patient'; });
              return (!self.isNullOrUndefined(person) && self.isStringGt0Len(person.id)) ? person.id : 'NO_PERSON_ID_FOUND_CHECK_USERCFG';
            }) ()
          }
          ], function(replacementPair) {
            var key = _.keys(replacementPair)[0];
            outStr = outStr.replace(key, replacementPair[key]);
        });
        // self.debug('exiting; outStr = ' + outStr,fn);
        return outStr;
      },


      genMedPromptTriggerId: function(dose) { var fn = 'genMedPromptTriggerId'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        self.debug('entered; dose = ' + JSON.stringify(dose),fn);
        var id = self.replaceTokensForMedPrompt((self.getAppCfg()).staticOrDefault.showNativeDialog.medPrompt.identifier, dose);
        self.debug('exiting; id = ' + id,fn);
        return id;
      },


      /**
       * Generates a parameter string to be passed into a string definition of an action for a trigger.
       * @param  {[type]} triggerId [description]
       * @param  {[type]} doseStr   [description]
       * @return {[type]}           [description]
       */
      genMedPromptShowNativeDialogParams: function(triggerId, doseStr, dose) {
        var p = self.getQuotedAndDelimitedStr([
           self.replaceTokensForMedPrompt(self.appCfg.staticOrDefault.showNativeDialog.medPrompt.title, dose)
          ,self.replaceTokensForMedPrompt(self.appCfg.staticOrDefault.showNativeDialog.medPrompt.message, dose)
          ,'Yes'
          ,'No'
          // v3 - WORKS!!!!!
          // In the parameters to the specified function (e.g. the parameters to onMedPromptYes are specified in the array passed as the second param to convertFnToString):
          // 
          // The idea here is to mock the 'self' object using the specified function's current context.
          // Then, specify all the function dependencies in-order in the array string here.
          // Then, functions that live in PRNM can access other functions that live in PRNM -- enabling code-reuse.
          // Then, append the current dose as a string.
          // All of this gets eval'dose in the trigger action, including the dose string (making it a dose obj after eval) and ready for use in the trigger.
          ,self.convertFnToString(self.actions.onMedPromptYes, [
              self.actionFns.getCommonFnSetForActions()
            + self.actionFns.getTriggerFns() 
            + self.actionFns.getMedPromptFns()
            + self.actionFns.getAppCfgFns()
            + self.actionFns.getWidgetFns()
            + 'var dose = ' + doseStr + ';'
            + 'var triggerId = "' + triggerId + '";'
            ])
          ,self.convertFnToString(self.actions.onMedPromptNo, [
              self.actionFns.getCommonFnSetForActions() 
            + self.actionFns.getTriggerFns()
            + self.actionFns.getMedPromptFns()
            + self.actionFns.getAppCfgFns()
            + self.actionFns.getWidgetFns()
            + 'var dose = ' + doseStr + ';'
            + 'var triggerId = "' + triggerId + '";'
            ])
          ], ',', "'");

        return p;
      },


      /**
       * Gets the action text for a MedPrompt.
       * @param  {[type]} triggerId [description]
       * @param  {[type]} doseStr   [description]
       * @param  {[type]} dose)     {            var fn = 'getMedPromptActionText'; if(!this.CURRENTLY_IN_TRIGGER [description]
       * @return {[type]}           [description]
       */
      getMedPromptActionText: function(triggerId, doseStr, dose) { var fn = 'getMedPromptActionText'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        var showNativeDialogParams = self.genMedPromptShowNativeDialogParams(triggerId, doseStr, dose);
        self.debug('ENTERED: triggerId = ' + triggerId + '; doseStr = ' + doseStr + '; dose = ' + JSON.stringify(dose) + '; _.keys(dose) = ' + _.keys(dose) + '; self.appCfg.staticOrDefault.medPrompt.wisePillLastSeenUrl = ' + self.appCfg.staticOrDefault.medPrompt.wisePillLastSeenUrl, fn);
        var actionScriptText = 
            // v1 - WORKS!
            //   'PurpleRobot.vibrate("'+ (self.getAppCfg()).staticOrDefault.vibratePattern +'");'
            // + 'PurpleRobot.showNativeDialog(' + showNativeDialogParams + ');';

            // v2 - intended code 
            // DESCRIPTION / PURPOSE:
            //   The goal of this code is to determine whether to display a MedPrompt, based on the last time the user opened their WisePill pillbox.
            //   If the user opened it within the last 5 minutes, then do not display the MedPrompt.
            //   Else, display the MedPrompt.
              'PurpleRobot.log(\'[getMedPromptActionText] ENTERED: triggerId = "' + triggerId + '"; doseStr = "' + doseStr + '"; dose = "' + dose + '"\');'

            + 'PurpleRobot.loadLibrary(\'date.js\');'
            + 'PurpleRobot.loadLibrary(\'underscore.js\');'
            
            + 'var url = "' + self.replaceTokensForUser(self.appCfg.staticOrDefault.medPrompt.wisePillLastSeenUrl) + '";'
            + 'PurpleRobot.log(\'url = \' + url);'

            + 'var wisePillLastSeenDateTimeStr = PurpleRobot.readUrl(url);'
            // + '  PurpleRobot.log(\'[getMedPromptActionText] 1\');'
            + 'PurpleRobot.log(\'[getMedPromptActionText] \' + wisePillLastSeenDateTimeStr);'
            
            + 'if (wisePillLastSeenDateTimeStr != null && wisePillLastSeenDateTimeStr != undefined) {'

            // + '  PurpleRobot.log(\'[getMedPromptActionText] 2\');'
            + '  var wisePillLastSeenDateTime = new Date(wisePillLastSeenDateTimeStr);'
            // + '  PurpleRobot.log(\'[getMedPromptActionText] 3\');'
            + '  PurpleRobot.log(\'[getMedPromptActionText] \' + wisePillLastSeenDateTime);'

            // + '  PurpleRobot.log(\'[getMedPromptActionText] 4\');'
            + '  var currDateMinus5Min = (new Date()).addMinutes(-5);'
            + '  PurpleRobot.log(\'[getMedPromptActionText] currDateMinus5Min = \' + currDateMinus5Min);'
            // + '  PurpleRobot.log(\'[getMedPromptActionText] 5\');'

            // // TESTING: force true in the conditional
            // + 'wisePillLastSeenDateTime = currDateMinus5Min.clone().addMinutes(1);'

            // if the user has opened the pillbox in the last 5 minutes, then do not notify them to take their pill; else, do notify them.
            + '  if(wisePillLastSeenDateTime > currDateMinus5Min) {'
            // + '    PurpleRobot.log(\'[getMedPromptActionText] 6\');'
            + '    PurpleRobot.deleteTrigger(\'' + triggerId + '\');'
            + '  }'
            + '  else {'
            // + '    PurpleRobot.log(\'[getMedPromptActionText] 7\');'
            + '    PurpleRobot.vibrate(\''+ (self.getAppCfg()).staticOrDefault.vibratePattern +'\');'
            + '    PurpleRobot.showNativeDialog(' + showNativeDialogParams + ');'
            + '  }'
            + '}'

            // if some tech glitch prevented the string from coming-through, then notify the user
            + 'else {'
            // + '  PurpleRobot.log(\'[getMedPromptActionText] 8\');'
            + '  PurpleRobot.vibrate(\''+ (self.getAppCfg()).staticOrDefault.vibratePattern +'\');'
            + '  PurpleRobot.showNativeDialog(' + showNativeDialogParams + ');'
            + '}'
            ;
        self.debug('actionScriptText = ' + actionScriptText, fn);
        return actionScriptText;
      },


      /**
       * Sets all the MedPrompts for the following 24 hours.
       * @param  {[type]} ) {            var fn = 'setAllMedPrompts'; if(!this.CURRENTLY_IN_TRIGGER [description]
       * @return {[type]}   [description]
       */
      setAllMedPrompts: function() { var fn = 'setAllMedPrompts'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        self.debug('entered',fn);
        self.getUserCfg();
        self.getAppCfg();

        // keep a list of the triggers we create here
        var createdTriggerIds = [];

        _.each(self.userCfg.doses, function(d, i) {
          var doseStr = JSON.stringify(d);
          self.debug('*** ADDING DOSE ***: d = ' + doseStr, fn);
          
          var sdt = self.genDateFromTime(d.time);
          self.debug('sdt = ' + sdt, fn);
          var  type = 'datetime'
              // ,name = self.triggerIdPrefixes.medPrompt + d.medication + ' at ' + d.time
              ,triggerId = self.genMedPromptTriggerId(d)
              ,actionScriptText = null
              ,startDateTime = sdt
              ,endDateTime = sdt.clone().addMinutes(1)
              ,untilDateTime = (new Date()).addDays(1)
              ;
          self.debug('triggerId = ' + triggerId, fn);
          var repeatStr = 'FREQ=DAILY;INTERVAL=1;UNTIL=' + untilDateTime.toICal();

          // the generated action to execute in a trigger
          // biz-logic (from "Heart2HAART (H2H) Logic Model Explanation: 01/14/2013"): "When the dose is due, the phone will vibrate and alert to remind the user to take their dose. "
          // var showNativeDialogParams = self.genMedPromptShowNativeDialogParams(triggerId, doseStr, d);
          // actionScriptText = 
          //     'PurpleRobot.vibrate("'+ self.appCfg.staticOrDefault.vibratePattern +'");'
          //   + 'PurpleRobot.showNativeDialog(' + showNativeDialogParams + ');';
          actionScriptText = self.getMedPromptActionText(triggerId, doseStr, d);
          
          var name = self.appCfg.staticOrDefault.showNativeDialog.medPrompt.title + ', MP';
          self.setDateTimeTrigger(triggerId, type, name, actionScriptText, startDateTime, endDateTime, repeatStr);

          // keep track of all the MedPrompt-at-the-scheduled-time triggers we've created
          self.debug('Pushing triggerId = ' + triggerId + '; name = ' + name, fn);
          createdTriggerIds.push(triggerId);


          // * generate the +TTL (UMB says 30) minutes reminder instance of this trigger. *
          var triggerIdPlusTTL = triggerId + '+' + self.appCfg.staticOrDefault.updateWidget.widgetState.nonResponsive.TTLinMins + 'min';
          // var showNativeDialogParamsPlusTTL = self.genMedPromptShowNativeDialogParams(triggerIdPlusTTL, doseStr, d);
          // actionScriptText = 
          //     'PurpleRobot.vibrate("'+ self.appCfg.staticOrDefault.vibratePattern +'");'
          //   + 'PurpleRobot.showNativeDialog(' + showNativeDialogParamsPlusTTL + ');';
          actionScriptText = self.getMedPromptActionText(triggerIdPlusTTL, doseStr, d);
          name = name + ' +' + self.appCfg.staticOrDefault.updateWidget.widgetState.nonResponsive.TTLinMins + 'min'
          self.setDateTimeTrigger(triggerIdPlusTTL, type, name, actionScriptText, startDateTime.clone().addMinutes(self.appCfg.staticOrDefault.updateWidget.widgetState.nonResponsive.TTLinMins), endDateTime.addMinutes(self.appCfg.staticOrDefault.updateWidget.widgetState.nonResponsive.TTLinMins), repeatStr);


          /***
            Create countdown triggers

            Logic doc: https://docs.google.com/viewer?a=v&pid=gmail&attid=0.1&thid=13fa517a59a0eef5&mt=application/vnd.openxmlformats-officedocument.wordprocessingml.document&url=https://mail.google.com/mail/u/0/?ui%3D2%26ik%3D9c7d25f93d%26view%3Datt%26th%3D13fa517a59a0eef5%26attid%3D0.1%26disp%3Dsafe%26realattid%3Df_hiony1d90%26zw&sig=AHIEtbSDFhDKbLh21b9p7CtZpIG8K7tFQg
          ***/
          // * Active State: set 60-minutes-prior trigger *
          // The “Active” state: This state is activated when the participant has a medication 
          // reminder due in the next 60 minutes. One hour (60 minutes) before the medication is 
          // due a “countdown” timer will begin for that dose.
          self.log('Generating Active state trigger starting ' + self.appCfg.staticOrDefault.updateWidget.widgetState.active.reminderMinutesBeforeDose.first + ' from the prompt time.', fn);
          // var triggerIdFirstPrior     = self.genMedPromptTriggerId(d) + '-' + self.appCfg.staticOrDefault.updateWidget.widgetState.active.reminderMinutesBeforeDose.first + 'min';
          d.timeOffsetStr = '-' + self.appCfg.staticOrDefault.updateWidget.widgetState.active.reminderMinutesBeforeDose.first + 'min:W';
          var triggerIdFirstPrior     = self.genMedPromptTriggerId(d);
          var startDateTimeFirstPrior = sdt.clone().addMinutes(-(self.appCfg.staticOrDefault.updateWidget.widgetState.active.reminderMinutesBeforeDose.first));
          var endDateTimeFirstPrior   = startDateTimeFirstPrior.clone().addMinutes(1);
          var untilDateTimeFirstPrior = sdt.clone().addMinutes(-(self.appCfg.staticOrDefault.updateWidget.widgetState.active.reminderMinutesBeforeDose.second));
          var repeatStrFirstPrior     = 'FREQ=MINUTELY;INTERVAL=1;UNTIL=' + untilDateTimeFirstPrior.toICal();
          
          self.debug(self.getQuotedAndDelimitedStr([triggerIdFirstPrior, sdt.clone(), startDateTimeFirstPrior, endDateTimeFirstPrior, untilDateTimeFirstPrior, repeatStrFirstPrior], ',', "'"), fn);
          var actionScriptTextFirstPrior = self.getWidgetReminderTriggerActionText(
          	sdt, 
          	self.appCfg.staticOrDefault.updateWidget.widgetState.active.message,
          	[
							{ "image": self.appCfg.staticOrDefault.updateWidget.widgetState.active.imageUrl }
          	]
          );
          self.debug('actionScriptTextFirstPrior = ' + actionScriptTextFirstPrior, fn);

          var nameFirstPrior = triggerIdFirstPrior;
          self.setDateTimeTrigger(triggerIdFirstPrior, type, nameFirstPrior, actionScriptTextFirstPrior, startDateTimeFirstPrior, endDateTimeFirstPrior, repeatStrFirstPrior);


          // * Active State: set 5-minutes-prior trigger *
          // At five (5) minutes before the time the dose is due to be taken, the widget 
          // will trigger a vibrate and audible alert for the participant. This serves as their 
          // five-minute warning. At the time their dose is due (in this example 12:00pm) 
          // the pop-up will appear (as indicated on the logic diagram).
          self.log('Generating Active state trigger starting ' + self.appCfg.staticOrDefault.updateWidget.widgetState.active.reminderMinutesBeforeDose.second + ' from the prompt time.', fn);
          // var triggerIdSecondPrior     = self.genMedPromptTriggerId(d) + '-' + self.appCfg.staticOrDefault.updateWidget.widgetState.active.reminderMinutesBeforeDose.second + 'min';
          d.timeOffsetStr = '-' + self.appCfg.staticOrDefault.updateWidget.widgetState.active.reminderMinutesBeforeDose.second + 'min:W';
          var triggerIdSecondPrior     = self.genMedPromptTriggerId(d);
          var startDateTimeSecondPrior = sdt.clone().addMinutes(-(self.appCfg.staticOrDefault.updateWidget.widgetState.active.reminderMinutesBeforeDose.second));
          var endDateTimeSecondPrior   = startDateTimeSecondPrior.clone().addMinutes(1);
          var untilDateTimeSecondPrior = sdt.clone();
          var repeatStrSecondPrior     = 'FREQ=MINUTELY;INTERVAL=1;UNTIL=' + untilDateTimeSecondPrior.toICal();

          self.debug(self.getQuotedAndDelimitedStr([triggerIdSecondPrior, sdt.clone(), startDateTimeSecondPrior, endDateTimeSecondPrior, untilDateTimeSecondPrior, repeatStrSecondPrior], ',', "'"), fn);
          var actionScriptTextSecondPrior = self.getWidgetReminderTriggerActionText(
          	sdt, 
          	self.appCfg.staticOrDefault.updateWidget.widgetState.active.message,
          	[
            	 { "message_color": self.appCfg.staticOrDefault.updateWidget.widgetState.active.textColor }
            	,{ "title_color": self.appCfg.staticOrDefault.updateWidget.widgetState.active.textColor }
							,{ "image": self.appCfg.staticOrDefault.updateWidget.widgetState.active.imageUrl }
          	]
        	);
          // do the 5-min-before haptic and auditory alerts...
          actionScriptTextSecondPrior += ''
            + 'if(minutesBeforeDose == ' + self.appCfg.staticOrDefault.updateWidget.widgetState.active.reminderMinutesBeforeDose.second + ') { PurpleRobot.vibrate(\'' + self.appCfg.staticOrDefault.vibratePattern + '\'); PurpleRobot.playDefaultTone(); }'
            ;
          self.debug('actionScriptTextSecondPrior = ' + actionScriptTextSecondPrior, fn);

          var nameSecondPrior = triggerIdSecondPrior;
          self.setDateTimeTrigger(triggerIdSecondPrior, type, nameSecondPrior, actionScriptTextSecondPrior, startDateTimeSecondPrior, endDateTimeSecondPrior, repeatStrSecondPrior);


          // * Non-Responsive State: 0 min: set trigger for NRS -> Neutral transition after 30min *
          // Non-Responsive State: This state is activated when the participant has ignored the 
          // medication reminder pop-up (they have not pressed “Yes” or “No” on the pop-up 
          // window). It should state: “Press here to begin.” Please make this stand out on the 
          // screen (red, flashing, etc). This will launch the medication prompt pop-up. 
          //    It will stay in this state for 30 minutes. At the end of 30 minutes, the pop-up is 
          //    will come back up automatically again. If it is ignored this time, the widget will 
          //    return to the neutral state.

          // * Generate NonResponsive state trigger *
          self.log('Generating Non-Responsive state trigger starting at the prompt time (' + sdt + ').', fn);
          // var triggerIdNonResponsive     = self.genMedPromptTriggerId(d) + '-nonResponsive+0min';
          d.timeOffsetStr = '+0min:W';
          var triggerIdNonResponsive     = self.genMedPromptTriggerId(d);
          var startDateTimeNonResponsive = sdt.clone();
          var endDateTimeNonResponsive   = startDateTimeNonResponsive.clone().addMinutes(1);
          var untilDateTimeNonResponsive = sdt.clone().addMinutes(self.appCfg.staticOrDefault.updateWidget.widgetState.nonResponsive.TTLinMins);
          var repeatStrNonResponsive     = 'FREQ=MINUTELY;COUNT=1';
          self.debug(self.getQuotedAndDelimitedStr([triggerIdNonResponsive, sdt.clone(), startDateTimeNonResponsive, endDateTimeNonResponsive, untilDateTimeNonResponsive, repeatStrNonResponsive], ',', "'"), fn);

          var actionScriptTextNonResponsive = self.getWidgetReminderTriggerActionText(
            sdt, 
            self.appCfg.staticOrDefault.updateWidget.widgetState.nonResponsive.message,
            [
            	 { "message_color": self.appCfg.staticOrDefault.updateWidget.widgetState.nonResponsive.textColor }
            	,{ "title_color": self.appCfg.staticOrDefault.updateWidget.widgetState.nonResponsive.textColor }
            	,{ "image": self.appCfg.staticOrDefault.updateWidget.widgetState.nonResponsive.imageUrl }
            ]
          );

          self.debug('actionScriptTextNonResponsive = ' + actionScriptTextNonResponsive, fn);
          var nameNonResponsive = triggerIdNonResponsive;
          self.setDateTimeTrigger(triggerIdNonResponsive, type, nameNonResponsive, actionScriptTextNonResponsive, startDateTimeNonResponsive, endDateTimeNonResponsive, repeatStrNonResponsive);
          
          // * Generate automatic-return-to-Neutral-state trigger *
          self.log('Generating Neutral state trigger starting at the prompt time (' + sdt + ').', fn);
          // var triggerIdNeutral     = triggerId + '-retToNeutral+' + self.appCfg.staticOrDefault.updateWidget.widgetState.nonResponsive.TTLinMins + 'min';
          d.timeOffsetStr = '+' + self.appCfg.staticOrDefault.updateWidget.widgetState.nonResponsive.TTLinMins + 'min:W';
          // var triggerIdNeutral     = triggerId + d.timeOffsetStr + ':W' + '-retToNeutral+';
          var triggerIdNeutral     = self.genMedPromptTriggerId(d);
          var startDateTimeNeutral = sdt.clone().addMinutes(self.appCfg.staticOrDefault.updateWidget.widgetState.nonResponsive.TTLinMins);
          var endDateTimeNeutral   = startDateTimeNeutral.clone().addMinutes(1);
          var untilDateTimeNeutral = startDateTimeNeutral.clone().addMinutes(1);
          var repeatStrNeutral     = 'FREQ=MINUTELY;COUNT=1';
          self.debug(self.getQuotedAndDelimitedStr([triggerIdNeutral, sdt.clone(), startDateTimeNeutral, endDateTimeNeutral, untilDateTimeNeutral, repeatStrNeutral], ',', "'"), fn);
 
          var actionScriptTextNeutral = self.getWidgetReminderTriggerActionText(
            sdt, 
            self.appCfg.staticOrDefault.updateWidget.widgetState.neutral.message,
            [
            	 { "message_color": self.appCfg.staticOrDefault.updateWidget.widgetState.neutral.textColor }
            	,{ "title_color": self.appCfg.staticOrDefault.updateWidget.widgetState.neutral.textColor }
            	,{ "image": self.appCfg.staticOrDefault.updateWidget.widgetState.neutral.imageUrl }
            ]
          );
          self.debug('actionScriptTextNeutral = ' + actionScriptTextNeutral, fn);

          var nameNeutral = triggerIdNeutral;
          self.setDateTimeTrigger(triggerIdNeutral, type, nameNeutral, actionScriptTextNeutral, startDateTimeNeutral, endDateTimeNeutral, repeatStrNeutral);

        });

        self.debug('exiting',fn);
        return createdTriggerIds;
      },


      /*** widget ***/

      /**
       * A hacky workaround for the fact that the script text hasn't yet been successfully quoted and executed in a way following the intended convention of PRNM. ==> REFACTORING OPPORTUNITY.
       * @param  {[type]} nextDoseTime) {            var fn = 'getWidgetReminderTriggerActionText'; if(!this.CURRENTLY_IN_TRIGGER [description]
       * @return {[type]}               [description]
       */
      getWidgetReminderTriggerActionText: function(nextDoseDateTime, dispStr, addlUpdateWidgetParams) { var fn = 'getWidgetReminderTriggerActionText'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        self.getAppCfg();
        return ''
            + 'PurpleRobot.loadLibrary(\'date.js\');'
            + 'var dispStr = \'' + dispStr + '\';'
            + 'var timeFormat = \'' + self.appCfg.staticOrDefault.timeFormat + '\';'
            + 'var nextDoseDateTime = new Date(' + nextDoseDateTime.getFullYear() + ',' + nextDoseDateTime.getMonth() + ',' + nextDoseDateTime.getDate() + ',' + nextDoseDateTime.getHours() + ',' + nextDoseDateTime.getMinutes() + ',' + nextDoseDateTime.getSeconds() + ');'
            + 'var minutesBeforeDose = Math.round((Math.abs(nextDoseDateTime.getTime() - (new Date()).getTime())) / 1000 / 60);'
            + 'var tokenArr = [\'%T\', \'%ETAMIN\'];'
            + 'for (var i = 0; i < tokenArr.length; i++) {'
            + '  if(i==0) { dispStr = dispStr.replace(tokenArr[i], nextDoseDateTime.toString(timeFormat)); }'
            + '  if(i==1) { dispStr = dispStr.replace(tokenArr[i], minutesBeforeDose); }'
            + '}'
            + 'var updateWidgetParams = {'
            + '    \'identifier\': \'' + self.envConsts.appCfg.namespace + '\','
            + '    \'message\': dispStr,'
            + '    \'action\': \'PurpleRobot.log("Widget tapped; launching app: ' + self.appCfg.staticOrDefault.appPackageName + '"); PurpleRobot.launchApplication("' + self.appCfg.staticOrDefault.appPackageName + '");\''
            + '  };'
            // generate code to represent inserting additional params in the updateWidgetParams obj.
            + (self.isNullOrUndefined(addlUpdateWidgetParams)
              ? ''
              : (
                _.reduce(_.map(addlUpdateWidgetParams, 
                    function (keyValuePair) {
                      return 'updateWidgetParams["' + _.keys(keyValuePair) + '"] = "' + _.values(keyValuePair) + '";';
                    }
                  ),
                  function(memo, i) {
                    return memo + i;
                  }
                )
              )
            )
            + 'PurpleRobot.log(\'[DBG][' + fn + '] Updating widget; updateWidgetParams = \' + JSON.stringify(updateWidgetParams));'
            + 'PurpleRobot.updateWidget(updateWidgetParams);'
            ;
      },


      replaceTokensForWidget: function(inStr, nextDoseTime) { var fn = 'replaceTokensForWidget'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        var outStr = inStr;
        var timeFormat = (self.getAppCfg()).staticOrDefault.timeFormat;
        // self.debug('outStr = ' + outStr, fn);
        // provide some nice tokenizing string-replacement
        //    %T = the next dose time
        _.each([
            {'%T': nextDoseTime.toString(timeFormat) }
          , {'%ETAMIN': Math.round((Math.abs(nextDoseTime.getTime() - (new Date()).getTime())) / 1000 / 60) }
          ], function(replacementPair) {
            var key = _.keys(replacementPair)[0];
            outStr = outStr.replace(key, replacementPair[key]);
        });
        // self.debug('exiting; outStr = ' + outStr,fn);
        return outStr;
      },


      getNextDateTime: function(sortedAscendingDateTimeArray, comparisonDateTime) { var fn = "getNextDateTime"; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        self.debug('entered; comparisonDateTime = ' + comparisonDateTime + '; sortedAscendingDateTimeArray = ' + sortedAscendingDateTimeArray,fn);

        if(!sortedAscendingDateTimeArray || !_.isArray(sortedAscendingDateTimeArray)) { throw "sortedAscendingDateTimeArray is null, undefined, or not an array."; }
        var ret = null;

        self.debug('sortedAscendingDateTimeArray.length = ' + sortedAscendingDateTimeArray.length, fn);
        for (var i = 0; i < sortedAscendingDateTimeArray.length; i++) {
          var d = sortedAscendingDateTimeArray[i];
          var dateCmpRslt = comparisonDateTime.compareTo(d);
          self.debug('dateCmpRslt = ' + dateCmpRslt + ' given dates: ' + comparisonDateTime + ' and ' + d, fn);
          if (dateCmpRslt == 0 || dateCmpRslt == -1) {
            ret = sortedAscendingDateTimeArray[i];
            break;
          }
        }
        self.debug('exiting; ret = ' + ret,fn);
        return ret;
      },


      /**
       * For a value with a string length > 0, append it to the specified widget parameters object at the specified key.
       * @param  {[type]} widgetParamsObj [description]
       * @param  {[type]} key             [description]
       * @param  {[type]} value           [description]
       * @return {[type]}                 [description]
       */
      appendNonZeroLenValueToWidgetParams: function(widgetParamsObj, key, value) {  var fn = "appendNonZeroLenValueToWidgetParams"; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        // add an optional image URL, if it exists
        if(self.isStringGt0Len(value)) {
          self.debug('key = ' + key + '; value = ' + value, fn);
          widgetParamsObj[key] = value;
        }
        return widgetParamsObj;
      },


      /**
       * Sets a widget with a medication-adherence message dependent on a set of medication-consumption ("dosing") times and a period of time prior to each at which the widget's message must change.
       * @param  {[type]} widgetId                   [description]
       * @param  {[type]} medPromptTriggerDateTimes) {            var fn = "setWidget"; if(!this.CURRENTLY_IN_TRIGGER [description]
       * @return {[type]}                            [description]
       */
      setWidget: function(widgetId, medPromptTriggerDateTimes) { var fn = "setWidget"; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        self.debug('entered; widgetId = ' + widgetId + '; medPromptTriggerDateTimes = ' + medPromptTriggerDateTimes,fn);
        self.getAppCfg();

        // determine next dose time
        var nextDoseDateTimes = _.sortBy(medPromptTriggerDateTimes, function(dt) { return dt; });
        if(nextDoseDateTimes.length == 0) {
          self.error('No next MedPrompt time found!', fn);
          return;
        }
        var currDateTime = new Date();
        var nextDoseDateTime = self.getNextDateTime(medPromptTriggerDateTimes, currDateTime);
        self.debug('nextDoseDateTime = ' + nextDoseDateTime, fn);
        var inNeutralState = nextDoseDateTime > currDateTime.addMinutes(parseInt(self.appCfg.staticOrDefault.updateWidget.widgetState.active.reminderMinutesBeforeDose.first));
        var msg = inNeutralState
          ? self.appCfg.staticOrDefault.updateWidget.widgetState.neutral.message
          : self.appCfg.staticOrDefault.updateWidget.widgetState.active.message;
        // self.debug('msg = ' + msg, fn);

        // Step 1: set the widget values and transition-state.
        var updateWidgetParams = {
          'identifier': widgetId,
          'title': self.appCfg.staticOrDefault.updateWidget.title,
          'message': nextDoseDateTime != null ? self.replaceTokensForWidget(msg, nextDoseDateTime) : self.appCfg.staticOrDefault.updateWidget.widgetState.neutral.message,
          'action': 
            'eval(' 
              + self.getQuotedAndDelimitedStr(
                [
                  self.convertFnToString(
                    self.actions.onWidgetPress,
                    [ self.actionFns.getCommonFnSetForActions() ],
                    false
                  )
                ]
              )
            + ');'
            // '/* INTENTIONALLY BLANK */'
        };

        // get & display the total # points and display them in the widget
        var pointsFromPr = self.fetchString(self.envConsts.appCfg.namespace, 'points');
        self.debug('pointsFromPr = ' + pointsFromPr, fn);
        if(!self.isNullOrUndefined(pointsFromPr)) {
          var points = JSON.parse(pointsFromPr);
          if(!self.isNullOrUndefined(points.total)) {
            self.debug('points.total = ' + points.total, fn);
            updateWidgetParams['badge'] = points.total;
          }
        }
        else {
          self.debug('No points path...', fn);
          updateWidgetParams['badge'] = 'None.';
        }

        // add an optional image URL, if it exists
        var selectedImageUrl = inNeutralState ? self.appCfg.staticOrDefault.updateWidget.widgetState.neutral.imageUrl : self.appCfg.staticOrDefault.updateWidget.widgetState.active.imageUrl;
        self.appendNonZeroLenValueToWidgetParams(updateWidgetParams, 'image', selectedImageUrl);

        // set the text color
        var selectedTextColor = inNeutralState ? self.appCfg.staticOrDefault.updateWidget.widgetState.neutral.textColor : self.appCfg.staticOrDefault.updateWidget.widgetState.active.textColor;
        self.appendNonZeroLenValueToWidgetParams(updateWidgetParams, 'message_color', selectedTextColor);
        self.appendNonZeroLenValueToWidgetParams(updateWidgetParams, 'title_color', selectedTextColor);
        
        // update the widget
        // self.debug('updateWidgetParams = ' + JSON.stringify(updateWidgetParams), fn);

        self.debug('_.keys(updateWidgetParams) = ' + _.keys(updateWidgetParams), fn);
        // self.debug('_.values(updateWidgetParams) = ' + _.reject(_.values(updateWidgetParams), function(v) { return (!self.isNullOrUndefined(v) && v.length > 2048); }), fn);
        var charsToDisplay = 1024;
        self.debug('_.values(updateWidgetParams) = ' + 
          _.map(_.values(updateWidgetParams), function(v) { 
            return (!self.isNullOrUndefined(v) && v.length > charsToDisplay ? v.substr(0,2*charsToDisplay) + ' ...TRUNCATING... ' + v.substr(v.length-charsToDisplay, charsToDisplay) : v);
          }), fn);

        self.updateWidget(updateWidgetParams);

        self.debug('exiting', fn);
      },


      /**
       * Enables PRNM function and data usage in actions. Always make getCommonFnSetForActions the first function in your set of concatenations!
       * 
       * More-specifically, this defines a set of functions, each of which returns a string containing function and variable assignments that would otherwise only be available in PRNM.
       * @type {Object}
       */
      actionFns: {
        /**
         * BASE SET OF FUNCTIONS. ALWAYS CALL THIS FIRST IF ANY OTHER FUNCTIONS ARE USED!
         * 
         * Bundles a set of functions that are often found in trigger actions,
         * in a way that maintains the convention used in the bundled functions' own definition,
         * which prevents re-coding for different contexts.
         * @return {[type]} [description]
         */
        getCommonFnSetForActions: function() { var fn = 'getCommonFnSetForActions'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
          var s = ''
            + 'this["CURRENTLY_IN_TRIGGER"] = true;'
            + 'var self = this;'
            + 'self.ctor = self;'
            + 'self.envConsts = ' + JSON.stringify(self.envConsts) + ';'
            + 'self.triggerIdPrefixes = ' + JSON.stringify(self.triggerIdPrefixes) + ';'

            + 'self.fetchEncryptedString = ' + self.fetchEncryptedString.toString() + ';'
            + 'self.persistEncryptedString = ' + self.persistEncryptedString.toString() + ';'

            + 'self.isNullOrUndefined = ' + self.isNullOrUndefined.toString() + ';'
            + 'self.log = ' + self.log.toString() + ';'
            + 'self.debug = ' + self.debug.toString() + ';'

            + 'self.getAppCfg = ' + self.getAppCfg.toString() + ';'
            // + 'var appCfgStr = self.fetchEncryptedString("' + self.envConsts.appCfg.namespace + '", "' + self.envConsts.appCfg.key + '");'
            // + 'self.appCfg = JSON.parse(appCfgStr);'
            + 'self.appCfg = self.getAppCfg();'

            + 'self.loadLibrary = ' + self.loadLibrary.toString() + ';'
            // + 'self.launchUrl = ' + self.launchUrl.toString() + ';'
            + 'self.launchApplication = ' + self.launchApplication.toString() + ';'

            + 'var _ = self.loadLibrary("underscore.js", "_");'

            // This seems to impose a noticeable performance penalty on prompt-button-press. Refactor?
            + 'self.loadLibrary("date.js", null);'
            + 'Date.prototype.toICal = ' + Date.prototype.toICal.toString() + ';'
            + 'self.iCalToDate = ' + self.iCalToDate.toString() + ';'
            ;
          // self.debug(fn + ' = ' + s, fn);
          return s;
        },

        /**
         * Enables easy userCfg access in actions.
         * @return {[type]} [description]
         */
        getUserCfg: function() { var fn = 'getUserCfg'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
          var s = 'var userCfgStr = self.fetchEncryptedString("' + self.envConsts.userCfg.namespace + '", "' + self.envConsts.userCfg.key + '");'
                + 'self.userCfg = JSON.parse(userCfgStr);'
          ;
          // self.debug(fn + ' = ' + s, fn);
          return s;
        },

        getTriggerFns: function() { var fn = 'getTriggerFns'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
          var s = 'self.fetchTriggerIds = ' + self.fetchTriggerIds.toString() + ';'
                + 'self.fetchTrigger = ' + self.fetchTrigger.toString() + ';'
                + 'self.deleteTrigger = ' + self.deleteTrigger.toString() + ';'
          ;
          // self.debug(fn + ' = ' + s, fn);
          return s;
        },

        getMedPromptFns: function() { var fn = 'getTriggerFns'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
          var s = 'self.genMedPromptTriggerId = ' + self.genMedPromptTriggerId.toString() + ';'
                + 'self.replaceTokensForMedPrompt = ' + self.replaceTokensForMedPrompt.toString() + ';'
                + 'self.genDateFromTime = ' + self.genDateFromTime.toString() + ';'
            ; 
          // self.debug(fn + ' = ' + s, fn);
          return s;
        },

        getEMAPromptFns: function() { var fn = 'getTriggerFns'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
          var s = 'self.genEMAPromptTriggerId = ' + self.genEMAPromptTriggerId.toString() + ';'
                + 'self.replaceTokensForEMA = ' + self.replaceTokensForEMA.toString() + ';'
            ; 
          // self.debug(fn + ' = ' + s, fn);
          return s;
        },

        getWidgetFns: function() { var fn = 'getWidgetFns'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
          var s = 'self.replaceTokensForWidget = ' + self.replaceTokensForWidget.toString() + ';'
                + 'self.updateWidget = ' + self.updateWidget.toString() + ';'
            ;
            return s;
        },

        getAppCfgFns: function() { var fn = 'getAppCfgFns'; var self; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
          // ATTEMPT 1: trying to be elegant...
          // var s = 'self.appConfig = {};';
          // _.each(_.keys(self.appConfig), function(k) {
          //  s += 'self.appConfig.' + k + ' = ' + self.appConfig[k].toString() + ';'
          // });
          
          // ATTEMPT 2: can't get fns out of stringified objs without jsonfn, which we don't have, and can't access the 'this' obj at multiple levels deep, sooo....
          // Just throw everything in the root namespace of the execution context and move-on with life. *sigh*
          var s = ''
            + 'self.appConfigUpsert = ' + self.appConfigUpsert.toString() + ';'
            + 'self.appConfigSampleTrigger = ' + self.appConfigSampleTrigger.toString() + ';'
            + 'self.appConfigCompletionStates = ' + self.appConfigCompletionStates.toString() + ';'
            + 'self.appCfgGetTriggerState = ' + self.appCfgGetTriggerState.toString() + ';'
            ;
          // self.debug(fn + ' = ' + s, fn);
          return s;
        }
      },



      /**
       * Converts a function to a string, with parameters to the function listed in an array.
       * TODO: widget-mode does not work as successfully as non-widget mode does. Not currently sure what the quoting issue is that causes this. Would be good eventually to fix this.
       * @param  {[type]} fnPtr        [description]
       * @param  {[type]} fnParamArray [description]
       * @return {[type]}              [description]
       */
      //  // v1 - WORKS for non-widget.
      // convertFnToString: function(fnPtr, fnParamArray) { var fn = 'convertFnToString'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
      //  var p = self.isNullOrUndefined(fnParamArray) ? '' : self.getQuotedAndDelimitedStr(fnParamArray,',','\\\'');
      //  return '(' +  (fnPtr.toString().replace(/'/g, '\\\'')).replace(/(\r\n|\n|\r)/gm,'') + ')(' + p.replace(/(\r\n|\n|\r)/gm,'') + ');';
      // },

      convertFnToString: function(fnPtr, fnParamArray, isWidgetMode) { var fn = 'convertFnToString'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        var paramQuotStr = isWidgetMode ? '"' : '\\\'';

        var p = self.isNullOrUndefined(fnParamArray) 
          ? '' 
          : self.getQuotedAndDelimitedStr(
              fnParamArray,
              ',', 
              paramQuotStr
          );
                // + '(' + (isWidgetMode ? (p.replace(/"/gm, '\\"')).replace(/(\r\n|\n|\r)/gm, '') : p.replace(/(\r\n|\n|\r)/gm,'')) + ');'
        return (isWidgetMode

            ?   '(' + (fnPtr.toString().replace(/'/g, '\\\'')).replace(/(\r\n|\n|\r)/gm,'') + ')'
              + '(' + (p).replace(/(\r\n|\n|\r)/gm, '') + ');'

            :   '(' + (fnPtr.toString().replace(/'/g, '\\\'')).replace(/(\r\n|\n|\r)/gm,'') + ')'
              + '(' + p.replace(/(\r\n|\n|\r)/gm,'') + ');'
          )
        ;
      },


      /**
       * Returns a list of assessment types by their frequency.
       * @param  {[type]} schedulingFrequencyAsICal) {            var fn = "getEMATypeByPeriodicity"; if(!this.CURRENTLY_IN_TRIGGER [description]
       * @return {[type]}                            [description]
       */
      getEMATypesForSchedulingFrequencyAsICal: function(schedulingFrequencyAsICal) { var fn = "getEMATypeByPeriodicity"; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        self.debug('entered; schedulingFrequencyAsICal = ' + schedulingFrequencyAsICal, fn);
        self.getAppCfg();

        return _.filter(
            _.keys(self.appCfg.staticOrDefault.showNativeDialog.assessment.frequencyAsICal),
            function(k) {
              return self.appCfg.staticOrDefault.showNativeDialog.assessment.frequencyAsICal[k] == schedulingFrequencyAsICal;
            }
          );
      },


      /**
       * Determines whether a trigger is a weekly trigger, based on the ID. (Is wholly-dependent on the construction of the trigger ID! This is more efficient than fetching the trigger and inspecting a particular property on it.)
       * @param  {[type]}  triggerId [description]
       * @return {Boolean}           [description]
       */
      isWeeklyTrigger: function(triggerId) { var fn = "isWeeklyTrigger"; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        self.debug('entered; triggerId = ' + triggerId, fn);
        self.getAppCfg();

        var weeklyAssessmentTypes = self.getEMATypesForSchedulingFrequencyAsICal('WEEKLY');
        return _.any(weeklyAssessmentTypes, function(t) { return triggerId.indexOf(t) != -1; });
      },


      /**
       * Deletes all triggers except the PRNM trigger.
       * @return {[type]} [description]
       */
      clearAllNonPRNMTriggers: function() { var fn = "clearAllNonPRNMTriggers"; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        self.debug('entered', fn);
        var allTriggerIds = self.fetchTriggerIds();
        self.debug('allTriggerIds = ' + _.map(allTriggerIds, function(id) { return '' + id; }), fn);
        // delete all triggers, except...
        var triggersToDelete = _.filter(allTriggerIds, function(triggerId) {
          
          // the PRNM trigger (self)
          var isSelf              = triggerId == self.triggerIdPrefixes.self;
          // the weekly triggers, unless today is the day to generate them
          var isWeekly = self.isWeeklyTrigger(triggerId);
          var isDayToRun = self.isDayToRunWeeklyScheduling();

          // for a true result in this table, delete the trigger:
          //   SELF                   ==> false
          //   ~SELF ^ ~WEEKLY        ==> true
          //   ~SELF ^ WEEKLY ^ ~DAY  ==> false
          //   ~SELF ^ WEEKLY ^ DAY   ==> true
          var deleteTrigger = 
            (
                 (!isSelf && !isWeekly)
              || (!isSelf && isWeekly && isDayToRun)
            )
          ;

          self.debug('deleteTrigger (' + triggerId + ') = ' + deleteTrigger + ' given: ' + [isSelf,isWeekly,isDayToRun], fn);
          return deleteTrigger;
        });
        self.debug('triggersToDelete = ' + _.map(triggersToDelete, function(id) { return '' + id; }), fn);

        // TODO: Looks like we need to *not* delete 'unidentified-trigger' here to prevent the PRNM trigger from being deleted. But why? Why is PRNM 'unidentified' at this point?
        
        self.warn('Deleting all triggers except: ' + self.triggerIdPrefixes.self + '. triggersToDelete = ' + self.getQuotedAndDelimitedStr(triggersToDelete, ',', '"'), fn);
        _.each(triggersToDelete, function(triggerId) {
          self.debug('Deleting trigger: ' + triggerId, fn);
          self.deleteTrigger(triggerId);
        });
        self.debug('exiting', fn);
      },


      /**
       * Gets the set of MedPrompt datetimes created by another function.
       * @param  {[type]} ) {            var fn = "getAllMedPromptDateTimes"; if(!this.CURRENTLY_IN_TRIGGER [description]
       * @return {[type]}   [description]
       */
      getAllMedPromptDateTimes: function(createdMedPromptTriggerIds) { var fn = "getAllMedPromptDateTimes"; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        self.debug('createdMedPromptTriggerIds = ' + createdMedPromptTriggerIds, fn);
        var medPromptTriggers = _.map(createdMedPromptTriggerIds, function(triggerId) { self.debug('triggerId = ' + triggerId, fn); return self.fetchTrigger(triggerId); });
        self.debug('medPromptTriggers = ' + medPromptTriggers, fn);
        var medPromptTriggerDateTimes = _.map(medPromptTriggers, function(t) { return self.iCalToDate(t.datetime_start); });
        self.debug('medPromptTriggerDateTimes = ' + medPromptTriggerDateTimes, fn);
        return medPromptTriggerDateTimes;
      },


      /**
       * ENTRY-POINT to the rest of the application. (For flow-control clarity, not language-level requirement.)
       * @param  {[type]} args [decsription]
       * @return {[type]}      [description]
       */
      main: function(args) { var fn = 'main'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
        self.log('entered: args: ' + args, fn);
        self.log('execution context: ' + self.execCtx, fn);

        // create the app config repo in PR, if not already created.
        self.log('Creating the appCfg...', fn);
        self.appConfigCreate(self.envConsts.appCfg.namespace, self.envConsts.appCfg.key);

        // updating PR configuration values
        self.log('Updating Purple Robot configuration...', fn);
        self.debug('self.appCfg = ' + self.appCfg, fn);
        self.debug('JSON.stringify(self.appCfg) = ' + JSON.stringify(self.appCfg), fn);
        self.debug('self.appCfg.staticOrDefault.PurpleRobotConfigurationUpdateConfig = ' + self.appCfg.staticOrDefault.PurpleRobotConfigurationUpdateConfig, fn);
        self.updatePurpleRobotConfiguration(self.appCfg.staticOrDefault.PurpleRobotConfigurationUpdateConfig);

        // reset the available set of triggers
        self.log('Clearing all non-PRNM triggers...', fn);
        self.clearAllNonPRNMTriggers();
  
        // set MedPrompt triggers
        self.log('Setting all MedPrompts...', fn);
        var createdMedPromptTriggerIds = self.setAllMedPrompts();

        // now that the MedPrompt triggers are created, get the created triggers, and get their times, so we can schedule random EMA prompts around them, and widget-timing.
        self.log('Getting all MedPropmt datetimes...', fn);
        var medPromptTriggerDateTimes = self.getAllMedPromptDateTimes(createdMedPromptTriggerIds);

        // sort the MP trigger datetime array
        medPromptTriggerDateTimes.sort(function(a,b){ return a-b; });

        // set assessment / EMA triggers
        self.log('Setting all EMA prompts...', fn);
        self.setAllEMAPrompts(medPromptTriggerDateTimes);

        // update the widget
        self.log('Setting the widget...', fn);
        self.setWidget(self.envConsts.appCfg.namespace, medPromptTriggerDateTimes);

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
