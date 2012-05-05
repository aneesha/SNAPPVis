
function PerformSocialAnalysisBlackboard()
{

	var formWithTable = document.getElementById("treeForm");
	//alert(formWithTable);
	//alert(formWithTable.getAttribute("name"));

	var table = formWithTable.getElementsByTagName("table");
	var rows = table[0].getElementsByTagName("tr");
	//alert("rows:" + rows.length);

	for(i = 0; i < rows.length; i++)
	{
		var cols = rows[i].getElementsByTagName("td");
		var rowtext = "--";
		//alert("cols:" + cols.length);
		for (j = 0; j < cols.length; j++)
		{
			//rowtext = rowtext + " " + cols[j].innerHTML;
			if (j==3)
			{
				columnWithLink = cols[j].getElementsByTagName("a");
				relationship = columnWithLink[1].getAttribute("href");
				relationship = relationship.substring(relationship.indexOf('(')+1,relationship.length-1);
                relationshiplist = relationship.split(",");
				postid = relationshiplist[1].substring(1,relationshiplist[1].length-1);
				threaddepth =	getTextAfterChar(relationshiplist[2].substring(1,relationshiplist[2].length-1),'_').substring(1);
            }
			else if (j==4)
			{
				posted_by = cols[j].innerHTML;
				posted_by = posted_by.substring(posted_by.indexOf('>'),posted_by.length);
				posted_by = stripSpaces(posted_by);

				if (forumusers[posted_by])
				{
					forumusers[posted_by] = forumusers[posted_by] + 1;
				}
				else
				{
					forumusers[posted_by] = 1;
				}
				//alert(posted_by);
			}
			else if (j==5)
			{
				posted_on = cols[j].innerHTML;
				posted_on = stripSpaces(posted_on);
			}
		}
		threadowners[threaddepth] = posted_by;
		//alert(threadowners[threaddepth]);

		if (threaddepth.length != 1)
		{
			threadReplyDepth = threaddepth.substring(0,threaddepth.lastIndexOf('_'));//threaddepth.length-2
			
			//alert(threaddepth + " " + threadReplyDepth);
			//alert(reply_to);
			if (threadowners[threadReplyDepth]) 
			{
				reply_to = threadowners[threadReplyDepth];
				sna_relationship = posted_by + "_" + reply_to;
				if (replies[sna_relationship]) {
					replies[sna_relationship] += 1;
				}
				else {
					replies[sna_relationship] = 1;
				}
			}
		}
		else
		{
			// Originating Thread
			reply_to = "-";
		}

		// insert into SNAPP Interactions database
		//AddPost(from_person, to_person, sent_date_time, forum_id);
		AddPost(posted_by, reply_to, posted_on, 1);

		totalposts = totalposts + 1;
	}
}

function PerformSocialAnalysisBlackboardV9()
{
	//alert("BB 9 PerformSocialAnalysisBlackboardV9() called");
	var formWithTable = document.getElementById("treeForm");
	//alert(formWithTable);
	//alert(formWithTable.getAttribute("name"));

	var table = formWithTable.getElementsByTagName("table");
	var rows = table[0].getElementsByTagName("tr");
	//alert("rows:" + rows.length);
	var threadowners= [];
	for(i = 0; i < rows.length; i++)
	{
		var cols = rows[i].getElementsByTagName("td");
		var rowtext = "--";
		//alert("cols:" + cols.length);
		for (j = 0; j < cols.length; j++)
		{
			//rowtext = rowtext + " " + cols[j].innerHTML;
			if (j==3)
			{
				//alert(cols[j].innerHTML);
				columnWithLink = cols[j].getElementsByTagName("a");
				//alert(columnWithLink.length)
				relationship = columnWithLink[columnWithLink.length-1].getAttribute("href");
				//alert(relationship);
				relationship = relationship.substring(relationship.indexOf('(')+1,relationship.length-1);
                		relationshiplist = relationship.split(",");
				postid = relationshiplist[1].substring(1,relationshiplist[1].length-1);
				
				threaddepth =	getTextAfterChar(relationshiplist[2].substring(1,relationshiplist[2].length-1),'_').substring(1);
				//alert(postid + " " + threaddepth);
            		}
			else if (j==4)
			{
				posted_by = cols[j].innerHTML;
				posted_by = posted_by.substring(posted_by.indexOf('>'),posted_by.length);
				posted_by = stripSpaces(posted_by);

				if (forumusers[posted_by])
				{
					forumusers[posted_by] = forumusers[posted_by] + 1;
				}
				else
				{
					forumusers[posted_by] = 1;
				}
				//alert(posted_by);
			}
			else if (j==5)
			{
				posted_on = cols[j].innerHTML;
				posted_on = stripSpaces(posted_on);
				if (posted_on.indexOf("AM")==-1&&posted_on.indexOf("PM")==-1)
				{
					posted_on = posted_on + " AM";
				}
				//alert(posted_on);
			}
		}
		threadowners[threaddepth] = posted_by;
		
		//alert("threaddepth:" + " " + threaddepth + " " + posted_by);
		//alert("threadowners.length: " + threadowners.length);
		if (i > 0)
		{
			threadReplyDepth = threaddepth.substring(0,threaddepth.lastIndexOf('_'));//threaddepth.length-2
			
			//alert(threaddepth + " " + threadReplyDepth);
			//alert(reply_to);

			if (threadowners[threadReplyDepth]) 
			{
				reply_to = threadowners[threadReplyDepth];
				sna_relationship = posted_by + "_" + reply_to;
				if (replies[sna_relationship]) {
					replies[sna_relationship] += 1;
				}
				else {
					replies[sna_relationship] = 1;
				}
			}

		}
		else
		{
			//alert("Setting reply_to to -");
			// Originating Thread
			reply_to = "-";
		}

		// insert into SNAPP Interactions database
		//AddPost(from_person, to_person, sent_date_time, forum_id);
		AddPost(posted_by, reply_to, posted_on, 1, "Blackboard");

		totalposts = totalposts + 1;
	}
}

