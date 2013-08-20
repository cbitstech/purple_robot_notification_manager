#!/bin/bash

#chmod u+x runUnitTests.bash  && ./runUnitTests.bash && scp -rp * bitnami@165.124.171.88:/www/purple_robot_notification_manager/PurpleRobotNotificationManager
HOST=app2.cbits.northwestern.edu
chmod u+x runUnitTests.bash  && ./runUnitTests.bash && scp -rp * bitnami@$HOST:/www/purple_robot_notification_manager/PurpleRobotNotificationManager
