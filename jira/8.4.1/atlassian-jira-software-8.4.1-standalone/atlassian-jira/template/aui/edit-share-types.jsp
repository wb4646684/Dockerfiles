<%@ page import="com.atlassian.jira.component.ComponentAccessor" %>
<%@ page import="com.atlassian.plugin.webresource.WebResourceManager" %>
<%@ taglib uri="webwork" prefix="ww" %>
<%@ taglib prefix="page" uri="sitemesh-page" %>
<%@ taglib prefix="jira" uri="jiratags" %>
<%
    WebResourceManager webResourceManager = ComponentAccessor.getWebResourceManager();
    webResourceManager.requireResource("jira.webresources:share-types");
%>

<div class="<ww:property value="parameters['mode']"/>">
    <page:applyDecorator name="auifieldgroup">
        <jsp:include page="/template/aui/formFieldLabel.jsp" />
        <div id="share_display_div_<ww:property value="parameters['mode']"/>"></div>

        <jira:feature-check featureKey="com.atlassian.jira.sharedEntityEditRights" enabled="false">
            <jsp:include page="/template/aui/formFieldError.jsp" />
        </jira:feature-check>

    </page:applyDecorator>

    <page:applyDecorator name="auifieldgroup">
        <ww:if test="parameters['mode'] == 'viewers'">
            <ww:component template="formFieldLabel.jsp" label="text('common.sharing.new.viewers')" theme="'aui'"/>
        </ww:if>
        <ww:if test="parameters['mode'] == 'editors'">
            <ww:component template="formFieldLabel.jsp" label="text('common.sharing.new.editors')" theme="'aui'"/>
        </ww:if>
        <ww:property value="parameters['shareTypeList']">
            <div id="share_div_<ww:property value="parameters['mode']"/>" style="display: none;">
                <ww:if test="parameters['editEnabled'] == false"><div style="display:none"></ww:if>
                <div id="share_display_component_<ww:property value="parameters['mode']"/>"><ww:if test=". != null && ./size > 0">
                    <div>
                        <select class="select medium-field" id="share_type_selector_<ww:property value="parameters['mode']"/>">
                            <ww:iterator value=".">
                                <ww:if test="./available == true">
                                    <option value="<ww:property value="./shareType"/>"><ww:property value="./shareTypeLabel"/></option>
                                </ww:if>
                            </ww:iterator>
                        </select>
                        <ww:iterator value="." status="'typeStatus'">
                        <span class="share_select" id="share_<ww:property value="./shareType"/>_<ww:property value="parameters['mode']"/>" <ww:if test="@typeStatus/first == false">style="display:none"</ww:if>>
                            <ww:property value="./shareTypeEditor" escape="false"/>
                            <ww:if test="./addButtonNeeded == true">
                                <span class="addShare" id="share_add_<ww:property value="./shareType"/>_<ww:property value="parameters['mode']"/>">
                                    <span class="aui-icon aui-icon-small aui-iconfont-add"></span>
                                    <ww:if test="parameters['mode'] == 'viewers'">
                                        <ww:text name="'common.sharing.add.viewers'"/>
                                    </ww:if>
                                    <ww:if test="parameters['mode'] == 'editors'">
                                        <ww:text name="'common.sharing.add.editors'"/>
                                    </ww:if>
                                </span>
                            </ww:if>
                        </span>
                        </ww:iterator>
                        <div class="fieldDescription" id="share_type_description_<ww:property value="parameters['mode']"/>"></div>
                        </ww:if></div></div>
                <ww:if test="parameters['editEnabled'] == false"></div></ww:if>
            </div>
            <span id="shares_data_<ww:property value="parameters['mode']"/>" style="display:none;"><ww:property value="parameters['dataString']"/></span>
            <span id="shares_data" style="display:none;"><ww:property value="parameters['dataString']"/></span>
            <input id="share_type_hidden_<ww:property value="parameters['mode']"/>" name="shareValues" type="text" style="display:none;"/>
            <span id="share_trash_<ww:property value="parameters['mode']"/>" class="aui-icon aui-icon-small aui-iconfont-delete shareTrash" style="display:none;"><ww:text name="'common.sharing.delete.share'"/></span>
            <span id="share_icon_<ww:property value="parameters['mode']"/>" class="aui-icon aui-icon-small aui-iconfont-admin-roles shareIcon" style="display:none;"><ww:text name="'common.sharing.share'"/></span>
            <div class="shareItem" id="empty_share_<ww:property value="parameters['mode']"/>" style="display:none">
                <div title="<ww:text name="'common.sharing.shared.template.private.desc'"/>">
                    <span class="aui-icon aui-icon-small aui-iconfont-user shareIcon"><ww:text name="'common.sharing.private'"/></span><ww:text name="'common.sharing.not.shared'"/>
                </div>
            </div>

            <fieldset class="hidden parameters">
                <input type="hidden" title="paramSubmitButtonId" value="<ww:property value="parameters['submitButtonId']"/>"/>
            </fieldset>

            <jira:feature-check featureKey="com.atlassian.jira.sharedEntityEditRights" enabled="true">
                <ww:if test="parameters['mode'] == 'editors'">
                    <br/><jsp:include page="/template/aui/formFieldError.jsp" />
                </ww:if>
            </jira:feature-check>

            <script type="text/javascript">
                AJS.$(function() {
                    <ww:iterator value=".">
                    <ww:iterator value="./translatedTemplates">
                    JIRA.Share.i18n["<ww:property value="key"/>"] = "<ww:property value="value" escape="false"/>";
                    </ww:iterator>
                    </ww:iterator>
                    JIRA.Share.i18n["common.sharing.remove.shares.public"] = "<ww:text name="'common.sharing.remove.shares.public'"/>";
                    JIRA.Share.i18n["common.sharing.remove.shares.authenticated"] = "<ww:text name="'common.sharing.remove.shares.authenticated'"/>";
                    JIRA.Share.i18n["common.sharing.remove.singleton.loggedin"] = "<ww:text name="'common.sharing.remove.singleton.loggedin'"/>";
                    JIRA.Share.i18n["common.sharing.remove.singleton.public"] = "<ww:text name="'common.sharing.remove.singleton.public'"/>";
                    JIRA.Share.i18n["common.sharing.dirty.warning"] = "<ww:text name="'common.sharing.dirty.warning'"/>";
                    JIRA.Share.i18n["common.sharing.duplicate.viewers.warning"] = "<ww:text name="'common.sharing.duplicate.viewers.warning'"/>";

                    var JiraShare = require("jira/share/share-factory");
                    JiraShare.registerEditShareTypes("<ww:property value="parameters['mode']"/>");
                });
            </script>
        </ww:property>
    </page:applyDecorator>
</div>
