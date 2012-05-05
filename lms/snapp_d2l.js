
function PerformSocialAnalysisD2L_ReadingStyle()
{
	// alert("PerformSocialAnalysisD2L_ReadingStyle() called!");
	
  var indentMarginChange = parseFloat(2.7);
  //var readingStyleTables = jQuery("#d2l_form > table");
  var readingstyleForm = document.getElementById("d2l_form");
  var readingStyleTables = readingstyleForm.getElementsByTagName("table");//jQuery("#d2l_form > table");
  //alert(readingStyleTables.length);
  
  for (i=1;i<readingStyleTables.length;i++)
  {
    //alert(readingStyleTables[i].id);
    var tb_id = readingStyleTables[i].id;
    var indent_margin = readingStyleTables[i].style.marginLeft;
    indent_margin = parseFloat(indent_margin.substring(0,indent_margin.length-2));
    if (tb_id.indexOf("z_")!=-1)
    {
      
      //alert(tb_id + ":" + indent_margin);
      //alert(readingStyleTables[i].innerHTML);
      var posted_by = jQuery("a[id^='LINK_Author_']", readingStyleTables[i]).text();
      var posted_on = jQuery("div[id^='SPACE_author_'] > label", readingStyleTables[i]).text();
      startpos = posted_on.lastIndexOf("-") + 1;
      endpos = posted_on.lastIndexOf("&") - 1;
      posted_on = trim(posted_on.substring(startpos,posted_on.length-1));
      //alert(posted_on + "|");
      //alert(tb_id + " : " + posted_by + readingStyleTables[i].style.marginLeft);
      //var post_id = jQuery("a[id^='LINK_Author_']", readingStyleTables[i]);
      //var postid = post_id[0].id;
      //postid = postid.substr(postid.lastIndexOf("_")+1,postid.length)
      if (posted_by != "")
      {
          // if not blank
            
          if (forumusers[posted_by]) 
          {
            forumusers[posted_by] = forumusers[posted_by] + 1;
          }
          else 
          {
            forumusers[posted_by] = 1;
          }
        
          var margin_indent = (indent_margin/indentMarginChange).toFixed();   
        
          //alert(posted_by + " :" + margin_indent);
        
          threadowners[margin_indent] = posted_by;
    
          if (margin_indent==0)
          {
            reply_to = "-";
          }
          else 
          {
            //alert("Prev: " + (margin_indent - indentMarginChange).toFixed(1));
            //reply_to = threadowners[(margin_indent - indentMarginChange).toFixed(1)];
            reply_to = threadowners[(margin_indent - 1)];
            sna_relationship = posted_by + "_" + reply_to;
            //alert(sna_relationship);
            if (replies[sna_relationship])
            {
              replies[sna_relationship] += 1;
            }
            else
            {
              replies[sna_relationship] = 1;
            }
          }
          
          totalposts = totalposts + 1;
	  
	      alert(posted_by + " " + reply_to + " " + posted_on);
          AddPost(posted_by, reply_to, posted_on, 1, "D2L");
        
          // end of if not blank
      }

    }
  }
}

