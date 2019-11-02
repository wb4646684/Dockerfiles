@echo off

set _EXECJAVA="%JRE_HOME%\bin\java.exe"
call "%CATALINA_HOME%\bin\check-java"
if errorlevel 1 exit /b 1

if %JAVA_VERSION% GEQ 9 (
	goto javaNewGcParams
) else (
	goto javaOldGcParams
)

:javaOldGcParams
rem the GC parameters must match the ones in set-gc-params.bat
set GC_JVM_PARAMETERS=-XX:+PrintGCDetails;-XX:+PrintGCDateStamps;-XX:+PrintGCTimeStamps;-XX:+PrintGCCause;-XX:+UseGCLogFileRotation;-XX:NumberOfGCLogFiles=5;-XX:GCLogFileSize=20M;-Xloggc:%CATALINA_HOME%\logs\atlassian-jira-gc-%%t.log
goto javaGcParamsDone


:javaNewGcParams
rem the GC parameters must match the ones in set-gc-params.bat
set GC_JVM_PARAMETERS=-Xlog:gc*:file=.\logs\atlassian-jira-gc-%%t.log:time,uptime:filecount=5,filesize=20M;-XX:+UseParallelGC
goto javaGcParamsDone


:javaGcParamsDone
