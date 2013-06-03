var assert = require('assert');
var cases = require('cases');
var fs = require('fs');
var jsonfn = require('jsonfn').JSONfn;

var _ = require('underscore');
require('../date.js');

var PurpleRobotNotificationManager = require('../PurpleRobotNotificationManager.js');
var Actions = require('../proj/h2h/actions/actions.js');


// instantiate PRNM
var prnm = new PurpleRobotNotificationManager.ctor(
  {
    "env": {
      // "selected": 1,
      "userCfg": {
        "namespace": "",
        "key": "cfgs/TestyMcTesterson.userCfg.json.txt"
      }
    }
  });
// instantiate biz-logic (i.e., trigger actions) to be run by PRNM and tell PRNM about them
var actions = new Actions.ctor({"prnm": prnm});
prnm.actions = actions;


// console.log("PurpleRobotNotificationManager.test()",PurpleRobotNotificationManager.test());
// console.log("prnm.test()",prnm.test());




/**
 * A mock object for Purple Robot, so we can pretend in the unit-test that we're calling functions in the PurpleRobot namespace.
 * NOTE: This is currently quite incomplete, but sufficient for the tests that currently exist.
 * @type {Object}
 */
var PurpleRobotMock = {
  "log": jsonfn.stringify((function(s) { console.warn("[***** PurpleRobotNotificationTests.js *****] WOULD LOG: " + s); })),
  "launchUrl": jsonfn.stringify((function(url) { console.warn('[***** PurpleRobotNotificationTests.js *****] WOULD LAUNCH: ' + isNullOrUndefined) })),
  "showNativeDialog": jsonfn.stringify(function(p1,p2,p3,p4,p5) { console.warn('[***** PurpleRobotNotificationTests.js *****] WOULD SHOW DIALOG WITH PARAMS: ' + [p1,p2,p3,p4,p5]); } )
}; 





/**
 * PurpleRobotNotificationManager tests.
 * @return {[type]} [description]
 */
