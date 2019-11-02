Purpose
-------

This directory is for source code that you wish to compile into your
JIRA distribution. For instance, it can be used to:

 - modify the Bugzilla or Mantis importer source:

http://docs.atlassian.com/jira/jadm-docs-084/Importing+Data+from+Bugzilla
http://docs.atlassian.com/jira/jadm-docs-084/Importing+Data+From+Mantis

 - customize/write a service to work with JIRA:

http://docs.atlassian.com/jira/jadm-docs-084/Services

 - Create or edit a JIRA plugin:

http://docs.atlassian.com/jira/jadm-docs-084/

People making substantial modifications should rather build JIRA from
source
(https://developer.atlassian.com/display/JIRADEV/Building+JIRA+from+source). The
plugin development kit
(https://developer.atlassian.com/display/DOCS/Set+up+the+Atlassian+Plugin+SDK+and+Build+a+Project)
should be preferred for serious plugin developers.


Instructions
------------

 - Download Apache Ant from http://ant.apache.org
 - Copy source into a src/ subdirectory
 - Copy resources into the etc/ subdirectory
 - Copy libraries into the lib/ directory
 - Run 'ant'. Files will be compiled and copied into the main webapp
   (../atlassian-jira/WEB-INF/classes/)


To get JIRA to automatically reload these files, edit
../conf/server.xml, and set reloadable="true".
