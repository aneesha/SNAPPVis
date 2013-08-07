package SNAPP;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import edu.uci.ics.jung.graph.util.EdgeType;

public class Export {

	public static String VNA(ResultSet node_rs, ResultSet connection_rs) throws SQLException
	{
		String VNA_format = "vna";
		StringBuffer vna_buffer = new StringBuffer(); 
	    Map<Integer,String> usernames = new HashMap<Integer,String>();
	    Map<String,Integer> username_lookup = new HashMap<String,Integer>();
	    Map<Integer,Integer> noposts = new HashMap<Integer,Integer>();
		
	    vna_buffer.append("*Node data\n");
	    vna_buffer.append("ID, posts\n");
	    
    	int i = 0;
        for (; node_rs.next(); ) {
            // Set no posts and name for each participants
            usernames.put(i, node_rs.getObject(1).toString());
            username_lookup.put(node_rs.getObject(1).toString(),i);
            noposts.put(i, Integer.parseInt(node_rs.getObject(2).toString()));
            String name = "\"" + node_rs.getObject(1).toString() + "\"";
            String posts = node_rs.getObject(2).toString();
            String node = name + " " + posts + "\n";
            vna_buffer.append(node);
            
            //System.out.println("VNA Users: " + usernames.get(i));
            
            i = i + 1;
            
        }
        
        // Aggregate connection count
        HashMap<String,Integer> connection_hashmap = new HashMap<String,Integer>();
        i = 0;
        for (; connection_rs.next(); ) {
            // Set connections and connection weights
        	String posted_by = connection_rs.getObject(1).toString();
        	String replied_to = connection_rs.getObject(2).toString();
        	
        	//System.out.println(posted_by + " "+ replied_to) ;
        	if (!replied_to.equals("-"))
        	{
	        	int from_node_id = username_lookup.get(posted_by);
	        	int to_node_id = username_lookup.get(replied_to);
	        	
	        	String connection_key = from_node_id + "-" + to_node_id;
	        	//String connection_key = posted_by + "-" + replied_to;
	        	
	        	if (connection_hashmap.containsKey(connection_key))
	        	{
	        		int count = connection_hashmap.get(connection_key) + 1;
	        		connection_hashmap.put(connection_key, count);
	        	}
	        	else
	        	{
	        		connection_hashmap.put(connection_key, 1);
	        	}
	        	
	            i = i + 1;
        	}
        }
        
        // Add Edges
        
	    vna_buffer.append("*Tie data\n");
	    vna_buffer.append("from, to, strength\n");
        
        // Get hashmap in Set interface to get key and value
        Set s= connection_hashmap.entrySet();

        // Move next key and value of HashMap by iterator
        Iterator it=s.iterator();
        i = 0;
        while(it.hasNext())
        {
            // key=value separator this by Map.Entry to get key and value
            Map.Entry m =(Map.Entry)it.next();

            // getKey is used to get key of HashMap
            String key = m.getKey().toString();
            String nodes[] = key.split("-");
            //Get from_node
            int from_node = Integer.parseInt(nodes[0]);
            //Get to_node
            int to_node = Integer.parseInt(nodes[1]);
            // getValue is used to get value of key in HashMap
            int weight=(Integer)m.getValue();

            //graph.addEdge(new Double(i), from_node, to_node, EdgeType.DIRECTED);
            //edge_weight.put(new Double(i), new Double(weight));
            
            String from = "\"" + usernames.get(from_node) + "\"";
            String to = "\"" + usernames.get(to_node) + "\"";
            String strength = "" + weight + "";
            
            vna_buffer.append(from + " " + to + " " + strength + "\n");
            //System.out.println(usernames.get(from));
            i = i + 1;
            //System.out.println("Key :"+key);
            //System.out.println("value :"+value);
        }

        VNA_format = vna_buffer.toString();
		return VNA_format;
		
	}
	
	
	public static String GEFX(ResultSet node_rs, ResultSet connection_rs) throws SQLException
	{
		String GEFX_format = "";
		StringBuffer GEFX_buffer = new StringBuffer(); 
	    Map<Integer,String> usernames = new HashMap<Integer,String>();
	    Map<String,Integer> username_lookup = new HashMap<String,Integer>();
	    Map<Integer,Integer> noposts = new HashMap<Integer,Integer>();
		
	    GEFX_buffer.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
	    GEFX_buffer.append("<gexf xmlns=\"http://www.gexf.net/1.2draft\" version=\"1.2\">\n");
	    GEFX_buffer.append("    <meta lastmodifieddate=\"2009-03-20\">");
	    GEFX_buffer.append("        <creator>SNAPP</creator>");
	    GEFX_buffer.append("        <description>SNAPP Generated gefx</description>");
	    GEFX_buffer.append("    </meta>\n");
	    
	    GEFX_buffer.append("<graph mode=\"static\" defaultedgetype=\"directed\">\n");
	    
	    GEFX_buffer.append("<attributes class=\"node\">");
	    GEFX_buffer.append("<attribute id=\"0\" title=\"posts\" type=\"integer\"/>");
	    GEFX_buffer.append("</attributes>\n");
	    
	    GEFX_buffer.append("<attributes class=\"edge\">");
	    GEFX_buffer.append("<attribute id=\"0\" title=\"strength\" type=\"integer\"/>");
	    GEFX_buffer.append("</attributes>\n");
	    
	    GEFX_buffer.append("<nodes>\n");
	    
    	int i = 0;
        for (; node_rs.next(); ) {
            // Set no posts and name for each participants
            usernames.put(i, node_rs.getObject(1).toString());
            username_lookup.put(node_rs.getObject(1).toString(),i);
            noposts.put(i, Integer.parseInt(node_rs.getObject(2).toString()));
            String name = "\"" + node_rs.getObject(1).toString() + "\"";
            String posts = node_rs.getObject(2).toString();
            //String node = name + " " + posts + "\n";
            
            String node = "<node id=" + name + " label=" + name + " >";
            //node =  node.replace("'", "\"");
            node += "<attvalues>";
            node += "<attvalue for=\"0\" value=\"" + posts + "\"/>";
            node += "</attvalues>";
            node += "</node>\n";
            //System.out.println("VNA Users: " + usernames.get(i));
            GEFX_buffer.append(node);
            i = i + 1;
        }
        
        GEFX_buffer.append("</nodes>\n");
        
        // Aggregate connection count
        HashMap<String,Integer> connection_hashmap = new HashMap<String,Integer>();
        i = 0;
        for (; connection_rs.next(); ) {
            // Set connections and connection weights
        	String posted_by = connection_rs.getObject(1).toString();
        	String replied_to = connection_rs.getObject(2).toString();
        	
        	//System.out.println(posted_by + " "+ replied_to) ;
        	if (!replied_to.equals("-"))
        	{
	        	int from_node_id = username_lookup.get(posted_by);
	        	int to_node_id = username_lookup.get(replied_to);
	        	
	        	String connection_key = from_node_id + "-" + to_node_id;
	        	//String connection_key = posted_by + "-" + replied_to;
	        	
	        	if (connection_hashmap.containsKey(connection_key))
	        	{
	        		int count = connection_hashmap.get(connection_key) + 1;
	        		connection_hashmap.put(connection_key, count);
	        	}
	        	else
	        	{
	        		connection_hashmap.put(connection_key, 1);
	        	}
	        	
	            i = i + 1;
        	}
        }
        
        // Add Edges
        
	    GEFX_buffer.append("<edges>\n");
        
        // Get hashmap in Set interface to get key and value
        Set s= connection_hashmap.entrySet();

        // Move next key and value of HashMap by iterator
        Iterator it=s.iterator();
        i = 0;
        while(it.hasNext())
        {
            // key=value separator this by Map.Entry to get key and value
            Map.Entry m =(Map.Entry)it.next();

            // getKey is used to get key of HashMap
            String key = m.getKey().toString();
            String nodes[] = key.split("-");
            //Get from_node
            int from_node = Integer.parseInt(nodes[0]);
            //Get to_node
            int to_node = Integer.parseInt(nodes[1]);
            // getValue is used to get value of key in HashMap
            int weight=(Integer)m.getValue();

            //graph.addEdge(new Double(i), from_node, to_node, EdgeType.DIRECTED);
            //edge_weight.put(new Double(i), new Double(weight));
            
            String from = "\"" + usernames.get(from_node) + "\"";
            String to = "\"" + usernames.get(to_node) + "\"";
            String strength = "" + weight + "";
            String edge = "<edge id=\"" + i + "\" source=" + from + " target=" + to + ">";
            edge += "<attvalues>";
            edge += "<attvalue for=\"0\" value=\"" + strength + "\"/>";
            edge += "</attvalues>";
            edge += "</edge>\n";
            GEFX_buffer.append(edge);
            
            //GEFX_buffer.append(from + " " + to + " " + strength + "\n");
            
            //System.out.println(usernames.get(from));
            i = i + 1;
            //System.out.println("Key :"+key);
            //System.out.println("value :"+value);
        }

        GEFX_buffer.append("</edges>\n");
        
	    GEFX_buffer.append("</graph>\n");
	    GEFX_buffer.append("</gexf>\n");
        
        GEFX_format = GEFX_buffer.toString();
		return GEFX_format;
		 
	}
	
