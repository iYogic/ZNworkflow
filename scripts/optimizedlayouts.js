'use strick';

/***********************************************
 * Area
 * Row / Col / FieldTitle
 ***********************************************/
var optLayouts = [];
var titleclass = "titleclass";
var objclass = "objclass";

var maxArea = 0;
var maxRows = [];
var maxCols = [];

var maxAreaHeight = [];
var areaTitles = [];

/***********************************************
 * Main Method
 ***********************************************/
console.log(3223);
function InitOptLayouts(val) {
    console.log(val);
    for (var i = 0; i < val.length; i++) {
        //GetListItemValue传键值获取对应的值
        var areaNum = parseInt(GetListItemValue(val[i], "AreaNum"));
        var areaTitle = GetListItemValue(val[i], "AreaTitle");
        //console.log(areaNum );
        //console.log(areaTitle );

        //循环判断找出最大的区域数，即得出有几个区域
        if (areaNum > (maxArea - 1)) {
            maxArea = areaNum + 1;
        }
        //console.log(maxArea);

        //对应的区域标题进数组
        if (areaTitles.indexOf(areaTitle) < 0) {
            areaTitles.push(areaTitle);
        }
        //console.log(areaTitles);
    }

    //加个div,放置区域title;几个区域就加几个
    for (var i = 0; i < maxArea; i++) {
        maxRows.push(1);
        maxCols.push(1);
        //null规避掉
        var areaTitles_single = areaTitles[i] == null ? "" : areaTitles[i];

        $("#" + mainId).append("<div class='areatitle' id='area_title_" + i + "'>&nbsp;&nbsp;&nbsp;" + areaTitles_single + "</div>");
    }

    //得出每个区域的最大行和最大列
    for (var i = 0; i < val.length; i++) {
        var areaNum = parseInt(GetListItemValue(val[i], "AreaNum"));

        var rowNum = parseInt(GetListItemValue(val[i], "RowNum"));
        var colNum = parseInt(GetListItemValue(val[i], "ColNum"));

        var tmpRow = maxRows[areaNum];
        var tmpCol = maxCols[areaNum];

        if (rowNum > (tmpRow - 1)) {
            maxRows[areaNum] = rowNum + 1;
        }
        if (colNum > (tmpCol - 1)) {
            maxCols[areaNum] = colNum + 1;
        }
    }
    //根据区域设置对应区域entity,几个区域就设置几个，内置位置和title两个元素
    for (var i = 0; i < maxArea; i++) {
        var entity = {};
        entity.FieldTitle = [];
        entity.FieldPos = [];
        optLayouts.push(entity);
    }

    //根据区域数字，把所得数据扔到对应的entity中
    for (var i = 0; i < val.length; i++) {
        var areaNum = parseInt(GetListItemValue(val[i], "AreaNum"));
        var rowNum = parseInt(GetListItemValue(val[i], "RowNum"));
        var colNum = parseInt(GetListItemValue(val[i], "ColNum"));
        var fldTitle = GetListItemValue(val[i], "FieldTitle");

        var posStr = GetPosStr(rowNum, colNum);
        //标题和对应坐标封到optLayouts
        optLayouts[areaNum].FieldTitle.push(fldTitle);
        optLayouts[areaNum].FieldPos.push(posStr);

        //console.log(optLayouts[areaNum].FieldTitle);
        //console.log(optLayouts[areaNum].FieldPos);
    }
    SetLayouts(false);
}

