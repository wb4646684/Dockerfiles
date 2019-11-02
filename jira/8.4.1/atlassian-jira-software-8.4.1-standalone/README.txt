----------------------------------------------
Jira 8.4.1-#804002 README
----------------------------------------------

Thank you for downloading Jira 8.4.1. This distribution comes with a
built-in Tomcat 8.5.42 application server, so it runs (almost)
out of the box.

BRIEF INSTALL GUIDE
-------------------

Full documentation:
http://docs.atlassian.com/jira/jadm-docs-084/Installing+Jira+applications

1. Install Oracle's Java Development Kit (JDK) or Java Runtime
   Environment (JRE) 8, or AdoptOpenJDK 8.

   http://www.oracle.com/technetwork/java/javase/downloads/index.html
   https://adoptopenjdk.net/

2. Set the JAVA_HOME variable to where you installed Java.

   See the following instructions for details:
   http://docs.atlassian.com/jira/jadm-docs-084/Installing+Java

3. Set your Jira home directory.

   See the following instructions for details:
   http://docs.atlassian.com/jira/jadm-docs-084/Setting+your+Jira+application+home+directory

4. Start Jira by running one of the following files:
   (Windows) 'bin\start-jira.bat'
   (Linux) 'bin\start-jira.sh'

5. Go to http://localhost:8080/
   You should see Jira's setup wizard.


BRIEF UPGRADE GUIDE
-------------------

You can reconnect your existing database and Jira home directory to this
instance, and start using Jira in a new version.

Full documentation:
http://docs.atlassian.com/jira/jadm-docs-084/Upgrading+Jira+applications

Before you begin:

-  Complete the pre-upgrade steps that include running a Jira health check,
   checking app compatibility, and backing up your Jira instance.

   See the following instructions for details:
   http://docs.atlassian.com/jira/jadm-docs-084/Preparing+for+the+upgrade

1. Stop your existing Jira instance.

2. Set your Jira home directory.

   See the following instructions for details:
   http://docs.atlassian.com/jira/jadm-docs-084/Setting+your+Jira+application+home+directory

3. If you're using an Oracle or MySQL database, download the database driver
   and place it in <this-directory>/lib.

   Supported drivers:
   http://docs.atlassian.com/jira/jadm-docs-084/Supported+platforms

4. Re-apply any modifications you've made to Jira files in your previous
   version. These may include JVM arguments, connection settings, memory
   allocation, and so on.

5. Disable automatic reindex by adding the following flag
   to the jira-config.properties file. Remember that you'll need to later
   manually reindex Jira by going to Administration > System > Indexing.

   File: <jira-home-directory>/jira-config.properties
   Flag: upgrade.reindex.allowed=false

6. Start Jira by running one of the following files:
   (Windows) 'bin\start-jira.bat'
   (Linux) 'bin\start-jira.sh'

7. Go to http://localhost:8080/


PROBLEMS?
---------

A common startup problem is when another program has claimed port 8080, which
Jira is configured to run on by default. To avoid this port conflict, Jira's
port can be changed in conf/server.xml.

If you encounter any problems, please create a support request at:
http://support.atlassian.com


QUESTIONS?
----------

Try the docs at:
http://docs.atlassian.com/jira/jadm-docs-084/

or ask at Atlassian Community:
https://community.atlassian.com/


-----------------------------------------------------------
Happy issue tracking and thank you for using Jira!
- The Atlassian Team
-----------------------------------------------------------