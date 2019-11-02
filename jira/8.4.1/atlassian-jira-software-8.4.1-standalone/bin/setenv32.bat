rem --------------------------------------------------------------------------
rem Note: If running JIRA as a Service, settings in this file have no
rem effect. See http://confluence.atlassian.com/display/JIRA/Increasing+JIRA+memory
rem
rem --------------------------------------------------------------------------

rem --------------------------------------------------------------------------
rem
rem One way to set the JIRA HOME path is here via this variable.  Simply uncomment it and set a valid path like c:\jira\home.  You can of course set it outside in the command terminal.  That will also work.
rem
rem JIRA_HOME=""
rem --------------------------------------------------------------------------



rem --------------------------------------------------------------------------
rem
rem  Occasionally Atlassian Support may recommend that you set some specific JVM arguments.  You can use this variable below to do that.
rem
rem --------------------------------------------------------------------------
set JVM_SUPPORT_RECOMMENDED_ARGS=


rem --------------------------------------------------------------------------
rem
rem The following 2 settings control the minimum and maximum given to the JIRA Java virtual machine.  In larger JIRA instances, the maximum amount will need to be increased.
rem
rem --------------------------------------------------------------------------
set JVM_MINIMUM_MEMORY=384m
set JVM_MAXIMUM_MEMORY=768m

rem --------------------------------------------------------------------------
rem
rem The following setting configures the size of JVM code cache.  A high value of reserved size allows Jira to work with more installed apps.
rem
rem --------------------------------------------------------------------------
set JVM_CODE_CACHE_ARGS=-XX:InitialCodeCacheSize=32m -XX:ReservedCodeCacheSize=512m

rem --------------------------------------------------------------------------
rem
rem The following are the required arguments for JIRA.
rem
rem --------------------------------------------------------------------------
set JVM_REQUIRED_ARGS=-Djava.awt.headless=true -Datlassian.standalone=JIRA -Dorg.apache.jasper.runtime.BodyContentImpl.LIMIT_BUFFER=true -Dmail.mime.decodeparameters=true -Dorg.dom4j.factory=com.atlassian.core.xml.InterningDocumentFactory

rem --------------------------------------------------------------------------
rem Uncomment this setting if you want to import data without notifications
rem
rem --------------------------------------------------------------------------
rem set DISABLE_NOTIFICATIONS= -Datlassian.mail.senddisabled=true -Datlassian.mail.fetchdisabled=true -Datlassian.mail.popdisabled=true


rem --------------------------------------------------------------------------
rem
rem In general don't make changes below here
rem
rem --------------------------------------------------------------------------

rem --------------------------------------------------------------------------
rem Prevents the JVM from suppressing stack traces
rem if a given type of exception occurs frequently,
rem which could make it harder for support to diagnose a problem.
rem --------------------------------------------------------------------------
set JVM_EXTRA_ARGS=-XX:-OmitStackTraceInFastThrow -Djava.locale.providers=COMPAT

set _PRG_DIR=%~dp0
type "%_PRG_DIR%\jirabanner.txt"

set JIRA_HOME_MINUSD=
IF "x%JIRA_HOME%x" == "xx" GOTO NOJIRAHOME
     set JIRA_HOME_MINUSD=-Djira.home="%JIRA_HOME%"
:NOJIRAHOME

set JAVA_OPTS=%JAVA_OPTS% -Xms%JVM_MINIMUM_MEMORY% -Xmx%JVM_MAXIMUM_MEMORY% %JVM_CODE_CACHE_ARGS% %JVM_REQUIRED_ARGS% %DISABLE_NOTIFICATIONS% %JVM_SUPPORT_RECOMMENDED_ARGS% %JVM_EXTRA_ARGS% %JIRA_HOME_MINUSD% %START_JIRA_JAVA_OPTS%


rem Checks if the JAVA_HOME has a space in it (can cause issues)
SET _marker="x%JAVA_HOME%"
SET _marker=%_marker: =%
IF NOT %_marker% == "x%JAVA_HOME%" ECHO JAVA_HOME "%JAVA_HOME%" contains spaces. Please change to a location without spaces if this causes problems.

rem DO NOT remove the following line
rem !INSTALLER SET JAVA_HOME

echo.
echo If you encounter issues starting or stopping JIRA, please see the Troubleshooting guide at https://docs.atlassian.com/jira/jadm-docs-084/Troubleshooting+installation
echo.
IF "x%JIRA_HOME%x" == "xx" GOTO NOJIRAHOME2
    echo Using JIRA_HOME:       %JIRA_HOME%
:NOJIRAHOME2
