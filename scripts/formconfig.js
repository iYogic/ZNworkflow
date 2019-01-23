'use strick';

// Angular App
var app = angular.module('ShareToolkitApp', []);

app.controller('ShareToolkitLayouts', function ($scope, appService, $interval, $timeout, $compile, $q) {
    var curWebUrl = _spPageContextInfo.webServerRelativeUrl;
    //属性字段设置用
    var nameselectoptsval = [];
    var nameselectoptsTypes = [];
    var htmlname_select = {};
    var htmlname_selectnote = "";
    htmlname_selectnote = "<option class='name_selectopt' maintype='' value=''>--请选择--</option>";

    //添加字段
    $scope.myword = function ($event) {
        addmyword($scope, $event, $compile);
    }
    //设置显示设置
    $scope.myshow = function ($event) {
        //属性字段设置
        addmyshow($scope, $event, $compile, htmlname_select);
    }

    //设置显示添加子表列数
    $scope.myadd = function ($event) {
        addmyadd($scope, $event, $compile, htmlname_selectnote);
    }

    //删除
    $scope.delicon = function ($event, icon) {
        if (icon == 1) {
            var del_name_val = $($event.target).siblings(".sign_word").html();
            var delet_index = $.inArray(del_name_val, nameselectoptsval);
            $("#divleftfld").append('<div class="leftfldbg" maintype="' + nameselectoptsTypes[delet_index] + '" onclick="selFld(this)">' + del_name_val + '(' + nameselectoptsTypes[delet_index] + ')</div>')

            $($event.target).parent().remove();
        } else if (icon == 2) {
            var del_name_val = $($event.target).siblings(".min_tab_txt").html();
            //如果标题是请点击选择属性字段就不用做任何处理，如果不是，把值重新扔回name_select
            if (del_name_val.indexOf("请点击选择属性字段") < 0) {
                var delet_index = $.inArray(del_name_val, nameselectoptsval);
                $("#divleftfld").append('<div class="leftfldbg" maintype="' + nameselectoptsTypes[delet_index] + '" onclick="selFld(this)">' + del_name_val + '(' + nameselectoptsTypes[delet_index] + ')</div>')
            }
            $($event.target).closest('.insert_tr').remove();
        }
    };

    //属性字段设置
    var ListTitle = getQueryStringParameter("listtitle");
    ListTitle = decodeURI(ListTitle);
    var pro = appService.GetListFieldsByTitle(curWebUrl, ListTitle);
    pro.then(function (val) {
        //显示字段设置
        var divleft = "<div class='divlefttitle'>字段设置</div><div id='divleftfld' class='divleftfld'>";
        for (var i = 0; i < val.Fields.length; i++) {
            divleft += "<div class='leftfldbg' maintype='" + val.FieldTypes[i] + "'  onclick='selFld(this)' >" + val.Fields[i] + "(" + val.FieldTypes[i] + ")" + "</div>";
            //类型和值进入两个数组
            nameselectoptsval.push(val.Fields[i]);
            nameselectoptsTypes.push(val.FieldTypes[i]);
            //多行文本封装一下，子表用
            if (val.FieldTypes[i] == "Note") {
                htmlname_selectnote += "<option class='name_selectopt' maintype='" + val.FieldTypes[i] + "' value='" + val.Fields[i] + "'>" + val.Fields[i] + "</option>";
            }
        }
        //封装起来，后续用
        htmlname_select.val = nameselectoptsval;
        htmlname_select.type = nameselectoptsTypes;
        //htmlname_select封装好

        divleft += "</div><div class='leftflgbtn' ng-click='myword($event)'>添加字段</div>";

        //显示添加子表列数
        var subconfig = '<div class="divlefttitle">子表设置</div><div class="choose_box sub_box">' +
            '<select class="sub_select">' +
            '<option value="1" selected>1列</option>' +
            '<option value="2">2列</option>' +
            '<option value="3">3列</option>' +
            '<option value="4">4列</option>' +
            '<option value="5">5列</option>' +
            '<option value="6">6列</option>' +
            '</select>' +
            '<span class="serchleft_btn add_btn" ng-click="myadd($event)">添加子表</span></div>';
        divleft += subconfig;
        $("#globalleft").append($compile(divleft)($scope));

        //显示设置
        var divright = "<div id='divrightfld' class='divrightfld'>";
        divright += "<div class='divrighttitle'>显示设置</div>";
        divright += "<table border='0' cellpadding='0' cellspacing='0' width='100%'><tr>";
        divright += "<td width='33%' class='divrighttd'><div class='divrighttddiv' id='divrighttddiv01' ng-click='myshow($event)'><div>单列</div><table border='0' class='divrighttbl' cellpadding='0' cellspacing='0'>" +
            "<tr><td>&nbsp;</td></tr><tr><td>&nbsp;</td></tr></table></div></td>";
        divright += "<td width='33%' class='divrighttd'><div class='divrighttddiv' id='divrighttddiv02' ng-click='myshow($event)'><div>双列</div><table border='0' class='divrighttbl' cellpadding='0' cellspacing='0'>" +
            "<tr><td width='50%'>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr></table></div></td>";
        divright += "<td width='33%' class='divrighttd'><div class='divrighttddiv' id='divrighttddiv03' ng-click='myshow($event)'><div>三列</div><table border='0' class='divrighttbl' cellpadding='0' cellspacing='0'>" +
            "<tr><td width='33%'>&nbsp;</td><td width='33%'>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></table></div></td></tr></table>";


        divright += "<div class='divrighttitle2'>样式设置</div>";
        divright += "<table border='0' cellpadding='0' cellspacing='0' width='100%' class='divrighttbl2'>";
        divright += "<tr><td width='50%'><div class='divrightstyle01' colorkey='divrightstyle01' onclick='selStyle(this)'><div class='divrightstyletitle'>&nbsp;</div><div class='divrightstylebody'>&nbsp;</div></div></td>" +
            "<td><div class='divrightstyle02' colorkey='divrightstyle02' onclick='selStyle(this)'><div class='divrightstyletitle'>&nbsp;</div><div class='divrightstylebody'>&nbsp;</div></div></td></tr>" +
            "<tr><td><div class='divrightstyle03' colorkey='divrightstyle03' onclick='selStyle(this)'><div class='divrightstyletitle'>&nbsp;</div><div class='divrightstylebody'>&nbsp;</div></div></td>" +
            "<td><div class='divrightstyle04' colorkey='divrightstyle04' onclick='selStyle(this)'><div class='divrightstyletitle'>&nbsp;</div><div class='divrightstylebody'>&nbsp;</div></div></td></tr>" +
            "<tr><td><div class='divrightstyle05' colorkey='divrightstyle05' onclick='selStyle(this)'><div class='divrightstyletitle'>&nbsp;</div><div class='divrightstylebody'>&nbsp;</div></div></td>" +
            "<td><div class='divrightstyle06' colorkey='divrightstyle06' onclick='selStyle(this)'><div class='divrightstyletitle'>&nbsp;</div><div class='divrightstylebody'>&nbsp;</div></div></td></tr>" +
            "<tr><td><div class='divrightstyle07' colorkey='divrightstyle07' onclick='selStyle(this)'><div class='divrightstyletitle'>&nbsp;</div><div class='divrightstylebody'>&nbsp;</div></div></td>" +
            "<td><div class='divrightstyle08' colorkey='divrightstyle08' onclick='selStyle(this)'><div class='divrightstyletitle'>&nbsp;</div><div class='divrightstylebody'>&nbsp;</div></div></td></tr>" +
            "<tr><td><div class='divrightstyle09'  colorkey='divrightstyle09'  onclick='selStyle(this)'><div class='divrightstyletitle'>&nbsp;</div><div class='divrightstylebody'>&nbsp;</div></div></td>" +
            "<td><div class='divrightstyle10' colorkey='divrightstyle10' onclick='selStyle(this)'><div class='divrightstyletitle'>&nbsp;</div><div class='divrightstylebody'>&nbsp;</div></div></td></tr>" +
            "</table>";

        $("#globalright").append($compile(divright)($scope));
        $("#divrighttddiv01").attr("class", "divrighttddiv divrighttddivsel");
        $(".divrightstyle01").attr("class", "divrightstyle01 divrightstylesel");
        $(".tab_title").text(decodeURI(getQueryStringParameter("listtitle")));
        $("#globalright").show();

        //判断是新增还是编辑
        var proExchange = appService.GetJson(curWebUrl, ListTitle, "proDataJson");
        proExchange.then(function (exval) {
            if (exval.length == 0) {
                //新建
                //逻辑处理好，显示左边
                $("#globalleft").show();

                //初始化列表
                show_pages($scope, 15, 1, 10 + "%");
                //表格渲染完了放出下方的保存关闭按钮
                $(".five_btn").show();

            } else {
                //先展示
                var backExcval = JSON.parse(exval);
                //行 
                var backExcval_row = backExcval.scopetr_len;
                //列
                var backExcval_col = backExcval.scopetd_len;

                //依据设置选中列值
                if (backExcval_col) {
                    //切换效果
                    $("#divrighttddiv01").attr("class", "divrighttddiv");
                    $("#divrighttddiv02").attr("class", "divrighttddiv");
                    $("#divrighttddiv03").attr("class", "divrighttddiv");
                    $("#divrighttddiv0" + backExcval_col).addClass("divrighttddivsel");
                }
                //开始显示表格
                show_pages($scope, backExcval_row, backExcval_col, 10 + "%");

                //表格渲染完了放出下方的保存关闭按钮
                $(".five_btn").show();

                //渲染样式
                var colorkey = backExcval.layoutscolor.colorkey;
                if (colorkey) {
                    $(".divrightstyle01").attr("class", "divrightstyle01");
                    $(".divrightstyle02").attr("class", "divrightstyle02");
                    $(".divrightstyle03").attr("class", "divrightstyle03");
                    $(".divrightstyle04").attr("class", "divrightstyle04");
                    $(".divrightstyle05").attr("class", "divrightstyle05");
                    $(".divrightstyle06").attr("class", "divrightstyle06");
                    $(".divrightstyle07").attr("class", "divrightstyle07");
                    $(".divrightstyle08").attr("class", "divrightstyle08");
                    $(".divrightstyle09").attr("class", "divrightstyle09");
                    $(".divrightstyle10").attr("class", "divrightstyle10");

                    $(".divrighttbl2").find("div[colorkey='" + colorkey + "']").addClass("divrightstylesel");

                    $(".tab_title").css("background-color", backExcval.layoutscolor.tilte_color);
                    $(".table").css("background-color", backExcval.layoutscolor.body_color);
                }
               
                //拿到内容数据,开始填充
                var backExcval_middata = backExcval.exchange_middata;
                for (var i = 0; i < backExcval_middata.length; i++) {
                    //无子表
                    var Xrow = backExcval_middata[i].RowNum;
                    var Yrow = backExcval_middata[i].ColNum;
                    var ExcFieldTitle = backExcval_middata[i].FieldTitle;
                    if (backExcval_middata[i].exchange_obj.length == 0) {
                        backExca_word($scope, $compile, Xrow, Yrow, ExcFieldTitle);
                    } else {
                        //有子表
                        var backExcval_child = backExcval_middata[i].exchange_obj;
                        backExca_child($scope, $compile, Xrow, Yrow, backExcval_col, ExcFieldTitle, backExcval_child, htmlname_selectnote);
                    }
                }
               
                $("#globalleft").show();
            }
        })
    });

    //保存
    $scope.Save = function ($event) {
        var entities = [];
        var entities_main = [];
        var entities_sub = [];
        //执行构照函数,封装提交需要的两个数组
        entities = savepack(entities, curWebUrl);
        //console.log(entities);
        if (entities == undefined || entities == "" || entities == null) {
            //do nothing
        }else{
            entities_main = entities[0];
            entities_sub = entities[1];

            //显示用
            var exchange_json = entities[2];
            exchange_json = JSON.stringify(exchange_json);
            // 获取所有OptimizedLayouts数据
            var proGetMain = appService.GetItems(curWebUrl, ListTitle, curWebUrl, "OptimizedLayouts");

            proGetMain.then(function (valGetMain) {
                // 删除所有OptimizedLayouts数据
                var proDelMain = [];
                for (var i = 0; i < valGetMain.length; i++) {
                    var pr = appService.DeleteItem(curWebUrl, "OptimizedLayouts", valGetMain[i].get_id());
                    proDelMain.push(pr);
                }
                $q.all(proDelMain).then(function (valDelMain) {
                    // 获取所有SubRecords数据
                    var proGetSub = appService.GetItems(curWebUrl, ListTitle, curWebUrl, "SubRecords");
                    proGetSub.then(function (valGetSub) {
                        // 删除所有SubRecords数据
                        var proDelSub = [];
                        for (var i = 0; i < valGetSub.length; i++) {
                            var pr = appService.DeleteItem(curWebUrl, "SubRecords", valGetSub[i].get_id());
                            proDelSub.push(pr);
                        }
                        $q.all(proDelSub).then(function (valDelSub) {

                            // 保存OptimizedLayouts数据
                            var arrayPro = [];
                            for (var i = 0; i < entities_main.length; i++) {
                                var pr = appService.SaveMainItem(curWebUrl, "OptimizedLayouts", entities_main[i]);
                                arrayPro.push(pr);
                            }
                            $q.all(arrayPro).then(function (val) {
                                if (val == null) {
                                    // error
                                } else {
                                    // 保存SubRecords数据
                                    var arrayPro1 = [];
                                    //console.log(entities_sub);
                                    for (var i = 0; i < entities_sub.length; i++) {
                                        var pr = appService.SaveSubItem(curWebUrl, "SubRecords", entities_sub[i]);
                                        arrayPro1.push(pr);
                                    }
                                    //console.log(JSON.stringify(entities_sub));
                                    $q.all(arrayPro1).then(function (val1) {
                                        if (val1 == null) {
                                            // error
                                        } else {
                                            var proGetJson = appService.GetItems(curWebUrl, ListTitle, curWebUrl, "SysJson");
                                            //console.log(ListTitle);
                                            proGetJson.then(function (valGetJson) {
                                                var arrayProJson = [];
                                                for (var i = 0; i < valGetJson.length; i++) {
                                                    var pr = appService.DeleteItem(curWebUrl, "SysJson", valGetJson[i].get_id());
                                                    arrayProJson.push(pr);
                                                }

                                                $q.all(arrayProJson).then(function (valDelJson) {
                                                    var pro2 = appService.SaveJson(curWebUrl, ListTitle, exchange_json, "proDataJson");
                                                    //console.log(ListTitle);
                                                    pro2.then(function (val2) {
                                                        alert("保存成功啦！");
                                                        window.location.href = window.location.href;
                                                    });
                                                });
                                            });
                                        }
                                    });
                                }
                            });
                        });
                    });
                });
            });
        }
    }
    
    //返回
    $scope.closePage = function ($event) {
        var sourse = getQueryStringParameter("sourse");
        if (sourse) {
            window.location.href = sourse;
        } else {
            window.history.back(-1);
        }
    }
});

