<%@ taglib prefix="ww" uri="webwork" %>
<div class="aui-sidebar">
    <div class="aui-sidebar-wrapper">
        <div class="aui-sidebar-body">
            <nav class="aui-navgroup aui-navgroup-vertical">
                <div class="aui-navgroup-inner">
                    <div class="aui-sidebar-group aui-sidebar-group-actions">
                        <ul class="aui-nav" id="user_profile_tabs">
                            <ww:iterator value="/tabDescriptors" status="'status'">
                                <li id="up_<ww:property value="./key"/>_li" class="<ww:if test="/selected == completeKey">aui-nav-selected</ww:if><ww:if test="@status/first == true"> first</ww:if>">
                                    <a class="aui-nav-item" id="up_<ww:property value="./key"/>_a" href='<%= request.getContextPath() %>/secure/ViewProfile.jspa?<ww:if test="/user != /loggedInUser">name=<ww:property value="user/name"/>&</ww:if>selectedTab=<ww:property value="./completeKey"/>' title="<ww:text name="./name"/>"><ww:text name="./name"/></a>
                                </li>
                            </ww:iterator>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    </div>
</div>