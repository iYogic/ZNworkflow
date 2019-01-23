'use strick';

var setupWebUrl = "/";
var setupEntity = {};
var tempParas = {};
var sub_fields = [];//子表标题数组，
var sub_items = [];//子表标题下对应的，每个子表数组，双数组，结构如下[[{},{}],[{},{}]]
var sub_inputs = [];
var sub_tables = [];//子表数组字符串
var bolDisp = false;//定义是不是查看页面
var bolEdsp = false;//定义是不是编辑页面
var bolNwsp = false;//定义是不是新增页面
var titleList = [];//纯文字title
var fldTitles = [];//包含标签的titleList
var fldCtls = [];//每个标题对应的内容行，含有标签
var heightList = [];//每行的高度,最小48px
var fldTypeList = [];//title类型
var layoutsId = "part1";//第一部分
var bolload = false;//是不是初始化第一次load
var dynamicspace = 20;//高度补给
var layoutsList = [];//数组，一个一个对象，内容为配置的页面字段信息（位置序号、名称）
var data_split = "~";
var DEL_CONFIRM_MSG = "确认删除？";
var RECALL_CONFIRM_MSG = "确认撤回？";
var listTitle = '';//列表库名称
var bolloadHistory = false;//是否已经获取了审批历史数据
var WorkflowStatus = "";//工作流状态
var wfromTask = '';//工作流从哪里点进来的
var bolinitPagecolor= false;//是否加载了页面颜色
var body_color = "#ecf8ff";//背景默认颜色
var title_color = "#45a5e2";//标题默认颜色
var bolinitgetWorkflowname=false;
var hasWorkflowname=false;

//得到这些数组，titleList（纯文字title）、fldTitles（包含标签的title）、fldTypeList（title类型）
//heightList(每行的高度,最小48px)、fldCtls（每个标题对应的内容行，含有标签）
$(document).ready(function () {
    wfromTask = sessionStorage.getItem("fromTask");//1是从我的任务列表点进来
    //列表库名称
    //sessionStorage.clear();
    listTitle = _spPageContextInfo.listTitle;
    sessionStorage.setItem("listTitle", listTitle);
    sessionStorage.setItem("listTitleurl", _spPageContextInfo.listUrl);
    //是不是查看页面
    bolDisp = isDispForm();

    //是不是新增页面
    if (!isNewForm()) {
        var workflowname = decodeURI(getQueryStringParameter("Wkname"));
        GetWFStatus(_spPageContextInfo.listTitle, workflowname, "WorkflowStatusp");
    }
     //获取工作流名称
    GetWorkflowName(_spPageContextInfo.listTitle, "WorkflowName");

    bolload = true;
    //初始化顶部设置按钮
    loadCtxmenu();

    //初始化页面颜色
    if (!bolinitPagecolor) {
        getListItems("SysJson", _spPageContextInfo.webServerRelativeUrl, _spPageContextInfo.listTitle, "", "initPagecolor");
    }

    var modtifypeople = $(".ms-formtable tr").find(".sp-peoplepicker-topLevel");
    if (modtifypeople.length > 0) {
        for (var i = 0; i < modtifypeople.length; i++) {
            var mod_oldheight_i = $(modtifypeople[i]).height();
            var mod_newheight_i = 0;
            $(modtifypeople[i]).find(".sp-peoplepicker-resolveList").on('DOMNodeInserted DOMNodeRemoved', function () {
                mod_newheight_i = $(this).parent().parent().height();
                var moreUsertitle = $(this).parent().parent().parent().siblings().text().replace("*", "").trim();
                var moreUsertitleidx = titleList.indexOf(moreUsertitle);

                if (mod_newheight_i != mod_oldheight_i) {
                    initControls();
                    var uheight = heightList[moreUsertitleidx];
                    $("#tblOpt").find("td[moreuindex='" + moreUsertitleidx + "']").css("height", uheight);
                    if (!bolload) {
                        drawTable(layoutsList);
                    }
                    mod_oldheight_i = mod_newheight_i;
                }
            });
        }
    }
    //窗口变化页面重绘
    $(window).resize(function () {
        if (!bolload) {
            setTimeout(function () {
                drawTable(layoutsList);
            }, 200);
        }
    });
});
//获取工作流名称
function WorkflowName(data){
    if(data==null){
        alert("操作失败，请您稍后重试！");
        window.history.back(-1);
    }else if(data==""){
        hasWorkflowname=false;
    }else{
        hasWorkflowname=true;
    }
    console.log("hasWorkflowname++++++++++"+hasWorkflowname);
    bolinitgetWorkflowname=true;
    //初始化页面
    getListItems("OptimizedLayouts", _spPageContextInfo.webServerRelativeUrl, _spPageContextInfo.listTitle, "<OrderBy><FieldRef Name=\'AreaNum\' Ascending =\'True\'/><FieldRef Name=\'RowNum\' Ascending =\'True\'/></OrderBy>", "initPage");

}
//初始化页面颜色
function initPagecolor(exval) {
    var backExcval = JSON.parse(exval[0].get_item("JsonVal"));
	body_color=backExcval.layoutscolor.body_color;//背景默认颜色
	title_color=backExcval.layoutscolor.tilte_color;//标题默认颜色
	
    bolinitPagecolor=true;
}

//初始化页面
function initPage(val) {
    //拿到表格的主要信息，行数，列数，标题
    for (var i = 0; i < val.length; i++) {
        var entity = {};
        entity.FieldTitle = val[i].get_item("FieldTitle");
        entity.AreaNum = val[i].get_item("AreaNum");
        entity.RowNum = val[i].get_item("RowNum");
        entity.ColNum = val[i].get_item("ColNum");
        layoutsList.push(entity);
    }
    $("#contentBox").height(0);
    $("#contentBox").css("overflow", "hidden");
    $("#contentBox").show();
    //初始化数组，把原始页面的td的内容和tr的序号进数组， 一个标题一个tr
    initControls();

    //初始化子表
    getListItems("SubRecords", _spPageContextInfo.webServerRelativeUrl, _spPageContextInfo.listTitle, "<OrderBy><FieldRef Name=\'SubColumnOrder\' Ascending =\'True\'/></OrderBy>", "initSubRecords");
}

