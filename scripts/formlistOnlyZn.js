$(document).ready(function () {
  var backindex = '<a href="/SitePages/Portal.aspx" class="gobackindex">'
    + '<span class="back_tip back_imgspan"><img src="./_layouts/15/images/spcommon.png?rev=45#ThemeKey=spcommon" alt=""></span>'
    + '<span class="back_tip back_titlespan">返回首页</span></a>'
  $("div.ms-cui-TabRowRight").prepend(backindex);
})