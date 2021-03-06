'use strick';

// Data Split Character
var data_split = "~";
// Container ID
var layoutsId = "part1";
// Top Container ID
var pageId = "contentBox";
// Main Place Holder ID
var mainId = "DeltaPlaceHolderMain";
// Left Bar ID
var leftSideId = "sideNavBox";
// Form Table Class Name
var mainTableClassName = "ms-formtable";
// Window Width (Global)
var mainWidth = 0;
// Message for confirm
var DEL_CONFIRM_MSG = "确认删除？";
// Container table outer ID
var tableOuterId = "WebPartWPQ2";

var MAX_HEIGHT = 0;
var lineHeight = 32; // 每行高度
var titlewidth = 100; // 标题文字宽度

var workflowField = "";

var CurrentInvIds = [];
var CurrentInvQtys = [];
var CurrentItemType = "";
var isGroupUser = false;
var CurrentOwnerCallFunc = "";
var curItemWFStatus = "";

var TREEVIEW_URL = "AllItems.aspx";
var TAGVIEW_URL = "AllFiles.aspx";
var MGMTVIEW_URL = "management.aspx";

String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}

String.prototype.startWith = function (str) {
    var reg = new RegExp("^" + str);
    return reg.test(this);
}

String.prototype.endWith = function (str) {
    var reg = new RegExp(str + "$");
    return reg.test(this);
}

Date.prototype.toString = function (fmt) {
    if (!fmt)
        return Object(this);
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length))) }
    }
    return fmt;
};

/************************************
 * Get parameters from URL
 ************************************/
function getQueryStringParameter(paramToRetrieve) {
    try {
        var params = document.URL.split("?")[1].split("&");
        var strParams = "";
        for (var i = 0; i < params.length; i = i + 1) {
            var singleParam = params[i].split("=");
            if (singleParam[0] == paramToRetrieve)
                return singleParam[1];
        }
        return "";
    } catch (e) {
        return "";
    }
}

/***************************************
 * Judge if this is a display form
 ***************************************/
function IsDispForm() {
    if (document.URL.toLowerCase().indexOf("/dispform.aspx?id=") > 0) {
        return true;
    } else {
        return false;
    }
}

/***************************************
 * Get height of main work space
 ***************************************/
function GetMainHeight() {
    return $("." + mainTableClassName).height();
}

/***************************************
 * Get list item value with title of field
 ***************************************/
function GetListItemValue(item, fldTitle) {
    return item.get_item(fldTitle);
}

/***************************************
 * Fill value to PeoplePicker control
 * to get SPUser info.
 ***************************************/
function FillPeoplePicker(fldTitle, userDisp) {
    var pic = document.querySelector("input[title='" + fldTitle + "']");
    var ppobject = SPClientPeoplePicker.SPClientPeoplePickerDict[pic.parentNode.id];
    var usersobject = ppobject.GetAllUserInfo();
    usersobject.forEach(function (index) {
        ppobject.DeleteProcessedUser(usersobject[index]);
    });
    
    pic.value = userDisp;
    try {
        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
            SPClientPeoplePicker.SPClientPeoplePickerDict[pic.parentNode.id].AddUnresolvedUserFromEditor(true);
        }, "clientpeoplepicker.js");
    } catch (e) { }
}

/***************************************
 * Disable a PeoplePicker control with
 * title of field
 ***************************************/
function FillPeoplePickerDisable(fldTitle) {
	var pic = document.querySelector("input[title='" + fldTitle + "']");
	var ipts = $(pic.parentNode).find("input");
	for (var i=0; i<ipts.length; i++) {
		$(ipts[i]).attr("disabled", "true");
	}
	var as = $(pic.parentNode).find("a");
	for (var i=0; i<as.length; i++) {
		$(as[i]).remove();
	}
}

/***************************************
 * Get manager of current user from 
 * user profile.
 ***************************************/
function GetManagerOfUser(user_email, onComplete) {
    SP.SOD.executeOrDelayUntilScriptLoaded(function () {
	    // Create the client context and get the PeopleManager instance.
	    var clientContext = SP.ClientContext.get_current();
	    var peopleManager = new SP.UserProfiles.PeopleManager(clientContext);

	    // Get user profile properties for the target user.
	    // Specify the properties to retrieve and create the UserProfilePropertiesForUser object.
	    // Then get the requested properties by using the getUserProfilePropertiesFor method.
	    var profilePropertyNames = ["Manager"];

	    var userProfilePropertiesForUser = new SP.UserProfiles.UserProfilePropertiesForUser(clientContext,
	        "i:0#.f|membership|" + user_email,
	        profilePropertyNames);

    	var userProfileProps = peopleManager.getUserProfilePropertiesFor(userProfilePropertiesForUser);

		clientContext.load(userProfilePropertiesForUser);
		clientContext.executeQueryAsync(function () {
			if (userProfileProps[0]) {
				var user = clientContext.get_web().ensureUser(userProfileProps[0]);
				clientContext.load(user);
				clientContext.executeQueryAsync(function () {
					onComplete(user);
				}, function (sender, args) {
				});
			} else {
				onComplete(null);
			}
		}, function (sender, args) {
		});
	}, 'SP.UserProfiles.js');
}

