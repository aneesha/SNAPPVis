/**
 * @author aneesha
 */

// Global Variables
var serverPath = "http://www.snappvis.org/SNAPP2/";

var forumPostDataStructure = "";
var annotationRows = "";
var line1;
var line2 = [];
var plot10;
var distributiongraph;
// Utility Functions
function getSNAPPVersion()
{
	return "SNAPP Already Loaded";
}

function stripSpaces(x) {
	// Removes spaces from a string
	return (x.replace(/^\W+/,'')).replace(/\W+$/,'');
}

function stripHTML(oldString) 
{
  var re= /<\S[^>]*>/g; 
  return oldString.replace(re,""); 
}

function getTextAfterChar(Text, charToStart)
{
	// Returns all characters in a string after the specified substring
	var len = Text.length;
	var posStart = Text.indexOf(charToStart);
	return Text.substring(posStart,len);
}

function getTextBetweenCharacters(Text, charsAtStart, charsAtEnd)
{
	// Returns all characters in a string between specified substrings
	var posStart = Text.indexOf(charsAtStart) + charsAtStart.length;
	var posEnd = Text.indexOf(charsAtEnd);
	return Text.substring(posStart,posEnd);
}

function getRequestVars()
{
	// Returns an array with all querystring parameters
	var request= new Array(); 
	var vals=location.search.substr(1).split("&");
	for (var i=0;i<vals.length;i++) 
	{ 
		vals[i] = vals[i].replace(/\+/g, " ").split("="); 
		request[unescape(vals[i][0])] = unescape(vals[i][1]); 
	} 
	return request;
}


function trim(stringToTrim) {
	return stringToTrim.replace(/^\s+|\s+$/g,"");
}

function ltrim(stringToTrim) {
	return stringToTrim.replace(/^\s+/,"");
}

function rtrim(stringToTrim) {
	return stringToTrim.replace(/\s+$/,"");
}


function wait(msecs)
{
var start = new Date().getTime();
var cur = start
while(cur - start < msecs)
{
cur = new Date().getTime();
}
} 

/* SNAPP Interaction Database Interface Functions */

function initsnapp(param)
{
	var paramArray = param.split(";");
	noposts =  paramArray[0];
	noparticpants = paramArray[1];
	networkdensity = paramArray[2];
	metrics = Base64.decode(paramArray[3]);
	distributiongraph = Base64.decode(paramArray[4]);
	show_MainStats(noposts, noparticpants, networkdensity);
	//alert(metrics);
	initSNAPPdatacomponents(metrics, distributiongraph);
}

function initSNAPPdatacomponents(metrics,distributiongraph)
{

		  //show_MainStats();
		  
	jQuery("#SNAPPDataGrid").html(buildPostsTable(metrics));
		 //jQuery("#SNAPPDataGrid").html(buildPostsTable(document.applets[0].ExportParticipantMetrics()));

		  // Add Annotations
	//jQuery("#SNAPPAnnotations").html(buildAnnotationsForm());
	tblrows = snappviz_GetAnnotationsLocally(document.location.href);
	//alert(tblrows);
	//jQuery("#SNAPPAnnotations").html(buildAnnotationsForm());
	
	if (tblrows=="")
	{
		jQuery("#SNAPPAnnotations").html(buildAnnotationsForm());
	}
	else
	{
		jQuery("#SNAPPAnnotations").html(buildAnnotationsTable(tblrows));
	}
	
		
    jQuery("#resultgrid").tablesorter({ debug: false, sortList: [[1, 1]], widgets: ['zebra'] })
            .tablesorterPager({ container: jQuery("#resultgridpager"), positionFixed: false })
            .tablesorterFilter({ filterContainer: jQuery("#resultgridfilterBox"),
              filterClearContainer: jQuery("#resultgridfilterReset"),
              filterColumns: [0, 1],
              filterCaseSensitive: false
            });
          jQuery("#resultgrid .header").click(function() {
            jQuery("#resultgrid tfoot .first").click();
    });
    
    // Make Annotations Sortable
    
  jQuery("#annotationgrid").tablesorter({ debug: false, sortList: [[1, 1]], widgets: ['zebra'] });

   jQuery("#annotationdate" ).datepicker();
    /*
    var MinPostDate=document.applets[0].getMinPostDate("1");
    var MaxPostDate=document.applets[0].getMaxPostDate("1");
    //alert("MinPostDate: " + MinPostDate + " MaxPostDate:" + MaxPostDate);
    var MinDayArray = MinPostDate.split("-");
    var MinDay = MinDayArray[1] + "/" + MinDayArray[2] + "/" + MinDayArray[0];
    var MaxDayArray = MaxPostDate.split("-");
    var MaxDay = MaxDayArray[1] + "/" + MaxDayArray[2] + "/" + MaxDayArray[0];
    */
    //alert("Minday" + MinDay);

    //jQuery("#FilterStartDate" ).datepicker({ defaultDate: MinDay });
    //jQuery("#FilterEndDate" ).datepicker({ defaultDate: MaxDay });
    

      jQuery('#snappcontainer').tabs( "select" , 0 );
      
    points = eval(distributiongraph);//eval(document.applets[0].ExportJSChart());//;
    line1 = points;//[['2008-09-10',10], ['2008-09-11',5], ['2008-09-12',6], ['2008-09-14',11]];
    plot10 = jQuery.jqplot('PostsOverTime', [line1], {
    gridPadding:{right:35},
    axes:{
        xaxis:{
            renderer:jQuery.jqplot.DateAxisRenderer, 
            tickOptions:{formatString:'%#d/%#m/%y'},
            tickInterval:'1 month'
        }
    },
           highlighter: {
           sizeAdjust: 10,
           tooltipLocation: 'n',
           useAxesFormatters: false,
           formatString: 'Hello %s dayglow %d'
       },
       cursor: {
           show: true,
           zoom: true,
           clickReset: true
       },

    series:[{lineWidth:1, markerOptions:{style:'circle'}}]
    });
    plot10.replot();
      
      /*
    // Call Render TagCloud
    //render_TagCloud();  

		  // Scroll to display the SNAPP interface
		  //setTimeout('SetScrollPosition("SNAPP");',10);
*/
}