//初始化数组，把原始页面的td的内容和tr的序号进数组， 一个标题一个tr
//得到这些数组，titleList（纯文字title）、fldTitles（包含标签的title）、fldTypeList（title类型）
//heightList(每行的高度,最小48px)、fldCtls（每个标题对应的内容行，含有标签）
function initControls() {
    var objtrs = [];//除附件的所有常规行tr
    var tmpobjtrs = $(".ms-formtable tr");
    for (var i = 0; i < tmpobjtrs.length; i++) {
        if ($(tmpobjtrs[i]).parent().parent().hasClass("ms-formtable")) {
            if ($(tmpobjtrs[i]).attr("id") != "idAttachmentsRow") {//不是附件的行
                objtrs.push(tmpobjtrs[i]);
            }
        }
    }
    titleList = [];
    fldTitles = [];
    fldTypeList = [];
    heightList = [];
    fldCtls = [];
    for (var i = 0; i < objtrs.length; i++) {
        var objs = $(objtrs[i]).find("td");
        var obj = null;
        if (objs.length > 1) {
            obj = objs[0];
        } else {
            continue;
        }
        var strTitle = $(obj).text().replace("*", "").trim();
        if (bolDisp) {//查看
            if (strTitle != "") {
                titleList.push(strTitle);//纯文字title数组
                fldTitles.push($(objs[0]).find("span")[0]);//整个span
                //多多用户和其他分开处理,最小行高48
                var spans = $(objs[1]).find(".ms-vb");//多用户
                if (spans.length > 0) {
                    fldTypeList.push("moreUser");
                    var objSpan = $(objs[1]).find(".ms-vb")[0];
                    var tmpDyHeight = $(objSpan).height() + dynamicspace;
                    if (tmpDyHeight < 48) {
                        tmpDyHeight = 48;
                    }
                    heightList.push(tmpDyHeight);
                    fldCtls.push(objSpan);
                } else {
                    fldTypeList.push("Field");
                    //多数span里要么一个table包裹内容，要么一个input输入框，要么一个textarea
                    var objSpan = $(objs[1]);
                    var subtbl = $(objSpan).find("table");
                    var subarea = $(objSpan).find("textarea");//多行文本

                    if (subtbl.length > 0) {//span内容里面是table
                        var tmpDyHeight = $(subtbl[0]).height() + dynamicspace;
                        if (tmpDyHeight < 48) {
                            tmpDyHeight = 48;
                        }
                        heightList.push(tmpDyHeight);
                    } else if (subarea.length > 0) {//多行文本
                        var tmpDyHeight = $(subarea[0]).height() + dynamicspace;
                        if (tmpDyHeight < 48) {
                            tmpDyHeight = 48;
                        }
                        heightList.push(tmpDyHeight);
                    } else {//类似td里内容这样的常规内容

                        var tmpDyHeight = $(objSpan).height() + dynamicspace;
                        if (tmpDyHeight < 48) {
                            tmpDyHeight = 48;
                        }
                        heightList.push(tmpDyHeight);
                    }
                    fldCtls.push(objSpan);
                }
            }
        }else{//新建编辑
            if (strTitle != "") {
                titleList.push(strTitle);//纯文字title数组
                fldTitles.push($(objs[0]).find("span")[0]);//整个span
                //多多用户和其他分开处理,最小行高48
                var spans = $(objs[1]).find(".sp-peoplepicker-topLevel");//多用户
                if (spans.length > 0) {
                    fldTypeList.push("moreUser");
                    var objSpan = $(objs[1]).find("div")[0];
                    var tmpDyHeight = $(objSpan).height() + dynamicspace;
                    if (tmpDyHeight < 48) {
                        tmpDyHeight = 48;
                    }
                    heightList.push(tmpDyHeight);
                    fldCtls.push(objSpan);
                } else {
                    fldTypeList.push("Field");
                    //多数span里要么一个table包裹内容，要么一个input输入框，要么一个textarea
                    var objSpan = $(objs[1]).find("span")[0];
                    var subtbl = $(objSpan).find("table");
                    var subarea = $(objSpan).find("textarea");//多行文本

                    if (subtbl.length > 0) {//span内容里面是table
                        var tmpDyHeight = $(subtbl[0]).height() + dynamicspace;
                        if (tmpDyHeight < 48) {
                            tmpDyHeight = 48;
                        }
                        heightList.push(tmpDyHeight);
                    } else if (subarea.length > 0) {//多行文本
                        var tmpDyHeight = $(subarea[0]).height() + dynamicspace;
                        if (tmpDyHeight < 48) {
                            tmpDyHeight = 48;
                        }
                        heightList.push(tmpDyHeight);
                    } else {//类似input框这样的常规内容
                        var tmpDyHeight = $(objSpan).height() + dynamicspace;
                        if (tmpDyHeight < 48) {
                            tmpDyHeight = 48;
                        }
                        heightList.push(tmpDyHeight);
                    }
                    fldCtls.push(objSpan);
                }
            }
        }
    }
}