//点击属性字段切换效果
function selFld(obj) {
    var divs = $("#divleftfld").find("div");
    for (var i = 0; i < divs.length; i++) {
        $(divs[i]).attr("class", "leftfldbg");
    }
    $(obj).attr("class", "leftfldbg leftfldbgsel");
}
//样式切换效果
function selStyle(obj) {
    $(".divrightstyle01").attr("class", "divrightstyle01");
    $(".divrightstyle02").attr("class", "divrightstyle02");
    $(".divrightstyle03").attr("class", "divrightstyle03");
    $(".divrightstyle04").attr("class", "divrightstyle04");
    $(".divrightstyle05").attr("class", "divrightstyle05");
    $(".divrightstyle06").attr("class", "divrightstyle06");
    $(".divrightstyle07").attr("class", "divrightstyle07");
    $(".divrightstyle08").attr("class", "divrightstyle08");
    $(".divrightstyle09").attr("class", "divrightstyle09");
    $(".divrightstyle10").attr("class", "divrightstyle10");

    $(obj).addClass("divrightstylesel");

    var divs = $(obj).find("div");
    var bg1 = $(divs[0]).css("background-color");
    var bg2 = $(divs[1]).css("background-color");
    $(".tab_title").css("background-color", bg1);
    $(".table").css("background-color", bg2);
}