function isAppletLoaded() 
{
    //wait(5);
    //alert("Calling isAppletLoaded() + document.applets.length: " + document.applets.length);
    if (document.applets[0].isActive() && document.applets.length>0 ) 
    {
		
	//alert("Thanks for installing the SNAPP 2 Beta. Applet Count-" + document.applets.length);
	try
	{
          var snapploadcheck = document.applets[0].appletCheck();
          initSNAPP();
	}
	catch(e)
	{
		//alert('An error has occurred: '+e.message);
		setTimeout("isAppletLoaded()",5000);
	}
   }
   else 
  {
		  setTimeout("isAppletLoaded()",5000);
		  //alert("The SNAPP applet is loading....");
   }
}

/*
 * Start Addding Data to Applet DataStore
 */

function render_TagCloud()
{
  //alert("running Tag cloud");
  // Need a method for each LMS
  //var t = jQuery("div.posting");
  //alert(t.length);
  //var all_text=t.text();
  //jQuery("#snappalltext").html(all_text);
  //jQuery("#snappalltext").dynaCloud("#snapptagcloud");
  //jQuery("#snappalltext").hide();
  
  /*
  for (i=0;i<t.length;i++)
  {
    
    alert(t[i].text());
  }
  */
  //jQuery("div.posting").dynaCloud("#snapptagcloud");
  
  
}

function exportwin(tmp)
{
  //alert("called from applet");http://www.snappvis.org/SNAPP2/html/help.html
  var exportwindow = window.open('','snappexpwin','scrollbars=no,menubar=no,height=300,width=300,resizable=yes,toolbar=no,location=no,status=no');
  exportwindow.document.open();
  exportwindow.document.write(buildExportHTML());
  exportwindow.document.close();
}

function snappviz_InsertAnnotation()
{

  //alert("Insert Annotation Called");
  var annotation_date = String(jQuery('#annotationdate').val());
  var annotation_des = String(jQuery('#annotationdescription').val());
  
  annotationRows += "<tr>";
  annotationRows += "<td>" + annotation_date + "</td>";
  annotationRows += "<td>" + annotation_des + "</td>";
  annotationRows += "</tr>";
  
  var date_array = new Array();
  date_array = annotation_date.split("/");
  line2[line2.length]="['" + date_array[2] + "-" + date_array[0] + "-" + date_array[1] +"',0]";

  
  // Reset Table
  // Add Annotations
  //jQuery("#SNAPPAnnotations").html(buildAnnotationsTable(annotationRows));
	jQuery("#annotationgrid tbody").append(annotationRows);
	jQuery('#annotationdate').val("");
        jQuery('#annotationdescription').val("");
  // Store Annotations Locally
  snappviz_StoreAnnotationsLocally(document.location.href,jQuery("#annotationgrid tbody").html());
  jQuery("#annotationgrid").tablesorter({ debug: false, sortList: [[1, 1]], widgets: ['zebra'] });
  jQuery("#annotationdate" ).datepicker();

}

function snappviz_StoreAnnotationsLocally(forumURL,annotationsTable)
{
	if (typeof(localStorage) == 'undefined' ) 
	{
		alert('Your browser does not allow data to be stored locally. Please export your Annotations before you leave this page.');
	} 
	else 
	{
		try 
		{
			// Encode the annotations table
			annotationsTableEncoded = Base64.encode(annotationsTable);
			localStorage.setItem(forumURL, annotationsTableEncoded); //saves to the database, "key", "value"
		} 
		catch (e) 
		{
			if (e == QUOTA_EXCEEDED_ERR) 
			{
				alert('The Annotations exceed the allowed quota for local storage. Please export your Annotations before you leave this page.');
				//data wasn't successfully saved due to quota exceed so throw an error
			}
		}
		//document.write(localStorage.getItem("name")); //Hello World!
		//localStorage.removeItem("name"); //deletes the matching item from the database
	}
}

function snappviz_GetAnnotationsLocally(forumURL)
{
	var annotationsTable = "";
	if (!(typeof(localStorage) == 'undefined')) 
	{
			// Encode the annotations table
			storeddata = localStorage.getItem(forumURL);
			//alert(storeddata);
			if (storeddata!=null)
			{
				annotationsTable = Base64.decode(storeddata);
				//alert(annotationsTable);
			}
	}
	return annotationsTable;
}


function snappviz_DeleteAnnotations()
{
	jQuery("#annotationgrid tbody").html("");
	if (!(typeof(localStorage) == 'undefined')) 
	{
		localStorage.removeItem(document.location.href);
	}
}
/*
 * End Adding Data to Applet DataStore
 */