function PerformSocialAnalysisD2L()
{
  
  //alert("PerformSocialAnalysisD2L() called!");
  
  // Extract SNA Data
  var author_col = 5; // column 5 contains the post author by default

  var currRoot = "";
  var threaddepth = 1;
  
  //var x=document.getElementsByTagName("table");
    //alert(x.length);
  //alert("Here 1!");
  //var tble = jQuery("#z_o");// #z_p//document.getElementById("z_p"); //document.getElementsByTagName("table")[0];//document.getElementById("datatable");
  //var alltbl = $("table");

  var notables = jQuery("table");
//alert(notables.length);
  var tble = jQuery("table")[4];
  
      if (notables.length==11)
	{
		// Search bar is enabled
		tble = jQuery("table")[8];
	}

  //alert(tble.innerHTML);
  var rows = jQuery("tr",tble);//table.tBodies[0].rows;
  //alert("Pre Loop");
  //alert("rows.length: " + rows.length);
  for(i = 4; i < rows.length-2; i++) //forum threads start at row 4
  {
    //alert("in loop!");
    //var cols = table.tBodies[0].rows[i].cells; //rows[i].getElementsByTagName("td");
    //var rowtext = "--";
    //alert("row[i]: " +  rows[i].innerHTML)
    var cols = jQuery("td",rows[i]);//rows[i].getElementsByTagName("td");
    
    var allimgs = jQuery("img",rows[i]);//rows[i].getElementsByTagName("img");
    var expandedimg_exists = 0;
    var indentedimg_count = 0;
    //alert("allimgs.length: " + allimgs.length + ": cols.length" + cols.length);
    var allimgsfortest = "";
    for (var imgcount=0; imgcount<allimgs.length ; imgcount++)
    {
      //alert(imgs[i].src);
      //allimgsfortest = allimgsfortest + allimgs[imgcount].src + " | ";
      
      var imgfile = allimgs[imgcount].src;
	    //alert(imgfile);
      if (imgfile.indexOf("actCollapse.gif")!=-1) //. ///d2l/img/27698.gif
      {
        expandedimg_exists = 1;
      }
      else if(imgfile.indexOf("/d2l/img/LP/pixel.gif")!=-1)
      {
        indentedimg_count = indentedimg_count + 1;
      }
    }   
    //alert(allimgsfortest);
    /*
    if (expandedimg_exists==1)
    {
      alert("A parent...");
      currRoot = 1 + indentedimg_count;
    }
    */
    threaddepth = expandedimg_exists + indentedimg_count;
    //alert(cols.length);
      datecol = cols.length - 1;
      postbycol = cols.length - 2;
      if (stripHTML(cols[datecol].innerHTML).indexOf('rating')>0)
	{
		datecol = datecol - 1;
		postbycol = datecol - 1;
	}
    for (j = 0; j < cols.length; j++)
    {
      //alert("in second loop: " + j);
      if (j == 0) {
        inputtag = jQuery("input",cols[j]);//cols[j].getElementsByTagName("input");
        
        postid = inputtag[0].getAttribute("value");
        //alert(postid);
        underscore_pos = postid.indexOf("_") + 1;
        postid = postid.substring(underscore_pos,postid.length);
        
      }

      if (j == (postbycol))
      {
        posted_by = cols[j].innerHTML;
        posted_by = stripHTML(posted_by);
        if (forumusers[posted_by]) {
          forumusers[posted_by] = forumusers[posted_by] + 1;
        }
        else {
          forumusers[posted_by] = 1;
        }
      }
      if (j == (datecol)) 
      {
        posted_on = stripHTML(cols[j].innerHTML);
        //alert(posted_on);
      }
    }
    
    //alert("posted_on:" + posted_on + " posted_by:" + posted_by);
    //alert("posted_by:" + posted_by);
    //alert("postid:" + postid);
    //alert(currRoot+"_"+threaddepth + " " + posted_by);
    
    threadowners[threaddepth] = posted_by;

    if (threaddepth==1)
    {
      reply_to = "-";
    }
    else 
    {
      reply_to = threadowners[parseInt(threaddepth)-1];
      sna_relationship = posted_by + "_" + reply_to;
      //alert(sna_relationship);
      if (replies[sna_relationship])
      {
        replies[sna_relationship] += 1;
      }
      else
      {
        replies[sna_relationship] = 1;
      }
    }
      
    totalposts = totalposts + 1;
    
    //alert(posted_by + " " + reply_to + " " + posted_on);
    AddPost(posted_by, reply_to, posted_on, 1, "D2L");
  }
   //alert(forumPostDataStructure);
}

// D2L Multiple Thread Miner

var globalD2LTopicList = new Array();
var globalD2LParentTopicList = new Array();
var globalD2LLinkTypeList = new Array();
var globalD2LCurrentTopicIndex = 0;
var D2L_ou;