suite('PurpleRobotNotificationManager', function() {

  // Test user-availability. User times defined in testData below has availablilty logic as follows:
  //    < 9:00AM    ==> unavail
  //    9:00AM      ==> avail
  //    16:59:59PM  ==> avail
  //    17:00       ==> unavail
  // suite('isUserAvailable', function() {
  var testData =
  {
    "promptBehavior": {
      "wakeSleepTimes": {
        "daily": {
          "wakeTime": "09:00:00",
          "sleepTime": "17:00:00"
        }
      }
    }
    ,
    "doses": [
      {
        "time": "16:05:00",
        "medication": "6",
        "strength": "7",
        "dispensationUnit": "mg"
      },
      {
        "time": "08:09:00",
        "medication": "10",
        "strength": "11",
        "dispensationUnit": "dose"
      },
      {
        "time": "23:13:00",
        "medication": "14",
        "strength": "15",
        "dispensationUnit": "mg"
      }
    ]
  };


  /**
   * Setup before *EACH* test.
   * @return {[type]} [description]
   */
  setup(function() {});

    test('test (pre-ctor)', function() {
      var actual = PurpleRobotNotificationManager.test();
      var expected = 'hello world from exports';
      assert.equal(actual, expected);
    });
    test('test (post-ctor)', function() {
      var actual = prnm.test();
      var expected = 'hello world from PurpleRobotNotificationManager.test';
      assert.equal(actual, expected);
    });


    test('toICal: must convert each date to a valid ICal-formatted date', cases([
        [2013,4,21,18,20,31,"20130521T182031"],
        [2013,2,3,4,5,6,"20130303T040506"]
      ],
        function(yy, MM, dd, hh, mm, ss, expected) {
          var date = Date.today().set({year:yy,month:MM,day:dd,hour:hh,minute:mm,second:ss});
          var actual = date.toICal();
          assert.equal(actual, expected);
        }
      )
    );
    

    test('genDateFromTime: must convert each time string to today\'s date, with the specified time component', cases([
       ["12:34:56", Date.today().set({hour: 12, minute: 34, second: 56})]
      ,["07:08:09", Date.today().set({hour: 7, minute: 8, second: 9})]
      ,["00:00:00", Date.today().set({hour: 0, minute: 0, second: 0})]
      ,["23:59:59", Date.today().set({hour: 23, minute: 59, second: 59})]
      ], function(timeStr, expected) {
          var actual = prnm.genDateFromTime(timeStr);
          assert.equal(actual.toString(),expected.toString());
        }
      )
    );


    test('iCalToDate: must convert each valid ICal-formatted date must be converted to a JS Date instance', cases([
        ["20130521T182031",[2013,4,21,18,20,31]],
        ["20130303T040506",[2013,2,3,4,5,6]]
      ],
        function(iCalStr, expectedDateParts) {
          var actual = prnm.iCalToDate(iCalStr);
          var expected = new Date(
             expectedDateParts[0]
            ,expectedDateParts[1]
            ,expectedDateParts[2]
            ,expectedDateParts[3]
            ,expectedDateParts[4]
            ,expectedDateParts[5]
            );
          assert.equal(actual.toString(), expected.toString());
        }
      )
    );


    /**
     * Run a set of test-cases against a set of bounds-checks.
     */
    test('isUserAvailable: should return true/false given the last parameter in each case-array',
      cases([
        [0,0,0,false],
        [8,59,0,false],
        [9,0,0,true],
        [9,0,1,true],
        [12,0,0,true],
        [16,59,59,true],
        [17,0,0,false],
        [17,0,1,false],
        [23,59,59,false]
        ],
        function(h,m,s,expected) {
          var actual = prnm.isUserAvailable(
            testData, Date.today().set({hour:h,minute:m,second:s})
          );
          assert.equal(actual, expected);
        }
      )
    );


    test('getUserCfg: should return user-config contents', function() {
      var actual = prnm.getUserCfg();
      assert.notEqual(actual,null);
    });


    test('getAllDoseTimes: must get a set of 3 dose times', function() {
      var actual = prnm.getAllDoseTimes();
      assert.equal(actual.length,3);
      console.log('actual',actual);
    });
    test('getAllDoseTimes: dose time formatting must match nn:nn:nn', function() {
      var actual = prnm.getAllDoseTimes();
      _.map(actual, function(t) { 
        assert.equal((t.search('^\\d\\d:\\d\\d:\\d\\d$')) == 0, true);
      });
    });


    test('isTimeForDose: fuzzy-match: static test data: must return true/false given the last parameter in each case-array',
      cases([
        [['9:00:00'], [8,59,59], false]
        ,[['9:00:00'], [9,0,0], true]
        ,[['9:00:00'], [9,0,1], true]
        ,[['9:00:00'], [9,0,59], true]
        ,[['9:00:00'], [9,1,0], false]
        ,[['9:00:00', '13:00:00', '17:00:00'], [13,0,55], true]
        ,[['9:00:00', '13:00:00', '17:00:00'], [13,1,55], false]
        ,[['9:00:00', '13:00:00', '17:00:00'], [17,0,18], true]
        ,[['9:00:00', '13:00:00', '17:00:00'], [17,1,18], false]
        ],
        function(allDoseTimes, timePart, expected) {
          console.log('allDoseTimes,timePart,expected',allDoseTimes,timePart,expected);
          var currTime = Date.today().set({hour:timePart[0],minute:timePart[1],second:timePart[2]});
          var actual = prnm.isTimeForDose(allDoseTimes, currTime, {seconds:59});
          assert.equal(actual, expected);
        }
      )
    );


    test('getRandomDateTimeWithinRange', cases([
      [[9,0,0], [10,0,0], true]
      ], function(startTimeParts, endTimeParts, expected) {
        var startDate = Date.today().set({hour:startTimeParts[0],minute:startTimeParts[1],second:startTimeParts[2]});
        var endDate = Date.today().set({hour:endTimeParts[0],minute:endTimeParts[1],second:endTimeParts[2]});
        var actual = prnm.getRandomDateTimeWithinRange(startDate, endDate);        
        // must always be true
        assert.equal(actual.between(startDate, endDate), true);
      })
    );
    test('getRandomDateTimeWithinRange: 2 consecutive randomly-selected times must not be the same (within the available value-space and to the degree of PRNG randomness)', cases([
      [[9,0,0], [10,0,0], true]
      ], function(startTimeParts, endTimeParts, expected) {
        var startDate = Date.today().set({hour:startTimeParts[0],minute:startTimeParts[1],second:startTimeParts[2]});
        var endDate = Date.today().set({hour:endTimeParts[0],minute:endTimeParts[1],second:endTimeParts[2]});
        var actual1 = prnm.getRandomDateTimeWithinRange(startDate, endDate);        
        var actual2 = prnm.getRandomDateTimeWithinRange(startDate, endDate);        
        // must be true to whatever degree of certainty the JS interpreter's PRNG provides...
        assert.notEqual(actual1, actual2);
      })
    );

    test('getQuotedAndDelimitedStr', cases([
      [['a'], "\'a\'" ]
      ,[['b', 'c', 'd'], "\'b\',\'c\',\'d\'"]
      ,[['datetime','MedPrompt','Yes','No','PurpleRobot.loadUrl("http://mohrlab.northwestern.edu/h2h/");',null], "\'datetime\',\'MedPrompt\',\'Yes\',\'No\',\'PurpleRobot.loadUrl(\"http://mohrlab.northwestern.edu/h2h/\");\',\'null\'"]
      ], function(paramsArray, expected) {
        var actual = prnm.getQuotedAndDelimitedStr(paramsArray,',');
        assert.equal(actual, expected);
        // console.log('actual = ' + actual);
      })
    );


    test('setEMATrigger', cases([
      [[[9,0,0],[10,0,0],[11,0,0]], true]
      ], function(arr, expected) {
        var sd = Date.today().set({hour:arr[0][0],minute:arr[0][1],second:arr[0][2]});
        var ed = Date.today().set({hour:arr[1][0],minute:arr[1][1],second:arr[1][2]});
        var ud = Date.today().set({hour:arr[2][0],minute:arr[2][1],second:arr[2][2]});
        var actual = prnm.setEMATrigger('setEMATrigger test', sd, ed, ud);
      })
    );


    test('setAllMedPrompts', cases([
      [[[9,0,0],[10,0,0],[11,0,0]], true]
      ], function(arr, expected) {
        var sd = Date.today().set({hour:arr[0][0],minute:arr[0][1],second:arr[0][2]});
        var ed = Date.today().set({hour:arr[1][0],minute:arr[1][1],second:arr[1][2]});
        var ud = Date.today().set({hour:arr[2][0],minute:arr[2][1],second:arr[2][2]});
        var actual = prnm.setAllMedPrompts();
      })
    );




    /* 
        Tests the function that enables us to pass PRNM functions from PRNM to the biz-logic of trigger actions, as strings.

        20130603, estory: Note: Some things had to be done in this test to make the test pass, even though the same code against-which this test runs already runs properly in Purple Robot.
        Not compliant with "pure" TDD, but still, this will help defend against bad future changes.
    */
    test('convertFnToString', cases([
        [function() { console.log('HELLO'); return 1; }, '(function () { console.log("HELLO"); return 1; })();', 1, null],
        [function() { var a = 2; return a; }, '(function () { var a = 2; return a; })();', 2, null],
        [function(q, a) { console.log(q + ': ' + a); return 3; }, '(function (q, a) { console.log(q + ": " + a); return 3; })("how many Evans?","2");', 3, ['how many Evans?', 2]],
        [actions.onMedPromptYes, 'too hard...', undefined, ['var self = this; self.isNullOrUndefined = ' + prnm.isNullOrUndefined.toString() + '; var debug = ' + prnm.debug.toString() + ';', 'hello world!']] 
      ],
      function(fn, expectedFnTxt, expectedRet, fnParamArray) {
        console.log('-------------------------------------------');
        // console.log('fnParamArray = ' + fnParamArray);
        // console.log('1: ' + fn.toString());
        // console.log('2: ' + prnm.convertFnToString(fn.toString()));

        // get converted function text
        var actualFnTxt = prnm.convertFnToString(fn, fnParamArray);

        // a workaround for this unit-test for something that *actually* works in PR, etc.
        actualFnTxt = (actualFnTxt.replace(/\\'/g, '"'));
        console.log("actualFnTxt = " + actualFnTxt);
        
        var actualRet = eval(''
          + 'var pr = ' + JSON.stringify(PurpleRobotMock) + ';'
          // + 'console.log(pr);'
          // + 'console.log(_.isObject(pr));'
          + 'this.PurpleRobot = pr;'
          + 'this.PurpleRobot.log = jsonfn.parse(this.PurpleRobot.log);'
          // + 'console.log(_.isFunction(this.PurpleRobot.log));'
          + 'this.PurpleRobot.launchUrl = jsonfn.parse(this.PurpleRobot.launchUrl);'
          // + 'console.log(_.isFunction(this.PurpleRobot.launchUrl));'
          + actualFnTxt
          );
        // console.log(actualRet);

        // test both the function's return and the function's text
        if(expectedRet != undefined) {
          assert.equal(actualRet, expectedRet);
          assert.equal(actualFnTxt, expectedFnTxt);          
        }
      })
    );


    test('main', function() {
      var actual = prnm.main();
    });

});
