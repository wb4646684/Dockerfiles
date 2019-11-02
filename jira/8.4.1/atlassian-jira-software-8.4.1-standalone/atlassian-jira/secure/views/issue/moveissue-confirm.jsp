<%@ page import="com.atlassian.jira.component.ComponentAccessor" %>
<%@ page import="com.atlassian.jira.plugin.keyboardshortcut.KeyboardShortcutManager" %>
<%@ taglib uri="webwork" prefix="ww" %>
<%@ taglib uri="webwork" prefix="ui" %>
<%@ taglib uri="webwork" prefix="iterator" %>
<%@ taglib uri="sitemesh-page" prefix="page" %>
<ww:bean id="fieldVisibility" name="'com.atlassian.jira.web.bean.FieldVisibilityBean'" />
<html>
<head>
	<title><ww:if test="subTask == true"><ww:text name="'movesubtask.title'"/></ww:if><ww:else><ww:text name="'moveissue.title'"/></ww:else>: <ww:property value="issue/string('key')" /></title>
    <%
        KeyboardShortcutManager keyboardShortcutManager = ComponentAccessor.getComponent(KeyboardShortcutManager.class);
        keyboardShortcutManager.requireShortcutsForContext(KeyboardShortcutManager.Context.issuenavigation);
    %>
    <link rel="index" href="<ww:url value="/issuePath" atltoken="false" />" />
</head>
<body>
    <page:applyDecorator name="bulkops-general">
        <page:param name="pageTitle"><ww:text name="'moveissue.title'"/></page:param>
        <page:param name="navContentJsp"><ww:if test="subTask == true">/secure/views/issue/movetaskpane.jsp</ww:if><ww:else>/secure/views/issue/moveissuepane.jsp</ww:else></page:param>

            <page:applyDecorator name="jiraform">
                <page:param name="action">MoveIssueConfirm.jspa</page:param>
                <page:param name="columns">1</page:param>
                <page:param name="cancelURI"><ww:url value="/issuePath" atltoken="false"/></page:param>
                <page:param name="submitId">move_submit</page:param>
                <page:param name="submitName"><ww:text name="'common.forms.move'"/></page:param>
                <page:param name="width">100%</page:param>
                <page:param name="autoSelectFirst">false</page:param>
                <page:param name="title">
                    <ww:if test="subTask == true">
                        <ww:text name="'movesubtask.title'"/>: <ww:text name="'moveissue.confirm'"/>
                    </ww:if>
                    <ww:else>
                        <ww:text name="'moveissue.title'"/>: <ww:text name="'moveissue.confirm'"/>
                    </ww:else>
                </page:param>
                <page:param name="description">
                    <ww:text name="'moveissue.confirm.desc.ent'"/>
                    <ww:if test="subTasks/empty == false">
                        <p>
                            <ww:text name="'movesubtask.loss.of.data'">
                                <ww:param name="'value0'"><span class="warning"></ww:param>
                                <ww:param name="'value0'"></span></ww:param>
                            </ww:text>
                        </p>
                    </ww:if>
                </page:param>
                <tr>
                    <td>
                        <ww:if test="removeFields/empty == false">
                            <div class="aui-message aui-message-warning" data-track-pageview="issue.move.warning.pageview">
                                <p>
                                    <ww:if test="userAdmin == true">
                                        <ww:text name="'moveissue.warning.content.admin'"/>
                                        <a href="<ww:property value="/customFieldContextHelpUrl"/>" target="_blank" data-track-pageview="issue.move.warning.learn.more.pageview" data-track-click="issue.move.warning.learn.more.click"><ww:text name="'moveissue.warning.learn.more'"/></a>
                                    </ww:if>
                                    <ww:else>
                                        <ww:text name="'moveissue.warning.content.user'"/>
                                    </ww:else>
                                </p></div>
                            </div>
                        </ww:if>

                        <table id="move_confirm_table" class="aui">
                            <thead>
                                <tr>
                                    <th width="20%">&nbsp;</th>
                                    <th width="40%"><ww:text name="'moveissue.originalvalue'"/></th>
                                    <th width="40%"><ww:text name="'moveissue.newvalue'"/></th>
                                </tr>
                            </thead>
                            <tbody>
                            <!-- Breaking page into smaller parts - JRA-5059 -->
                            <jsp:include page="/secure/views/issue/moveissue-confirm-part1.jsp" flush="false" />

                            <%-- Show all the fields that have changed for the move --%>
                            <ww:if test="confimationFieldLayoutItems/empty == false">
                                <tr data-track-pageview="issue.move.fields.pageview">
                                    <th><ww:text name="'moveissue.fields'"/></th>
                                    <th colspan="2">&nbsp;</th>
                                </tr>
                            </ww:if>
                            <ww:iterator value="confimationFieldLayoutItems">
                                <tr>
                                    <td><ww:property value="/fieldName(./orderableField)" /></td>
                                    <td>
                                        <span><ww:property value="oldViewHtml(./orderableField)" escape="'false'" /></span>
                                    </td>
                                    <td>
                                        <span><ww:property value="newViewHtml(./orderableField)" escape="'false'" /></span>
                                    </td>
                                </tr>
                            </ww:iterator>
                            <%-- Show all the fields that will be removed --%>
                            <ww:if test="removeFields/empty == false">
                                <tr data-track-pageview="issue.move.removefields.pageview">
                                    <th><ww:text name="'moveissue.removed.fields'"/></th>
                                    <th colspan="2">&nbsp;</th>
                                </tr>
                            </ww:if>
                            <ww:iterator value="removeFields">
                                <tr>
                                    <td><ww:property value="/fieldName(.)" /></td>
                                    <td>
                                        <span><ww:property value="oldViewHtml(.)" escape="'false'" /></span>
                                    </td>
                                    <td>
                                        <i><ww:text name="'moveissue.removed'"/></i>
                                    </td>
                                </tr>
                            </ww:iterator>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <%-- Do not put these in the MoveIssueBean --%>
                <ui:component name="'confirm'" value="'true'" template="hidden.jsp" />
                <ui:component name="'id'" template="hidden.jsp" />
            </page:applyDecorator>

    </page:applyDecorator>
</body>
</html>