function show_MainStats(noposts,noparticpants,networkdensity)
{
	//alert("show_MainStats()");
	/*
  var noposts = document.applets[0].getPostsforDisplay("1");
  var noparticpants = document.applets[0].getParticipantsforDisplay("1");
  var networkdensity = document.applets[0].getNetworkDensityforDisplay("1");
	*/
  jQuery('#no_posts').html(noposts);
  jQuery('#no_participants').html(noparticpants);
  jQuery('#snapp_netdensity').html("Network Density: "+networkdensity);
	
}

function snappviz_Export(file_extension)
{
      //var file_extension =  jQuery("#fileext:checked").val();
      document.exportsnapp.fileext.value=file_extension;
      if (file_extension=="png")
      {
        document.exportsnapp.imagedata.value=document.applets[0].exportFromSNAPP("image","png");
      }
      else if(file_extension=="jpg")
      {
        document.exportsnapp.imagedata.value=document.applets[0].exportFromSNAPP("image","jpg");
      }
      else if(file_extension=="vna")
      {
        document.exportsnapp.imagedata.value=document.applets[0].exportFromSNAPP("vna","");
      }
      else if(file_extension=="gefx")
      {
        document.exportsnapp.imagedata.value=document.applets[0].exportFromSNAPP("gefx","");
      }
      else if(file_extension=="gefxd")
      {
        document.exportsnapp.imagedata.value=document.applets[0].exportFromSNAPP("gefxd","");
      }
      else if(file_extension=="annotations")
      {
	annotations = jQuery('#annotationgrid').table2CSV({delivery:'value',header:['Date','Annotation']});
        document.exportsnapp.imagedata.value=annotations;
      }
      //alert(file_extension +  ": " + document.exportsnapp.imagedata.value);
      document.exportsnapp.submit();
}

function setMinMaxFormDates()
{
   document.DateFiltersForm.fromDate.value = document.applets[0].GetMinPostDate(1);
   document.DateFiltersForm.toDate.value = document.applets[0].GetMaxPostDate(1);
}
	//var gtmp = "";		
function AddPost(from_person, to_person, sent_date_time, forum_id, lms_type)
{
	  // Add to forumPostDataStructure
	  forumPostDataStructure += from_person + "|" + to_person + "|" + sent_date_time + "|" + String(forum_id) + "|" + lms_type + ";";
}
			
function AddForum(forum_id, forum_name)
{
	document.applets[0].AddForum(forum_name, forum_id);
}

function GetPostCountsPerForum(forum_id)
{
  //alert("GetPostCountsPerForum called:");
  var tmp = document.applets[0].GetPostCountsPerForum("1");
  return tmp;
  //document.snappdbresults.results.value = tmp;
}

function SNAPP_FilterByDate(forum_id)
{
  // DateFiltersForm fromDate toDate
  //alert("GetPostCountsPerForumByDate called:");
  var startDate =  Date.parse(document.DateFiltersForm.fromDate.value).toString("yyyy-M-d");
  var endDate = Date.parse(document.DateFiltersForm.toDate.value).toString("yyyy-M-d");
  //alert("About to call ");
  var tmp = document.applets[0].GetPostCountsPerForum(1,startDate,endDate); //document.applets[0].GetPostCountsPerForum("1", startDate, endDate);
  
  jQuery("#SNAPPDataGrid").html(buildPostsTable(tmp));
    
  jQuery("#resultgrid").tablesorter({ debug: false, sortList: [[1, 1]], widgets: ['zebra'] })
            .tablesorterPager({ container: jQuery("#resultgridpager"), positionFixed: false })
            .tablesorterFilter({ filterContainer: jQuery("#resultgridfilterBox"),
              filterClearContainer: jQuery("#resultgridfilterReset"),
              filterColumns: [0, 1],
              filterCaseSensitive: false
            });
          jQuery("#resultgrid .header").click(function() {
            jQuery("#resultgrid tfoot .first").click();
    });
  //reset Zoom Graph
  jQuery("#SNAPPPostsZoomGraph").html("");
  
}

function GetPostCountsPerForumByDate(forum_id,startDate,endDate)
{
  var tmp = document.applets[0].GetPostCountsPerForumByDate("1", startDate, endDate);
  //alert(tmp);
  return tmp;
}

function DeleteAllPosts(forum_id)
{
  alert("DeleteAllPosts called:");
  //document.applets[0].DeletePosts(forum_id);
}

function GetPostsByForum()
{
	var tmp = document.applets[0].GetPosts(1,"2008-08-08","2010-08-10","DumpDataType");
	//alert(tmp);
	document.snappdbresults.results.value = tmp;
}
/* End Interaction Database Interface Functions */



function GenerateGraphML()
{
  //alert("GenerateGraphML() called!");
  return Base64.encode(GenerateGraphML2(forumusers,replies));
}

function GenerateGraphML2(nodes,edges)
{
	// Generates a the Social Network Graph in the GraphML XML Format
  //alert("GenerateGraphML2() called!");
	var graphML;

	graphML = '<?xml version="1.0" encoding="UTF-8"?>\n';
	graphML += '<graphml xmlns="http://graphml.graphdrawing.org/xmlns" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd">\n';
	graphML += '<graph id="G" edgedefault="directed">\n';
	// Generate the nodes
	nodeCOUNT = 1;
	for (person in nodes)
	{
		graphML += '<node id="' + person + '" order="' + nodes[person] + '" name="' + person +'"/>\n'; 
		nodeCOUNT += 1;
	}

	// Generate the edges (ie links between nodes)

	for (reply in edges)
	{
		fromToArray = reply.split("_");
		if (fromToArray.length>1)
		{
			graphML += '<edge source="' + fromToArray[0] + '" target="' + fromToArray[1] + '" count="' + edges[reply] + '"/>' + '\n';
		}
	}

	graphML += '</graph>\n';
	graphML += '</graphml>\n';

	return graphML;
}

