'use strick';

var inputint = 0;
$(document).ready(function () {
	$("#contentBox").hide();
    var curPageUrl = window.location.href;
    var curPageTemps = curPageUrl.split("?");
    curPageUrl = curPageTemps[0].toLowerCase();

    var bolIsDetail = false;
    if (curPageUrl.indexOf("newform.aspx") >= 0 || curPageUrl.indexOf("editform.aspx") >= 0 || curPageUrl.indexOf("dispform.aspx") >= 0) {
        bolIsDetail = true;
    }
    
    //url的hash变化
    window.onhashchange = function() { 
		SealTable();
        Icon();
	}
	
	//页面listtiltle
	var pagelisttitle=_spPageContextInfo.listTitle;
	if(pagelisttitle=="工作流任务"){
		$("#CSRListViewControlDivWPQ1").hide()
	}else{
		//搜索图片
	    $("#CSRListViewControlDivWPQ1").append($("<div style='float:left;margin-right:8px'><img src='"+ _spPageContextInfo.webServerRelativeUrl +"/SiteAssets/images/search.png' alt='' width='20' /></div>"));
	    
	    //新增按钮
	    var addNewform ='<div class="listbtn"><div class="listbtninline">'
	    			   + '<a href="'+ _spPageContextInfo.listUrl+'/NewForm.aspx?Source=' + _spPageContextInfo.webServerRelativeUrl + editPagePath + '"'
	    			   +'>新增</a></div></div>'
	    $("#CSRListViewControlDivWPQ1").append(addNewform);
	}
	
	//搜索框
	inputint = window.setInterval(function() {
		var ipt = $('#inplaceSearchDiv_WPQ1_lsinput');
		if (ipt != null && ipt.length > 0) {
			$('#inplaceSearchDiv_WPQ1_lsinput').on('keypress',function(event){ 
				if (event.keyCode == 13) {  
					window.setTimeout(function(){RefreshIcon("add");}, 100);
				}
			});
			$("#inplaceSearchDiv_WPQ1_lsimg").on("click", function(event) {
				var strclickname=$("#inplaceSearchDiv_WPQ1_lsimg").attr("title");
				if(strclickname=="清除搜索"){//删除
					window.setTimeout(function(){RefreshIcon("remove");}, 100);
				}else{//新加搜索条件
					window.setTimeout(function(){RefreshIcon("add");}, 100);
				}	
			});
			window.clearInterval(inputint);
		}
	}, 1000);
	
    var searchDiv = $(".ms-listviewtable");
    if (searchDiv != null && searchDiv.length > 0 && !bolIsDetail) {
    	//隐藏顶部按钮
         HideWorkflow();
        HideViewBtn();
        HideDelBtnM();
        HideAttachBtn();
        HideViewFormatBtn();
        HideAddBtn();

        RefreshTbl();
    }
    
    //可能用到
    //IsLegalGroup("");
    
    //左侧图片
    var lifirst ='<li class="static"><img src="'+ _spPageContextInfo.webServerRelativeUrl +'/SiteAssets/images/pleft_tip.png" alt="" style="padding-left:10px"/></li>';
    $(".ms-core-listMenu-verticalBox .root.ms-core-listMenu-root.static").prepend(lifirst) 
    
   

    var btn = $(".listbtninline");
	if (btn.length > 0) {
		var btna = $(btn).find("a");
		var btnurl = $(btna).attr("href");
		$(btn).on("click", function() {
			window.location.href = btnurl;
		});
	}
	
    $("#contentBox").show();
});

//搜索框下划
var iconshow = 0;
function RefreshIcon(status) {
	var strTemp = $("#inplaceSearchDiv_WPQ1_lsprogress").attr("style");
	if(status=='add'){
		if (iconshow >= 0) {
			if (iconshow == 0) {
				if (strTemp.toLowerCase().indexOf("visible") >= 0) {
					iconshow = 1;
				}
			} else if (iconshow == 1) {
				if (strTemp.toLowerCase().indexOf("hidden") >= 0) {
					iconshow = -1;
					window.setTimeout(function() { Icon(); iconshow = 0; }, 600);
					
				}
			}
			window.setTimeout(function() { RefreshIcon('add'); }, 100);
		}
	}else{
	    var nowstatus=$("#inplaceSearchDiv_WPQ1_lsimg").attr("title");
		if(nowstatus.indexOf("搜索")==0){
		    if (strTemp.toLowerCase().indexOf("hidden") >= 0) {
		        iconshow = -1;
		        window.setTimeout(function() { Icon(); iconshow = 0; }, 600);
		    }
		    
		}else{
		    if (iconshow >= 0) {
		        window.setTimeout(function() { RefreshIcon("remove"); iconshow = 0;}, 100);
		    }
		}		
	}
}

//刷新列表
function RefreshTbl() {
    var search = $("#inplaceSearchDiv_WPQ1").find("div");
    var search1 = $("#inplaceSearchDiv_WPQ2").find("div");
    if (search == null || search.length == 0) {
    	if (search1 == null || search1.length == 0) {
    		setTimeout(function() { RefreshTbl(); }, 500);
    	} else {
    		SealTable();
	    	Icon();
	    	var img = $("#diidSort14Attachments").find("img");
	    	$(img).attr("src", "/sites/ucomsite/workflow/SiteAssets/attach16.png");
    	}
    } else {
		SealTable();
	    Icon();
	    var img = $("#diidSort14Attachments").find("img");
	    $(img).attr("src", "/sites/ucomsite/workflow/SiteAssets/attach16.png");
    }
}
          