function makeSNAInterfaceBlackboard(divid)
{
  BuildSNAHTML = BuildSNAPP2InterfaceHTML();
  var browserType = navigator.userAgent.toLowerCase();
	var container;
	if (divid!="body")
	{
		container= document.getElementById(divid);
	}
	else
	{
		container= document.body;
	} 
	var ifrm = document.createElement("IFRAME");
	ifrm.id = "SNAPP";
	ifrm.style.width = "99%";
	ifrm.style.height = "700px";
	ifrm.style.frameborder = "0";
	container.appendChild(ifrm); 

	var head = '<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"><head><title>SNAPP</title><meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">';
	head = head + '<script language="javascript" src="'+serverPath+'jquery-1.4.2.min.js"></script>';
	head = head + '<script language="javascript" src="'+serverPath+'jquery-ui-1.8.6.custom/js/jquery-ui-1.8.6.custom.min.js"></script>';
	head = head + '<script language="javascript" src="'+serverPath+'webtoolkit.base64.js"></script>';
	head = head + '<script language="javascript" src="'+serverPath+'jquery.jqplot.min.js"></script>';
	head = head + '<script language="javascript" src="'+serverPath+'jqplot.dateAxisRenderer.min.js"></script>';
	head = head + '<script language="javascript" src="'+serverPath+'jqplot.highlighter.min.js"></script>';
  head = head + '<script language="javascript" src="'+serverPath+'jqplot.cursor.min.js"></script>';
	head = head + '<script language="javascript" src="'+serverPath+'jquery.tablesorter.min.js"></script>';
	head = head + '<script language="javascript" src="'+serverPath+'tablesorter_filter.js"></script>';
  head = head + '<script language="javascript" src="'+serverPath+'jquery.tablesorter.pager.js"></script>';
  head = head + '<script language="javascript" src="'+serverPath+'jquery.spinbox.js"></script>';
  if (browserType.indexOf('msie'))
  {
	 head = head + '<script language="javascript" src="'+serverPath+'excanvas.min.js"></script>';
	}
	head = head + '<script language="javascript" src="'+serverPath+'snappfunctions.js?uniqueCache=' + (new Date()).getTime() +'"></script>';
	head = head + '<script language="javascript" src="'+serverPath+'snappinterface.js?uniqueCache=' + (new Date()).getTime() +'"></script>';
	//head = head + '<LINK href="' +serverPath +'ui.css" rel="stylesheet" type="text/css">';
	head = head + '<LINK href="' +serverPath +'style.css" rel="stylesheet" type="text/css">';
	head = head + '<LINK href="' +serverPath +'jquery.jqplot.min.css" rel="stylesheet" type="text/css">';
	head = head + '<LINK href="' +serverPath +'jquery.tablesorter.pager.css" rel="stylesheet" type="text/css">';
	head = head + '<LINK href="' +serverPath +'jquery-ui-1.8.6.custom/css/redmond/jquery-ui-1.8.6.custom.css" rel="stylesheet" type="text/css">';
	head = head + '<LINK href="' +serverPath +'jquery.spinbox.css" rel="stylesheet" type="text/css">';
	head = head + '<script language="javascript">';
	head = head + '$(document).ready(function() {displaySNAPP();});';
	head = head + '</script>';	
	head = head + '</head>';
	
	var contentbody = '<body><div id="SNAPPContainer">' + BuildSNAHTML + "</div></body>";
	
	var content = head + contentbody + "</html>";

	ifrm.contentWindow.document.open();
	ifrm.contentWindow.document.write(content);
	ifrm.contentWindow.document.close();
}