function GenerateVNAFileFormat(nodes,edges)
{
	// Generates a the Social Network Graph in the GraphML XML Format

	var vnaBuilder = "";

	vnaBuilder += '*Node data\n';
	vnaBuilder += 'ID posts\n';

	// Generate the nodes
	for (person in nodes)
	{
		vnaBuilder += '"' + person + '" ' + nodes[person] +'\n'; 
	}

	// Generate the edges (ie links between nodes)

	vnaBuilder += '*Tie data\n';
	vnaBuilder += 'from to talk strength\n';


	for (reply in edges)
	{
		fromToArray = reply.split("_");
		if (fromToArray.length > 1) 
		{
			vnaBuilder += '"' + fromToArray[0] + '" "' + fromToArray[1] + '" 1 ' + edges[reply] + '\n';
		}
	}

	return vnaBuilder;
}

function PostReplyTable(edges)
{
	// Generates a Post-Reply Frequency Table

	var tableBuilder = "";

	tableBuilder += "<h2>Post-Reply Frequency Table</h2><table border='1'>";
	tableBuilder += "<tr><td>Poster</td><td>Replied To</td><td>Frequency</td></tr>";

	// Generate the edges (ie links between nodes)

	for (reply in edges)
	{
		fromToArray = reply.split("_");
		tableBuilder += "<tr><td>" + fromToArray[0] + "</td><td>" + fromToArray[1] + "</td><td>" + edges[reply] + "</td></tr>";
	}
	tableBuilder += '</table>\n';

	return tableBuilder;
}

var forumusers = {};
var noforumusers = 0;
var postsbyusers = "";
var totalposts = 0;
var threadowners = {};
var replies = {};

function removeElement(ele){
  if(ele.parentNode && ele.nodeType){
    ele.parentNode.removeChild(ele);
    return true;
  }else{
    return false;// not an element or no parent :(
  };
}

function resetSNAPP()
{
	//alert("resetSNAPP called");
	
	// reset data structures
	forumusers = {};
	noforumusers = 0;
	postsbyusers = "";
	totalposts = 0;
	threadowners = {};
	replies = {};
	
	// remove interface
	/*
	jQuery("#SNAPPContainer").remove();
	*/
	var temp = document.getElementById("SNAPPContainer");
	if (temp)
	{
		removeElement(temp);
	}
	var temp2 = document.getElementById("SNAPP");
	if (temp2)
	{
		removeElement(temp2);
	}
	// rerun sna
	
	runSNA();
}

function buildVisualization()
{
  //alert("forumPostDataStructure: " + forumPostDataStructure);
  var param1 = Base64.encode(forumPostDataStructure);
  //alert(param1);
  var BuildVisulizationHTML = "";

  BuildVisulizationHTML += '<div id="PostsOverTime" style="margin-left:2px; width:100%; height:80px;"></div>';

  BuildVisulizationHTML += '<applet name="SNAPPDBTest" width="100%" height="450" mayscript="true" border="0" codebase="http://www.snappvis.org/SNAPP2/" code="SNAPP.SNAPPDisplay" archive="jar/snapp44.jar,jar/microba-0.4.4.3.jar,jar/collections-generic-4.01.jar,jar/colt-1.2.0.jar,jar/commons-codec-1.3.jar,jar/concurrent-1.3.4.jar,jar/jung-algorithms-2.0.1.jar,jar/jung-api-2.0.1.jar,jar/jung-graph-impl-2.0.1.jar,jar/jung-io-2.0.1.jar,jar/jung-jai-2.0.1.jar,jar/jung-visualization-2.0.1.jar,jar/stax-api-1.0.1.jar,jar/wstx-asl-3.2.6.jar,jar/hsqldb.jar">';
  BuildVisulizationHTML += '<param name="sna" value="' + param1 +'" />';
  //BuildVisulizationHTML += '<param name="java_arguments" value="-Dsun.java2d.opengl=true"/>';
  BuildVisulizationHTML += '<param name="java_arguments" value="-Djnlp.packEnabled=true"/>';
  BuildVisulizationHTML += ' To view this content, you need to install Java from <a href="http://java.com">java.com</a>';
  BuildVisulizationHTML += '</applet>';
   
  return BuildVisulizationHTML;
}

function buildAnnotationsTable(tblrows){
  
  ResutGridHTML = "";
  ResutGridHTML += '<table id="annotationgrid" class="yui">';
  ResutGridHTML += '<thead>';
  ResutGridHTML += '<tr>';
  ResutGridHTML += '<th><a href="#" title="Click Header to Sort by Date">Date</a></th>';
  ResutGridHTML += '<th><a href="#" title="Click Header to Sort by Posts">Description</a></th>';
  ResutGridHTML += '</tr>';
  ResutGridHTML += '</thead>';
  ResutGridHTML += '<tbody>';
  ResutGridHTML += tblrows;
  ResutGridHTML += '</tbody>';
  ResutGridHTML += '</table>';
  
  ResutGridHTML += '<form name="insannotation">';
  ResutGridHTML += '<fieldset  class="snappui" style="border:1px solid #00f;">';
  ResutGridHTML += '<legend>Add Annotation:</legend>';
  ResutGridHTML += 'Date: <input type="text" id="annotationdate" size="12"><br/>';
  ResutGridHTML += 'Description: <br/>';
  ResutGridHTML += '<textarea id="annotationdescription" rows="5" cols="60"></textarea><br/>';
  ResutGridHTML += '<input type="button" name="addannotation_btn" onClick="snappviz_InsertAnnotation()" value="Add">';
  ResutGridHTML += '<input type="button" name="export_btn" onClick="snappviz_Export(\'annotations\');" value="Export">';
  ResutGridHTML += '<input type="button" name="export_btn" onClick="snappviz_DeleteAnnotations();" value="Delete All Annotations">';
  
  ResutGridHTML += '</fieldset>';
  ResutGridHTML += '</form>';

  return ResutGridHTML;
}

