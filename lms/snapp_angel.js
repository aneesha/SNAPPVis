
function PerformSocialAnalysisAngel()
{
	//alert("PerformSocialAnalysisAngel called");
	
	var threads = jQuery(".treeList li");
	
	for (i=0;i<threads.length;i++)
	{
		thread = threads[i];
		
		subjectdiv = jQuery(".subject",thread);
		//alert(subjectdiv.innerHTML);
		
		//alert(jQuery(subjectdiv).attr("postid"));
		
		post_id = jQuery(subjectdiv).attr("postid");
		parentpost = jQuery(subjectdiv).attr("parentpost");
		//alert(post_id + " " + parentpost)
		if (parentpost=="")
		{
			reply_id = 0;
		}
		else
		{
			reply_id = parentpost;
		}
		
		authorObj = jQuery(".author",thread);
		postdateObj = jQuery(".postdate",thread);
		
		
		
		posted_by = authorObj[0].innerHTML;
		posted_by = posted_by.replace(",","");
		posted_on = stripHTML(postdateObj[0].innerHTML);
		
		//alert(posted_by + " " + posted_on);
		
		if (forumusers[posted_by])
		{
		    forumusers[posted_by] = forumusers[posted_by] + 1;
		}
		else
		{
		    forumusers[posted_by] = 1;
		}
		
		
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
		//alert(posted_by + " " +  reply_to + " " + posted_on)
		AddPost(posted_by, reply_to, posted_on, 1, "Angel");
		
	}
}
