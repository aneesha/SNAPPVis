package SNAPP;

import java.text.DecimalFormat;
import java.util.*;
import java.sql.ResultSet;

import java.sql.SQLException;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;

import SNAPP.DBAccess;

public class SNAPPDatabase {
	
	private DBAccess db = null;
	
	public SNAPPDatabase()
	{
		try {	
        	Random randomGenerator = new Random();
            int randomInt = randomGenerator.nextInt(50000);
            db = new DBAccess("SNAPP_"+ randomInt);
            
            CreateTables();
        } 
		catch (Exception ex1) 
        {
        	System.out.println("EXCEPTION: " + ex1.getMessage());
            return;                
        }
	}
	
    public void CreateTables()
    {
        try 
        {
        	// Create table to store forums
        	db.update("CREATE TABLE forums_table ( id INTEGER IDENTITY, forum_title VARCHAR(500), lmsforum_id VARCHAR(500))" );
        	// Create table to store posts-reply relationships
        	db.update("CREATE TABLE posts_table ( id INTEGER IDENTITY, posted_by VARCHAR(500), replied_to VARCHAR(500), date_sent DATE, time_sent TIME, lmsforum_id VARCHAR(500))" );
        	// Create table to store annotations
        	db.update("CREATE TABLE annotations_table ( id INTEGER IDENTITY, annotation VARCHAR(1000), intervention_date DATE, intervention_time TIME, lmsforum_id VARCHAR(500))" );
        } 
        catch (Exception ex2) {
        	System.out.println("EXCEPTION: " + ex2.getMessage());

        }
    }
    
    public void UpdateForum(String forum_title, String lmsforum_id)
    {
    	String UpdateForumQuery;
    	UpdateForumQuery = "INSERT INTO forums_table(forum_title, lmsforum_id) VALUES('" + forum_title + "','" + lmsforum_id + "')";
    	
    	UpdateForumQuery = "UPDATE forums_table SET forum_title='" + forum_title + ", lmsforum_id='" + lmsforum_id + " WHERE lmsforum_id='" + lmsforum_id + "'";
        try 
        {
        	db.update(UpdateForumQuery);
        } 
        catch (Exception ex2) {
        	System.out.println("EXCEPTION: " + ex2.getMessage());

        }
    }
    
    public void AddForum(String forum_title, String lmsforum_id)
    {
    	String AddForumQuery;
    	AddForumQuery = "INSERT INTO forums_table(forum_title, lmsforum_id) VALUES('" + forum_title + "','" + lmsforum_id + "')";
        try 
        {
        	db.update(AddForumQuery);
        } 
        catch (Exception ex2) {
        	System.out.println("EXCEPTION: " + ex2.getMessage());

        }
    }
    
    public void AddAnnotation(String annotation, String intervention_date, String lmsforum_id)
    {
    	String AddForumQuery;
    	try 
        {
    	intervention_date = SNAPP.Utils.DateTimeParse(intervention_date,"US");
    	System.out.println("Intervention Date: " + intervention_date);
    	AddForumQuery = "INSERT INTO annotations_table(annotation, intervention_date, lmsforum_id) VALUES('" + annotation + "','" + intervention_date + "','" + lmsforum_id + "')";
        
        	db.update(AddForumQuery);
        } 
        catch (Exception ex2) {
        	System.out.println("EXCEPTION: " + ex2.getMessage());

        }
    }
    
    public void AddPost(String person, String replyto_person, String Date_Sent, String Time_Sent, String lmsforum_id, String LMSType)
    {

    	String AddPostQuery;
    	Date_Sent = SNAPP.Utils.DateTimeParse(Date_Sent,LMSType);
    	//System.out.println("Date_Sent:" + Date_Sent);
    	AddPostQuery = "INSERT INTO posts_table(posted_by, replied_to, date_sent, time_sent, lmsforum_id) VALUES('" + person + "','" + replyto_person + "','" + Date_Sent + "','" + Time_Sent + "','" + lmsforum_id + "')";
        try 
        {
        	db.update(AddPostQuery);
        } 
        catch (Exception ex2) {
        	System.out.println("EXCEPTION - Add Post: " + ex2.getMessage());

        }
    }
	