//初始化子表
function initSubRecords(val) {
    //是不是查看页面
    //bolDisp = isDispForm();
    
    for (var i = 0; i < val.length; i++) {

        var strFieldTitle = val[i].get_item("FieldTitle");
        //根据配置数据，找出原始数据的中子表title位置，并修改类型数组中的类型为sub
        var idxType = titleList.indexOf(strFieldTitle);
        fldTypeList[idxType] = "Sub";
        if (strFieldTitle != "" && sub_fields.indexOf(strFieldTitle) < 0) {//子标题不为空，子标题在数组里没有的扔进子表数组
            sub_fields.push(strFieldTitle);
            var ctl =null;
            if (bolDisp) {
                ctl = $(fldCtls[idxType]).find("div")[0];
            }else{
                ctl = $(fldCtls[idxType]).find("textarea")[0];
            }
            sub_inputs.push($(ctl));
            var entities = [];
            var entity = {};
            entity.fieldName = strFieldTitle;
            entity.subName = val[i].get_item("SubColumnName");
            entity.subType = val[i].get_item("SubColumnType");
            entity.subWidth = val[i].get_item("SubColumnWidth");
            entity.subOrder = val[i].get_item("SubColumnOrder");
            entity.subNotes = val[i].get_item("SubColumnNotes");
            entities.push(entity);//第一层数组，放置子表第一个内容

            sub_items.push(entities);//两层数组
        } else {
            //为空或者已存在的
            //先释放后扩充
            var idx = sub_fields.indexOf(strFieldTitle);
            var entities = sub_items[idx];
            var entity = {};
            entity.fieldName = strFieldTitle;
            entity.subName = val[i].get_item("SubColumnName");
            entity.subType = val[i].get_item("SubColumnType");
            entity.subWidth = val[i].get_item("SubColumnWidth");
            entity.subOrder = val[i].get_item("SubColumnOrder");
            entity.subNotes = val[i].get_item("SubColumnNotes");
            entities.push(entity);//第一层数组扩张，放置子表第n个内容

            sub_items[idx] = entities;//子表数据数组
        }
    }

    for (var k = 0; k < sub_fields.length; k++) {//循环子表，几个子表，循环几次
        var strTableId = "custom_subrecords" + data_split + k;
        var strTableclass = "custom_subrecords"+ k;
        var strTableContainer = "";//子表内容字符串
        if (!bolDisp) {//非查看
            strTableContainer = "<div class='subrecordsbanner'><span class='subrecordstitle'>" + sub_fields[k] +
                "</span><span class='subrecordsbutton'><img src='/workflow/SiteAssets/images/add.png' class='subrecordsaddbtn sub_btn' onclick=\"addSubRecords(\'" + sub_fields[k] + "\', null, null);\" id='subrecordsaddbtn_add_" + k + "' />" +
                "</span></div><table class='subtable " + strTableclass + "' id='" + strTableId + "' cellpadding='0' cellspacing='0'>";
        } else {//查看
            strTableContainer = "<div class='subrecordsbanner'><span class='subrecordstitle'>" + sub_fields[k] +
                "</span></div><table class='subtable " + strTableclass + "' id='" + strTableId + "' cellpadding='0' cellspacing='0'>";
        }

        // Inititial sub table head,不能嵌套循环
        //for (var i = 0; i < sub_fields.length; i++) {
            var appTr = "<tr class='subtr'>";
            var entities = sub_items[k];
            for (var j = 0; j < entities.length; j++) {
                var appTd = "<td class='subtd' id='subrecords_" + k + data_split + j + "'";
                //if (entities[j].subWidth == null || entities[j].subWidth == 0 || entities[j] == "") {
                //    // Do nothing
                //} else {
                //    appTd += " style='width:" + entities[j].subWidth + "px;'";
                //}
                appTd += ">" + entities[j].subName + "</td>";
                appTr += appTd;
            }
            if (!bolDisp) {//非查看
                appTr += "<td class='subtdoperate'>操作</td></tr>";
            } else {//查看
                appTr += "</tr>";
            }
            strTableContainer += appTr;
        //}

        strTableContainer += "</table><div style='height:20px'></div>";
        sub_tables.push(strTableContainer);//子表数组字符串
    }
    drawTable(layoutsList);
}

/************************************************************
 * arrOpt: entity数组
 * entity结构:
 * .AreaNum
 * .FieldTitle
 * .RowNum
 * .ColNum
 ************************************************************/
