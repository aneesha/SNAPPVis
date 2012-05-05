var serverPath = "http://www.snappvis.org/SNAPP2/";
var foundLMSForum = "No";
var foundLMSForumExpanded = "No";
var LMS ="";

function attachScript(html_doc, script)
{
      script.setAttribute("type", "text/javascript");
			script.setAttribute("src", serverPath + "loadsna.js?uniqueCache=" + (new Date()).getTime() + "&serverPath=" + serverPath + "&LMS=" + LMS);
			html_doc.appendChild(script);
}

function traverse(w)
{
  try
  {
  	if (w.frames.length == 0) {
		// Forum page from Moodle found - Moodle does not use frames
		var docLocation = document.location.href;
    var html_doc = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
		if ((docLocation.indexOf("mod/forum/discuss.php") != -1) || (docLocation.indexOf("mod/forum/view.php") != -1)) 
		{
    //alert("Moodle");
			// Moodle Individual Thread View && Moodle Forum View with links to Multiple Threads
			foundLMSForum = "Yes"; foundLMSForumExpanded = "Yes"; LMS = "moodle";
      attachScript(html_doc, script);
		}
		else if (docLocation.indexOf("discussions/admin/forum_topics_list.d2l") != -1)
      {
        // D2L Multi Forum Thread - For D2L Version 9
        foundLMSForum = "Yes"; foundLMSForumExpanded = "Yes"; LMS = "d2l";
        //alert("D2L Multiple Forum Found D2L 9");
        attachScript(html_doc, script);
      }
	}
	else {
		for (var i = 0; i < w.frames.length; i++) {
			var docLocation = w.frames[i].document.location.href;
      var html_doc = w.frames[i].document.getElementsByTagName('head')[0];
      var script = w.frames[i].document.createElement('script');
			if (((docLocation.indexOf("webct/newMessageThread.dowebct") != -1)|| (docLocation.indexOf("/discussionHomepageView.dowebct") != -1) || (docLocation.indexOf("serve_bulletin") != -1))) // ACTION=DESIGN_LIST or LIST for older version of Web CT
			{
        //alert("sna_bookmarklet: WebCT");
        foundLMSForum = "Yes"; foundLMSForumExpanded = "Yes"; LMS = "webct";
        //alert("LMS: " + LMS);
				if (typeof w.frames[i].getSNAPPVersion == 'function')
				{
					//re-run snapp
					w.frames[i].resetSNAPP();
				}
				else
        {
          attachScript(html_doc, script);
				}

			}
			else if ((docLocation.indexOf("do/message?action=list_messages") != -1) || (docLocation.indexOf("do/forum?action=list_threads") != -1) || (docLocation.indexOf("discussionboard/do/conference") != -1) || (docLocation.indexOf("discussionboard/do/message") != -1)) 
			{
				foundLMSForum = "Yes"; foundLMSForumExpanded = "Yes"; LMS = "blackboard";
				// embed SNA Analysis script in this window
				// either individual thread or multiple threads from list_forum
				if (typeof w.frames[i].getSNAPPVersion == 'function') {
					//re-run snapp
					w.frames[i].resetSNAPP();
				}
				else {
					attachScript(html_doc, script);
				}	
			}
			else if ((docLocation.indexOf("Objects/DiscussionForums/Threads2.aspx") != -1)) 
			{
				foundLMSForum = "Yes"; foundLMSForumExpanded = "Yes"; LMS = "angel";
				//alert("ANGEL!");
				
				// embed SNA Analysis script in this window
				// either individual thread or multiple threads from list_forum
				if (typeof w.frames[i].getSNAPPVersion == 'function') {
					//re-run snapp
					w.frames[i].resetSNAPP();
				}
				else {
					attachScript(html_doc, script);
				}
								
			}
			else if ((docLocation.indexOf("newMessageThread.dowebct") != -1)) {
						// forum displayed but not expanded
						foundLMSForum = "Yes"; foundLMSForumExpanded = "No"; LMS = "webct";
			}
			else if ((docLocation.indexOf("do/forum?action=list_threads") != -1)) {
							// forum displayed but not expanded
							foundLMSForum = "Yes"; foundLMSForumExpanded = "No"; LMS = "blackboard";
			}
			else if ((docLocation.indexOf("discussions/messageLists/message_list_gridstyle.d2l") != -1)||(docLocation.indexOf("discussions/admin/forum_topics_list.d2l") != -1)||(docLocation.indexOf("discussions/messageLists/message_list_readingstyle.d2l") != -1))
      {
        // D2L Forum Thread
        foundLMSForum = "Yes"; foundLMSForumExpanded = "Yes"; LMS = "d2l";
        //alert("D2L Forum Found NOW");
        // embed SNA Analysis script in this window
        // either individual thread or multiple threads from list_forum
        if (typeof w.frames[i].getSNAPPVersion == 'function') {
          //re-run snapp
          w.frames[i].resetSNAPP();
        }
        else {
          // inject sna extraction
          attachScript(html_doc, script);
        } 
      }
			traverse(w.frames[i]);
		}
	}
  }
  catch(e)
  {
      /* Maybe access violation from cross frame scripting - Don't need to do anything as this will not be the embedded forum! */
      //alert("An exception occurred in the SNA Script. Error name: " + e.name + ". Error message: " + e.message);
  }
}

traverse(window);

if (foundLMSForum=="No")
{
  alert("SNAPP is either unable to determine the LMS you are using or you are trying to analyse a page that does not contain a forum. SNAPP works with WebCT Vista, WebCT CE, Blackboard (versions 7, 8 and 9) and Moodle.");
}
else
{
  if (foundLMSForumExpanded=="No")
  {
	  if (LMS=="webct")
	  {
	    alert("You are trying to analyse a forum that has not been expanded. The SNA Analysis tool requires that the Expand All button be clicked, before the SNA data can be extracted.");
	  }
	  else if (LMS=="blackboard")
	  {
	  	alert("The SNA Analysis tool requires that you view the forum thread, before the SNA data can be extracted in Blackboard.");
	  }
  }
}