//外调显示表格
function show_pages($scope, row, col, width) {
    for (var i = 0; i < row; i++) {
        $(".table").append("<tr class='scope_tr'></tr>");
    }
    for (var i = 0; i < col; i++) {
        $(".table tr").append("<td style=" + "width:" + width + " class ='scope_td'></td>")
    }
    //dom 渲染成功，注册dom点击事件
    select($scope, "table");
}

//table中tr和td选中后效果
function select($scope, name) {
    $("." + name + " td").on("click", function () {
        $("." + name + " td").css("background", "").removeClass("sign_td");
        $(this).css("background", "#E1F0F9").addClass("sign_td");
    })
    $("." + name + " tr").on("click", function () {
        $("." + name + " tr").removeClass("sign_tr").attr("id", "");
        $(this).addClass("sign_tr").attr("id", name + "_tr");
    })
}

//添加属性字段
function addmyword($scope, $event, $compile) {
    //选中的td
    var name_sign = $(".sign_td").length;
    //选中的td中的字段
    var name_index = $(".sign_td .sign_word").length;

    if (name_sign != 1) {
        alert("请选择添加字段的列表");
        return;
    }

    if ($("#divleftfld").find(".leftfldbgsel").length!=1) {
        alert("请选择要添加的字段");
        return;
    }
    //属性字段
    var name_valueAll = $("#divleftfld").find(".leftfldbgsel").html();
    var name_value = name_valueAll.substring(0, name_valueAll.indexOf("("));

    var name_valuetype = $("#divleftfld").find(".leftfldbgsel").attr("maintype");
    //子表字段允许添加，20180802
    //if (name_valuetype == "Note") {
    //    alert("该字段为子表字段，请添加其他字段");
    //    return;
    //}
    if (name_index == 0) {
        if (name_value != "") {
            //定义
            $scope.value = "<div class='input_box'>"
                    + "<span class='sign_word'>" + name_value + "</span>"
                    + "<div class='del_icon' ng-click='delicon($event,1)'></div>"
                + "</div>";
            $(".sign_td").append(
                //编译后用于填充,不可删除
                $compile($scope.value)($scope)
            )
            //填充了之后，左边立即去除
            $("#divleftfld").find(".leftfldbgsel").remove();
        }
    } else if (name_index != 0) {
        alert("同一表格请勿多次添加");
    }
}


//编辑时用的显示表格
//无子表
function backExca_word($scope, $compile, Xrow, Yrow, ExcFieldTitle) {
    //属性字段
    var ExcFieldTitle = ExcFieldTitle;
   
    //(0,0)开始的
    var Xrow = Xrow;
    var Yrow = Yrow;

   $(".table").find(".scope_tr").each(function (index, event) {
        if (Xrow == index) {
            $(event).find(".scope_td").each(function (Cindex, Cevent) {
                if (Yrow == Cindex) {
                    //定义
                    $scope.value = "<div class='input_box'>"
                            + "<span class='sign_word'>" + ExcFieldTitle + "</span>"
                            + "<div class='del_icon' ng-click='delicon($event,1)'></div>" + "</div>";
                    $(Cevent).append(
                        //编译后用于填充,不可删除
                        $compile($scope.value)($scope));

                    $("#divleftfld").find(".leftfldbg").each(function (index, event) {
                        var subindex = $(event).html().indexOf("(");
                        var subhtml = $(event).html().substring(0, subindex);
                        if (subhtml == ExcFieldTitle) {
                            $(event).remove();
                        }
                    })
                }
            })
        }

   });

}