/***************************************
 * Get input control with title of field
 ***************************************/
function GetControlByTitle(fldTitle) {
	var pic = document.querySelector("input[title='" + fldTitle + "']");
	if (pic != null) {
		return pic;
	} else {
		return null;
	}
}

/***************************************
 * Get multi-choice control with title
 * of field
 ***************************************/
function GetMultiChoiceByTitle(fldTitle) {
	var parray = [];
	parray[0] = document.querySelector("input[title='" + fldTitle + " possible values']");
	parray[1] = document.querySelector("input[title='" + fldTitle + " selected values']");
	return parray;
}

/***************************************
 * Format datetime to yyyy/MM/dd HH:mm:ss
 ***************************************/
function ormatDateEx(dateNum) {
    var date = new Date(dateNum);
    return date.getFullYear() + "-" + 
    	fixZero(date.getMonth() + 1, 2) + "-" + 
    	fixZero(date.getDate(), 2) + " " + 
    	fixZero(date.getHours(), 2) + ":" + 
    	fixZero(date.getMinutes(), 2) + ":" + 
    	fixZero(date.getSeconds(), 2);  
}

/***************************************
 * Format datetime to yyyy/MM/dd
 ***************************************/
function ormatDateEx_donly(dateNum) {
    var date = new Date(dateNum);
    return date.getFullYear() + "-" + 
    	fixZero(date.getMonth() + 1, 2) + "-" + 
    	fixZero(date.getDate(), 2);  
}

/***************************************
 * Get height of main work space
 ***************************************/
function addDate(date, days) {
    if (days == undefined || days == '') {
        days = 1;
    }
    var date = new Date(date);
    date.setDate(date.getDate() + days);
    return date;
}

/***************************************
 * Add "0" to format number as "000xx"
 ***************************************/
function fixZero(num, length) {
    var str = "" + num;
    var len = str.length;
    var s = "";
    for (var i = length; i-- > len;) {
        s += "0";
    }
    return s + str;
}

/***************************************
 * Global var
 ***************************************/
var curListItem = null;
var curTaskId = null;
var curTempCallFunc = null;
var curTempCallFunc_1 = null;
var curUser = null;

/***************************************
 * Get list item by id
 ***************************************/
function GetListItemById(id, callFunc) {
	if (curListItem == null) {
		SP.SOD.executeFunc("sp.js", 'SP.ClientContext', function () {
			var webUrl = _spPageContextInfo.webServerRelativeUrl;
	        var clientContext = new SP.ClientContext(webUrl);
	        if (clientContext != undefined && clientContext != null) {
	            var webSite = clientContext.get_web();
	            var oList = webSite.get_lists().getByTitle(_spPageContextInfo.listTitle);
	            
	            var oListItem = oList.getItemById(id);
	            clientContext.load(oListItem);
	            clientContext.executeQueryAsync(function onQuerySucceeded(sender, args) {
	                curListItem = oListItem;
					
	                if (callFunc != null && callFunc != "") {
	                    var fn = window[callFunc];
	                    fn(oListItem);
	                }
	            }, function onQueryFailed(sender, args) {
	                if (callFunc != null && callFunc != "") {
	                    var fn = window[callFunc];
	                    fn(null);
	                }
	            });
	        }
	    });
	} else {
		if (callFunc != null && callFunc != "") {
            var fn = window[callFunc];
            fn(curListItem);
        }
	}
}

/***************************************
 * Get height of main work space
 ***************************************/
