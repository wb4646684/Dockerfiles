<%@ taglib uri="webwork" prefix="ww" %>
<%@ taglib uri="webwork" prefix="ui" %>
<%@ taglib uri="webwork" prefix="aui" %>
<%@ taglib uri="jiratags" prefix="jira" %>
<%@ taglib uri="sitemesh-page" prefix="page" %>

<%-- SEARCH VIEW --%>
<ww:if test="/view == 'search'">
    <ui:soy moduleKey="'jira.webresources:soy-templates'" template="'JIRA.Templates.Headers.pageHeader'">
        <ui:param name="'tagName'" value="'div'"/>
        <ui:param name="'mainContent'">
            <h2><ww:text name="'configureportalpages.search.desc'"/></h2>
        </ui:param>
        <ui:param name="'helpContent'">
            <ww:component template="help.jsp" name="'portlets.dashboard_pages'">
                <ww:param name="'helpURLFragment'">#managing_dashboards</ww:param>
            </ww:component>
        </ui:param>
    </ui:soy>

    <p><ww:text name="'configureportalpages.search.long.desc'"/></p>
    <page:applyDecorator id="pageSearchForm" name="auiform">
        <page:param name="action">ConfigurePortalPages.jspa</page:param>
        <page:param name="submitButtonName">Search</page:param>
        <page:param name="submitButtonText"><ww:text name="'common.concepts.search'"/></page:param>

        <ui:component name="'view'" value="/view" template="hidden.jsp" theme="'aui'"/>

        <page:applyDecorator name="auifieldgroup">
            <ui:textfield label="text('common.concepts.search')" name="'searchName'" theme="'aui'">
                <ui:param name="'description'" value="text('portalpage.search.text.desc')"/>
            </ui:textfield>
        </page:applyDecorator>

        <%-- show filter owner input, but only for users with "Browse users" permission --%>
        <ww:if test="/hasBrowseUsersPermission == true">
            <page:applyDecorator name="auifieldgroup">
                <ui:component label="text('admin.common.words.owner')" name="'searchOwnerUserName'" template="singleSelectUserPicker.jsp" theme="'aui'">
                    <ui:param name="'description'" value="text('user.picker.ajax.desc')"/>
                    <ww:if test="/searchOwnerUserName && /searchOwnerUserName != ''">
                        <ui:param name="'userName'" value="searchOwnerUserName"/>
                        <ui:param name="'userAvatar'"><ww:url value="'/secure/useravatar'" atltoken="'false'"><ww:param name="'ownerId'" value="searchOwnerUserName"/></ww:url></ui:param>
                        <ui:param name="'userFullName'">
                            <jira:formatuser userName="searchOwnerUserName" type="'fullName'" escape="false"/>
                        </ui:param>
                    </ww:if>
                </ui:component>
            </page:applyDecorator>
        </ww:if>

        <%-- show share types input only for logged in users, as it will always be empty for anonymous users --%>
        <ww:if test="/userLoggedIn == true">
            <page:applyDecorator name="auifieldgroup">
                <ww:component name="'shares'" label="text('common.concepts.shared.with')" template="select-share-types.jsp" theme="'aui'">
                    <ww:param name="'class'" value="'filterSearchInputRightAligned fieldLabelArea'"/>
                    <ww:param name="'valueColSpan'" value="3"/>
                    <ww:param name="'noJavaScriptMessage'" value="text('common.sharing.no.share.javascript')"/>
                    <ww:param name="'shareTypeList'" value="/portalPageViewHelper/shareTypeRendererBeans"/>
                    <ww:param name="'dataString'" value="/portalPageViewHelper/searchShareTypeJSON"/>
                    <ww:param name="'anyDescription'"><ww:text name="'common.sharing.search.template.any.desc.PortalPage'"/></ww:param>
                </ww:component>
            </page:applyDecorator>
        </ww:if>
        <ww:else>
            <ui:component template="multihidden.jsp">
                <ui:param name="'fields'">searchShareType,groupShare,projectShare,roleShare</ui:param>
            </ui:component>
        </ww:else>
    </page:applyDecorator>

    <div id="filter_search_results">
    <ww:if test="/searchRequested == true && /pages/size > 0">
        <ww:component name="text('common.concepts.search')" template="portalpage-list.jsp">
            <ww:param name="'id'" value="'pp_browse'"/>
            <ww:param name="'portalPageList'" value="/pages"/>
            <ww:param name="'owner'" value="/shouldShowOwnerColumn"/>
            <ww:param name="'operations'">false</ww:param>
            <ww:param name="'ordering'">false</ww:param>

            <ww:param name="'sort'" value="true"/>
            <ww:param name="'sortColumn'" value="/sortColumn"/>
            <ww:param name="'viewHelper'" value="/portalPageViewHelper"/>
            <ww:param name="'linkRenderer'" value="/portalPageLinkRenderer"/>

            <ww:param name="'paging'" value="true"/>
            <ww:param name="'pagingMessage'">
                <ww:text name="'common.sharing.searching.results.message'">
                    <ww:param name="'value0'"><ww:property value="/startPosition"/></ww:param>
                    <ww:param name="'value1'"><ww:property value="/endPosition"/></ww:param>
                    <ww:param name="'value2'"><ww:property value="/totalResultCount"/></ww:param>
                </ww:text>
            </ww:param>
            <ww:param name="'pagingPrevUrl'" value="/previousUrl"/>
            <ww:param name="'pagingNextUrl'" value="/nextUrl"/>
            <ww:param name="'emptyMessage'"><ww:text name="/searchUnsuccessfulMessage"/></ww:param>
        </ww:component>
    </ww:if>
    <ww:else>
        <ww:if test="/searchRequested == true">
            <aui:component template="auimessage.jsp" theme="'aui'">
                <ww:if test="/errorMessage == true">
                    <aui:param name="'messageType'">error</aui:param>
                </ww:if>
                <ww:else>
                    <aui:param name="'messageType'">info</aui:param>
                </ww:else>
                <aui:param name="'messageHtml'">
                    <p><ww:text name="/searchUnsuccessfulMessage"/></p>
                </aui:param>
            </aui:component>
        </ww:if>
    </ww:else>
    </div>