//有子表
function backExca_child($scope, $compile, Xrow, Yrow, backExcval_col, ExcFieldTitle, backExcval_child, htmlname_selectnote) {
    //属性字段
    var ExcFieldTitle = ExcFieldTitle;
    //(0,0)开始的
    var Xrow = Xrow;
    var Yrow = Yrow;
    var backExcval_col = backExcval_col;
    var backExcval_childlength = backExcval_child.length;
    //开始显示
    $(".table").find(".scope_tr").each(function (index, event) {
        if (Xrow == index) {
            $(event).addClass("insert_tr").html("");
            $(event).append($compile("<td colspan=" + backExcval_col + " class='insert_td'></td>")($scope));
            $(event).find(".insert_td").append($compile(
            "<div class=" + "min_tab_t" + ">"
            + "<span class=" + 'min_tab_ico' + "></span>"
            + "<div class=" + 'tab_txt_tit' + ">"  + "<select class='modify_txt'>" + htmlname_selectnote + "</select>" + "<span class=" + 'sure_btn' + ">" + '确定' + "</span>" + "</div>"
            + "<span class=" + 'min_tab_txt' + ">" + ExcFieldTitle + "</span>"
            + "<div class=" + 'min_tab_del' + " ng-click='delicon($event,2)'></div>"
            + "</div>"
            + "<table border=" + "0" + " align=" + "center" + " class='table_line'><tr class='tr_line'></tr></table>"
            )($scope));

            for (var i = 0; i < backExcval_childlength; i++) {
                $(event).find(".insert_td").find(".tr_line").append($compile(
                    "<td class='table_line_td' style='width:10%'>"
                    + "<div class='input_box'>"
                    + "<input type='text'  class='sign_word' value='" + backExcval_child[i].SubColumnName + "'/>"
                    + "</div>"
                    + "</td>"
                    )($scope))
            }

            $("#divleftfld").find(".leftfldbg").each(function (index, event) {
                var subindex = $(event).html().indexOf("(");
                var subhtml = $(event).html().substring(0, subindex);
                if (subhtml == ExcFieldTitle) {
                    $(event).remove();
                }
            })
        }

    })
    attr($scope);
}

//设置显示设置,几列
function addmyshow($scope, $event, $compile, htmlname_select) {
        //切换效果
        $("#divrighttddiv01").attr("class", "divrighttddiv");
        $("#divrighttddiv02").attr("class", "divrighttddiv");
        $("#divrighttddiv03").attr("class", "divrighttddiv");
        $($event.currentTarget).attr("class", "divrighttddiv divrighttddivsel");
        
         //取选中的列的值
        var perv_set_val = $("#divrightfld").find(".divrighttddivsel").attr("id");
        var set_val = parseInt(perv_set_val.substring(perv_set_val.length - 2));

        //查看当前显示的是几列，如果选中的列数和当前显示的一致，则无需操作，如不一致，table销毁重构
        var ctrs = $(".table").find(".scope_tr");
        var ctdnum = 0;
        if ($(ctrs[0]).hasClass("insert_tr")) {
            ctdnum = $(ctrs[0]).find("td.insert_td").attr("colspan");
        } else {
            ctdnum = $(ctrs[0]).find("td.scope_td").length;
        }
        if (parseInt(ctdnum) == set_val) {
            //do nothing,选中的列数和当前显示的一致，无需操作
        } else {//不一致，table销毁重构
            $(".table tr").remove();
            //一旦清除，属性字段重新归列
            $("#divleftfld").html("");
            $("#divleftfld").html(htmlname_selectback(htmlname_select));
            show_pages($scope, 15, set_val, 10 + "%");
        }
}
//htmlname_selectback()构建左侧列表
function htmlname_selectback(data) {
    var divleftname = "";
    for (var i = 0; i < data.type.length; i++) {
        divleftname += "<div class='leftfldbg' maintype='" + data.type[i] + "'  onclick='selFld(this)' >" + data.val[i] + "(" + data.type[i] + ")" + "</div>";
    }
    return divleftname;
}

//设置显示设置,几列
var indes = 0;
function addmyadd($scope, $event, $compile,htmlname_selectnote) {
    var tab_sign = $(".sign_tr").length;
    if (tab_sign != 1) {
        alert("请选择添加表格列表");
        return;
    }
    indes++;
    var names = "table" + indes;
    //取的是option的value值
    var sub_val =parseInt( $(".sub_select").val());
    var id_s = $(".sign_tr").attr('id');
    var nums = $(".sign_tr").children().length;
    table($compile, $scope, names, sub_val, 10 + "%", nums, "请点击选择属性字段", id_s, htmlname_selectnote);
}

