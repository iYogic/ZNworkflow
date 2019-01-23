<%@ Page language="C#" MasterPageFile="../masterpages/formlist.master"  Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage,Microsoft.SharePoint,Version=16.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c" meta:progid="SharePoint.WebPartPage.Document"  %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ContentPlaceHolderId="PlaceHolderPageTitle" runat="server">
	<SharePoint:listitemproperty Property="BaseName" maxlength="40" runat="server"/>
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderAdditionalPageHead" runat="server">
	<meta name="GENERATOR" content="Microsoft SharePoint" />
	<meta name="ProgId" content="SharePoint.WebPartPage.Document" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="CollaborationServer" content="SharePoint Team Web Site" />
	<link rel="stylesheet" href="../css/driveout_data.css"/>
	<script type="text/javascript" src="../scripts/jquery-3.3.1.min.js"></script>
	<script type="text/javascript" src="../scripts/laydate/laydate.js"></script>
	<script type="text/javascript" src="../scripts/common.js"></script>
	<script type="text/javascript" src="../scripts/driveout_data.js?v=0.2"></script>
	
	<SharePoint:scriptblock runat="server"></SharePoint:ScriptBlock>
	<SharePoint:styleblock runat="server">
        body #s4-leftpanel {
			display:none;
		}
		.s4-ca {
			margin-left:0px;
		} 
	</SharePoint:StyleBlock>
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">
	<!-- Content -->
	<div class="contents" >
	
		<div class="topcontent">
			<div class="query_titlename">
				<span class="lableA">分类:</span>
				<select name="query_select" id="query_select">
					<option value="-100">- 请选择 -</option>
				</select>		
			</div>
			<div class="query_time">
				<span class="lableA">创建时间:</span>
				<input type="text" id="txtstart" value="" readonly="readonly" class="laydate" lay-key="1"/>	
				<span class="lableB">至:</span>
				<input type="text" id="txtend" value="" readonly="readonly" class="laydate" lay-key="2"/>
			</div>
			<div onclick="dosearch()" class="btnsearch">搜索</div>
			<div onclick="export_excel()" class="btndriveout">
				导出EXCEL</div>
		</div>
		
		<div class="maincontent" >
			<table class="latest-panel" id="latest-listing" border="0" cellspacing="0" cellpadding="0">
			</table>
			<table class="latest-panel" id="tableExcel" border="0" cellspacing="0" cellpadding="0" style="display:none">
			</table>			
		</div>
		<div class="footercontent">
			<div id="divpages">
				<a href="javascript:" onclick="gotoPageEx(-1)" id="prepage" class="next_previous">
				&lt;&lt;&nbsp;&nbsp;Previous</a>
				<a href="javascript:" onclick="gotoPageEx(1)" id="nextpage" class="next_previous">
				Next&nbsp;&nbsp;&gt;&gt;</a>
				<span> Go to page:&nbsp;</span>
				<select id="selpages" onchange="gotoPage()">
					<option value="0">- Select -</option>
				</select>
				<span id="pagenum">Page <span class="pagenumval">1</span></span>
			</div>
		</div>
				
	</div>
	<div class="nodata_parent">
		<div class="nodata_gif">初始化...</div>
	</div>
</asp:Content>