    public String GetPosts(String lmsforum_id, String Start_Date, String End_Date, String ReturnDataType)
    {
    	String Posts = "";
    	String PostsQuery;
    	String DateRangeClause = "";
    	if (Start_Date.equals("")&&(!End_Date.equals("")))
    	{
    		// Start Date is blank but End Date is not
    		DateRangeClause = "and date_sent <= '" + End_Date + "'";
    	}
    	else if ((!Start_Date.equals(""))&&(End_Date.equals("")))
    	{
    		// Start_Date is not blank but End Date is
    		DateRangeClause = "and date_sent >= '" + Start_Date + "'";
    	}
    	else if ((!Start_Date.equals(""))&&(!End_Date.equals("")))
    	{
    		// Start_Date is not blank but End Date is not blank
    		DateRangeClause = "and date_sent between '" + Start_Date + "' and '" + End_Date + "'";
    	}
    	
    	if (lmsforum_id == "0")
    	{
    		PostsQuery = "SELECT * FROM posts_table WHERE " + DateRangeClause;
    	}
    	else
    	{
    		PostsQuery = "SELECT * FROM posts_table WHERE lmsforum_id='" + lmsforum_id + "' " + DateRangeClause;
    	}
        try 
        {
        	Posts = db.query(PostsQuery);
        } 
        catch (Exception ex2) {
        	System.out.println("EXCEPTION: " + ex2.getMessage());

        }
    	return Posts;
    }
    
    public String GetMinPostDate(String lmsforum_id)
    {
    	String MinDate = "";
    	String PostsQuery;
    	
    	PostsQuery = "SELECT MIN(date_sent) FROM posts_table WHERE lmsforum_id='" + lmsforum_id + "'";
    	
        try 
        {
        	MinDate = db.querySingleValue(PostsQuery);
        } 
        catch (Exception ex2) {
        	System.out.println("EXCEPTION: " + ex2.getMessage());
        }
    	return MinDate;
    }
    
    public String GetMaxPostDate(String lmsforum_id)
    {
    	String MaxDate = "";
    	String PostsQuery;
    	
    	PostsQuery = "SELECT MAX(date_sent) FROM posts_table WHERE lmsforum_id='" + lmsforum_id + "'";
    	
        try 
        {
        	MaxDate = db.querySingleValue(PostsQuery);
        } 
        catch (Exception ex2) {
        	System.out.println("EXCEPTION: " + ex2.getMessage());
        }
    	return MaxDate;
    }

    public boolean DeletePosts(String lmsforum_id)
    {
    	String DeletePostsQuery;
    	boolean hasBeenDeleted = false;
    	
    	DeletePostsQuery = "DELETE FROM posts_table WHERE lmsforum_id='" + lmsforum_id + "'";
    	
        try 
        {
        	hasBeenDeleted = db.delete(DeletePostsQuery);
        } 
        catch (Exception ex2) {
        	System.out.println("EXCEPTION: " + ex2.getMessage());

        }
    	return hasBeenDeleted;
    }
    
    public String GetForums()
    {
    	String Forums = "";
    	String ForumsQuery;

    	ForumsQuery = "SELECT * FROM forums_table";

        try 
        {
        	Forums = db.query(ForumsQuery);
        } 
        catch (Exception ex2) {
        	System.out.println("EXCEPTION: " + ex2.getMessage());

        }
    	return Forums;
    }
    
