<%@ taglib uri="webwork" prefix="ww" %>
<%@ taglib uri="webwork" prefix="ui" %>
<%@ taglib uri="webwork" prefix="aui" %>
<%@ taglib uri="sitemesh-page" prefix="page" %>
<ww:bean name="'com.atlassian.jira.util.JiraDateUtils'" id="dateUtils" />
<html>
<head>
	<title><ww:text name="'admin.indexing.jira.indexing'"/></title>
    <ww:if test="/currentIndexTask/finished == false">
        <meta http-equiv="refresh" content="5">
    </ww:if>
    <meta name="admin.active.section" content="admin_system_menu/advanced_menu_section/advanced_section"/>
    <meta name="admin.active.tab" content="indexing"/>
</head>
<body>
    <page:applyDecorator name="jiraform">
        <page:param name="columns">1</page:param>
        <page:param name="action">IndexProgress.jspa</page:param>
        <page:param name="method">get</page:param>
        <page:param name="columns">1</page:param>
        <page:param name="width">100%</page:param>
        <page:param name="title"><ww:text name="'admin.indexing.reindexing'"/></page:param>
        <page:param name="helpURL">searchindex</page:param>
        <%--    <page:param name="helpDescription">with Indexing</page:param>--%>
        <page:param name="instructions">
            <ww:if test="/currentIndexTask/finished == true && /currentIndexTask/userWhoStartedTask == false">
                <aui:component template="auimessage.jsp" theme="'aui'">
                    <aui:param name="'messageType'">info</aui:param>
                    <aui:param name="'messageHtml'">
                        <p>
                            <ww:text name="'common.tasks.cant.acknowledge.task.you.didnt.start'">
                                <ww:param name="'value0'"><a href="<ww:property value="/currentIndexTask/userURL"/>"><ww:property value="/currentIndexTask/userName"/></a></ww:param>
                            </ww:text>
                        </p>
                    </aui:param>
                </aui:component>
            </ww:if>
        </page:param>
        <tr bgcolor="#ffffff"><td>
            <ww:if test="/currentIndexTask/finished == true">
                <ui:component template="taskdescriptor.jsp" name="'/currentIndexTask'"/>
                <page:param name="action">AcknowledgeTask.jspa</page:param>
                <ww:if test="/currentIndexTask/userWhoStartedTask == true">
                    <page:param name="submitId">acknowledge_submit</page:param>
                    <page:param name="submitName"><ww:text name="'common.words.acknowledge'"/></page:param>
                    <ui:component name="'taskId'" template="hidden.jsp"/>
                </ww:if>
                <ww:else>
                    <page:param name="submitId">done_submit</page:param>
                    <page:param name="submitName"><ww:text name="'common.words.done'"/></page:param>
                </ww:else>
                <ui:component name="'destinationURL'" template="hidden.jsp"/>
            </ww:if>
            <ww:else>
                <ww:if test="/currentIndexTask == null">
                    <page:param name="title">
                        <ww:text name="'common.tasks.task.not.found.title'"/>
                    </page:param>
                    <page:param name="action">IndexAdmin.jspa</page:param>
                    <page:param name="submitId">done_submit</page:param>
                    <page:param name="submitName"><ww:text name="'common.words.done'"/></page:param>
                </ww:if>
                <ww:else>
                    <ww:if test="/currentIndexTaskZombie == true">
                        <page:param name="action">IndexAbortZombieTask.jspa</page:param>

                        <aui:component template="auimessage.jsp" theme="'aui'">
                            <aui:param name="'messageType'">error</aui:param>
                            <aui:param name="'messageHtml'">
                                <b><ww:text name="'admin.indexing.found.zombie.task.message.header'"/></b>
                                <p>
                                    <ww:text name="'admin.indexing.found.zombie.task.message.body'">
                                        <ww:param name="'value0'"><strong><ww:property value="/currentIndexTask/nodeId"/></strong></ww:param>
                                    </ww:text>
                                </p>
                                <p>
                                    <ww:text name="'admin.indexing.found.zombie.task.message.instructions'"/>
                                    <a href="<ww:property value="/zombieTaskDocsLink"/>" target="_blank">
                                        <ww:text name="'admin.indexing.found.zombie.task.message.kblink'"/>
                                    </a>
                                </p>
                            </aui:param>
                        </aui:component>
                        <page:param name="buttons">
                            <input class="aui-button" type="button" id="clean_up_failed_tasks_btn"
                                   name="abort_zombie_button"
                                   value="<ww:text name="'admin.indexing.abort.zombie.task.clean.up.failed'"/>"

                                   onclick="location.href='IndexAbortZombieTask.jspa?taskId=<ww:property
                                               value="taskId"/>&atl_token=<ww:property value="/xsrfToken"/>'"/>
                        </page:param>
                    </ww:if>
                    <ww:else>
                        <ww:if test="/clustered == true">
                            <ww:if test="/currentIndexTask/cancellable == false"> <%--must be a foreground reindex--%>
                                <ww:text name="'admin.indexing.progress.dc.foreground.description'">
                                    <ww:param name="'value0'"><strong><ww:property value="/currentIndexTask/nodeId"/></strong></ww:param>
                                </ww:text>
                            </ww:if>
                            <ww:else>
                                <ww:text name="'admin.indexing.progress.dc.background.description'">
                                    <ww:param name="'value0'"><strong><ww:property value="/currentIndexTask/nodeId"/></strong></ww:param>
                                </ww:text>
                            </ww:else>
                            <ww:if test="/taskOnSameNode == true">
                                <ww:text name="'admin.indexing.progress.dc.description.your.current.node'"/>
                            </ww:if>
                            <ww:else>
                                <ww:text
                                        name="'admin.indexing.progress.dc.description.your.on.a.different.node'">
                                    <ww:param name="'value0'"><strong><ww:property value="/currentNodeId"/></strong></ww:param>
                                </ww:text>
                            </ww:else>
                        </ww:if>
                        <ww:else>
                            <ww:if test="/currentIndexTask/cancellable == false"> <%--must be a foreground reindex--%>
                                <ww:text name="'admin.indexing.progress.server.foreground.description'"/>
                            </ww:if>
                            <ww:else>
                                <ww:text name="'admin.indexing.progress.server.background.description'"/>
                            </ww:else>
                        </ww:else>

                        <ui:component template="taskdescriptor.jsp" name="'/currentIndexTask'"/>

                        <page:param name="action">IndexProgress.jspa</page:param>
                        <page:param name="submitId">refresh_submit</page:param>
                        <page:param name="submitName"><ww:text name="'admin.common.words.refresh'"/></page:param>
                        <ui:component name="'taskId'" template="hidden.jsp"/>
                        <ww:if test="/currentIndexTask/cancellable == true">
                            <page:param name="buttons">
                                <input class="aui-button" type="button" id="cancel_reindex_submit"
                                       name="<ww:text name="'admin.indexing.cancel'"/>"
                                       value="<ww:text name="'admin.indexing.cancel'"/>"
                                       onclick="location.href='IndexReIndexCancel.jspa?taskId=<ww:property
                                               value="taskId"/>&atl_token=<ww:property value="/xsrfToken"/>'"/>
                            </page:param>
                        </ww:if>
                    </ww:else>
                </ww:else>
            </ww:else>
            <ww:if test="/currentIndexTask/cancelled == true">
                <ui:component template="taskdescriptor.jsp" name="'/currentIndexTask'"/>
                <aui:component template="auimessage.jsp" theme="'aui'">
                    <aui:param name="'messageType'">info</aui:param>
                    <aui:param name="'messageHtml'">
                        <p>
                        <ww:if test="/currentIndexTask/finished == true">
                            <ww:text name="'admin.indexing.cancelled'"/><br/>
                        </ww:if>
                        <ww:else>
                            <ww:text name="'admin.indexing.cancelling'"/><br/>
                        </ww:else>
                        </p>
                    </aui:param>
                </aui:component>
            </ww:if>

        </td></tr>
    </page:applyDecorator>
</body>
</html>
