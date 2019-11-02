@ECHO OFF

rem
rem check for correct java version by parsing out put of java -version
rem we expect first line to be in format 'java version "1.8.0_161"' or 'java version "10.0.1" 2018-04-17'
rem or 'openjdk version "11-ea" 2018-09-25' and assert that version number will be 8 or 11 (if enabled)
rem or sth like 'Picked up JDK_JAVA_OPTIONS:' (which we need to skip)
rem

for /f "tokens=*" %%a in ('%_EXECJAVA% -version 2^>^&1') do (
  for /f "tokens=3" %%b in ('echo %%a ^| find /V "JDK_JAVA_OPTIONS" ^| find "version"') do (
	set JAVA_RAW_VERSION=%%b
    goto raw_version
  )
)

:raw_version
if NOT DEFINED JAVA_RAW_VERSION goto wrong_version
set JAVA_RAW_VERSION=%JAVA_RAW_VERSION:"=%
for /f "delims=.-_ tokens=1-2" %%a in ("%JAVA_RAW_VERSION%") do (
  if /I "%%a" EQU "1" (
    set JAVA_VERSION=%%b
  ) else (
    set JAVA_VERSION=%%a
  )
  goto loaded_version
)
goto wrong_version

:loaded_version
IF %JAVA_VERSION% NEQ 8 (
  IF %JAVA_VERSION% NEQ 11 goto wrong_version
)

goto:eof

:wrong_version
echo ****************************************************************************
echo *******      Wrong JVM version! JIRA requires 1.8 or 11 to run.      *******
echo ****************************************************************************
echo ***
echo *** Output of java -version command is:
%_EXECJAVA% -version 2^>^&1
echo *** (End of output) ***
exit /b 1
