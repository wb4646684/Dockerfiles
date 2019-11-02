<%@ taglib uri="webwork" prefix="ww" %>
<%@ taglib uri="webwork" prefix="ui" %>
<%@ taglib uri="sitemesh-page" prefix="page" %>
<ww:if test="./enabled != true">
    <ww:text name="'admin.issuefields.customfields.not.configured.context'"/>
</ww:if>
<ww:else>
    <dl class="context-list">
        <dt><ww:text name="'admin.issuefields.customfields.issue.types'"/>:</dt>
        <ww:if test="./allIssueTypes == true">
            <dd><ww:text name="'admin.issuefields.customfields.global.all.issues'"/></dd>
        </ww:if>
        <ww:else>
            <ww:iterator value="./associatedIssueTypes" status="'status'">
                <dd class="context-issue-type">
                    <a href="<ww:url value="'EditIssueType!default.jspa'" atltoken="false"><ww:param name="'id'" value="./id" /><ww:param name="'returnUrl'" value="'ViewCustomFields.jspa'" /></ww:url>">
                        <ww:component name="'customfieldicon'" template="constanticon.jsp">
                            <ww:param name="'contextPath'"><%= request.getContextPath() %></ww:param>
                            <ww:param name="'iconurl'" value="./iconUrl"/> -
                            <ww:param name="'alt'"><ww:property value="./nameTranslation"/></ww:param>
                            <ww:param name="'title'"><ww:property value="./nameTranslation"/> - <ww:property value="./descTranslation"/></ww:param>
                        </ww:component>
                    </a>
                </dd>
            </ww:iterator>
        </ww:else>
        <ww:if test="./associatedProjectCategoryObjects != null && ./associatedProjectCategoryObjects/empty == false">
            <dt><ww:text name="'admin.issuefields.customfields.project.categories'"/>:</dt>
            <ww:iterator value="./associatedProjectCategoryObjects" status="'status'">
                <dd>
                    <a title="<ww:property value="name" /><ww:property value="description"><ww:if test=". && !./equals('')"> - <ww:property value="." /></ww:if></ww:property>" href="<ww:url value="'EditProjectCategory!default.jspa'" atltoken="false"><ww:param name="'returnUrl'" value="'ViewCustomFields.jspa'" /><ww:param name="'id'" value="id" /></ww:url>"><ww:property value="name"/></a>
                </dd>
            </ww:iterator>
        </ww:if>
        <ww:if test="./associatedProjectObjects != null && ./associatedProjectObjects/empty == false">
            <dt><ww:text name="'admin.issuefields.customfields.projects'"/>:</dt>
            <ww:iterator value="./associatedProjectObjects" status="'status'">
                <dd>
                    <ww:if test="archived != true">
                        <a title="<ww:property value="name" /><ww:property value="description"><ww:if test="equals('') != true"> - <ww:property value="." /></ww:if></ww:property>" href="<ww:url value="'/plugins/servlet/project-config/' + ./key + '/summary'" atltoken="false" />">
                    </ww:if>
                        <span data-project-id="<ww:property value="id"/>"><ww:property value="name" /><ww:if test="archived == true"> (<ww:text name="'admin.common.words.archived'"/>)</ww:if></span>
                    <ww:if test="archived != true">
                        </a>
                    </ww:if>
                </dd>
            </ww:iterator>
        </ww:if>
    </dl>
</ww:else>

