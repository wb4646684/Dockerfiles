<%@ taglib prefix="ww" uri="webwork" %>

<div class="aui-page-header-actions" id="navigator-options">
    <div class="profile-operations">
        <ww:iterator value="/sectionsForMenu">
            <ww:property value="/sectionLinks(./id)">
                <ww:if test="./empty == false">
                    <button class="aui-button aui-dropdown2-trigger" title="<ww:property value="../title" />" aria-owns="<ww:property value="../id"/>" aria-haspopup="true">
                        <ww:property value="../params['iconFont']">
                            <ww:if test=".">
                                <span class="aui-icon aui-icon-small aui-iconfont-<ww:property value="."/>"></span>
                            </ww:if>
                        </ww:property>
                        <span><ww:property value="../label"/></span>
                    </button>

                    <div id="<ww:property value="../id"/>" class="aui-dropdown2 aui-style-default">
                        <ul class="aui-list-truncate">
                            <ww:iterator value=".">
                                <li class="aui-list-item">
                                    <a class="aui-list-item-link <ww:property value="./styleClass"/>" id="<ww:property value="./id"/>" title="<ww:property value="./title"/>" href="<ww:property value="./url"/>"><ww:property value="./label"/></a>
                                </li>
                            </ww:iterator>
                        </ul>
                    </div>
                </ww:if>
            </ww:property>
        </ww:iterator>
    </div>
</div>