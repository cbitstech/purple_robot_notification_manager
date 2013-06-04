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



			onMedPromptYes: function(codeFromPrnm, p2) { var fn = 'onMedPromptYes'; PurpleRobot.log('ENTERED: ' + fn + '; codeFromPrnm = ' + codeFromPrnm);
				eval('' + codeFromPrnm);


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

	

	exports.ctor = ctor;

	return ctor;







});


var passedToActions = typeof exports === 'undefined' ? this['Actions'] = {} : exports;

var Actions = new ActionsFn(passedToActions);
exports = Actions.ctor;


