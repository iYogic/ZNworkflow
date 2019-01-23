'use strict';
var currentpage_index=0;//当前页面索引
var pagesigle=12;//每页梳理
var pagecurrentdatas={};
var selpageshtml="";
var bolintPageselect=false;//是否已经加载过
var totalnum=0;
var curselectdatas="";//类目
var curselectindex=0;//类目索引
var curlistTitle="";
var curlistFields="";
var curlistFieldTypes="";
var statime="";
var endtime="";
var export_alldata=[];//导出数据,

$(document).ready(function(){
	$(".nodata_parent").show();
	$(".nodata_gif").show();

	laydate.render({
	  elem: '#txtstart',
	});
	
	laydate.render({
	  elem: '#txtend',
	});
	
	//初始化类目
	getWorkflowLists("workflowdataLists");

})
//初始化类目回调
function workflowdataLists(data){
	if(data.length>0){
		curselectdatas=data;
		var select_conts="";
		for(var i=0;i<data.length;i++){
			select_conts +='<option value="'+i+'" curindex="'+i+'" ListTitle="'
							+data[i].ListTitle+'">'+data[i].ListTitle+'</option>'
		}
		$("#query_select").append(select_conts);
		$(".nodata_parent").hide();
		$(".nodata_gif").hide();
	}else{
		$(".nodata_parent").hide();
		$(".nodata_gif").hide();
	}
}

//搜索
function dosearch(){
	$("#latest-listing").hide();
	if($(".maincontent").find(".no_data").length>0){
		$(".maincontent").find(".no_data").remove();
	 }

	curlistTitle=$("#query_select").find("option:selected").text();
	var curindex=$("#query_select").find("option:selected").attr("curindex");
	if(curlistTitle.indexOf("请选择")>0){
		alert("请您先选择要查询的模块");
		return;
	}else{
		curselectindex=curindex;
		curlistFields=curselectdatas[curindex].ListFields;
		curlistFieldTypes=curselectdatas[curindex].ListFieldTypes;
		statime=$("#txtstart").val();
		statime=statime==""||statime==null||statime==undefined?"1970-01-01":statime;
		endtime=$("#txtend").val();
		endtime=endtime==""||endtime==null||endtime==undefined?"2999-12-31":endtime;

		getWorkflowData(curlistTitle,curlistFields,curlistFieldTypes,statime,endtime, 0, 0, "workflowDetailListData");
	}
}
//搜索回调数据
function workflowDetailListData(data){
	// console.log(JSON.stringify(data));//导出时用的整体模块数据
	// console.log(data);//导出时用的整体模块数据
	export_alldata=data.ListItems;

	currentpage_index=1;//当前页面索引
	pagesigle=20;//每页梳理
	
	getCurrentitems(currentpage_index,pagesigle);
}

function getCurrentitems(a,b){
	getWorkflowData(curlistTitle,curlistFields,curlistFieldTypes,statime,endtime, a, b, "newtrendsback");
}
//上一页，下一页
function gotoPageEx(c){
	var btnselpageshtml=$("#pagenum").find(".pagenumval").html();
	btnselpageshtml=parseInt(btnselpageshtml)+parseInt(c);
	btnselpageshtml=btnselpageshtml.toString();

	$("#pagenum").find(".pagenumval").html(btnselpageshtml);
	$("#selpages").find("option").removeAttr("selected");

	var options = document.getElementById('selpages').children;
	console.log(options );
	console.log(btnselpageshtml);
	
    options[btnselpageshtml].selected=true;
	gotoPage();
}
function gotoPage(){
	selpageshtml=$("#selpages").find("option:selected").val();
	selpageshtml=selpageshtml==0?1:selpageshtml;
	$("#pagenum").find(".pagenumval").html("");
	$("#pagenum").find(".pagenumval").html(selpageshtml);

	currentpage_index=selpageshtml;
	getCurrentitems(currentpage_index,pagesigle);
}
//回调
function newtrendsback(data){
		//下拉框
	 	if(!bolintPageselect){
			totalnum=Math.ceil(data.TotalCount/pagesigle);
			var selpagesOpt="";
			if(totalnum==0){
				selpagesOpt +='<option value="1" >1</option>';
			}else{
				for(var i=1;i<=totalnum;i++){
					selpagesOpt +='<option value="'+i+'" >'+i+'</option>';
				}
			}
			$("#selpages").append(selpagesOpt);
	 		bolintPageselect=true;
	 	}
	 	if(totalnum>=2){
	 		if($("#pagenum").find(".pagenumval").html()==1){
	 			$("#nextpage").show();
	 			$("#prepage").hide();
	 		}else if($("#pagenum").find(".pagenumval").html()==totalnum){
				$("#nextpage").hide();
	 			$("#prepage").show();
	 		}else {
				$("#nextpage").show();
	 			$("#prepage").show();
	 		}
	 	}else{
			$(".next_previous").hide();
	 	}
	 	//页面主要内容区域
	 	pagecurrentdatas=data.ListItems;

 		$("#latest-listing").empty();
	 	var lastest_theadcont='';
	 	var lastest_tbodycont='';
	 	if(pagecurrentdatas.length>0){

	 		lastest_theadcont='<thead><tr>';
	 		var selected_option_titile=curselectdatas[curselectindex].ListFieldTitles;
			for(var j=0; j<selected_option_titile.length;j++){
	 			lastest_theadcont +='<th>'+selected_option_titile[j]+'</th>'
	 		}
	 		lastest_theadcont +='</tr></thead>';

			lastest_tbodycont +='<tbody>';
	 		for(var i=0; i<pagecurrentdatas.length;i++){
	 			lastest_tbodycont +='<tr>';
	 			var childdata=pagecurrentdatas[i];
	 			if(childdata.length>0){
		 			for(var k=0;k<childdata.length;k++){
		 				lastest_tbodycont +='<td>'+ childdata[k] +'</td>'
		 			}
	 			}
	 			lastest_tbodycont +='</tr>';
	 		}
			 lastest_tbodycont +='</tbody>';
			 $("#latest-listing").show();
			 $("#latest-listing").append(lastest_theadcont);
			 $("#latest-listing").append(lastest_tbodycont);	
	 	}else{
			 if($(".maincontent").find(".no_data").length>0){
				$(".maincontent").find(".no_data").remove();
			 }
			var no_data='<div class="no_data" style="background-image:url(../images/no_data.png)"></div>';
			$(".maincontent").append(no_data);
		}

	
}