function drawTable(arrOpt) {
    if (bolload) {
        initTable(arrOpt);
    }

    var tmpCounts = getMaxNum(arrOpt);
    var maxRow = tmpCounts[0];
    var maxCol = tmpCounts[1];
    var titleclass = "tblopttd";

    if (maxCol == 2) {
        // Do nothing
    } else {
        titleclass = "tblopttd2";
    }
    var tbleft = document.getElementById("tblOpt").offsetLeft;
    var tbtop = document.getElementById("tblOpt").offsetTop;
    for (var i = 0; i < fldCtls.length; i++) {
        try {
            var tdleft = document.getElementById("opttd_" + i).offsetLeft;
            var tdtop = document.getElementById("opttd_" + i).offsetTop;
            $(fldCtls[i]).css("position", "absolute").css("left", tdleft + tbleft).css("top", tdtop + tbtop);
            if (maxCol >= 1) {
                var iptcls = "";
                if (maxCol == 1) {
                    iptcls = "input02";
                } else {
                    iptcls = "input03";
                }

                var ipts = $(fldCtls[i]).find("input");
                for (var j = 0; j < ipts.length; j++) {
                    $(ipts[j]).addClass(iptcls);
                }

                var txts = $(fldCtls[i]).find("textarea");
                for (var j = 0; j < txts.length; j++) {
                    $(txts[j]).addClass(iptcls);
                }
            }
        } catch (e) { }
    }

    var attachleft = document.getElementById("tdattach").offsetLeft;
    var attachtop = document.getElementById("tdattach").offsetTop;
    var attachheight = $("#idAttachmentsTable").height();
    if (attachheight > 0) {
        $("#divattachtitle").text("附件");
        $("#optattach").height(attachheight + 30);
        $("#idAttachmentsTable").width(0);
        $("#idAttachmentsTable").css("position", "absolute").css("left", attachleft + tbleft).css("top", attachtop + tbtop + $("#divattachtitle").height() + 30).css("margin-left", "10px");
        $("#tblattach").show();
    } else {
        $("#tblattach").hide();
    }

    var btnleft = document.getElementById("optbtn").offsetLeft;
    var btntop = document.getElementById("optbtn").offsetTop;
    var btnwidth = $("input[value=保存]").width();
    var tmpleft = btnleft + tbleft;
    var btnSave = $("input[value=保存]");
    $(btnSave).css("position", "absolute").css("left", tmpleft).css("top", btntop + tbtop + dynamicspace * 2);
    var saveclick = $(btnSave).attr("onclick");
    saveclick = "setValues();" + saveclick;
    $(btnSave).attr("onclick", saveclick);
    $(btnSave).addClass("btnokinline");

    //构造按钮
    bolEdsp = isEditForm();//是不是编辑页面
    bolNwsp = isNewForm();//是不是新增页面
    var btnself = '<div class="btnself_div">';
    var btnSavewidth = $(btnSave).width();
    if(!bolinitgetWorkflowname){
         //获取工作流名称
        GetWorkflowName(_spPageContextInfo.listTitle, "WorkflowName");
    }
    console.log("bolEdsp-------------:"+bolEdsp)
    console.log("hasWorkflowname-------------:"+hasWorkflowname);
    console.log("WorkflowStatus-------------:"+WorkflowStatus);

    if (bolNwsp) {
        if(hasWorkflowname){
            btnself += '<span  name="btnSubmit" onclick="submitPage()" id="btnSubmit" class="btnsubmitinline btnself" target="_self">提交</span>';
        }
        btnself += '<span name="btnCancel" onclick="backPage()" id="btnCancel" class="btncancelinline btnself" target="_self">取消</span></div>';
    } else {
        //获取工作流状态
        if (WorkflowStatus == "") {//草稿
            if(hasWorkflowname){
                btnself += '<span  name="btnSubmit" onclick="submitPage()" id="btnSubmit" class="btnsubmitinline btnself" target="_self">提交</span>';
            }
            btnself += '<span name="btnCancel" onclick="backPage()" id="btnCancel" class="btncancelinline btnself" target="_self">取消</span>';
            btnself += '<span name="btnDelete" onclick="deletePage()" id="btnDelete" class="btndeleteinline btnself" target="_self">删除</span></div>';
        } else if (WorkflowStatus == "已完成") {//已完成
            $(".btnokinline").hide();
            tmpleft = tmpleft - 20;
            btnSavewidth = 0;
            drawHistory();
            btnself += '<span name="btnCancel" onclick="backPage()" id="btnCancel" class="btncancelinline btnself" target="_self">取消</span></div>'
        } else if (WorkflowStatus == "进行中") {//进行中
            $(".btnokinline").hide();
            tmpleft = tmpleft - 20;
            btnSavewidth = 0;
            if(wfromTask==1){//我的任务列表点进去
            	 btnself += '<span  name="btnAgree" onclick="ClickBtn(\'Agree\')" id="btnAgree" class="btnagreeinline btnself" target="_self" >同意</span><span name="btnReject" onclick="ClickBtn(\'Reject\')" id="btnReject" class="btnrejectinline btnself" target="_self">拒绝</span>';
            }else{
            	//常规页面点进去只有两个按钮取消和撤销，
            	if(hasWorkflowname){
            		btnself += '<span  name="btnRecall" onclick="recallPage()" id="btnRecall" class="btnrecallinline btnself" target="_self">撤销</span>';
            	}
            }
        	btnself += '<span name="btnCancel" onclick="backPage()" id="btnCancel" class="btncancelinline btnself" target="_self">取消</span></div>'
            drawHistory();
        } else if (WorkflowStatus == "已拒绝") {//已拒绝
            if(hasWorkflowname){
                btnself += '<span  name="btnSubmit" onclick="submitPage()" id="btnSubmit" class="btnsubmitinline btnself" target="_self">提交</span>';
            }
            btnself += '<span name="btnCancel" onclick="backPage()" id="btnCancel" class="btncancelinline btnself" target="_self">取消</span>';
            btnself += '<span name="btnDelete" onclick="deletePage()" id="btnDelete" class="btndeleteinline btnself" target="_self">删除</span></div>';
            drawHistory();
        }else if (WorkflowStatus == "已撤回") {//已撤回
            //if(hasWorkflowname){
                btnself += '<span  name="btnSubmit" onclick="submitPage()" id="btnSubmit" class="btnsubmitinline btnself" target="_self">提交</span>';
            //}
            btnself += '<span name="btnCancel" onclick="backPage()" id="btnCancel" class="btncancelinline btnself" target="_self">取消</span>';
            btnself += '<span name="btnDelete" onclick="deletePage()" id="btnDelete" class="btndeleteinline btnself" target="_self">删除</span></div>';
            drawHistory();
        }
    }
   

    if ($("#" + layoutsId).find(".btnself_div").length > 0) {
        $("#" + layoutsId).find(".btnself_div").remove();
    }
    $("#" + layoutsId).append(btnself);
    $(".btnself_div").css("position", "absolute").css("left", tmpleft + btnSavewidth).css("top", btntop + tbtop + dynamicspace * 2);

    function drawHistory () {//查看
        if (!bolloadHistory) {
            if ($("#" + layoutsId).find(".history").length > 0) {
                $("#" + layoutsId).find(".history").remove();
            }
            GetTaskHistory(_spPageContextInfo.listTitle, "History");
        }
    }

    var objAttachments = $("#" + layoutsId).find("img");
    var objAttachTable = null;
    for (var i = 0; i < objAttachments.length; i++) {
        if ($(objAttachments[i]).attr("src").indexOf("attachtb.gif") > 0) {
            objAttachTable = $(objAttachments[i]).parent().parent().parent().parent();
            break;
        }
    }

    if (objAttachTable != null) {
        var titleleft = document.getElementById("tblOptTitle").offsetLeft;
        var titleWid = $("#tblOptTitleCont").width();
        var titletop = document.getElementById("tblOptTitle").offsetTop;
        $(objAttachTable).css("position", "absolute").css("left", titleleft + titleWid).css("top", titletop);
    }
    
}

