
function PerformSocialAnalysisMoodle()
{
  allForumPostsTables = jQuery(".forumpost");
  
  for (i=0; i < allForumPostsTables.length; i++)
  {
    currentPost = allForumPostsTables[i];
    authorObj = jQuery(".author",currentPost);
    posted_by = authorObj[0].innerHTML;
    //alert("posted_by: " + posted_by);
    if (posted_by.indexOf('>')!=-1)
    {
    posted_by = posted_by.substring(posted_by.indexOf('>')+1,posted_by.length);
    posted_by = posted_by.substring(0,posted_by.indexOf('<'));
    }
    
    if (forumusers[posted_by])
    {
    forumusers[posted_by] = forumusers[posted_by] + 1;
    }
    else
    {
    forumusers[posted_by] = 1;
    }
    
    posted_on = jQuery(".author",currentPost).text();//authorObj[0].innerHTML;
    //posted_on = posted_on.substring(posted_on.lastIndexOf('-')+2,posted_on.length);
    //alert("postedon:" + posted_on);
    posted_on = posted_on.substring(posted_on.indexOf(',')+2,posted_on.length);
    //alert("postedby:" + posted_by);
    //alert("postedon:" + posted_on);
    
    commandsObj = jQuery(".commands",currentPost);
    commandLinkObj = jQuery("a",commandsObj[0]);
  // 'Edit' and 'Reply' link positions vary based on access rights
  // Find link with 'Edit' in text
    //alert(commandLinkObj[0])
  post_idLinkObj = jQuery('a[href*="reply="]',commandsObj[0]);//jQuery("a:contains('Reply')",commandsObj[0]);
  // Find link with 'Reply' in text
    //reply_idLinkObj = jQuery('a[href*="d="]',commandsObj[0]);//jQuery("a:contains('Show parent')",commandsObj[0]);
  reply_idLinkObj = jQuery('a[href*="discuss.php?d="]',commandsObj[0]);//jQuery("a:contains('Show parent')",commandsObj[0]);
    
    post_id = 0;
    reply_id = 0;
  
  post_id = post_idLinkObj[0].href
    post_id = post_id.substring(post_id.indexOf('=')+1,post_id.length);
  
  if (reply_idLinkObj.length==0)
  {
    reply_id = 0;
  }
  else
  {
    reply_id = reply_idLinkObj[0].href;
    //alert(reply_id);
      reply_id = reply_id.substring(reply_id.indexOf('#p')+2,reply_id.length); 
  }

    //alert(" posted_by:" + posted_by + " postid:" + post_id + " replyid:" + reply_id);
    
    threadowners[post_id] = posted_by;
    if (reply_id=="0")
    {
      reply_to = "-";
    }
    else 
    {
      reply_to = threadowners[reply_id];
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
    
    AddPost(posted_by, reply_to, posted_on, 1, "Moodle");
  }
}


function PerformSocialAnalysisMoodle2()
{
  allForumPostsTables = jQuery(".forumpost");
  
  for (i=0; i < allForumPostsTables.length; i++)
  {
    currentPost = allForumPostsTables[i];
    authorObj = jQuery(".author",currentPost)
    posted_by = authorObj[0].innerHTML;
    //alert("posted_by: " + posted_by);
    if (posted_by.indexOf('>')!=-1)
    {
    posted_by = posted_by.substring(posted_by.indexOf('>')+1,posted_by.length);
    posted_by = posted_by.substring(0,posted_by.indexOf('<'));
    }
    
    if (forumusers[posted_by])
    {
    forumusers[posted_by] = forumusers[posted_by] + 1;
    }
    else
    {
    forumusers[posted_by] = 1;
    }
    
    posted_on = authorObj[0].innerHTML;
    posted_on = posted_on.substring(posted_on.lastIndexOf('-')+2,posted_on.length);
    posted_on = posted_on.substring(posted_on.indexOf(',')+2,posted_on.length);
    if (document.documentElement.lang=="fr")
    {
		posted_on = ConvertMonth(posted_on);
    }
    //alert("postedby:" + posted_by);
    //alert("postedon:" + posted_on);
    
    commandsObj = jQuery(".commands",currentPost);
    commandLinkObj = jQuery("a",commandsObj[0]);
  // 'Edit' and 'Reply' link positions vary based on access rights
  // Find link with 'Edit' in text
    //alert(commandLinkObj[0])
  post_idLinkObj = jQuery('a[href*="reply="]',commandsObj[0]);//jQuery("a:contains('Reply')",commandsObj[0]);
  // Find link with 'Reply' in text
    //reply_idLinkObj = jQuery('a[href*="d="]',commandsObj[0]);//jQuery("a:contains('Show parent')",commandsObj[0]);
  reply_idLinkObj = jQuery('a[href*="discuss.php?d="]',commandsObj[0]);//jQuery("a:contains('Show parent')",commandsObj[0]);
    
    post_id = 0;
    reply_id = 0;
  
  post_id = post_idLinkObj[0].href
    post_id = post_id.substring(post_id.indexOf('=')+1,post_id.length);
  
  if (reply_idLinkObj.length==0)
  {
    reply_id = 0;
  }
  else
  {
    reply_id = reply_idLinkObj[0].href;
    //alert(reply_id);
      reply_id = reply_id.substring(reply_id.indexOf('#p')+2,reply_id.length); 
  }

    //alert(" posted_by:" + posted_by + " postid:" + post_id + " replyid:" + reply_id);
    
    threadowners[post_id] = posted_by;
    if (reply_id=="0")
    {
      reply_to = "-";
    }
    else 
    {
      reply_to = threadowners[reply_id];
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
    
    AddPost(posted_by, reply_to, posted_on, 1, "Moodle");
  }
}

// Moodle Multiple Thread Miner

var globalMoodleTopicList = new Array();
var globalMoodleCurrentTopicIndex = 0;

function MoodleMultiForumMiner(topicList)
{
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
	
	globalMoodleTopicList = topicList;

	retrieveMoodleForumThread();
}

function retrieveMoodleForumThread()
{
	threadURL = "discuss.php?d=" + globalMoodleTopicList[globalMoodleCurrentTopicIndex];
	var html = jQuery.ajax({url: threadURL,
							success: function(html)
									 {
									   //alert(html);
											jQuery("#SNAPPTempContainer").html(html);
											PerformSocialAnalysisMoodle();
											globalMoodleCurrentTopicIndex = globalMoodleCurrentTopicIndex + 1;
											if (globalMoodleCurrentTopicIndex<globalMoodleTopicList.length)
											{
												retrieveMoodleForumThread();
											}
											else
											{
												MoodleMultiForumMinerCompleted();
											}
									 }
				});
}

function MoodleMultiForumMinerCompleted()
{
			jQuery("#SNAPPTempContainer").html("");
			jQuery("#SNAPPLoading").html("");
			// Display the interface
			
	  if(document.getElementById("content")==null) 
    {
      //Moodle Version 2
      makeSNAInterface("#region-main");
    }
    else
    {
      //Moodle Pre version 2
      makeSNAInterface("#content");
    }
			
			//makeSNAInterface("body");
			//scroll to where SNA Data is inserted
			setTimeout('SetScrollPosition("SNAPP");',3);
}

function ConvertMonth(frdates)
{
/*
	var monthmap = new Array();

	monthmap["Janvier"] = "January";
	monthmap["FŽvrier"] = "February";
	monthmap["Mars"] = "March";
	monthmap["Avril"] = "April";
	monthmap["Mai"] = "May";
	monthmap["Juin"] = "June";
	monthmap["Juillet"] = "July";
	monthmap["Aožt"] = "August";
	monthmap["Septembre"] = "September";
	monthmap["Octobre"] = "October";
	monthmap["Novembre"] = "November";
	monthmap["DŽcembre"] = "December";

	if (frdates.indexOf("Janvier")>0)
	{
		
	}
*/

	frdates.replace("Janvier", "January");
	frdates.replace("FŽvrier", "February");
	frdates.replace("Mars", "March");
	frdates.replace("Avril", "April");
	frdates.replace("Mai", "May");
	frdates.replace("Juin", "June");
	frdates.replace("Juillet", "July");
	frdates.replace("Aožt", "August");
	frdates.replace("Septembre", "September");
	frdates.replace("Octobre", "October");
	frdates.replace("Novembre", "November");
	frdates.replace("DŽcembre", "December");


	return frdates;

}