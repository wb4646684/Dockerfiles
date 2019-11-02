<%@ taglib uri="webwork" prefix="ww"  %>
<%@ taglib uri="webwork" prefix="aui"  %>
<%@ taglib uri="sitemesh-page" prefix="page" %>
<%@ taglib prefix="jira" uri="jiratags" %>
<jira:web-resource-require modules="jira.webresources:logging"/>

<html>
<head>
	<title><ww:text name="'admin.loggingandprofiling.logging.and.profiling'"/></title>
    <meta name="admin.active.section" content="admin_system_menu/top_system_section/troubleshooting_and_support"/>
    <meta name="admin.active.tab" content="logging_profiling"/>
</head>

<body>
<%--
   General Logging Section

   Part of JRA-14513
--%>
<%-- error messages --%>
<ww:if test="hasErrorMessages == 'true'">
    <aui:component template="auimessage.jsp" theme="'aui'">
        <aui:param name="'messageType'">error</aui:param>
        <aui:param name="'titleText'"><ww:text name="'admin.common.words.errors'"/></aui:param>
        <aui:param name="'messageHtml'">
            <ul>
                <ww:iterator value="errorMessages">
                    <li><ww:property /></li>
                </ww:iterator>
            </ul>
        </aui:param>
    </aui:component>
</ww:if>

<%--
  Log Marking And Rollover
--%>
<div class="logging-container">
    <a name="marklogs"></a>
    <h3 class="formtitle"><ww:text name="'admin.loggingandprofiling.marklogs'"/></h3>
    <p><ww:text name="'admin.loggingandprofiling.marklogs.description'"/></p>

    <page:applyDecorator id="login-form" name="auiform">
        <page:param name="action">ViewLogging!markLogs.jspa</page:param>
        <page:param name="method">post</page:param>
        <page:param name="submitButtonName">mark</page:param>
        <page:param name="submitButtonText"><ww:text name="'admin.loggingandprofiling.marklogs.mark'"/></page:param>


        <page:applyDecorator name="auifieldgroup">
            <page:param name="description"><ww:text name="'admin.loggingandprofiling.marklogs.markmessage.description'"/></page:param>

            <aui:textfield id="'markMessage'" label="text('admin.loggingandprofiling.marklogs.markmessage')" mandatory="false" name="'markMessage'" theme="'aui'" value="/markMessage"/>
        </page:applyDecorator>

        <page:applyDecorator name="auifieldgroup">
            <page:param name="description"><ww:text name="'admin.loggingandprofiling.marklogs.rollover.description'"/></page:param>
            <aui:checkbox label="text('admin.loggingandprofiling.marklogs.rollover')" name="'rollOver'" fieldValue="'true'" theme="'aui'">
                <ww:if test="/rollOver == true">
                    <aui:param name="'checked'" value="'checked'"/>
                </ww:if>
            </aui:checkbox>
        </page:applyDecorator>


    </page:applyDecorator>
</div>

<%--
   HTTP Access Log Section
