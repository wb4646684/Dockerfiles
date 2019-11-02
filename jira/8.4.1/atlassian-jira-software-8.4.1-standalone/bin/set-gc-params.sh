#!/bin/sh

GC_JVM_PARAMETERS=""

if [ $java_version -ge 9 ]
then
    # In Java 9, GC logging has been re-implemented using the Unified GC logging framework.
    # See http://openjdk.java.net/jeps/158 or https://docs.oracle.com/javase/10/jrockit-hotspot/logging.htm
    GC_JVM_PARAMETERS="-Xlog:gc*:file=$LOGBASEABS/logs/atlassian-jira-gc-%t.log:time,uptime:filecount=5,filesize=20M ${GC_JVM_PARAMETERS}"
    GC_JVM_PARAMETERS="-XX:+UseParallelGC ${GC_JVM_PARAMETERS}"
else
    # Set the JVM arguments used to start JIRA. For a description of the options, see
    # http://www.oracle.com/technetwork/java/javase/tech/vmoptions-jsp-140102.html

    #-----------------------------------------------------------------------------------
    # This allows us to actually debug GC related issues by correlating timestamps
    # with other parts of the application logs.
    #-----------------------------------------------------------------------------------
    GC_JVM_PARAMETERS="-XX:+PrintGCDetails -XX:+PrintGCDateStamps -XX:+PrintGCTimeStamps -XX:+PrintGCCause ${GC_JVM_PARAMETERS}"
    GC_JVM_PARAMETERS="-Xloggc:$LOGBASEABS/logs/atlassian-jira-gc-%t.log -XX:+UseGCLogFileRotation -XX:NumberOfGCLogFiles=5 -XX:GCLogFileSize=20M ${GC_JVM_PARAMETERS}"
fi

CATALINA_OPTS="${GC_JVM_PARAMETERS} ${CATALINA_OPTS}"
export CATALINA_OPTS