    public String GetUserPostsPerForum(String username)
    {
    	//SELECT Customer,SUM(OrderPrice) FROM Orders GROUP BY Customer
    	String UserPostsPerForum = "";
    	String UserPostsPerForumQuery;

    	UserPostsPerForumQuery = "SELECT COUNT(posted_by),lmsforum_id FROM posts_table WHERE posted_by='"+ username + "'  GROUP BY lmsforum_id";

        try 
        {
        	UserPostsPerForum = db.query(UserPostsPerForumQuery);
        } 
        catch (Exception ex2) {
        	System.out.println("EXCEPTION: " + ex2.getMessage());

        }
    	return UserPostsPerForum;
    }
    
    public String GetPostCountsPerForum(String lmsforum_id)
    {
    	String UserPostsPerForum = "";
    	String UserPostsPerForumQuery;

    	UserPostsPerForumQuery = "SELECT posted_by, COUNT(posted_by) FROM posts_table WHERE lmsforum_id='" + lmsforum_id + "' GROUP BY posted_by";

        try 
        {
        	UserPostsPerForum = db.query(UserPostsPerForumQuery);
        } 
        catch (Exception ex2) {
        	System.out.println("EXCEPTION: " + ex2.getMessage());

        }
    	return UserPostsPerForum;
    }
    
    public ResultSet GetPostCountsPerUser(String lmsforum_id)
    {
    	//SELECT Customer,SUM(OrderPrice) FROM Orders GROUP BY Customer
    	ResultSet UserPostsPerForumRS = null;
    	String UserPostsPerForumQuery;

    	UserPostsPerForumQuery = "SELECT posted_by, COUNT(posted_by), MIN(date_sent) FROM posts_table WHERE lmsforum_id='" + lmsforum_id + "' GROUP BY posted_by";

        try 
        {
        	UserPostsPerForumRS = db.queryRS(UserPostsPerForumQuery);
        } 
        catch (Exception ex2) {
        	System.out.println("EXCEPTION: " + ex2.getMessage());

        }
    	return UserPostsPerForumRS;
    }
    //////
    public ResultSet GetFirstPostDatePerUser(String lmsforum_id)
    {
    	ResultSet UserPostsPerForumRS = null;
    	String UserPostsPerForumQuery;

    	UserPostsPerForumQuery = "SELECT posted_by, MIN(date_sent) FROM posts_table WHERE lmsforum_id='" + lmsforum_id + "' GROUP BY posted_by";

        try 
        {
        	UserPostsPerForumRS = db.queryRS(UserPostsPerForumQuery);
        } 
        catch (Exception ex2) {
        	System.out.println("EXCEPTION: " + ex2.getMessage());

        }
    	return UserPostsPerForumRS;
    }
    
    public ResultSet GetPostCountsPerUserByDate(String Start_Date, String End_Date, String lmsforum_id)
    {
    	ResultSet UserPostsPerForumRS = null;
    	String UserPostsPerForumQuery;
    	
    	String DateRangeClause = "";
    	
    	if (Start_Date.equals("")&&(!End_Date.equals("")))
    	{
    		// Start Date is blank but End Date is not
    		DateRangeClause = "AND date_sent <= '" + End_Date + "'";
    	}
    	else if ((!Start_Date.equals(""))&&(End_Date.equals("")))
    	{
    		// Start_Date is not blank but End Date is
    		DateRangeClause = "AND date_sent >= '" + Start_Date + "'";
    	}
    	else if ((!Start_Date.equals(""))&&(!End_Date.equals("")))
    	{
    		// Start_Date is not blank but End Date is not blank
    		DateRangeClause = "AND date_sent between '" + Start_Date + "' and '" + End_Date + "'";
    	}

    	UserPostsPerForumQuery = "SELECT posted_by, COUNT(posted_by) FROM posts_table WHERE lmsforum_id='" + lmsforum_id + "' " + DateRangeClause +  " GROUP BY posted_by";

        try 
        {
        	UserPostsPerForumRS = db.queryRS(UserPostsPerForumQuery);
        } 
        catch (Exception ex2) {
        	System.out.println("EXCEPTION: " + ex2.getMessage());

        }
    	return UserPostsPerForumRS;
    }
    