function buildAnnotationsForm(){
  
  ResutGridHTML = "";
  ResutGridHTML += '<form name="insannotation">';
  ResutGridHTML += '<fieldset  class="snappcontrolui">';
  ResutGridHTML += '<legend>Add Annotation:</legend>';
  ResutGridHTML += 'Date: <input type="text" id="annotationdate" size="12"><br/>';
  ResutGridHTML += 'Description: <br/>';
  ResutGridHTML += '<textarea id="annotationdescription" rows="5" cols="60"></textarea><br/>';
  ResutGridHTML += '<input type="button" name="addannotation_btn" onClick="snappviz_InsertAnnotation()" value="Add">';
  ResutGridHTML += '</fieldset>';
  ResutGridHTML += '</form>';

  return ResutGridHTML;
}

function buildPostsTable(tblrows){
  
  ResutGridHTML = "";
  ResutGridHTML += '<table id="resultgrid" class="yui">';
  ResutGridHTML += '<thead>';
  ResutGridHTML += '<tr>';
  ResutGridHTML += '<td class="tableHeader">';
  ResutGridHTML += '&nbsp;';
  ResutGridHTML += '</td>';
  ResutGridHTML += '<td colspan="7" class="filter">';
  ResutGridHTML += 'Search returned results: <input id="resultgridfilterBox" value="" maxlength="30" size="30" type="text" />';
  ResutGridHTML += '<img id="resultgridfilterReset" src="'+ serverPath + 'images/arrow_refresh.png" title="Click to reset filter/search." alt="Reset Filter/Search" />';
  ResutGridHTML += '</td>';
  ResutGridHTML += '</tr>';
  ResutGridHTML += '<tr>';
  ResutGridHTML += '<th><a href="#" title="Click Header to Sort by Name">Name</a></th>';
  ResutGridHTML += '<th><a href="#" title="Click Header to Sort by Posts">No Posts</a></th>';
  ResutGridHTML += '<th><a href="#" title="Click Header to Sort by Degree">Degree</a></th>';
  ResutGridHTML += '<th><a href="#" title="Click Header to Sort by In Degree">In Degree</a></th>';
  ResutGridHTML += '<th><a href="#" title="Click Header to Sort by Out Degree">Out Degree</a></th>';
  ResutGridHTML += '<th><a href="#" title="Click Header to Sort by Betweenness Centrality">Betweenness Centrality</a></th>';
  //ResutGridHTML += '<th><a href="#" title="Click Header to Sort by Closeness Centrality">Closeness Centrality</a></th>';
  ResutGridHTML += '<th><a href="#" title="Click Header to Sort by Eigenvector Centrality">Eigenvector Centrality</a></th>';
  ResutGridHTML += '</tr>';
  ResutGridHTML += '</thead>';
  ResutGridHTML += '<tbody>';
  
  /*
  for (i in forumusers)
  {
    ResutGridHTML += "<tr><td>" + i + "</td><td>" + forumusers[i] + "</td></tr>";
    noforumusers = noforumusers + 1;
  }
  */
  ResutGridHTML += tblrows;//GetPostCountsPerForum(1);
  ResutGridHTML += '</tbody>';
  ResutGridHTML += '<tfoot>';
  ResutGridHTML += '<tr id="resultgridpager">';
  ResutGridHTML += '<td colspan="7">';
  
  ResutGridHTML += '<img src="'+ serverPath + 'images/first.png" class="first"/>';
  ResutGridHTML += '<img src="'+ serverPath + 'images/prev.png" class="prev"/>';
  ResutGridHTML += '<input type="text" class="pagedisplay"/>';
  ResutGridHTML += '<img src="'+ serverPath + 'images/next.png" class="next"/>';
  ResutGridHTML += '<img src="'+ serverPath + 'images/last.png" class="last"/>';
  ResutGridHTML += '<select class="pagesize">';
  ResutGridHTML += '<option selected="selected" value="10">10</option>';
  ResutGridHTML += '<option value="25">25</option>';
  ResutGridHTML += '<option value="50">50</option>';
  ResutGridHTML += '<option value="150">150</option>';
  ResutGridHTML += '<option  value="200">200</option>';
  ResutGridHTML += '</select>';
  ResutGridHTML += '</td>';
  ResutGridHTML += '</tr>';
  ResutGridHTML += '</tfoot>';
  ResutGridHTML += '</table>';
  
  return ResutGridHTML;
}

function f()
{
	//alert("Called from Applet - too late");
	return "Hello from JS";
}

function buildHelp()
{
	var BuildExportHTML = "";
	BuildExportHTML += '<p><iframe src="'+ serverPath + "/html/help.html" + '" width="90%" height="400px" frameborder="0" /></p>'

	return BuildExportHTML;
}