function table($compile, $scope, name, col, width, num, txt, id, htmlname_selectnote) {
    if (id == "table_tr") {
    	//选中行先创建，根据td列表数，加一个colspan
        $(".sign_tr").before($compile("<tr class='scope_tr insert_tr'><td colspan=" + num + "></td></tr>")($scope));
        //创建行后，在colspan的td中加载详细的表头和title
        $(".sign_tr").prev().children("td").append($compile(
            "<div class=" + "min_tab_t" + ">"
            + "<span class=" + 'min_tab_ico' + "></span>"
            + "<div class=" + 'tab_txt_tit' + ">"
            + "<select class='modify_txt'>" + htmlname_selectnote + "</select>"
            + "<span class=" + 'sure_btn' + ">" + '确定' + "</span>" + "</div>"
            + "<span class=" + 'min_tab_txt' + ">" + txt + "</span>"
            + "<div class=" + 'min_tab_del' + " ng-click='delicon($event,2)'></div>"
            + "</div>"
            + "<table border=" + "0" + " align=" + "center" + " class=" + name + "></table>"
            )($scope));
    }
    $("." + name).addClass("table_line");
    $("." + name).append($compile("<tr class='tr_line'></tr>")($scope));
    for (var i = 0; i < col; i++) {
        $("." + name + " tr").append($compile(
            "<td class='table_line_td' style=" + "width:" + width + ">"
            + "<div class=" + 'input_box' + ">"
            + "<input type=" + 'text' + " class=" + 'sign_word' + " />"
            + "</div>"
            + "</td>"
            )($scope))
    }
	//table中tr和td选中后效果
    //select($scope, name);
    //点击请点击选择属性字段，出现选择框，选中某一个，删除字段列表中对应的
    attr($scope);
}
//点击请点击选择属性字段，出现选择框，选中某一个，删除字段列表中对应的
function attr($scope) {
	//一开始点击请点击选择属性字段时这个位置时，值不一定是请点击选择属性字段，记录这个值
	var sure_btn_pretext="";
	
    $(".min_tab_txt").on("click", function () {
    	sure_btn_pretext=$(this).html();
        $(this).prev().show();
        $(this).hide();
    })

    $(".sure_btn").on("click", function () {
    	var	have_pretext=false;
        var text = $(this).prev().find("option:selected").text();
        $(this).parent().hide();
        $(this).parent().next().show();
        text = text.indexOf("请选择")>0 ? "请点击选择属性字段" : text;
        $(this).parent().next().text(text);
        //循环下面逻辑之前，查看所选的值是不是多次出现，是的话终止函数
        var show_num=0;
        $(".scope_tr").each(function (index, event) {
            if ($(event).find(".min_tab_txt").length > 0) {
                if ($(event).find(".min_tab_txt").html() != "请点击选择属性字段") {
                    if ($(event).find(".min_tab_txt").html() == text) {
                        show_num++;
                    }
                }
            } else if ($(event).find(".sign_word").length > 0) {
                $(event).find(".sign_word").each(function (aindx,aevent) {
                    if ($(aevent).html() == text) {
                        show_num++;
                    }
                })
            }        	
        })
        if(show_num>1){
        	 alert("表头字段重复，请重新选择！");
        	 $(this).parent().next().text("请点击选择属性字段");
        }

        //如果点击按钮开始前的值不是请点击选择属性字段，且也不等于点击确定后的值，即判断选择值变化了，把原来的值扔回字段列表里
    	if(sure_btn_pretext!=text){
    		//被选中的删掉，没被选中的，且原select里没有值的扔回去
    	    $("#divleftfld").find(".leftfldbg[maintype='Note']").each(function (index, event) {
    	        if ($(event).html().indexOf(text) > -1) {
	                $(event).remove();
	            }
	            //原来select里要是有这个值，就记下状态已有，
    	        if ($(event).html().indexOf(sure_btn_pretext) > -1) {
	            	have_pretext=true;
	            }
	        })
	        //原来select里要是状态已有什么都不做，要是没有且还不是请点击选择属性字段，扔进去；
    		if(have_pretext==false&&sure_btn_pretext!="请点击选择属性字段"){
    		    $("#divleftfld").append('<div class="leftfldbg" maintype="Note" onclick="selFld(this)">' + sure_btn_pretext + '(Note)</div>')
    		}
    	}

    })
}
//保存封装savepack-----数据存储地址现在写死curWebUrl，正常情况下savepack不需要传这个值
function savepack(entities,curWebUrl) {
    var a = -1;
    var b = -1;
    var RowNum = 0;
    var ColNum = 0;
    var FieldTitle = "";
    var curWebUrl = curWebUrl;
    //console.log(curWebUrl);
    var ListTitle = decodeURI(getQueryStringParameter("listtitle"));
    var AreaNum = 0;
    var AreaTitle = "";
    var jsonScope = {};

    //子表用
    var subrecordScope = {};
    var entities_sub = [];
    var SubColumnName = "";
    var SubColumnType = "text";
    var SubColumnOrder = 0;
    var SubColumnWidth = 100;
    var SubColumnNotes = "";

    //输出数组
    var entities_main = [];
    var entities = entities;

    //exchange对接字段;用于显示用
    var exchange_arr = [];
    var exchange_obj = "";
    var exchange_data = [];
    var exchange_middata = "";
    var exchange_json = {};

    var scopetr = $(".table").find(".scope_tr");
    //获取行列,初始化列,后面会被修改覆盖
    var scopetr_len = $(".table").find(".scope_tr").length;
    var scopetd_len = 1;

    //颜色值
    var tilte_color = $(".divrighttbl2").find(".divrightstylesel").find(".divrightstyletitle").css("background-color");
    var body_color = $(".divrighttbl2").find(".divrightstylesel").find(".divrightstylebody").css("background-color");
    var colorkey = $(".divrighttbl2").find(".divrightstylesel").attr("colorkey");


    if ($(".table").find(".min_tab_txt").length > 0) {
        var mintxtval = [];
        $(".table").find(".min_tab_txt").each(function (index,event) {
            mintxtval.push($(event).html());
        })
        var nary = mintxtval.sort();
        for (var i = 0; i < mintxtval.length; i++) {
            if (nary[i] == nary[i + 1]) {
                alert("子表表头重复，请重新选择");
                return;
            }
            if (nary[i] == "请点击选择属性字段") {
                alert("\n" + "子表表头未选取，请点击选择属性字段！" + "\n" + "\n" + " 若无字段可选，请删除该子表，谢谢！");
                return;
            }
        }
    }

    if ($("#divleftfld").find(".leftfldbg").length > 0) {
        alert("请选完属性字段");
        return;
    }

    scopetr.each(function (index,event) {
        a++;
        //判断是不是子列表
        if ($(this).hasClass("insert_tr")) {
            jsonScope.curWebUrl= curWebUrl;
            jsonScope.ListTitle = ListTitle;

            FieldTitle = $(this).find(".min_tab_t").find(".min_tab_txt").html();
            jsonScope.FieldTitle = FieldTitle;

            jsonScope.AreaNum = AreaNum;
            jsonScope.AreaTitle = AreaTitle;
            RowNum = a;
            jsonScope.RowNum = RowNum;
            jsonScope.ColNum = 0;
            //进入json数组
            entities_main.push(jsonScope);


            //在这里封装第二个
            var SubRecordColumn = $(this).find(".table_line").find(".table_line_td");
            SubRecordColumn.each(function (index, event) {
                if ($(this).has(".input_box").length > 0) {
                    subrecordScope.curWebUrl= curWebUrl;
                    subrecordScope.ListTitle = ListTitle;
                    subrecordScope.FieldTitle = FieldTitle;
                    subrecordScope.SubColumnWidth = SubColumnWidth;
                    subrecordScope.SubColumnNotes = SubColumnNotes;

                    SubColumnName = $(this).find(".sign_word").val();
                    subrecordScope.SubColumnName = SubColumnName;

                    subrecordScope.SubColumnType = SubColumnType;

                    SubColumnOrder = SubColumnOrder;
                    subrecordScope.SubColumnOrder = SubColumnOrder;

                    //进入json数组
                    entities_sub.push(subrecordScope);

                    //交互数据,显示用
                    exchange_arr.push(subrecordScope);

                }
                SubColumnOrder++;
                SubColumnName = "";
                subrecordScope = {};
            })

            jsonScope.exchange_obj = exchange_arr;
            //进入json数组
            exchange_data.push(jsonScope);

            SubColumnOrder = 0;
            RowNum = 0;
            FieldTitle = "";
            SubColumnName = "";
            subrecordScope = {};
            jsonScope = {};

            exchange_obj = "";
            exchange_arr = [];
        } else {
            var scopetd = $(this).find(".scope_td");
            //获取列
            scopetd_len = scopetd.length;

            scopetd.each(function (index, event) {
                b++
                if ($(this).has(".input_box").length > 0) {
                    jsonScope.curWebUrl= curWebUrl;
                    jsonScope.ListTitle = ListTitle;

                    FieldTitle = $(this).find(".sign_word").html();
                    jsonScope.FieldTitle = FieldTitle;

                    jsonScope.AreaNum = AreaNum;
                    jsonScope.AreaTitle = AreaTitle;

                    RowNum = a;
                    jsonScope.RowNum = RowNum;
                    ColNum = b;
                    jsonScope.ColNum = ColNum;

                    //进入json数组
                    entities_main.push(jsonScope);

                    //交互数据,显示用
                    jsonScope.exchange_obj = "";
                    exchange_data.push(jsonScope);
                }
                RowNum = 0;
                ColNum = 0;
                FieldTitle = "";
                jsonScope = {};

                exchange_obj = "";
            })
            b = -1;
        }

    })

    exchange_json.scopetr_len = scopetr_len;
    exchange_json.scopetd_len = scopetd_len;
    //颜色进栈
    var layoutscolor = {};
    layoutscolor.colorkey = colorkey;
    layoutscolor.tilte_color = tilte_color;
    layoutscolor.body_color = body_color;
    exchange_json.layoutscolor = layoutscolor;

    exchange_json.exchange_middata = exchange_data;

    entities.push(entities_main, entities_sub, exchange_json);
    //console.log(JSON.stringify(entities));
    return entities;
}

