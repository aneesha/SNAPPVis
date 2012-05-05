// Global Variables
//alert("loadsna: " + LMS);


var serverPath = "http://www.snappvis.org/SNAPP2/";
var browserType = navigator.userAgent.toLowerCase();
var jsList = new Array("js/jquery-1.4.2.min.js","jquery-ui-1.8.6.custom/js/jquery-ui-1.8.6.custom.min.js", "js/webtoolkit.base64.js?uniqueCache=" + (new Date()).getTime(), "js/jquery.jqplot.min.js", "js/jqplot.dateAxisRenderer.min.js", "js/jqplot.highlighter.min.js", "js/jqplot.cursor.min.js", "js/jquery.tablesorter.min.js", "js/tablesorter_filter.js", "js/jquery.tablesorter.pager.js", "snappfunctions.js?uniqueCache=" + (new Date()).getTime());
var jsIEList = new Array("js/excanvas.min.js");
var cssList = new Array("css/style.css?uniqueCache="+ (new Date()).getTime(),"css/jquery.jqplot.min.css", "css/jquery.tablesorter.pager.css", "jquery-ui-1.8.6.custom/css/redmond/jquery-ui-1.8.6.custom.css?uniqueCache="+ (new Date()).getTime());

function determineCurrentLMS()
{
	var docLocation = document.location.href;
	var LMS = "";
	if ((docLocation.indexOf("mod/forum/discuss.php") != -1) || (docLocation.indexOf("mod/forum/view.php") != -1)) 
	{
		// Moodle Individual Thread View && Moodle Forum View with links to Multiple Threads
		LMS = "moodle";
	}
	else if (docLocation.indexOf("discussions/admin/forum_topics_list.d2l") != -1)
	{
		// D2L Multi Forum Thread - For D2L Version 9
		LMS = "d2l";
	}
	else if (((docLocation.indexOf("webct/newMessageThread.dowebct") != -1)|| (docLocation.indexOf("/discussionHomepageView.dowebct") != -1) || (docLocation.indexOf("serve_bulletin") != -1))) // ACTION=DESIGN_LIST or LIST for older version of Web CT
	{
		//alert("sna_bookmarklet: WebCT");
		LMS = "webct";
        }
	else if ((docLocation.indexOf("do/message?action=list_messages") != -1) || (docLocation.indexOf("do/forum?action=list_threads") != -1) || (docLocation.indexOf("discussionboard/do/conference") != -1) || (docLocation.indexOf("discussionboard/do/message") != -1)) 
	{
		LMS = "blackboard";
	}
	else if ((docLocation.indexOf("newMessageThread.dowebct") != -1)) 
	{
		// forum displayed but not expanded
		LMS = "webct";
	}
	else if ((docLocation.indexOf("do/forum?action=list_threads") != -1)) 
	{
		// forum displayed but not expanded
		LMS = "blackboard";
	}
	else if ((docLocation.indexOf("discussions/messageLists/message_list_gridstyle.d2l") != -1)||(docLocation.indexOf("discussions/admin/forum_topics_list.d2l") != -1)||(docLocation.indexOf("discussions/messageLists/message_list_readingstyle.d2l") != -1))
	{
		// D2L Forum Thread
		LMS = "d2l";
		//alert("D2L Forum Found");
        }
	else if (docLocation.indexOf("Objects/DiscussionForums/Threads2.aspx") != -1)
	{
		// D2L Forum Thread
		LMS = "angel";
        }
	
	return LMS;
}

function build_TEMPThreadHolder()
{
  BuildTEMPThreadHolder = "";
  BuildTEMPThreadHolder +=  '<div id="SNAPPTemp">';
  BuildTEMPThreadHolder += '<H1>Please wait SNAPP is extracting Social Graph data...';
  BuildTEMPThreadHolder += '<img src="'+ serverPath + 'images/ajax-loader.gif"/>';
  BuildTEMPThreadHolder += '</H1>';
  BuildTEMPThreadHolder += '</div>'; 
  return BuildTEMPThreadHolder;
}

