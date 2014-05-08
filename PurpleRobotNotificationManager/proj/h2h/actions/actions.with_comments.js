/*** H2H Actions definition ***/

var ActionsFn = (function(exports) { var fn = 'actions';
	// PurpleRobot.log('ENTERED actions self-called fn...')

	  var ctor = function(d) { var fn = 'actions:ctor', self = ctor.prototype;
	    self.prnm = d.prnm;
			self.prnm.debug('ENTERED; prnm = ' + JSON.stringify(self.prnm), fn);
	    self.data = d;

			self.prnm.debug('exiting...', fn);
			return ctor.prototype;
	  };


	  // *Actually* define the object whose members will be referenced...
	  ctor.prototype = {

	  	// FNGROUP: internal references
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
				// ACTION: take user to motivational feedback page

				// if a dynamicOrModified URL is set (e.g. by the app), then use that, else, use the staticOrDefault URL
				PurpleRobot.log('this.CURRENTLY_IN_TRIGGER = ' + this.CURRENTLY_IN_TRIGGER);
				var dynamicIsNull = self.isNullOrUndefined(self.appCfg.dynamicOrModified.transition.onMedPromptYes);
				var baseUrl = dynamicIsNull ? self.appCfg.staticOrDefault.transition.onMedPromptYes : self.appCfg.dynamicOrModified.transition.onMedPromptYes;
				var url = baseUrl
				 	+ '?'
					+ 'med1time1=' + dose.time
					+ '&medName_1=' + dose.medication
					+ '&medStrength_1=' + dose.strength
					+ '&medDispensationUnit_1=' + dose.dispensationUnit;

				// v2: we will save a currentAction value instead, which the PhoneGap/web app can use to internally route the user as-necessary
				var currentAction = {
					'triggerId': triggerId,
					'actionDstType': 'MedPromptYes',
					'actionTime': dose.time,
					'actionName': dose.medication
				};
				self.log('In namespace (' + self.appCfg.staticOrDefault.namespace + '), saving currentAction = ' + JSON.stringify(currentAction), fn);
				self.appConfigUpsert(self.appCfg.staticOrDefault.namespace, 'currentAction', currentAction);

				var applicationFullName = self.appCfg.staticOrDefault.appPackageName;
				self.log('Launching application = ' + applicationFullName, fn);
				self.launchApplication(applicationFullName);

				// delete the Non-Responsive widget trigger if it exists
				dose.timeOffsetStr = '+0min:W';
				var triggerIdToDelete = self.genMedPromptTriggerId(dose);
				// self.log('Deleting Non-Responsive widget trigger; ID = ' + triggerIdToDelete, fn);
				// self.deleteTrigger(triggerIdToDelete);

				// delete the reminder MedPrompt trigger if it exists
				triggerIdToDelete = (
					triggerId.indexOf('+' + self.appCfg.staticOrDefault.updateWidget.widgetState.nonResponsive.TTLinMins + 'min') != -1
					? triggerId 
					: triggerId + '+' + self.appCfg.staticOrDefault.updateWidget.widgetState.nonResponsive.TTLinMins + 'min'
				);
				self.log('Deleting reminder trigger; ID = ' + triggerIdToDelete, fn);
				self.deleteTrigger(triggerIdToDelete);

				// set the widget to its Neutral state
				// self.setWidgetToNeutralState();
				self.log('EXITING',fn);
			},


			/**
			 * No button on a MedPrompt dialog is pressed.
			 * @param  {[type]} codeFromPrnm) {            var fn = 'onMedPromptNo'; PurpleRobot.log('ENTERED: ' + fn + '; codeFromPrnm = ' + codeFromPrnm); eval('' + codeFromPrnm [description]
			 * @return {[type]}               [description]
			 */
			onMedPromptNo: function(codeFromPrnm) { var fn = 'onMedPromptNo'; PurpleRobot.log('ENTERED: ' + fn + '; codeFromPrnm = ' + codeFromPrnm); eval('' + codeFromPrnm);
				// ACTION: take user to "why did you not take your medication?" page

				// if a dynamicOrModified URL is set (e.g. by the app), then use that, else, use the staticOrDefault URL
				var dynamicIsNull = self.isNullOrUndefined(self.appCfg.dynamicOrModified.transition.onMedPromptNo);
				var baseUrl = dynamicIsNull ? self.appCfg.staticOrDefault.transition.onMedPromptNo : self.appCfg.dynamicOrModified.transition.onMedPromptNo;
				var url = baseUrl
				 	+ '?'
					+ 'med1time1=' + dose.time
					+ '&medName_1=' + dose.medication
					+ '&medStrength_1=' + dose.strength
					+ '&medDispensationUnit_1=' + dose.dispensationUnit;

				// v2: we will save a currentAction value instead, which the PhoneGap/web app can use to internally route the user as-necessary
				var currentAction = {
					'triggerId': triggerId,
					'actionDstType': 'MedPromptNo',
					'actionTime': dose.time,
					'actionName': dose.medication
				};
				self.log('In namespace (' + self.appCfg.staticOrDefault.namespace + '), saving currentAction = ' + JSON.stringify(currentAction), fn);
				self.appConfigUpsert(self.appCfg.staticOrDefault.namespace, 'currentAction', currentAction);
				// self.debug('Saved currentAction!', fn);

				var applicationFullName = self.appCfg.staticOrDefault.appPackageName;
				self.log('Launching application = ' + applicationFullName, fn);
				self.launchApplication(applicationFullName);

				// delete the Non-Responsive widget trigger if it exists
				dose.timeOffsetStr = '+0min:W';
				var triggerIdToDelete = self.genMedPromptTriggerId(dose);
				// self.log('Deleting Non-Responsive widget trigger; ID = ' + triggerIdToDelete, fn);
				// self.deleteTrigger(triggerIdToDelete);

				// delete the reminder MedPrompt trigger if it exists
				var triggerIdToDelete = (
					triggerId.indexOf('+' + self.appCfg.staticOrDefault.updateWidget.widgetState.nonResponsive.TTLinMins + 'min') != -1
					? triggerId 
					: triggerId + '+' + self.appCfg.staticOrDefault.updateWidget.widgetState.nonResponsive.TTLinMins + 'min'
				);
				self.log('Deleting reminder trigger; ID = ' + triggerIdToDelete, fn);
				self.deleteTrigger(triggerIdToDelete);

				// set the widget to its Neutral state
				// self.setWidgetToNeutralState();
				self.log('EXITING',fn);
			},


			/**
			 * OK (or, yes) button on an EMA dialog is pressed.
			 * @param  {[type]} codeFromPrnm) {            var fn = 'onEMAYes'; PurpleRobot.log('ENTERED: ' + fn + '; codeFromPrnm = ' + codeFromPrnm); eval('' + codeFromPrnm [description]
			 * @return {[type]}               [description]
			 */
			onEMAYes: function(codeFromPrnm) { var fn = 'onEMAYes'; PurpleRobot.log('ENTERED: ' + fn + '; codeFromPrnm = ' + codeFromPrnm); eval('' + codeFromPrnm);
				// ACTION: take user to "" page
				
				// if a dynamicOrModified URL is set (e.g. by the app), then use that, else, use the staticOrDefault URL
				// self.debug('self.appCfg.staticOrDefault.transition.onEMAYes = ' + JSON.stringify(self.appCfg.staticOrDefault.transition.onEMAYes) + '; self.appCfg.dynamicOrModified.transition.onEMAYes = ' + JSON.stringify(self.appCfg.dynamicOrModified.transition.onEMAYes), fn);
				var staticActionCfgExists  = !self.isNullOrUndefined(self.appCfg.staticOrDefault.transition.onEMAYes),
						dynamicActionCfgExists = !self.isNullOrUndefined(self.appCfg.dynamicOrModified.transition.onEMAYes);
				var dynamicIsNull = dynamicActionCfgExists ? self.isNullOrUndefined(self.appCfg.dynamicOrModified.transition.onEMAYes[schedObj.name]) : true;
				// self.debug('staticActionCfgExists = ' + staticActionCfgExists + '; dynamicActionCfgExists = ' + dynamicActionCfgExists + '; dynamicIsNull = ' + dynamicIsNull, fn);
				if(dynamicIsNull && !staticActionCfgExists) { 
					throw 'ERROR: Cannot run ' + fn + ': both the static and dynamic app-configurations are missing.';
				}
				
				// self.debug('dynamicIsNull = ' + dynamicIsNull + '; self.appCfg.staticOrDefault.transition.onEMAYes[schedObj.name] = ' + JSON.stringify(self.appCfg.staticOrDefault.transition.onEMAYes[schedObj.name]) + '; self.appCfg.dynamicOrModified.transition.onEMAYes[schedObj.name] = ' + JSON.stringify(self.appCfg.dynamicOrModified.transition.onEMAYes[schedObj.name]), fn);
				var baseUrl = dynamicIsNull ? self.appCfg.staticOrDefault.transition.onEMAYes[schedObj.name] : self.appCfg.dynamicOrModified.transition.onEMAYes[schedObj.name];
				var url = baseUrl;

				// if this is the first trigger in the series, then delete the subsequent followup triggers, since this one has been responded-to.
				self.log('childTriggerId = ' + childTriggerId + 'childTriggerId == null = ' + (childTriggerId == null), fn);
				if(childTriggerId != null) {
					self.debug('in parent trigger: ' + triggerId + '; childTriggerId = ' + childTriggerId, fn);

					// add the deletion to the trigger-state array
					self.log('Getting the child trigger to delete; childTriggerId = ' + childTriggerId, fn);
					var trgDel = self.fetchTrigger(childTriggerId);
					var trgWithStateDel = appCfgGetTriggerState(fn, (self.appConfigCompletionStates()).CanceledByTrigger, url, trgDel);
					self.appCfg.triggerState = self.appCfg.triggerState != null ? self.appCfg.triggerState : [];
					self.appCfg.triggerState.push(trgWithStateDel);
					// delete the trigger
					self.log('Deleting followup trigger with ID: ' + childTriggerId, fn);
					self.deleteTrigger(childTriggerId);
					self.log('Deleted followup trigger with ID: ' + childTriggerId, fn);
				}

				self.log('Saving trigger state...', fn);
				self.appConfigUpsert(self.appCfg.staticOrDefault.namespace, self.appCfg.key, appCfg);

				// v2: we will save a currentAction value instead, which the PhoneGap/web app can use to internally route the user as-necessary
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
				
				self.log('EXITING',fn);
			}
			// ,


			// /**
			//  * Widget is pressed.
			//  * @param  {[type]} 							[description]
			//  * @return {[type]}               [description]
			//  */
			// onWidgetPress: function(codeFromPrnm) { var fn = 'onWidgetPress'; PurpleRobot.log('ENTERED: ' + fn + '; codeFromPrnm = ' + codeFromPrnm); eval('' + codeFromPrnm);
			// 	self.log('ENTERED', fn);

			// 	self.debug('Enumerated members of self: ' + _.keys(self), fn);

			// 	self.log('Getting next dose...', fn);
			// 	// var mostRecentDose = self.getNextDose(self.getSortedDoses());
			// 	var mostRecentDose = self.getMostRecentDose(self.getSortedDoses());
			// 	self.log('mostRecentDose = ' + JSON.stringify(mostRecentDose), fn);

			// 	// detect the widget state
			// 	self.log('Detecting current widget state...', fn);
			// 	var widgetValues = self.fetchWidget(self.appCfg.staticOrDefault.namespace);
			// 	var isInNonResponsiveState = widgetValues.message == self.appCfg.staticOrDefault.updateWidget.widgetState.neutral.message;

			// 	if(isInNonResponsiveState) {
			// 		self.log('Widget is in non-responsive state; setting currentAction for redirect within ' + self.appCfg.staticOrDefault.namespace + '...', fn);
			// 		// v2: we will save a currentAction value instead, which the PhoneGap/web app can use to internally route the user as-necessary
			// 		var currentAction = {
			// 			'triggerId': null,
			// 			'actionDstType': 'onWidgetPress',
			// 			'actionTime': mostRecentDose.dose.time,
			// 			'actionName': mostRecentDose.dose.medication
			// 		};
			// 		self.log('In namespace (' + self.appCfg.staticOrDefault.namespace + '), saving currentAction = ' + JSON.stringify(currentAction), fn);
			// 		self.appConfigUpsert(self.appCfg.staticOrDefault.namespace, 'currentAction', currentAction);				
			// 	}
			// 	else {
			// 		self.log('Widget not in non-responsive state; H2H/MA will not redirect.', fn);
			// 	}

			// 	// launch application
			// 	var applicationFullName = self.appCfg.staticOrDefault.appPackageName;
			// 	self.log('Launching application = ' + applicationFullName);
			// 	self.launchApplication(applicationFullName);

			// 	// // return the widget to Neutral state when pressed
			// 	// self.log('Setting the widget to the neutral state', fn);
			// 	// self.setWidgetToNeutralState();

			// 	// // [20131101, 2-4h] [ES] [ns] [PRNM] Need the widget, on click, to cancel the next +30min MedPrompt. This prevents the user from being prompted to take the MedPrompt survey twice.
			// 	// self.log('Getting delayed MedPrompt trigger ID for next dose datetime', fn);
			// 	// var triggerIdOfTriggerToDelete = self.getMedPromptTriggerIdDelayed(mostRecentDose.dose);

			// 	// // self.log('mostRecentDose = ' + JSON.stringify(mostRecentDose), fn);
			// 	// self.log('mostRecentDose.time = ' + mostRecentDose.dose.time, fn);
			// 	// self.log('self.appCfg.staticOrDefault.updateWidget.widgetState.nonResponsive.TTLinMins = ' + self.appCfg.staticOrDefault.updateWidget.widgetState.nonResponsive.TTLinMins, fn);
			// 	// var dateTimeOfDoseMinusDelay = (self.genDateFromTime(mostRecentDose.dose.time)).addMinutes(-(self.appCfg.staticOrDefault.updateWidget.widgetState.nonResponsive.TTLinMins));
			// 	// self.log('dateTimeOfDoseMinusDelay = ' + dateTimeOfDoseMinusDelay, fn);
			// 	// var shouldDelete = (new Date() > dateTimeOfDoseMinusDelay);
			// 	// self.log('Should delete trigger (' + triggerIdOfTriggerToDelete + ')? = ' + shouldDelete);
			// 	// if(shouldDelete) {
			// 	// 	self.log('Deleting trigger: ' + triggerIdOfTriggerToDelete, fn);
			// 	// 	self.deleteTrigger(triggerIdOfTriggerToDelete);
			// 	// }
				
			// 	self.log('EXITING', fn);
			// }

		};

	
	// the exports object gets the constructor function, which the calling function will call to instantiate this object.
	exports.ctor = ctor;

	return ctor;

});


var passedToActions = typeof exports === 'undefined' ? this['Actions'] = {} : exports;

var Actions = new ActionsFn(passedToActions);
exports = Actions.ctor;