</ww:if>
<%-- MY VIEW --%>
<ww:elseIf test="/view == 'my'">
    <ui:soy moduleKey="'jira.webresources:soy-templates'" template="'JIRA.Templates.Headers.pageHeader'">
        <ui:param name="'tagName'" value="'div'"/>
        <ui:param name="'mainContent'">
            <h2><ww:text name="'configureportalpages.my.desc'"/></h2>
        </ui:param>
        <ui:param name="'helpContent'">
            <ww:component template="help.jsp" name="'portlets.dashboard_pages'">
                <ww:param name="'helpURLFragment'">#managing_dashboards</ww:param>
            </ww:component>
        </ui:param>
    </ui:soy>

    <p><ww:text name="'configureportalpages.my.long.desc'"/></p>
    <ww:component name="text('common.concepts.my')" template="portalpage-list.jsp">
        <ww:param name="'id'" value="'pp_owned'"/>
        <ww:param name="'portalPageList'" value="/pages"/>
        <ww:param name="'owner'">false</ww:param>
        <ww:param name="'favcount'">false</ww:param>
        <ww:param name="'ordering'">false</ww:param>
        <ww:param name="'favourite'" value="/canShowFavourite"/>
        <ww:param name="'shares'" value="/canShowShares"/>
        <ww:param name="'emptyMessage'"><ww:text name="'portal.no.owned.pages'"/></ww:param>
        <ww:param name="'returnUrl'" value="/returnUrl"/>
        <ww:param name="'viewHelper'" value="/portalPageViewHelper"/>
        <ww:param name="'linkRenderer'" value="/portalPageLinkRenderer"/>
        <ww:param name="'operations'">true</ww:param>
        <ww:param name="'dropDownModelProvider'" value="/"/>
    </ww:component>