function buildCredits()
{
	var BuildExportHTML = "";
	BuildExportHTML += '<p><iframe src="'+ serverPath + "/html/credits.html" + '" width="100%" height="400px" frameborder="0" /></p>'

	return BuildExportHTML;
}

function buildExport()
{
  BuildExportHTML = "";
  BuildExportHTML += '<form name="exportsnapp" method="post" action="http://www.snappvis.org/FileSaver/FileSave.php">';
  BuildExportHTML += '<input type="hidden" id="fileext" name="fileext" value="">';
  BuildExportHTML += '<input type="hidden" name="imagedata">';
  BuildExportHTML += '</form>'; 
  return BuildExportHTML;
}

function buildExportHTML()
{
  BuildExportHTML = "";
  
  BuildExportHTML += '<div title="Export">';
  BuildExportHTML += '<script>';
  BuildExportHTML += 'function getRadioValue()';
  BuildExportHTML += '{';
	  BuildExportHTML += 'for(var i = 0; i < document.exportform.fileext.length ; i++) {';
		  BuildExportHTML += 'if(document.exportform.fileext[i].checked) {';
      //BuildExportHTML += 'alert(document.exportform.fileext[i].value);';
			  BuildExportHTML += 'return document.exportform.fileext[i].value;';
		  BuildExportHTML += '}';
	  BuildExportHTML += '}';
  BuildExportHTML += '}';
  BuildExportHTML += '</script>';
  BuildExportHTML += '<form name="exportform" method="post" action="http://www.snappvis.org/FileSaver/FileSave.php">';
  BuildExportHTML += '<h2>Export As:</h2>';
  BuildExportHTML += '<input type="radio" id="fileext" checked name="fileext" value="jpg"> Image (.jpg)<br/>';
  BuildExportHTML += '<input type="radio" id="fileext" name="fileext" value="png"> Image (.png)<br/>';
  BuildExportHTML += '<input type="radio" id="fileext" name="fileext" value="vna"> NetDraw (.vna)<br/>';
  BuildExportHTML += '<input type="radio" id="fileext" name="fileext" value="gefx"> Gephi Gefx (.gefx)<br/>';
  BuildExportHTML += '<input type="radio" id="fileext" name="fileext" value="gefxd"> Gephi Dynamic Gefx (.gefx)<br/>';
  BuildExportHTML += '<input type="hidden" name="imagedata">';
  BuildExportHTML += '<input type="button" name="export_btn" onClick="window.opener.snappviz_Export(getRadioValue());window.close();" value="Export">';
  BuildExportHTML += '</form>';  
  BuildExportHTML += '<form name="tempdatastore">';
  BuildExportHTML += '<input type="hidden" name="vna_store">';
  BuildExportHTML += '<input type="hidden" name="jpg_store">';
  BuildExportHTML += '<input type="hidden" name="png_store">';
  BuildExportHTML += '<input type="hidden" name="annotation_store">';
  BuildExportHTML += '</form>';   
  BuildExportHTML += '<div>';            

  return BuildExportHTML;
}

function buildMetrics(){
	
	ResutGridHTML = "";
	ResutGridHTML += '<table id="resultgrid" class="yui">';
	ResutGridHTML += '<thead>';
	ResutGridHTML += '<tr>';
	ResutGridHTML += '<td class="tableHeader">';
	ResutGridHTML += '&nbsp;';
	ResutGridHTML += '</td>';
	ResutGridHTML += '<td colspan="2" class="filter">';
	ResutGridHTML += 'Search returned results: <input id="resultgridfilterBox" value="" maxlength="30" size="30" type="text" />';
	ResutGridHTML += '<img id="resultgridfilterReset" src="'+ serverPath + 'images/arrow_refresh.png" title="Click to reset filter/search." alt="Reset Filter/Search" />';
	ResutGridHTML += '</td>';
	ResutGridHTML += '</tr>';
	ResutGridHTML += '<tr>';
	ResutGridHTML += '<th><a href="#" title="Click Header to Sort by Name">Name</a></th>';
	ResutGridHTML += '<th><a href="#" title="Click Header to Sort by Posts">No Posts</a></th>';
	ResutGridHTML += '</tr>';
	ResutGridHTML += '</thead>';
	ResutGridHTML += '<tbody>';
	
	for (i in forumusers)
	{
		ResutGridHTML += "<tr><td>" + i + "</td><td>" + forumusers[i] + "</td></tr>";
		noforumusers = noforumusers + 1;
	}
	
	ResutGridHTML += '</tbody>';
	ResutGridHTML += '<tfoot>';
	ResutGridHTML += '<tr id="resultgridpager">';
	ResutGridHTML += '<td colspan="5">';
	
	ResutGridHTML += '<img src="'+ serverPath + 'images/first.png" class="first"/>';
	ResutGridHTML += '<img src="'+ serverPath + 'images/prev.png" class="prev"/>';
	ResutGridHTML += '<input type="text" class="pagedisplay"/>';
	ResutGridHTML += '<img src="'+ serverPath + 'images/next.png" class="next"/>';
	ResutGridHTML += '<img src="'+ serverPath + 'images/last.png" class="last"/>';
	ResutGridHTML += '<select class="pagesize">';
	ResutGridHTML += '<option selected="selected" value="10">10</option>';
	ResutGridHTML += '<option value="25">25</option>';
	ResutGridHTML += '<option value="50">50</option>';
	ResutGridHTML += '<option value="150">150</option>';
	ResutGridHTML += '<option  value="200">200</option>';
	ResutGridHTML += '</select>';
	ResutGridHTML += '</td>';
	ResutGridHTML += '</tr>';
	ResutGridHTML += '</tfoot>';
	ResutGridHTML += '</table>';
	
	return ResutGridHTML;
}