var globalD2LSubPageList = new Array();
var globalD2LSubPageListIndex = 0;

function D2LMultiForumMiner(ou, topicList, topicParentList, linktypeList)
{
  //alert("D2LMultiForumMiner called");
	
  //alert("topicList: " + topicList);
  //alert("topicParentList: " + topicParentList);
  // Make temp div to inject the forum thread HTML
  BuildTEMPThreadHolder = "";
  BuildTEMPThreadHolder = BuildTEMPThreadHolder + '<div id="SNAPPTemp">';
  BuildTEMPThreadHolder = BuildTEMPThreadHolder + '<H1>Please wait, SNAPP is extracting Social Graph data...';
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
  
  var threadList = topicList.split(",");
  for (i=0; i<threadList.length; i++)
  {
    globalD2LTopicList[i] = threadList[i];
  }
  
  var parentList = topicParentList.split(",");
  for (i=0; i<parentList.length; i++)
  {
    globalD2LParentTopicList[i] = parentList[i];
  }
  
  var linkList = linktypeList.split(",");
  for (i=0; i<linkList.length; i++)
  {
    globalD2LLinkTypeList[i] = linkList[i];
  }
  
  D2L_ou = ou;

  retrieveD2LForumThread();
  //retrieveD2LForumPageThread();
  //D2LMultiForumMinerCompleted();
  
}

//globalD2LSubPageList[globalD2LSubPageList.length] =  fullpage_lnk;