var globalBBForumThreadList;
var globalBBCurrentThreadIndex = 0;
var bbThreadcourse_id;
var bbThreadconf_id;
var bbThreadforum_id;

function BBMultiForumMiner(forum_id,conf_id,course_id,threadListString)
{
			threadList = threadListString.split(",");//new Array(threadListString);
	//alert(threadList.length + threadList[0] + threadList[1]);
			globalBBForumThreadList = threadList;
			bbThreadcourse_id = course_id;
			bbThreadconf_id = conf_id;
			bbThreadforum_id = forum_id;
			
			// Make temp div to inject the forum thread HTML
			BuildTEMPThreadHolder = "";
	  		BuildTEMPThreadHolder = BuildTEMPThreadHolder + '<div id="SNAPPTemp">';
			BuildTEMPThreadHolder = BuildTEMPThreadHolder + '<H1>Please wait SNAPP is extracting Social Graph data...';
			BuildTEMPThreadHolder = BuildTEMPThreadHolder + '<img src="'+ serverPath + 'images/ajax-loader.gif"/>';
			BuildTEMPThreadHolder = BuildTEMPThreadHolder + '</H1>';
			BuildTEMPThreadHolder = BuildTEMPThreadHolder + '</div>';  
	
	  		var snaLoading = document.createElement("div");
	  		snaLoading.id = "SNAPPLoading";
			jQuery("body").append(snaLoading);
			jQuery("#SNAPPLoading").html(BuildTEMPThreadHolder);
			setTimeout('SetScrollPosition("SNAPPLoading");',3);
	
	  		var snaTempThreadHolder = document.createElement("div");
	  		snaTempThreadHolder.id = "SNAPPTempContainer";
			jQuery("body").append(snaTempThreadHolder);
			
			//alert(threadList.length);
			if (threadList.length>0)
			{
				retrieveBBForumThread();
			}
			else
			{
				alert("The forum currently being viewed does not contain any threads.");
			}
}

function retrieveBBForumThread()
{
	
	threadURL = "/webapps/discussionboard/do/message?action=message_tree&course_id=" + bbThreadcourse_id + "&conf_id=" + bbThreadconf_id + "&forum_id=" + bbThreadforum_id + "&message_id=" + globalBBForumThreadList[globalBBCurrentThreadIndex] + "&nav=discussion_board_entry&nav=discussion_board_entry&thread_id=" + globalBBForumThreadList[globalBBCurrentThreadIndex] + "&req_timestamp=1261570638599_0.7923824127440066";
	//threadURL = "/webapps/discussionboard/do/message?action=list_messages&forum_id=" + bbThreadforum_id + "&nav=discussion_board_entry&conf_id=" + bbThreadconf_id + "&course_id=" + bbThreadcourse_id + "&message_id=" + globalBBForumThreadList[globalBBCurrentThreadIndex];
	var html = jQuery.ajax({url: threadURL,
							success: function(html)
									 {
									 		//alert(html);
											jQuery("#SNAPPTempContainer").html(html);
											PerformSocialAnalysisBlackboardV9();
											globalBBCurrentThreadIndex = globalBBCurrentThreadIndex + 1;
										        //alert("globalBBCurrentThreadIndex: " + globalBBCurrentThreadIndex);
											if (globalBBCurrentThreadIndex<globalBBForumThreadList.length)
											{
												retrieveBBForumThread();
											}
											else
											{
												BBMultiForumMinerCompleted();
											}
									 }
				});
}

function BBMultiForumMinerCompleted()
{
	jQuery("#SNAPPTempContainer").html("");
	jQuery("#SNAPPLoading").html("");
	// Display the interface
	makeSNAInterface("body");
	//scroll to where SNA Data is inserted
	setTimeout('SetScrollPosition("SNAPP");',3);
}