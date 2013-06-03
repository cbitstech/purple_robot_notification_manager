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

			test: function() {
		  	self.log('ENTERED actions.ctor.prototype.test...')
	      return 'hello world from actions.test';
			},



			onMedPromptYes: function(codeFromPrnm, p2) { var fn = 'onMedPromptYes'; PurpleRobot.log('ENTERED: ' + fn + '; codeFromPrnm = ' + codeFromPrnm);
				eval('' + codeFromPrnm);
				// debug('DEBUG FUNCTION FROM PRNM WORKS!!', fn);
				// debug('p2 = ' + p2, fn);
				PurpleRobot.launchUrl('http://www.google.com');
			},

			onMedPromptNo: function(codeFromPrnm) { var fn = 'onMedPromptNo'; PurpleRobot.log('ENTERED: ' + fn + '; codeFromPrnm = ' + codeFromPrnm);

			},

			onEMAYes: function(codeFromPrnm) { var fn = 'onEMAYes'; PurpleRobot.log('ENTERED: ' + fn + '; codeFromPrnm = ' + codeFromPrnm);

			},

			onEMANo: function(codeFromPrnm) { var fn = 'onEMANo'; PurpleRobot.log('ENTERED: ' + fn + '; codeFromPrnm = ' + codeFromPrnm);

			},

			onWidgetPress: function(codeFromPrnm) { var fn = 'onWidgetPress'; PurpleRobot.log('ENTERED: ' + fn + '; codeFromPrnm = ' + codeFromPrnm);

			}

		};

	
	// the exports object gets the constructor function, which the calling function will call to instantiate this object.
	exports.ctor = ctor;

	return ctor;

// })();

// // test that actions functions work
// // PurpleRobot.log(actions.test());  // test 1
// // actions.onMedPromptYes();				 // test 2

});


var passedToActions = typeof exports === 'undefined' ? this['Actions'] = {} : exports;

var Actions = new ActionsFn(passedToActions);
exports = Actions.ctor;
// Actions = (function() { return (new ActionsFn(passedToActions);) }) ();
// exports = Actions;