	public static String GEFXD(ResultSet node_rs, ResultSet connection_rs, String MinDate, String MaxDate) throws SQLException
	{
		String GEFX_format = "vna";
		StringBuffer GEFX_buffer = new StringBuffer(); 
	    Map<Integer,String> usernames = new HashMap<Integer,String>();
	    Map<String,Integer> username_lookup = new HashMap<String,Integer>();
	    Map<Integer,Integer> noposts = new HashMap<Integer,Integer>();
		
	    
	    GEFX_buffer.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
	    GEFX_buffer.append("<gexf xmlns=\"http://www.gexf.net/1.2draft\" version=\"1.2\">");
	    GEFX_buffer.append("    <meta lastmodifieddate=\"2009-03-20\">");
	    GEFX_buffer.append("        <creator>SNAPP</creator>");
	    GEFX_buffer.append("        <description>SNAPP Generated gefx</description>");
	    GEFX_buffer.append("    </meta>");
	    
	    GEFX_buffer.append("<graph mode=\"dynamic\" defaultedgetype=\"directed\" timeformat=\"date\" start=\"" + MinDate + "\" end=\"" + MaxDate +  "\" >\n");
	    
	    //start=â€�2009âˆ’01âˆ’01â€� end=â€�2009âˆ’03âˆ’20â€�
	    
	    GEFX_buffer.append("<attributes class=\"node\" mode=\"static\" >");
	    GEFX_buffer.append("<attribute id=\"0\" title=\"posts\" type=\"integer\"/>");
	    GEFX_buffer.append("</attributes>");
	    /*
	    GEFX_buffer.append("<attributes class=\"edge\"  mode=\"dynamic\">");
	    GEFX_buffer.append("<attribute id=\"0\" title=\"strength\" type=\"integer\"/>");
	    GEFX_buffer.append("</attributes>\n");
	    */
	    GEFX_buffer.append("<nodes>\n");
	    
    	int i = 0;
        for (; node_rs.next(); ) {
            // Set no posts and name for each participants
            usernames.put(i, node_rs.getObject(1).toString());
            username_lookup.put(node_rs.getObject(1).toString(),i);
            noposts.put(i, Integer.parseInt(node_rs.getObject(2).toString()));
            String name = "\"" + node_rs.getObject(1).toString() + "\"";
            String posts = node_rs.getObject(2).toString();
            String startdate = node_rs.getObject(3).toString();
            //String node = name + " " + posts + "\n";
            
            String node = "<node id=" + name + " label=" + name + " start=\"" + startdate + "\" >";
            node += "<attvalues>";
            node += "<attvalue for=\"0\" value=\"" + posts + "\"/>";
            node += "</attvalues>";
            node += "</node>\n";
            //System.out.println("VNA Users: " + usernames.get(i));
            GEFX_buffer.append(node);
            i = i + 1;
        }
        
        GEFX_buffer.append("</nodes>\n");
        
        // Add Edges
        GEFX_buffer.append("<edges>");
        // Aggregate connection count
        //HashMap<String,Integer> connection_hashmap = new HashMap<String,Integer>();
        i = 0;
        for (; connection_rs.next(); ) {
            // Set connections and connection weights
        	String posted_by = connection_rs.getObject(1).toString();
        	String replied_to = connection_rs.getObject(2).toString();
        	String date_sent = connection_rs.getObject(3).toString();
        	
        	//System.out.println(posted_by + " "+ replied_to) ;
        	if (!replied_to.equals("-"))
        	{	
	            String edge = "<edge id=\"" + i + "\" source=\"" + posted_by + "\" target=\"" + replied_to + "\" start=\"" + date_sent + "\">";
	            //edge += "<attvalues>";
	            //edge += "<attvalue for=\"0\" value=\"" + strength + "\" start=\"" + date_sent + "\"/>";
	            //edge += "</attvalues>";
	            edge += "</edge>\n";
	            GEFX_buffer.append(edge);
	        	
	            i = i + 1;
        	}
        }

        GEFX_buffer.append("</edges>\n");
        
	    GEFX_buffer.append("</graph>\n");
	    GEFX_buffer.append("</gexf>\n");
        
        GEFX_format = GEFX_buffer.toString();
		return GEFX_format;
	}
}