function retrieveD2LForumThread()
{
	//for (i=0;i<globalD2LTopicList.length;i++)
	//{
		var fid = globalD2LTopicList[globalD2LCurrentTopicIndex];
		var tid = globalD2LParentTopicList[globalD2LCurrentTopicIndex];
		threadURL = "/d2l/lms/discussions/messageLists/message_list_gridstyle.d2l?ou=" + D2L_ou + "&fid=" + fid + "&tid=" + tid + "&d2l_body_type=4";

		  var html = jQuery.ajax({url: threadURL,success: function(html)
				   {
					//alert("AJAX SUCCESS!");
					   //alert(jQuery("#z_p", html));
					var posDiv = html.indexOf('<div id="d_content">');
					var posEnd = html.lastIndexOf('<div class="clear"></div>');
					var newHTML = html.substring(posDiv, posEnd);
				        jQuery("#SNAPPTempContainer").html(newHTML); //# d_content_r_pjQuery("#z_p", html)
				      
				      // Get extra pages
				      //var formpost_obj = jQuery("#d2l_form", html);
					if (globalD2LLinkTypeList[globalD2LCurrentTopicIndex] == "p")
					{
					  var pagedropdown = jQuery("select")[1];
					  var pagedropdownID = jQuery(pagedropdown).attr("id")
					  var opts = jQuery("#" + pagedropdownID + " option");//var opts = jQuery("#z_hv option"); //z_ga z_ds
					  //alert("opts.length:" + opts.length);
					  var page_lnks = new Array();
					  for (m=0;m<opts.length;m++)
					  {
					    page_lnks[m] = opts[m].value;
					    //alert("Opts:" + opts[m].value);
					  }
					  // get no of records per page
					  var recsperdropdown = jQuery("select")[2]
					  var recsperpage = jQuery(recsperdropdown).val();
					  // find d2l_statePageId dynamically as this seems to change
					  //var statePageIdObj = jQuery("#d2l_form");
					  //var statePageId = jQuery(statePageIdObj).attr("action");
					  var fullpage_lnk;
					  if (page_lnks.length>1)
					  {
					    // There are page links 
					    //var formpost_data = formpost_obj.attr("action");
					    //alert(formpost_data);
					    for (m=1;m<page_lnks.length;m++)
					    {
					      //fullpage_lnk = "/d2l/lms/discussions/messageLists/message_list_gridstyle.d2l?ou=" + D2L_ou + "&fid=" + fid + "&tid=" + tid + "&d2l_body_type=4&d2l_stateScopes=%7b3%3a%5b'grid'%2c'pagesize'%2c'htmleditor'%2c'hpg'%5d%2c1%3a%5b'pagenum'%5d%2c2%3a%5b'lcs'%5d%7d&d2l_stateGroups=%5b'filterbygroup'%2c'grid'%2c'gridpagenum'%5d&d2l_statePageId=100&d2l_state_filterbygroup=%7b'Name'%3a'filterbygroup'%2c'Controls'%3a%5b%7b'ControlId'%3a%7b'ID'%3a'sl_filtertype'%7d%2c'StateType'%3a''%2c'Key'%3a''%2c'Name'%3a'SL_filterType'%2c'State'%3a%7b'SelectedKey'%3a'1'%2c'SelectedVal'%3a'1'%7d%7d%5d%7d&d2l_state_grid=%7b'Name'%3a'grid'%2c'Controls'%3a%5b%7b'ControlId'%3a%7b'ID'%3a'grid_messages'%7d%2c'StateType'%3a''%2c'Key'%3a''%2c'Name'%3a'GRID_messages'%2c'State'%3a%7b'PageSize'%3a10%2c'SortField'%3a'ThreadId'%2c'SortDir'%3a0%7d%7d%5d%7d&d2l_state_gridpagenum=%7b'Name'%3a'gridpagenum'%2c'Controls'%3a%5b%7b'ControlId'%3a%7b'ID'%3a'grid_messages'%7d%2c'StateType'%3a'pagenum'%2c'Key'%3a''%2c'Name'%3a'GRID_messages'%2c'State'%3a%7b'PageNum'%3a" + page_lnks[m] + "%7d%7d%5d%7d&d2l_change=1";
					      fullpage_lnk = "/d2l/lms/discussions/messageLists/message_list_gridstyle.d2l?ou=" + D2L_ou + "&fid=" + fid + "&tid=" + tid + "&d2l_body_type=4&d2l_stateScopes={3:['grid','pagesize','htmleditor','hpg'],1:['pagenum'],2:['lcs']}&d2l_stateGroups=['filterbygroup','grid','gridpagenum']&d2l_statePageId=511&d2l_state_filterbygroup={'Name':'filterbygroup','Controls':[{'ControlId':{'ID':'sl_filtertype'},'StateType':'','Key':'','Name':'SL_filterType','State':{'SelectedKey':'1','SelectedVal':'1'}}]}&d2l_state_grid={'Name':'grid','Controls':[{'ControlId':{'ID':'grid_messages'},'StateType':'','Key':'','Name':'GRID_messages','State':{'PageSize':" + recsperpage + ",'SortField':'ThreadId','SortDir':0}}]}&d2l_state_gridpagenum={'Name':'gridpagenum','Controls':[{'ControlId':{'ID':'grid_messages'},'StateType':'pagenum','Key':'','Name':'GRID_messages','State':{'PageNum':'" + page_lnks[m] + "'}}]}&d2l_change=0";
					      //alert(fullpage_lnk);
					      // Increment globalD2LCurrentTopicIndex
					      // globalD2LTopicList = globalD2LTopicList + 1;
					      // Add link to globalD2LTopicList
					      //globalD2LTopicList[globalD2LTopicList.length] = fullpage_lnk;
					       globalD2LSubPageList[globalD2LSubPageList.length] =  fullpage_lnk;
					      // Set linktype to l
					      //globalD2LLinkTypeList[globalD2LTopicList.length] = "l";
					    } 
					  }
					}
				     
				      // Perform SNA
				      PerformSocialAnalysisD2L();
				      globalD2LCurrentTopicIndex = globalD2LCurrentTopicIndex + 1;
					
				      if (globalD2LCurrentTopicIndex<globalD2LTopicList.length) //
					{
						retrieveD2LForumThread();
						//alert("forumPostDataStructure: " + forumPostDataStructure);
					}
				      else
					{
						//alert("D2LMultiForumMinerCompleted() called!");
						retrieveD2LForumPageThread();
					}
				   }
			});
	//}
	//retrieveD2LForumPageThread();
	//D2LMultiForumMinerCompleted();
}

