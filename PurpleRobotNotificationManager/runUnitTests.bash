#!/bin/bash

# CONSTS
DST_H2H="/home/samba/dev/metamorphoo/static/output_files/H2H"
DST_MA="/home/samba/dev/metamorphoo/static/output_files/MA"

TESTS="tests/PurpleRobotNotificationManagerTests.js"
PRNMDEV="PurpleRobotNotificationManager.dev.js"
PRNM="PurpleRobotNotificationManager.js"
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

# PROJ="hepc"
# mkdir -p "$PROJBASE/$PROJ/$ACTIONS"
# cp -rvp "$MOHR/$PROJ/pr_triggers/actions.js" "$PROJBASE/$PROJ/$ACTIONS/$ACTIONS.js.tmp"
# # remove '//' comment lines from actions code 
# cat "$PROJBASE/$PROJ/$ACTIONS/$ACTIONS.js.tmp" | sed -r -e "s/\s+\/\/.*//g" | sed -r -e "s/^\/\/.*$//g" > "$PROJBASE/$PROJ/$ACTIONS/$ACTIONS.js"


#echo "20140307, ES: FILE-COPY FROM mohrlab.northwestern.edu DISABLED DUE TO FIREWALL SETTINGS BY EUGENE. NOT COPYING actions.js FILES!!!!"


# update the code file from the dev version
# cat "$PRNMDEV" | sed -r -e "s/\s+\/\/.*//g" | sed -r -e "s/^\/\/.*$//g" > "$PRNM"
yui-compressor "$PRNMDEV" > "$PRNM"
# cat "$PRNMDEV" > "$PRNM"



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
# echo "***** Copying (without '//' comment lines): $PRNM --> $DST_H2H"
# cat "$PRNM" | sed -r -e "s/\s+\/\/.*//g" | sed -r -e "s/^\/\/.*$//g" > "$DST_H2H/$PRNM"
# echo "***** Copying (without '//' comment lines): $PRNM --> $DST_MA"
# cat "$PRNM" | sed -r -e "s/\s+\/\/.*//g" | sed -r -e "s/^\/\/.*$//g" > "$DST_MA/$PRNM"



