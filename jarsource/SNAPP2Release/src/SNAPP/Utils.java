package SNAPP;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class Utils {
	
	public static String DateTimeParse(String DateTimeString, String LMS)
	{
		//System.out.println("DateTimeString: " + DateTimeString);
		String parsedDate = "";
		Date dte = null;
		DateFormat formatter = null;
		try
		{
			// WebCT Example: September 10, 2008 9:51 AM
			// Blackboard 22/02/10 8:37 AM
			// Moodle Tuesday, 23 February 2010, 04:11 pm
			// September 10, 2008 9:51 AM
			// Tuesday,  23 February 2010, 04:11 pm
			// E, dd MMM yyyy HH:mm:ss Z
			// D2L Jul 24, 2010 3:02 AM
			if (LMS.equals("WebCT"))
			{
				formatter = new SimpleDateFormat("MMM ddd,yyyy hh:mm a"); 
				dte = (Date)formatter.parse(DateTimeString); 
			}
			else if (LMS.equals("Moodle"))
			{
				//23 February 2010, 04:11 pm
				formatter = new SimpleDateFormat("ddd MMM yyyy, hh:mm a");
				dte = (Date)formatter.parse(DateTimeString); 
			}
			else if (LMS.equals("Blackboard"))
			{
				formatter = new SimpleDateFormat("dd/MM/yy hh:mm a");
				dte = (Date)formatter.parse(DateTimeString); 
			}
			else if (LMS.equals("D2L"))
			{
				formatter = new SimpleDateFormat("MMM ddd, yyyy hh:mm a");
				dte = (Date)formatter.parse(DateTimeString); 
			}
			else if (LMS.equals("US"))
			{
				formatter = new SimpleDateFormat("MM/dd/yyyy");
				dte = (Date)formatter.parse(DateTimeString); 
			}
			else if (LMS.equals("Angel"))
			{
				formatter = new SimpleDateFormat("dd/MM/yyyy");
				dte = (Date)formatter.parse(DateTimeString); 
			}
			
			DateFormat formatter2 = new SimpleDateFormat("yyyy-MM-dd");
			parsedDate = formatter2.format(dte);
		}
		catch (ParseException e)
		{
			
			System.out.println(e.getMessage());
		}
		return parsedDate;
	}
}