function retrieveD2LForumPageThread()
{
	//alert("retrieveD2LForumPageThread called");
	//for (i=0;i<globalD2LSubPageList.length;i++)
	//{
		//alert("stored link");
		threadURL = globalD2LSubPageList[globalD2LSubPageListIndex];
		//alert(threadURL);

		var html = jQuery.ajax({url: threadURL,async: false,success: function(html)
                   {
		      //alert("ajax call sucess!");
		      var posDiv = html.indexOf('<div id="d_content">');
		      var posEnd = html.lastIndexOf('<div class="clear"></div>');
		      var newHTML = html.substring(posDiv, posEnd);
		      //alert(newHTML);
			  
                      //jQuery("#SNAPPTempContainer").html(htmlres); //# d_content_r_pjQuery("#z_p", html) 
		      jQuery("#SNAPPTempContainer").html(newHTML);
		      //document.getElementById("SNAPPTempContainer").appendChild(newHTML);
		      //alert(document.getElementById("SNAPPTempContainer"));
			   
                      // Perform SNA
                      PerformSocialAnalysisD2L();
                      globalD2LSubPageListIndex = globalD2LSubPageListIndex + 1;
			   
					if (globalD2LSubPageListIndex<globalD2LSubPageList.length) 
					{
						//alert("in first if");
						retrieveD2LForumPageThread();
						//alert("forumPostDataStructure: " + forumPostDataStructure);
					}
				      else
					{
						//alert("time to call D2LMultiForumMinerCompleted() called!");
						D2LMultiForumMinerCompleted();
					}
					
			 
                   }
		});
}


function D2LMultiForumMinerCompleted()
{
      //alert("D2LMultiForumMinerCompleted called");
      //alert("caller is " + arguments.callee.caller.toString());
      jQuery("#SNAPPTempContainer").html("");
      jQuery("#SNAPPLoading").html("");
      // Display the interface
      makeSNAInterface("body");
      //scroll to where SNA Data is inserted
      setTimeout('SetScrollPosition("SNAPP");',3);
}

