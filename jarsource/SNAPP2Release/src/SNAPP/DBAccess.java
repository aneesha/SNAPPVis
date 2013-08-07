package SNAPP;


import java.sql.Connection;
import java.text.SimpleDateFormat;
import java.util.Date;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashSet;
import java.util.Set;
import java.text.ParseException;


import org.hsqldb.jdbc.jdbcDataSource;

public class DBAccess {

    Connection conn; //our connnection to the db - persist for life of program

    // we dont want this garbage collected until we are done
    public DBAccess(String db_file_name_prefix) throws Exception {    // note more general exception

        // connect to the database.   This will load the db files and start the
        // database if it is not already running.
        // db_file_name_prefix is used to open or create files that hold the state
        // of the db.
        // It can contain directory names relative to the
        // current working directory
        jdbcDataSource dataSource = new jdbcDataSource();

        dataSource.setDatabase("jdbc:hsqldb:mem:" + db_file_name_prefix);

        conn = dataSource.getConnection("sa", "");
    }

    public void shutdown() throws SQLException {

        Statement st = conn.createStatement();

        // db writes out to files and performs clean shuts down
        // otherwise there will be an unclean shutdown
        // when program ends
        st.execute("SHUTDOWN");
        conn.close();    // if there are no other open connection
    }

    //use for SQL command SELECT
    public synchronized String query(String expression) throws SQLException {
    	String ResultString = "";
        Statement st = null;
        ResultSet rs = null;

        st = conn.createStatement();         // statement objects can be reused with

        // repeated calls to execute but we
        // choose to make a new one each time
        rs = st.executeQuery(expression);    // run the query

        // do something with the result set.
        ResultString = dump(rs);
        st.close();    // NOTE!! if you close a statement the associated ResultSet is
        return ResultString;
        // closed too
        // so you should copy the contents to some other object.
        // the result set is invalidated also  if you recycle an Statement
        // and try to execute some other query before the result set has been
        // completely examined.
    }
    
    public synchronized ResultSet queryRS(String expression) throws SQLException {
    	//String ResultString = "";
        Statement st = null;
        ResultSet rs = null;

        st = conn.createStatement();         // statement objects can be reused with

        // repeated calls to execute but we
        // choose to make a new one each time
        rs = st.executeQuery(expression);    // run the query

        // do something with the result set.
        //ResultString = dump(rs);
        st.close();    // NOTE!! if you close a statement the associated ResultSet is
        return rs;
    }
    
    public synchronized String querySingleValue(String expression) throws SQLException {
    	String ResultString = "";
        Statement st = null;
        ResultSet rs = null;

        st = conn.createStatement();         // statement objects can be reused with

        // repeated calls to execute but we
        // choose to make a new one each time
        rs = st.executeQuery(expression);    // run the query

        // do something with the result set.
        ResultString = singlevalue(rs);
        st.close();    // NOTE!! if you close a statement the associated ResultSet is
        return ResultString;
        // closed too
        // so you should copy the contents to some other object.
        // the result set is invalidated also  if you recycle an Statement
        // and try to execute some other query before the result set has been
        // completely examined.
    }
    
    public synchronized String queryToJS(String expression) throws SQLException, ParseException {
    	String ResultString = "";
        Statement st = null;
        ResultSet rs = null;

        st = conn.createStatement();         // statement objects can be reused with

        // repeated calls to execute but we
        // choose to make a new one each time
        rs = st.executeQuery(expression);    // run the query

        // do something with the result set.
        ResultString = ToJSArray(rs);//ToJSArrayOfObjects(rs);
        st.close();    // NOTE!! if you close a statement the associated ResultSet is
        return ResultString;
        // closed too
        // so you should copy the contents to some other object.
        // the result set is invalidated also  if you recycle an Statement
        // and try to execute some other query before the result set has been
        // completely examined.
    }
    
    public synchronized Set<String> query_set(String expression) throws SQLException {
    	Set<String> s = new HashSet<String>();
        Statement st = null;
        ResultSet rs = null;

        st = conn.createStatement();         // statement objects can be reused with

        // repeated calls to execute but we
        // choose to make a new one each time
        rs = st.executeQuery(expression);    // run the query

        // do something with the result set.
        s = dump_set(rs);
        st.close();    // NOTE!! if you close a statement the associated ResultSet is
        return s;
        // closed too
        // so you should copy the contents to some other object.
        // the result set is invalidated also  if you recycle an Statement
        // and try to execute some other query before the result set has been
        // completely examined.
    }

    //use for SQL commands CREATE, DROP, INSERT and UPDATE
    public synchronized void update(String expression) throws SQLException {

        Statement st = null;

        st = conn.createStatement();    // statements

        int i = st.executeUpdate(expression);    // run the query

        if (i == -1) {
            System.out.println("db error : " + expression);
        }

        st.close();
    }    // void update()
    
    //use for SQL commands DELETE
    public synchronized boolean delete(String expression) throws SQLException {

        Statement st = null;

        st = conn.createStatement();    // statements

        int i = st.executeUpdate(expression);    // run the query
        st.close();
        if (i == -1) {
            System.out.println("db error : " + expression);
            return false;
        }
        else if (i == 1)
        {
        	return true;
        	
        }
        else
        {
        	return false;
        }
    }