--%>
<div class="logging-container">
    <a name="http"></a>
    <h3 class="formtitle"><ww:text name="'admin.loggingandprofiling.httpaccesslog'"/></h3>
    <p><ww:text name="'admin.loggingandprofiling.httpaccesslog.description'"/></p>
    <ww:if test="/httpAccessLogEnabled == true">
        <div class="logging-main-group">
            <p>
                <ww:text name="'admin.loggingandprofiling.httpaccesslog.status'">
                    <ww:param name="'value0'"><span class="status-active"><ww:text name="'admin.common.words.on'"/></span></ww:param>
                </ww:text>
            </p>
            <ul class="optionslist">
                <li>
                    <ww:text name="'admin.loggingandprofiling.disable.httpaccesslog'">
                        <ww:param name="'value0'"><a id="disable_http_access" href="<ww:url page="ViewLogging!disableHttpAccessLog.jspa"></ww:url>"><strong></ww:param>
                        <ww:param name="'value1'"></strong></a></ww:param>
                    </ww:text>
                </li>
            </ul>
        </div>
        <ww:if test="/httpAccessLogIncludeImagesEnabled == true">
            <div class="logging-sub-group">
                <p>
            <ww:text name="'admin.loggingandprofiling.httpaccesslog.includeimages.status'">
                <ww:param name="'value0'"><span class="status-active"><ww:text name="'admin.common.words.on'"/></span></ww:param>
            </ww:text>
                </p>
            <ul class="optionslist">
                <li>
                <ww:text name="'admin.loggingandprofiling.disable.httpaccesslog.includeimages'">
                    <ww:param name="'value0'"><a id="disable_http_access_includeimages" href="<ww:url page="ViewLogging!disableHttpAccessLogIncludeImages.jspa"></ww:url>"><strong></ww:param>
                    <ww:param name="'value1'"></strong></a></ww:param>
                </ww:text>
                </li>
            </ul>
            </div>
        </ww:if>
        <ww:else>
            <div class="logging-sub-group">
                <p>
                    <ww:text name="'admin.loggingandprofiling.httpaccesslog.includeimages.status'">
                        <ww:param name="'value0'"><span class="status-inactive"><ww:text name="'admin.common.words.off'"/></span></ww:param>
                    </ww:text>
                </p>
                <ul class="optionslist">
                    <li>
                        <ww:text name="'admin.loggingandprofiling.enable.httpaccesslog.includeimages'">
                            <ww:param name="'value0'"><a id="enable_http_access_includeimages" href="<ww:url page="ViewLogging!enableHttpAccessLogIncludeImages.jspa"></ww:url>"><strong></ww:param>
                            <ww:param name="'value1'"></strong></a></ww:param>
                        </ww:text>
                    </li>
                </ul>
            </div>
        </ww:else>


        <ww:if test="/httpDumpLogEnabled == true">
            <div class="logging-sub-group">
                <p>
                    <ww:text name="'admin.loggingandprofiling.httpdumplog.status'">
                        <ww:param name="'value0'"><span class="status-active"><ww:text name="'admin.common.words.on'"/></span></ww:param>
                    </ww:text>
                </p>
                <ul class="optionslist">
                    <li>
                        <ww:text name="'admin.loggingandprofiling.disable.httpdumplog'">
                            <ww:param name="'value0'"><a id="disable_http_dump" href="<ww:url page="ViewLogging!disableHttpDumpLog.jspa"></ww:url>"><strong></ww:param>
                            <ww:param name="'value1'"></strong></a></ww:param>
                        </ww:text>
                    </li>
                </ul>
            </div>
        </ww:if>
        <ww:else>
            <div class="logging-sub-group">
                <p>
                    <ww:text name="'admin.loggingandprofiling.httpdumplog.status'">
                        <ww:param name="'value0'"><span class="status-inactive"><ww:text name="'admin.common.words.off'"/></span></ww:param>
                    </ww:text>
                </p>
                <ul class="optionslist">
                    <li>
                        <ww:text name="'admin.loggingandprofiling.enable.httpdumplog'">
                            <ww:param name="'value0'"><a id="enable_http_dump" href="<ww:url page="ViewLogging!enableHttpDumpLog.jspa"></ww:url>"><strong></ww:param>
                            <ww:param name="'value1'"></strong></a></ww:param>
                        </ww:text>
                    </li>
                </ul>
            </div>
        </ww:else>
    </ww:if>
    <ww:else>
        <div class="logging-main-group">
            <p>
                <ww:text name="'admin.loggingandprofiling.httpaccesslog.status'">
                    <ww:param name="'value0'"><span class="status-inactive"><ww:text name="'admin.common.words.off'"/></span></ww:param>
                </ww:text>
            </p>
        <ul class="optionslist">
            <li>
                <ww:text name="'admin.loggingandprofiling.enable.httpaccesslog'">
                    <ww:param name="'value0'"><a id="enable_http_access" href="<ww:url page="ViewLogging!enableHttpAccessLog.jspa"></ww:url>"><strong></ww:param>
                    <ww:param name="'value1'"></strong></a></ww:param>
                </ww:text>
            </li>
        </ul>
        </div>
    </ww:else>
</div>

<%--
   SQL Log Section
