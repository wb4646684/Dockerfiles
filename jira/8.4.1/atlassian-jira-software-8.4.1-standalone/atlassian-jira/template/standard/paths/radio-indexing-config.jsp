<%@ taglib uri="webwork" prefix="ww" %>
<%@ taglib uri="webwork" prefix="aui" %>
<%@ include file="/template/standard/controlheader.jsp" %>

<div class="formOne">
    <ww:else>
        <div>
            <div>
                <span id="default-index-path"><ww:property value="/indexPath"/></span>
            </div>
        </div>
    </ww:else>
</div>

<%@ include file="/template/standard/controlfooter.jsp" %>
