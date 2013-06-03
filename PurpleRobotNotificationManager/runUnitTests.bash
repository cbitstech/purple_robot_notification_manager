#!/bin/bash

# CONSTS
TESTS="tests/PurpleRobotNotificationManagerTests.js"
TESTABLE="PurpleRobotNotificationManager.js"
DST="/home/samba/dev/metamorphoo/static/output_files/H2H"
MOHR="/mnt/mohrlab_wwwroot"
PROJBASE="proj"
ACTIONS="actions"



# COPY ACTIONS CODE
# TODO: replace this copy-paste nastiness with function and array
echo "***** For each known project: Copying actions code..."
PROJ="h2h"
mkdir -p "$PROJBASE/$PROJ/$ACTIONS"
cp -rvp "$MOHR/$PROJ/pr_triggers/actions.js" "$PROJBASE/$PROJ/$ACTIONS/$ACTIONS.tmp.js"
# remove '//' comment lines from actions code 
cat "$PROJBASE/$PROJ/$ACTIONS/$ACTIONS.tmp.js" | sed -r -e "s/\s+\/\/.*//g" | sed -r -e "s/^\/\/.*$//g" > "$PROJBASE/$PROJ/$ACTIONS/$ACTIONS.js"

PROJ="ma"
mkdir -p "$PROJBASE/$PROJ/$ACTIONS"
cp -rvp "$MOHR/$PROJ/pr_triggers/actions.js" "$PROJBASE/$PROJ/$ACTIONS/"
# remove '//' comment lines from actions code 
cat "$PROJBASE/$PROJ/$ACTIONS/$ACTIONS.tmp.js" | sed -r -e "s/\s+\/\/.*//g" | sed -r -e "s/^\/\/.*$//g" > "$PROJBASE/$PROJ/$ACTIONS/$ACTIONS.js"

PROJ="hepc"
mkdir -p "$PROJBASE/$PROJ/$ACTIONS"
cp -rvp "$MOHR/$PROJ/pr_triggers/actions.js" "$PROJBASE/$PROJ/$ACTIONS/"
# remove '//' comment lines from actions code 
cat "$PROJBASE/$PROJ/$ACTIONS/$ACTIONS.tmp.js" | sed -r -e "s/\s+\/\/.*//g" | sed -r -e "s/^\/\/.*$//g" > "$PROJBASE/$PROJ/$ACTIONS/$ACTIONS.js"



# RUN TESTS
echo
if [ "$#" -eq 1 ]; then
	echo "***** Running tests matching '$1' in: $TESTS"
	mocha --globals "PurpleRobot,isNullOrUndefined" -u tdd "$TESTS" -g "$1"
else
	echo "***** Running all tests in: $TESTS"
	mocha --globals "PurpleRobot,isNullOrUndefined" -u tdd "$TESTS"
fi
echo
echo "***** Copying (without '//' comment lines): $TESTABLE --> $DST"

# remove '//' comment lines from PRNM code 
cat "$TESTABLE" | sed -r -e "s/\s+\/\/.*//g" | sed -r -e "s/^\/\/.*$//g" > "$DST/$TESTABLE"