    public String GetPostDates(String lmsforum_id)
    {
    	//SELECT Customer,SUM(OrderPrice) FROM Orders GROUP BY Customer
    	String UserPostsPerForum = "";
    	String UserPostsPerForumQuery;

    	UserPostsPerForumQuery = "SELECT posted_by, date_sent FROM posts_table WHERE lmsforum_id='" + lmsforum_id + "'";

        try 
        {
        	UserPostsPerForum = db.query(UserPostsPerForumQuery);
        } 
        catch (Exception ex2) {
        	System.out.println("EXCEPTION: " + ex2.getMessage());

        }
    	return UserPostsPerForum;
    }
    
    public String GetPostCountsPerForumByDate(String lmsforum_id, String Start_Date, String End_Date)
    {

    	String UserPostsPerForum = "";
    	String DateRangeClause = "";
    	if (Start_Date.equals("")&&(!End_Date.equals("")))
    	{
    		// Start Date is blank but End Date is not
    		DateRangeClause = "AND date_sent <= '" + End_Date + "'";
    	}
    	else if ((!Start_Date.equals(""))&&(End_Date.equals("")))
    	{
    		// Start_Date is not blank but End Date is
    		DateRangeClause = "AND date_sent >= '" + Start_Date + "'";
    	}
    	else if ((!Start_Date.equals(""))&&(!End_Date.equals("")))
    	{
    		// Start_Date is not blank but End Date is not blank
    		DateRangeClause = "AND date_sent between '" + Start_Date + "' and '" + End_Date + "'";
    	}
    	
    	
    	String UserPostsPerForumQuery;

    	//UserPostsPerForumQuery = "SELECT posted_by, COUNT(posted_by) FROM posts_table WHERE lmsforum_id='" + lmsforum_id + "' " + DateRangeClause + " GROUP BY posted_by";
    	UserPostsPerForumQuery = "SELECT date_sent, COUNT(date_sent) FROM posts_table WHERE lmsforum_id='" + lmsforum_id + "' " + DateRangeClause + " GROUP BY date_sent ORDER BY date_sent";
    	
    	
        try 
        {
        	UserPostsPerForum = db.queryToJS(UserPostsPerForumQuery);
        } 
        catch (Exception ex2) {
        	System.out.println("EXCEPTION: " + ex2.getMessage());
        }
    	return UserPostsPerForum;
    }
    
    
    public String GetPostCountsPerForum(String lmsforum_id, String Start_Date, String End_Date)
    {
    	//SELECT Customer,SUM(OrderPrice) FROM Orders GROUP BY Customer
    	String UserPostsPerForum = "";
    	String DateRangeClause = "";
    	if (Start_Date.equals("")&&(!End_Date.equals("")))
    	{
    		// Start Date is blank but End Date is not
    		DateRangeClause = "AND date_sent <= '" + End_Date + "'";
    	}
    	else if ((!Start_Date.equals(""))&&(End_Date.equals("")))
    	{
    		// Start_Date is not blank but End Date is
    		DateRangeClause = "AND date_sent >= '" + Start_Date + "'";
    	}
    	else if ((!Start_Date.equals(""))&&(!End_Date.equals("")))
    	{
    		// Start_Date is not blank but End Date is not blank
    		DateRangeClause = "AND date_sent between '" + Start_Date + "' and '" + End_Date + "'";
    	}
    	
    	
    	String UserPostsPerForumQuery;

    	//UserPostsPerForumQuery = "SELECT posted_by, COUNT(posted_by) FROM posts_table WHERE lmsforum_id='" + lmsforum_id + "' " + DateRangeClause + " GROUP BY posted_by";
    	UserPostsPerForumQuery = "SELECT COUNT(date_sent) FROM posts_table WHERE lmsforum_id='" + lmsforum_id + "' " + DateRangeClause + " GROUP BY date_sent ORDER BY date_sent";
    	// date_sent
    	
        try 
        {
        	UserPostsPerForum = db.querySingleValue(UserPostsPerForumQuery);
        } 
        catch (Exception ex2) {
        	System.out.println("EXCEPTION: " + ex2.getMessage());

        }
    	return UserPostsPerForum;
    }
    
     
    public ResultSet GetConnectionCountsPerForumByDate(String Start_Date, String End_Date, String lmsforum_id)
    {
    	//System.out.println("GetConnectionCountsPerForumByDate called");
    	
    	ResultSet UserPostsPerForumRS = null;
    	String DateRangeClause = "";
    	String UserPostsPerForumQuery;
    	
    	if (Start_Date.equals("")&&(!End_Date.equals("")))
    	{
    		// Start Date is blank but End Date is not
    		DateRangeClause = "AND date_sent <= '" + End_Date + "'";
    	}
    	else if ((!Start_Date.equals(""))&&(End_Date.equals("")))
    	{
    		// Start_Date is not blank but End Date is
    		DateRangeClause = "AND date_sent >= '" + Start_Date + "'";
    	}
    	else if ((!Start_Date.equals(""))&&(!End_Date.equals("")))
    	{
    		// Start_Date is not blank but End Date is not blank
    		DateRangeClause = "AND date_sent between '" + Start_Date + "' and '" + End_Date + "'";
    	}
    	DateRangeClause += "ORDER BY date_sent ASC";
    	//UserPostsPerForumQuery = "SELECT posted_by, COUNT(posted_by) FROM posts_table WHERE lmsforum_id='" + lmsforum_id + "' " + DateRangeClause + " GROUP BY posted_by";
    	UserPostsPerForumQuery = "SELECT posted_by, replied_to, date_sent FROM posts_table WHERE lmsforum_id='" + lmsforum_id + "' " + DateRangeClause;// +  "  GROUP BY posted_by";;
    	//System.out.println("UserPostsPerForumQuery " + UserPostsPerForumQuery);
        try 
        {
        	UserPostsPerForumRS = db.queryRS(UserPostsPerForumQuery);
        	//System.out.println("UserPostsPerForumQuery Run");
        } 
        catch (Exception ex2) {
        	System.out.println("EXCEPTION GetConnectionCountsPerForumByDate: " + ex2.toString());

        }
    	return UserPostsPerForumRS;
    }
    
