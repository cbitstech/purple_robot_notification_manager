#!/bin/bash

TESTS="tests/PurpleRobotNotificationManagerTests.js"
TESTABLE="PurpleRobotNotificationManager.js"
DST="/home/samba/dev/metamorphoo/static/output_files/H2H"
MOHR="/mnt/mohrlab_wwwroot"
PROJBASE="proj"
ACTIONS="actions"



echo "***** Copying actions code..."
PROJ="h2h"
mkdir -p "$PROJBASE/$PROJ/$ACTIONS"
cp -rvp "$MOHR/$PROJ/pr_triggers/actions.js" "$PROJBASE/$PROJ/$ACTIONS/"

PROJ="ma"
mkdir -p "$PROJBASE/$PROJ/$ACTIONS"
cp -rvp "$MOHR/$PROJ/pr_triggers/actions.js" "$PROJBASE/$PROJ/$ACTIONS/"

PROJ="hepc"
mkdir -p "$PROJBASE/$PROJ/$ACTIONS"
cp -rvp "$MOHR/$PROJ/pr_triggers/actions.js" "$PROJBASE/$PROJ/$ACTIONS/"


echo
if [ "$#" -eq 1 ]; then
	echo "***** Running tests matching '$1' in: $TESTS"
	mocha -u tdd "$TESTS" -g "$1"
else
	echo "***** Running all tests in: $TESTS"
	mocha -u tdd "$TESTS"
fi
echo
echo "***** Copying (without '//' comment lines): $TESTABLE --> $DST"
# cp -vp "$TESTABLE" "$DST"
# cat "$TESTABLE" | sed -e 's/.*\/\/.*//g' > "$DST/$TESTABLE"
cat "$TESTABLE" | sed -r -e "s/\s+\/\/.*//g" | sed -r -e "s/^\/\/.*$//g" > "$DST/$TESTABLE"