//控制样式
function SealTable(){
    $(".ms-listviewtable>tbody>tr").children("td:last-of-type").removeClass("ms-vb2");
    $(".ms-listviewtable>tbody>tr").children("td:last-of-type").css({"padding":"4px 8px 4px 4px","width":"30px","text-align":"center"});
    DelHref(".ms-listviewtable .ms-vb2 a");
    DelHref(".ms-listviewtable .ms-vb-title a");
    DelHref(".ms-listviewtable .ms-vb-user a");
}

//样式衍生
function DelHref(ID){
    $(ID).removeAttr("onclick");
    $(ID).removeAttr("href");
    $(ID).css("text-decoration","none");
    $(ID).css("color","black");
}

//绘制图片
function Icon() {
    var wkname = $(".ms-listviewtable>thead>tr").find("th[role='columnheader']").last().find("div.ms-vh-div").attr("name");
	var bol = false;
	try {
		$("div[name='UseSeal']").html("");
		var len = $(".ms-listviewtable>tbody>tr").length;
	    var viewstr = "Click to view the request";
	    var current_listTitle=_spPageContextInfo.listTitle;
	    if(current_listTitle=="工作流任务"){//工作流任务表，采用GotoApprove取地址
	    	 for (var i = 0; i < len; i++) {
		        var TXT = $(".ms-listviewtable>tbody>tr").eq(i).children("td").last().text();
		        var td = $(".ms-listviewtable>tbody>tr").eq(i).children("td").last();
				if(TXT=="已完成"){
		            var src = _spPageContextInfo.webServerRelativeUrl + "/SiteAssets/images/complete.png";
		            var img = AddIcon(src, i).replace("__ALT__", viewstr);
		            var tempa =  "<span onclick='GotoApprove(this)'>" + img + "</span>";
		            $(td).html(tempa);
		            bol = true;
		        }
		         else if(TXT=="未启动"){
		             var src = _spPageContextInfo.webServerRelativeUrl + "/SiteAssets/images/notify.png";
		            var img = AddIcon(src,i).replace("__ALT__", viewstr);
		            var tempa = "<span onclick='GotoApprove(this)'>" + img + "</span>";
		            $(td).html(tempa);
		            bol = true;
		        }
			   $(td).show();
		    }
	    }else{//工作流任务表，正常取地址
	    	for (var i = 0; i < len; i++) {
		        var TXT = $(".ms-listviewtable>tbody>tr").eq(i).children("td").last().text();
		        console.log(TXT);
		        var td = $(".ms-listviewtable>tbody>tr").eq(i).children("td").last();
		        if(TXT==""||TXT==null||TXT==undefined){
		            var src=_spPageContextInfo.webServerRelativeUrl+"/SiteAssets/images/save.png";
		            var img = AddIcon(src,i).replace("__ALT__", "Click to submit the request");
		            var tempa = "<span><a href='" + _spPageContextInfo.listUrl + "/EditForm.aspx?Source=" + escape(_spPageContextInfo.webServerRelativeUrl + editPagePath) + "&ID=" + GetId(td) + "&Wkname=" + wkname + "'>" + img + "</a></span>";
		            $(td).html(tempa);
		        }
		        else if(TXT=="进行中"){
		            var src = _spPageContextInfo.webServerRelativeUrl + "/SiteAssets/images/notify.png";
		            var img = AddIcon(src,i).replace("__ALT__", viewstr);
		            var tempa = "<span><a href='" + _spPageContextInfo.listUrl + "/DispForm.aspx?Source=" + escape(window.location.href) + "&ID=" + GetId(td) + "&Wkname=" + wkname + "'>" + img + "</a></span>";
		            $(td).html(tempa);
		            bol = true;
		        }
		        else if(TXT=="已拒绝"){
		            var src = _spPageContextInfo.webServerRelativeUrl + "/SiteAssets/images/reject.png";
		            var img = AddIcon(src,i).replace("__ALT__", viewstr);
		            var tempa = "<span><a href='" + _spPageContextInfo.listUrl + "/EditForm.aspx?Source=" + escape(_spPageContextInfo.webServerRelativeUrl + editPagePath) + "&ID=" + GetId(td) + "&Wkname=" + wkname + "'>" + img + "</a></span>";
		            $(td).html(tempa);
		            bol = true;
		        }
		        else if(TXT=="已完成"){
		            var src = _spPageContextInfo.webServerRelativeUrl + "/SiteAssets/images/complete.png";
		            var img = AddIcon(src, i).replace("__ALT__", viewstr);
		            var tempa = "<span><a href='" + _spPageContextInfo.listUrl + "/DispForm.aspx?Source=" + escape(window.location.href) + "&ID=" + GetId(td) + "&Wkname=" + wkname + "'>" + img + "</a></span>";
		            $(td).html(tempa);
		            bol = true;
		        }else if(TXT=="已撤回"){
		            var src=_spPageContextInfo.webServerRelativeUrl+"/SiteAssets/images/save.png";
		            var img = AddIcon(src,i).replace("__ALT__", "Click to submit the request");
		            var tempa = "<span><a href='" + _spPageContextInfo.listUrl + "/EditForm.aspx?Source=" + escape(_spPageContextInfo.webServerRelativeUrl + editPagePath) + "&ID=" + GetId(td) + "&Wkname=" + wkname + "'>" + img + "</a></span>";
		            $(td).html(tempa);
		        }
			   $(td).show();
		    }
	    }
	} catch(e) {}
	return bol;
}
//增加图片
function AddIcon(src,i){
    $(".ms-listviewtable>tbody>tr").eq(i).children("td").last().text("");
    return "<img"+" src="+src+" width='80' title='__ALT__'  class='workflow_right_tip' />";
}
//获取id
function GetId(td) {
    var ids = $(td).parent().attr("iid").split(",");
    return ids[1];
}