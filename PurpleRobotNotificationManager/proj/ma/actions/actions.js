/*** MA Actions definition ***/

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
				var dynamicIsNull = self.isNullOrUndefined(self.appCfg.dynamicOrModified.transition.onMedPromptYes);
				var baseUrl = dynamicIsNull ? self.appCfg.staticOrDefault.transition.onMedPromptYes : self.appCfg.dynamicOrModified.transition.onMedPromptYes;
				var url = baseUrl
				 	+ '?'
					+ 'med1time1=' + dose.time
					+ '&medName_1=' + dose.medication
					+ '&medStrength_1=' + dose.strength
					+ '&medDispensationUnit_1=' + dose.dispensationUnit;










				

				var currentAction = {
					'triggerId': triggerId,
					'actionDstType': 'MedPromptYes',
					'actionTime': dose.time,
					'actionName': dose.medication
				};
				self.debug('In namespace (' + self.appCfg.staticOrDefault.namespace + '), saving currentAction = ' + JSON.stringify(currentAction), fn);
				self.appConfigUpsert(self.appCfg.staticOrDefault.namespace, 'currentAction', currentAction);



				var applicationFullName = self.appCfg.staticOrDefault.appPackageName;
				self.log('Launching application = ' + applicationFullName, fn);
				self.launchApplication(applicationFullName);



				var triggerIdToDelete = (
					triggerId.indexOf('+' + self.appCfg.staticOrDefault.updateWidget.widgetState.nonResponsive.TTLinMins + 'min') != -1
					? triggerId 
					: triggerId + '+' + self.appCfg.staticOrDefault.updateWidget.widgetState.nonResponsive.TTLinMins + 'min'
				);
				self.log('Deleting reminder trigger; ID = ' + triggerIdToDelete, fn);
				self.deleteTrigger(triggerIdToDelete);


				var updateWidgetParams = {
					'identifier': self.appCfg.staticOrDefault.namespace,
					'message': self.appCfg.staticOrDefault.updateWidget.widgetState.neutral.message,
					'color': self.appCfg.staticOrDefault.updateWidget.widgetState.neutral.textColor
				};
				self.debug('Setting widget to Neutral state using: ' + JSON.stringify(updateWidgetParams), fn);
				self.updateWidget(updateWidgetParams);
			},


			/**
			 * No button on a MedPrompt dialog is pressed.
			 * @param  {[type]} codeFromPrnm) {            var fn = 'onMedPromptNo'; PurpleRobot.log('ENTERED: ' + fn + '; codeFromPrnm = ' + codeFromPrnm); eval('' + codeFromPrnm [description]
			 * @return {[type]}               [description]
			 */
			onMedPromptNo: function(codeFromPrnm) { var fn = 'onMedPromptNo'; PurpleRobot.log('ENTERED: ' + fn + '; codeFromPrnm = ' + codeFromPrnm); eval('' + codeFromPrnm);



				var dynamicIsNull = self.isNullOrUndefined(self.appCfg.dynamicOrModified.transition.onMedPromptNo);
				var baseUrl = dynamicIsNull ? self.appCfg.staticOrDefault.transition.onMedPromptNo : self.appCfg.dynamicOrModified.transition.onMedPromptNo;
				var url = baseUrl
				 	+ '?'
					+ 'med1time1=' + dose.time
					+ '&medName_1=' + dose.medication
					+ '&medStrength_1=' + dose.strength
					+ '&medDispensationUnit_1=' + dose.dispensationUnit;












				var currentAction = {
					'triggerId': triggerId,
					'actionDstType': 'MedPromptNo',
					'actionTime': dose.time,
					'actionName': dose.medication
				};
				self.debug('In namespace (' + self.appCfg.staticOrDefault.namespace + '), saving currentAction = ' + JSON.stringify(currentAction), fn);
				self.appConfigUpsert(self.appCfg.staticOrDefault.namespace, 'currentAction', currentAction);




				var applicationFullName = self.appCfg.staticOrDefault.appPackageName;
				self.log('Launching application = ' + applicationFullName, fn);
				self.launchApplication(applicationFullName);



				var triggerIdToDelete = (
					triggerId.indexOf('+' + self.appCfg.staticOrDefault.updateWidget.widgetState.nonResponsive.TTLinMins + 'min') != -1
					? triggerId 
					: triggerId + '+' + self.appCfg.staticOrDefault.updateWidget.widgetState.nonResponsive.TTLinMins + 'min'
				);
				self.log('Deleting reminder trigger; ID = ' + triggerIdToDelete, fn);
				self.deleteTrigger(triggerIdToDelete);


				var updateWidgetParams = {
					'identifier': self.appCfg.staticOrDefault.namespace,
					'message': self.appCfg.staticOrDefault.updateWidget.widgetState.neutral.message,
					'color': self.appCfg.staticOrDefault.updateWidget.widgetState.neutral.textColor
				};
				self.debug('Setting widget to Neutral state using: ' + JSON.stringify(updateWidgetParams), fn);
				self.updateWidget(updateWidgetParams);
			},


			/**
			 * OK (or, yes) button on an EMA dialog is pressed.
			 * @param  {[type]} codeFromPrnm) {            var fn = 'onEMAYes'; PurpleRobot.log('ENTERED: ' + fn + '; codeFromPrnm = ' + codeFromPrnm); eval('' + codeFromPrnm [description]
			 * @return {[type]}               [description]
			 */
			onEMAYes: function(codeFromPrnm) { var fn = 'onEMAYes'; PurpleRobot.log('ENTERED: ' + fn + '; codeFromPrnm = ' + codeFromPrnm); eval('' + codeFromPrnm);

				


				var staticActionCfgExists  = !self.isNullOrUndefined(self.appCfg.staticOrDefault.transition.onEMAYes),
						dynamicActionCfgExists = !self.isNullOrUndefined(self.appCfg.dynamicOrModified.transition.onEMAYes);
				var dynamicIsNull = dynamicActionCfgExists ? self.isNullOrUndefined(self.appCfg.dynamicOrModified.transition.onEMAYes[schedObj.name]) : true;

				if(dynamicIsNull && !staticActionCfgExists) { 
					throw 'ERROR: Cannot run ' + fn + ': both the static and dynamic app-configurations are missing.';
				}
				

				var baseUrl = dynamicIsNull ? self.appCfg.staticOrDefault.transition.onEMAYes[schedObj.name] : self.appCfg.dynamicOrModified.transition.onEMAYes[schedObj.name];
				var url = baseUrl;












				

				self.debug('childTriggerId = ' + childTriggerId + 'childTriggerId == null = ' + (childTriggerId == null), fn);
				if(childTriggerId != null) {
					self.debug('in parent trigger: ' + triggerId + '; childTriggerId = ' + childTriggerId, fn);


					self.debug('Getting the child trigger to delete; childTriggerId = ' + childTriggerId, fn);
					var trgDel = self.fetchTrigger(childTriggerId);
					var trgWithStateDel = self.appCfgGetTriggerState(fn, (self.appConfigCompletionStates()).CanceledByTrigger, url, trgDel);
					self.appCfg.triggerState = self.appCfg.triggerState != null ? self.appCfg.triggerState : [];
					self.appCfg.triggerState.push(trgWithStateDel);

					self.debug('Deleting followup trigger with ID: ' + childTriggerId, fn);
					self.deleteTrigger(childTriggerId);
					self.log('Deleted followup trigger with ID: ' + childTriggerId, fn);
				}

				self.debug('Saving trigger state...', fn);
				self.appConfigUpsert(self.appCfg.staticOrDefault.namespace, self.appCfg.key, self.appCfg);


				var currentAction = {
					'triggerId': triggerId,
					'actionDstType': 'EMA',
					'actionDstSubtype': schedObj.name
				};
				self.debug('In namespace (' + self.appCfg.staticOrDefault.namespace + '), saving currentAction = ' + JSON.stringify(currentAction), fn);
				self.appConfigUpsert(self.appCfg.staticOrDefault.namespace, 'currentAction', currentAction);



				var applicationFullName = self.appCfg.staticOrDefault.appPackageName;
				self.log('Launching application = ' + applicationFullName, fn);
				self.launchApplication(applicationFullName);
			},


			onWidgetPress: function(codeFromPrnm) { var fn = 'onWidgetPress'; PurpleRobot.log('ENTERED: ' + fn + '; codeFromPrnm = ' + codeFromPrnm); eval('' + codeFromPrnm);




				var applicationFullName = self.appCfg.staticOrDefault.appPackageName;
				PurpleRobot.log('Launching application = ' + applicationFullName);
				PurpleRobot.launchApplication(applicationFullName);
			}

		};

	

	exports.ctor = ctor;

	return ctor;

});


var passedToActions = typeof exports === 'undefined' ? this['Actions'] = {} : exports;

var Actions = new ActionsFn(passedToActions);
exports = Actions.ctor;