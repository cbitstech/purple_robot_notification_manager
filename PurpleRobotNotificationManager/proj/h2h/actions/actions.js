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


			/**
			 * Yes button on a MedPrompt dialog is pressed.
			 * @param  {[type]} codeFromPrnm) {            var fn = 'onMedPromptYes'; PurpleRobot.log('ENTERED: ' + fn + '; codeFromPrnm = ' + codeFromPrnm); eval('' + codeFromPrnm [description]
			 * @return {[type]}               [description]
			 */
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
				self.log('Launching url = ' + url, fn);
				self.launchUrl(url);



				var trg = self.fetchTrigger(triggerId);
				var trgWithState = self.appCfgGetTriggerState(fn, (self.appConfigCompletionStates()).PromptedPressedButton, url, trg);
				appCfg.triggerState = appCfg.triggerState != null ? appCfg.triggerState : [];
				appCfg.triggerState.push(trgWithState);
				self.debug('Saving trigger state = ' + JSON.stringify(trgWithState), fn);
				self.appConfigUpsert(self.envConsts.appCfg.namespace, self.envConsts.appCfg.key, appCfg);

			},


			/**
			 * No button on a MedPrompt dialog is pressed.
			 * @param  {[type]} codeFromPrnm) {            var fn = 'onMedPromptNo'; PurpleRobot.log('ENTERED: ' + fn + '; codeFromPrnm = ' + codeFromPrnm); eval('' + codeFromPrnm [description]
			 * @return {[type]}               [description]
			 */
			onMedPromptNo: function(codeFromPrnm) { var fn = 'onMedPromptNo'; PurpleRobot.log('ENTERED: ' + fn + '; codeFromPrnm = ' + codeFromPrnm); eval('' + codeFromPrnm);



				var dynamicIsNull = self.isNullOrUndefined(appCfg.dynamicOrModified.transition.onMedPromptNo);
				var baseUrl = dynamicIsNull ? appCfg.staticOrDefault.transition.onMedPromptNo : appCfg.dynamicOrModified.transition.onMedPromptNo;
				var url = baseUrl
				 	+ '?'
					+ 'med1time1=' + dose.time
					+ '&medName_1=' + dose.medication
					+ '&medStrength_1=' + dose.strength
					+ '&medDispensationUnit_1=' + dose.dispensationUnit;
				self.log('Launching url = ' + url, fn);
				self.launchUrl(url);



				var trg = self.fetchTrigger(triggerId);
				var trgWithState = self.appCfgGetTriggerState(fn, (self.appConfigCompletionStates()).PromptedPressedButton, url, trg);
				appCfg.triggerState = appCfg.triggerState != null ? appCfg.triggerState : [];
				appCfg.triggerState.push(trgWithState);
				self.debug('Saving trigger state = ' + JSON.stringify(trgWithState), fn);
				self.appConfigUpsert(self.envConsts.appCfg.namespace, self.envConsts.appCfg.key, appCfg);

			},


			/**
			 * OK (or, yes) button on an EMA dialog is pressed.
			 * @param  {[type]} codeFromPrnm) {            var fn = 'onEMAYes'; PurpleRobot.log('ENTERED: ' + fn + '; codeFromPrnm = ' + codeFromPrnm); eval('' + codeFromPrnm [description]
			 * @return {[type]}               [description]
			 */
			onEMAYes: function(codeFromPrnm) { var fn = 'onEMAYes'; PurpleRobot.log('ENTERED: ' + fn + '; codeFromPrnm = ' + codeFromPrnm); eval('' + codeFromPrnm);

				


				var staticActionCfgExists  = !self.isNullOrUndefined(appCfg.staticOrDefault.transition.onEMAYes),
						dynamicActionCfgExists = !self.isNullOrUndefined(appCfg.dynamicOrModified.transition.onEMAYes);
				var dynamicIsNull = dynamicActionCfgExists ? self.isNullOrUndefined(appCfg.dynamicOrModified.transition.onEMAYes[schedObj.name]) : true;

				if(dynamicIsNull && !staticActionCfgExists) { 
					throw 'ERROR: Cannot run ' + fn + ': both the static and dynamic app-configurations are missing.';
				}
				

				var baseUrl = dynamicIsNull ? appCfg.staticOrDefault.transition.onEMAYes[schedObj.name] : appCfg.dynamicOrModified.transition.onEMAYes[schedObj.name];
				var url = baseUrl;
				self.log('Launching url = ' + url, fn);
				self.launchUrl(url);




				self.debug('triggerId = ' + triggerId, fn);
				var trg = self.fetchTrigger(triggerId);
				var trgWithState = self.appCfgGetTriggerState(fn, (self.appConfigCompletionStates()).PromptedPressedButton, url, trg);
				appCfg.triggerState = appCfg.triggerState != null ? appCfg.triggerState : [];
				appCfg.triggerState.push(trgWithState);



				

				self.debug('childTriggerId = ' + childTriggerId + 'childTriggerId == null = ' + (childTriggerId == null), fn);
				if(childTriggerId != null) {
					self.debug('in parent trigger: ' + triggerId + '; childTriggerId = ' + childTriggerId, fn);


					self.debug('Getting the child trigger to delete; childTriggerId = ' + childTriggerId, fn);
					var trgDel = self.fetchTrigger(childTriggerId);
					var trgWithStateDel = self.appCfgGetTriggerState(fn, (self.appConfigCompletionStates()).CanceledByTrigger, url, trgDel);
					appCfg.triggerState = appCfg.triggerState != null ? appCfg.triggerState : [];
					appCfg.triggerState.push(trgWithStateDel);

					self.debug('Deleting followup trigger with ID: ' + childTriggerId, fn);
					self.deleteTrigger(childTriggerId);
					self.log('Deleted followup trigger with ID: ' + childTriggerId, fn);
				}

				self.debug('Saving trigger state...', fn);
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