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

			test: function(codeFromPrnm) { var fn = 'test'; PurpleRobot.log('ENTERED: ' + fn + '; codeFromPrnm = ' + codeFromPrnm); eval('' + codeFromPrnm);
	      return 'hello world from actions.test';
			},



			onMedPromptYes: function(codeFromPrnm) { var fn = 'onMedPromptYes'; PurpleRobot.log('ENTERED: ' + fn + '; codeFromPrnm = ' + codeFromPrnm); eval('' + codeFromPrnm);





				PurpleRobot.log('this.CURRENTLY_IN_TRIGGER = ' + this.CURRENTLY_IN_TRIGGER);
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
				appCfg.triggerState = appCfg.triggerState != null ? appCfg.triggerState : [];
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



				var trg = self.fetchTrigger(self.genMedPromptTriggerId(dose));
				var trgWithState = self.appCfgGetTriggerState(fn, (self.appConfigCompletionStates()).PromptedPressedButton, url, trg);
				appCfg.triggerState = appCfg.triggerState != null ? appCfg.triggerState : [];
				appCfg.triggerState.push(trgWithState);
				self.debug('Saving trigger state = ' + JSON.stringify(trgWithState), fn);
				self.appConfigUpsert(self.envConsts.appCfg.namespace, self.envConsts.appCfg.key, appCfg);

			},


			onEMAYes: function(codeFromPrnm) { var fn = 'onEMAYes'; PurpleRobot.log('ENTERED: ' + fn + '; codeFromPrnm = ' + codeFromPrnm); eval('' + codeFromPrnm);





				self.debug('appCfg.staticOrDefault.transition.onEMAYes = ' + JSON.stringify(appCfg.staticOrDefault.transition.onEMAYes) + '; appCfg.dynamicOrModified.transition.onEMAYes = ' + JSON.stringify(appCfg.dynamicOrModified.transition.onEMAYes), fn);
				var staticActionCfgExists  = !self.isNullOrUndefined(appCfg.staticOrDefault.transition.onEMAYes),
						dynamicActionCfgExists = !self.isNullOrUndefined(appCfg.dynamicOrModified.transition.onEMAYes);
				var dynamicIsNull = dynamicActionCfgExists ? self.isNullOrUndefined(appCfg.dynamicOrModified.transition.onEMAYes[schedObj.name]) : true;
				self.debug('staticActionCfgExists = ' + staticActionCfgExists + '; dynamicActionCfgExists = ' + dynamicActionCfgExists + '; dynamicIsNull = ' + dynamicIsNull, fn);
				if(dynamicIsNull && !staticActionCfgExists) { 
					throw 'ERROR: Cannot run ' + fn + ': both the static and dynamic app-configurations are missing.';
				}
				

				var baseUrl = dynamicIsNull ? appCfg.staticOrDefault.transition.onEMAYes[schedObj.name] : appCfg.dynamicOrModified.transition.onEMAYes[schedObj.name];
				var url = baseUrl;
				self.debug('launching url = ' + url, fn);
				self.launchUrl(url);



				var trg = self.fetchTrigger(self.genEMAPromptTriggerId(schedObj));
				var trgWithState = self.appCfgGetTriggerState(fn, (self.appConfigCompletionStates()).PromptedPressedButton, url, trg);
				appCfg.triggerState = appCfg.triggerState != null ? appCfg.triggerState : [];
				appCfg.triggerState.push(trgWithState);
				self.debug('Saving trigger state = ' + JSON.stringify(trgWithState), fn);
				self.appConfigUpsert(self.envConsts.appCfg.namespace, self.envConsts.appCfg.key, appCfg);

			},














				

















			onWidgetPress: function(codeFromPrnm) { var fn = 'onWidgetPress'; PurpleRobot.log('ENTERED: ' + fn + '; codeFromPrnm = ' + codeFromPrnm); eval('' + codeFromPrnm);
				self.debug('ENTERED onWidgetPress...');
			}

		};

	

	exports.ctor = ctor;

	return ctor;







});


var passedToActions = typeof exports === 'undefined' ? this['Actions'] = {} : exports;

var Actions = new ActionsFn(passedToActions);
exports = Actions.ctor;


