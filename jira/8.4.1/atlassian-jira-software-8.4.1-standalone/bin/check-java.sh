#!/bin/sh

#
# check for correct java version by parsing out put of java -version
# we expect first line to be in format 'java version "1.8.0_161"' or 'java version "10.0.1" 2018-04-17'
# or 'openjdk version "11-ea" 2018-09-25' and assert that version number will be 8 or 11 (if enabled)
# or sth like 'Picked up JDK_JAVA_OPTIONS:' (which we need to skip)
#

java_raw_version=`echo "$($_RUNJAVA -version 2>&1)" | grep -v "JDK_JAVA_OPTIONS" | grep "version" | awk '{ print substr($3, 2, length($3)-2); }'`
java_version=0

if [[ $java_raw_version = *-ea* ]]
then
	# early access format e.g 11-ea
    IFS='-' read -a values <<< "$java_raw_version"
    java_version=${values[0]}
else
	if [[ $java_raw_version = 1.* ]]
	then
		# old format e.g. 1.8.0_161
	    IFS='.' read -a values <<< "$java_raw_version"
		java_version=${values[1]}
	else
		# new format e.g. 10.0.1
		IFS='.' read -a values <<< "$java_raw_version"
		java_version=${values[0]}
	fi
fi

if [ $java_version -ne 8 ] && [ $java_version -ne 11 ]
then
  echo "****************************************************************************"
  echo "*******      Wrong JVM version! JIRA requires 1.8 or 11 to run.      *******"
  echo "****************************************************************************"
  echo "***"
  echo "*** Output of java -version command is:"
  $_RUNJAVA -version 2>&1
  echo "*** (End of output) ***"
  exit 1
fi