    public String GetUserInitiatedPostsPerForum(String username, String lmsid)
    {
    	String UserPostsPerForum = "";
    	String UserPostsPerForumQuery;

    	UserPostsPerForumQuery = "SELECT COUNT(posted_by),lmsforum_id FROM posts_table WHERE replied_to='-' AND posted_by='"+ username + "' AND lmsforum_id='"+ lmsid + "'";

        try 
        {
        	UserPostsPerForum = db.query(UserPostsPerForumQuery);
        } 
        catch (Exception ex2) {
        	System.out.println("EXCEPTION: " + ex2.getMessage());
        }
    	return UserPostsPerForum;
    }
    
    public String GetUserInitiatedPosts(String username)
    {
    	String UserPostsPerForum = "";
    	String UserPostsPerForumQuery;

    	UserPostsPerForumQuery = "SELECT COUNT(posted_by),lmsforum_id FROM posts_table WHERE replied_to='-' AND posted_by='"+ username + "'";

        try 
        {
        	UserPostsPerForum = db.query(UserPostsPerForumQuery);
        } 
        catch (Exception ex2) {
        	System.out.println("EXCEPTION: " + ex2.getMessage());
        }
    	return UserPostsPerForum;
    }
    
    public Set<String> GetUsersInForum(String lmsforum_id)
    {
    	String UsersInForumQuery1 = "";
    	String UsersInForumQuery2 = "";
    	Set<String> UsersInForum1 = new HashSet<String>();
    	Set<String> UsersInForum2 = new HashSet<String>();

    	UsersInForumQuery1 = "SELECT DISTINCT posted_by FROM posts_table WHERE posted_by!='-' AND lmsforum_id='"+ lmsforum_id + "'";
    	UsersInForumQuery2 = "SELECT DISTINCT replied_to FROM posts_table WHERE replied_to!='-' AND lmsforum_id='"+ lmsforum_id + "'";

        try 
        {
        	UsersInForum1 = db.query_set(UsersInForumQuery1);
        	UsersInForum2 = db.query_set(UsersInForumQuery2);
        	UsersInForum1.addAll(UsersInForum2);
        } 
        catch (Exception ex2) {
        	System.out.println("EXCEPTION: " + ex2.getMessage());
        }
    	return UsersInForum1;
    }
    
