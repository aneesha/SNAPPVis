
function PerformSocialAnalysisWebCTVer4()
{
	
	//alert("WEBCT Ver 4");
	
	// Extract SNA Data
	var author_col = 5; // column 5 contains the post author by default

	var currRoot = "";
	
	//var x=document.getElementsByTagName("table");
  	//alert(x.length);

	var table = document.getElementsByTagName("table")[0];//document.getElementById("datatable");
	var rows = table.tBodies[0].rows;
	
	var tbl_header_cols = rows[1].cells;
	
	for (k=0; k < tbl_header_cols.length; k++)
	{
		col_header =  tbl_header_cols[k].innerHTML;
		if (col_header.indexOf("Author"))
		{
			author_col = k;
		}
	}
	
	for(i = 2; i < rows.length; i++)
	{
		
		var cols = table.tBodies[0].rows[i].cells; //rows[i].getElementsByTagName("td");
		var rowtext = "--";
		//alert("cols:" + cols.length);
		for (j = 0; j < cols.length; j++)
		{
			//alert(cols[j].innerHTML);
			if ((j==0) && (cols[j].innerHTML.indexOf("gif")!=-1))
			{
					continue;
			}
			if (j == 2) {
				inputtag = cols[j].getElementsByTagName("input");
				postid = inputtag[0].getAttribute("id");
				//need to count no of &nbsp;
				nb_spaces = stripHTML(cols[j].innerHTML);
				
				if ((cols[j].innerHTML.indexOf("small_arrow_indent.gif")==-1)&&(nb_spaces.indexOf("&nbsp;")==-1))
				{
					threaddepth = 0;
					currRoot = postid.substring(postid.indexOf("_")+1,postid.length);
				}
				else if ((nb_spaces.indexOf("&nbsp;")==-1)&&(cols[j].innerHTML.indexOf("small_arrow_indent.gif")!=-1))
				{
					threaddepth = 1;
				}
				else
				{
					start_nb = nb_spaces.indexOf("&nbsp;");
					end_nb = nb_spaces.lastIndexOf("&nbsp;");
					all_nbs = nb_spaces.substring(start_nb-6,end_nb+6);
					space_array = all_nbs.split(";&");
					threaddepth = space_array.length/2 + 1;
				}
			}
		    if (j == author_col) // used to be 5
			{
						posted_by = cols[j].innerHTML;
						
						//posted_by = posted_by.substring(posted_by.indexOf('(')+1,posted_by.length);
						posted_by = posted_by.substring(0, posted_by.indexOf('(') - 1);
						
						if (posted_by == "") {
							posted_by = cols[j].innerHTML;
						//posted_by = posted_by.substring(2,posted_by.length-2);
						}
						if (posted_by != "&nbsp;")
						{
							posted_by = stripHTML(posted_by);
							if (forumusers[posted_by]) {
								forumusers[posted_by] = forumusers[posted_by] + 1;
							}
							else {
								forumusers[posted_by] = 1;
							}
						}
			}
			if (j==(author_col+1)) // used to be 6
			{
				posted_on = cols[j].innerHTML;
				//alert(posted_on);
				//posted_on = stripSpaces(posted_on);
			}
		}
		if (posted_by!="&nbsp;")
		{
			//alert(currRoot+"_"+threaddepth + " " + posted_by);
			threadowners[currRoot+"_"+threaddepth] = posted_by;

			if (threaddepth==0)
			{
				reply_to = "-";
			}
			else 
			{
				reply_to = threadowners[currRoot+"_"+ (parseInt(threaddepth)-1)];
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
		}
	}
}

function PerformSocialAnalysisWebCT()
{

	var forum_title = trim(stripHTML(document.getElementsByTagName("h1")[0].innerHTML));
	//alert(forum_title);
	var forum_id = 1;
	// Extract SNA Data
	var author_col = 5; // column 5 contains the post author by default

	var currRoot = "";

	//var formWithTable = document.getElementById("messageViewForm");

  // Delete all posts for this forum
  //DeleteAllPosts(forum_id);

	var table = document.getElementById("datatable");
	//formWithTable.getElementsByTagName("table");
	//alert(table.tHead.innerHTML);
	
	// find column with "Author" title
	
	var tbl_header = table.tHead.rows;
	var tbl_header_cols = table.tHead.rows[0].cells;
	
	for (k=0; k < tbl_header_cols.length; k++)
	{
		col_header =  tbl_header_cols[k].innerHTML;
		//alert("col_header:" + col_header);
		if (col_header.indexOf("Author"))
		{
			author_col = k;
		}
	}
	//alert("author_col:" + author_col);

	var rows = table.tBodies[0].rows;//table.getElementsByTagName("tr");


	//alert("rows:" + rows.length);
	

	//var network = "";

	//network = network + "<table border='1'>";
	//network = network + "<tr><td>Post ID</td><td>Thread Depth</td><td>Posted By</td><td>Posted On</td><td>Reply To</td></tr>";

	for(i = 0; i < rows.length; i++) 
	{
		
		var cols = table.tBodies[0].rows[i].cells; //rows[i].getElementsByTagName("td");
		var rowtext = "--";
		//alert("cols:" + cols.length);
		for (j = 0; j < cols.length; j++)
		{
			//alert(cols[j].innerHTML);
			if (j==0)
			{
				inputtag = cols[j].getElementsByTagName("input");
				postid = inputtag[0].getAttribute("id");
				threaddepth = inputtag[0].getAttribute("indent"); 

				if (threaddepth=="0")
				{
					currRoot = postid;
				}

               		}
			else if (j==2)
			{
				forum_id = cols[j].getElementsByTagName("a")[0].getAttribute("href");
				forum_id = forum_id.substring(forum_id.indexOf('topicid=')+8,forum_id.length)
				forum_id = forum_id.substring(0,forum_id.indexOf('&'));
               		}
			else if (j==author_col)// used to be 5
			{
				
				posted_by = cols[j].innerHTML;
				
				
				posted_by = posted_by.substring(posted_by.indexOf('>')+1,posted_by.length);
				posted_by = posted_by.substring(0,posted_by.indexOf('<'));
				//alert(posted_by);

				if (posted_by == "")
				{
					posted_by = cols[j].innerHTML;
					posted_by = posted_by.substring(2,posted_by.length-2);
				}
	
				if (forumusers[posted_by])
				{
					forumusers[posted_by] = forumusers[posted_by] + 1;
				}
				else
				{
					forumusers[posted_by] = 1;
				}

			}
			else if (j==(author_col+1)) // used to be 6
			{
				posted_on = cols[j].innerHTML;
				//alert(posted_on);
				//posted_on = stripSpaces(posted_on);
			}
		}

		threadowners[currRoot+"_"+threaddepth] = posted_by;

		if (threaddepth=="0")
		{
			reply_to = "-";
		}
		else 
		{
			reply_to = threadowners[currRoot+"_"+ (parseInt(threaddepth)-1)];
			sna_relationship = posted_by + "_" + reply_to;
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
		//alert(forum_id);
		// insert into SNAPP Interactions database
		//AddPost(from_person, to_person, sent_date_time, forum_id);
		AddPost(posted_by, reply_to, posted_on, 1, "WebCT");
		
	}

	alert("Inserted all posts. YAY");

}


var globalWebCTTopicList = new Array();
var globalWebCTCurrentTopicIndex = 0;

function WebCTMultiForumMiner(topicList)
{
	//alert("WebCTMultiForumMiner called");
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
	
	
	for (i=0; i<topicList.length; i++)
	{
		// Find each topicID
		var len = topicList[i].length;
		var posStart = topicList[i].indexOf("&topicid=") + 9;
		topicid = topicList[i].substring(posStart,len);
		var posStart = topicid.indexOf("&");
		topicid = topicid.substring(0,posStart);
		globalWebCTTopicList[i] = topicid;
	}
	
	//alert("globalWebCTTopicList.length: " + globalWebCTTopicList.length);
	retrieveWebCTForumThread();
}

function retrieveWebCTForumThread()
{
	var postData = 'topicid=' + globalWebCTTopicList[globalWebCTCurrentTopicIndex];
	postData += "&areaid=0&discussionaction=mExpandAll&view=Threaded&movetotopic=none&showIndices=true";
	jQuery.ajax({type: "POST", url: "/webct/newMessageThread.dowebct", data: postData,
				success: function(html)
				{
					//alert("globalWebCTCurrentTopicIndex:" + globalWebCTCurrentTopicIndex + " globalWebCTTopicList.length:" + globalWebCTTopicList.length);
					jQuery("#SNAPPTempContainer").html(html);
					PerformSocialAnalysisWebCT();
					globalWebCTCurrentTopicIndex = globalWebCTCurrentTopicIndex + 1;
					//alert("globalWebCTCurrentTopicIndex<globalWebCTTopicList.length: " + (globalWebCTCurrentTopicIndex<globalWebCTTopicList.length));
					if (globalWebCTCurrentTopicIndex<globalWebCTTopicList.length)
					{
						//alert("retrieveWebCTForumThread called from success");
						retrieveWebCTForumThread();
					}
					else
					{
						WebCTMultiForumMinerCompleted();
					}
				}
	});
}

function WebCTMultiForumMinerCompleted()
{
			jQuery("#SNAPPTempContainer").html("");
			jQuery("#SNAPPLoading").html("");
			// Display the interface
			makeSNAInterface("body");
			//scroll to where SNA Data is inserted
			setTimeout('SetScrollPosition("SNAPP");',3);
}