function forumusersCount(){

	for (i in forumusers)
	{
		noforumusers = noforumusers + 1;
	}
	return noforumusers;
}

function SetScrollPosition(divid)
{
    //scroll to where SNA Data is inserted
    window.scrollTo(document.getElementById(divid).offsetLeft,document.getElementById(divid).offsetTop);
}

function BuildSNAPP2InterfaceHTML()
{
  BuildSNAHTML = "";
  BuildSNAHTML = BuildSNAHTML + '<div id="SNAPP" class="formArea">';
  BuildSNAHTML = BuildSNAHTML + '<span class="formTitle">';
  BuildSNAHTML = BuildSNAHTML + 'Social Networks Adapting Pedagogical Practice (SNAPP)';
  BuildSNAHTML = BuildSNAHTML + '</span>';
  BuildSNAHTML = BuildSNAHTML + '<div class="previewbox">';
  //BuildSNAHTML = BuildSNAHTML + 'Participants: ' + '<span id="no_participants"></span>' + '';
  //BuildSNAHTML = BuildSNAHTML + ' | Posts: ' + '<span id="no_posts"></span>' + '';

  BuildSNAHTML = BuildSNAHTML + '<table border="0" cellpadding="4">';
  BuildSNAHTML = BuildSNAHTML + '<tr><td>Participants</td><td>' + '<span id="no_participants"></span>' + '</td>';
  BuildSNAHTML = BuildSNAHTML + '<td>Posts</td><td>' + '<span id="no_posts"></span>' + '</td></tr>';
  //BuildSNAHTML = BuildSNAHTML + '<tr><td>Posts</td><td>' + '<span id="no_posts"></span>' + '</td></tr>';
  BuildSNAHTML = BuildSNAHTML + '</table>';

  BuildSNAHTML = BuildSNAHTML + '</div>';
  BuildSNAHTML = BuildSNAHTML + '</div>';
  
  BuildSNAHTML = BuildSNAHTML + '<div id="snappcontainer">';
  BuildSNAHTML = BuildSNAHTML + '<ul>';
  BuildSNAHTML = BuildSNAHTML + '<li><a href="#Visualisation"><span>Visualisation</span></a></li>';
  BuildSNAHTML = BuildSNAHTML + '<li><a href="#Statistics"><span>Statistics</span></a></li>';
  BuildSNAHTML = BuildSNAHTML + '<li><a href="#Annotations"><span>Annotations</span></a></li>';
 // BuildSNAHTML = BuildSNAHTML + '<li><a href="#Tagcloud"><span>Tag Cloud</span></a></li>';
  BuildSNAHTML = BuildSNAHTML + '<li><a href="#Help"><span>Help</span></a></li> ';
  BuildSNAHTML = BuildSNAHTML + '<li><a href="#Credits"><span>Credits</span></a></li> ';
  BuildSNAHTML = BuildSNAHTML + '</ul>';
  BuildSNAHTML = BuildSNAHTML + '<div id="Visualisation">';
  BuildSNAHTML = BuildSNAHTML + '<p id="SNAPPVIZ">';
  BuildSNAHTML = BuildSNAHTML + buildVisualization();
  BuildSNAHTML = BuildSNAHTML + '</p>';  
  BuildSNAHTML = BuildSNAHTML + '</div>';  
  BuildSNAHTML = BuildSNAHTML + '<div id="Statistics">';
  BuildSNAHTML = BuildSNAHTML + '<p>';
  BuildSNAHTML = BuildSNAHTML + '<div id="snapp_netdensity"></div>';
  BuildSNAHTML = BuildSNAHTML + '<div id="SNAPPDataGrid"></div>';
  BuildSNAHTML = BuildSNAHTML + '</p>';  
  BuildSNAHTML = BuildSNAHTML + '</div>';  
  BuildSNAHTML = BuildSNAHTML + '<div id="Annotations">';
  BuildSNAHTML = BuildSNAHTML + '<p>';
  BuildSNAHTML = BuildSNAHTML + '<div id="SNAPPAnnotations"></div>';
  BuildSNAHTML = BuildSNAHTML + '</p>';  
  BuildSNAHTML = BuildSNAHTML + '</div>';
 // BuildSNAHTML = BuildSNAHTML + '<div id="Tagcloud">';
 // BuildSNAHTML = BuildSNAHTML + '<p>';
  //BuildSNAHTML = BuildSNAHTML + '<div id="snappalltext">store all the text</div>';
 // BuildSNAHTML = BuildSNAHTML + '<div id="snapptagcloud">tagcloud div</div>';
  
//  BuildSNAHTML = BuildSNAHTML + '</p>';  
 // BuildSNAHTML = BuildSNAHTML + '</div>';
  BuildSNAHTML = BuildSNAHTML + '<div id="Help">';
  BuildSNAHTML = BuildSNAHTML + buildHelp();
  BuildSNAHTML = BuildSNAHTML + '</div>'; 
  BuildSNAHTML = BuildSNAHTML + '<div id="Credits">';
  BuildSNAHTML = BuildSNAHTML + buildCredits();
  BuildSNAHTML = BuildSNAHTML + '</div>'
  BuildSNAHTML = BuildSNAHTML + buildExport();

  return BuildSNAHTML;
}


