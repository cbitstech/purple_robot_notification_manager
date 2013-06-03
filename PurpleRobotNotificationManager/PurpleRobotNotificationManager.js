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

			// FNGROUP: biz-logic
			getUserCfg: null,
			actions: null,

			// env-specific consts passed-in from the client app
			envConsts: null,
			userCfg: null,
			execCtx: null,


			/**
			 * Sets the functions to use given an environment parameter.
			 * Enables execution of same-named functions in different environments, which may in-turn carry the semantic of having a different purpose.
			 * @param {[type]} env [description]
			 */
			setFunctionsAndLibraryRefsForEnv: function(env) { var fn = 'setFunctionsAndLibraryRefsForEnv', self = ctor.prototype;
				self.envConsts = env;

				// switch(self.envConsts.selected) {
				switch(self.execCtx) {
					case 0:
						// set consts
						// self.envConsts.userCfgKey = 'H2H-userCfg';
						// self.envConsts.userCfgKey = env.userCfgKey;

						// // set lib refs
						// PurpleRobot.loadLibrary('underscore.js');
						// PurpleRobot.loadLibrary('date.js');
						// // PurpleRobot.loadLibrary('time.js');
						
						// * set function ptrs *
						// PR fns
						self.debug = function(s, fn) { PurpleRobot.log('[DBG]' + (!self.isNullOrUndefined(fn) ? '[' + fn + '] ' : ' ') + s); };
						self.log = function(s, fn) { PurpleRobot.log('[INF]' + (!self.isNullOrUndefined(fn) ? '[' + fn + '] ' : ' ') + s); };
						self.warn = function(s, fn) { PurpleRobot.log('[WRN]' + (!self.isNullOrUndefined(fn) ? '[' + fn + '] ' : ' ') + s); };
						self.error = function(s, fn) { PurpleRobot.log('[ERR]' + (!self.isNullOrUndefined(fn) ? '[' + fn + '] ' : ' ') + s); };
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

						// support fns
						/**
						 * PR-case: assign the namespace and key values to the userCfgFetchParamsObj.namespace and userCfgFetchParamsObj.key values, respectively, and pass the userCfgFetchParamsObj to this function.
						 * @param  {[type]} userCfgFetchParamsObj)    {            return self.fetchEncryptedString(userCfgFetchParamsObj.namespace [description]
						 * @param  {[type]} userCfgFetchParamsObj.key [description]
						 * @return {[type]}                           [description]
						 */
						self.getUserCfg = function() { var fn = 'getUserCfg', self = ctor.prototype; 
							self.debug('entered',fn);
							if(self.userCfg==null) { 
								self.debug('fetching userCfg on first call...', fn);
								self.userCfg = JSON.parse(self.fetchEncryptedString(self.envConsts.userCfg.namespace, self.envConsts.userCfg.key)); 
								self.debug('userCfg = ' + JSON.stringify(self.userCfg), fn);
							}
							self.debug('exiting',fn);
							return self.userCfg;
						};
						break;
					case 1:
						// set consts
						// self.envConsts.userCfgKey = 'TestyMcTesterson.prCfg.json.txt';
						// self.envConsts.userCfgKey = env.userCfgKey;

						// // set lib refs
						// _ = require('underscore');
						// // console.log('HELLO1');
						// require('./date.js');
						// // require('./time.js');

  // var start = new Date();
  //       var end = Date.today().add(15).days();
  //       var ts = new TimePeriod(start, end);

  //       console.log(ts.getDays()); // 14

						
						// // WTF is up with date.js...
						// var today = Date.today();
						// console.log('_.isDate(today) = ' + _.isDate(today) + '; today = ' + today + '; _.keys(today) = ' + _.keys(today));
						// console.log('today.isAfter(Date.tomorrow()) = ' + Date.today().isAfter(new Date().add(1).day()));
						// console.log('HELLO2');

						// * set function ptrs *
						// PR fns
						self.debug = function(s, fn) { console.log('[DBG]' + (!self.isNullOrUndefined(fn) ? '[' + fn + '] ' : ' ') + s); };
						self.log = function(s, fn) { console.log('[INF]' + (!self.isNullOrUndefined(fn) ? '[' + fn + '] ' : ' ') + s); };
						self.warn = function(s, fn) { console.warn('[WRN]' + (!self.isNullOrUndefined(fn) ? '[' + fn + '] ' : ' ') + s); };
						self.error = function(s, fn) { console.error('[ERR]' + (!self.isNullOrUndefined(fn) ? '[' + fn + '] ' : ' ') + s); };
						self.playDefaultTone = function() { var fn = 'playDefaultTone'; self.log('NOEXEC: playDefaultTone', fn); };
						self.persistEncryptedString = function(namespace, key, value) { var fn = 'persistEncryptedString'; self.log('NOEXEC: persistEncryptedString: key = \'' + key + '\'; value = \'' + value + '\'', fn); };
						self.fetchEncryptedString = function(namespace, key) { var fn = 'fetchEncryptedString'; self.log('NOEXEC: fetchEncryptedString: key = \'' + key + '\'', fn); };
						self.persistString = function(namespace, key, value) { var fn = 'persistString'; self.log('NOEXEC: persistString: key = \'' + key + '\'; value = \'' + value + '\'', fn); };
						self.fetchString = function(namespace, key) { var fn = 'fetchString'; self.log('NOEXEC: fetchString: key = \'' + key + '\'', fn); };
						self.scheduleScript = function(id, date, action) { var fn = 'scheduleScript'; self.log('NOEXEC: scheduleScript: ' + self.getQuotedAndDelimitedStr([id, date, action],','), fn); };
						self.showNativeDialog = function(title, msg, confirmTitle, cancelTitle, confirmScript, cancelScript) { var fn = 'showNativeDialog'; self.log('NOEXEC: showNativeDialog: ' + self.getQuotedAndDelimitedStr([title, msg, confirmTitle, cancelTitle, confirmScript, cancelScript], ','), fn); };
						self.updateWidget = function(params) { var fn = 'updateWidget'; self.log('NOEXEC: updateWidget: ' + JSON.stringify(params), fn); };
						self.updateTrigger = function(triggerId, triggerObj) { var fn = 'updateTrigger'; self.log('NOEXEC: updateTrigger: ' + self.getQuotedAndDelimitedStr([triggerId, JSON.stringify(triggerObj)],','), fn); };
						self.fetchTriggerIds = function() { var fn = 'fetchTriggerIds'; self.log('NOEXEC: fetchTriggerIds', fn); return []; };
						self.fetchTrigger = function(triggerId) { var fn = 'fetchTrigger'; self.log('NOEXEC: fetchTrigger: ' + triggerId, fn); };
						self.deleteTrigger = function(triggerId) { var fn = 'deleteTrigger'; self.log('NOEXEC: deleteTrigger: ' + triggerId, fn); };

						// support fns
						/**
						 * Node-case: assign the usercfg file-path as the userCfgFetchParamsObj.key value, and pass the userCfgFetchParamsObj to this function.
						 * @param  {[type]} userCfgFetchParamsObj) {            var fileName = userCfgFetchParamsObj.key; var fs = require('fs'); var userCfg = fs.readFileSync(fileName); self.log('userCfg = ' + userCfg [description]
						 * @return {[type]}                        [description]
						 */
						self.getUserCfg = function() { var fn = 'getUserCfg', self = ctor.prototype; 
							self.log('entered',fn);
							if(self.userCfg==null) { 
								self.debug('fetching userCfg on first call...', fn); 
								var fs = require('fs'); 
								self.userCfg = JSON.parse(fs.readFileSync(self.envConsts.userCfg.key));
							}
							self.log('exiting',fn);
							return self.userCfg;
						};
						break;
					case 2:
						// set consts
						// self.envConsts.userCfgKey = env.userCfgKey;		// define this in another JS file, the contents of which will be 'var userCfg = { ...your cfg here... };', which is referenced by the page via a <script ...> tag.

						// *** set lib refs ***
						// NOTE FOR THIS ENVIRONMENT: You must include Underscore via a <script> reference and pass-in the object reference on the appropriate env.libRefs.* variable.
						_ = env.libRefs.underscore;
						Date.prototype = env.libRefs.datejs;
						// self.TimePeriod = env.libRefs.timejs;
						
						// * set function ptrs *
						// PR fns
						self.debug = function(s, fn) { console.log('[DBG]' + (!self.isNullOrUndefined(fn) ? '[' + fn + '] ' : ' ') + s); };
						self.log = function(s, fn) { console.log('[INF]' + (!self.isNullOrUndefined(fn) ? '[' + fn + '] ' : ' ') + s); };
						self.warn = function(s, fn) { console.warn('[WRN]' + (!self.isNullOrUndefined(fn) ? '[' + fn + '] ' : ' ') + s); };
						self.error = function(s, fn) { console.error('[ERR]' + (!self.isNullOrUndefined(fn) ? '[' + fn + '] ' : ' ') + s); };
						self.playDefaultTone = function() { var fn = 'playDefaultTone'; self.log('NOEXEC: playDefaultTone', fn); };
						self.persistEncryptedString = function(namespace, key, value) { var fn = 'persistEncryptedString'; self.log('NOEXEC: persistEncryptedString: key = \'' + key + '\'; value = \'' + value + '\'', fn); };
						self.fetchEncryptedString = function(namespace, key) { var fn = 'fetchEncryptedString'; self.log('NOEXEC: fetchEncryptedString: key = \'' + key + '\'', fn); };
						self.persistString = function(namespace, key, value) { var fn = 'persistString'; self.log('NOEXEC: persistString: key = \'' + key + '\'; value = \'' + value + '\'', fn); };
						self.fetchString = function(namespace, key) { var fn = 'fetchString'; self.log('NOEXEC: fetchString: key = \'' + key + '\'', fn); };
						self.scheduleScript = function(id, date, action) { var fn = 'scheduleScript'; self.log('NOEXEC: scheduleScript: ' + self.getQuotedAndDelimitedStr([id, date, action],','), fn); };
						self.showNativeDialog = function(title, msg, confirmTitle, cancelTitle, confirmScript, cancelScript) { var fn = 'showNativeDialog'; self.log('NOEXEC: showNativeDialog: ' + self.getQuotedAndDelimitedStr([title, msg, confirmTitle, cancelTitle, confirmScript, cancelScript],','), fn); };
						self.updateWidget = function(params) { var fn = 'updateWidget'; self.log('NOEXEC: updateWidget: ' + JSON.stringify(params), fn); };
						self.updateTrigger = function(triggerId, triggerObj) { var fn = 'updateTrigger'; self.log('NOEXEC: updateTrigger: ' + triggerId, JSON.stringify(triggerObj), fn); };
						self.fetchTriggerIds = function() { var fn = 'fetchTriggerIds'; self.log('NOEXEC: fetchTriggerIds', fn); return []; };
						self.fetchTrigger = function(triggerId) { var fn = 'fetchTrigger'; self.log('NOEXEC: fetchTrigger: ' + triggerId, fn); };
						self.deleteTrigger = function(triggerId) { var fn = 'deleteTrigger'; self.log('NOEXEC: deleteTrigger: ' + triggerId, fn); };

						// support fns
						/**
						 * Browser-case: assign the usercfg variable you already have (presumably) as the userCfgFetchParamsObj.key value, and pass the userCfgFetchParamsObj to this function.
						 * @param  {[type]} userCfgFetchParamsObj [description]
						 * @return {[type]}                       [description]
						 */
						self.getUserCfg = function() { var fn = 'getUserCfg', self = ctor.prototype; self.log('entered & exiting',fn); if(userCfg==null) { userCfg = self.envConsts.userCfg.key; } return userCfg; };
						break;
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
				return (v == null || v == undefined);
			},


			/**
			 * Generates a Date object, using today's date, with the time specified in the timeStr.
			 * @param  {[type]} timeStr [description]
			 * @return {[type]}         [description]
			 */
			genDateFromTime: function(timeStr) { var fn = 'genDateFromTime', self = ctor.prototype;
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
			iCalToDate: function(iCalStr) { var fn = 'iCalToDate', self = ctor.prototype;
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
			getQuotedAndDelimitedStr: function(paramArray, delim, quoteChar) { var fn = 'getQuotedAndDelimitedStr', self = ctor.prototype;
				// self.log('entered and exiting, with paramArray = ' + paramArray,fn);
				var qc = self.isNullOrUndefined(quoteChar) ? '\'' : quoteChar;
				return _.reduce(_.map(paramArray, function(param) { return qc + param + qc; }), function(memo, val) {
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
			getAllDoseTimes: function() { var fn = 'getAllDoseTimes', self = ctor.prototype;
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
			getRandomDateTimeWithinRange: function(startDateTime, endDateTime) { var fn = 'getRandomDateTimeWithinRange', self = ctor.prototype;
				// var timespan = ctor.prototype.TimePeriod(startDateTime, endDateTime);
				// ctor.prototype.debug('timespan.getSeconds() = ' + timespan.getSeconds(), fn);
				
				// apparently doing a date-diff in terms of milliseconds is way-simpler than I thought: http://stackoverflow.com/questions/327429/whats-the-best-way-to-calculate-date-difference-in-javascript
				var msInTimeSpan = endDateTime - startDateTime;
				// ctor.prototype.debug('msInTimeSpan = ' + msInTimeSpan,fn);
				// randomly-select an offset between 0 and msInTimeSpan, inclusive.
				var randVal = Math.random();
				// ctor.prototype.debug('randVal = ' + randVal,fn);
				var randOffsetInMs = (Math.floor(randVal * msInTimeSpan) + 1);
				var randDateTime = startDateTime.clone().addMilliseconds(randOffsetInMs);
				self.debug('randVal = ' + randVal + '; randDateTime = ' + randDateTime,fn);
				return randDateTime;
			},


			setDateTimeTrigger: function(type, name, actionScriptText, startDateTime, endDateTime, repeatStr) { var fn = 'setDateTimeTrigger', self = ctor.prototype;
				self.debug('entered',fn);
				self.debug('actionScriptText = ' + actionScriptText, fn);

				// throw 'Not implemented. See: https://github.com/nupmmarkbegale/Purple-Robot-Manager/wiki/JSON-Configuration-Document-Reference and https://github.com/nupmmarkbegale/Purple-Robot-Manager/wiki/JavaScript-Reference';
				// switch(self.envConsts.selected) {
				switch(self.execCtx) {
					case 0:
						// self.log('PR path',fn);
						// eval(actionScriptText);	// for testing, for now...

						var dsical = startDateTime.toICal();
						var deical = endDateTime.toICal();
						// self.debug('ds = ' + ds + '; dsical = ' + dsical + '; de = ' + de + '; deical = ' + deical, fn);
						
						// self.scheduleScript(name, dical, actionScriptText);
						
						// deletes the trigger if it already exists
						if(_.contains(self.fetchTriggerIds(), name)) { self.log('Deleting trigger: ' + name, fn); self.deleteTrigger(name); }

						// sets a trigger
						// self.debug('Trigger params: ' + self.getQuotedAndDelimitedStr([name,actionScriptText,startDateTime,dsical,endDateTime,deical], ','));
						
						var action = 
								'PurpleRobot.log(\'***** TRIGGER START! *****\'); '
							+ actionScriptText
							+ '; PurpleRobot.log(\'***** TRIGGER END! *****\');'
							;
						
						var actionKey = name + '-actionScriptText';

						// self.debug('self.envConsts = ' + JSON.stringify(self.envConsts), fn);
						// self.debug('self.envConsts.prCfg.namespace = ' + self.envConsts.prCfg.namespace, fn);
						self.persistString(self.envConsts.prCfg.namespace, actionKey, action);
						self.debug('Stored action string at [' + self.envConsts.prCfg.namespace + ',' + actionKey + '] of: ' + self.fetchString(self.envConsts.prCfg.namespace, actionKey) ,fn);

						try {
							var triggerObj = {
								'identifier': name,
								'type': 'datetime',
								'name': name,
								'action': ''
									+ 'var actionScriptText = PurpleRobot.fetchString(\'' + self.envConsts.prCfg.namespace + '\',\'' + actionKey + '\'); '
									// + 'var quotedActionScriptText = "\'" + actionScriptText + "\'"';
									+ 'PurpleRobot.log("[IN TRIGGER ACTION] eval()ing: " + actionScriptText);'
									+ 'eval(\'\' + actionScriptText);'
									+ 'PurpleRobot.log("[IN TRIGGER ACTION] did it eval?");'
								,
								'datetime_start': dsical,
								'datetime_end': deical,
								'datetime_repeat': repeatStr
							};
							self.debug('triggerObj = ' + JSON.stringify(triggerObj));
							self.updateTrigger(name, triggerObj);
						}
						catch (e) { self.error("updateTrigger broke; e = " + e, fn); }

						// // 'MedPrompt: medA at 09:00:00','PurpleRobot.showNativeDialog('datetime','MedPrompt: medA at 09:00:00','Yes','No','PurpleRobot.launchUrl("http://mohrlab.northwestern.edu/h2h/");','null');','20130422T143018','20130422T143118'
						// {
						// 	'identifier': 'MedPrompt: medA at 09:00:00',
						// 	'type': 'datetime',
						// 	'name': 'MedPrompt: medA at 09:00:00',
						// 	'action': "'PurpleRobot.showNativeDialog('datetime','MedPrompt: medA at 09:00:00','Yes','No','PurpleRobot.launchUrl(\"http://mohrlab.northwestern.edu/h2h/\");','null');'",
						// 	'datetime_start': '20130422T143018',
						// 	'datetime_end': '20130422T143118'
						// }
						
						break;

					case 1:
						// self.log('Node.js path',fn);
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
			appConfig: {
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
				 *   		If appConfig does not exist, then run appConfig.create.
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
				create: function(namespace, keyInPR) {
					self.persistEncryptedString(namespace, keyInPR, JSON.stringify({
						// 'onLoad': {
						// 	'actionItems': [
						// 		{
						// 			'name': 'example action item for use & reference in PhoneGap app',
						// 			'url': 'your-router-path-here',
						// 			'triggerId': 'MedPrompt: medA at 09:00:00'
						// 		}
						// 	]
						// },
						'purpleSendMessageQueue': [
						],
						'triggerState': [
							{
								'createdOn': '20130523T150900',
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
							}
						]
					}));
				},
				get: function(namespace, keyInPR) {
					self.fetchEncryptedString(namespace, keyInPR);
				},
				set: function(namespace, keyInPR, appConfigObj) {
					self.persistEncryptedString(namespace, keyInPR, appConfigObj);
				},
				setUrl: function(namespace, keyInPR, newUrl) {
					var appCfg = self.appConfig.get(namespace, keyInPR);
					appConfig.onLoad.actionItems
					self.persistEncryptedString(namespace, keyInPR, null);
				},
				delete: function(namespace, keyInPR) {
					self.persistEncryptedString(namespace, keyInPR, null);
				}
			},





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

			setEMATrigger: function(name, startDate, endDate, untilDate) { var fn = 'setEMATrigger', self = ctor.prototype;
				self.debug('entered',fn);
				var  type = 'datetime'
						,name = !self.isNullOrUndefined(name) ? name : 'Next EMA'
						,actionScriptText = null
						,startDateTime = null
						,endDateTime = null
						,untilDateTime = null
						,ret = null;

				actionScriptText = 'PurpleRobot.showNativeDialog(' + self.getQuotedAndDelimitedStr([type,name,actionScriptText,startDateTime,endDateTime,untilDateTime], ',') + ');';
				self.debug('actionScriptText = ' + actionScriptText,fn);
				self.setDateTimeTrigger(type, name, actionScriptText, startDateTime, endDateTime, untilDateTime);
				self.debug('exiting',fn);
			},


			setMedPromptTrigger: function(name, startDate, endDate, untilDate) { var fn = 'setMedPromptTrigger', self = ctor.prototype;
				self.debug('entered',fn);
				var  type = 'datetime'
						,name = !self.isNullOrUndefined(name) ? name : 'Next MedPrompt'
						,actionScriptText = null
						,startDateTime = null
						,endDateTime = null
						,untilDateTime = null
						,ret = null;

				actionScriptText = 'PurpleRobot.showNativeDialog(' + self.getQuotedAndDelimitedStr([type,name,actionScriptText,startDateTime,endDateTime,untilDateTime], ',') + ');';
				self.debug('actionScriptText = ' + actionScriptText,fn);
				self.setDateTimeTrigger(type, name, actionScriptText, startDateTime, endDateTime, untilDateTime);
				self.debug('exiting',fn);
			},


			setAllMedPrompts: function() { var fn = 'setAllMedPrompts', self = ctor.prototype;
				self.debug('entered',fn);
				self.getUserCfg();

				_.each(self.userCfg.doses, function(d, i) {
					self.debug('d = ' + JSON.stringify(d), fn);
					
					var sdt = self.genDateFromTime(d.time);
					self.debug('sdt = ' + sdt, fn);
					var  type = 'datetime'
							,name = self.triggerIdPrefixes.medPrompt + d.medication + ' at ' + d.time
							,actionScriptText = null
							,startDateTime = sdt
							,endDateTime = sdt.clone().addMinutes(1)
							,untilDateTime = sdt.clone().addWeeks(1).set({hour:0,minute:0,second:0})
							;

					var repeatStr = 'FREQ=DAILY;INTERVAL=1;UNTIL=' + untilDateTime.toICal();

					var p = self.getQuotedAndDelimitedStr([type,name,'Yes','No'
						// Broken
						// ,'(function() { PurpleRobot.log("YES"); })();'
						// ,'(function() { PurpleRobot.log("NO"); })();'
						// WORKS 1 - on PR, not in unit-test
						// ,'PurpleRobot.log(\'YES\');'
						// ,'PurpleRobot.log(\'NO\');'
						// WORKS 2
						// PurpleRobot.showNativeDialog('datetime','MedPrompt: 14 at 23:13:00','Yes','No','(function () { var fn = \\'onMedPromptYes\\'; prnm.debug(\\'entered\\', fn); })();','(function () {  })();');

						// NEED TO GET THESE WORKING...
						// ,self.convertFnToString(self.actions.onMedPromptYes, ['var debug = ' + self.debug.toString() + ';'])
						// ,self.convertFnToString(self.actions.onMedPromptNo, ['var debug = ' + self.debug.toString() + ';'])

						// v1 - WORKS!! The null values become a value of undefined in the specified function.
						// ,self.convertFnToString(self.actions.onMedPromptYes, null)
						// ,self.convertFnToString(self.actions.onMedPromptNo, null)
						
						// v2 - WORKS!!!!! The idea here is to mock the 'self' object using the specified function's current context. Then, specify all the function dependencies in-order in the array string here. Then, functions that live in PRNM can access other functions that live in PRNM -- enabling code-reuse.
						,self.convertFnToString(self.actions.onMedPromptYes, ['var self = this; self.isNullOrUndefined = ' + self.isNullOrUndefined.toString() + '; var debug = ' + self.debug.toString() + ';', 'hello world!'])
						,self.convertFnToString(self.actions.onMedPromptNo, ['var self = this; self.isNullOrUndefined = ' + self.isNullOrUndefined.toString() + '; var debug = ' + self.debug.toString() + ';', 'goodbye cruel world'])
						], ',', "'");

// self.debug('self.actions.onMedPromptYes = ' + self.actions.onMedPromptYes, fn);

					// * real thing *
					actionScriptText = 'PurpleRobot.showNativeDialog(' + p + ');';
					// * toy EX 1 * -- WORKS
					// actionScriptText = '1 == 1;';
					// * toy EX 2 * -- WORKS
					// actionScriptText = 'PurpleRobot.log("WLOLOLOL");';
					
					// self.debug(self.getQuotedAndDelimitedStr([d.time,sdt,startDateTime,endDateTime,untilDateTime,repeatStr],','),fn);
					self.debug('actionScriptText = ' + actionScriptText,fn);
					self.setDateTimeTrigger(type, name, actionScriptText, startDateTime, endDateTime, repeatStr);

				});

				self.debug('exiting',fn);
			},


			convertFnToString: function(fnPtr, fnParamArray) { var fn = 'convertFnToString', self = ctor.prototype;
				self.debug('fnPtr = ' + fnPtr, fn);
				self.debug('111 fnParamArray = ' + fnParamArray, fn);
				// fnParamArray = fnParamArray == null 
				// 	? fnParamArray 
				// 	: _.map(fnParamArray, function(p) { 
				// 			return !_.isString(p) ? p : (p.replace(/'/gm, 'AAAA')).replace(/"/gm, 'BBBB');
				// 		} );
				// self.debug('222 fnParamArray = ' + fnParamArray, fn);
				var p = self.isNullOrUndefined(fnParamArray) ? '' : self.getQuotedAndDelimitedStr(fnParamArray,',','\\\'');
				return '(' +  (fnPtr.toString().replace(/'/g, '\\\'')).replace(/(\r\n|\n|\r)/gm,'') + ')(' + p.replace(/(\r\n|\n|\r)/gm,'') + ');';
			},



			/**
			 * Deletes all triggers except the PRNM trigger.
			 * @return {[type]} [description]
			 */
			clearAllNonPRNMTriggers: function() { var fn = "clearAllNonPRNMTriggers", self = ctor.prototype;
				var triggersToDelete = _.filter(self.fetchTriggerIds(), function(triggerId) { return (triggerId != self.triggerIdPrefixes.self);});
				self.warn('Deleting all triggers except: ' + self.triggerIdPrefixes.self + '. Triggers = ' + triggersToDelete, fn);
				_.each(triggersToDelete, function(triggerId) {
					self.debug('Deleting trigger: ' + triggerId, fn);
					self.deleteTrigger(triggerId);
				});
			},




			/**
			 * ENTRY-POINT to the rest of the application. (For flow-control clarity, not language-level requirement.)
			 * @param  {[type]} args [description]
			 * @return {[type]}      [description]
			 */
			main: function(args) { var fn = 'main', self = ctor.prototype;
				self.log('entered: args: ' + args, fn);
				self.log('execution context: ' + self.execCtx, fn);

// for debugging
self.clearAllNonPRNMTriggers();

				self.setAllMedPrompts();

				// 20130517, estory: this really works! :-)
				// self.showNativeDialog("main: Test Prompt", "Would you like to hit a button?", "Yes", "No", 'PurpleRobot.log("hit OK");', 'PurpleRobot.log("hit cancel");');
				
				// STEP 1: is it time for med or for survey?
				// STEP 2: if time for med, then prompt
				// STEP 3: if time for survey, then prompt

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


// WORKS, BUT BLOWS-UP UNDERSCORE.
// var exports = new PRNM(typeof exports === 'undefined' ? this['PurpleRobotNotificationManager'] = {} : exports);
// PurpleRobot.log('this = ' + JSON.stringify(this));
// PurpleRobot.log('exports_1 = ' + JSON.stringify(exports));
// PurpleRobot.log('ONE');
var passedToPRNM = typeof exports === 'undefined' ? this['PurpleRobotNotificationManager'] = {} : exports;
// if (currentExecutionContext == 0) { PurpleRobot.log('passedToPRNM = ' + (typeof passedToPRNM === 'object' ? JSON.stringify(passedToPRNM) : passedToPRNM)); }
// else  { console.log('passedToPRNM = ' + (typeof passedToPRNM === 'object' ? JSON.stringify(passedToPRNM) : passedToPRNM)); }
// PurpleRobot.log('TWO');
// PurpleRobot.log('passedToPRNM = ' + (typeof passedToPRNM === 'object' ? JSON.stringify(passedToPRNM) : passedToPRNM));
// PurpleRobot.log('THREE');

// exports = new PRNM(passedToPRNM);
var PurpleRobotNotificationManager = new PRNM(passedToPRNM);
exports = PurpleRobotNotificationManager;
exports.ctor.prototype.execCtx = currentExecutionContext;
if (currentExecutionContext == 0) { PurpleRobot.log('exports.ctor.prototype.execCtx = ' + exports.ctor.prototype.execCtx); }
else  { console.log('exports.ctor.prototype.execCtx = ' + exports.ctor.prototype.execCtx); }
// PurpleRobot.log('FOUR');
// PurpleRobot.log('exports_2 = ' + JSON.stringify(exports));
// PurpleRobot.log('FIVE');

// var foo = ['type','name','Yes','No','PurpleRobot.loadUrl("http://mohrlab.northwestern.edu/h2h/");','null'];
// // PurpleRobot.loadUrl('http://mohrlab.northwestern.edu/h2h/')
// var foo = ["type","name","Yes","No","null","PurpleRobot.loadUrl('http://mohrlab.northwestern.edu/h2h/')"];
// _.each(foo, function(f) { PurpleRobot.log(f); });
// _.each(foo, function(f) { PurpleRobot.log(f); });		// dupe; testing my comment thing
// _.each(foo, function(f) { PurpleRobot.log(f); });		// dupe; testing my comment thing: http://mohrlab.northwestern.edu