/*


function retrieveD2LForumThread()
{
//alert("retrieveD2LForumThread()");
  if (globalD2LLinkTypeList[globalD2LCurrentTopicIndex] == "p")
  {
    // ie params - then construct a link
      //alert("params constructed link");
      var fid = globalD2LTopicList[globalD2LCurrentTopicIndex];
      var tid = globalD2LParentTopicList[globalD2LCurrentTopicIndex];
      threadURL = "/d2l/lms/discussions/messageLists/message_list_gridstyle.d2l?ou=" + D2L_ou + "&fid=" + fid + "&tid=" + tid + "&d2l_body_type=4";
      
      //threadURL = "/d2l/lms/discussions/messageLists/message_list_gridstyle.d2l?ou=" + D2L_ou + "&fid=" + fid + "&tid=" + tid + "&d2l_body_type=1&filter=1";
      //alert(threadURL);
  }
  else
  {
    //alert("stored link");
    threadURL = globalD2LTopicList[globalD2LCurrentTopicIndex];
    //alert(threadURL);
  }

//alert(threadURL);
  var html = jQuery.ajax({url: threadURL,
              success: function(html)
                   {
			//alert("AJAX SUCCESS!");
			   //alert(jQuery("#z_p", html));
                      jQuery("#SNAPPTempContainer").html(html); //# d_content_r_pjQuery("#z_p", html)
                      
                      // Get extra pages
                      //var formpost_obj = jQuery("#d2l_form", html);
                        if (globalD2LLinkTypeList[globalD2LCurrentTopicIndex] == "p")
                        {
			  var pagedropdown = jQuery("select")[1];
			  var pagedropdownID = jQuery(pagedropdown).attr("id")
                          var opts = jQuery("#" + pagedropdownID + " option");//var opts = jQuery("#z_hv option"); //z_ga z_ds
                          //alert("opts.length:" + opts.length);
                          var page_lnks = new Array();
                          for (m=0;m<opts.length;m++)
                          {
                            page_lnks[m] = opts[m].value;
                            //alert("Opts:" + opts[m].value);
                          }
            
                          var fullpage_lnk;
                          if (page_lnks.length>1)
                          {
                            // There are page links 
                            //var formpost_data = formpost_obj.attr("action");
                            //alert(formpost_data);
                            for (m=1;m<page_lnks.length;m++)
                            {
                              fullpage_lnk = "/d2l/lms/discussions/messageLists/message_list_gridstyle.d2l?ou=" + D2L_ou + "&fid=" + fid + "&tid=" + tid + "&d2l_body_type=4&d2l_stateScopes=%7b3%3a%5b'grid'%2c'pagesize'%2c'htmleditor'%2c'hpg'%5d%2c1%3a%5b'pagenum'%5d%2c2%3a%5b'lcs'%5d%7d&d2l_stateGroups=%5b'filterbygroup'%2c'grid'%2c'gridpagenum'%5d&d2l_statePageId=100&d2l_state_filterbygroup=%7b'Name'%3a'filterbygroup'%2c'Controls'%3a%5b%7b'ControlId'%3a%7b'ID'%3a'sl_filtertype'%7d%2c'StateType'%3a''%2c'Key'%3a''%2c'Name'%3a'SL_filterType'%2c'State'%3a%7b'SelectedKey'%3a'1'%2c'SelectedVal'%3a'1'%7d%7d%5d%7d&d2l_state_grid=%7b'Name'%3a'grid'%2c'Controls'%3a%5b%7b'ControlId'%3a%7b'ID'%3a'grid_messages'%7d%2c'StateType'%3a''%2c'Key'%3a''%2c'Name'%3a'GRID_messages'%2c'State'%3a%7b'PageSize'%3a10%2c'SortField'%3a'ThreadId'%2c'SortDir'%3a0%7d%7d%5d%7d&d2l_state_gridpagenum=%7b'Name'%3a'gridpagenum'%2c'Controls'%3a%5b%7b'ControlId'%3a%7b'ID'%3a'grid_messages'%7d%2c'StateType'%3a'pagenum'%2c'Key'%3a''%2c'Name'%3a'GRID_messages'%2c'State'%3a%7b'PageNum'%3a" + page_lnks[m] + "%7d%7d%5d%7d&d2l_change=1";
                              //alert(fullpage_lnk);
                              // Increment globalD2LCurrentTopicIndex
                              // globalD2LTopicList = globalD2LTopicList + 1;
                              // Add link to globalD2LTopicList
                              //globalD2LTopicList[globalD2LTopicList.length] = fullpage_lnk;
			       globalD2LSubPageList[globalD2LSubPageList.length] =  fullpage_lnk;
                              // Set linktype to l
                              //globalD2LLinkTypeList[globalD2LTopicList.length] = "l";
                            } 
                          }
                        }
                     
                      // Perform SNA
                      PerformSocialAnalysisD2L();
                      globalD2LCurrentTopicIndex = globalD2LCurrentTopicIndex + 1;
                      //alert("globalD2LCurrentTopicIndex! " + globalD2LCurrentTopicIndex + "globalD2LTopicList.length :" + globalD2LTopicList.length);
                      if (globalD2LCurrentTopicIndex<globalD2LTopicList.length) //
                      {
                        retrieveD2LForumThread();
                        //alert("forumPostDataStructure: " + forumPostDataStructure);
                      }
                      else
                      {
                        //alert("D2LMultiForumMinerCompleted() called!");
                        D2LMultiForumMinerCompleted();
                      }
                   }
        });
	
}

*/