function build_codeList(server_Path,code_List,IE_List,list_Type)
{
  code_ListString = "";
  prefix = "";
  suffix = "";
  
  if (list_Type=="inline")
  {
    prefix = '"' + server_Path;
    suffix = ',';
  }
  else if (list_Type=="script")
  {
    prefix = '<script language="javascript" src="' + server_Path;
    suffix = '></script>';
  }
  else if (list_Type=="css")
  {
    prefix = '<LINK href="' + server_Path;
    suffix = ' rel="stylesheet" type="text/css">';
  }
  
  for (i=0;i<code_List.length;i++)
  {
    code_ListString += prefix + code_List[i] + '"';
    if ((i<(code_List.length-1))||(list_Type!="inline"))
    {
      code_ListString += suffix
    }
  }
  
  if (browserType.indexOf("msie"))
  {
    if (IE_List.length > 0)
    {
      code_ListString += ",";
    }
    
    for (i=0;i<IE_List.length;i++)
    {
      code_ListString += prefix + IE_List[i] + '"';
      if ((i<(IE_List.length-1))||(list_Type!="inline"))
      {
        code_ListString += suffix
      }
    }
  }
  
  return code_ListString;
}

function build_SNAPPframe(contentbody,divcontainer)
{

  BuildTEMPThreadHolder = build_TEMPThreadHolder();
  

  var ifrm = document.createElement("IFRAME");
  ifrm.id = "SNAPP";
  ifrm.style.width = "98%";
  ifrm.style.height = "700px";
  ifrm.style.frameborder = "0";
  if (divcontainer=="body")
	{
		var container = document.body.appendChild(ifrm);
	}
  else
	{
		var container = document.getElementById(divcontainer);
		container.appendChild(ifrm); 
	}
  

	
    
  var head = '<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"><head><title>SNAPP</title><meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">';
  head = "<head>" + build_codeList(serverPath,jsList,jsIEList,"script") + build_codeList(serverPath,cssList,"","css") + "</head>";
  //var content = head + "<div id='snappbody'>" + contentbody + "</div></html>";
  var content = head + contentbody + "</html>";
    
  ifrm.contentWindow.document.open();
  ifrm.contentWindow.document.write(content);
  ifrm.contentWindow.document.close();
}