function GetListItemByIdEx(id, callFunc) {
	SP.SOD.executeFunc("sp.js", 'SP.ClientContext', function () {
		var webUrl = _spPageContextInfo.webServerRelativeUrl;
        var clientContext = new SP.ClientContext(webUrl);
        if (clientContext != undefined && clientContext != null) {
            var webSite = clientContext.get_web();
            var oList = webSite.get_lists().getByTitle("文档库");
            
            var oListItem = oList.getItemById(id);
            clientContext.load(oListItem);
            clientContext.executeQueryAsync(function onQuerySucceeded(sender, args) {
                curListItem = oListItem;
				
                if (callFunc != null && callFunc != "") {
                    var fn = window[callFunc];
                    fn(oListItem);
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


function GetWFStatus(callFunc) {
	var id = GetQueryStringParameter("ID");
	var id1 = GetQueryStringParameter("IID");
	if (id1 != null && id1 != "" && (id == null || id == "")) {
		id = id1;
	}
	if (id == "") {
		if (callFunc != null && callFunc != "") {
            var fn = window[callFunc];
            fn("");
        }
	}
	
	SP.SOD.executeFunc("sp.js", 'SP.ClientContext', function () {
		var webUrl = _spPageContextInfo.webServerRelativeUrl;
        var clientContext = new SP.ClientContext(webUrl);
        if (clientContext != undefined && clientContext != null) {
            var webSite = clientContext.get_web();
            var oList = webSite.get_lists().getByTitle("Issue");
            
            var oListItem = oList.getItemById(id);
            clientContext.load(oListItem);
            clientContext.executeQueryAsync(function onQuerySucceeded(sender, args) {
                var strStatus = "";
                var wfTitle = "";
                var strType = oListItem.get_item("Use_x0020_type");
                if (strType == "Loaned") {
                    wfTitle = "Loan";
                } else if (strType == "Issued") {
                    wfTitle = "Issue";
                }
                curItemWFStatus = oListItem.get_item("Status");
                CurrentItemType = oListItem.get_item("Use_x0020_type");
            	if (oListItem.get_item(wfTitle) != null) {
            	    strStatus = oListItem.get_item(wfTitle).get_description();
                }
				
                if (callFunc != null && callFunc != "") {
                    var fn = window[callFunc];
                    fn(strStatus);
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

function GetWFStatusEx(id, callFunc) {
	SP.SOD.executeFunc("sp.js", 'SP.ClientContext', function () {
		var webUrl = _spPageContextInfo.webServerRelativeUrl;
        var clientContext = new SP.ClientContext(webUrl);
        if (clientContext != undefined && clientContext != null) {
            var webSite = clientContext.get_web();
            var oList = webSite.get_lists().getByTitle("Issue");
            
            var oListItem = oList.getItemById(id);
            clientContext.load(oListItem);
            clientContext.executeQueryAsync(function onQuerySucceeded(sender, args) {
            	var strStatus = "";
            	if (oListItem.get_item(workflowField) != null) {
                	strStatus = oListItem.get_item(workflowField).get_description();
                }
				
                if (callFunc != null && callFunc != "") {
                    var fn = window[callFunc];
                    fn(strStatus);
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

function GetUserGroups(callFunc) {
	SP.SOD.executeFunc("sp.js", 'SP.ClientContext', function () {
		var webUrl = _spPageContextInfo.webServerRelativeUrl;
        var clientContext = new SP.ClientContext(webUrl);
        if (clientContext != undefined && clientContext != null) {
        	var user = clientContext.get_web().get_currentUser();
            var groups = user.get_groups();
            
            clientContext.load(user);
            clientContext.load(groups);
            clientContext.executeQueryAsync(function onQuerySucceeded(sender, args) {
                var groupEnum = groups.getEnumerator();
                var grp = null;
                while (groupEnum.moveNext()) {
                    var group = groupEnum.get_current();
                    if (group.get_title() == "文档发布审批" || group.get_title() == "文档废止审批") {
                        grp = group;
                        break;
                    }
                }

                if (callFunc != null && callFunc != "") {
                    var fn = window[callFunc];
                    if (grp == null) {
                        fn(false);
                    } else {
                        fn(true);
                    }
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

function IsOwner(callFunc) {
    CurrentOwnerCallFunc = callFunc;
    GetListItemById(GetQueryStringParameter("ID"), "CheckOwner");
}

function CheckOwner(val) {
    if (CurrentOwnerCallFunc != null && CurrentOwnerCallFunc != "") {
        var fn = window[CurrentOwnerCallFunc];
        if (val != null) {
            var owner = val.get_item("Owner").get_email();
            if (owner == _spPageContextInfo.userEmail) {
                fn(true);
            } else {
                fn(false);
            }
        } else {
            fn(false);
        }
    }
}

function GetCurrentUser(callFunc) {
	if (curUser != null) {
		if (callFunc != null && callFunc != "") {
            var fn = window[callFunc];
            fn(curUser);
        }
	} else {
		SP.SOD.executeFunc("sp.js", 'SP.ClientContext', function () {
			var webUrl = _spPageContextInfo.webServerRelativeUrl;
	        var clientContext = new SP.ClientContext(webUrl);
	        if (clientContext != undefined && clientContext != null) {
	        	var user = clientContext.get_web().get_currentUser();
				curUser = user;
	            clientContext.load(user);
	            clientContext.executeQueryAsync(function onQuerySucceeded(sender, args) {
	                if (callFunc != null && callFunc != "") {
	                    var fn = window[callFunc];
	                    fn(user);
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
}

function IsCurrentUser(callFunc) {
	curTempCallFunc = callFunc;
	GetCurrentUser("GetCurrentUserResult");
}

function GetGroups(callFunc) {
	SP.SOD.executeFunc("sp.js", 'SP.ClientContext', function () {
		var clientContext = SP.ClientContext.get_current();
	    var web = clientContext.get_web();
	    var groups = web.get_siteGroups();
	    clientContext.load(groups);
	    clientContext.load(web);
	    
	    clientContext.executeQueryAsync(function(){
	        var groupEnum = groups.getEnumerator();
	        var grp = null;
			while (groupEnum.moveNext()) {
				var group = groupEnum.get_current();
				if (group.get_title() == "Coordinator") {
					grp = group;
					break;
				}
			}
			
			if (grp != null) {
			    if (callFunc != null && callFunc != "") {
			        var fn = window[callFunc];
			        fn(true);
			    }
			} else {
			    if (callFunc != null && callFunc != "") {
			        var fn = window[callFunc];
			        fn(false);
			    }
			}
	    }, function(sender, args){
	        if (callFunc != null && callFunc != "") {
                var fn = window[callFunc];
                fn(false);
            }
	    });
	});
}

function GetGroupsResult(val) {
	var bol = val;
	
	if (curTempCallFunc_1 != null && curTempCallFunc_1 != "") {
        var fn = window[curTempCallFunc_1];
        fn(bol);
    }
}

function GetCurrentUserResult(val) {
	var id = GetQueryStringParameter("ID");
	var id1 = GetQueryStringParameter("IID");
	if (id1 != null && id1 != "" && (id == null || id == "")) {
		id = id1;
	}
	if (id == "") {
		if (curTempCallFunc != null && curTempCallFunc != "") {
            var fn = window[curTempCallFunc];
            fn(false);
        }
	} else {
		GetListItemById(id, "GetListItemResult");
	}
}

function GetListItemResult(val) {
	var itemUser = val.get_item("Author").get_email();
	var bol = false;
	if (itemUser == curUser.get_email()) {
		bol = true;
	}
	if (curTempCallFunc != null && curTempCallFunc != "") {
        var fn = window[curTempCallFunc];
        fn(bol);
    }
}

function DoTask(taskid, status, notes, callFunc) {
	SP.SOD.executeFunc("sp.js", 'SP.ClientContext', function () {
        var webUrl = _spPageContextInfo.webServerRelativeUrl;
        var clientContext = new SP.ClientContext(webUrl);
        if (clientContext != undefined && clientContext != null) {
            var webSite = clientContext.get_web();
            var oList = webSite.get_lists().getByTitle("任务");
            var oListItem = oList.getItemById(taskid);
			clientContext.load(oListItem);
			clientContext.executeQueryAsync(function onQuerySucceeded(sender, args) {
			    if (status == "Reject") {
			        oListItem.set_item("TaskOutcome", "已拒绝");
			    } else {
			        oListItem.set_item("TaskOutcome", "已批准");
			    }
                
                oListItem.set_item("Body", notes);
                oListItem.set_item("Status", "已完成");
                oListItem.set_item("PercentComplete", 1);
                oListItem.update();

                clientContext.load(oListItem);
                clientContext.executeQueryAsync(function onQuerySucceeded(sender, args) {
                    if (callFunc != null && callFunc != "") {
                        var fn = window[callFunc];
                        fn("Success");
                    }
                }, function onQueryFailed(sender, args) {
                    if (callFunc != null && callFunc != "") {
                        var fn = window[callFunc];
                        fn(null);
                    }
                });
			}, function onQueryFailed(sender, args) {
                if (callFunc != null && callFunc != "") {
                    var fn = window[callFunc];
                    fn(null);
                }
            });
        }
    });
}

function StartWorkflow(lid, listTitle, wfTitle, callFunc) {
	var id = "";
	if (lid != "") {
		id = lid;
	} else {
		id = GetQueryStringParameter("ID");
	}
	if (id == null || id == "") {
		if (callFunc != null && callFunc != "") {
            var fn = window[callFunc];
            fn(null);
        } else {
        	return null;
        }
	}	
	SP.SOD.executeFunc("sp.js", 'SP.ClientContext', function () {
		
        var clientContext = SP.ClientContext.get_current();
        if (clientContext != undefined && clientContext != null) {
            var webSite = clientContext.get_web();
            var oList = webSite.get_lists().getByTitle(listTitle);
            var oItem = oList.getItemById(parseInt(id));
            clientContext.load(oList);
            clientContext.load(oItem);
            clientContext.executeQueryAsync(function onQuerySucceeded(sender, args) {
	            var wfServiceManager = SP.WorkflowServices.WorkflowServicesManager.newObject(clientContext, webSite);
	            var wfDeployService = wfServiceManager.getWorkflowDeploymentService();
	            var subService = wfServiceManager.getWorkflowSubscriptionService();
				
	            if (isGroupUser) {
	                oItem.set_item("IsGroupUser", "Yes");
	                oItem.update();
	            }

	            clientContext.load(subService);
	            clientContext.executeQueryAsync(function onQuerySucceeded(sender, args) {
	            
	            	var listId = oList.get_id();
	            	var subscriptions = subService.enumerateSubscriptionsByList(listId);
	            	clientContext.load(subscriptions);
	            	clientContext.executeQueryAsync(function onQuerySucceeded(sender, args) {
	            		var definitionsEnum = subscriptions.getEnumerator();
	            		var defId = "";
		                while (definitionsEnum.moveNext()) {
		                    var def = definitionsEnum.get_current();
		                    if (wfTitle == null || wfTitle == "") {
		                        defId = def.get_id();
		                        break;
		                    } else {
		                        if (def.get_name() == wfTitle) {
		                            defId = def.get_id();
		                            break;
		                        }
		                    }
		                }
		                
		                var subscription = subService.getSubscription(defId);
		                wfServiceManager.getWorkflowInstanceService().startWorkflowOnListItem(subscription, id, new Object());
		                clientContext.executeQueryAsync(function onQuerySucceeded(sender, args) {
		                	if (callFunc != null && callFunc != "") {
			                    var fn = window[callFunc];
			                    fn("Success");
			                }
		                }, function onQueryFailed(sender, args) {
			                if (callFunc != null && callFunc != "") {
			                    var fn = window[callFunc];
			                    fn(null);
			                }
			            });
		                
	            	}, function onQueryFailed(sender, args) {
		                if (callFunc != null && callFunc != "") {
		                    var fn = window[callFunc];
		                    fn(null);
		                }
		            });
	            	
	            }, function onQueryFailed(sender, args) {
	                if (callFunc != null && callFunc != "") {
	                    var fn = window[callFunc];
	                    fn(null);
	                }
	            });
            }, function onQueryFailed(sender, args) {
                if (callFunc != null && callFunc != "") {
                    var fn = window[callFunc];
                    fn(null);
                }
            });
        }
    });
}

var wfInstItems = [];
var relHistoryItems = [];
var wfInstCurCnt = 0;
function GetTaskHistory(listTitle, callFunc) {
	var id = GetQueryStringParameter("ID");
	if (id == null || id == "") {
		if (callFunc != null && callFunc != "") {
            var fn = window[callFunc];
            fn(null);
        } else {
        	return;
        }
	}
    SP.SOD.executeFunc("sp.js", 'SP.ClientContext', function () {
        var webUrl = _spPageContextInfo.webServerRelativeUrl;
        var clientContext = new SP.ClientContext(webUrl);
        var curUserTitle = "";
        if (clientContext != undefined && clientContext != null) {
        	var curWFUser = clientContext.get_web().get_currentUser();
        	clientContext.load(curWFUser);
        	clientContext.executeQueryAsync(function onQuerySucceeded(sender, args) {
        	
        		curUserTitle = curWFUser.get_title();
	            var webSite = clientContext.get_web();
	            var oList = webSite.get_lists().getByTitle(listTitle);
	            clientContext.load(oList);
	            clientContext.executeQueryAsync(function onQuerySucceeded(sender, args) {
	            	var workflowServicesManager = SP.WorkflowServices.WorkflowServicesManager.newObject(clientContext, webSite); 
				    var workflowInstanceService = workflowServicesManager.getWorkflowInstanceService();
				    var wfInstances = workflowInstanceService.enumerateInstancesForListItem(oList.get_id().toString(), id);
				    clientContext.load(wfInstances);
	            	clientContext.executeQueryAsync(function onQuerySucceeded(sender, args) {
	            		var instancesEnum = wfInstances.getEnumerator();
					    
	            		while(instancesEnum.moveNext()){
		            		var instance = instancesEnum.get_current();
		            		var insid = instance.get_id();
			            	var initUserId = "";
		            		for (var p in instance.get_objectData().get_properties().Properties) {
			            		if (p == "Microsoft.SharePoint.ActivationProperties.InitiatorUserId") {
			            			initUserId = instance.get_objectData().get_properties().Properties["Microsoft.SharePoint.ActivationProperties.InitiatorUserId"];
			            			break;
			            		}
			            	}
		            		var startTime = ormatDateEx(instance.get_instanceCreated() + 1000 * 60 * 60 * 8);
		            		
		            		var relWFItem = {};
		            		relWFItem.ID = 0;
		            		relWFItem.Approver = curUserTitle;
		            		relWFItem.Time = startTime;
		            		relWFItem.Remark = "";
		            		relWFItem.RealTime = instance.get_instanceCreated() + 1000 * 60 * 60 * 8;
		            		if (instance.get_workflowSubscriptionId().toString() == "8b5c4d69-c003-4fb0-9271-ade4bf2acdfa") {
		            		    relWFItem.Result = "启动流程【文档废止】";
		            		} else if (instance.get_workflowSubscriptionId().toString() == "b69195f8-3ee4-4531-91cd-80593c35e68e") {
		            		    relWFItem.Result = "启动流程【文档发布】";
		            		}
		            		relWFItem.InitUserId = initUserId;
		            		
		            		relWFItem.InstId = insid;
		            		wfInstItems.push(relWFItem);
	            		}
	            		
	            		if (wfInstItems.length == 0) {
	            			if (callFunc != null && callFunc != "") {
			                    var fn = window[callFunc];
			                    fn(null);
			                }
	            		} else {
	            			GetLoopTask(callFunc, "ReturnHistory");
	            		}
			            
	            	}, function onQueryFailed(sender, args) {
		                if (callFunc != null && callFunc != "") {
		                    var fn = window[callFunc];
		                    fn(null);
		                }
		            });
	            }, function onQueryFailed(sender, args) {
	                if (callFunc != null && callFunc != "") {
	                    var fn = window[callFunc];
	                    fn(null);
	                }
	            });
			}, function onQueryFailed(sender, args) {
                if (callFunc != null && callFunc != "") {
                    var fn = window[callFunc];
                    fn(null);
                }
            });
        }
    });
}

function GetLoopTask(callFunc, callLocal) {
    SP.SOD.executeFunc("sp.js", 'SP.ClientContext', function () {
        var querys = "<View>" +
	        "<Query>" +
	        "<Where>" +
	        "<Eq><FieldRef Name=\'WF4InstanceId\'/><Value Type=\'Text\'>" + wfInstItems[wfInstCurCnt].InstId + "</Value></Eq>" +
	        "</Where>" +
	        "</Query>" +
	        "</View>";

        var webUrl = _spPageContextInfo.webServerRelativeUrl;
        var clientContext = new SP.ClientContext(webUrl);
        var webSite = clientContext.get_web();

        var userTempInfos = wfInstItems[wfInstCurCnt].InitUserId.split('|');
        var wfInitUser = webSite.ensureUser(userTempInfos[userTempInfos.length - 1]);
        clientContext.load(wfInitUser);
        clientContext.executeQueryAsync(function onQuerySucceeded(sender, args) {
            wfInstItems[wfInstCurCnt].Approver = wfInitUser.get_title();

            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml(querys);
            var tList = webSite.get_lists().getByTitle("任务");
            var collListItem = tList.getItems(camlQuery);
            clientContext.load(collListItem);
            clientContext.executeQueryAsync(function onQuerySucceeded(sender, args) {
                var listItemEnumerator = collListItem.getEnumerator();
                while (listItemEnumerator.moveNext()) {
                    var oListItem = listItemEnumerator.get_current();
                    var relItem = {};
                    relItem.ID = oListItem.get_id();
                    relItem.Approver = oListItem.get_item("Editor").get_lookupValue();
                    relItem.Time = ormatDateEx(oListItem.get_item("Modified"));
                    relItem.Remark = oListItem.get_item("Body");
                    relItem.Result = oListItem.get_item("TaskOutcome");
                    relItem.InstId = "";
                    relItem.RealTime = oListItem.get_item("Modified");
                    var relItemTitle = oListItem.get_item("Title");
                    var taskPercent = oListItem.get_item("PercentComplete");

                    if (relItem.Result == null || relItem.Result == "") {
                        //continue;
                    } else {
                        if (relItem.Remark == null) {
                            relItem.Remark = "";
                        }
                        relHistoryItems.push(relItem);
                    }
                }

                wfInstCurCnt++;
                if (wfInstCurCnt >= wfInstItems.length) {
                    if (callLocal != null && callLocal != "") {
                        var fn = window[callLocal];
                        fn(callFunc);
                    }
                } else {
                    GetLoopTask(callFunc, callLocal);
                }
            }, function onQueryFailed(sender, args) {
                // Do nothing
            });
        });
    }, function onQueryFailed(sender, args) {
        // Do nothing
    });
}

function GetLatestRecord(userId, listTitle, callFunc) {
    var querys = "<View>" +
                "<Query>" +
                "<Where>" +
                "<Eq><FieldRef Name=\'Author\' LookupId='True' /><Value Type=\'User\'>" + userId + "</Value></Eq>" +
                "</Where>" +
                "<OrderBy><FieldRef Name=\'Created\' Ascending='FALSE' /></OrderBy><RowLimit>1</RowLimit>" + 
                "</Query>" +
                "</View>";
    SP.SOD.executeFunc("sp.js", 'SP.ClientContext', function () {
        var webUrl = _spPageContextInfo.webServerRelativeUrl;
        var clientContext = new SP.ClientContext(webUrl);
        if (clientContext != undefined && clientContext != null) {
            var webSite = clientContext.get_web();
            var oList = webSite.get_lists().getByTitle(listTitle);
            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml(querys);
            var collListItem = oList.getItems(camlQuery);
            clientContext.load(collListItem);
            clientContext.executeQueryAsync(function onQuerySucceeded(sender, args) {
                var listItemEnumerator = collListItem.getEnumerator();
                var oListItem = null;
                if (listItemEnumerator.moveNext()) {
                    oListItem = listItemEnumerator.get_current();   
                }
                
                if (callFunc != null && callFunc != "") {
                    var fn = window[callFunc];
                    fn(oListItem);
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

function ReturnHistory(callFunc) {
    var hisItems = [];

    for (var i = 0; i < wfInstItems.length; i++) {
        hisItems.push(wfInstItems[i]);
    }
    for (var i = 0; i < relHistoryItems.length; i++) {
        hisItems.push(relHistoryItems[i]);
    }
    if (callFunc != null && callFunc != "") {
        var sortList = hisItems.sort(sortHistory);
        var fn = window[callFunc];
        fn(sortList);
    }
}

function GetNotStartedTasks(listTitle, callFunc) {
	var id = GetQueryStringParameter("ID");
	if (id == null || id == "") {
		if (callFunc != null && callFunc != "") {
            var fn = window[callFunc];
            fn(null);
        } else {
        	return null;
        }
	}
    SP.SOD.executeFunc("sp.js", 'SP.ClientContext', function () {
        var webUrl = _spPageContextInfo.webServerRelativeUrl;
        var clientContext = new SP.ClientContext(webUrl);
        var curUserTitle = "";
        if (clientContext != undefined && clientContext != null) {
        	var curWFUser = clientContext.get_web().get_currentUser();
        	clientContext.load(curWFUser);
        	clientContext.executeQueryAsync(function onQuerySucceeded(sender, args) {
        	
        		curUserTitle = curWFUser.get_title();
	            var webSite = clientContext.get_web();
	            var oList = webSite.get_lists().getByTitle(listTitle);
	            clientContext.load(oList);
	            clientContext.executeQueryAsync(function onQuerySucceeded(sender, args) {
	            	var workflowServicesManager = SP.WorkflowServices.WorkflowServicesManager.newObject(clientContext, webSite); 
				    var workflowInstanceService = workflowServicesManager.getWorkflowInstanceService();
				    var wfInstances = workflowInstanceService.enumerateInstancesForListItem(oList.get_id().toString(), id);
				    clientContext.load(wfInstances);
	            	clientContext.executeQueryAsync(function onQuerySucceeded(sender, args) {
	            		var instancesEnum = wfInstances.getEnumerator();
					    var currentInstance = null;
	            		while(instancesEnum.moveNext()){
		            		var instance = instancesEnum.get_current();
		            		var wfStatus = "";
		            		for (var p in instance.get_objectData().get_properties().Properties) {
			            		if (p == "UserStatus") {
			            		    wfStatus = instance.get_objectData().get_properties().Properties["UserStatus"];
			            			break;
			            		}
			            	}
		            		
		            		if (wfStatus != "") {
		            		    currentInstance = instance;
		            		    break;
		            		}
	            		}
	            		
	            		if (currentInstance != null) {
	            			var querys = "<View>" +
						        "<Query>" +
						        "<Where><And>" +
						        "<Eq><FieldRef Name=\'WF4InstanceId\'/><Value Type=\'Text\'>" + currentInstance.get_id() + "</Value></Eq>" +
						        "<Eq><FieldRef Name=\'Status\'/><Value Type=\'Text\'>未启动</Value></Eq>" +
						        "</And></Where>" +
						        "</Query>" +
						        "</View>";
							var camlQuery = new SP.CamlQuery();
						    camlQuery.set_viewXml(querys);
						    var tList = webSite.get_lists().getByTitle("任务");
						    var collListItem = tList.getItems(camlQuery);
						    clientContext.load(collListItem);
						    clientContext.executeQueryAsync(function onQuerySucceeded(sender, args) {
						    	var listItemEnumerator = collListItem.getEnumerator();
						    	var tasks = [];
						    	var taskId = null;
						        while (listItemEnumerator.moveNext()) {
						        	var tListItem = listItemEnumerator.get_current();
						        	var taskItem = {};
						        	taskItem.TaskId = tListItem.get_id();
						        	taskId = tListItem.get_id();
						        	break;
								}
								
								if (callFunc != null && callFunc != "") {
				                    var fn = window[callFunc];
				                    fn(taskId);
				                }
						    }, function onQueryFailed(sender, args) {
				                if (callFunc != null && callFunc != "") {
				                    var fn = window[callFunc];
				                    fn(null);
				                }
				            });
	            		}
			            
	            	}, function onQueryFailed(sender, args) {
		                if (callFunc != null && callFunc != "") {
		                    var fn = window[callFunc];
		                    fn(null);
		                }
		            });
	            }, function onQueryFailed(sender, args) {
	                if (callFunc != null && callFunc != "") {
	                    var fn = window[callFunc];
	                    fn(null);
	                }
	            });
			}, function onQueryFailed(sender, args) {
                if (callFunc != null && callFunc != "") {
                    var fn = window[callFunc];
                    fn(null);
                }
            });
        }
    });
}

function sortHistory(a,b)
{
	return a.RealTime - b.RealTime;
}

function HideDelBtn() {
	try {
    	var btn = $("[id='Ribbon.ListForm.Edit.Actions.DeleteItem-Large']");
    	if (btn.length > 0) {
			$(btn).hide();
    		clearInterval(delint);
    		return;
    	}
    	setTimeout(function(){HideDelBtn();}, 500);
	} catch (e) {
		setTimeout(function(){HideDelBtn();}, 500);
	}
}

function HideSaveBtn() {
	try {
    	var btn = $("[id='Ribbon.ListForm.Edit.Commit.Publish-Large']");
    	if (btn.length > 0) {
			$(btn).hide();
			try {
				var btn1 = $("[id='Ribbon.ListForm.Edit.Actions']");
				$(btn1).hide();
			} catch (e) {}
    		clearInterval(delint);
    		return;
    	}
    	setTimeout(function(){HideSaveBtn();}, 500);
	} catch (e) {
		setTimeout(function(){HideSaveBtn();}, 500);
	}
}

function HideViewBtn() {
	try {
    	var btn = $("[id='Ribbon.ListItem.Manage.ViewProperties-Large']");
    	if (btn.length > 0) {
			$(btn).hide();
    		clearInterval(delint);
    		return;
    	}
    	setTimeout(function(){HideViewBtn();}, 800);
	} catch (e) {
		setTimeout(function(){HideViewBtn();}, 800);
	}
}

function HideWorkflow() {
	try {
    	var btn = $("[id='Ribbon.ListItem.Workflow']");
    	if (btn.length > 0) {
			$(btn).hide();
    		clearInterval(delint);
    		return;
    	}
    	setTimeout(function(){HideWorkflow();}, 800);
	} catch (e) {
		setTimeout(function(){HideWorkflow();}, 800);
	}
}

function HideDelBtnM() {
	try {
    	var btn = $("[id='Ribbon.ListItem.Manage.Delete-Medium']");
    	if (btn.length > 0) {
			$(btn).hide();
    		clearInterval(delint);
    		return;
    	}
    	setTimeout(function(){HideDelBtnM();}, 800);
	} catch (e) {
		setTimeout(function(){HideDelBtnM();}, 800);
	}
}

function HideAttachBtn() {
	try {
    	var btn = $("[id='Ribbon.ListItem.Actions']");
    	if (btn.length > 0) {
			$(btn).hide();
    		clearInterval(delint);
    		return;
    	}
    	setTimeout(function(){HideAttachBtn();}, 800);
	} catch (e) {
		setTimeout(function(){HideAttachBtn();}, 800);
	}
}

function HideAddBtn() {
	try {
    	var btn = $("[id='Ribbon.ListItem.New']");
    	if (btn.length > 0) {
			$(btn).hide();
    		clearInterval(delint);
    		return;
    	}
    	setTimeout(function(){HideAddBtn();}, 800);
	} catch (e) {
		setTimeout(function(){HideAddBtn();}, 800);
	}
}

function HideViewFormatBtn() {
	try {
    	var btn = $("[id='Ribbon.List.ViewFormat']");
    	if (btn.length > 0) {
			$(btn).hide();
    		clearInterval(delint);
    		return;
    	}
    	setTimeout(function(){HideViewFormatBtn();}, 800);
	} catch (e) {
		setTimeout(function(){HideViewFormatBtn();}, 800);
	}
}

function ConvertNull(obj) {
    if (obj == null) {
        return "";
    } else {
        return obj;
    }
}




