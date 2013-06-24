// ***** UMB Medprompt trigger *****
// Author: evan.story@northwestern.edu
// Created: 20130409


/**
 * Detects the current execution context: 
 * 	0 = Purple Robot
 * 	1 = Node.js
 * 	2 = Browser.
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
			,MM = this.addMonths(1).getMonth()
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

	  exports.test = function(){
      return 'hello world from exports';
    };


	  // ctor
	  // var ctor = function(d) {
	  var ctor = function(d) { var fn = 'prnm:ctor';

	    ctor.prototype.data = d;
	    self = this;

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
				"self": "Purple Robot Notification Manager",
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
						self.debug = function(s, fn) { if(self.appCfg.logLevel >= 4) { PurpleRobot.log('[DBG]' + (!self.isNullOrUndefined(fn) ? '[' + fn + '] ' : ' ') + s); } };
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
						self.debug = function(s, fn) { if(self.appCfg.logLevel >= 4) { console.log('[DBG]' + (!self.isNullOrUndefined(fn) ? '[' + fn + '] ' : ' ') + s); } };
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
							self.debug('triggerArray = ' + triggerArray, fn);
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
						self.debug = function(s, fn) { if(self.appCfg.logLevel >= 4) { console.log('[DBG]' + (!self.isNullOrUndefined(fn) ? '[' + fn + '] ' : ' ') + s); } };
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
			isNullOrUndefined: function(v) {
				return (v == null || v == undefined || v == 'null');
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
				self.debug(self.getQuotedAndDelimitedStr([timeStr,th,tm,ts,date],','),fn);
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
				self.debug('iCalStr = ' + iCalStr + '; d = ' + d, fn);
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
			 * Determines whether the specified time is in a period of time scheduled to be unavailable, as defined in the user config.
			 * @param  {[type]} userCfg  [description]
			 * @param  {[type]} dateTime [description]
			 * @return {[type]}          [description]
			 */
			isUserAvailable: function(userCfg, dateTime) { var fn = 'isUserAvailable';
				var rslt = false;

				// var w = userCfg.promptBehavior.wakeSleepTimes.daily.wakeTime.split(':');
				// var wh = parseInt(w[0], 10),
				// 		wm = parseInt(w[1], 10),
				// 		ws = parseInt(w[2], 10);
				// var wdate = Date.today().set({ hour: wh, minute: wm, second: ws});

				// var s = userCfg.promptBehavior.wakeSleepTimes.daily.sleepTime.split(':');
				// var sh = parseInt(s[0], 10),
				// 		sm = parseInt(s[1], 10),
				// 		ss = parseInt(s[2], 10);
				// // add -1 sec to force the .between function to evaluate the sleep-time as exclusive, rather than inclusive.
				// var sdate = Date.today()
				// 	.set({ hour: sh, minute: sm, second: ss})
				// 	.add({seconds: -1});

				var wdate = ctor.prototype.genDateFromTime(userCfg.promptBehavior.wakeSleepTimes.daily.wakeTime);
				var sdate = (ctor.prototype.genDateFromTime(userCfg.promptBehavior.wakeSleepTimes.daily.sleepTime))
					.add({seconds: -1});

				// console.log('wdate',wdate);
				// console.log('sdate',sdate);
				// console.log('dateTime',dateTime);
				rslt = dateTime.between(wdate,sdate);

				return rslt;
			},


			/**
			 * Returns all the dose times in a user config.
			 * @return {[type]} [description]
			 */
			getAllDoseTimes: function() { var fn = 'getAllDoseTimes'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
				self.debug('entered',fn);
				self.getUserCfg();
				// self.debug('self.userCfg = ' + JSON.stringify(self.userCfg),fn);
				// self.debug('_.keys(self.userCfg) = ' + _.keys(self.userCfg),fn);
				// self.debug('self.userCfg.doses = ' + self.userCfg.doses,fn);
				var allDoseTimes = _.pluck(self.userCfg.doses, 'time');
				self.debug('allDoseTimes = ' + allDoseTimes,fn);

				self.debug('exiting',fn);
				return allDoseTimes;
			},


			/**
			 * Determines whether the specified time is one at which the user must take a dose of a medication.
			 * Returns the medication if it is time, else null.
			 * @param  {[type]}  allDoseTimes       Array of dose times.
			 * @param  {[type]}  dateTime           Current time.
			 * @param  {[type]}  dateJsCfgObjForFuzzyMatch -Non-null = date.js object definining an offset of time, starting with the specified dose time, to allow for a true response.
			 *                                      Enables inexact time-matching (useful e.g. for non-deterministic environments), s.t. e.g. a dose time of '9:00:00' may, for a range of 1 minute, return a true value for any time between 9:00:00 and 9:00:59, inclusive.
			 *                                      -null = Indicates exact matching is desired.
			 * @return {Boolean}                    [description]
			 */
			isTimeForDose: function(allDoseTimes, dateTime, dateJsCfgObjForFuzzyMatch) { var fn = 'isTimeForDose';
				var currDtStr = dateTime.toString('hh:mm:ss');
				// ctor.prototype.debug('allDoseTimes = ' + allDoseTimes, fn);
				// ctor.prototype.debug('currDtStr = ' + currDtStr, fn);
				ctor.prototype.debug((dateJsCfgObjForFuzzyMatch != null ? 'fuzzy' : 'exact') + ' match: dateJsCfgObjForFuzzyMatch = ' + JSON.stringify(dateJsCfgObjForFuzzyMatch),fn);
				return dateJsCfgObjForFuzzyMatch != null
					? _.any(allDoseTimes, function(doseTime) {
							var doseDateTime = ctor.prototype.genDateFromTime(doseTime);
							var doseMaxFuzzyEndTime = doseDateTime.clone().add(dateJsCfgObjForFuzzyMatch);

							// var today = Date.today();
							// ctor.prototype.debug('_.isDate(today) = ' + _.isDate(today) + '; today = ' + today + '; _.keys(today) = ' + _.keys(today),fn);
							// ctor.prototype.debug('today.isAfter(Date.tomorrow()) = ' + today.isAfter(new Date().add(1).day()),fn);
							// ctor.prototype.debug('_.isDate(dateTime) = ' + _.isDate(dateTime) + '; dateTime = ' + dateTime + '; _.keys(dateTime) = ' + _.keys(dateTime),fn);
							// ctor.prototype.debug('_.isDate(doseDateTime) = ' + _.isDate(doseDateTime) + '; doseDateTime = ' + doseDateTime + '; _.keys(doseDateTime) = ' + _.keys(doseDateTime),fn);
							// ctor.prototype.debug('_.isDate(doseMaxFuzzyEndTime) = ' + _.isDate(doseMaxFuzzyEndTime) + '; doseMaxFuzzyEndTime = ' + doseMaxFuzzyEndTime + '; _.keys(doseMaxFuzzyEndTime) = ' + _.keys(doseMaxFuzzyEndTime),fn);
							var r = dateTime.between(doseDateTime, doseMaxFuzzyEndTime);
							// var r = 		dateTime.isAfter(doseDateTime) 
							// 				&& 	dateTime.isBefore(doseMaxFuzzyEndTime);
							// ctor.prototype.debug('r = ' + r,fn);
							return r;
						} )
					: _.contains(allDoseTimes, currDtStr);
			},


			/**
			 * Gets a Date object representing a randomly-selected time within a range. Useful for randomizing when a prompt must load.
			 * @return {[type]} [description]
			 */
			getRandomDateTimeWithinRange: function(startDateTime, endDateTime) { var fn = 'getRandomDateTimeWithinRange'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
				// apparently doing a date-diff in terms of milliseconds is way-simpler than I thought: http://stackoverflow.com/questions/327429/whats-the-best-way-to-calculate-date-difference-in-javascript
				var msInTimeSpan = endDateTime - startDateTime;
				// randomly-select an offset between 0 and msInTimeSpan, inclusive.
				var randVal = Math.random();
				var randOffsetInMs = (Math.floor(randVal * msInTimeSpan) + 1);
				var randDateTime = startDateTime.clone().addMilliseconds(randOffsetInMs);
				self.debug('randVal = ' + randVal + '; randDateTime = ' + randDateTime,fn);
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
							self.updateTrigger(name, triggerObj);

							// store trigger history
							self.getAppCfg();
							var trgWithState = self.appCfgGetTriggerState(fn, (self.appConfigCompletionStates()).NotStarted, null, triggerObj);
							self.appCfg.triggerState.push(trgWithState);
							self.debug('Saving trigger state = ' + JSON.stringify(trgWithState), fn);
							self.appConfigUpsert(self.envConsts.appCfg.namespace, self.envConsts.appCfg.key, self.appCfg);
						
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
						// 'onLoad': {
						// 	'actionItems': [
						// 		{
						// 			'name': 'example action item for use & reference in PhoneGap app',
						// 			'url': 'your-router-path-here',
						// 			'triggerId': 'MedPrompt: medA at 09:00:00'
						// 		}
						// 	]
						// },
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
				 *	* purpleWarehouseSendMessageQueue: A queue of Purple Robot Importer messages for delivery to Purple Warehouse. See PR Importer unit-tests for example messages.
				 *	* triggerState: Contains a history of all triggers for the app.
				 * 
				 * Trigger completionState values:
				 * 		NotStarted 						= not started
				 * 		PromptedNoResponse 		= prompted, user provided no response yet (ever?)
				 * 		PromptedPressedButton = prompted, user pressed one of the prompt's buttons
				 * 		PromptedEnteredApp 		= prompted, user successfully entered PhoneGap app
				 * 		PromptedInProgress 		= prompted, user is in-progress (user has completed >= 1 step of the path-to-completion AND has not completed it)
				 * 		PromptedCompleted 		= prompted, user completed the trigger's lifecycle
				 * 		CanceledByTrigger			= trigger was canceled by another trigger
				 * 		CanceledByApp					= trigger was canceled by the PhoneGap app (e.g. )
				 * 
				 * Intended usage:
				 * 		On PRNM first-load,
				 *   		If appConfig does not exist, then run appConfigCreate.
				 * 		On trigger-create,
				 * 			Create a trigger-state object in the triggerState array. This will include the trigger definition (so that after the trigger runs, even if deleted, we have a copy available to us).
				 * 			Set the trigger-state object's completionState value to NotStarted.
				 * 		On trigger-prompt,
				 *   		Set the trigger-state object's completionState value to PromptedNoResponse.
				 * 		On prompt-redirects-to-PhoneGap (typically, 'Yes/OK' button-press),
				 * 			PhoneGap app navigates (using its router) to the location specified by dstUrl.
				 *   		Set the trigger-state object's completionState value to PromptedPressedButton.
				 *   	On PhoneGap-app-loads-destination-page,
				 *   		Set the trigger-state object's completionState value to PromptedEnteredApp.
				 *   	On PhoneGap-app-detects-user-in-progress,
				 *   		Set the trigger-state object's completionState value to PromptedInProgress.
				 * 		On PhoneGap-app-completes-prompt,
				 * 			trigger-state object's completionState value to PromptedCompleted.
				 * 			Set the trigger's completedOn = current date.
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

						// ensure triggerState exists
						if(self.isNullOrUndefined(appCfg.triggerState)) {
				      self.log('Updating and persisting appCfg for: ("' + namespace + '", "' + keyInPR + '"); reason: no triggerState array.');
							// clone the appCfg, update, then persist: http://heyjavascript.com/4-creative-ways-to-clone-objects/
							appCfg.triggerState = [];
							self.appConfigUpsert(namespace, keyInPR, appCfg);
				      // self.persistEncryptedString(namespace, keyInPR, JSON.stringify(appCfg));
				      self.appCfg = appCfg;
				      // self.debug('self.appCfg = ' + JSON.stringify(self.appCfg), fn);
				      var storedAppCfg = self.fetchEncryptedString(namespace, keyInPR);
				      self.debug('storedAppCfg = ' + storedAppCfg, fn);
						}
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
					self.persistEncryptedString(namespace, keyInPR, JSON.stringify(appConfigObj));
					self.debug('UPSERT(' + [namespace,keyInPR,appConfigObj] + ')');
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
				// 		%N = the assessment name
				// 		%T = the assessment time
				// 		%APOS = an apostrpohe char ("'")
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


			genEMAPromptTriggerId: function(schedObj) { var fn = 'genEMAPromptTriggerId'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
				self.debug('entered',fn);
				var id = self.replaceTokensForEMA((self.getAppCfg()).staticOrDefault.showNativeDialog.assessment.title, schedObj);
				return id;
			},

			
			getOpenTimeRanges: function(medPromptTriggerDateTimes, rangeBoundsBufferMinutes) { var fn = 'getOpenTimeRanges'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
				self.debug('entered; medPromptTriggerDateTimes = ' + medPromptTriggerDateTimes + '; rangeBoundsBufferMinutes = ' + rangeBoundsBufferMinutes,fn);

				var openTimeRanges = [];
				for(var i = 0; i < medPromptTriggerDateTimes.length; i++) {
					if(i < medPromptTriggerDateTimes.length - 1) {
						// compute the start and end time boundaries.
						var startTime = medPromptTriggerDateTimes[i].clone().addMinutes(rangeBoundsBufferMinutes);
						var endTime = medPromptTriggerDateTimes[i+1].clone().addMinutes(-(rangeBoundsBufferMinutes));
						// if a valid time range is found, then include it for return
						if(endTime > startTime) {
							var range = {
								"start": startTime,
								"end": endTime
							};
							openTimeRanges.push(range);							
						}
					}
				}
				self.debug('exiting; openTimeRanges = ' + JSON.stringify(openTimeRanges), fn);
				return openTimeRanges;
			},


			getRandomDateTimeAcrossAllOpenRanges: function(openTimeRanges) { var fn = 'getRandomDateTimeAcrossAllOpenRanges'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
				self.debug('entered; openTimeRanges = ' + JSON.stringify(openTimeRanges), fn);
				var randomlySelectedDateTime = null;

				if(openTimeRanges.length > 0) {
					var randIdx = Math.floor((Math.random()*openTimeRanges.length));
					// self.debug('randIdx = ' + randIdx, fn);
					randomlySelectedDateTime = self.getRandomDateTimeWithinRange(
						openTimeRanges[randIdx].start,
						openTimeRanges[randIdx].end
						);
				}

				self.debug('exiting; randomlySelectedDateTime = ' + randomlySelectedDateTime, fn);
				return randomlySelectedDateTime;
			},


			/**
			 * Sets all the EMA prompts (assessment prompts) for the following 24 hours.
			 * @param  {[type]} ) {            var fn = 'setAllEMAPrompts'; if(!this.CURRENTLY_IN_TRIGGER [description]
			 * @return {[type]}   [description]
			 */
			// setAllEMAPrompts: function(createdMedPromptTriggerIds) { var fn = 'setAllEMAPrompts'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
			// 	self.debug('entered; createdMedPromptTriggerIds = ' + createdMedPromptTriggerIds,fn);
			setAllEMAPrompts: function(medPromptTriggerDateTimes) { var fn = 'setAllEMAPrompts'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
				self.debug('entered; medPromptTriggerDateTimes = ' + medPromptTriggerDateTimes,fn);
				self.getUserCfg();
				self.getAppCfg();

				// // get the created triggers, and get their times, so we can schedule random EMA prompts around them
				// var medPromptTriggers = _.map(createdMedPromptTriggerIds, function(triggerId) { self.debug('triggerId = ' + triggerId, fn); return self.fetchTrigger(triggerId); });
				// self.debug('medPromptTriggers = ' + medPromptTriggers, fn);
				// var medPromptTriggerDateTimes = _.map(medPromptTriggers, function(t) { return self.iCalToDate(t.datetime_start); });
				// self.debug('medPromptTriggerDateTimes = ' + medPromptTriggerDateTimes, fn);


				// get the set of EMAs from-which to randomly-select and randomly schedule
				var emaTransitionObjs = _.keys(self.appCfg.staticOrDefault.transition.onEMAYes);
				
				// get available open time ranges
				var openTimeRanges = self.getOpenTimeRanges(medPromptTriggerDateTimes, 30);

				// generate the time ranges between which EMAs may be prompted
				var emaTransitionAndScheduleObjs = _.map(emaTransitionObjs, function(key) {
					var survSched = {
						'name': key,
						'time': self.getRandomDateTimeAcrossAllOpenRanges(openTimeRanges),
						'parentId': null,
						'childId': null,
						'triggerId': null
					};
					survSched.id = survSched.name + survSched.time;
					self.debug('survSched = ' + JSON.stringify(survSched),fn);
					return survSched;
				});
				self.debug('emaTransitionAndScheduleObjs = ' + JSON.stringify(emaTransitionAndScheduleObjs));

				// Implementing the logic of:
				// 		If prompt not answered:
				// 			EMAs will wait 30 mins to prompt only 1 time.
				// 			If after second prompt for same EMA the EMA is not answered, do not prompt a third time.
				// Let's do this by simply creating a second trigger for each EMA trigger. This second trigger will be deleted on user button-press; else, it will execute.
				emaTransitionAndScheduleObjs = emaTransitionAndScheduleObjs.concat(
					_.map(emaTransitionAndScheduleObjs, function(o) {
						// shallow-copy the object; this is OK because it's only 1-level deep anyway.
						var sched2 = _.clone(o);
						sched2.time 			= sched2.time.clone().addMinutes(30);
						sched2.parentId 	= o.id;
						sched2.id 				= sched2.name + sched2.time;
						sched2.triggerId 	= null;
						o.childId 				= sched2.id;
						return sched2;
					})
				);
				self.debug('*** emaTransitionAndScheduleObjs.length = ' + emaTransitionAndScheduleObjs.length, fn);
				self.debug('*** JSON.stringify(emaTransitionAndScheduleObjs) = ' + JSON.stringify(emaTransitionAndScheduleObjs), fn);

				// reverse the array so we work from leaf-nodes up -- this makes getting the triggerId of children much simpler!
				emaTransitionAndScheduleObjs.reverse();

				// set EMA triggers
				_.each(emaTransitionAndScheduleObjs, function(schedObj) {
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
							// ,untilDateTime = sdt.clone()
							,untilDateTime = (new Date())
								// .addHours(1)
								.addDays(1)
								// .set({hour:0,minute:0,second:0})
							;
					var repeatStr = 'FREQ=DAILY;INTERVAL=1;UNTIL=' + untilDateTime.toICal();
					self.debug('triggerId = ' + triggerId, fn);

					// map the schedule ID to the trigger ID
					schedObj.triggerId = triggerId;
					// ...in parent...
					if(schedObj.childId == null) {
						var parent = _.find(emaTransitionAndScheduleObjs, function(o) { return o.id == schedObj.parentId; });
						parent.childTriggerId = triggerId;
					}

					// var p = self.getQuotedAndDelimitedStr([type,name,
					var p = self.getQuotedAndDelimitedStr([
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
					actionScriptText = 'PurpleRobot.showNativeDialog(' + p + ');';
					
					self.debug('actionScriptText = ' + actionScriptText,fn);
					var name = triggerId;
					self.setDateTimeTrigger(triggerId, type, name, actionScriptText, startDateTime, endDateTime, repeatStr);

				});

				self.debug('exiting',fn);
			},


			/*** MedPrompt ***/

			replaceTokensForMedPrompt: function(inStr, dose) { var fn = 'replaceTokensForMedPrompt'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
				var outStr = inStr;
				// self.debug('outStr = ' + outStr + '; dose = ' + JSON.stringify(dose), fn);
				// provide some nice tokenizing string-replacement for ID-setting
				// 		%M = the dose medication
				// 		%T = the dose time
				// 		%S = the dose strength
				// 		%U = the dispensation unit
				_.each([
					 {'%M': dose.medication}
					,{'%T': dose.time}
					,{'%S': dose.strength}
					,{'%U': dose.dispensationUnit}
					], function(replacementPair) {
						var key = _.keys(replacementPair)[0];
						outStr = outStr.replace(key, replacementPair[key]);
				});
				// self.debug('exiting; outStr = ' + outStr,fn);
				return outStr;
			},


			genMedPromptTriggerId: function(dose) { var fn = 'genMedPromptTriggerId'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
				self.debug('entered',fn);
				var id = self.replaceTokensForMedPrompt((self.getAppCfg()).staticOrDefault.showNativeDialog.medPrompt.title, dose);
				return id;
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
					self.debug('d = ' + doseStr, fn);
					
					var sdt = self.genDateFromTime(d.time);
					self.debug('sdt = ' + sdt, fn);
					var  type = 'datetime'
							// ,name = self.triggerIdPrefixes.medPrompt + d.medication + ' at ' + d.time
							,triggerId = self.genMedPromptTriggerId(d)
							,actionScriptText = null
							,startDateTime = sdt
							,endDateTime = sdt.clone().addMinutes(1)
							// ,untilDateTime = sdt.clone()
							,untilDateTime = (new Date())
								// .addHours(1)
								.addDays(1)
								// .set({hour:0,minute:0,second:0})
							;
					self.debug('triggerId = ' + triggerId, fn);

					var repeatStr = 'FREQ=DAILY;INTERVAL=1;UNTIL=' + untilDateTime.toICal();

					// var p = self.getQuotedAndDelimitedStr([type,name,'Yes','No'
					var p = self.getQuotedAndDelimitedStr([
						 self.replaceTokensForMedPrompt(self.appCfg.staticOrDefault.showNativeDialog.medPrompt.title, d)
						,self.replaceTokensForMedPrompt(self.appCfg.staticOrDefault.showNativeDialog.medPrompt.message, d)
						,'Yes'
						,'No'
						// v3 - WORKS!!!!!
						// In the parameters to the specified function (e.g. the parameters to onMedPromptYes are specified in the array passed as the second param to convertFnToString):
						// 
						// The idea here is to mock the 'self' object using the specified function's current context.
						// Then, specify all the function dependencies in-order in the array string here.
						// Then, functions that live in PRNM can access other functions that live in PRNM -- enabling code-reuse.
						// Then, append the current dose as a string.
						// All of this gets eval'd in the trigger action, including the dose string (making it a dose obj after eval) and ready for use in the trigger.
						,self.convertFnToString(self.actions.onMedPromptYes, [
								self.actionFns.getCommonFnSetForActions()
							+ self.actionFns.getTriggerFns() 
							+ self.actionFns.getMedPromptFns()
							+ self.actionFns.getAppCfgFns()
							+ 'var dose = ' + doseStr + ';'
							+ 'var triggerId = "' + triggerId + '";'
							])
						,self.convertFnToString(self.actions.onMedPromptNo, [
								self.actionFns.getCommonFnSetForActions() 
							+ self.actionFns.getTriggerFns()
							+ self.actionFns.getMedPromptFns()
							+ self.actionFns.getAppCfgFns()
							+ 'var dose = ' + doseStr + ';'
							+ 'var triggerId = "' + triggerId + '";'
							])
						], ',', "'");

					// the generated action to execute in a trigger
					// biz-logic (from "Heart2HAART (H2H) Logic Model Explanation: 01/14/2013"): "When the dose is due, the phone will vibrate and alert to remind the user to take their dose. "
					actionScriptText = 
							'PurpleRobot.vibrate("'+ self.appCfg.staticOrDefault.vibratePattern +'");'
						+ 'PurpleRobot.showNativeDialog(' + p + ');';
					
					// self.debug('actionScriptText = ' + actionScriptText,fn);
					var name = triggerId;
					self.setDateTimeTrigger(triggerId, type, name, actionScriptText, startDateTime, endDateTime, repeatStr);

					self.debug('Pushing triggerId = ' + name, fn);
					createdTriggerIds.push(name);
				});

				self.debug('exiting',fn);
				return createdTriggerIds;
			},


			/*** widget ***/

			replaceTokensForWidget: function(inStr, nextDoseTime) { var fn = 'replaceTokensForWidget'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
				var outStr = inStr;
				// self.debug('outStr = ' + outStr, fn);
				// provide some nice tokenizing string-replacement
				// 		%T = the next dose time
				_.each([
					{'%T': nextDoseTime.toString('HH:mm:ss') }
					], function(replacementPair) {
						var key = _.keys(replacementPair)[0];
						outStr = outStr.replace(key, replacementPair[key]);
				});
				// self.debug('exiting; outStr = ' + outStr,fn);
				return outStr;
			},


			/**
			 * Sets a widget with a medication-adherence message dependent on a set of medication-consumption ("dosing") times and a period of time prior to each at which the widget's message must change.
			 * @param  {[type]} widgetId                   [description]
			 * @param  {[type]} medPromptTriggerDateTimes) {            var fn = "setWidget"; if(!this.CURRENTLY_IN_TRIGGER [description]
			 * @return {[type]}                            [description]
			 */
			setWidget: function(widgetId, medPromptTriggerDateTimes) { var fn = "setWidget"; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
				self.debug('entered; medPromptTriggerDateTimes = ' + medPromptTriggerDateTimes,fn);
				self.getAppCfg();

				// determine next dose time
				var nextDoseDateTimes = _.sortBy(medPromptTriggerDateTimes, function(dt) { return dt; });
				if(nextDoseDateTimes.length == 0) {
					self.error('No next MedPrompt time found!', fn);
					return;
				}
				var nextDoseDateTime = nextDoseDateTimes[0];
				// self.debug('nextDoseDateTime = ' + nextDoseDateTime, fn);
				var msg = nextDoseDateTime > ((new Date()).addMinutes(parseInt(self.appCfg.staticOrDefault.updateWidget.minutesUntilDoseReminder)))
					? self.appCfg.staticOrDefault.updateWidget.messageState.default
					: self.appCfg.staticOrDefault.updateWidget.messageState.reminder;
				// self.debug('msg = ' + msg, fn);

				// Step 1: set the widget values and transition-state.
				var updateWidgetParams = {
					'identifier': widgetId,
					'title': self.appCfg.staticOrDefault.updateWidget.title,
					'message': self.replaceTokensForWidget(msg, nextDoseDateTime),
					'action': self.convertFnToString(
						self.actions.onWidgetPress, 
						[ 'var url = \'' + (self.getAppCfg()).staticOrDefault.transition.onWidgetPress + '\';' ],
						true
					)
				};
				
				self.debug('updateWidgetParams = ' + JSON.stringify(updateWidgetParams), fn);
				// self.debug('updateWidgetParams.action = ' + updateWidgetParams.action, fn);
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
						+ 'var appCfgStr = self.fetchEncryptedString("' + self.envConsts.appCfg.namespace + '", "' + self.envConsts.appCfg.key + '");'
						+ 'self.appCfg = JSON.parse(appCfgStr);'

						+ 'self.loadLibrary = ' + self.loadLibrary.toString() + ';'
						// + 'self.launchUrl = ' + self.launchUrl.toString() + ';'
						+ 'self.launchApplication = ' + self.launchApplication.toString() + ';'

						+ 'var _ = self.loadLibrary("underscore.js", "_");'

						// This seems to impose a noticeable performance penalty on prompt-button-press. Refactor?
						+ 'self.loadLibrary("date.js", null);'
						+ 'Date.prototype.toICal = ' + Date.prototype.toICal.toString() + ';'
						+ 'self.iCalToDate = ' + self.iCalToDate.toString() + ';'
						;
					self.debug(fn + ' = ' + s, fn);
					return s;
				},

				/**
				 * Enables easy userCfg access in actions.
				 * @return {[type]} [description]
				 */
				getUserCfg: function() { var fn = 'getUserCfg'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
					var s = 'var userCfgStr = self.fetchEncryptedString("' + self.envConsts.userCfg.namespace + '", "' + self.envConsts.userCfg.key + '");'
								+	'self.userCfg = JSON.parse(userCfgStr);'
					;
					// self.debug(fn + ' = ' + s, fn);
					return s;
				},

				getTriggerFns: function() { var fn = 'getTriggerFns'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
					var s = 'self.fetchTriggerIds = ' + self.fetchTriggerIds.toString() + ';'
								+	'self.fetchTrigger = ' + self.fetchTrigger.toString() + ';'
								+	'self.deleteTrigger = ' + self.deleteTrigger.toString() + ';'
					;
					// self.debug(fn + ' = ' + s, fn);
					return s;
				},

				getMedPromptFns: function() { var fn = 'getTriggerFns'; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
					var s = 'self.genMedPromptTriggerId = ' + self.genMedPromptTriggerId.toString() + ';'
								+ 'self.replaceTokensForMedPrompt = ' + self.replaceTokensForMedPrompt.toString() + ';'
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

				getAppCfgFns: function() { var fn = 'getAppCfgFns'; var self; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
					// ATTEMPT 1: trying to be elegant...
					// var s = 'self.appConfig = {};';
					// _.each(_.keys(self.appConfig), function(k) {
					// 	s += 'self.appConfig.' + k + ' = ' + self.appConfig[k].toString() + ';'
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
			// 	var p = self.isNullOrUndefined(fnParamArray) ? '' : self.getQuotedAndDelimitedStr(fnParamArray,',','\\\'');
			// 	return '(' +  (fnPtr.toString().replace(/'/g, '\\\'')).replace(/(\r\n|\n|\r)/gm,'') + ')(' + p.replace(/(\r\n|\n|\r)/gm,'') + ');';
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

						?	  '(' + (fnPtr.toString().replace(/'/g, '\\\'')).replace(/(\r\n|\n|\r)/gm,'') + ')'
							//.replace(/"/gm, '\\\'')
							+ '(' + (p).replace(/(\r\n|\n|\r)/gm, '') + ');'

						:	  '(' + (fnPtr.toString().replace(/'/g, '\\\'')).replace(/(\r\n|\n|\r)/gm,'') + ')'
							+ '(' + p.replace(/(\r\n|\n|\r)/gm,'') + ');'
					)
				;
			},


			/**
			 * Deletes all triggers except the PRNM trigger.
			 * @return {[type]} [description]
			 */
			clearAllNonPRNMTriggers: function() { var fn = "clearAllNonPRNMTriggers"; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
				var triggersToDelete = _.filter(self.fetchTriggerIds(), function(triggerId) { return (triggerId != self.triggerIdPrefixes.self);});
				self.warn('Deleting all triggers except: ' + self.triggerIdPrefixes.self + '. Triggers = ' + triggersToDelete, fn);
				_.each(triggersToDelete, function(triggerId) {
					self.debug('Deleting trigger: ' + triggerId, fn);
					self.deleteTrigger(triggerId);
				});
			},


			/**
			 * Gets the set of MedPrompt datetimes created by another function.
			 * @param  {[type]} ) {            var fn = "getAllMedPromptDateTimes"; if(!this.CURRENTLY_IN_TRIGGER [description]
			 * @return {[type]}   [description]
			 */
			getAllMedPromptDateTimes: function(createdMedPromptTriggerIds) { var fn = "getAllMedPromptDateTimes"; if(!this.CURRENTLY_IN_TRIGGER) { self = ctor.prototype; }
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

				// reset the available set of triggers
				self.clearAllNonPRNMTriggers();
	
				// UNCOMMENT WHEN WIDGET WORK IS DONE!
				// create the app config repo in PR, if not already created.
				self.appConfigCreate(self.envConsts.appCfg.namespace, self.envConsts.appCfg.key);

				// // set MedPrompt triggers
				var createdMedPromptTriggerIds = self.setAllMedPrompts();

				// now that the MedPrompt triggers are created, get the created triggers, and get their times, so we can schedule random EMA prompts around them, and widget-timing.
				var medPromptTriggerDateTimes = self.getAllMedPromptDateTimes(createdMedPromptTriggerIds);

				// // set assessment / EMA triggers
				self.setAllEMAPrompts(medPromptTriggerDateTimes);

				// update the widget
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
