/*** H2H Actions definition ***/

var ActionsFn = (function(exports) { var fn = 'actions';
	// PurpleRobot.log('entered actions self-called fn...')

	  var ctor = function(d) { var fn = 'actions:ctor', self = ctor.prototype;
	    self.prnm = d.prnm;
			self.prnm.debug('entered; prnm = ' + JSON.stringify(self.prnm), fn);
	    self.data = d;

			self.prnm.debug('exiting...', fn);
			return ctor.prototype;
	  };


	  // *Actually* define the object whose members will be referenced...
	  ctor.prototype = {

	  	// FNGROUP: internal references
	  	self: null,
	  	data: null,
	  	// prnm: null,

			test: function() {
		  	self.log('entered actions.ctor.prototype.test...')
	      return 'hello world from actions.test';
			},



			returnOne: function() {
				var a = 1;

				return a;
			},

			onMedPromptYes: function(codeFromPrnm, p2) { var fn = 'onMedPromptYes';
				PurpleRobot.log('codeFromPrnm = ' + codeFromPrnm);
				eval('' + codeFromPrnm);
				debug('DEBUG FUNCTION FROM PRNM WORKS!!', fn);
				debug('p2 = ' + p2, fn);
				PurpleRobot.launchUrl('http://www.google.com');
			},

			onMedPromptNo: function() { var fn = 'onMedPromptNo';
				self.prnm.debug('entered', fn);

			},

			onEMAYes: function() { var fn = 'onEMAYes';
				self.prnm.debug('entered', fn);

			},

			onEMANo: function() { var fn = 'onEMANo';
				self.prnm.debug('entered', fn);

			},

			onWidgetPress: function() { var fn = 'onWidgetPress';
				self.prnm.debug('entered', fn);

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