function SetMainItem(item, entity) { // OptimizedLayouts
    item.set_item("WebUrl", entity.curWebUrl);
    item.set_item("ListTitle", entity.ListTitle);
    item.set_item("FieldTitle", entity.FieldTitle);
    item.set_item("AreaNum", entity.AreaNum);
    item.set_item("AreaTitle", entity.AreaTitle);
    item.set_item("RowNum", entity.RowNum);
    item.set_item("ColNum", entity.ColNum);
    // 注：需要添加子表表头
    return item;
}

function SetSubItem(item, entity) { // SubRecords
    item.set_item("WebUrl", entity.curWebUrl);
    item.set_item("ListTitle", entity.ListTitle);
    item.set_item("FieldTitle", entity.FieldTitle);
    item.set_item("SubColumnName", entity.SubColumnName);
    item.set_item("SubColumnType", entity.SubColumnType);
    item.set_item("SubColumnWidth", entity.SubColumnWidth);
    item.set_item("SubColumnOrder", entity.SubColumnOrder);
    item.set_item("SubColumnNotes", entity.SubColumnNotes);

    return item;
}

app.factory("appService", ['$q', function ($q) {
    return {
        GetListItems: function (listTitle, linkWebUrl, linkListTitle, fieldInterns, strOrder) {
            var defer = $q.defer();

            var webUrl = linkWebUrl;
            var querys = "";
            if (strOrder == "") {
                querys = "<View Scope=\'RecursiveAll\'>" +
                    "<Query>" +
                    "<Where>" +
                    "<And>" +
                    "<Eq><FieldRef Name=\'WebUrl\'/><Value Type=\'Text\'>" + linkWebUrl + "</Value></Eq>" +
                    "<Eq><FieldRef Name=\'ListTitle\'/><Value Type=\'Text\'>" + linkListTitle + "</Value></Eq>" +
                    "</And>" +
                    "</Where>" +
                    "<OrderBy><FieldRef Name=\'Created\' Ascending =\'True\'/></OrderBy>" +
                    "</Query>" +
                    "</View>";
            } else {
                querys = "<View Scope=\'RecursiveAll\'>" +
                    "<Query>" +
                    "<Where>" +
                    "<And>" +
                    "<Eq><FieldRef Name=\'WebUrl\'/><Value Type=\'Text\'>" + linkWebUrl + "</Value></Eq>" +
                    "<Eq><FieldRef Name=\'ListTitle\'/><Value Type=\'Text\'>" + linkListTitle + "</Value></Eq>" +
                    "</And>" +
                    "</Where>" +
                    strOrder +
                    "</Query>" +
                    "</View>";
            }

            var items = [];
            SP.SOD.executeFunc("sp.js", 'SP.ClientContext', function () {
                var hostsuburl = webUrl;
                var context = new SP.ClientContext(hostsuburl);
                var oList = context.get_web().get_lists().getByTitle(listTitle);
                var camlQuery = new SP.CamlQuery();
                camlQuery.set_viewXml(querys);
                var collListItem = oList.getItems(camlQuery);
                context.load(collListItem);
                context.executeQueryAsync(function onQuerySucceeded(sender, args) {
                    var listItemEnumerator = collListItem.getEnumerator();
                    while (listItemEnumerator.moveNext()) {
                        var allFields = [];
                        var allValues = [];

                        var de = {};
                        var oListItem = listItemEnumerator.get_current();

                        for (var i = 0; i < fieldInterns.length; i++) {
                            var val = oListItem.get_item(fieldInterns[i]);
                            allFields.push(fieldInterns[i]);
                            allValues.push(val);
                        }

                        var item = {};
                        item.Fields = allFields;
                        item.Values = allValues;

                        items.push(item);
                    }

                    defer.resolve(items);
                }, function onQueryFailed(sender, args) {
                });
            });

            return defer.promise;
        },
        GetListTitle: function (linkWebUrl, linkListId) {
            var defer = $q.defer();

            var webUrl = linkWebUrl;
            var entity = {};

            SP.SOD.executeFunc("sp.js", 'SP.ClientContext', function () {
                var hostsuburl = webUrl;
                var context = new SP.ClientContext(hostsuburl);
                var oList = context.get_web().get_lists().getById(linkListId);
                context.load(oList);
                context.executeQueryAsync(function onQuerySucceeded(sender, args) {
                    entity.ListTitle = oList.get_title();

                    defer.resolve(entity.ListTitle);
                }, function onQueryFailed(sender, args) {

                });
            });

            return defer.promise;
        },
        GetListContentTypes: function (linkWebUrl, linkListId) {
            var defer = $q.defer();

            var webUrl = linkWebUrl;
            var entity = {};

            SP.SOD.executeFunc("sp.js", 'SP.ClientContext', function () {
                var hostsuburl = webUrl;
                var context = new SP.ClientContext(hostsuburl);
                var oList = context.get_web().get_lists().getById(linkListId);
                context.load(oList);
                var contentTypeColl = oList.get_contentTypes();
                context.load(contentTypeColl);
                context.executeQueryAsync(function onQuerySucceeded(sender, args) {
                    entity.CtTypes = [];
                    for (var i = 0; i < contentTypeColl.length; i++) {
                        entity.CtTypes.push(contentTypeColl[i]);
                    }
                    defer.resolve(entity);
                }, function onQueryFailed(sender, args) {

                });
            });

            return defer.promise;
        },
        GetListFieldsByTitle: function (linkWebUrl, linkListTitle) {
            var defer = $q.defer();
            var webUrl = linkWebUrl;
            var entity = {};

            SP.SOD.executeFunc("sp.js", 'SP.ClientContext', function () {
                var hostsuburl = webUrl;
                var context = new SP.ClientContext(hostsuburl);
                var oList = context.get_web().get_lists().getByTitle(linkListTitle);
                context.load(oList);
                var contentTypeColl = oList.get_contentTypes();
                context.load(contentTypeColl);
                context.executeQueryAsync(function onQuerySucceeded(sender, args) {
                    var contEnum = contentTypeColl.getEnumerator();
                    var currentCont = null;
                    while (contEnum.moveNext()) {
                        var cont = contEnum.get_current();
                        if (cont.get_name() == "项目" || cont.get_name() == "Item") {
                            currentCont = cont;
                            break;
                        }
                    }

                    var fldNameList = {};
                    var fldHiddenList = {};
                    if (cont != null) {
                        var fields = cont.get_fields();
                        context.load(fields);
                        context.executeQueryAsync(function onQuerySucceeded(sender, args) {
                            entity.Fields = [];
                            entity.FieldTypes = [];

                            var fieldEnumerator = fields.getEnumerator();
                            while (fieldEnumerator.moveNext()) {
                                var field = fieldEnumerator.get_current();
                                var interName = field.get_staticName();
                                var dispName = field.get_title();
                                
                                //interName == "Title" || 
                                if (!field.get_hidden()) {
                                    if (!field.get_canBeDeleted()) {
                                        if (interName == "Title") {
                                            // Do nothing
                                        } else {
                                            continue;
                                        }
                                    }
                                    var tmpObj = $(field.get_schemaXml());
                                    if (typeof (tmpObj.attr("ShowInNewForm")) != "undefined" && tmpObj.attr("ShowInNewForm") == "FALSE") {
                                        continue;
                                    }

                                    entity.Fields.push(dispName);
                                    entity.FieldTypes.push(field.get_typeAsString());
                                }
                            }

                            defer.resolve(entity);
                        }, function onQueryFailed(sender, args) {
                            console.log('Error onQuery Failed');
                            console.log(args);
                        });
                    } else {
                        var fields = oList.get_fields();
                        context.load(fields);
                        context.executeQueryAsync(function onQuerySucceeded(sender, args) {
                            entity.Fields = [];
                            entity.FieldTypes = [];
                            var fieldEnumerator = fields.getEnumerator();
                            while (fieldEnumerator.moveNext()) {
                                var field = fieldEnumerator.get_current();
                                var interName = field.get_staticName();
                                var dispName = field.get_title();

                                if (interName == "Title" || field.get_canBeDeleted()) {
                                    var tmpObj = $(field.get_schemaXml());
                                    if (typeof (tmpObj.attr("ShowInNewForm")) != "undefined" && tmpObj.attr("ShowInNewForm") == "FALSE") {
                                        continue;
                                    }
                                    entity.Fields.push(dispName);
                                    entity.FieldTypes.push(field.get_typeAsString());
                                }
                            }

                            defer.resolve(entity);
                        }, function onQueryFailed(sender, args) {
                            console.log('Error onQuery Failed');
                            console.log(args);
                        });
                    }
                }, function onQueryFailed(sender, args) {
                    console.log('Error onQuery Failed');
                    console.log(args);
                });
            });

            return defer.promise;
        },
        GetWorkflow: function (linkWebUrl, listId) {
            var defer = $q.defer();

            var webUrl = linkWebUrl;
            var entity = {};
            SP.SOD.executeFunc("sp.js", 'SP.ClientContext', function () {
                var hostsuburl = webUrl;
                var context = new SP.ClientContext(hostsuburl);
                var web = context.get_web();

                var sMgr = SP.WorkflowServices.WorkflowServicesManager.newObject(context, web);
                var wSS = sMgr.getWorkflowSubscriptionService();
                var wDS = sMgr.getWorkflowDeploymentService();//.enumerateDefinitions();
                var wfSubs = wSS.enumerateSubscriptionsByList(listId);
                context.load(wfSubs);

                context.executeQueryAsync(function onQuerySucceeded(sender, args) {
                    var wfsEnum = wfSubs.getEnumerator();
                    // Get First
                    while (wfsEnum.moveNext()) {
                        var wfSub = wfsEnum.get_current();
                        var wDef = wDS.getDefinition(wfSub.get_definitionId());

                        context.load(wDef);
                        context.executeQueryAsync(function onQuerySucceeded(sender, args) {
                            entity.sub = wfSub;
                            entity.def = wDef;

                            defer.resolve(entity);
                        }, function onQueryFailed(sender, args) {
                            console.log('Error onQuery Failed');
                            console.log(args);
                        });

                        break;
                    }
                }, function onQueryFailed(sender, args) {
                    console.log('Error onQuery Failed');
                    console.log(args);
                });
            });

            return defer.promise;
        },
        SaveMainItem: function (linkWebUrl, linkListTitle, entity) {
            var defer = $q.defer();

            SP.SOD.executeFunc("sp.js", 'SP.ClientContext', function () {
                var hostsuburl = linkWebUrl;
                var context = new SP.ClientContext(_spPageContextInfo.siteServerRelativeUrl);
                var oList = context.get_web().get_lists().getByTitle(linkListTitle);

                var listItem;
                var listIds = [];
                var listSavedEntities = [];
                var promiseArray = [];

                if (entity.Id == null || entity.Id == 0) {
                    listItem = oList.addItem();
                } else {
                    listItem = oList.getItemById(parseInt(entity.Id));
                }

                SetMainItem(listItem, entity);
                listItem.update();
                context.load(listItem);

                context.executeQueryAsync(function onQuerySucceeded(sender, args) {
                    entity.Id = listItem.get_id();
                    defer.resolve(entity);
                }, function onQueryFailed(sender, args) {
                    console.log('Error: Save item failed');
                });
            });

            return defer.promise;
        },
        SaveSubItem: function (linkWebUrl, linkListTitle, entity) { // var entities = []; SubRecords
            var defer = $q.defer();

            SP.SOD.executeFunc("sp.js", 'SP.ClientContext', function () {
                var hostsuburl = linkWebUrl;
                var context = new SP.ClientContext(_spPageContextInfo.siteServerRelativeUrl);
                var oList = context.get_web().get_lists().getByTitle(linkListTitle);

                var listItem;
                var listIds = [];
                var listSavedEntities = [];

                if (entity.Id == null || entity.Id == 0) {
                    listItem = oList.addItem();
                } else {
                    listItem = oList.getItemById(parseInt(entity.Id));
                }

                SetSubItem(listItem, entity);

                listItem.update();
                context.load(listItem);

                context.executeQueryAsync(function onQuerySucceeded(sender, args) {
                    entity.Id = listItem.get_id();
                    defer.resolve(entity);
                }, function onQueryFailed(sender, args) {
                    console.log('Error: Save item failed');
                });
            });

            return defer.promise;
        },
        DeleteItem: function (linkWebUrl, linkListTitle, id) {
            var defer = $q.defer();
            var delCount = 0;

            SP.SOD.executeFunc("sp.js", 'SP.ClientContext', function () {
                var hostsuburl = linkWebUrl;
                var context = new SP.ClientContext(_spPageContextInfo.siteServerRelativeUrl);
                var oList = context.get_web().get_lists().getByTitle(linkListTitle);
                var oListItem = oList.getItemById(id);
                oListItem.deleteObject();

                context.executeQueryAsync(function onQuerySucceeded(sender, args) {
                    delCount++;
                    defer.resolve(delCount);
                }, function onQueryFailed(sender, args) {
                    console.log('Error: Delete item failed');
                });
            });

            return defer.promise;
        },
        SaveJson: function (linkWebUrl, linkListTitle, strJson, strJsonType) {
            var defer = $q.defer();

            var webUrl = linkWebUrl;
            var querys = "";
            querys = "<View Scope=\'RecursiveAll\'>" +
                "<Query>" +
                "<Where>" +
                "<And>" +
                "<And>" +
                "<Eq><FieldRef Name=\'JsonType'/><Value Type=\'Text\'>" + strJsonType + "</Value></Eq>" +
                "<Eq><FieldRef Name=\'WebUrl\'/><Value Type=\'Text\'>" + linkWebUrl + "</Value></Eq>" +
                "</And>" +
                "<Eq><FieldRef Name=\'ListTitle\'/><Value Type=\'Text\'>" + linkListTitle + "</Value></Eq>" +
                "</And>" +
                "</Where>" +
                "</Query>" +
                "</View>";

            SP.SOD.executeFunc("sp.js", 'SP.ClientContext', function () {
                var context = new SP.ClientContext(_spPageContextInfo.siteServerRelativeUrl);
                var oList = context.get_web().get_lists().getByTitle("SysJson");
                var oListItem = null;
                var camlQuery = new SP.CamlQuery();
                camlQuery.set_viewXml(querys);
                var collListItem = oList.getItems(camlQuery);
                context.load(collListItem);
                context.executeQueryAsync(function onQuerySucceeded(sender, args) {
                    var listItemEnumerator = collListItem.getEnumerator();
                    var bol = false;
                    while (listItemEnumerator.moveNext()) {
                        oListItem = listItemEnumerator.get_current();
                        break;
                    }

                    if (!bol) {
                        oListItem = oList.addItem();
                    }
                    
                    oListItem.set_item("WebUrl", linkWebUrl);
                    oListItem.set_item("ListTitle", linkListTitle);
                    oListItem.set_item("JsonVal", strJson);
                    oListItem.set_item("JsonType", strJsonType);

                    oListItem.update();
                    context.load(oListItem);

                    context.executeQueryAsync(function onQuerySucceeded(sender, args) {
                        defer.resolve(oListItem.get_id());
                    }, function onQueryFailed(sender, args) {
                        console.log('Error: Save item failed');
                    });
                });
            });

            return defer.promise;
        },
        GetJson: function (linkWebUrl, linkListTitle, strJsonType) {
            var defer = $q.defer();

            var webUrl = linkWebUrl;
            var querys = "";
            querys = "<View Scope=\'RecursiveAll\'>" +
                "<Query>" +
                "<Where>" +
                "<And>" +
                "<And>" +
                "<Eq><FieldRef Name=\'JsonType'/><Value Type=\'Text\'>" + strJsonType + "</Value></Eq>" +
                "<Eq><FieldRef Name=\'WebUrl\'/><Value Type=\'Text\'>" + linkWebUrl + "</Value></Eq>" +
                "</And>" +
                "<Eq><FieldRef Name=\'ListTitle\'/><Value Type=\'Text\'>" + linkListTitle + "</Value></Eq>" +
                "</And>" +
                "</Where>" +
                "</Query>" +
                "</View>";

            SP.SOD.executeFunc("sp.js", 'SP.ClientContext', function () {
                var context = new SP.ClientContext(_spPageContextInfo.siteServerRelativeUrl);
                var oList = context.get_web().get_lists().getByTitle("SysJson");
                var oListItem = null;
                var camlQuery = new SP.CamlQuery();
                camlQuery.set_viewXml(querys);
                var collListItem = oList.getItems(camlQuery);
                context.load(collListItem);
                context.executeQueryAsync(function onQuerySucceeded(sender, args) {
                    var listItemEnumerator = collListItem.getEnumerator();
                    var bol = false;
                    while (listItemEnumerator.moveNext()) {
                        oListItem = listItemEnumerator.get_current();
                        var val = oListItem.get_item("JsonVal");
                        bol = true;
                        defer.resolve(val);
                        break;
                    }

                    if (!bol) {
                        defer.resolve("");
                    }
                });
            });

            return defer.promise;
        },
        GetItems: function (linkWebUrl, linkListTitle, WebUrl, ListTitle) {
            var defer = $q.defer();

            var querys = "";
            querys = "<View Scope=\'RecursiveAll\'>" +
                "<Query>" +
                "<Where>" +
                "<And>" +
                "<Eq><FieldRef Name=\'WebUrl\'/><Value Type=\'Text\'>" + linkWebUrl + "</Value></Eq>" +
                "<Eq><FieldRef Name=\'ListTitle\'/><Value Type=\'Text\'>" + linkListTitle + "</Value></Eq>" +
                "</And>" +
                "</Where>" +
                "</Query>" +
                "</View>";

            SP.SOD.executeFunc("sp.js", 'SP.ClientContext', function () {
                var context = new SP.ClientContext(_spPageContextInfo.siteServerRelativeUrl);
                var oList = context.get_web().get_lists().getByTitle(ListTitle);
                var oListItem = null;
                var camlQuery = new SP.CamlQuery();
                camlQuery.set_viewXml(querys);
                var collListItem = oList.getItems(camlQuery);
                context.load(collListItem);

                var items = [];
                context.executeQueryAsync(function onQuerySucceeded(sender, args) {
                    var listItemEnumerator = collListItem.getEnumerator();
                    var bol = false;
                    while (listItemEnumerator.moveNext()) {
                        oListItem = listItemEnumerator.get_current();
                        items.push(oListItem);
                    }

                    defer.resolve(items);
                });
            });

            return defer.promise;
        }
    }
}]);