function makeSNAInterface(divid)
{
 //alert("caller is " + arguments.callee.caller.toString());

  BuildSNAHTML = BuildSNAPP2InterfaceHTML();

  var snaInterface = document.createElement("div");
  snaInterface.id = "SNAPPContainer";
  
  jQuery.noConflict();
  jQuery(divid).append(snaInterface);
  jQuery("#SNAPPContainer").html(BuildSNAHTML);
  jQuery('#snappcontainer').tabs();
  jQuery('#snappcontainer').bind('tabsshow', function(event, ui) {
    if (ui.index == 0)
    {
      if (line2.length>0)
      {
                //alert("tab 1: " + line1);
        //redraw plot
        jQuery('#PostsOverTime').html("");
        jQuery('#PostsOverTime').css("width", "100%");
        jQuery('#PostsOverTime').css("height", "100px");
        jQuery('#PostsOverTime').removeClass("jqplot");
        //style="margin-top:2px; margin-left:2px; width:100%; height:100px;"
     
    //line2 = [['2010-02-01',1]];
    
    annotations_series = eval("[" + line2.join(",") + "]");
    //alert(line1 +   "::" + annotations_series);
    plot10 = jQuery.jqplot('PostsOverTime', [line1, annotations_series], {
    gridPadding:{right:35},
    axes:{
        xaxis:{
            renderer:jQuery.jqplot.DateAxisRenderer, 
            tickOptions:{formatString:'%#d/%#m/%y'},
            tickInterval:'1 month'
        }
    },
           highlighter: {
           sizeAdjust: 10,
           tooltipLocation: 'n',
           useAxesFormatters: false,
           formatString: 'Hello %s dayglow %d'
       },
       cursor: {
           show: true,
           zoom: true
       },

    series:[{lineWidth:1, markerOptions:{showLabel:false, label:'Posts',  style:'circle'}},{label:'Annotations', lineWidth:0, markerOptions:{style:'x'}}],
     legend:{show:true}
    
    });
        
      }
        plot10.replot();
    }

});
  //isAppletLoaded();
}


function buildTempThreadHolder(threadList)
{
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
	
	for (i=0; i<threadList.length; i++)
	{
		// Load each thread

		var len = threadList[i].length;
		var posStart = threadList[i].indexOf("&topicid=") + 9;
		topicid = threadList[i].substring(posStart,len);
		var posStart = topicid.indexOf("&");
		topicid = topicid.substring(0,posStart);
		var postData = 'topicid=' + topicid;
		postData += "&areaid=0&discussionaction=mExpandAll&view=Threaded&movetotopic=none&showIndices=true"
		var html = jQuery.ajax({type: "POST", url: "/webct/newMessageThread.dowebct", data: postData, async: false}).responseText;
		jQuery("#SNAPPTempContainer").html(html);
		PerformSocialAnalysisWebCT();
	}
	//alert("out of the loop");
	// Clear last thread and progress bar from display
	jQuery("#SNAPPTempContainer").html("");
	jQuery("#SNAPPLoading").html("");
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


// From http://www.kunalbabre.com/projects/table2CSV.php

jQuery.fn.table2CSV = function(options) {
    var options = jQuery.extend({
        separator: ',',
        header: [],
        delivery: 'popup' // popup, value
    },
    options);

    var csvData = [];
    var headerArr = [];
    var el = this;

    //header
    var numCols = options.header.length;
    var tmpRow = []; // construct header avalible array

    if (numCols > 0) {
        for (var i = 0; i < numCols; i++) {
            tmpRow[tmpRow.length] = formatData(options.header[i]);
        }
    } else {
        jQuery(el).filter(':visible').find('th').each(function() {
            if (jQuery(this).css('display') != 'none') tmpRow[tmpRow.length] = formatData(jQuery(this).html());
        });
    }

    row2CSV(tmpRow);

    // actual data
    jQuery(el).find('tr').each(function() {
        var tmpRow = [];
        jQuery(this).filter(':visible').find('td').each(function() {
            if (jQuery(this).css('display') != 'none') tmpRow[tmpRow.length] = formatData(jQuery(this).html());
        });
        row2CSV(tmpRow);
    });
    if (options.delivery == 'popup') {
        var mydata = csvData.join('\n');
        return popup(mydata);
    } else {
        var mydata = csvData.join('\n');
        return mydata;
    }

    function row2CSV(tmpRow) {
        var tmp = tmpRow.join('') // to remove any blank rows
        // alert(tmp);
        if (tmpRow.length > 0 && tmp != '') {
            var mystr = tmpRow.join(options.separator);
            csvData[csvData.length] = mystr;
        }
    }
    function formatData(input) {
        // replace " with “
        var regexp = new RegExp(/["]/g);
        var output = input.replace(regexp, "“");
        //HTML
        var regexp = new RegExp(/\<[^\<]+\>/g);
        var output = output.replace(regexp, "");
        if (output == "") return '';
        return '"' + output + '"';
    }
    function popup(data) {
        var generator = window.open('', 'csv', 'height=400,width=600');
        generator.document.write('<html><head><title>CSV</title>');
        generator.document.write('</head><body >');
        generator.document.write('<textArea cols=70 rows=15 wrap="off" >');
        generator.document.write(data);
        generator.document.write('</textArea>');
        generator.document.write('</body></html>');
        generator.document.close();
        return true;
    }
};