function SetLayouts(bol) {
     //拿到右侧宽度
      CalMainWidth();
    //console.log(mainWidth);
    mainWidth=mainWidth<703?703:mainWidth;
    //console.log(mainWidth);
    
    var objx = 20;
    var objy = 0;

    maxAreaHeight = [];
    //console.log(maxArea);
    for (var i = 0; i < maxArea; i++) {
        // 每行高度 lineHeight = 32; 
        var tmpMaxAreaHeight = lineHeight;
        //console.log(lineHeight);
        var objAreaTitle = $("#area_title_" + i);
		
        $(objAreaTitle).css("top", objy + "px");
        $(objAreaTitle).css("left", "0px");
        $(objAreaTitle).css("position", "absolute");
        objy += $(objAreaTitle).height();
        //再补10
        objy += 10;
        var colWidth = mainWidth / maxCols[i];
        //console.log(colWidth);
        //console.log(maxCols[i]);
        var tmpAreaHeight = $(objAreaTitle).height();
        //console.log(tmpAreaHeight ); 
        //console.log(maxRows[0]);
        for (var j = 0; j < maxRows[i]; j++) {
            var tmpMaxHeight = lineHeight;
            for (var k = 0; k < maxCols[i]; k++) {
                //格式化行列坐标
                var tmpPos = GetPosStr(j, k);
                //输入坐标找出标题
                var tmpFldTitle = FindPos(i, tmpPos);
                //console.log(tmpFldTitle);
                //输入标题，返回原始tr数组中的对应位置
                var objTr = FindTrByTitle(tmpFldTitle);
                //输入tr序号,找到tr对应的td
                var objTds = $(objTr).find("td");
                //td个数大于1时
                	
                if (objTds.length > 1) {
                    //一是标题，二是输入框
                    var objTdTitle = objTds[0];
                    var objTdControl = objTds[1];

                    //var h3 = $(objTdTitle).find("h3");
                    var h3 = $(objTdTitle).children();
                    if (h3.length > 0) {
                        $(h3).addClass(titleclass);
                        $(h3).css("top", objy + "px");
                        $(h3).css("left", objx + "px");
                        $(h3).css("position", "absolute");

                        if (bol) {
                            titlewidth = $(h3).outerWidth();
                            titlewidth =titlewidth <100?60:150;
                        }
                    }

                    var span = $(objTdControl).find("span");

                    var sdiv = $(objTdControl).find("div");
                    var sbol = false;
                    for (var z = 0; z < sdiv.length; z++) {
                        if ($(sdiv[z]).attr("id") != null && typeof ($(sdiv[z]).attr("id") != "undefined")) {
                            if ($(sdiv[z]).attr("id").indexOf("Pos_") == 0) {
                                sbol = true;
                                break;
                            }
                        }
                    }

                    if (span.length > 0) {
                        $(span[0]).attr("id", "Pos_" + tmpPos);
                        $(span[0]).addClass(objclass);
                        $(span[0]).css("top", objy + "px");
                        $(span[0]).css("left", (objx + titlewidth) + "px");
                        $(span[0]).css("position", "absolute");
                        //输入行的宽度为列宽减去标题宽度
                        $(span[0]).css("width", (colWidth-titlewidth-30*maxCols[i]) + "px");

                        //高度大于行高，放大行高
                        if ($(span[0]).height() > tmpMaxHeight) {
                            tmpMaxHeight = $(span[0]).height();
                        }
                    } else if (sdiv.length > 0) {
                        if (!sbol) {
                            //$($(objTdControl).find("div")[0]).hide();
                            var tmpDiv = "<div id='Pos_" + tmpPos + "' class='" + objclass + "' style='top:" + objy + "px; left:" + (objx + titlewidth) + "px; position:absolute;'></div>";
                            $(objTdControl).append(tmpDiv);
                            //$(objTdControl).html("<div id='Pos_" + tmpPos + "' class='" + objclass + "' style='top:" + objy + "px; left:" + (objx + titlewidth) + "px; position:absolute;'>"
                            //        + $(objTdControl).text() + "</div>");
                        }
                    } else {
                        if (!sbol) {
                            var tmpHtml = $(objTdControl).html() + "";
                            var tmpDiv = "<div id='Pos_" + tmpPos + "' class='" + objclass + "' style='top:" + objy + "px; left:" + (objx + titlewidth) + "px; position:absolute;'>";
                            $(objTdControl).html(tmpDiv + tmpHtml + "</div>");
                        }
                    }
                }
                objx += colWidth;
            }

            objx = 20;
            objy += tmpMaxHeight;
            //竖直再补20拉开间距
            objy += 20;

            tmpAreaHeight += tmpMaxHeight;
            //同样区域高度再补20
            tmpAreaHeight +=20
        }

        if (tmpAreaHeight > tmpMaxAreaHeight) {
            tmpMaxAreaHeight = tmpAreaHeight;
        }

        maxAreaHeight.push(tmpMaxAreaHeight);
    }

    var tmpPosTop = 0;
    for (var i = 0; i < maxAreaHeight.length; i++) {
        tmpPosTop += maxAreaHeight[i];
    }
    
    $("#WebPartWPQ1").find(".subtable").each(function(){
    	var sub_nowwidth=$(this).outerWidth();
    	$(this).siblings(".subrecordsbanner").css("width", sub_nowwidth)
    })
   	//得出总高，设置高度
    SetMainHeight(tmpPosTop);
    
    $("#contentBox").show();
}


//输入坐标找出标题
function FindPos(areaNum, pos) {
    var entity = optLayouts[areaNum];
    //标题和对应坐标从optLayouts取出来
    var fldTitles = entity.FieldTitle;
    var fldPos = entity.FieldPos;
    var idx = fldPos.indexOf(pos);
    if (idx < 0) {
        return "";
    } else {
        return fldTitles[idx];
    }
}

//格式化坐标格式000~00x
function GetPosStr(row, col) {
    var rowNumStr = FormatNum(row, 3);
    var colNumStr = FormatNum(col, 3);
    var posStr = rowNumStr + data_split + colNumStr;
    return posStr;
}

//格式化数字格式00x
FormatNum = function() {
    var tbl = [];  
    return function (num, n) {
        var len = n - num.toString().length;
        if (len <= 0) return num;
        if (!tbl[len]) tbl[len] = (new Array(len + 1)).join('0');
        return tbl[len] + num;
    }
}();