<%--
All changes in this jsp must be mirrored in head-common.jsp
--%>
<%@ page import="static com.atlassian.jira.component.ComponentAccessor.*" %>
<%@ page import="com.atlassian.jira.plugin.navigation.HeaderFooterRendering" %>
<%@ page import="com.atlassian.jira.config.properties.LogoProvider" %>
<%@ page import="com.atlassian.jira.config.properties.DefaultLogoProvider" %>
<%@ taglib uri="sitemesh-decorator" prefix="decorator" %>
<%@ taglib uri="jiratags" prefix="jira" %>
<%@ taglib uri="webwork" prefix="ww" %>
<%
    HeaderFooterRendering headerFooterRendering = getComponent(HeaderFooterRendering.class);
    LogoProvider logoProvider = getComponent(DefaultLogoProvider.class);
%>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=Edge"/>
<%

    // include version meta information
    headerFooterRendering.includeVersionMetaTags(out);

    // writes the <meta> tags into the page head
    headerFooterRendering.requireCommonMetadata();
    headerFooterRendering.includeMetadata(out);

    // include web panels
    headerFooterRendering.includeWebPanels(out, "atl.header");
%>
<%@ include file="/includes/decorators/xsrftoken.jsp" %>

<link rel="shortcut icon" href="<%= headerFooterRendering.getRelativeResourcePrefix()%><%=logoProvider.getFavicon()%>">

