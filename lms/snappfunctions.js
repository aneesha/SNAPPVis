/**
 * @author aneesha
 */

// Global Variables
var serverPath = "http://www.snappvis.org/SNAPP2Release/";

var forumPostDataStructure = "";
var annotationRows = "";
var line1;
var line2 = [];
var plot10;
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

function openSNAPPEvolutions()
{
   SNAPPEV_window = window.open (serverPath + "Animation.html", "snappwindow","location=1,status=1,scrollbars=1,width=800,height=700");
   mywindow.moveTo(0,0);
}

/* SNAPP Interaction Database Interface Functions */


function isAppletLoaded() 
{
    wait(5);
    
    if (document.applets[0].isActive() && document.applets.length>0 ) 
    {
		// call function to start
		//runSNA();
		//alert(buildPostsTable());
		
		// Display DataTable
		//jQuery("#SNAPPDataGrid").html(buildPostsTable(GetPostCountsPerForum(1)));
		
		//setMinMaxFormDates();
		
		// Display Explore Zoom Graph
		//buildZoomGraph(GetPostCountsPerForumByDate(1,"",""));
		
		  alert("isAppletLoaded active");

		  //var done = document.applets[0].runSNAPP();
		  //wait(2);
		  
      //alert("done: "+ done);
      //alert(gtmp);
		  
		  show_MainStats();
		  
		  // Cache exports
      //document.tempdatastore.vna_store.value=document.applets[0].exportFromSNAPP("file","vna");
      //document.tempdatastore.jpg_store.value=document.applets[0].exportFromSNAPP("image","jpg");
      //document.tempdatastore.png_store.value=document.applets[0].exportFromSNAPP("image","png");
      //alert(document.applets[0].exportFromSNAPP("file","vna"));
		  
		 jQuery("#SNAPPDataGrid").html(buildPostsTable(document.applets[0].ExportParticipantMetrics()));

		  // Add Annotations
		  //document.applets[0].AddAnnotation("Test","12/1/10","1");
		  //document.applets[0].InsertAnnotation("Implementing ...","9/9/2010","1");
		  
		  //jQuery("#SNAPPAnnotations").html(buildAnnotationsTable(document.applets[0].GetAnnotations("1")));
		  jQuery("#SNAPPAnnotations").html(buildAnnotationsForm());
		  
		
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

   
    
//angle:-30
//highlighter: {sizeAdjust: 7.5},

    
    jQuery("#annotationdate" ).datepicker();
    
    var MinPostDate=document.applets[0].getMinPostDate("1");
    var MaxPostDate=document.applets[0].getMaxPostDate("1");
    //alert("MinPostDate: " + MinPostDate + " MaxPostDate:" + MaxPostDate);
    var MinDayArray = MinPostDate.split("-");
    var MinDay = MinDayArray[1] + "/" + MinDayArray[2] + "/" + MinDayArray[0];
    var MaxDayArray = MaxPostDate.split("-");
    var MaxDay = MaxDayArray[1] + "/" + MaxDayArray[2] + "/" + MaxDayArray[0];
    
    //alert("Minday" + MinDay);

    jQuery("#FilterStartDate" ).datepicker({ defaultDate: MinDay });
    jQuery("#FilterEndDate" ).datepicker({ defaultDate: MaxDay });
    
    //jQuery("#FilterStartDate" ).val = MinDay;
    //jQuery("#FilterEndDate" ).val = MaxDay;
      
    //jQuery("#zoomin").button(); 
    //jQuery("#zoomout").button(); 
    //jQuery("#animate").button(); 
    //jQuery("#snappexport").button(); 
    
    jQuery( "#dialog-form" ).dialog({
      autoOpen: false,
      height: 300,
      width: 400,
      modal: true,
      stack: true,
      draggable: true,
      zIndex: 3999,
      position: ['right','bottom']
    });

    jQuery( "#snappexport" )
      .click(function() {
        jQuery( "#dialog-form" ).dialog( "open" );
      });

      jQuery('#snappcontainer').tabs( "select" , 0 );
      
       //title:'Post Distribution', 
       //alert(document.applets[0].ExportJSChart());
    points = eval(document.applets[0].ExportJSChart());//;
    //alert(points);
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
      
      
    // Call Render TagCloud
    render_TagCloud();  

		  // Scroll to display the SNAPP interface
		  setTimeout('SetScrollPosition("SNAPP");',3);
    }
    else 
    {
		  setTimeout("isAppletLoaded()",5000);
		  alert("SNAPP applet has not yet loaded....");
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
  //['02/08/2011',0]::2010-02-23,1,2010-03-01,1,2010-03-02,26
  line2[line2.length]="['" + date_array[2] + "-" + date_array[0] + "-" + date_array[1] +"',0]";
  
  //alert(line2);
  
  //alert("annotationdescription:" + annotation_des);
  //alert("annotation_date:" + annotation_date);
  
  //tmp = document.applets[0].InsertAnnotation("test","12/01/2010","1");
  
  //document.applets[0].InsertAnnotation("Implementing ...","9/9/2010","1");
  //tmp = document.applets[0].AddAnnotation(annotationdes,"12/01/2010","1");
  //tmp = document.applets[0].AddAnnotation(des,annodate,"1");
  //document.applets[0].appletController("selection",jQuery('#selectiontype').val(),"","");
  
  //document.applets[0].AddAnnotation(jQuery('#annotationdescription').val(),jQuery('#annotationdate').val(),"1");
  
  // Reset Table
  // Add Annotations
  jQuery("#SNAPPAnnotations").html(buildAnnotationsTable(annotationRows));
  jQuery("#annotationgrid").tablesorter({ debug: false, sortList: [[1, 1]], widgets: ['zebra'] });
  jQuery("#annotationdate" ).datepicker();
  
  
  // Redraw Graph
  
  //plot10.series[1].data = [['2011-02-01',1],['2011-02-02',1]];
  //plot10.drawSeries(1); 
  //plot10.series[1].data = [['2011-02-01',1],['2011-02-02',1]];
  //jQuery("#PostsOverTime" ).html("");
  //jQuery('#PostsOverTime').empty(); 
      //title:'Post Distribution', 
    //alert(points);
    //plot10.redraw();
    /*
    line1 = points;//[['2008-09-10',10], ['2008-09-11',5], ['2008-09-12',6], ['2008-09-14',11]];
    line2 = [['2011-02-01',1],['2011-02-02',1]];
    */  
   
}
/*
 * End Adding Data to Applet DataStore
 */

function show_MainStats()
{
  var noposts = document.applets[0].getPostsforDisplay("1");
  var noparticpants = document.applets[0].getParticipantsforDisplay("1");
  var networkdensity = document.applets[0].getNetworkDensityforDisplay("1");
  
  jQuery('#no_participants').html(noparticpants);
  jQuery('#no_posts').html(noposts);
  jQuery('#snapp_netdensity').html("Network Density: "+networkdensity);
}

/* SNAPP Viz Control JS */

function snappviz_selectionchange(selectiontype_obj)
{
  //alert("Selection Changed - " + $('#selectiontype').val());
  document.applets[0].appletController("selection",jQuery('#selectiontype').val(),"","");
}
    
function snappviz_layoutchange(selectiontype_obj)
{
  //alert("Selection Changed - " + $('#layout').val());
  document.applets[0].appletController("layout",jQuery('#layout').val(),"","");
}
    
function snappviz_mousewheelchange(selectiontype_obj)
{
        if(jQuery('#mousewheel').is(':checked')) {
            //alert("Selection Changed - " + $('#mousewheel').val());
            document.applets[0].appletController("mousewheel","on","","");
         }
         else
         {
            //alert("Selection Changed - off");
            document.applets[0].appletController("mousewheel","off","","");
         }
}
    
function snappviz_egonetworkchange(selectiontype_obj)
{
        if(jQuery('#egonetwork').is(':checked')) {
            //alert("Selection Changed - " + $('#egonetwork').val());
            document.applets[0].appletController("egonetwork","on","","");
         }
         else
         {
            //alert("Selection Changed - off");
            document.applets[0].appletController("egonetwork","off","","");
         }
}
    
function snappviz_ZoomIn()
{
        //alert("Zoom In");
        document.applets[0].appletController("zoomin","","","");
}
    
function snappviz_ZoomOut()
{
        document.applets[0].appletController("zoomout","","","");
        //alert("Zoom Out");
}
   
function snappviz_shownameschange(selectiontype_obj)
{
        if(jQuery('#shownames').is(':checked')) {
            //alert("Selection Changed - " + $('#shownames').val());
            document.applets[0].appletController("shownames","on","","");
         }
         else
         {
            //alert("Selection Changed - off");
            document.applets[0].appletController("shownames","off","","");
         }
}

function snappviz_scalenodeschange(selectiontype_obj)
{
        if(jQuery('#scalenodes').is(':checked')) {
            //alert("Selection Changed - " + $('#scalenodes').val());
            document.applets[0].appletController("scalenodes","on","","");
         }
         else
         {
            //alert("Selection Changed - off");
            document.applets[0].appletController("scalenodes","off","","");
         }
}
    
function snappviz_showpostschange(selectiontype_obj)
{
        if(jQuery('#showposts').is(':checked')) {
            //alert("Selection Changed - " + $('#showposts').val());
            document.applets[0].appletController("showposts","on","","");
         }
         else
         {
            //alert("Selection Changed - off");
            document.applets[0].appletController("showposts","off","","");
         }
}
    
function snappviz_scaleconnectionschange(selectiontype_obj)
{
        if(jQuery('#scaleconnections').is(':checked')) {
            //alert("Selection Changed - " + $('#scaleconnections').val());
            document.applets[0].appletController("scaleconnections","on","","");
         }
         else
         {
            //alert("Selection Changed - off");
            document.applets[0].appletController("scaleconnections","off","","");
         }
}
    
function snappviz_connectiontypechange()
{
        //alert(jQuery("input[name=connectiontype]:checked").val());
        if(jQuery("input[name=connectiontype]:checked").val()=="line")
        {
            //alert("Connection Type = line");
            document.applets[0].appletController("linetype","line","","");
        }
        else 
        {
            //alert("Connection Type = cubic");
            document.applets[0].appletController("linetype","cubic","","");
        }
}
    
function snappviz_filtervaluechange()
{
        //alert("Filter Value:" + $("#filtervalue").val());
        //alert($("#filteroperator").val() + " " + $("#filtervalue").val());
         document.applets[0].appletController("filtering","on",jQuery("#filteroperator").val(),jQuery("#filtervalue").val());
         jQuery('#enablefiltering').attr('checked', true);
}
    
function snappviz_enablefiltering(selectiontype_obj)
{
        //alert("Filter Value:" + $("#filtervalue").val());
        //alert($("#filteroperator").val() + " " + $("#filtervalue").val());
        if(jQuery('#enablefiltering').is(':checked'))
        {
            //alert("Connection Type = line");
            document.applets[0].appletController("filtering","on",jQuery("#filteroperator").val(),jQuery("#filtervalue").val());
        }
        else 
        {
            //alert("Connection Type = cubic");
            document.applets[0].appletController("filtering","off",jQuery("#filteroperator").val(),jQuery("#filtervalue").val());
        }
}
    
function snappviz_datefilter()
{
        var startdate = jQuery("#FilterStartDate").val();
        var enddate = jQuery("#FilterEndDate").val();
        if(jQuery('#enabledatefiltering').is(':checked'))
        {
            if (!startdate==""||!enddate=="")
            {
              document.applets[0].appletController("datefiltering","on",jQuery("#FilterStartDate").val(),jQuery("#FilterEndDate").val());
            }
            else
            {
              alert("Please enter either a start or end date.");
              jQuery('#enabledatefiltering').attr('checked', false);
              document.applets[0].appletController("datefiltering","off","","");
            }
            //alert("Connection Type = line");  
        }
        else
        {
              jQuery('#enabledatefiltering').attr('checked', false);
              document.applets[0].appletController("datefiltering","off","","");
        }
}
    
function snappviz_LaunchAnimation()
{
      openSNAPPEvolutions();
      //document.applets[0].appletController("networkevolution","on","","");
}

function snappviz_Export()
{
  
      var file_extension =  jQuery("#fileext:checked").val();
      if (file_extension=="png")
      {
        document.exportform.imagedata.value=document.applets[0].exportFromSNAPP("image","png");//document.tempdatastore.png_store.value;

        //alert("PNG:" + document.applets[0].exportFromSNAPP("image","png"));
      }
      else if(file_extension=="jpg")
      {
        document.exportform.imagedata.value=document.applets[0].exportFromSNAPP("image","jpg");//document.tempdatastore.jpg_store.value;
       

        //alert("JPG:" +  document.applets[0].exportFromSNAPP("image","jpg"));
      }
      else if(file_extension=="vna")
      {
        //document.exportform.imagedata.value=document.tempdatastore.vna_store.value;
        document.exportform.imagedata.value=document.applets[0].exportFromSNAPP("vna","");
      }
      else if(file_extension=="gefx")
      {
        //document.exportform.imagedata.value=document.tempdatastore.vna_store.value;
        document.exportform.imagedata.value=document.applets[0].exportFromSNAPP("gefx","");
      }
      else if(file_extension=="gefxd")
      {
        //document.exportform.imagedata.value=document.tempdatastore.vna_store.value;
        document.exportform.imagedata.value=document.applets[0].exportFromSNAPP("gefxd","");
      }
      document.exportform.submit();
      
      //document.tempdatastore.jpg_store.value=document.applets[0].exportFromSNAPP("image","jpg");
      //document.tempdatastore.png_store.value=document.applets[0].exportFromSNAPP("image","png");
}

/* End SNAPP Viz Control JS */


function setMinMaxFormDates()
{
   document.DateFiltersForm.fromDate.value = document.applets[0].GetMinPostDate(1);
   document.DateFiltersForm.toDate.value = document.applets[0].GetMaxPostDate(1);
}
	//var gtmp = "";		
function AddPost(from_person, to_person, sent_date_time, forum_id, lms_type)
{
    //gtmp += from_person + " " + to_person + " " + sent_date_time + " " +  String(forum_id) + " " +  lms_type + "\n";
    //alert(from_person + " " + to_person + " " + sent_date_time + " " +  String(forum_id) + " " +  lms_type);
	  //document.applets[0].AddPost(from_person, to_person, sent_date_time, String(forum_id), lms_type);
	  
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
  
  
  //buildZoomGraph(GetPostCountsPerForumByDate(1,startDate,endDate));
  
  //var tmp = document.applets[0].GetPostDates("1");
  //alert(tmp);
  //return tmp;
  //document.snappdbresults.results.value = tmp;
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
				//alert(cols[j].innerHTML);
				columnWithLink = cols[j].getElementsByTagName("a");
				//alert(columnWithLink.length)
				relationship = columnWithLink[columnWithLink.length-1].getAttribute("href");
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
		AddPost(posted_by, reply_to, posted_on, 1, "Blackboard");

		totalposts = totalposts + 1;
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

function PerformSocialAnalysisD2L_ReadingStyle()
{
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
  var tble = jQuery("#z_p");//document.getElementById("z_p"); //document.getElementsByTagName("table")[0];//document.getElementById("datatable");
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
      if (imgfile.indexOf("/d2l/img/27698.gif")!=-1)
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
    //alert("Pre second loop");
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
        if (j == (cols.length - 3))
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
      if (j == (cols.length - 2)) 
      {
        posted_on = stripHTML(cols[j].innerHTML);
        //alert(posted_on);
      }
    }
    
    //alert("posted_on:" + posted_on);
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

/*
function PerformSocialAnalysisMoodle() 
{
  allForumPostsTables = jQuery(".forumpost");
  
  for (i=0; i < allForumPostsTables.length; i++)
  {
    currentPost = allForumPostsTables[i];
    authorObj = jQuery(".author",currentPost)
    posted_by = authorObj[0].innerHTML;
    posted_by = posted_by.substring(posted_by.indexOf('>')+1,posted_by.length);
	  posted_by = posted_by.substring(0,posted_by.indexOf('<'));
    
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
    //alert("postedby:" + posted_by);
    //alert("postedon:" + posted_on);
    
    commandsObj = jQuery(".commands",currentPost);
    commandLinkObj = jQuery("a",commandsObj[0]);
	// 'Edit' and 'Reply' link positions vary based on access rights
	// Find link with 'Edit' in text
	post_idLinkObj = jQuery("a:contains('Edit')",commandsObj[0]);
	// Find link with 'Reply' in text
	reply_idLinkObj = jQuery("a:contains('Reply')",commandsObj[0]);
	
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
     	reply_id = reply_id.substring(reply_id.indexOf('=')+1,reply_id.length); //Some versions of Moodle may need indexOf # + 2 positions
	}

    //alert("postid:" + post_id + " replyid:" + reply_id);
    
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
		
	//AddPost(posted_by, reply_to, posted_on, 1);
	AddPost(posted_by, reply_to, posted_on, 1, "Moodle");
  }
  
}
*/
/*
function buildVisualization()
{
	var BuildVisulizationHTML = "";
  	BuildVisulizationHTML += '<applet mayscript="true" codebase="'+ serverPath + '" code="SNAPP.PluggableRendererDemo" archive="jar/colt.jar,jar/commons-collections.jar,jar/jung-1.7.6.jar,jar/commons-codec-1.3.jar,jar/snapp_15.jar" width="900" height="700">';
  	BuildVisulizationHTML += '<param name="sna" value="' + GenerateGraphML() +'" />';
	BuildVisulizationHTML += ' To view this content, you need to install Java from <a href="http://java.com">java.com</a>';
	BuildVisulizationHTML += '</applet>';
	return BuildVisulizationHTML;
}
*/

function buildVisualization()
{
  //alert("forumPostDataStructure: " + forumPostDataStructure);
  var param1 = Base64.encode(forumPostDataStructure);
  
  //alert(param1);
  
	var BuildVisulizationHTML = "";

  BuildVisulizationHTML += '<table>';
  BuildVisulizationHTML += '<tr>';
  BuildVisulizationHTML += '<td colspan="2">';
  BuildVisulizationHTML += '<div id="PostsOverTime" style="margin-top:2px; margin-left:2px; width:100%; height:100px;"></div>';
  BuildVisulizationHTML += '<td>';
  BuildVisulizationHTML += '</tr>';
  BuildVisulizationHTML += '<tr>';
  BuildVisulizationHTML += '<td>';
  BuildVisulizationHTML += '<applet name="SNAPPDBTest" width="700" height="500" mayscript="true" border="1" codebase="http://www.snappvis.org/SNAPP2Release/" code="SNAPP.SNAPPDisplay" archive="jar/snapp83.jar,jar/collections-generic-4.01.jar,jar/colt-1.2.0.jar,jar/commons-codec-1.3.jar,jar/concurrent-1.3.4.jar,jar/jung-algorithms-2.0.1.jar,jar/jung-api-2.0.1.jar,jar/jung-graph-impl-2.0.1.jar,jar/jung-io-2.0.1.jar,jar/jung-jai-2.0.1.jar,jar/jung-visualization-2.0.1.jar,jar/stax-api-1.0.1.jar,jar/wstx-asl-3.2.6.jar,jar/hsqldb.jar">';
  BuildVisulizationHTML += '<param name="sna" value="' + param1 +'" />';
  //BuildVisulizationHTML += '<param name="java_arguments" value="-Djnlp.packEnabled=true"/>';
  BuildVisulizationHTML += ' To view this content, you need to install Java from <a href="http://java.com">java.com</a>';
  BuildVisulizationHTML += '</applet>';
  BuildVisulizationHTML += '</td>';
  BuildVisulizationHTML += '<td>';
  BuildVisulizationHTML += buildVizControls();
  BuildVisulizationHTML += '</td>';
  BuildVisulizationHTML += '</tr>';
  BuildVisulizationHTML += '</table>';
   
	return BuildVisulizationHTML;
}

function buildVizControls()
{
  var BuildVisulizationControls = "";
  BuildVisulizationControls += '<form action="#">';
  BuildVisulizationControls += '<fieldset class="snappcontrolui">'; //background-color:#ddd;
  BuildVisulizationControls += '<legend>Controls:</legend>';
  BuildVisulizationControls += 'Selection <select id="selectiontype" onchange="snappviz_selectionchange(this);" name=""><option value="transform">Transform</option><option value="pick">Pick</option></select></label><br />';
  BuildVisulizationControls += 'Layout <select id="layout" name="" onchange="snappviz_layoutchange(this);"><option value="frlayout">Fruchterman-Reingold</option><option value="kklayout">Kamada-Kawai</option><option value="circlelayout">Circle</option><option value="springlayout">Spring</option><option value="springlayout2">Spring 2</option><option value="isomlayout">ISOM</option></select></label><br />';
  BuildVisulizationControls += '<input id="mousewheel" onchange="snappviz_mousewheelchange(this);" name="" value="1" type="checkbox" checked="checked"/> Mouse wheel zoom</label><br />';
  BuildVisulizationControls += '<input id="egonetwork" onchange="snappviz_egonetworkchange(this);" name="" value="1" type="checkbox"/> Highlight Ego Network</label><br />';
  BuildVisulizationControls += '<button type="button" onClick="snappviz_ZoomIn()" id="zoomin" class="primaryAction">Zoom In</button><button type="button" onClick="snappviz_ZoomOut()" id="zoomout" class="primaryAction">Zoom Out</button>';
  BuildVisulizationControls += '<br />';
  //BuildVisulizationControls += '<button type="button" onClick="snappviz_Export()" id="snappexport" class="primaryAction">Export</button>';
  BuildVisulizationControls += '<button type="button"  id="snappexport" class="primaryAction">Export</button>';
  //BuildVisulizationControls += '<button type="button" id="animate" onClick="snappviz_LaunchAnimation()" class="primaryAction">View Network Evolution</button>';
  BuildVisulizationControls += '</fieldset>';
  BuildVisulizationControls += '<fieldset class="snappcontrolui">';
  BuildVisulizationControls += '<legend>Filter:</legend>';
  BuildVisulizationControls += '<label for=""><input id="enablefiltering"  onChange="snappviz_enablefiltering(this);" name="" value="1" type="checkbox" /> Enable Filtering</label><br />';
  BuildVisulizationControls += '<label for=""><select id="filteroperator"  name=""><option value="LT">Less Then</option><option value="GT">Greater Then</option></select></label>';
  BuildVisulizationControls += '<label for=""><input type="text" id="filtervalue" size="5" class="suSpinButton" value="4" /></label><button type="button" onClick="snappviz_filtervaluechange()" class="primaryAction">Filter</button><br />';
  BuildVisulizationControls += '<label for=""><input id="enabledatefiltering"  onChange="snappviz_datefilter();" name="" value="1" type="checkbox" /> Enable Date Filtering</label><br />';
  BuildVisulizationControls += '<label for="FilterStartDate">Start Date: <input id="FilterStartDate" type="text" size="12"></label><br />';
  BuildVisulizationControls += '<label for="FilterEndDate">End Date: <input id="FilterEndDate" type="text" size="12"></label>';
  BuildVisulizationControls += '</fieldset>'; 
  BuildVisulizationControls += '<fieldset class="snappcontrolui">';
  BuildVisulizationControls += '<legend>People:</legend>';
  BuildVisulizationControls += '<label for=""><input id="shownames" onChange="snappviz_shownameschange(this);" name="" value="1" type="checkbox" checked="checked"/> Show Names</label><br />';
  BuildVisulizationControls += '<label for=""><input id="scalenodes" onChange="snappviz_scalenodeschange(this);" name="" value="1" type="checkbox" checked="checked"/> Scale Nodes by Numbers of Posts</label>';
  BuildVisulizationControls += '</fieldset>';
  BuildVisulizationControls += '<fieldset  class="snappcontrolui">';
  BuildVisulizationControls += '<legend>Connections:</legend>';
  BuildVisulizationControls += '<label for=""><input id="showposts"  onChange="snappviz_showpostschange(this);" name="" value="1" type="checkbox" checked="checked"/> Show Posts between Participants</label><br />';
  BuildVisulizationControls += '<label for=""><input id="scaleconnections" onChange="snappviz_scaleconnectionschange(this);" name="" value="1" type="checkbox" /> Scale Connections by No Posts</label><br />';
  BuildVisulizationControls += 'Line Type';
  BuildVisulizationControls += '<label for=""><input id="connectiontype" onChange="snappviz_connectiontypechange()" name="connectiontype" value="line" type="radio" checked="checked"/> Line</label>';
  BuildVisulizationControls += '<label for=""><input id="connectiontype" onChange="snappviz_connectiontypechange()" name="connectiontype" value="cubic" type="radio" /> Cubic</label>';
  BuildVisulizationControls += '</fieldset>';
  BuildVisulizationControls += '</form>';

  return BuildVisulizationControls;
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
	alert("Called from Applet - too late");
	return "Hello from JS";
}

function buildHelp()
{
	var BuildExportHTML = "";
	BuildExportHTML += '<p><iframe src="'+ serverPath + "help.html" + '" width="90%" height="400px" frameborder="0" /></p>'

	return BuildExportHTML;
}

function buildCredits()
{
	var BuildExportHTML = "";
	BuildExportHTML += '<p><iframe src="'+ serverPath + "credits.html" + '" width="90%" height="400px" frameborder="0" /></p>'

	return BuildExportHTML;
}

/*
function buildExport()
{
	BuildExportHTML = "";
	BuildExportHTML += "<h3>GraphML Output</h3>";
	BuildExportHTML += "<textarea rows='15' cols='100'>" + GenerateGraphML2(forumusers,replies) + "</textarea>"; // GenerateGraphML2(forumusers,replies)

	BuildExportHTML += "<h3>VNA File Format</h3>";
	BuildExportHTML += "<textarea rows='15' cols='100'>" + GenerateVNAFileFormat(forumusers,replies) + "</textarea><br>";
	BuildExportHTML += "Note: VNA Format is used by <a href='http://www.analytictech.com/Netdraw/netdraw.htm'>NetDraw</a>";
	return BuildExportHTML;
}
*/
function buildExport()
{
  BuildExportHTML = "";
  BuildExportHTML += '<div id="dialog-form" title="Export">';

  BuildExportHTML += '<form name="exportform" method="post" action="http://www.snappvis.org/FileSaver/FileSave.php">';
  BuildExportHTML += 'Export As:<br/>';
  BuildExportHTML += '<input type="radio" id="fileext" checked name="fileext" value="jpg"> Image (.jpg)<br/>';
  BuildExportHTML += '<input type="radio" id="fileext" name="fileext" value="png"> Image (.png)<br/>';
  BuildExportHTML += '<input type="radio" id="fileext" name="fileext" value="vna"> NetDraw (.vna)<br/>';
  BuildExportHTML += '<input type="radio" id="fileext" name="fileext" value="gefx"> Gephi Gefx (.gefx)<br/>';
  BuildExportHTML += '<input type="radio" id="fileext" name="fileext" value="gefxd"> Gephi Dynamic Gefx (.gefx)<br/>';
  BuildExportHTML += '<input type="hidden" name="imagedata">';
  BuildExportHTML += '<input type="button" name="export_btn" onClick="snappviz_Export()" value="Export">';
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


function embedapplet(divid)
{
  BuildSNAHTML = "";
  BuildSNAHTML = BuildSNAHTML + '<div id="SNAPP" class="formArea">';
  BuildSNAHTML = BuildSNAHTML + '<span class="formTitle">';
  BuildSNAHTML = BuildSNAHTML + 'Social Networks Adapting Pedagogical Practice (SNAPP) Revolutions';
  BuildSNAHTML = BuildSNAHTML + '</span>';
  BuildSNAHTML = BuildSNAHTML + buildVisualization();
  BuildSNAHTML = BuildSNAHTML + '<div id="DateFilters">';
  
  BuildSNAHTML += '<form name="DateFiltersForm">';
  BuildSNAHTML += 'From:  <input type="text" id="fromDate" name="fromDate"> ';
  BuildSNAHTML += 'To:  <input type="text" id="toDate" name="toDate">';
  BuildSNAHTML += '  <input type="button" value="Filter By Date" onclick="SNAPP_FilterByDate(1)">';
  BuildSNAHTML += '</form>';
  
  BuildSNAHTML = BuildSNAHTML + '</div>';
  BuildSNAHTML = BuildSNAHTML + '<div id="SNAPPDataGrid">';
  BuildSNAHTML = BuildSNAHTML + '</div>';
  
  BuildSNAHTML = BuildSNAHTML + '<div id="center"><div id="fig">';
  BuildSNAHTML = BuildSNAHTML +   '<div style="text-align:right;padding-right:20;">';
  BuildSNAHTML = BuildSNAHTML +     '<input checked id="scale" type="checkbox" onchange="vis.render()"><label for="scale">Scale to fit</label>';
  BuildSNAHTML = BuildSNAHTML +   '</div>';
  BuildSNAHTML = BuildSNAHTML + '</div></div>';
  
  BuildSNAHTML = BuildSNAHTML + '<div id="SNAPPPostsZoomGraph">';
  BuildSNAHTML = BuildSNAHTML + '</div>';
  BuildSNAHTML = BuildSNAHTML + '</div>';

  var snaInterface = document.createElement("div");
  snaInterface.id = "SNAPPContainer";
  
  //insertSpot = document.getElementById('pages');
  //insertSpot.appendChild(snaInterface);
  jQuery.noConflict();
  jQuery(divid).append(snaInterface);
  //snaInterface.innerHTML = BuildSNAHTML;
  jQuery("#SNAPPContainer").html(BuildSNAHTML);
}

function BuildSNAPP2InterfaceHTML()
{
  BuildSNAHTML = "";
  BuildSNAHTML = BuildSNAHTML + '<div id="SNAPP" class="formArea">';
  BuildSNAHTML = BuildSNAHTML + '<span class="formTitle">';
  BuildSNAHTML = BuildSNAHTML + 'Social Networks Adapting Pedagogical Practice (SNAPP)';
  BuildSNAHTML = BuildSNAHTML + '</span>';
  BuildSNAHTML = BuildSNAHTML + '<div class="previewbox">';
  BuildSNAHTML = BuildSNAHTML + '<table border="0" cellpadding="4">';
  BuildSNAHTML = BuildSNAHTML + '<tr><td>Participants</td><td>' + '<span id="no_participants"></span>' + '</td></tr>';
  BuildSNAHTML = BuildSNAHTML + '<tr><td>Posts</td><td>' + '<span id="no_posts"></span>' + '</td></tr>';
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
  //alert("makeSNAInterface called");
  BuildSNAHTML = BuildSNAPP2InterfaceHTML();

  var snaInterface = document.createElement("div");
  snaInterface.id = "SNAPPContainer";
  
  //insertSpot = document.getElementById('pages');
  //insertSpot.appendChild(snaInterface);
  jQuery.noConflict();
  jQuery(divid).append(snaInterface);
  //snaInterface.innerHTML = BuildSNAHTML;
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
        //plot10.replot();
    }

});


  
  
  jQuery("#filtervalue").spinbox(); 
  /*
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
 */
  //$("#SNAPPVIZ").html(buildVisualization());
  
  isAppletLoaded();
  //alert(forumPostDataStructure);
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

var globalBBForumThreadList;
var globalBBCurrentThreadIndex = 0;
var bbThreadcourse_id;
var bbThreadconf_id;
var bbThreadforum_id;

function BBMultiForumMiner(forum_id,conf_id,course_id,threadListString)
{
			threadList = new Array(threadListString);
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
	var html = jQuery.ajax({url: threadURL,
							success: function(html)
									 {
									 		//alert(html);
											jQuery("#SNAPPTempContainer").html(html);
											PerformSocialAnalysisBlackboardV9();
											globalBBCurrentThreadIndex = globalBBCurrentThreadIndex + 1;
											if (!globalBBCurrentThreadIndex>=globalBBForumThreadList.length)
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

// D2L Multiple Thread Miner

var globalD2LTopicList = new Array();
var globalD2LParentTopicList = new Array();
var globalD2LLinkTypeList = new Array();
var globalD2LCurrentTopicIndex = 0;
var D2L_ou;

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
}

function retrieveD2LForumThread()
{

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


  var html = jQuery.ajax({url: threadURL,
              success: function(html)
                   {

                      jQuery("#SNAPPTempContainer").html(jQuery("#z_p", html)); //# d_content_r_p
                      
                      // Get extra pages
                      //var formpost_obj = jQuery("#d2l_form", html);
                        if (globalD2LLinkTypeList[globalD2LCurrentTopicIndex] == "p")
                        {

                          var opts = jQuery("#z_ga option"); // z_ds
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
                              globalD2LTopicList[globalD2LTopicList.length] = fullpage_lnk;
                              // Set linktype to l
                              globalD2LLinkTypeList[globalD2LTopicList.length] = "l";
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

function D2LMultiForumMinerCompleted()
{
      jQuery("#SNAPPTempContainer").html("");
      jQuery("#SNAPPLoading").html("");
      // Display the interface
      makeSNAInterface("body");
      //scroll to where SNA Data is inserted
      setTimeout('SetScrollPosition("SNAPP");',3);
}



function displaySNAPP()
{
	jQuery('#container-1 > ul').tabs();
  
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
}