</ww:elseIf>
<%-- POPULAR VIEW --%>
<ww:elseIf test="/view == 'popular'">
    <ui:soy moduleKey="'jira.webresources:soy-templates'" template="'JIRA.Templates.Headers.pageHeader'">
        <ui:param name="'tagName'" value="'div'"/>
        <ui:param name="'mainContent'">
            <h2><ww:text name="'configureportalpages.popular.desc'"/></h2>
        </ui:param>
        <ui:param name="'helpContent'">
            <ww:component template="help.jsp" name="'portlets.dashboard_pages'">
                <ww:param name="'helpURLFragment'">#managing_dashboards</ww:param>
            </ww:component>
        </ui:param>
    </ui:soy>

    <p><ww:text name="'configureportalpages.popular.long.desc'"/></p>
    <%-- Popular View --%>
    <ww:component name="text('common.concepts.popular')" template="portalpage-list.jsp">
        <ww:param name="'id'" value="'pp_popular'"/>
        <ww:param name="'operations'">false</ww:param>
        <ww:param name="'ordering'">false</ww:param>
        <ww:param name="'portalPageList'" value="/pages"/>
        <ww:param name="'owner'" value="/shouldShowOwnerColumn"/>
        <ww:param name="'favourite'" value="/canShowFavourite"/>
        <ww:param name="'shares'" value="/canShowShares"/>
        <ww:param name="'emptyMessage'"><ww:text name="'portal.no.popular.pages'"/></ww:param>
        <ww:param name="'returnUrl'" value="/returnUrl"/>
        <ww:param name="'viewHelper'" value="/portalPageViewHelper"/>
        <ww:param name="'linkRenderer'" value="/portalPageLinkRenderer"/>
    </ww:component>
</ww:elseIf>
<%-- FAVOURITES VIEW --%>
<ww:else>
    <ui:soy moduleKey="'jira.webresources:soy-templates'" template="'JIRA.Templates.Headers.pageHeader'">
        <ui:param name="'tagName'" value="'div'"/>
        <ui:param name="'mainContent'">
            <h2><ww:text name="'configureportalpages.favourite.desc'"/></h2>
        </ui:param>
        <ui:param name="'helpContent'">
            <ww:component template="help.jsp" name="'portlets.dashboard_pages'">
                <ww:param name="'helpURLFragment'">#managing_dashboards</ww:param>
            </ww:component>
        </ui:param>
    </ui:soy>

    <p><ww:text name="'configureportalpages.favourite.long.desc'"/></p>
    <aui:component id="'undo_div'" template="auimessage.jsp" theme="'aui'">
        <aui:param name="'messageType'">warning</aui:param>
        <aui:param name="'cssClass'">hidden</aui:param>
    </aui:component>
    <ww:component name="text('common.favourites.favourite')" template="portalpage-list.jsp">
        <ww:param name="'id'" value="'pp_favourite'"/>
        <ww:param name="'portalPageList'" value="/pages"/>
        <ww:param name="'favcount'">false</ww:param>
        <ww:param name="'favourite'" value="/canShowFavourite"/>
        <ww:param name="'shares'" value="/canShowShares"/>
        <ww:param name="'emptyMessage'"><ww:text name="'portal.no.favourite.pages'"/></ww:param>
        <ww:param name="'returnUrl'" value="/returnUrl"/>
        <ww:param name="'viewHelper'" value="/portalPageViewHelper"/>
        <ww:param name="'linkRenderer'" value="/portalPageLinkRenderer"/>
        <ww:param name="'remove'">true</ww:param>
        <ww:param name="'operations'">true</ww:param>
        <ww:param name="'dropDownModelProvider'" value="/"/>
    </ww:component>
</ww:else>