function runSNA() 
{	
//alert("runSNA called!!!");
	var webCT4ACTION = "";
	var currScript = document.location.href;
	if (currScript.indexOf("serve_bulletin")!==-1)
	{
		// older WebCT version 4
		if (document.body.innerHTML.indexOf("/web-ct/en/img/small_expand.gif")==-1)
		{
			PerformSocialAnalysisWebCTVer4();
			makeSNAInterface("body");
			//scroll to where SNA Data is inserted
      setTimeout('SetScrollPosition("SNAPP");',3); 
		}
		else
		{
			alert("Please expand all threads. In WebCT version 4, you will need to manually expand each un-expanded thread individually.");
		}
		
	}
	else if (currScript.indexOf("Objects/DiscussionForums/Threads2.aspx")!=-1)
	{

		currLMS = "angel";
			
		PerformSocialAnalysisAngel();
		makeSNAInterface("body");

	}
	else if (currScript.indexOf("discussionboard/do/message?action=list_messages")!=-1)
	{
		//http://testing-blackboard.elearning.uq.edu.au/webapps/discussionboard/do/forum?action=list_threads&nav=discussion_board_entry&course_id=_40618_1&conf_id=_55875_1&forum_id=_3671_1
		// Triggered from individual thread in Blackboard Version 7/8/9
		if (document.getElementById("containerdiv")==null)
		{
			// Blackboard version 7/8
			//alert('bb 8');
			//PerformSocialAnalysisBlackboard();
			//makeSNAInterfaceBlackboard("body");
			currLMS = "Blackboard";
			
			var RequestVars = getRequestVars();
			var cur_course_id = RequestVars["course_id"];
			var cur_conf_id = RequestVars["conf_id"];
			var cur_forum_id = RequestVars["forum_id"];
			var threadListString = "'" + RequestVars["message_id"] + "'"; 

			var contentbody = "<body onload=\"BBMultiForumMiner('" + cur_forum_id + "','" + cur_conf_id + "','"+ cur_course_id + "'," + threadListString + ");\"></body>";
			build_SNAPPframe(contentbody,"body");
		}
		else
		{
			// Blackboard version 9
			//
			//alert("YAY Blackboard 9 - ");
			/*
			currLMS = "Blackboard9";
			PerformSocialAnalysisBlackboardV9();
			makeSNAInterface("containerdiv");
			*/
			//makeSNAInterfaceBlackboard("containerdiv");
			
			currLMS = "Blackboard";
			
			var RequestVars = getRequestVars();
			var cur_course_id = RequestVars["course_id"];
			var cur_conf_id = RequestVars["conf_id"];
			var cur_forum_id = RequestVars["forum_id"];
			var threadListString = "'" + RequestVars["message_id"] + "'"; 

			var contentbody = "<body onload=\"BBMultiForumMiner('" + cur_forum_id + "','" + cur_conf_id + "','"+ cur_course_id + "'," + threadListString + ");\"></body>";
			build_SNAPPframe(contentbody,"content");
			
		}
		//scroll to where SNA Data is inserted
  		//setTimeout('SetScrollPosition("SNAPP");',3);
	}
	else if (currScript.indexOf("do/forum?action=list_threads")!==-1)
	{
		// Triggered from forum display
		// Need to extract data from multiple threads
		//alert("BB 8 Forum Multiple Threads to be mined!");
		if (document.getElementById("containerdiv")==null)
		{
			// Blackboard Version 7 or 8
			//alert("BB 8 Multi");
			var threadTables = document.getElementsByTagName("table");
			var threadcheckboxes = threadTables[6].getElementsByTagName("input");

			var threadListString = "";
			var threadList = new Array();
			for (i = 0; i < threadcheckboxes.length; i++) 
			{
				if ((threadcheckboxes[i].getAttribute("value")!="") && (threadcheckboxes[i].checked))
				{
					threadList[i] = threadcheckboxes[i].getAttribute("value");
					threadListString = threadListString + "" + threadcheckboxes[i].getAttribute("value") + ",";
				}
			}
		
			threadListString = threadListString.substring(0,threadListString.length-1)

			var RequestVars = getRequestVars();
			var cur_course_id = RequestVars["course_id"];
			var cur_conf_id = RequestVars["conf_id"];
			var cur_forum_id = RequestVars["forum_id"];
			
			if (threadList.length==0)
			{
				alert("Please use tick checkbox next to the thread title to include the thread in the SNA analysis.");
			}
			else
			{
				var contentbody = "<body onload=\"BBMultiForumMiner('" + cur_forum_id + "','" + cur_conf_id + "','"+ cur_course_id + "','" + threadListString + "');\"></body>";
				build_SNAPPframe(contentbody,"body");
			}
			
		}
		else
		{
			// Blackboard Version 9
			//alert("BB 9 Multi");
			var threadTable = document.getElementById("listContainer_datatable");//datatable <- used to be
			var threadcheckboxes = threadTable.getElementsByTagName("input");
			var threadListString = "";
			var threadList = new Array();
			for (i = 0; i < threadcheckboxes.length; i++) 
			{
				if ((threadcheckboxes[i].getAttribute("value")!="") && (threadcheckboxes[i].checked))
				{
					threadList[i] = threadcheckboxes[i].getAttribute("value");
					threadListString = threadListString + "" + threadcheckboxes[i].getAttribute("value") + ",";
				}
			}
		
			threadListString = threadListString.substring(0,threadListString.length-1)

			var RequestVars = getRequestVars();
			var cur_course_id = RequestVars["course_id"];
			var cur_conf_id = RequestVars["conf_id"];
			var cur_forum_id = RequestVars["forum_id"];
			
			if (threadList.length==0)
			{
				alert("Please use tick checkbox next to the thread title to include the thread in the SNA analysis.");
			}
			else
			{
				var contentbody = "<body onload=\"BBMultiForumMiner('" + cur_forum_id + "','" + cur_conf_id + "','"+ cur_course_id + "','" + threadListString + "');\"></body>";
				build_SNAPPframe(contentbody,"contentPanel");
			}
		}

	}
	else if (currScript.indexOf("mod/forum/discuss.php")!==-1)
	{
    //alert("MOODLE");
		// Moodle Single Thread View
		//PerformSocialAnalysisMoodle();
		currLMS = "Moodle";
		
		if(document.getElementById("content")==null) 
    {
      //Moodle Version 2
      //alert("Moodle 2 Detected");
      PerformSocialAnalysisMoodle2();
      makeSNAInterface("#region-main");
    }
    else
    {
      //Moodle Pre version 2
      PerformSocialAnalysisMoodle();
      makeSNAInterface("#content");
    } 

		//scroll to where SNA Data is inserted
    //setTimeout('SetScrollPosition("SNAPP");',3);
	}
	else if (currScript.indexOf("mod/forum/view.php")!==-1)
	{
		// Moodle Forum View with links to multiple Thread Views
		// alert("Moodle Forum Multiple Threads to be mined!");
		var threadList=new Array();
		var	no_forumthreads = 0;
		var threadTables = jQuery(".forumheaderlist");

		var threadrows = threadTables[0].getElementsByTagName("tr");
		//alert(threadrows.length);
		for (i=1;i<threadrows.length;i++)
		{
			var threadcols = threadrows[i].getElementsByTagName("td");
			//alert(threadcols.length);
			var forumthread = threadcols[0].getElementsByTagName("a");
			var threadlink = forumthread[0].getAttribute("href");
			threadlink = threadlink.substring(threadlink.indexOf('=')+1,threadlink.length);
			//alert(threadlink);
			threadList[i-1] = threadlink;
			no_forumthreads += 1;
		}

		if (threadList.length>0)
		{
			MoodleMultiForumMiner(threadList);
		}
		else
		{
			alert("No forum threads have been added.");
		}
	}
	else if (currScript.indexOf("discussions/messageLists/message_list_gridstyle.d2l")!==-1)
  {
    if (jQuery(jQuery('select')[0]).val()==1) //jQuery('#z_h').val()
    {
      // D2L Single Thread View
      //alert("YAY D2L-GridStyle");
      currLMS = "D2L";
      /*
      PerformSocialAnalysisD2L();
      makeSNAInterface("#d2l_body");
      */
      //scroll to where SNA Data is inserted
      //setTimeout('SetScrollPosition("SNAPP");',3);
      
            var threadList=new Array();
      var threadListString = "";
      var threadParentString = "";
      var linktypeListString = "";
      
      var RequestVars = getRequestVars();
      var ou = RequestVars["ou"];
      var fid = RequestVars["fid"];
      var tid = RequestVars["tid"];
      
      threadParentString = tid;
      threadListString = fid;
      // p = param built link, l = full link
      linktypeListString = "p";
      
      var contentbody = "<body onload=\"D2LMultiForumMiner('" + ou + "','" + threadListString + "','" + threadParentString + "','" + linktypeListString + "');\"></body>";
      build_SNAPPframe(contentbody,"d_content");
      
    }
    else
    {
      alert("SNAPP requires messages to be threaded. Please change the view to 'Threaded', click on the Apply button and trigger SNAPP again.");
    }
  }
  else if (currScript.indexOf("discussions/messageLists/message_list_readingstyle.d2l")!==-1)
  {
    
    //alert("D2L - Reading Style");
	  //alert("jQuery('#z_g').val():" + jQuery('#z_g').val())
    if (jQuery(jQuery('select')[0]).val()==1) //jQuery('#z_g').val()  // used to be #z_e or used to be #z_h
    {
      // D2L Single Thread View

      //alert("YAY D2L - Reading Style");
      currLMS = "D2L";
      
      var threadList=new Array();
      var threadListString = "";
      var threadParentString = "";
      var linktypeListString = "";
      
      var RequestVars = getRequestVars();
      var ou = RequestVars["ou"];
      var fid = RequestVars["fid"];
      var tid = RequestVars["tid"];
      
      threadParentString = tid;
      threadListString = fid;
      // p = param built link, l = full link
      linktypeListString = "p";

      var contentbody = "<body onload=\"D2LMultiForumMiner('" + ou + "','" + threadListString + "','" + threadParentString + "','" + linktypeListString + "');\"></body>";
      build_SNAPPframe(contentbody,"d_content");
    }
    else
    {
      alert("SNAPP requires messages to be threaded. Please change the view to 'Threaded', click on the Apply button and trigger SNAPP again.");
    }
  }
  else if (currScript.indexOf("discussions/admin/forum_topics_list.d2l")!==-1)
  {
    //alert("D2L Multiple Forum");
    // D2L Multi Forum Display Need to extract forum interactions from mutiple forums
    var threadList=new Array();
    var threadListString = "";
    var threadParentString = "";
    var linktypeListString = "";
    var no_forumthreads = 0;
    var threadTable = document.getElementById("z_e");
    var threadrows = threadTable.getElementsByTagName("tr");
    //alert(threadrows.length);
    for (i=2;i<threadrows.length;i++)
    {
      var threadcols = threadrows[i].getElementsByTagName("th");// used to be td for D2L version 8
      //alert(threadcols.length);
      //alert(threadcols[0].style.paddingLeft);
      //alert(threadcols.length);
      if (threadcols[0].style.paddingLeft=="1.8em")
      {
        var forumthread = threadcols[0].getElementsByTagName("a");
        //var threadlink = getTextBetweenCharacters(forumthread[0].getAttribute("onclick"), "('", "')")
        var tmplink = forumthread[0].getAttribute("onclick");
        var threadlink = tmplink.substring(14,tmplink.length);
        threadlink = threadlink.substring(0,threadlink.indexOf(")")-6);
        //alert("threadlink: " + threadlink);
        threadList[no_forumthreads] = threadlink;
        threadparent = threadlink.split(",")[1];
        threadid = threadlink.split(",")[0];
        //alert("threadparent: " + threadparent + " threadid: " + threadid);
        threadParentString = threadParentString + threadparent + ",";
        threadListString = threadListString + threadid + ",";
        // p = param built link, l = full link
        linktypeListString = linktypeListString + "p" + ",";
        no_forumthreads += 1;
      }
    }
    threadParentString = threadParentString.substring(0,threadParentString.length-1);
    threadListString = threadListString.substring(0,threadListString.length-1);
    linktypeListString = linktypeListString.substring(0,linktypeListString.length-1);
    //alert("threadParentString: " + threadParentString);
    //alert("threadListString: " + threadListString);
    var RequestVars = getRequestVars();
    var ou = RequestVars["ou"];
    if (threadList.length>0)
    {
        var contentbody = "<body onload=\"D2LMultiForumMiner('" + ou + "','" + threadListString + "','" + threadParentString + "','" + linktypeListString + "');\"></body>";
        build_SNAPPframe(contentbody,"d2l_body");
    }
    else
    {
      alert("No topics have been added.");
    }
  }
  else if (currScript.indexOf("discussionHomepageView.dowebct")!==-1)
  {
    // Triggered from forum list display in webct
    // Need to extract data from multiple threads
    //alert("WebCT Forum Multiple Threads to be mined!");
    var threadList=new Array();
    var no_forumthreads = 0;
    var threadTables = document.getElementsByTagName("table");
    
    for (j=0;j<threadTables.length;j++)
    {
      if (threadTables[j].getAttribute("class")=="discussioncategory")
      {
        var threadrows = threadTables[j].getElementsByTagName("tr");
        for (i=1;i<threadrows.length;i++)
        {
          var threadcheckbox = threadrows[i].getElementsByTagName("input");

          if (threadcheckbox[0].checked)
          {
            var threadcols = threadrows[i].getElementsByTagName("td");
            //alert(threadcols.length);
            var forumthread = threadcols[3].getElementsByTagName("a");
            var threadlink = getTextBetweenCharacters(forumthread[0].getAttribute("href"), "('", "')")
            //alert(forumthread[0]);
            if (threadlink.indexOf("newMessageThread.dowebct")!=-1)
            {
              threadList[no_forumthreads] = threadlink;
              no_forumthreads += 1;
            }
            else
            {
              alert("A blog/journal has been selected. SNAPP is unable to process blog/journals.");
            }
          }
        }
      }
    }
    //alert(threadList.length);
    if (threadList.length>0)
    {
      WebCTMultiForumMiner(threadList);
    }
    else
    {
      alert("No forum topics have been selected. Please tick the checkboxes of the forum topics you wish to include.");
    }
  }
	else
	{
		// WebCT Vista
		//alert("YAY WEBCT");
		currLMS = "WebCT";
		PerformSocialAnalysisWebCT();
		makeSNAInterface("body");
		//scroll to where SNA Data is inserted
  	//setTimeout('SetScrollPosition("SNAPP");',3);
	}
}

