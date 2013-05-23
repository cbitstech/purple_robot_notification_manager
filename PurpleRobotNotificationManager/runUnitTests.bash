#!/bin/bash

TESTS="tests/PurpleRobotNotificationManagerTests.js"
TESTABLE="PurpleRobotNotificationManager.js"
DST="/home/samba/dev/metamorphoo/static/output_files/H2H"

if [ "$#" -eq 1 ]; then
	echo "***** Running tests matching '$1' in: $TESTS"
	mocha -u tdd "$TESTS" -g "$1"
else
	echo "***** Running all tests in: $TESTS"
	mocha -u tdd "$TESTS"
fi
echo "***** Copying (without '//' comment lines): $TESTABLE --> $DST"
# cp -vp "$TESTABLE" "$DST"
# cat "$TESTABLE" | sed -e 's/.*\/\/.*//g' > "$DST/$TESTABLE"
cat "$TESTABLE" | sed -r -e "s/\s+\/\/.*//g" | sed -r -e "s/^\/\/.*$//g" > "$DST/$TESTABLE"
