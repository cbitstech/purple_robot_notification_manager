/*** H2H Actions definition ***/

var ActionsFn = (function(exports) { var fn = 'actions';


	  var ctor = function(d) { var fn = 'actions:ctor', self = ctor.prototype;
	    self.prnm = d.prnm;
			self.prnm.debug('ENTERED; prnm = ' + JSON.stringify(self.prnm), fn);
	    self.data = d;

			self.prnm.debug('exiting...', fn);
			return ctor.prototype;
	  };



	  ctor.prototype = {


	  	self: null,
	  	data: null,

			test: function() {
		  	self.log('ENTERED actions.ctor.prototype.test...')
	      return 'hello world from actions.test';
			},



			onMedPromptYes: function(codeFromPrnm) { var fn = 'onMedPromptYes'; PurpleRobot.log('ENTERED: ' + fn + '; codeFromPrnm = ' + codeFromPrnm); eval('' + codeFromPrnm);
					PurpleRobot.log('FOOFOOFOOFOOFOO');





				var dynamicIsNull = self.isNullOrUndefined(appCfg.dynamicOrModified.transition.onMedPromptYes);
				var baseUrl = dynamicIsNull ? appCfg.staticOrDefault.transition.onMedPromptYes : appCfg.dynamicOrModified.transition.onMedPromptYes;
				var url = baseUrl
				 	+ '?'
					+ 'med1time1=' + dose.time
					+ '&medName_1=' + dose.medication
					+ '&medStrength_1=' + dose.strength
					+ '&medDispensationUnit_1=' + dose.dispensationUnit;
				self.debug('launching url = ' + url, fn);
				self.launchUrl(url);




				var trg = self.fetchTrigger(self.genMedPromptTriggerId(dose));
				var trgWithState = self.appCfgGetTriggerState(fn, (self.appConfigCompletionStates()).PromptedPressedButton, url, trg);
				appCfg.triggerState.push(trgWithState);
				self.debug('Saving trigger state = ' + JSON.stringify(trgWithState), fn);
				self.appConfigUpsert(self.envConsts.appCfg.namespace, self.envConsts.appCfg.key, appCfg);

			},


			onMedPromptNo: function(codeFromPrnm) { var fn = 'onMedPromptNo'; PurpleRobot.log('ENTERED: ' + fn + '; codeFromPrnm = ' + codeFromPrnm); eval('' + codeFromPrnm);





				var dynamicIsNull = self.isNullOrUndefined(appCfg.dynamicOrModified.transition.onMedPromptNo);
				var baseUrl = dynamicIsNull ? appCfg.staticOrDefault.transition.onMedPromptNo : appCfg.dynamicOrModified.transition.onMedPromptNo;
				var url = baseUrl
				 	+ '?'
					+ 'med1time1=' + dose.time
					+ '&medName_1=' + dose.medication
					+ '&medStrength_1=' + dose.strength
					+ '&medDispensationUnit_1=' + dose.dispensationUnit;
				self.debug('launching url = ' + url, fn);
				self.launchUrl(url);
			},


			onEMAYes: function(codeFromPrnm) { var fn = 'onEMAYes'; PurpleRobot.log('ENTERED: ' + fn + '; codeFromPrnm = ' + codeFromPrnm);





				var dynamicIsNull = self.isNullOrUndefined(appCfg.dynamicOrModified.transition.onMedPromptYes);
				var baseUrl = dynamicIsNull ? appCfg.staticOrDefault.transition.onMedPromptYes : appCfg.dynamicOrModified.transition.onMedPromptYes;
				var url = baseUrl
				 	+ '?'
					+ 'med1time1=' + dose.time
					+ '&medName_1=' + dose.medication
					+ '&medStrength_1=' + dose.strength
					+ '&medDispensationUnit_1=' + dose.dispensationUnit;
				self.debug('launching url = ' + url, fn);
				self.launchUrl(url);
			},


			onEMANo: function(codeFromPrnm) { var fn = 'onEMANo'; PurpleRobot.log('ENTERED: ' + fn + '; codeFromPrnm = ' + codeFromPrnm);





				var dynamicIsNull = self.isNullOrUndefined(appCfg.dynamicOrModified.transition.onMedPromptNo);
				var baseUrl = dynamicIsNull ? appCfg.staticOrDefault.transition.onMedPromptNo : appCfg.dynamicOrModified.transition.onMedPromptNo;
				var url = baseUrl
				 	+ '?'
					+ 'med1time1=' + dose.time
					+ '&medName_1=' + dose.medication
					+ '&medStrength_1=' + dose.strength
					+ '&medDispensationUnit_1=' + dose.dispensationUnit;
				self.debug('launching url = ' + url, fn);
				self.launchUrl(url);
			},


			onWidgetPress: function(codeFromPrnm) { var fn = 'onWidgetPress'; PurpleRobot.log('ENTERED: ' + fn + '; codeFromPrnm = ' + codeFromPrnm);

			}

		};

	

	exports.ctor = ctor;

	return ctor;







});


var passedToActions = typeof exports === 'undefined' ? this['Actions'] = {} : exports;

var Actions = new ActionsFn(passedToActions);
exports = Actions.ctor;


