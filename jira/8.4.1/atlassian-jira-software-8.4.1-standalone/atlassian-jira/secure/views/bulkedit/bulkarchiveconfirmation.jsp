<%@ page import="com.atlassian.jira.util.BrowserUtils,
                 com.atlassian.jira.web.action.issue.bulkedit.BulkArchive"%>
<%@ page import="com.atlassian.jira.web.bean.BulkEditBean" %>
<%@ taglib uri="webwork" prefix="ww" %>
<%@ taglib uri="webwork" prefix="ui" %>
<%@ taglib uri="sitemesh-page" prefix="page" %>
<html>
<head>
	<title><ww:text name="'bulkedit.title'"/></title>
</head>
<body>
    <!-- Step 4 - Bulk Operation: Confirmation for Archive -->
    <ui:soy moduleKey="'com.atlassian.auiplugin:soy'" template="'aui.page.pageHeader'">
        <ui:param name="'content'">
            <ui:soy moduleKey="'com.atlassian.auiplugin:soy'" template="'aui.page.pageHeaderMain'">
                <ui:param name="'content'">
                    <h1><ww:text name="'bulkedit.title'"/></h1>
                </ui:param>
            </ui:soy>
        </ui:param>
    </ui:soy>
    <ui:soy moduleKey="'com.atlassian.auiplugin:soy'" template="'aui.page.pagePanel'">
        <ui:param name="'id'" value="'stepped-process'" />
        <ui:param name="'content'">
            <ui:soy moduleKey="'com.atlassian.auiplugin:soy'" template="'aui.page.pagePanelNav'">
                <ui:param name="'content'">
                    <jsp:include page="/secure/views/bulkedit/bulkedit_leftpane.jsp" flush="false" />
                </ui:param>
            </ui:soy>
            <ui:soy moduleKey="'com.atlassian.auiplugin:soy'" template="'aui.page.pagePanelContent'">
                <ui:param name="'content'">
                    <ui:soy moduleKey="'com.atlassian.auiplugin:soy'" template="'aui.page.pageHeader'">
                        <ui:param name="'content'">
                            <ui:soy moduleKey="'com.atlassian.auiplugin:soy'" template="'aui.page.pageHeaderMain'">
                                <ui:param name="'content'">
                                    <h2><ww:text name="'bulkedit.step4'"/>: <ww:text name="'bulkedit.step4.title'"/></h2>
                                </ui:param>
                            </ui:soy>
                        </ui:param>
                    </ui:soy>
                    <%-- Set this so that it can be used further down --%>
                    <ww:property value="/" id="bulkEdit" />
                    <%
                        BulkArchive bulkEdit = (BulkArchive) request.getAttribute("bulkEdit");
                        BulkEditBean bulkEditBean = bulkEdit.getBulkEditBean();
                    %>
                    <p>
                        <%
                            int subtasksCount = bulkEditBean.getSelectedIssuesIncludingSubTasks().size() - bulkEditBean.getSelectedIssues().size();
                            if (subtasksCount > 0) {
                        %>
                            <ww:text name="'bulk.archive.confirmation.issues.count.with.subtasks'">
                                <ww:param name="'value0'"><strong><ww:property value="/bulkEditBean/selectedIssues/size"/></strong></ww:param>
                                <ww:param name="'value1'"><strong><ww:property value="<%=String.valueOf(subtasksCount)%>"/></strong></ww:param>
                            </ww:text>
                        <% } else { %>
                            <ww:text name="'bulk.archive.confirmation.issues.count'">
                                <ww:param name="'value0'"><strong><ww:property value="/bulkEditBean/selectedIssues/size"/></strong></ww:param>
                            </ww:text>
                        <% }

                            if (bulkEditBean.isServiceDeskProjectIssuesPresent() && bulkEditBean.isSoftwareProjectIssuesPresent()) {
                        %>
                            <ww:text name="'bulk.archive.confirmation.software.and.servicedesk'"/>
                        <%
                            } else if (bulkEditBean.isServiceDeskProjectIssuesPresent()) {
                        %>
                            <ww:text name="'bulk.archive.confirmation.servicedesk'"/>
                        <%
                            } else if (bulkEditBean.isSoftwareProjectIssuesPresent()) {
                        %>
                            <ww:text name="'bulk.archive.confirmation.software'"/>
                        <%
                            } else {
                        %>
                            <ww:text name="'bulk.archive.confirmation.core'"/>
                        <% } %>
                    </p>
                    <ul>
                        <li><ww:text name="'bulk.archive.confirmation.line1'"/></li>
                        <li><ww:text name="'bulk.archive.confirmation.line2'"/></li>
                        <li><ww:text name="'bulk.archive.confirmation.line3'"/></li>
                    </ul>
                    <p>
                        <a href="<%=bulkEdit.getHelpUrl()%>"
                           target="_jirahelp"
                           data-track-click="bulk.archive.help.click"
                           title="<ww:text name="'bulk.archive.learn.more'"/>"
                        >
                            <ww:text name="'bulk.archive.learn.more'"/><ww:property value="/getHelpUrl()"/>
                        </a>
                    </p>

                    <!-- Send Mail confirmation -->
                    <ww:if test="/canDisableMailNotifications() == true && /bulkEditBean/hasMailServer == true">
                        <jsp:include page="/includes/bulkedit/bulkedit-sendnotifications-confirmation.jsp"/>
                    </ww:if>

                    <page:applyDecorator id="bulkarchive" name="auiform">
                        <page:param name="action">BulkArchivePerform.jspa</page:param>
                        <page:param name="useCustomButtons">true</page:param>

                        <p>
                            <input class="aui-button" id="confirm" type="submit" name="<ww:text name="'common.forms.confirm'"/>" value="<ww:text name="'common.forms.confirm'"/>"
                                accessKey="<ww:text name="'common.forms.submit.accesskey'"/>"
                                title="<ww:text name="'common.forms.submit.tooltip'">
                                <ww:param name="'value0'"><ww:text name="'common.forms.submit.accesskey'"/></ww:param>
                                <ww:param name="'value1'"><%=BrowserUtils.getModifierKey()%></ww:param>
                                </ww:text>"
                                data-track-click="bulk.archive.confirmation.submit.click"
                            />
                            <a class="aui-button aui-button-link"
                               id="cancel" href="<ww:url value="'BulkCancelWizard.jspa'" atltoken="false"/>"
                               data-track-click="bulk.archive.confirmation.cancel.click"
                            >
                                <ww:text name="'common.forms.cancel'"/>
                            </a>
                        </p>
                        <ui:issuetable layoutBean="<%=bulkEdit.getIssueTableLayoutBean()%>"
                                       issues="<%=bulkEditBean.getSelectedIssuesIncludingSubTasks()%>"/>

                        <p>
                            <input class="aui-button" type="submit" name="<ww:text name="'common.forms.confirm'"/>" value="<ww:text name="'common.forms.confirm'"/>"
                                accessKey="<ww:text name="'common.forms.submit.accesskey'"/>"
                                title="<ww:text name="'common.forms.submit.tooltip'">
                                <ww:param name="'value0'"><ww:text name="'common.forms.submit.accesskey'"/></ww:param>
                                <ww:param name="'value1'"><%=BrowserUtils.getModifierKey()%></ww:param>
                                </ww:text>"
                                data-track-click="bulk.archive.confirmation.submit.click"
                            />
                            <a class="aui-button aui-button-link"
                               id="cancel-bottom" href="<ww:url value="'BulkCancelWizard.jspa'" atltoken="false"/>"
                               data-track-click="bulk.archive.confirmation.cancel.click"
                            >
                                <ww:text name="'common.forms.cancel'"/>
                            </a>
                        </p>
                        <ww:component name="'atl_token'" value="/xsrfToken" template="hidden.jsp"/>
                    </page:applyDecorator>
                </ui:param>
            </ui:soy>
        </ui:param>
    </ui:soy>
</body>
</html>