    public String GetAnnotations(String lmsforum_id)
    {
    	String Annotations = "";
    	String AnnotationsQuery;

    	if (lmsforum_id=="")
    	{
    		AnnotationsQuery = "SELECT intervention_date, annotation FROM annotations_table ORDER BY intervention_date ASC";
    	}
    	else
    	{
    		AnnotationsQuery = "SELECT intervention_date, annotation FROM annotations_table WHERE lmsforum_id='" + lmsforum_id + "' ORDER BY intervention_date ASC";
    	}

        try 
        {
        	Annotations = db.query(AnnotationsQuery);
        } 
        catch (Exception ex2) {
        	System.out.println("EXCEPTION From Annotations: " + ex2.toString());
        }
    	return Annotations;
    }
	
    public int GetNoPosts(String lmsforum_id)
    {
    	String PostsQuery = "";
    	int PostCount = 0;

    	if (lmsforum_id=="0")
    	{
    		PostsQuery = "SELECT COUNT(id) FROM posts_table";
    	}
    	else
    	{
    		PostsQuery = "SELECT COUNT(id) FROM posts_table WHERE lmsforum_id=" + lmsforum_id;
    	}

        try 
        {
        	PostCount = Integer.parseInt(db.querySingleValue(PostsQuery));
        } 
        catch (Exception ex2) {
        	System.out.println("EXCEPTION: " + ex2.getMessage());
        }
    	return PostCount;
    }
    
    public int GetNoParticipants(String lmsforum_id)
    {
    	int Participants = GetUsersInForum(lmsforum_id).size();
    	return Participants;
    }
    
    public Double GetNetworkDensity(String lmsforum_id)
    {
    	int n;
    	Double NetworkDensity;
    	int noConnections;
    	
    	n = GetNoParticipants(lmsforum_id);
    	
    	noConnections = GetNoPosts(lmsforum_id);
    	
    	NetworkDensity =  noConnections/((n-1.0)*n);
    	
    	return NetworkDensity;
    }
    
    public String GetMaxDate(String lmsforum_id)
    {
    	String PostsQuery = "";
    	String PostCount = "";

    	if (lmsforum_id=="0")
    	{
    		PostsQuery = "SELECT MAX(date_sent) FROM posts_table";
    	}
    	else
    	{
    		PostsQuery = "SELECT MAX(date_sent) FROM posts_table WHERE lmsforum_id=" + lmsforum_id;
    	}

        try 
        {
        	PostCount = db.querySingleValue(PostsQuery);
        } 
        catch (Exception ex2) {
        	System.out.println("EXCEPTION: " + ex2.getMessage());
        }
    	return PostCount;
    }
    
    public String GetMinDate(String lmsforum_id)
    {
    	String PostsQuery = "";
    	String PostCount = "";

    	if (lmsforum_id=="0")
    	{
    		PostsQuery = "SELECT MIN(date_sent) FROM posts_table";
    	}
    	else
    	{
    		PostsQuery = "SELECT MIN(date_sent) FROM posts_table WHERE lmsforum_id=" + lmsforum_id;
    	}

        try 
        {
        	PostCount = db.querySingleValue(PostsQuery);
        } 
        catch (Exception ex2) {
        	System.out.println("EXCEPTION: " + ex2.getMessage());
        }
    	return PostCount;
    }
}