function WorkflowStatusp(val) {
    WorkflowStatus = val;
}
//审批历史
function History(val) {
    var arr = val;
    var hisbody_content = "";

    if (val == null || val == "" || val == undefined) {
        hisbody_content = "";
    } else {
        var Datalen = val.length;
        if (Datalen == 0) {
            hisbody_content = "";
        } else if (Datalen > 0) {
            for (var i = 0; i < Datalen; i++) {
             var shenpResult= arr[i].Result;
             if(arr[i].Result=="Rejected"){
             	shenpResult= "已拒绝";
             }
                hisbody_content += '<tr>'
                                + '<td class="history_td">' + shenpResult + '</td>'
                                + '<td class="history_td" style="padding-right:8px;"><nobr>' + arr[i].Approver + '</nobr></td>'
                                + '<td class="history_td">' + arr[i].Time + '</td>'
                                + '<td class="history_td">' + arr[i].Remark + '</td>'
                                + '</tr>'
            }
        }
    }
    var historyDiv = '<div class="history">'
                   + '<div class="hishead"><img src="'+ _spPageContextInfo.webServerRelativeUrl +'/SiteAssets/images/history.png" alt=""><span class="headtitle">审批历史</span></div>'
                   + '<div class="hisbody">'
                   + '<table><tr><th style="width:12%;">审批状态</th><th style="width:24%;">审批人</th><th style="width:12%;">审批时间</th><th>备注</th></tr>'
                   + hisbody_content
                   + '</table>'
                   + '</div></div>'

    if ($("#" + layoutsId).find(".history").length > 0) {
        $("#" + layoutsId).find(".history").remove();
    }
    $("#" + layoutsId).append(historyDiv);
    //颜色设置
    $(".history .hishead").css({ "color":title_color, "border-bottom-color":title_color });
    $(".history .hisbody th,.history .hisbody td").css("border-bottom-color",title_color);
    $(".hisbody").css("background-color", body_color);

    bolloadHistory = true;
}

//提交按钮
function submitPage() {
    var ID = getQueryStringParameter("ID");
    if (ID == null || ID == "") {
        sessionStorage.setItem("Operation", "Submit");
    } else {
        sessionStorage.setItem("Operation", ID);
    }
    var btnid = $("table.ms-formtoolbar td.ms-toolbar input[value=保存]").attr("id");
    document.getElementById(btnid).click();
}

//同意拒绝撤回按钮
//BtnClick
function ClickBtn(sign) {
    if (sign == "Agree") {
        OpenLayerAgree();
        //DoTaskUseSeal("Agree", "", "AgreeSuccessful");
    } else if (sign == "Reject") {
        OpenLayerReject();
    }
}

//Agree OpenLayer
function OpenLayerAgree() {
    var str = '<div class="layercontdiv">'
            + '<textarea id="Opinion_txt"></textarea>'
            + '<div class="layerbtndiv">'
            + '<span class="ms-ButtonHeightWidth Submits">同意</span><span class="ms-ButtonHeightWidth Cancels">关闭</span>'
            + '</div>'
            + '</div>';

    layer.open({
        type: 1,
        content: str,
        title: "同意意见",
        area: ['500px', '272px'],
        shadeClose: true
    });

    $(".Submits").on("click", function () {
        var txt = $(".layercontdiv #Opinion_txt").val();
        layer.closeAll();
        DoTaskUseSeal("Agree", txt, "AgreeSuccessful");
    });

    $(".Cancels").on("click", function () {
        $("#Opinion_txt").val("");
        layer.closeAll();
    });
}

//Reject OpenLayer
function OpenLayerReject() {
    var str = '<div class="layercontdiv">'
            + '<textarea id="Opinion_txt"></textarea>'
            + '<div class="layerbtndiv">'
            + '<span class="ms-ButtonHeightWidth Submits">拒绝</span><span class="ms-ButtonHeightWidth Cancels">关闭</span>'
            + '</div>'
            + '</div>';

    layer.open({
        type: 1,
        content: str,
        title: "退回原因",
        area: ['500px', '272px'],
        shadeClose: true
    });

    $(".Submits").on("click", function () {
        var txt = $(".layercontdiv #Opinion_txt").val();
        layer.closeAll();
        DoTaskUseSeal("Reject", txt, "RejectSuccessful");
    });

    $(".Cancels").on("click", function () {
        $("#Opinion_txt").val("");
        layer.closeAll();
    });
}

//同意和拒绝前调用
function OpenLoading() {
    var str = "<div style=\"background-image:url('" +_spPageContextInfo.webServerRelativeUrl+ loadingPath + "');background-position: center;background-color:#dee1e2;background-repeat:no-repeat;background-size:cover;width:100%;height:100%\"></div>";
    layer.open({
        content: str,
        type: 1,
        shade: false,
        area: ['500px', '272px'],
        title: false, //不显示标题
        closeBtn:0,
    });
}
//Agree Successful
function AgreeSuccessful(val) {
    var ID = getQueryStringParameter("ID");
    var id1 = getQueryStringParameter("IID");
    if (id1 != null && id1 != "" && (ID == null || ID == "")) {
        ID = id1;
    }

    GetListItemByIdEx(_spPageContextInfo.listTitle, ID, "Redir");
}
//Reject Successful
function RejectSuccessful(val) {
    var ID = getQueryStringParameter("ID");
    var id1 = getQueryStringParameter("IID");
    if (id1 != null && id1 != "" && (ID == null || ID == "")) {
        ID = id1;
    }
    GetListItemByIdEx(_spPageContextInfo.listTitle, ID, "Redir");
}

//公共回调
function Redir(val) {
    if (val != null) {
        var strTempStatus = "";
        if (val.get_item(decodeURI(getQueryStringParameter("Wkname"))) != null) {
            strTempStatus = val.get_item(decodeURI(getQueryStringParameter("Wkname"))).get_description();
        }
        if (strTempStatus != WorkflowStatus) {
            window.location.href = unescape(getQueryStringParameter("Source"));
            return;
        }
    }

    window.setTimeout(function () {
        var ID = getQueryStringParameter("ID");
        var id1 = getQueryStringParameter("IID");
        if (id1 != null && id1 != "" && (ID == null || ID == "")) {
            ID = id1;
        }

        GetListItemByIdEx(_spPageContextInfo.listTitle, ID, "Redir");
    }, 1000);
}

