#!/bin/bash

# CONSTS
DST_H2H="/home/samba/dev/metamorphoo/static/output_files/H2H"
DST_MA="/home/samba/dev/metamorphoo/static/output_files/MA"

TESTS="tests/PurpleRobotNotificationManagerTests.js"
TESTABLE="PurpleRobotNotificationManager.js"
MOHR="/mnt/mohrlab_wwwroot"
PROJBASE="proj"
ACTIONS="actions"



# COPY ACTIONS CODE (to put them within proj scope for Github commit)
# TODO: replace this copy-paste nastiness with function and array
echo "***** For each known project: Copying actions code..."
PROJ="h2h"
mkdir -p "$PROJBASE/$PROJ/$ACTIONS"
cp -rvp "$MOHR/$PROJ/pr_triggers/actions.js" "$PROJBASE/$PROJ/$ACTIONS/$ACTIONS.js.tmp"
# remove '//' comment lines from actions code 
cat "$PROJBASE/$PROJ/$ACTIONS/$ACTIONS.js.tmp" | sed -r -e "s/\s+\/\/.*//g" | sed -r -e "s/^\/\/.*$//g" > "$PROJBASE/$PROJ/$ACTIONS/$ACTIONS.js"

PROJ="ma"
mkdir -p "$PROJBASE/$PROJ/$ACTIONS"
cp -rvp "$MOHR/$PROJ/pr_triggers/actions.js" "$PROJBASE/$PROJ/$ACTIONS/$ACTIONS.js.tmp"
# remove '//' comment lines from actions code 
cat "$PROJBASE/$PROJ/$ACTIONS/$ACTIONS.js.tmp" | sed -r -e "s/\s+\/\/.*//g" | sed -r -e "s/^\/\/.*$//g" > "$PROJBASE/$PROJ/$ACTIONS/$ACTIONS.js"

PROJ="hepc"
mkdir -p "$PROJBASE/$PROJ/$ACTIONS"
cp -rvp "$MOHR/$PROJ/pr_triggers/actions.js" "$PROJBASE/$PROJ/$ACTIONS/$ACTIONS.js.tmp"
# remove '//' comment lines from actions code 
cat "$PROJBASE/$PROJ/$ACTIONS/$ACTIONS.js.tmp" | sed -r -e "s/\s+\/\/.*//g" | sed -r -e "s/^\/\/.*$//g" > "$PROJBASE/$PROJ/$ACTIONS/$ACTIONS.js"



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


#DEPRECATED; PRNM cross-project file-read now occurs in Metamorphoo's server.js
# remove '//' comment lines from PRNM code and copy
# echo "***** Copying (without '//' comment lines): $TESTABLE --> $DST_H2H"
# cat "$TESTABLE" | sed -r -e "s/\s+\/\/.*//g" | sed -r -e "s/^\/\/.*$//g" > "$DST_H2H/$TESTABLE"
# echo "***** Copying (without '//' comment lines): $TESTABLE --> $DST_MA"
# cat "$TESTABLE" | sed -r -e "s/\s+\/\/.*//g" | sed -r -e "s/^\/\/.*$//g" > "$DST_MA/$TESTABLE"