--%>
<div class="logging-container">
    <a name="sql"></a>
    <h3 class="formtitle"><ww:text name="'admin.loggingandprofiling.sqllog'"/></h3>
    <p><ww:text name="'admin.loggingandprofiling.sqllog.description'"/></p>
    <p><ww:text name="'admin.loggingandprofiling.sqllog.warning'"/></p>
    <ww:if test="/sqlLogEnabled == true">
        <div class="logging-main-group">
            <p>
                <ww:text name="'admin.loggingandprofiling.sqllog.status'">
                    <ww:param name="'value0'"><span class="status-active"><ww:text name="'admin.common.words.on'"/></span></ww:param>
                </ww:text>
            </p>
            <ul class="optionslist">
                <li>
                    <ww:text name="'admin.loggingandprofiling.disable.sqllog'">
                        <ww:param name="'value0'"><a id="disable_sql_log" href="<ww:url page="ViewLogging!disableSqlLog.jspa"></ww:url>"><strong></ww:param>
                        <ww:param name="'value1'"></strong></a></ww:param>
                    </ww:text>
                </li>
            </ul>
        </div>
        <ww:if test="/sqlDumpLogEnabled == true">
            <div class="logging-sub-group">
                <p>
                    <ww:text name="'admin.loggingandprofiling.sqldumplog.status'">
                        <ww:param name="'value0'"><span class="status-active"><ww:text name="'admin.common.words.on'"/></span></ww:param>
                    </ww:text>
                </p>
                <ul class="optionslist">
                    <li>
                        <ww:text name="'admin.loggingandprofiling.disable.sqldumplog'">
                            <ww:param name="'value0'"><a id="disable_sql_dump" href="<ww:url page="ViewLogging!disableSqlDumpLog.jspa"></ww:url>"><strong></ww:param>
                            <ww:param name="'value1'"></strong></a></ww:param>
                        </ww:text>
                    </li>
                </ul>
            </div>
        </ww:if>
        <ww:else>
            <div class="logging-sub-group">
                <p>
                    <ww:text name="'admin.loggingandprofiling.sqldumplog.status'">
                        <ww:param name="'value0'"><span class="status-inactive"><ww:text name="'admin.common.words.off'"/></span></ww:param>
                    </ww:text>
                </p>
                <ul class="optionslist">
                    <li>
                        <ww:text name="'admin.loggingandprofiling.enable.sqldumplog'">
                            <ww:param name="'value0'"><a id="enable_sql_dump" href="<ww:url page="ViewLogging!enableSqlDumpLog.jspa"></ww:url>"><strong></ww:param>
                            <ww:param name="'value1'"></strong></a></ww:param>
                        </ww:text>
                    </li>
                </ul>
            </div>
        </ww:else>
    </ww:if>
    <ww:else>
        <div class="logging-main-group">
            <p>
                <ww:text name="'admin.loggingandprofiling.sqllog.status'">
                    <ww:param name="'value0'"><span class="status-inactive"><ww:text name="'admin.common.words.off'"/></span></ww:param>
                </ww:text>
            </p>
            <ul class="optionslist">
                <li>
                    <ww:text name="'admin.loggingandprofiling.enable.sqllog'">
                        <ww:param name="'value0'"><a id="enable_sql_access" href="<ww:url page="ViewLogging!enableSqlLog.jspa"></ww:url>"><strong></ww:param>
                        <ww:param name="'value1'"></strong></a></ww:param>
                    </ww:text>
                </li>
            </ul>
        </div>
    </ww:else>
</div>

<%--
Profiling Access Log Section
--%>
<div class="logging-container">
    <a name="profiling"></a>
    <h3 class="formtitle"><ww:text name="'admin.loggingandprofiling.profiling'"/></h3>
    <p><ww:text name="'admin.loggingandprofiling.profiling.description'"/></p>
    <div class="logging-main-group">
        <ww:if test="/profilingEnabled == true">
            <p>
                <ww:text name="'admin.loggingandprofiling.profiling.status'">
                    <ww:param name="'value0'"><span class="status-active"><ww:text name="'admin.common.words.on'"/></span></ww:param>
                </ww:text>
            </p>
            <ul class="optionslist">
                <li>
                    <ww:text name="'admin.loggingandprofiling.disable.profiling'">
                        <ww:param name="'value0'"><a id="disable_profiling" href="<ww:url page="ViewLogging!disableProfiling.jspa"></ww:url>"><strong></ww:param>
                        <ww:param name="'value1'"></strong></a></ww:param>
                    </ww:text>
                </li>
            </ul>
        </ww:if>
        <ww:else>
            <p>
                <ww:text name="'admin.loggingandprofiling.profiling.status'">
                    <ww:param name="'value0'"><span class="status-inactive"><ww:text name="'admin.common.words.off'"/></span></ww:param>
                </ww:text>
            </p>
            <ul class="optionslist">
                <li>
                    <ww:text name="'admin.loggingandprofiling.enable.profiling'">
                        <ww:param name="'value0'"><a id="enable_profiling" href="<ww:url page="ViewLogging!enableProfiling.jspa"></ww:url>"><strong></ww:param>
                        <ww:param name="'value1'"></strong></a></ww:param>
                    </ww:text>
                </li>
            </ul>
        </ww:else>
    </div>