function initTable(arrOpt) {//arrOpt就是layoutsList;
    var tmpCounts = getMaxNum(arrOpt);//不是索引，真是的数据
    var maxRow = tmpCounts[0];//最大行
    var maxCol = tmpCounts[1];//最大列
    var titleclass = "tblopttd";

    if (maxCol == 2) {
        // Do nothing
    } else {
        titleclass = "tblopttd2";
    }

    var strTable = "<div id='divOpt' class='divOpt'><table border='0' cellpadding='0' cellspacing='0' width='100%' class='tblOpt' id='tblOpt' style='position:relative; top:0px; left:0px;'></table></div>";
    var strTableTitle = "<div id='tblOptTitle' class='tblOptTitle' style='position:relative; top:0px; left:0px;'><div id='tblOptTitleCont' class='tblOptTitleCont'><nobr>" + _spPageContextInfo.listTitle + "</nobr></div><div id='tblOptContrightNum' class='tblOptContrightNum'>系统编号&nbsp;:&nbsp;<span>"+getOrderNum()+"</span></div><div id='tblOptContrightApp' class='tblOptContrightApp'>申请者&nbsp;:&nbsp;<span>"+getApplier()+"</span></div></div>";//标题行
    var objAttachs = $("#" + layoutsId).find("img");//附件图标
    var objAttachTbl = null;
    for (var i = 0; i < objAttachs.length; i++) {
        if ($(objAttachs[i]).attr("src").indexOf("attachtb.gif") > 0) {
            objAttachTbl = $(objAttachs[i]).parent().parent().parent().parent();//附件table
            $(objAttachTbl).parent().parent().parent().parent().parent().show();//附件系列span
            $(objAttachTbl).addClass("attachcss");
            break;
        }
    }

    var orgTbls = $("#" + layoutsId + ">table");//part1下的第一级table,
    var orgSpan = $("#" + layoutsId + ">span");//part1下的第一级span
    for (var i = 0; i < orgTbls.length; i++) {
        $(orgTbls[i]).css("display", "inline-block").css("height", "0px").css("overflow", "hidden");
    }
    for (var i = 0; i < orgSpan.length; i++) {
        $(orgSpan[i]).css("display", "inline-block").css("height", "0px").css("overflow", "hidden");
    }

    var strButton = "<div id='divBtn'></div>";
    $("#" + layoutsId).prepend($(strTable));//part1内扔进table
    $("#" + layoutsId).prepend($(strTableTitle));//part1内扔进标题

    var strtrs = "";
    for (var i = 0; i <= maxRow + 1; i++) {//多了两行
        var strtr = "<tr>";
        var bolIsSub = false;
        if (i == maxRow + 1) {//最后一行放置按钮
            strtr += "<td colspan='" + maxCol * 2 + "' id='optbtn' style='height:60px'>" + strButton + "</td>";
        } else if (i == maxRow) {//倒数第二行放置附件列表
            strtr += "<td colspan='" + maxCol * 2 + "' id='tdattach' style='height:24px; padding-top:6px;'>";
            strtr += "<table border='0' cellpadding='0' cellspacing='0' id='tblattach' class='tblattach'><tr><td id='divattachtitle' class='divattach'>&nbsp;</td></tr><tr><td id='optattach' class='optattachctl'></td></tr></table></td>";
        } else {//常规行放置配置数据
            for (var j = 0; j < maxCol; j++) {
                var strtd = "";
                var strSubTitle = "";
                for (var k = 0; k < arrOpt.length; k++) {
                    if (arrOpt[k].RowNum == i && arrOpt[k].ColNum == j) {//二维坐标定位到配置的标题行
                        var idx = titleList.indexOf(arrOpt[k].FieldTitle);//标题行索引
                        strSubTitle = arrOpt[k].FieldTitle;//标题
                        if (fldTypeList[idx] == "Sub") {//子表行，循环到即停止
                            bolIsSub = true;
                            break;
                        }
                        if (idx >= 0) {
                            strtd = "<td class='" + titleclass + "'>" + $(fldTitles[idx]).html() + "</td>";
                            if (heightList[idx] > 0) {
                                if (fldTypeList[idx] == "moreUser") {//多用户分开处理
                                    strtd += "<td style='height:" + heightList[idx] + "px;' id='opttd_" + idx + "' moreUindex='" + idx + "'>&nbsp;</td>";
                                } else {
                                    strtd += "<td style='height:" + heightList[idx] + "px;' id='opttd_" + idx + "'>&nbsp;</td>";
                                }
                            } else {
                                strtd += "<td id='opttd_" + idx + "'>&nbsp;</td>";
                            }
                        }
                        break;
                    }
                }

                if (bolIsSub) {
                    break;
                }
                if (strtd == "") {
                    strtd = "<td>&nbsp;</td><td>&nbsp;</td>";
                }
                strtr += strtd;
            }

            if (bolIsSub) {//处理子表
                var subIdx = sub_fields.indexOf(strSubTitle);
                strtr = "<td colspan='" + maxCol * 2 + "' id='opttdsub_" + i + "'>" + sub_tables[subIdx] + "</td>";
            }
        }
        strtrs += strtr + "</tr>";
    }
    $("#tblOpt").append($(strtrs));//子表在内全部扔进去
    for (var i = 0; i < sub_fields.length; i++) {
        
        if (getQueryStringParameter("ID") == "") {
            addSubRecords(sub_fields[i], null, null);//新建
        } else {
            var tmpJson = "";
            if (!bolDisp) {//编辑，textarea内容
                tmpJson = $(sub_inputs[i]).text();
            } else {//查看，textarea里的所有
                tmpJson = sub_inputs[i].html();
            }
           
            try {
                var tmpentity = JSON.parse(tmpJson);
                for (var j = 0; j < tmpentity.FieldValues.length; j++) {
                    addSubRecords(sub_fields[i], tmpentity.FieldValues[j], (j + 1));
                }
            } catch (e) {
            }
        }
    }

    var attachclick = $("#attachOKbutton").attr("onclick");
    attachclick += ";drawTable(layoutsList);";
    $("#attachOKbutton").attr("onclick", attachclick);

    $("#contentBox").css("overflow", "");
    
    //颜色设置
	$(".tblOptTitle").css({ "color": title_color, "border-bottom-color": title_color});
    $(".divOpt").css("background-color",body_color);
	$(".divattach").css({ "color": title_color, "border-bottom-color": title_color, "border-top-color": title_color});
	$(".subrecordsbanner").css({ "border-bottom-color": title_color, "border-top-color": title_color});
	$(".subtable td").css("border-bottom-color",title_color);
	
    bolload = false;
}