    public static String dump(ResultSet rs) throws SQLException {
    	StringBuffer result = new StringBuffer();
        
        // the order of the rows in a cursor
        // are implementation dependent unless you use the SQL ORDER statement
        ResultSetMetaData meta   = rs.getMetaData();
        int               colmax = meta.getColumnCount();
        int               i;
        Object            o = null;

        // the result set is a cursor into the data.  You can only
        // point to one row at a time
        // assume we are pointing to BEFORE the first row
        // rs.next() points to next row and returns true
        // or false if there is no next row, which breaks the loop
        for (; rs.next(); ) {
        	result.append("<tr>");
            for (i = 0; i < colmax; ++i) {
            	result.append("<td>");
                o = rs.getObject(i + 1);    // Is SQL the first column is indexed
                result.append(o.toString());
            	result.append("</td>");
                // with 1 not 0
                //System.out.print(o.toString() + " ");
                //result.append(o.toString() + " ");
            }
        	result.append("</tr>");
            //System.out.println(" ");
            result.append("\n");
        }
        return result.toString();
    }
    
    public static String singlevalue(ResultSet rs) throws SQLException {
    	
    	StringBuffer result = new StringBuffer();
        
        // the order of the rows in a cursor
        // are implementation dependent unless you use the SQL ORDER statement
        ResultSetMetaData meta   = rs.getMetaData();
        int               colmax = meta.getColumnCount();
        int               i;
        Object            o = null;

        // the result set is a cursor into the data.  You can only
        // point to one row at a time
        // assume we are pointing to BEFORE the first row
        // rs.next() points to next row and returns true
        // or false if there is no next row, which breaks the loop
        for (; rs.next(); ) {
            for (i = 0; i < colmax; ++i) {
                o = rs.getObject(i + 1);    // Is SQL the first column is indexed
                result.append(o.toString());
                // with 1 not 0
                //System.out.print(o.toString() + " ");
                //result.append(o.toString() + " ");
            }
        }
        return result.toString();
    }
    
    public static String ToJSArrayOfObjects(ResultSet rs) throws SQLException, ParseException {
    	StringBuffer result = new StringBuffer();
        
        // the order of the rows in a cursor
        // are implementation dependent unless you use the SQL ORDER statement
        ResultSetMetaData meta   = rs.getMetaData();
        int               colmax = meta.getColumnCount();
        int               i;
        Object            o = null;

        // the result set is a cursor into the data.  You can only
        // point to one row at a time
        // assume we are pointing to BEFORE the first row
        // rs.next() points to next row and returns true
        // or false if there is no next row, which breaks the loop
        result.append("[");
        for (; rs.next(); ) {
        	result.append("new postsObj(");
            for (i = 0; i < colmax; ++i) {
                o = rs.getObject(i + 1);    // Is SQL the first column is indexed
                
                if (i==0)
                {
                	SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
                    Date dateStr = formatter.parse(o.toString());
                	
                    SimpleDateFormat yr = new SimpleDateFormat("yyyy");
                    SimpleDateFormat mnth = new SimpleDateFormat("MM");
                    SimpleDateFormat day = new SimpleDateFormat("dd");
                    //System.out.println("Month " + sdf.format(date));
                	result.append("new Date(" + yr.format(dateStr) + "," + mnth.format(dateStr) + "," + day.format(dateStr) + "),");
                }
                else
                {
                	result.append(o.toString());
                }
            	
                // with 1 not 0
                //System.out.print(o.toString() + " ");
                //result.append(o.toString() + " ");
            }
            result.append("),");
            //System.out.println(" ");
            //result.append("\n");
        }
        result.append("];");
        return result.toString();
    }
    
    
    public static String ToJSArray(ResultSet rs) throws SQLException, ParseException {
    	
    	// Example Format
    	//line1=[['2008-06-30',4], ['2008-7-30',6.5], ['2008-8-30',5.7], ['2008-9-30',9], ['2008-10-30',8.2]];
    	StringBuffer result = new StringBuffer();
        
        // the order of the rows in a cursor
        // are implementation dependent unless you use the SQL ORDER statement
        ResultSetMetaData meta   = rs.getMetaData();
        int               colmax = meta.getColumnCount();
        int               i;
        Object            o = null;

        // the result set is a cursor into the data.  You can only
        // point to one row at a time
        // assume we are pointing to BEFORE the first row
        // rs.next() points to next row and returns true
        // or false if there is no next row, which breaks the loop
        result.append("[");
        for (; rs.next(); ) {
        	result.append("[");
            for (i = 0; i < colmax; ++i) {
                o = rs.getObject(i + 1);    // Is SQL the first column is indexed
                
                if (i==0)
                {
                	//SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
                    //Date dateStr = formatter.parse(o.toString());
                	
                    result.append("'" + o.toString() + "',");
                }
                else
                {
                	result.append(o.toString());
                }
            	
                // with 1 not 0
                //System.out.print(o.toString() + " ");
                //result.append(o.toString() + " ");
            }
            result.append("], ");
            //System.out.println(" ");
            //result.append("\n");
        }
        String result_str = result.toString();
        
        int result_strLen = result_str.length();
        
        result_str = result_str.substring(0, result_strLen-2);
        //System.out.println(result_strLen);
        result_str = result_str + "]";
        return result_str;
    }
    
    /* Only for single column resultsets with uniqueness */
    public static Set<String> dump_set(ResultSet rs) throws SQLException {
    	Set<String> s = new HashSet<String>();
        Object o = null;
        for (; rs.next(); ) {
        	o = rs.getObject(1);
        	s.add(o.toString());
        }
        return s;
    } 
}