</div>
<div class="logging-container">
    <a name="mail"></a>
    <h3 class="formtitle"><ww:text name="'admin.loggingandprofiling.mail'"/></h3>

    <%-- outgoing mail --%>

    <p><ww:text name="'admin.loggingandprofiling.mail.logfile'">
        <ww:param name="'value0'"><strong><ww:text name="'admin.loggingandprofiling.mail.outgoing'"/></strong></ww:param>
        <ww:param name="'value1'"><ww:property value="./outgoingMailFirstLogFileName"/></ww:param>
    </ww:text></p>

    <ww:if test="/outgoingMailServerDefined == true">
        <div class="logging-main-group">
            <p>
                <ww:text name="'admin.loggingandprofiling.mail.currentstatus'">
                    <ww:param name="'value0'"><ww:text name="'admin.loggingandprofiling.mail.outgoing'"/></ww:param>
                    <ww:param name="'value1'">
                        <ww:if test="/outgoingMailLoggingEnabled == true">
                            <span class="status-active"><ww:text name="'admin.common.words.on'"/></span>
                        </ww:if>
                        <ww:else>
                            <span class="status-inactive"><ww:text name="'admin.common.words.off'"/></span>
                        </ww:else>
                    </ww:param>
                </ww:text>
            </p>

            <ww:if test="/outgoingMailLoggingEnabled == true">
                <ul class="optionslist">
                    <li>
                        <ww:text name="'admin.loggingandprofiling.mail.disable'">
                            <ww:param name="'value0'"><a id="disableOutgoingMailLogging" href="<ww:url page="ViewLogging!disableOutgoingMailLogging.jspa"></ww:url>"><strong></ww:param>
                            <ww:param name="'value1'"></strong></a></ww:param>
                            <ww:param name="'value2'"><ww:text name="'admin.loggingandprofiling.mail.outgoing'"/></ww:param>
                        </ww:text>
                    </li>
                </ul>
                <div class="logging-sub-group">
                    <ww:if test="/outgoingMailDebugEnabled == false">
                        <p>
                            <ww:text name="'admin.loggingandprofiling.mail.currentdebugstatus'">
                                <ww:param name="'value0'"><ww:text name="'admin.loggingandprofiling.mail.outgoing'"/></ww:param>
                                <ww:param name="'value1'"><span class="status-inactive"><ww:text name="'admin.common.words.off'"/></span></ww:param>
                            </ww:text>
                        </p>
                        <ul class="optionslist">
                            <li>
                                <ww:text name="'admin.loggingandprofiling.mail.enabledebugging'">
                                    <ww:param name="'value0'"><a id="enableOutgoingMailDebugging" href="<ww:url page="ViewLogging!enableOutgoingMailDebugging.jspa"></ww:url>"><strong></ww:param>
                                    <ww:param name="'value1'"></strong></a></ww:param>
                                </ww:text>
                            </li>
                        </ul>
                    </ww:if>
                    <ww:else>
                        <p>
                            <ww:text name="'admin.loggingandprofiling.mail.currentdebugstatus'">
                                <ww:param name="'value0'"><ww:text name="'admin.loggingandprofiling.mail.outgoing'"/></ww:param>
                                <ww:param name="'value1'"><span class="status-active"><ww:text name="'admin.common.words.on'"/></span></ww:param>
                            </ww:text>
                        </p>
                        <ul class="optionslist">
                            <li>
                                <ww:text name="'admin.loggingandprofiling.mail.disabledebugging'">
                                    <ww:param name="'value0'"><a id="disableOutgoingMailDebugging" href="<ww:url page="ViewLogging!disableOutgoingMailDebugging.jspa"></ww:url>"><strong></ww:param>
                                    <ww:param name="'value1'"></strong></a></ww:param>
                                </ww:text>
                            </li>
                        </ul>
                    </ww:else>
                </div>
            </ww:if>
            <ww:else>
                <ul class="optionslist">
                    <li>
                        <ww:text name="'admin.loggingandprofiling.mail.enable'">
                            <ww:param name="'value0'"><a id="enableOutgoingMailLogging" href="<ww:url page="ViewLogging!enableOutgoingMailLogging.jspa"></ww:url>"><strong></ww:param>
                            <ww:param name="'value1'"></strong></a></ww:param>
                            <ww:param name="'value2'"><ww:text name="'admin.loggingandprofiling.mail.outgoing'"/></ww:param>
                        </ww:text>
                    </li>
                </ul>
            </ww:else>
        </div>
    </ww:if>
    <ww:else>
        <aui:component template="auimessage.jsp" theme="'aui'">
            <aui:param name="'messageType'">info</aui:param>
            <aui:param name="'messageHtml'"><ww:text name="'admin.loggingandprofiling.mail.outgoing.no.servers.configured'"/>
                <ww:text name="'admin.loggingandprofiling.mail.configure.mail.server'">
                    <ww:param name="'value0'"><a href="AddSmtpMailServer!default.jspa"><strong></ww:param>
                    <ww:param name="'value1'"></strong></a></ww:param>
                </ww:text>
            </aui:param>
        </aui:component>
    </ww:else>
    <p>&nbsp;</p>

    <%-- incoming mail --%>
    <p>
        <ww:text name="'admin.loggingandprofiling.mail.logfile'">
            <ww:param name="'value0'"><strong><ww:text name="'admin.loggingandprofiling.mail.incoming'"/></strong></ww:param>
            <ww:param name="'value1'"><ww:property value="./incomingMailFirstLogFileName"/></ww:param>
        </ww:text>
    </p>
    <ww:if test="/incomingMailServerDefined == true">
        <div class="logging-main-group">
            <p>
                <ww:text name="'admin.loggingandprofiling.mail.currentstatus'">
                    <ww:param name="'value0'"><ww:text name="'admin.loggingandprofiling.mail.incoming'"/></ww:param>
                    <ww:param name="'value1'">
                        <ww:if test="/incomingMailLoggingEnabled == true">
                            <span class="status-active"><ww:text name="'admin.common.words.on'"/></span>
                        </ww:if>
                        <ww:else>
                            <span class="status-inactive"><ww:text name="'admin.common.words.off'"/></span>
                        </ww:else>
                    </ww:param>
                </ww:text>
            </p>

            <ww:if test="/incomingMailLoggingEnabled == true">
                <ul class="optionslist">
                    <li>
                        <ww:text name="'admin.loggingandprofiling.mail.disable'">
                            <ww:param name="'value0'"><a id="disableIncomingMailLogging" href="<ww:url page="ViewLogging!disableIncomingMailLogging.jspa"></ww:url>"><strong></ww:param>
                            <ww:param name="'value1'"></strong></a></ww:param>
                            <ww:param name="'value2'"><ww:text name="'admin.loggingandprofiling.mail.incoming'"/></ww:param>
                        </ww:text>
                    </li>
                </ul>
                <div class="logging-sub-group">
                    <ww:if test="/incomingMailDebugEnabled == false">
                        <p>
                            <ww:text name="'admin.loggingandprofiling.mail.currentdebugstatus'">
                                <ww:param name="'value0'"><ww:text name="'admin.loggingandprofiling.mail.incoming'"/></ww:param>
                                <ww:param name="'value1'"><span class="status-inactive"><ww:text name="'admin.common.words.off'"/></span></ww:param>
                            </ww:text>
                        </p>
                        <ul class="optionslist">
                            <li>
                                <ww:text name="'admin.loggingandprofiling.mail.enabledebugging'">
                                    <ww:param name="'value0'"><a id="enableIncomingMailDebugging" href="<ww:url page="ViewLogging!enableIncomingMailDebugging.jspa"></ww:url>"><strong></ww:param>
                                    <ww:param name="'value1'"></strong></a></ww:param>
                                </ww:text>
                            </li>
                        </ul>
                    </ww:if>
                    <ww:else>
                        <p>
                            <ww:text name="'admin.loggingandprofiling.mail.currentdebugstatus'">
                                <ww:param name="'value0'"><ww:text name="'admin.loggingandprofiling.mail.incoming'"/></ww:param>
                                <ww:param name="'value1'"><span class="status-active"><ww:text name="'admin.common.words.on'"/></span></ww:param>
                            </ww:text>
                        </p>
                        <ul class="optionslist">
                            <li>
                                <ww:text name="'admin.loggingandprofiling.mail.disabledebugging'">
                                    <ww:param name="'value0'"><a id="disableIncomingMailDebugging" href="<ww:url page="ViewLogging!disableIncomingMailDebugging.jspa"></ww:url>"><strong></ww:param>
                                    <ww:param name="'value1'"></strong></a></ww:param>
                                </ww:text>
                            </li>
                        </ul>

                    </ww:else>

                </div>
            </ww:if>
            <ww:else>
                <ul class="optionslist">
                    <li>
                        <ww:text name="'admin.loggingandprofiling.mail.enable'">
                            <ww:param name="'value0'"><a id="enableIncomingMailLogging" href="<ww:url page="ViewLogging!enableIncomingMailLogging.jspa"></ww:url>"><strong></ww:param>
                            <ww:param name="'value1'"></strong></a></ww:param>
                            <ww:param name="'value2'"><ww:text name="'admin.loggingandprofiling.mail.incoming'"/></ww:param>
                        </ww:text>
                    </li>
                </ul>
            </ww:else>
        </div>
    </ww:if>
    <ww:else>
        <aui:component template="auimessage.jsp" theme="'aui'">
            <aui:param name="'messageType'">info</aui:param>
            <aui:param name="'messageHtml'"><ww:text name="'admin.mailservers.no.pop.imap.servers.configured'"/>
                <ww:text name="'admin.loggingandprofiling.mail.configure.mail.server'">
                    <ww:param name="'value0'"><a href="AddPopMailServer!default.jspa"><strong></ww:param>
                    <ww:param name="'value1'"></strong></a></ww:param>
                </ww:text>
            </aui:param>
        </aui:component>
    </ww:else>