function getApplier(){//获取申请者
    if(isNewForm()){
        return _spPageContextInfo.userDisplayName
    }else{
        return curItemUser;
    }
}
function getOrderNum(){//获取系统编号
    if(isNewForm()){
        return '----';
    }else{
        var length=8;
        var id = getQueryStringParameter("ID");
        var stryear = "" + (new Date()).getFullYear();
        var str = stryear + ("00000000000000000" + id).substr((-1) * (length - 4));
        return str;
    }
}
//增加子表内容行
function addSubRecords(fldtitle, vals, ival) {
    var idx = sub_fields.indexOf(fldtitle);
    var entities = sub_items[idx];
    var appTr = "<tr class='subtrctl'></tr>";

    var strclass = "custom_subrecords"+ idx;
    var tblObj = $("." + strclass);

    $(tblObj).append($(appTr));
    var appTrs = $(tblObj).find("tr");
    var appTrObj = appTrs[appTrs.length - 1];

    if (vals == null) {
        //根据是不是查看添加不一样的内容，appTrObj保证是最后一个新添加的tr
        for (var i = 0; i < entities.length; i++) {
            var appTd = "<td class='subtdctl'>";
            if (entities[i].subType == "text") {
                if (!bolDisp) {
                    appTd += "<input type='text' value='' class='subrecords_text' id='subrecords_values_" + ival + data_split + i + "' style='max-width:99%;' />";
                } else {
                    appTd += "<span class='subrecords_text_disp' id='subrecords_values_" + ival + data_split + i + "' style='max-width:99%;'>&nbsp;</span>";
                }
            }
            appTd += "</td>";
            $(appTrObj).append($(appTd));
        }
    } else {
        for (var i = 0; i < entities.length; i++) {
            var appTd = "<td class='subtdctl'>";
            var tmpVal = "";
            for (var j = 0; j < vals.length; j++) {
                if (entities[i].subName == vals[j].Name) {
                    tmpVal = vals[j].Value;
                    break;
                }
            }

            if (entities[i].subType == "text") {
                if (!bolDisp) {
                    appTd += "<input type='text' value='" + tmpVal + "' class='subrecords_text' id='subrecords_values_" + ival + data_split + i + "' style='max-width:99%;' />";
                } else {
                    appTd += "<span class='subrecords_text_disp' id='subrecords_values_" + ival + data_split + i + "' style='max-width:99%;'>" + tmpVal + "</span>";
                }
            }
            appTd += "</td>";
            $(appTrObj).append($(appTd));
        }
    }

    if (!bolDisp) {//不是查看

        var btnDelId = "subrecordsaddbtn_del_" + idx;
        var btnTd = "<td class='subtdctl_del'><img src='/workflow/SiteAssets/images/del.png' alt='' id='" + btnDelId + "' style='cursor:pointer' /></td>";
        $(appTrObj).append($(btnTd));

        var tmpBtn = $(appTrObj).find("img")[0];
        $(tmpBtn).click(function () {
            delSubRecords(this);
        });
    }

    if (!bolload) {
        drawTable(layoutsList);
    }

}
//取消
function backPage() {
    var url = getQueryStringParameter("Source");
    if (url == "") {
        window.history.back(-1);
    } else {
        window.location.href = unescape(url);
    }
}

//删除
function deletePage() {
    if (window.confirm(DEL_CONFIRM_MSG)) {
        deleteItem("deleteresult")
    } else {
        // not delete do nothing
    }
}

//删除回调
function deleteresult(dval) {
	if(dval=="Success"){
		backPage()
	}else if(dval=="Failed"){
		alert("删除失败，请您稍后重试！")
	}
}
//撤回按钮
function recallPage() {
 	if (window.confirm(RECALL_CONFIRM_MSG)) {
    	var  listTitle=_spPageContextInfo.listTitle;
		DoWithdraw(listTitle, "getRecallDataback");
    } else {
        // not delete do nothing
    }
}
//撤回回调
function getRecallDataback(data){
	if(data.toUpperCase()=="SUCCESS"){
		backPage();	
	}else {
		alert("撤回失败，请您稍后重试！")
	}
}

//获取最大行和最大列
function getMaxNum(arrOpt) {
    var rowNum = 0;
    var colNum = 0;
    for (var i = 0; i < arrOpt.length; i++) {
        var tmpRow = arrOpt[i].RowNum + 1;
        var tmpCol = arrOpt[i].ColNum + 1;
        if (rowNum < tmpRow) {
            rowNum = tmpRow;
        }

        if (colNum < tmpCol) {
            colNum = tmpCol;
        }
    }

    var rtn = [];
    rtn.push(rowNum);
    rtn.push(colNum);
    return rtn;
}

//定时器，添加表单外观设置
//有漏洞，后续需要改为回调方法改进
function loadCtxmenu() {
    //页面设置按钮id
    var ctxmenu = $("#O365_MainLink_Settings");
    if ($(ctxmenu).length > 0) {
        $(ctxmenu).attr("onclick", "loadOptSetting()");
    } else {
        setTimeout(function () {
            loadCtxmenu();
        }, 500);
    }
}

function loadOptSetting() {
    var ctxmenu = $(".contextMenuPopup");
    if ($(ctxmenu).length > 0) {
        var menus = $(ctxmenu).find("a");
        for (var i = 0; i < menus.length; i++) {
            if ($(menus[i]).attr("aria-label").trim() == "设计管理器") {
                $(menus[i]).attr("href", "../../SiteAssets/pages/formconfig.aspx?listtitle=" + encodeURI(_spPageContextInfo.listTitle));
                $(menus[i]).html("表单外观设置");
                $(menus[i]).attr("aria-label", "表单外观设置");
            }
        }
    } else {
        setTimeout(function () {
            loadOptSetting();
        }, 500);
    }
}

