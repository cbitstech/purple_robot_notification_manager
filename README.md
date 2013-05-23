purple_medication
=================
Add to this over time...

PurpleRobotNotificationManager (PRNM) is a Purple Robot Javascript library designed to manage user-notifications for medication adherence applications.

While designed for PR, for the purpose of automated-testability and reuse in all execution contexts, PRNM can run in:

* Purple Robot on Android
* Node.js (how unit-tests are written)
* Browser

To run all unit tests:
	
	./runUnitTests.bash

To run a specific unit test:
	
	./runUnitTests.bash "{regex pattern matching the test title}"

To run PRNM in PR, you must in-general create a function which installs a trigger on PR. In this function or set of functions:
	
1) Define a PRNM config object.

	var prnmCfg = {
    "env": {
      "userCfg": {
        "namespace": projName,
        "key": "userCfg"
      }
    }
  };
	
1) Create a trigger object (name and ID can be e.g. "Purple Robot Notification Manager"). Ordinarily, this trigger will run periodically, so you might define a datetime_repeat like this:
		
	"datetime_repeat": "FREQ=MINUTELY;INTERVAL=5;UNTIL=20140101T000000"
		
1) Then, in the "action" of the trigger:
		
	1) Insert the text of the PurpleRobotNotificationManager.js file.

	1) After the PRNM text, insert the following code:
		var prnm = exports.ctor(" + JSON.stringify(prnmConfig) + ");
		prnm.main();

The main() function executes whatever functionality must be performed periodically.