function getbetter(data){
	return data=data==""||data==null||data==undefined?"../images/default.png":data;
}


//导出excel
var idTmr;
function  getExplorer() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
    var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; //判断是否IE的Edge浏览器
    var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
    var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
    var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器
    //ie
    if (isIE || !!window.ActiveXObject || "ActiveXObject" in window) {
        return 'ie';
    }
    //firefox
    else if (isFF) {
        return 'Firefox';
    }
    //Chrome
    else if(isChrome){
        return 'Chrome';
    }
    //Opera
    else if(isOpera){
        return 'Opera';
    }
    //Safari
    else if(isSafari){
        return 'Safari';
    }
}

function drawThetable(){
	var exportlistTitle=$("#query_select").find("option:selected").text();
	var exportindex=$("#query_select").find("option:selected").attr("curindex");
	if(export_alldata.length<=0||export_alldata==""||export_alldata==undefined||export_alldata==null){
		alert("此模块下无数据，请您后续再试！");
		return false;
	}else{
		$("#tableExcel").empty();
		var export_theadcont='';
		var export_tbodycont='';

		export_theadcont='<thead><tr>';
		var selected_option_titile=curselectdatas[exportindex].ListFieldTitles;
		for(var j=0; j<selected_option_titile.length;j++){
			export_theadcont +='<th>'+selected_option_titile[j]+'</th>'
		}
		export_theadcont +='</tr></thead>';

		export_tbodycont +='<tbody>';
		for(var i=0; i<export_alldata.length;i++){
			export_tbodycont +='<tr>';
			var childdata=export_alldata[i];
			if(childdata.length>0){
				for(var k=0;k<childdata.length;k++){
					export_tbodycont +='<td>'+ childdata[k] +'</td>'
				}
			}
			export_tbodycont +='</tr>';
		}
		export_tbodycont +='</tbody>';

		$("#tableExcel").append(export_theadcont);	
		$("#tableExcel").append(export_tbodycont);

		return true;	
	}	
}

function export_excel() {
	if(drawThetable()){//先做第一件事填充数据
		var tableid="tableExcel";
	    if(getExplorer()=='ie'){
	        var curTbl = document.getElementById(tableid);
	        var oXL;
	        try {
	            oXL = new ActiveXObject("Excel.Application"); //创建AX对象excel
	        } catch (e) {
	            alert("无法启动Excel!\n\n如果您确信您的电脑中已经安装了Excel，" + "那么请调整IE的安全级别。\n\n具体操作：\n\n" + "工具 → Internet选项 → 安全 → 自定义级别 → 对没有标记为安全的ActiveX进行初始化和脚本运行 → 启用");
	            return false;
	        }
	        var oWB = oXL.Workbooks.Add();
	        var oSheet = oWB.ActiveSheet;
	        var Lenr = curTbl.rows.length;
	        for (var i = 0; i < Lenr; i++) {
	            var Lenc = curTbl.rows(i).cells.length;
	            for (var j = 0; j < Lenc; j++) {
	                oSheet.Cells(i + 1, j + 1).value = curTbl.rows(i).cells(j).innerText;
	            }
	        }
	        oXL.Visible = true;
	    }else{
	        tableToExcel(tableid)
	    }
	}
}

function Cleanup() {
    window.clearInterval(idTmr);
    CollectGarbage();
}
var tableToExcel = (function() {
    var uri = 'data:application/vnd.ms-excel;base64,',
    template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta http-equiv="Content-Type" content="charset=utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
    base64 = function(s) {
      return window.btoa(unescape(encodeURIComponent(s)))
    },
    format = function(s, c) {// 下面这段函数作用是：将template中的变量替换为页面内容ctx获取到的值
      return s.replace(/{(\w+)}/g,
          function(m, p) {
            return c[p];
          }
        )
    };
    return function(table, name) {
            if (!table.nodeType) {
              table = document.getElementById(table)
            }
              var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML};// 获取表单的名字和表单查询的内容
              window.location.href = uri + base64(format(template, ctx))// format()函数：通过格式操作使任意类型的数据转换成一个字符串// base64()：进行编码
            }
})()








