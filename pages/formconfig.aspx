<%-- _lcid="2052" _version="16.0.7331" _dal="1" --%><%-- _LocalBinding --%>
<%@ Page language="C#" MasterPageFile="/workflow/SiteAssets/masterpages/formconfig.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage,Microsoft.SharePoint,Version=16.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c" meta:progid="SharePoint.WebPartPage.Document"  %>
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
	<div class="system_box">
		<!-- Right -->
		<div class="right_side">
			<!-- Right_min_box -->
			<div class="right_min_box">
				<!-- one Title -->
				<div class="one_title" style="display:none;">
					<span class="sign_cor"></span>
					<span class="sign_txt">操作</span></div>
				<!-- Two choose-->
				<div class="two_choose" style="display:none;">
				</div>
				<!-- Three Title -->
				<div class="one_title" style="display:none;">
					<span class="sign_cor"></span>
					<span class="sign_txt">显示</span></div>
				<!-- Four Table -->
				<div class="four_table">
					<!-- Title -->
					<div class="tab_title"><span class="tit_txt"></span></div>
					<!-- Table -->
					<table border="1" align="center" class="table"></table>
				</div>
				<!-- Five Btn -->
				<div class="five_btn">
					<span class="storage_btn serch_btn" ng-click="Save($event)">保存当前设置</span><span class="return_btn serch_btn"  ng-click="closePage($event)">关闭页面</span></div>
			</div>
		</div>
	</div>
</asp:Content>