function loadCSS(filename)
{
  var fileref=document.createElement("link");
  fileref.setAttribute("rel", "stylesheet");
  fileref.setAttribute("type", "text/css");
  fileref.setAttribute("href", filename);
  document.getElementsByTagName("head")[0].appendChild(fileref);
}

// Called when all scripts have finished loading.
function jsLoadComplete() 
{
   jQuery.noConflict();
  for (i=0; i<cssList.length;i++)
  {
    loadCSS(serverPath + cssList[i]);
  }
  runSNA();
  /*
  try{
    runSNA();
  }
  catch(e){
    alert('An error has occurred: '+e.message)
  }
	*/
}

function loadAllLibs()
{
	var curLMS = determineCurrentLMS();
	//alert("loadsna - " + curLMS);
	jsList.push("lms/snapp_" + curLMS + ".js?uniqueCache=" + (new Date()).getTime());
	var scripts = eval("[" + build_codeList(serverPath,jsList,jsIEList,"inline") + "]");
	LazyLoad.loadOnce(scripts, jsLoadComplete);
}

var html_doc2 = document.getElementsByTagName('head')[0];
var script2 = document.createElement('script');
script2.setAttribute("type", "text/javascript");
script2.setAttribute("src", serverPath + "js/lazyload-min.js?uniqueCache=" + (new Date()).getTime());
script2.onreadystatechange = function()
{
  if (event.srcElement.readyState == "complete" || event.srcElement.readyState == "loaded")
  {
      loadAllLibs();
  }
}; 
script2.onload = function () {
      loadAllLibs();
}
html_doc2.appendChild(script2);