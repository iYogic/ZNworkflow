<%@ Page language="C#" MasterPageFile="/workflow/SiteAssets/masterpages/formblank.master"  Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage,Microsoft.SharePoint,Version=16.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c" meta:progid="SharePoint.WebPartPage.Document"  %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Import Namespace="Microsoft.SharePoint" %> <%@ Assembly Name="Microsoft.Web.CommandUI, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ContentPlaceHolderId="PlaceHolderPageTitle" runat="server">
	Submitting...

	</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderAdditionalPageHead" runat="server">
	<meta name="GENERATOR" content="Microsoft SharePoint" />
	<meta name="ProgId" content="SharePoint.WebPartPage.Document" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="CollaborationServer" content="SharePoint Team Web Site" />
	<SharePoint:ScriptBlock runat="server">
	var navBarHelpOverrideKey = 'WSSEndUser'; 
	</SharePoint:ScriptBlock>
<SharePoint:StyleBlock runat="server">
body #s4-leftpanel {
	display:none;
}

.s4-ca {
	margin-left:0px;
}</SharePoint:StyleBlock>
	<style type="text/css">
		.ms-core-needIEFilter, .ms-backgroundImage {
			background-image:url('../images/loading.gif');
			background-position: center;
			background-color:#dee1e2;
			background-repeat:no-repeat;
		}
	</style>
	
	<script type="text/javascript" src="../scripts/jquery-3.3.1.min.js"></script>
	<script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
	<script type="text/javascript" src="/_layouts/15/sp.js"></script>
	<script type="text/javascript" src="../scripts/common.js?v=0.9"></script>
	<script type="text/javascript" src="/_layouts/15/SP.WorkflowServices.js"></script>
	
	<script type="text/javascript">
		$(document).ready(function() {
			StartWF();
		});
		
		var curItemId = 0;
		var tmpSession = "";
		var listTitle = "";
		var listTitleurl = "";
		var wfName = "";
		function StartWF() {
		    tmpSession = sessionStorage.getItem("Operation");
		    listTitle = sessionStorage.getItem("listTitle");
		    listTitleurl = sessionStorage.getItem("listTitleurl");
			sessionStorage.clear();
			console.log(tmpSession);
			console.log(listTitle );
			console.log(listTitleurl);
			var id = 0;
			if (tmpSession == null || tmpSession == "") {
				Redir("");
				return;
			} else if (tmpSession == "Submit") {
				GetCurUser();
			} else {
				try {
					id = parseInt(tmpSession);
					if (id > 0) {
						StartWorkflow(id, listTitle,'',"Redir");
					}
				} catch (e) {
					Redir("");
				}
			}
		}
		
		function GetLastRecordId(val) {
			if (val == null) {
				Redir("");
			} else {
				var id = val.get_id();
				curItemId = id;
				StartWorkflow(id, listTitle,'',"Redir");
			}
		}
		
		function GetCurUser() {
			var context = SP.ClientContext.get_current();
		    var user = context.get_web().get_currentUser();
		    context.load(user);
		    context.executeQueryAsync(function onQuerySucceeded(sender, args) {
		        GetLatestRecord(user.get_id(),listTitle, "GetLastRecordId");
		    }, function onQueryFailed(sender, args) {
		        if (callFunc != null && callFunc != "") {
		            var fn = window[callFunc];
		            fn(null);
		        }
		    });
		}

		function Redir(val) {
			if (val == "Success") {
				curListItem = null;
				GetListItemById(curItemId, "GotoPage");
			} else {
				//alert("Submit failed. Please wait for a minute and try again.");
			}
			window.location.href = listTitleurl+"/AllItems.aspx";
		}
		
		function GotoPage(val) {
		    if (wfName != "") {
		        if (val != null && val.get_item(wfName) != "" && val.get_item(wfName) != "已拒绝" && val.get_item(wfName) != "已撤销") {
		            Redir("");
		        } else {
		            window.setTimeout(function () { Redir("Success"); }, 200);
		        }
		    } else {
		        GetWorkflowName(listTitle, "getWFName");
		    }
		}

		function getWFName(val) {
		    wfName = val.replaceAll(" ", "_x0020_");
		    Redir("Success");
		}
	</script>

</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">
	
</asp:Content>