</div>
<div class="logging-container">
    <h3 class="formtitle"><ww:text name="'admin.loggingandprofiling.logging'"/></h3>
    <%--<p><ww:text name="'admin.loggingandprofiling.description'"/></p>--%>
    <p>
    <ww:text name="'admin.loggingandprofiling.note'">
        <ww:param name="'value0'"><i></ww:param>
        <ww:param name="'value1'"></i></ww:param>
        <ww:param name="'value2'"><br></ww:param>
    </ww:text>
    </p>
    <p><ww:text name="'admin.loggingandprofiling.loggers.general.description'"/></p>

    <p>
    <ul class="optionslist">
        <li>
        <ww:text name="'admin.loggingandprofiling.addcustomlogger.description'">
            <ww:param name="'value0'"><a id="add-custom-logger-link" href="#"><strong></ww:param>
            <ww:param name="'value1'"></strong></a></ww:param>
        </ww:text>
        </li>
    </ul>
    </p>

    <table class="aui aui-table-rowhover">
        <thead>
            <tr>
                <th><ww:text name="'admin.loggingandprofiling.package.name'"/></th>
                <th><ww:text name="'admin.loggingandprofiling.logging.level'"/></th>
                <th><ww:text name="'admin.loggingandprofiling.set.logging.level'"/></th>
            </tr>
        </thead>
        <tbody>
        <ww:property value="/rootLogger" >
            <tr>
                <td><i><ww:text name="'admin.common.words.default'"/></i></td>
                <td><strong><ww:property value="./level" /></strong></td>
                <td><jsp:include page="viewlogginglevels.jsp"/></td>
            </tr>
        </ww:property>
        <ww:iterator value="/loggers" status="'iteratorStatus'">
            <tr>
                <td><ww:property value="name" /></td>
                <td><strong><ww:property value="./level" /></strong></td>
                <td><jsp:include page="viewlogginglevels.jsp"/></td>
            </tr>
        </ww:iterator>
        </tbody>
    </table>
</div>
<%--minimazing javascript in jsp - the way to pass something which we can generate on the server side, but we don't want AJAX --%>
<script type="text/javascript">
    JIRA.loggingLevels = <ww:property value="./availableLevelsAsJson" escape="false"/>;
</script>
</body>
</html>

