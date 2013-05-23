var _ = require('underscore');
var assert = require('assert');
var cases = require('cases');
var fs = require('fs');

require('../date.js');
var PurpleRobotNotificationManager = require('../PurpleRobotNotificationManager.js');

var testable = new PurpleRobotNotificationManager.ctor(
  {
    "env": {
      // "selected": 1,
      "userCfg": {
        "namespace": "",
        "key": "cfgs/TestyMcTesterson.userCfg.json.txt"
      }
    }
  });
// console.log("PurpleRobotNotificationManager.test()",PurpleRobotNotificationManager.test());
// console.log("testable.test()",testable.test());


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
      var actual = testable.test();
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


    test('iCalToDate: must convert each valid ICal-formatted date must be converted to a JS Date instance', cases([
        ["20130521T182031",[2013,4,21,18,20,31]],
        ["20130303T040506",[2013,2,3,4,5,6]]
      ],
        function(iCalStr, expectedDateParts) {
          var actual = testable.iCalToDate(iCalStr);
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
    test(
      'isUserAvailable: should return true/false given the last parameter in each case-array',
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
          var actual = testable.isUserAvailable(
            testData, Date.today().set({hour:h,minute:m,second:s})
          );
          assert.equal(actual, expected);
        }
      )
    );


    test('getUserCfg: should return user-config contents', function() {
      var actual = testable.getUserCfg();
      assert.notEqual(actual,null);
    });


    test('getAllDoseTimes: must get a set of 3 dose times', function() {
      var actual = testable.getAllDoseTimes();
      assert.equal(actual.length,3);
      console.log('actual',actual);
    });
    test('getAllDoseTimes: dose time formatting must match nn:nn:nn', function() {
      var actual = testable.getAllDoseTimes();
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
          var actual = testable.isTimeForDose(allDoseTimes, currTime, {seconds:59});
          assert.equal(actual, expected);
        }
      )
    );


    test('getRandomDateTimeWithinRange', cases([
      [[9,0,0], [10,0,0], true]
      ], function(startTimeParts, endTimeParts, expected) {
        var startDate = Date.today().set({hour:startTimeParts[0],minute:startTimeParts[1],second:startTimeParts[2]});
        var endDate = Date.today().set({hour:endTimeParts[0],minute:endTimeParts[1],second:endTimeParts[2]});
        var actual = testable.getRandomDateTimeWithinRange(startDate, endDate);        
        // must always be true
        assert.equal(actual.between(startDate, endDate), true);
      })
    );
    test('getRandomDateTimeWithinRange: 2 consecutive randomly-selected times must not be the same (within the available value-space and to the degree of PRNG randomness)', cases([
      [[9,0,0], [10,0,0], true]
      ], function(startTimeParts, endTimeParts, expected) {
        var startDate = Date.today().set({hour:startTimeParts[0],minute:startTimeParts[1],second:startTimeParts[2]});
        var endDate = Date.today().set({hour:endTimeParts[0],minute:endTimeParts[1],second:endTimeParts[2]});
        var actual1 = testable.getRandomDateTimeWithinRange(startDate, endDate);        
        var actual2 = testable.getRandomDateTimeWithinRange(startDate, endDate);        
        // must be true to whatever degree of certainty the JS interpreter's PRNG provides...
        assert.notEqual(actual1, actual2);
      })
    );

    test('getQuotedAndDelimitedStr', cases([
      [['a'], "\'a\'" ]
      ,[['b', 'c', 'd'], "\'b\',\'c\',\'d\'"]
      ,[['datetime','MedPrompt','Yes','No','PurpleRobot.loadUrl("http://mohrlab.northwestern.edu/h2h/");',null], "\'datetime\',\'MedPrompt\',\'Yes\',\'No\',\'PurpleRobot.loadUrl(\"http://mohrlab.northwestern.edu/h2h/\");\',\'null\'"]
      ], function(paramsArray, expected) {
        var actual = testable.getQuotedAndDelimitedStr(paramsArray,',');
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
        var actual = testable.setEMATrigger('setEMATrigger test', sd, ed, ud);
      })
    );


    test('setAllMedPrompts', cases([
      [[[9,0,0],[10,0,0],[11,0,0]], true]
      ], function(arr, expected) {
        var sd = Date.today().set({hour:arr[0][0],minute:arr[0][1],second:arr[0][2]});
        var ed = Date.today().set({hour:arr[1][0],minute:arr[1][1],second:arr[1][2]});
        var ud = Date.today().set({hour:arr[2][0],minute:arr[2][1],second:arr[2][2]});
        var actual = testable.setAllMedPrompts();
      })
    );


    test('main', function() {
      var actual = testable.main();
    });

});