//格式化数字格式00x
FormatNum = function () {
    var tbl = [];
    return function (num, n) {
        var len = n - num.toString().length;
        if (len <= 0) return num;
        if (!tbl[len]) tbl[len] = (new Array(len + 1)).join('0');
        return tbl[len] + num;
    }
}();

/*****************************************************************
 * 获取配置表数据
 * setupListTitle: 配置库名称 
 * dataWebUrl: 查询条件，数据WebUrl
 * dataListTitle: 查询条件，数据ListTitle
 * dataQuery: Query XML语句
 * callFunc: 异步执行完成后的回调函数名，方法中的参数数量为1个
 *           如：InitPageItems(val)，则传入"InitPageItems"
 *           如callFunc=null或空，则表示不需要回调
 *****************************************************************/
function getListItemsByQuery(setupListTitle, dataWebUrl, dataListTitle, dataQuery, callFunc) {
    var querys = dataQuery;
    SP.SOD.executeFunc("sp.js", 'SP.ClientContext', function () {
        var clientContext = new SP.ClientContext(setupWebUrl);
        setupEntity.callFunc = callFunc;
        if (clientContext != undefined && clientContext != null) {
            var webSite = clientContext.get_web();
            var oList = webSite.get_lists().getByTitle(setupListTitle);
            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml(querys);
            var oListItems = oList.getItems(camlQuery);
            clientContext.load(oListItems);
            clientContext.executeQueryAsync(function onQuerySucceeded(sender, args) {
                setupEntity.collListItem = oListItems;
                var listItemEnumerator = oListItems.getEnumerator();
                var listItems = [];
                while (listItemEnumerator.moveNext()) {
                    var oListItem = listItemEnumerator.get_current();
                    listItems.push(oListItem);
                }

                if (callFunc != null && callFunc != "") {
                    var fn = window[callFunc];
                    fn(listItems);
                }
            }, function onQueryFailed(sender, args) {
                if (callFunc != null && callFunc != "") {
                    var fn = window[callFunc];
                    fn(null);
                }
            });
        }
    });
}

/*****************************************************************
 * 获取配置表数据
 * setupListTitle: 配置库名称 
 * dataWebUrl: 查询条件，数据WebUrl
 * dataListTitle: 查询条件，数据ListTitle
 * callFunc: 使用默认Query XML语句
 *           异步执行完成后的回调函数名，方法中的参数数量为1个
 *           如：InitPageItems(val)，则传入"InitPageItems"
 *           如callFunc=null或空，则表示不需要回调
 *****************************************************************/
function getListItems(setupListTitle, dataWebUrl, dataListTitle, orderXml, callFunc) {
    var querys = "";
    querys = "<View Scope=\'RecursiveAll\'>" +
        "<Query>" +
        "<Where>" +
        "<And>" +
        "<Eq><FieldRef Name=\'WebUrl\'/><Value Type=\'Text\'>" + dataWebUrl + "</Value></Eq>" +
        "<Eq><FieldRef Name=\'ListTitle\'/><Value Type=\'Text\'>" + dataListTitle + "</Value></Eq>" +
        "</And>" +
        "</Where>" +
        orderXml +
        "</Query>" +
        "</View>";
    getListItemsByQuery(setupListTitle, dataWebUrl, dataListTitle, querys, callFunc);
}

function delSubRecords(obj) {
    if (window.confirm(DEL_CONFIRM_MSG)) {
        $(obj).parent().parent().remove();
    }
    drawTable(layoutsList);
}

function getTableJson(fldTitle) {
    var idx = sub_fields.indexOf(fldTitle);
    var objTrs = $(".custom_subrecords"+idx).find("tr");
    var entity = {};
    entity.FieldTitle = fldTitle;
    entity.FieldValues = [];

    var objTitles = $(objTrs[0]).find("td");
    for (var i = 1; i < objTrs.length; i++) {
        var subents = [];
        var objTds = $(objTrs[i]).find("td");
        for (var j = 0; j < objTds.length - 1; j++) {
            var subent = {};
            subent.Name = $(objTitles[j]).text();
            subent.Value = $($(objTds[j]).find(":input")[0]).val();
            subents.push(subent);
        }
        entity.FieldValues.push(subents);
    }
    return JSON.stringify(entity);
}

function setValues() {
    for (var i= 0; i<sub_fields.length; i++) {
        $(sub_inputs[i]).text(getTableJson(sub_fields[i]));
    }
}

//判断是不是查看
function isDispForm() {
    if (document.URL.toLowerCase().indexOf("/dispform.aspx?") > 0) {
        return true;
    } else {
        return false;
    }
}
//判断是不是编辑
function isEditForm() {
    if (document.URL.toLowerCase().indexOf("/editform.aspx?") > 0) {
        return true;
    } else {
        return false;
    }
}
//判断是不是新增
function isNewForm() {
    if (document.URL.toLowerCase().indexOf("/newform.aspx?") > 0) {
        return true;
    } else {
        return false;
    }
}

function deleteItem(callFunc) {
    if (isEditForm()) {
        var curId = getQueryStringParameter("ID");
        SP.SOD.executeFunc("sp.js", 'SP.ClientContext', function () {
            var clientContext = new SP.ClientContext(_spPageContextInfo.webServerRelativeUrl);
            if (clientContext != undefined && clientContext != null) {
                var webSite = clientContext.get_web();
                var oList = webSite.get_lists().getByTitle(listTitle);
                var iid = parseInt(curId);
                var oListItem = oList.getItemById(iid);
                clientContext.load(oListItem);
                oListItem.deleteObject();
                clientContext.executeQueryAsync(function onQuerySucceeded(sender, args) {
                    if (callFunc != null && callFunc != "") {
                        var fn = window[callFunc];
                        fn("Success");
                    }
                }, function onQueryFailed(sender, args) {
                    if (callFunc != null && callFunc != "") {
                        var fn = window[callFunc];
                        fn("Failed");
                    }
                });
            }
        });
    }
}