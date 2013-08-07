package SNAPP;

import java.awt.BasicStroke;
import java.util.Iterator;
import java.net.URL;
import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.GradientPaint;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.GridLayout;
import java.awt.Label;
import java.awt.Paint;
import java.awt.Rectangle;
import java.awt.Shape;
import java.awt.Stroke;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.geom.GeneralPath;
import java.awt.geom.Point2D;
import java.awt.image.BufferedImage;
import java.beans.PropertyChangeListener;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.imageio.ImageIO;
import javax.swing.AbstractAction;
import javax.swing.AbstractButton;
import javax.swing.BorderFactory;
import javax.swing.Box;
import javax.swing.ButtonGroup;
import javax.swing.DefaultListCellRenderer;
import javax.swing.ImageIcon;
import javax.swing.JApplet;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JDialog;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JList;
import javax.swing.JPanel;
import javax.swing.JPopupMenu;
import javax.swing.JRadioButton;
import javax.swing.JSpinner;
import javax.swing.JSplitPane;
import javax.swing.JTabbedPane;
import javax.swing.JTextField;
import javax.swing.JToolBar;
import javax.swing.SpinnerModel;
import javax.swing.SpinnerNumberModel;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.collections15.Predicate;
import org.apache.commons.collections15.Transformer;
import org.apache.commons.collections15.functors.ChainedTransformer;
import org.apache.commons.collections15.functors.ConstantTransformer;
import org.apache.commons.collections15.functors.MapTransformer;

import SNAPP.SateliteViewDemo.ViewGrid;

import edu.uci.ics.jung.algorithms.layout.CircleLayout;
import edu.uci.ics.jung.algorithms.layout.FRLayout;
import edu.uci.ics.jung.algorithms.layout.GraphElementAccessor;
import edu.uci.ics.jung.algorithms.layout.ISOMLayout;
import edu.uci.ics.jung.algorithms.layout.KKLayout;
import edu.uci.ics.jung.algorithms.layout.Layout;
import edu.uci.ics.jung.algorithms.layout.SpringLayout;
import edu.uci.ics.jung.algorithms.layout.SpringLayout2;
import edu.uci.ics.jung.algorithms.scoring.BetweennessCentrality;
import edu.uci.ics.jung.algorithms.scoring.ClosenessCentrality;
import edu.uci.ics.jung.algorithms.scoring.DegreeScorer;
import edu.uci.ics.jung.algorithms.scoring.EigenvectorCentrality;
import edu.uci.ics.jung.algorithms.scoring.VoltageScorer;
import edu.uci.ics.jung.algorithms.scoring.util.VertexScoreTransformer;
import edu.uci.ics.jung.algorithms.util.SelfLoopEdgePredicate;
import edu.uci.ics.jung.graph.Graph;
import edu.uci.ics.jung.graph.SparseMultigraph;
import edu.uci.ics.jung.graph.util.Context;
import edu.uci.ics.jung.graph.util.EdgeType;
import edu.uci.ics.jung.visualization.DefaultVisualizationModel;
import edu.uci.ics.jung.visualization.GraphZoomScrollPane; 
import edu.uci.ics.jung.visualization.Layer;
import edu.uci.ics.jung.visualization.RenderContext;
import edu.uci.ics.jung.visualization.VisualizationModel;
import edu.uci.ics.jung.visualization.VisualizationViewer;
import edu.uci.ics.jung.visualization.VisualizationServer.Paintable;
import edu.uci.ics.jung.visualization.control.AbstractPopupGraphMousePlugin;
import edu.uci.ics.jung.visualization.control.CrossoverScalingControl;
import edu.uci.ics.jung.visualization.control.DefaultModalGraphMouse;
import edu.uci.ics.jung.visualization.control.SatelliteVisualizationViewer;
import edu.uci.ics.jung.visualization.control.ModalGraphMouse.Mode;
import edu.uci.ics.jung.visualization.control.ScalingControl;
import edu.uci.ics.jung.visualization.decorators.AbstractVertexShapeTransformer;
import edu.uci.ics.jung.visualization.decorators.EdgeShape;
import edu.uci.ics.jung.visualization.decorators.GradientEdgePaintTransformer;
import edu.uci.ics.jung.visualization.decorators.PickableEdgePaintTransformer;
import edu.uci.ics.jung.visualization.decorators.PickableVertexPaintTransformer;
import edu.uci.ics.jung.visualization.decorators.ToStringLabeller;
import edu.uci.ics.jung.visualization.layout.LayoutTransition;
import edu.uci.ics.jung.visualization.picking.PickedInfo;
import edu.uci.ics.jung.visualization.picking.PickedState;
import edu.uci.ics.jung.visualization.renderers.BasicEdgeArrowRenderingSupport;
import edu.uci.ics.jung.visualization.renderers.CenterEdgeArrowRenderingSupport;
import edu.uci.ics.jung.visualization.renderers.Renderer;
import edu.uci.ics.jung.visualization.transform.shape.ShapeTransformer;
import edu.uci.ics.jung.visualization.util.Animator;

import com.michaelbaranov.microba.Microba;
import com.michaelbaranov.microba.calendar.DatePicker;
import netscape.javascript.JSObject;

@SuppressWarnings("serial")
public class SNAPPDisplay extends JApplet implements ActionListener 
{
    protected JCheckBox v_color;
    protected JCheckBox e_color;
    protected JCheckBox v_stroke;
    protected JCheckBox e_uarrow_pred;
    protected JCheckBox e_darrow_pred;
    protected JCheckBox e_arrow_centered;
    protected JCheckBox v_shape;
    protected JCheckBox v_size;
    protected JCheckBox v_aspect;
    protected JCheckBox v_labels;
    protected JRadioButton e_line;
    protected JRadioButton e_bent;
    protected JRadioButton e_wedge;
    protected JRadioButton e_quad;
    protected JRadioButton e_ortho;
    protected JRadioButton e_cubic;
    protected JCheckBox e_labels;
    protected JCheckBox font;
    protected JCheckBox e_show_d;
    protected JCheckBox e_show_u;
    protected JCheckBox v_small;
    protected JCheckBox zoom_at_mouse;
    protected JCheckBox fill_edges;
    protected JComboBox transformCBox;
    protected JComboBox layoutCBox;
    protected JCheckBox filterCB;
    protected JCheckBox dateFilterCB;
    protected JTextField textField;
    protected JSpinner spinner1;
    protected JComboBox filterCBox;
    protected DatePicker  startpicker;
    protected DatePicker  endpicker;
    
	protected JRadioButton no_gradient;
	protected JRadioButton gradient_relative;

	protected static final int GRADIENT_NONE = 0;
	protected static final int GRADIENT_RELATIVE = 1;
	protected static int gradient_level = GRADIENT_NONE;

    protected SeedFillColor<Integer> seedFillColor;
    protected SeedDrawColor<Integer> seedDrawColor;
    protected EdgeWeightStrokeFunction<Number> ewcs;
    protected VertexStrokeHighlight<Integer,Number> vsh;
    protected Transformer<Integer,String> vs;
    protected Transformer<Integer,String> vs_none;
    protected Transformer<Number,String> es;
    protected Transformer<Number,String> es_none;
    protected VertexFontTransformer<Integer> vff;
    protected EdgeFontTransformer<Number> eff;
    protected VertexShapeSizeAspect<Integer,Number> vssa;
    protected DirectionDisplayPredicate<Integer,Number> show_edge;
    protected DirectionDisplayPredicate<Integer,Number> show_arrow;
    protected VertexDisplayPredicate<Integer,Number> show_vertex;
    protected Predicate<Context<Graph<Integer,Number>,Number>> self_loop;
    protected GradientPickedEdgePaintFunction<Integer,Number> edgeDrawPaint;
    protected GradientPickedEdgePaintFunction<Integer,Number> edgeFillPaint;
    protected final static Object VOLTAGE_KEY = "voltages";
    protected final static Object TRANSPARENCY = "transparency";
    
    protected Map<Number,Number> edge_weight = new HashMap<Number,Number>();
    protected Transformer<Integer, Double> voltages;
    protected Map<Integer,Number> transparency = new HashMap<Integer,Number>();
    protected Map<Integer,String> usernames = new HashMap<Integer,String>();
    protected Map<String,Integer> username_lookup = new HashMap<String,Integer>();
    protected Map<Integer,Integer> noposts = new HashMap<Integer,Integer>();
    
    //SNA Metrics
    protected Map<Integer,Integer> degree = new HashMap<Integer,Integer>();
    protected Map<Integer,Integer> indegree = new HashMap<Integer,Integer>();
    protected Map<Integer,Integer> outdegree = new HashMap<Integer,Integer>();
    protected Map<Integer,Number> betweennesscentrality = new HashMap<Integer,Number>();
    protected Map<Integer,Number> closenesscentrality = new HashMap<Integer,Number>();
    protected Map<Integer,Number> eigenvectorcentrality = new HashMap<Integer,Number>();
    
    protected VisualizationViewer<Integer,Number> vv;
    protected SatelliteVisualizationViewer<Integer,Number> vv2;
    protected DefaultModalGraphMouse<Integer, Number> gm;
    protected Set<Integer> seedVertices = new HashSet<Integer>();
    public JSplitPane splitPane;
    public JSObject jso;
    
    static Graph<Integer,Number> g;
    
    public SNAPPDatabase snappDB;
    public String lmsForumID = "";
    
    public Paintable viewGrid;
    
    static final String instructions = 
        "<html>"+
        "<b><h2><center>Instructions Interacting with the Sociogram</center></h2></b>"+
        "<p>There are two modes of interaction, Transforming and Picking."+
        "<p>The modes are selected with a drop down box."+
        
        "<p><p><b>Transforming Mode:</b>"+
        "<ul>"+
        "<li>Clicking Mouse button 1 and dragging pans the graph"+
        "<li>Clicking Mouse button 1, the Shift key and dragging rotates the graph"+
        "<li>Clicking Mouse button 1, the CTRL key (or Command) and dragging shears the graph"+
        "</ul>"+
        
        "<b>Picking Mode:</b>"+
        "<ul>"+
        "<li>Clicking on a Vertex (Node or Person) selects the vertex"+
        "<li>Clicking elsewhere unselects all Vertices"+
        "<li>Mouse Button 1 + Shift key adds/removes Vertex a vertext selection"+
        "<li>Mouse Button 1 + drag on a Vertex moves all selected Vertices"+
        "<li>Mouse Button 1 + drag elsewhere selects Vertices in a region"+
        "<li>Mouse Button 1 + Shift + drag adds selection of Vertices in a new region"+
        "<li>Mouse Button 1 + CTRL on a Vertex selects the vertex and centers the display on it"+
        "</ul>";
    
    JDialog helpDialog;
    
    public void start()
    {	
    	try
    	{
	    	snappDB = new SNAPPDatabase();
	    	//System.out.println("applet start called");
	    	LoadSNAPPData();
	    	
	        getContentPane().add(addToolbar(), BorderLayout.PAGE_START);
	        getContentPane().add(startFunction(), BorderLayout.CENTER);
	        
	        helpDialog = new JDialog();
	        helpDialog.getContentPane().add(new JLabel(instructions));
	        
    	}
    	catch (Exception e)
    	{
    		System.out.println("Start: "+ e.getMessage());
    	}
    }

    public void init()
    {
    	try
    	{
    		Microba.init(); //In Applet#init(), call Microba.init() to handle browser refresh button correctly.
    		jso = JSObject.getWindow(this);
    	}
    	catch (Exception e)
    	{
    		System.out.println("Init: "+ e.getMessage());
    	}
    }
    
    public String runSNAPP()
    {
    	String done = "done";
    	//LoadSNAPPTestData();
    	
        getContentPane().add(addToolbar(), BorderLayout.PAGE_START);
        getContentPane().add(startFunction(), BorderLayout.CENTER);

        return done;
    }
    
    public void LoadSNAPPData()
    {
    	String connectionsDS = getSNADataStructure();
    	
        String connections[] = connectionsDS.split(";");
        
        for (int i = 0; i<connections.length; i++)
        {
        	String post = connections[i];
        	String posts[] = post.split("\\|");
        	String posted_by = posts[0];
        	String replied_to = posts[1];
        	String posted_on = posts[2];
        	String lms_id = posts[3];
        	String lms_type = posts[4];
        	
        	AddPost(posted_by, replied_to, posted_on, lms_id, lms_type);

        }
    }
    
    public String getSNADataStructure()
    {
    	String sna = "";
    	
    	if(getParameter("sna") != null)
    	{       	
    		sna = getParameter("sna");
    	}
        
    	byte[] decoded = Base64.decodeBase64(sna.getBytes()); 
    	sna = new String(decoded);
    	
    	return sna;
    }
    
    public String getMinPostDate(String lms_forumid)
    {
    	String MinPostDate = "";
    	MinPostDate = snappDB.GetMinPostDate(lms_forumid);
    	return MinPostDate;
    }
    
    public String getMaxPostDate(String lms_forumid)
    {
    	String MaxPostDate = "";
    	MaxPostDate = snappDB.GetMaxPostDate(lms_forumid);
    	return MaxPostDate;
    }
    
    
    public Boolean AddPost(String person, String replyto_person, String Date_Sent, String lmsforum_id, String LMSType)
    {
    	snappDB.AddPost(person, replyto_person, Date_Sent, "20:08:08", lmsforum_id, LMSType);
    	return true;
    }
    
    public String InsertAnnotation(String annotation, String intervention_date, String lmsforum_id)
    {
    	String IsInserted = "Inserted";
    	return IsInserted;
    }
    
    public String GetAnnotations(String lmsforum_id)
    {
    	String annotations = snappDB.GetAnnotations(lmsforum_id);
    	return annotations;
    }
    
    public static void main(String[] s ) 
    {    		
        JFrame jf = new JFrame();
        jf.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        JSplitPane jp = new SNAPPDisplay().startFunction();
        JToolBar tb = new SNAPPDisplay().addToolbar();
        jf.getContentPane().add(tb, BorderLayout.PAGE_START);
        jf.getContentPane().add(jp, BorderLayout.CENTER);
        
        jf.pack();
        jf.setVisible(true);
        
    }
    
    public String appletCheck()
    {
    	return "AppletLoaded";
    }
    
    public String exportFromSNAPP(String exportType, String exportFormat)
    {
    	String exportData = "";
    	if (exportType.equals("image"))
    	{
    		exportData = renderSociogramAsImage(exportFormat);
    	}
    	else if (exportType.equals("vna"))
    	{
    		try
    		{
    			exportData = SNAPP.Export.VNA(snappDB.GetPostCountsPerUser("1"), snappDB.GetConnectionCountsPerForumByDate("","","1"));
    		}
        	catch (Exception ex1) 
        	{
            	
            	System.out.println("EXCEPTION VNA Export: " + ex1.toString());
            }
    	}
    	else if (exportType.equals("gefx"))
    	{
    		try
    		{
    			exportData = SNAPP.Export.GEFX(snappDB.GetPostCountsPerUser("1"), snappDB.GetConnectionCountsPerForumByDate("","","1"));
    		}
        	catch (Exception ex1) 
        	{
            	
            	System.out.println("EXCEPTION GEFX Static Export: " + ex1.toString());
            }
    	}
    	else if (exportType.equals("gefxd"))
    	{
    		try
    		{
    			exportData = SNAPP.Export.GEFXD(snappDB.GetPostCountsPerUser("1"), snappDB.GetConnectionCountsPerForumByDate("","","1"), snappDB.GetMinDate("1"), snappDB.GetMaxDate("1") );
    		} 
        	catch (Exception ex1) 
        	{
            	
            	System.out.println("EXCEPTION GEFX Dynamic Export: " + ex1.toString());
            }
    	}
    	
    	return exportData;
    	
    }
    
    public String renderSociogramAsImage(String ImageType)
    {
    	String base64String = "";
        
        int width = vv.getWidth();//dim.width;
        int height = vv.getHeight();//dim.height;

        BufferedImage bi = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = bi.createGraphics();
        vv.paint(graphics);
        graphics.dispose();
        
        try {

        	ByteArrayOutputStream baos=new ByteArrayOutputStream(1000);

    		ImageIO.write(bi, ImageType , baos); // ImageType = jpg or png
    		baos.flush();
     
    		base64String=new String(Base64.encodeBase64(baos.toByteArray()));
    		baos.close();
  
        	
        } catch (Exception e) {
            e.printStackTrace();
        }
    	
    	return base64String;
    }
    
    public String getPostsforDisplay(String LMSID)
    {
    	String noPosts = "";
    	noPosts = Integer.toString(snappDB.GetNoPosts(LMSID)); 	   	
    	return noPosts;
    }
    
    public String getParticipantsforDisplay(String LMSID)
    {
    	String noParticipants = "";
    	noParticipants = Integer.toString(snappDB.GetNoParticipants(LMSID)); 	
    	return noParticipants;
    }
    
    public String getNetworkDensityforDisplay(String LMSID)
    {
    	String NetworkDensity = "";
    	DecimalFormat df2 = new DecimalFormat( "#,###,###,##0.00" );
    	NetworkDensity = df2.format(snappDB.GetNetworkDensity(LMSID)); 	
    	return NetworkDensity;
    }
    
    
    public JToolBar addToolbar()
    {
    	
    	final ScalingControl scaler = new CrossoverScalingControl();
    	
		JToolBar toolBar = new JToolBar();
		toolBar.setFloatable(false);
		JButton ZoomInBtn = new JButton();
		String ZoomImgLocation = "images/ZoomIn16.gif";
		URL imageURL = SNAPPDisplay.class.getResource(ZoomImgLocation);
		ZoomInBtn.setIcon(new ImageIcon(imageURL, "Zoom In"));
		ZoomInBtn.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                scaler.scale(vv, 1.1f, vv.getCenter());
            }
        });
		
        toolBar.add(ZoomInBtn);
        
		JButton ZoomOutBtn = new JButton();
		String ZoomOutImgLocation = "images/ZoomOut16.gif";
		URL zoomOutImageURL = SNAPPDisplay.class.getResource(ZoomOutImgLocation);
		ZoomOutBtn.setIcon(new ImageIcon(zoomOutImageURL, "Zoom Out"));
		
		ZoomOutBtn.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                scaler.scale(vv, 1/1.1f, vv.getCenter());
            }
        });
		
        toolBar.add(ZoomOutBtn);
        
        toolBar.addSeparator();
        
        Label label1 = new Label("Mouse: ");
        label1.setMaximumSize(new Dimension(70, 70));
        label1.setAlignment(Label.RIGHT);
        toolBar.add(label1);
        
        String[] modeoption = {"Transform", "Pick"};
        transformCBox = new JComboBox(modeoption);
        transformCBox.setName("Mouse Selection");
        transformCBox.setMaximumSize( transformCBox.getPreferredSize() );

        transformCBox.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                JComboBox cb = (JComboBox)e.getSource();
                String selectionName = (String)cb.getSelectedItem();
            	if (selectionName.equals("Transform"))
        		{
        			gm.setMode(Mode.TRANSFORMING);
        		}
        		else
        		{
        			// param 1 must be Pick
        			gm.setMode(Mode.PICKING);

        		}
            }
        });
        
        toolBar.add(transformCBox);
        
        JCheckBox ego_network = new JCheckBox("Highlight Ego Network");
        ego_network.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
            	JCheckBox cb = (JCheckBox)e.getSource();
                
            	if (cb.isSelected())
        		{
        			vsh.setHighlight(true);
        			transformCBox.setSelectedIndex(1);
        		}
        		else
        		{
        			vsh.setHighlight(false);
        		}
            }
        });

        ego_network.setSelected(true);
        
        toolBar.add(ego_network);
        
        toolBar.addSeparator();
        
        
        Label label2 = new Label("Layout: ");
        label2.setMaximumSize(new Dimension(45, 45));
        label2.setAlignment(Label.RIGHT);
        toolBar.add(label2);
        
        String[] layoutoptions = {"KK Layout", "FR Layout", "Circle Layout", "Spring Layout", "Spring2 Layout", "ISOM Layout"};
        layoutCBox = new JComboBox(layoutoptions);
        layoutCBox.setName("Mouse Selection");
        layoutCBox.setMaximumSize( layoutCBox.getPreferredSize() );

        layoutCBox.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                JComboBox cb = (JComboBox)e.getSource();
                String selectionName = (String)cb.getSelectedItem();
                Layout<Integer,Number> l;
        		if (selectionName.equals("KK Layout"))
        		{
        			// change to kklayout
        			 l = new KKLayout<Integer,Number>(g);
        		}
        		else if (selectionName.equals("FR Layout"))
        		{
        			// change to frlayout
        			 l = new FRLayout<Integer,Number>(g);
        		}
        		else if (selectionName.equals("Circle Layout"))
        		{
        			// change to circlelayout
        			 l = new CircleLayout<Integer,Number>(g);
        		}
        		else if (selectionName.equals("Spring Layout"))
        		{
        			// change to springlayout
        			 l = new SpringLayout<Integer,Number>(g);
        		}
        		else if (selectionName.equals("Spring2 Layout"))
        		{
        			// change to spring2layout
        			 l = new SpringLayout2<Integer,Number>(g);
        		}
        		else if (selectionName.equals("ISOM Layout"))
        		{
        			// change to isomlayout
        			 l = new ISOMLayout<Integer,Number>(g);
        		}
        		else
        		{
        			// change to frlayout
        			 l = new FRLayout<Integer,Number>(g);
        		}
                l.setInitializer(vv.getGraphLayout());
                l.setSize(vv.getSize());
                
        		LayoutTransition<Integer,Number> lt = new LayoutTransition<Integer,Number>(vv, vv.getGraphLayout(), l);
        		Animator animator = new Animator(lt);
        		animator.start();
        		vv.getRenderContext().getMultiLayerTransformer().setToIdentity();
            }
        });
        
        toolBar.add(layoutCBox);
        
        toolBar.addSeparator();
        
        JButton ClusterBtn = new JButton("Find Clusters");
		
        ClusterBtn.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
        		ClusteringDemo cd = new ClusteringDemo();
        		cd.start(g,usernames);
            }
        });
		
        toolBar.add(ClusterBtn);
        
        toolBar.addSeparator();

        JButton export = new JButton("Export");
        export.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
            	if(jso != null )
            	{
                    try {
                        jso.call("exportwin", new String[] {"tmp"});
                    }
                    catch (Exception ex) {
                        ex.printStackTrace();
                    }
            	}
            }
        });
        
        
        toolBar.add(export);
        
        
        JButton help = new JButton("Help");
        help.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                helpDialog.pack();
                helpDialog.setVisible(true);
            }
        });

        toolBar.add(help);
        
        return toolBar;

    }
  
    
    public JSplitPane startFunction() {
        //Graph<Integer,Number> g = getGraph();
    	
    	// Set SateliteView size
        Dimension preferredSize1 = new Dimension(750,700);
    	Dimension preferredSize2 = new Dimension(100,100);
    	
    	g = getGraph("","","1");//2008-09-10 2008-09-11//September 10, 2008
    	
        Layout<Integer,Number> layout = new FRLayout<Integer,Number>(g);
        layout.setSize(new Dimension(750,700));

        // create one model that both views will share
        VisualizationModel<Integer,Number> vm = new DefaultVisualizationModel<Integer,Number>(layout, preferredSize1);
        
        //vv = new VisualizationViewer<Integer,Number>(layout);
        vv = new VisualizationViewer<Integer,Number>(vm, preferredSize1);
        
        PickedState<Integer> picked_state = vv.getPickedVertexState();

//        affineTransformer = vv.getLayoutTransformer();
        self_loop = new SelfLoopEdgePredicate<Integer,Number>();
        // create decorators
        seedFillColor = new SeedFillColor<Integer>(picked_state);
        seedDrawColor = new SeedDrawColor<Integer>(picked_state);
        ewcs = new EdgeWeightStrokeFunction<Number>(edge_weight);
        vsh = new VertexStrokeHighlight<Integer,Number>(g, picked_state);
        vff = new VertexFontTransformer<Integer>();
        eff = new EdgeFontTransformer<Number>();
        vs_none = new ConstantTransformer(null);
        es_none = new ConstantTransformer(null);
        vssa = new VertexShapeSizeAspect<Integer,Number>(g, voltages);
        show_edge = new DirectionDisplayPredicate<Integer,Number>(true, true);
        show_arrow = new DirectionDisplayPredicate<Integer,Number>(true, false);
        show_vertex = new VertexDisplayPredicate<Integer,Number>(false);

        // uses a gradient edge if unpicked, otherwise uses picked selection
        edgeDrawPaint = 
            new GradientPickedEdgePaintFunction<Integer,Number>(
                    new PickableEdgePaintTransformer<Number>(
                            vv.getPickedEdgeState(),Color.black,Color.cyan), vv);
        edgeFillPaint = 
            new GradientPickedEdgePaintFunction<Integer,Number>(
                    new PickableEdgePaintTransformer<Number>(
                            vv.getPickedEdgeState(),Color.black,Color.cyan), vv);
        
        vv.getRenderContext().setVertexFillPaintTransformer(seedFillColor);
        vv.getRenderContext().setVertexDrawPaintTransformer(seedDrawColor);
        vv.getRenderContext().setVertexStrokeTransformer(vsh);
        //vv.getRenderContext().setVertexLabelTransformer(new ToStringLabeller());
        
        vv.getRenderContext().setVertexLabelTransformer(
        		// this chains together Transformers so that the html tags
        		// are prepended to the toString method output
        		new ChainedTransformer<Integer,String>(new Transformer[]{
        		new ToStringLabeller<String>(),
        		new Transformer<String,String>() {
					public String transform(String input) {
						return usernames.get(Integer.parseInt(input));
					}}}));
        
        //vv.getRenderContext().setVertexLabelTransformer(vs_none);
        vv.getRenderContext().setVertexFontTransformer(vff);
        
        vv.getRenderer().getVertexLabelRenderer().setPosition(Renderer.VertexLabel.Position.S);
        
        vv.getRenderContext().setVertexShapeTransformer(vssa);
        vv.getRenderContext().setVertexIncludePredicate(show_vertex);
        
        vv.getRenderContext().setEdgeDrawPaintTransformer( edgeDrawPaint );
        
        es = new Transformer<Number,String>(){
            public String transform(Number e) {
                //return "Edge:"+e;
                return edge_weight.get(e).toString();
            }
        };
        vv.getRenderContext().setEdgeLabelTransformer(es);
        
        //vv.getRenderContext().setEdgeLabelTransformer(es_none);
        vv.getRenderContext().setEdgeFontTransformer(eff);
        vv.getRenderContext().setEdgeStrokeTransformer(ewcs);
        vv.getRenderContext().setEdgeIncludePredicate(show_edge);
        vv.getRenderContext().setEdgeShapeTransformer(new EdgeShape.Line<Integer,Number>());
        vv.getRenderContext().setEdgeArrowPredicate(show_arrow);
        
        vv.getRenderContext().setArrowFillPaintTransformer(new ConstantTransformer(Color.lightGray));
        vv.getRenderContext().setArrowDrawPaintTransformer(new ConstantTransformer(Color.black));
        
		splitPane = new JSplitPane();
		splitPane.setPreferredSize(new Dimension(800, 700));

		//getContentPane().add(splitPane, BorderLayout.CENTER);
		
        JPanel jp = new JPanel();
        jp.setLayout(new BorderLayout());
        
        vv.setBackground(Color.white);
        GraphZoomScrollPane scrollPane = new GraphZoomScrollPane(vv);
        jp.add(scrollPane);
        gm = new DefaultModalGraphMouse<Integer, Number>();
        gm.setMode(Mode.TRANSFORMING);
        vv.setGraphMouse(gm);
        gm.add(new PopupGraphMousePlugin());

		splitPane.setLeftComponent(jp);

		JPanel leftpanel = new JPanel();
		splitPane.setRightComponent(leftpanel);
        
        vssa.setScaling(true);

        vv.setVertexToolTipTransformer(new VoltageTips<Number>());
        vv.setToolTipText("<html><center>Use the mouse wheel to zoom<p>Click and Drag the mouse to pan<p>Shift-click and Drag to Rotate</center></html>");

		Dimension minimumSizeSNAPP = new Dimension(600, 650);
		jp.setMinimumSize(minimumSizeSNAPP);
		Dimension minimumSize = new Dimension(100, 50);
		leftpanel.setMinimumSize(minimumSize);
			
        vv2 = new SatelliteVisualizationViewer<Integer,Number>(vv, preferredSize2);
        vv2.getRenderContext().setEdgeDrawPaintTransformer(new PickableEdgePaintTransformer<Number>(vv2.getPickedEdgeState(), Color.black, Color.cyan));
        vv2.getRenderContext().setVertexFillPaintTransformer(new PickableVertexPaintTransformer<Integer>(vv2.getPickedVertexState(), Color.red, Color.yellow));
        ScalingControl vv2Scaler = new CrossoverScalingControl();
        vv2.scaleToLayout(vv2Scaler);
        vv2.getRenderContext().setVertexLabelTransformer(vv.getRenderContext().getVertexLabelTransformer());
        
        viewGrid = new ViewGrid(vv2, vv);
        addBottomControls( leftpanel ); //jp
        
		splitPane.setOneTouchExpandable(true);
		splitPane.setDividerLocation(0.75);
		
        return splitPane; //jp
    }
    
    
    public String ExportParticipantMetrics()
    {
    	String ParticipantMetricsTable = "";
    	StringBuffer ParticipantMetricsTable_builder = new StringBuffer();
    	
    	DecimalFormat df2 = new DecimalFormat( "#,###,###,##0.00" );
    	
    	try 
    	{
        	ResultSet node_rs = snappDB.GetPostCountsPerUser("1");
        	
        	int i = 0;
            for (; node_rs.next(); ) {
                // Set no posts and name for each participants
            	String username = node_rs.getObject(1).toString();
            	int user_id = username_lookup.get(username);
            	ParticipantMetricsTable_builder.append("<tr>");
            	ParticipantMetricsTable_builder.append("<td>" + username + "</td>");
            	ParticipantMetricsTable_builder.append("<td>" + noposts.get(user_id) + "</td>");
            	ParticipantMetricsTable_builder.append("<td>" + degree.get(user_id) + "</td>");
            	ParticipantMetricsTable_builder.append("<td>" + indegree.get(user_id) + "</td>");
            	ParticipantMetricsTable_builder.append("<td>" + outdegree.get(user_id) + "</td>");
            	ParticipantMetricsTable_builder.append("<td>" + df2.format(betweennesscentrality.get(user_id)) + "</td>");
            	//ParticipantMetricsTable_builder.append("<td>" + df2.format(closenesscentrality.get(user_id)) + "</td>");
            	ParticipantMetricsTable_builder.append("<td>" + df2.format(eigenvectorcentrality.get(user_id)) + "</td>");
            	ParticipantMetricsTable_builder.append("</tr>");
                i = i + 1;
            }
            ParticipantMetricsTable = ParticipantMetricsTable_builder.toString();
    	}
    	catch (Exception ex1) {
        	
        	System.out.println("EXCEPTION: " + ex1.getMessage());
        }

    	return ParticipantMetricsTable;
    }
    
    public String ExportJSChart()
    {
    	String JSChartData = "";
    	// Example Format
    	//line1=[['2008-06-30',4], ['2008-7-30',6.5], ['2008-8-30',5.7], ['2008-9-30',9], ['2008-10-30',8.2]];
    	JSChartData = snappDB.GetPostCountsPerForumByDate("1", "", "");
    	return JSChartData;
    }
    
    /**
     * create some vertices
     * @param count how many to create
     * @return the Vertices in an array
     */
    private void createSNAPPGraph(Graph<Integer,Number> graph, String StartDate, String EndDate, String lmsForumID) throws SQLException {
    	
    	ResultSet node_rs = snappDB.GetPostCountsPerUserByDate(StartDate, EndDate, lmsForumID);
    	int i = 0;
        for (; node_rs.next(); ) {
            // Set no posts and name for each participants
            usernames.put(i, node_rs.getObject(1).toString());
            username_lookup.put(node_rs.getObject(1).toString(),i);
            noposts.put(i, Integer.parseInt(node_rs.getObject(2).toString()));
            graph.addVertex(i);
            i = i + 1;
        }
		
        // Aggregate connection count
        HashMap<String,Integer> connection_hashmap = new HashMap<String,Integer>();
        //System.out.println("connection_rs to be called ");
        ResultSet connection_rs = snappDB.GetConnectionCountsPerForumByDate(StartDate, EndDate, lmsForumID);
        //System.out.println("connection_rs called ");
        i = 0;
        for (; connection_rs.next(); ) {
        	
            // Set connections and connection weights
        	String posted_by = connection_rs.getObject(1).toString();
        	String replied_to = connection_rs.getObject(2).toString();
        	//System.out.println("posted_by: " + posted_by);
        	//System.out.println("replied_to: " + replied_to);
        	
        	
        	if (!replied_to.equals("-"))
        	{
            	int from_node_id = username_lookup.get(posted_by);
            	int to_node_id = username_lookup.get(replied_to);
        		
        		String connection_key = from_node_id + "-" + to_node_id;
        	
        		//System.out.println("connection_key: " + connection_key);
        	
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

            graph.addEdge(new Double(i), from_node, to_node, EdgeType.DIRECTED);
            edge_weight.put(new Double(i), new Double(weight));
            i = i + 1;
            //System.out.println("from_node :" + from_node);
            //System.out.println("value :" + to_node);
        }

    }
    

    /**
     * create edges for this demo graph
     * @param v an array of Vertices to connect
     */
    void createEdges(Integer[] v, Graph<Integer,Number> graph) {
        graph.addEdge(new Double(1), v[0], v[1], EdgeType.DIRECTED);
        graph.addEdge(new Double(2), v[1], v[2], EdgeType.DIRECTED);
        graph.addEdge(new Double(3), v[1], v[3], EdgeType.DIRECTED);
        graph.addEdge(new Double(4), v[2], v[3], EdgeType.DIRECTED);
        
        edge_weight.put(new Double(1), new Double(1));
        edge_weight.put(new Double(2), new Double(2));
        edge_weight.put(new Double(3), new Double(3));
        edge_weight.put(new Double(4), new Double(4));
       
    }
    
    
    public void ResetGraph(String StartDate, String EndDate, String LMS_ID)
    {
    	//StartDate = SNAPP.Utils.DateTimeParse(StartDate, "US");
    	//EndDate = SNAPP.Utils.DateTimeParse(EndDate, "US");
    	
    	//System.out.println("StartDate:" + StartDate);
    	//System.out.println("EndDate:" + EndDate);
    	
    	edge_weight.clear();
    	transparency.clear();
    	usernames.clear();
    	username_lookup.clear();
    	noposts.clear();
    	degree.clear();
    	indegree.clear();
    	outdegree.clear();
    	betweennesscentrality.clear();
    	closenesscentrality.clear();
    	eigenvectorcentrality.clear();
    	seedVertices.clear();
    	
    	g = getGraph(StartDate,EndDate,"1");
        
        Layout<Integer,Number> layout = new FRLayout<Integer,Number>(g);
        layout.setSize(new Dimension(750,700));
        vv.setGraphLayout(layout);
        //vv = new VisualizationViewer<Integer,Number>(layout);
        vv.repaint();
    }
    
    /**
     * Generates a mixed-mode random graph, runs VoltageRanker on it, and
     * returns the resultant graph.
     */
    public Graph<Integer,Number> getGraph(String StartDate, String EndDate, String LMS_ID) {
        
        // create a simple graph for the demo
    	Graph<Integer,Number> g = new SparseMultigraph<Integer,Number>();
        //Integer[] v_node = createVertices(4,g);
    	//Integer[] v_node = createVertices(g);
        //createEdges(v_node,g);
    	try 
    	{
    		createSNAPPGraph(g, StartDate, EndDate,LMS_ID);
    		
    		//System.out.println(SNAPP.Export.VNA(snappDB.GetPostCountsPerUser("1"), snappDB.GetConnectionCountsPerForum("1","","")));
    	}
    	catch (Exception ex1) {
        	
        	System.out.println("EXCEPTION createSNAPPGraph : " + ex1.toString());
        }
        
        BetweennessCentrality<Integer,Number> betweennesscentrality_scores = new BetweennessCentrality<Integer, Number> (g); //MapTransformer.getInstance(edge_weight)
        //ClosenessCentrality<Integer,Number> closenesscentrality_scores = new ClosenessCentrality<Integer, Number> (g); 
        EigenvectorCentrality<Integer,Number> eigenvectorcentrality_scores = new EigenvectorCentrality<Integer, Number> (g); 
        
        
        
        Collection<Integer> verts = g.getVertices();
        
        // Set betweennesscentrality_scores, closenesscentrality_scores & eigenvectorcentrality_scores
        
        for(Integer v : verts) {
            //usernames.put(v, "Student " + v);
            //noposts.put(v, 10);
        	transparency.put(v, new Double(0.9));
            seedVertices.add(v);
            degree.put(v,g.degree(v));
            indegree.put(v,g.inDegree(v));
            outdegree.put(v,g.outDegree(v));
           
            betweennesscentrality.put(v, betweennesscentrality_scores.getVertexScore(v));
            //closenesscentrality.put(v, closenesscentrality_scores.getVertexScore(v));
            eigenvectorcentrality.put(v, eigenvectorcentrality_scores.getVertexScore(v));
        }
        
        //System.out.println(ExportParticipantMetrics());
        //System.out.println(ExportJSChart());
        //System.out.println("No Post:" +getPostsforDisplay("1"));
        //System.out.println("No Participants:" +getParticipantsforDisplay("1"));
        //System.out.println("Network Density:" +getNetworkDensityforDisplay("1"));
        
        // use these seeds as source and sink vertices, run VoltageRanker
        try
        {
	        boolean source = true;
	        Set<Integer> sources = new HashSet<Integer>();
	        Set<Integer> sinks = new HashSet<Integer>();
	        for(Integer v : seedVertices)
	        {
	            if (source)
	                sources.add(v);
	            else
	                sinks.add(v);
	            source = !source;
	        }
	        if (seedVertices.size()>1)
	        {
		        VoltageScorer<Integer, Number> voltage_scores = new VoltageScorer<Integer, Number>(g, MapTransformer.getInstance(edge_weight), sources, sinks);
		        voltage_scores.evaluate();
		        voltages = new VertexScoreTransformer<Integer, Double>(voltage_scores);
	        }
        }
        catch(Exception e)
        {
        	
        	System.out.println("Graph Exception: " + e.getMessage());
        }
        
        // SNAPP ui can now retrieve data for graph and table
        //jso = JSObject.getWindow(this);
    	if(jso != null )
    	{
            try {
            	
            	  String noposts = getPostsforDisplay("1");
            	  String noparticpants = getParticipantsforDisplay("1");
            	  String networkdensity = getNetworkDensityforDisplay("1");
            	  String metrics = new String(Base64.encodeBase64(ExportParticipantMetrics().getBytes()));
            	  String distributiongraph = new String(Base64.encodeBase64(ExportJSChart().getBytes()));
            	  String param = noposts + ";" + noparticpants + ";" + networkdensity + ";" + metrics + ";" + distributiongraph;
                jso.call("initsnapp", new String[] {param});
            }
            catch (Exception ex) {
                ex.printStackTrace();
            }
    	}
        
        return g;  
    }
   
    /**
     * @param jp    panel to which controls will be added
     */
    @SuppressWarnings("serial")
    
	protected void addBottomControls(final JPanel jp) 
    {
    	JTabbedPane tabbedPane = new JTabbedPane();
    	
        final JPanel control_panel = new JPanel();
        //jp.add(control_panel, BorderLayout.EAST);
        control_panel.setLayout(new BorderLayout());//
        final Box vertex_panel = Box.createVerticalBox();
        vertex_panel.setBorder(BorderFactory.createTitledBorder("Participants"));
        final Box edge_panel = Box.createVerticalBox();
        edge_panel.setBorder(BorderFactory.createTitledBorder("Connections"));
        final Box sat_panel = Box.createVerticalBox();
        sat_panel.setBorder(BorderFactory.createTitledBorder("Satellite View"));
        final Box filter_panel = Box.createVerticalBox();
        filter_panel.setBorder(BorderFactory.createTitledBorder("Filter"));
        final Box datefilter_panel = Box.createVerticalBox();
        datefilter_panel.setBorder(BorderFactory.createTitledBorder("Date Filter"));
        //final Box both_panel = Box.createVerticalBox();
        final JPanel both_panel = new JPanel(new BorderLayout());

        control_panel.add(vertex_panel, BorderLayout.NORTH);//
        control_panel.add(edge_panel, BorderLayout.CENTER); //
        //control_panel.add(sat_panel, BorderLayout.NORTH); //, 
        //control_panel.add(both_panel, BorderLayout.SOUTH);//, 
        
        tabbedPane.addTab("Controls", control_panel);
    	tabbedPane.setMnemonicAt(0, KeyEvent.VK_1);
    	
    	tabbedPane.addTab("Filters", both_panel);
    	
    	tabbedPane.addTab("Navigation", sat_panel);
    	
    	jp.add(tabbedPane, BorderLayout.EAST);
        
        v_labels = new JCheckBox("Show names");
        v_labels.setSelected(true);
        v_labels.addActionListener(this);

        v_size = new JCheckBox("Scale nodes");
        v_size.setSelected(true);
        v_size.addActionListener(this);
        v_size.setSelected(true);
        
        // Search
        
        textField = new JTextField();
		textField.setColumns(5);
		textField.setMaximumSize(new Dimension(250,150));
		JButton SearchBtn = new JButton("Search");
		
		SearchBtn.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                // Search and Highlight Node
            	String searchtxt = textField.getText();
            	if (!searchtxt.equals(""))
            	{
            		//System.out.println("Search for and highlight node: " + searchtxt);
            	
            		for (Map.Entry<Integer,String> entry : usernames.entrySet())
            		{
            		  if (entry.getValue().toLowerCase().contains(searchtxt.toLowerCase()))
            		  {
            			  vv.getPickedVertexState().pick(entry.getKey(), true);//Integer.valueOf(1)
            		  }
            		}
            	}
            }
        });
		
        vertex_panel.add(v_labels);

        vertex_panel.add(v_size);

        vertex_panel.add(textField);
        vertex_panel.add(SearchBtn);
        
        // set up edge controls
		JPanel gradient_panel = new JPanel(new GridLayout(1, 0));
        gradient_panel.setBorder(BorderFactory.createTitledBorder("Edge paint"));
		no_gradient = new JRadioButton("Solid color");
		no_gradient.addActionListener(this);
		no_gradient.setSelected(true);

		gradient_relative = new JRadioButton("Gradient");
		gradient_relative.addActionListener(this);
		ButtonGroup bg_grad = new ButtonGroup();
		bg_grad.add(no_gradient);
		bg_grad.add(gradient_relative);

		gradient_panel.add(no_gradient);

		gradient_panel.add(gradient_relative);
		
        
        e_color = new JCheckBox("Scale connections");
        e_color.addActionListener(this);
        e_labels = new JCheckBox("Show posts between participants");
        e_labels.setSelected(true);
        e_labels.addActionListener(this);
        e_color.setAlignmentX(Component.LEFT_ALIGNMENT);
        edge_panel.add(e_color);
        e_labels.setAlignmentX(Component.LEFT_ALIGNMENT);
        edge_panel.add(e_labels);
        
        
        JPanel shape_panel = new JPanel(new FlowLayout());//new GridLayout(3,2)
        shape_panel.setBorder(BorderFactory.createTitledBorder("Connection Type"));
        e_line = new JRadioButton("line");
        e_line.addActionListener(this);
        e_line.setSelected(true);

        e_quad = new JRadioButton("quad curve");
        e_quad.addActionListener(this);

        ButtonGroup bg_shape = new ButtonGroup();
        bg_shape.add(e_line);

        bg_shape.add(e_quad);

        shape_panel.add(e_line);

        shape_panel.add(e_quad);

        shape_panel.setOpaque(true);

        
        shape_panel.setAlignmentX(Component.LEFT_ALIGNMENT);
        edge_panel.add(shape_panel);
        
        filterCB = new JCheckBox("Enable filtering");

        filterCB.addActionListener(this);
        filter_panel.setAlignmentX(Component.LEFT_ALIGNMENT);
        filter_panel.add(filterCB);
        
        String[] filteroptions = {"Less Than", "Greater Than"};
        filterCBox = new JComboBox(filteroptions);
        filterCBox.setAlignmentX(Component.LEFT_ALIGNMENT);
        filterCBox.setMaximumSize(new Dimension (100,50));
        filterCBox.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
          		if (filterCB.isSelected())
        		{
          			//System.out.println("Run Filter: " + filterCBox.getSelectedItem().toString() + " " + spinner1.getValue().toString());
          			show_vertex.filterSmall(false);
          			show_vertex.filterOperator=filterCBox.getSelectedItem().toString();
        			show_vertex.degree_value=Integer.parseInt(spinner1.getValue().toString());
        			show_vertex.filterSmall(true);
        			vv.repaint();
        		}
            }
        });
        filter_panel.add(filterCBox);
        
        SpinnerModel model = new SpinnerNumberModel(1, 1, 100, 1);
        spinner1 = new JSpinner(model);
        spinner1.setMaximumSize(new Dimension (100,50));
        
        ChangeListener listener = new ChangeListener() {
            public void stateChanged(ChangeEvent e) {
            //System.out.println("Source: " +  spinner1.getValue().toString());
      		if (filterCB.isSelected())
    		{
      			//System.out.println("Run Filter: " + filterCBox.getSelectedItem().toString() + " " + spinner1.getValue().toString());
      			show_vertex.filterSmall(false);
      			show_vertex.filterOperator=filterCBox.getSelectedItem().toString();
    			show_vertex.degree_value=Integer.parseInt(spinner1.getValue().toString());
    			show_vertex.filterSmall(true);
    			vv.repaint();
    		}
            }
          };

        spinner1.addChangeListener(listener);
        spinner1.setAlignmentX(Component.LEFT_ALIGNMENT);
        filter_panel.add(spinner1);
        
        dateFilterCB = new JCheckBox("Enable Date filtering");
        dateFilterCB.addActionListener(this);
        //dateFilterCB.setAlignmentX(Component.RIGHT_ALIGNMENT);
        datefilter_panel.setAlignmentX(Component.LEFT_ALIGNMENT);
        datefilter_panel.add(dateFilterCB);
        
        JLabel startlbl = new JLabel("Start Date:");
        startlbl.setAlignmentX(Component.LEFT_ALIGNMENT);
        JLabel endlbl = new JLabel("End Date:");
        endlbl.setAlignmentX(Component.LEFT_ALIGNMENT);
        
        startpicker = new DatePicker();
        startpicker.setAlignmentX(Component.LEFT_ALIGNMENT);
        
        //DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

        
        //System.out.println("mindate: " + mindate);
        try
        {
            DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
            String mindate = getMinPostDate("1");
            //System.out.println("mindate: " + mindate);
        	java.util.Date dt_toset = df.parse(mindate);
        	startpicker.setDate(dt_toset);
        }
        catch(Exception e)
        {
        	System.out.println(e.getMessage());
        }


        
        startpicker.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				if (dateFilterCB.isSelected())
				{
					//System.out.println("date changed:" + dateFilterCB.isSelected());
					String st_date = "";  //yyyy-MM-dd
					DateFormat formatter2 = new SimpleDateFormat("yyyy-MM-dd");
					st_date = formatter2.format(startpicker.getDate());
					
					String ed_date = "";  //yyyy-MM-dd
					ed_date = formatter2.format(endpicker.getDate());
					
					//System.out.println("st_date:" + st_date);
					
					ResetGraph(st_date, ed_date, "1");
					vv.repaint();
					//System.out.println(startpicker.getDate());
				}
			}
		});
		
        
        datefilter_panel.add(startlbl);
        datefilter_panel.add(startpicker);
        
        endpicker = new DatePicker(); 
        endpicker.setAlignmentX(Component.LEFT_ALIGNMENT);
        try
        {
        	//endpicker.setDate((java.util.Date)formatter.parse(mindate));
        	DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
            String mindate = getMinPostDate("1");
            //System.out.println("mindate: " + mindate);
        	java.util.Date dt_toset = df.parse(mindate);
        	endpicker.setDate(dt_toset);
            
        }
        catch(Exception e)
        {
        	System.out.println(e.getMessage());
        }
        //endpicker.
        endpicker.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				if (dateFilterCB.isSelected())
				{
					String st_date = "";  //yyyy-MM-dd
					DateFormat formatter2 = new SimpleDateFormat("yyyy-MM-dd");
					st_date = formatter2.format(startpicker.getDate());
					
					String ed_date = "";  //yyyy-MM-dd
					ed_date = formatter2.format(endpicker.getDate());
					
					ResetGraph(st_date, ed_date, "1");
					vv.repaint();
					//System.out.println(startpicker.getDate());
				}
			}
		});
		
        
        datefilter_panel.add(endlbl);
        datefilter_panel.add((JComponent)endpicker);
        
        both_panel.add(filter_panel, BorderLayout.NORTH);
        both_panel.add(datefilter_panel, BorderLayout.CENTER);    
        
        sat_panel.add(vv2,BorderLayout.NORTH);

    }
   
    
    public void actionPerformed(ActionEvent e)
    {
    		AbstractButton source = (AbstractButton)e.getSource();
            if (source == v_color)
            {
                seedDrawColor.setSeedColoring(source.isSelected());
                seedFillColor.setSeedColoring(source.isSelected());
            }
            else if (source == filterCB)
            {
            	if (source.isSelected())
            	{
	      			//System.out.println("Run CB Filter: " + filterCBox.getSelectedItem().toString() + " " + spinner1.getValue().toString());
	      			show_vertex.filterSmall(false);
	      			show_vertex.filterOperator=filterCBox.getSelectedItem().toString();
	    			show_vertex.degree_value=Integer.parseInt(spinner1.getValue().toString());
	    			show_vertex.filterSmall(true);
            	}
            	else
            	{
            		show_vertex.filterSmall(false);
            	}
            	vv.repaint();
            }
            else if (source == dateFilterCB)
            {
            	if (source.isSelected())
            	{
            		//System.out.println("Run Date  Filter: ");
					String st_date = "";  //yyyy-MM-dd
					DateFormat formatter2 = new SimpleDateFormat("yyyy-MM-dd");
					st_date = formatter2.format(startpicker.getDate());
					
					String ed_date = "";  //yyyy-MM-dd
					ed_date = formatter2.format(endpicker.getDate());
					
					ResetGraph(st_date, ed_date, "1");
            		//ResetGraph(param2, param3, "1");

            	}
            	else
            	{
            		ResetGraph("", "", "1");
            	}
            	vv.repaint();
            }
            else if (source == e_color)
            {
                ewcs.setWeighted(source.isSelected());
            }
            else if (source == v_stroke) 
            {
                vsh.setHighlight(source.isSelected());
            }
            else if (source == v_labels)
            {
                if (source.isSelected())
                {
                    //vv.getRenderContext().setVertexLabelTransformer(vs);
                	
                    vv.getRenderContext().setVertexLabelTransformer(
                    		new ChainedTransformer<Integer,String>(new Transformer[]{
                    		new ToStringLabeller<String>(),
                    		new Transformer<String,String>() {
            					public String transform(String input) {
            						return usernames.get(Integer.parseInt(input));
            					}}}));
                }
                else
                    vv.getRenderContext().setVertexLabelTransformer(vs_none);
            }
            else if (source == e_labels)
            {
                if (source.isSelected())
                    vv.getRenderContext().setEdgeLabelTransformer(es);
                else
                    vv.getRenderContext().setEdgeLabelTransformer(es_none);
            }
            else if (source == e_uarrow_pred)
            {
                show_arrow.showUndirected(source.isSelected());
            }
            else if (source == e_darrow_pred)
            {
                show_arrow.showDirected(source.isSelected());
            }
            else if (source == e_arrow_centered)
            {
            	if(source.isSelected()) 
            	{
            		vv.getRenderer().getEdgeRenderer().setEdgeArrowRenderingSupport(new CenterEdgeArrowRenderingSupport());
            	} 
            	else
            	{
            		vv.getRenderer().getEdgeRenderer().setEdgeArrowRenderingSupport(new BasicEdgeArrowRenderingSupport());
            	}
            }
            else if (source == font)
            {
                vff.setBold(source.isSelected());
                eff.setBold(source.isSelected());
                //renderSociogramAsImage();
                //System.out.println(vv.getGraphMouse().toString());
            }
            else if (source == v_shape)
            {
                vssa.useFunnyShapes(source.isSelected());
            }
            else if (source == v_size)
            {
                vssa.setScaling(source.isSelected());
            }
            else if (source == v_aspect)
            {
                vssa.setStretching(source.isSelected());
            }
            else if (source == e_line) 
            {
                if(source.isSelected())
                {
                    vv.getRenderContext().setEdgeShapeTransformer(new EdgeShape.Line<Integer,Number>());
                }
            }
            else if (source == e_ortho)
            {
                if (source.isSelected())
                    vv.getRenderContext().setEdgeShapeTransformer(new EdgeShape.Orthogonal<Integer,Number>());
            }
            else if (source == e_wedge)
            {
                if (source.isSelected())
                    vv.getRenderContext().setEdgeShapeTransformer(new EdgeShape.Wedge<Integer,Number>(10));
            }
            else if (source == e_quad) 
            {
                if(source.isSelected())
                {
                    vv.getRenderContext().setEdgeShapeTransformer(new EdgeShape.QuadCurve<Integer,Number>());
                }
            }
            else if (source == e_cubic) 
            {
                if(source.isSelected())
                {
                    vv.getRenderContext().setEdgeShapeTransformer(new EdgeShape.CubicCurve<Integer,Number>());
                }
            }
           else if (source == e_show_d)
            {
                show_edge.showDirected(source.isSelected());
            }
            else if (source == e_show_u)
            {
                show_edge.showUndirected(source.isSelected());
            }
            else if (source == v_small)
            {
                show_vertex.filterSmall(source.isSelected());
            }
            else if(source == zoom_at_mouse)
            {
                //gm.setZoomAtMouse(source.isSelected());
            } 
            else if (source == no_gradient) {
    			if (source.isSelected()) {
    				gradient_level = GRADIENT_NONE;
    			}
    		} 
            else if (source == gradient_relative) {
    			if (source.isSelected()) {
    				gradient_level = GRADIENT_RELATIVE;
    			}
    		}
            else if (source == fill_edges)
            {
            	if(source.isSelected()) {
            		vv.getRenderContext().setEdgeFillPaintTransformer( edgeFillPaint );
            	} else {
            		vv.getRenderContext().setEdgeFillPaintTransformer( new ConstantTransformer(null) );
            	}
            }

        vv.repaint();
    }
    
    private final class SeedDrawColor<V> implements Transformer<V,Paint>
    {
        protected PickedInfo<V> pi;
        protected final static float dark_value = 0.8f;
        protected final static float light_value = 0.2f;
        protected boolean seed_coloring;
        
        public SeedDrawColor(PickedInfo<V> pi)
        {
            this.pi = pi;
            seed_coloring = false;
        }

        public void setSeedColoring(boolean b)
        {
            this.seed_coloring = b;
        }
        
        public Paint transform(V v)
        {
            return Color.BLACK;
        }
        
    }
    
    private final class SeedFillColor<V> implements Transformer<V,Paint>
    {
        protected PickedInfo<V> pi;
        protected final static float dark_value = 0.4f; //0.8f
        protected final static float light_value = 0.2f;
        protected boolean seed_coloring;
        
        public SeedFillColor(PickedInfo<V> pi)
        {
            this.pi = pi;
            seed_coloring = false;
        }

        public void setSeedColoring(boolean b)
        {
            this.seed_coloring = b;
        }
        
        
        public Paint transform(V v)
        {
            float alpha = transparency.get(v).floatValue();
            if (pi.isPicked(v))
            {
                //return new Color(1f, 1f, 0, alpha); 
            	return Color.RED; 
            }
            else
            {
                if (seed_coloring && seedVertices.contains(v))
                {
                    Color dark = new Color(0, 0, dark_value, alpha);
                    Color light = new Color(0, 0, light_value, alpha);
                    return new GradientPaint( 0, 0, dark, 10, 0, light, true);
                }
                else
                {
                	return  Color.ORANGE;
                	//return new Color(1f, 0, 0, alpha);
                	//return new Color(27, 148, 224, alpha);
                	  
                }
                    
            }
                
        }
    }

    private final static class EdgeWeightStrokeFunction<E>
    implements Transformer<E,Stroke>
    {
        protected static final Stroke basic = new BasicStroke(1);
        protected static final Stroke heavy = new BasicStroke(2);
        protected static final Stroke dotted = RenderContext.DOTTED;
        
        protected boolean weighted = false;
        protected Map<E,Number> edge_weight;
        
        public EdgeWeightStrokeFunction(Map<E,Number> edge_weight)
        {
            this.edge_weight = edge_weight;
        }
        
        public void setWeighted(boolean weighted)
        {
            this.weighted = weighted;
        }
        
        public Stroke transform(E e)
        {
            if (weighted)
            {
                if (drawHeavy(e))
                    return heavy;
                else
                    return dotted;
            }
            else
                return basic;
        }
        
        protected boolean drawHeavy(E e)
        {
            double value = edge_weight.get(e).doubleValue();
            if (value > 0.7)
                return true;
            else
                return false;
        }
        
    }
    
    private final static class VertexStrokeHighlight<V,E> implements
    Transformer<V,Stroke>
    {
        protected boolean highlight = false;
        protected Stroke heavy = new BasicStroke(5);
        protected Stroke medium = new BasicStroke(3);
        protected Stroke light = new BasicStroke(1);
        protected PickedInfo<V> pi;
        protected Graph<V,E> graph;
        
        public VertexStrokeHighlight(Graph<V,E> graph, PickedInfo<V> pi)
        {
        	this.graph = graph;
            this.pi = pi;
        }
        
        public void setHighlight(boolean highlight)
        {
            this.highlight = highlight;
        }
        
        public Stroke transform(V v)
        {
            if (highlight)
            {
                if (pi.isPicked(v))
                    return heavy;
                else
                {
                	for(V w : graph.getNeighbors(v)) {
                        if (pi.isPicked(w))
                            return medium;
                    }
                    return light;
                }
            }
            else
                return light; 
        }

    }
    
    private final static class VertexStrokeSearch<V,E> implements
    Transformer<V,Stroke>
    {
        protected boolean highlight = false;
        protected Stroke heavy = new BasicStroke(5);
        protected Stroke medium = new BasicStroke(3);
        protected Stroke light = new BasicStroke(1);
        protected PickedInfo<V> pi;
        protected Graph<V,E> graph;
        
        public VertexStrokeSearch(Graph<V,E> graph, PickedInfo<V> pi)
        {
        	this.graph = graph;
            this.pi = pi;
        }
        
        public void setHighlight(boolean highlight)
        {
            this.highlight = highlight;
        }
        
        public Stroke transform(V v)
        {
            if (highlight)
            {
                if (pi.isPicked(v))
                {
                    return heavy;
                }
                else
                {
                	return light;
                }
            }
            else
                return light; 
        }

    }
    
    
    private final static class VertexFontTransformer<V> 
    	implements Transformer<V,Font>
    {
        protected boolean bold = false;
        Font f = new Font("Helvetica", Font.PLAIN, 12);
        Font b = new Font("Helvetica", Font.BOLD, 12);
        
        public void setBold(boolean bold)
        {
            this.bold = bold;
        }
        
        public Font transform(V v)
        {
            if (bold)
                return b;
            else
                return f;
        }
    }

    private final static class EdgeFontTransformer<E> 
        implements Transformer<E,Font>
{
    protected boolean bold = false;
    Font f = new Font("Helvetica", Font.PLAIN, 12);
    Font b = new Font("Helvetica", Font.BOLD, 12);
    
    public void setBold(boolean bold)
    {
        this.bold = bold;
    }
    
    public Font transform(E e)
    {
        if (bold)
            return b;
        else 
            return f;
    }
}
    private final static class DirectionDisplayPredicate<V,E> 
    	implements Predicate<Context<Graph<V,E>,E>>
    	//extends AbstractGraphPredicate<V,E>
    {
        protected boolean show_d;
        protected boolean show_u;
        
        public DirectionDisplayPredicate(boolean show_d, boolean show_u)
        {
            this.show_d = show_d;
            this.show_u = show_u;
        }
        
        public void showDirected(boolean b)
        {
            show_d = b;
        }
        
        public void showUndirected(boolean b)
        {
            show_u = b;
        }
        
        public boolean evaluate(Context<Graph<V,E>,E> context)
        {
        	Graph<V,E> graph = context.graph;
        	E e = context.element;
            if (graph.getEdgeType(e) == EdgeType.DIRECTED && show_d) {
                return true;
            }
            if (graph.getEdgeType(e) == EdgeType.UNDIRECTED && show_u) {
                return true;
            }
            return false;
        }
    }
    
    private final static class VertexDisplayPredicate<V,E>
    	implements Predicate<Context<Graph<V,E>,V>>
//    	extends  AbstractGraphPredicate<V,E>
    {
        protected boolean filter_small;
        //protected final static int MIN_DEGREE = 4;
        public int degree_value = 4;
        public String filterOperator = "LT";
        
        public VertexDisplayPredicate(boolean filter)
        {
            this.filter_small = filter;
        }
        
        public void filterSmall(boolean b)
        {
            filter_small = b;
        }
        
        public boolean evaluate(Context<Graph<V,E>,V> context) {
        	Graph<V,E> graph = context.graph;
        	V v = context.element;
//            Vertex v = (Vertex)arg0;
            if (filter_small)
            {
                //return (graph.degree(v) >= MIN_DEGREE);
            	if (filterOperator.equals("Greater Than"))
            	{
            		return (graph.degree(v) >= degree_value);
            	}
            	else
            	{
            		return (graph.degree(v) <= degree_value);
            	}
            }
            else
            {
                return true;
            }
        }
    }
    
    private final static class VertexShapeSizeAspect<V,E>
    extends AbstractVertexShapeTransformer <V>
    implements Transformer<V,Shape>  {
    	
        protected boolean stretch = false;
        protected boolean scale = false;
        protected boolean funny_shapes = false;
        protected Transformer<V,Double> voltages;
        protected Graph<V,E> graph;
//        protected AffineTransform scaleTransform = new AffineTransform();
        
        public VertexShapeSizeAspect(Graph<V,E> graphIn, Transformer<V,Double> voltagesIn)
        {
        	this.graph = graphIn;
            this.voltages = voltagesIn;
            setSizeTransformer(new Transformer<V,Integer>() {

				public Integer transform(V v) {
		            if (scale)
		            {
		            	int size = 20;
		            	if (voltages!=null)
		            	{
		            		size = (int)(voltages.transform(v) * 30) + 20;
		            	}
		                return size;
		            }
		            else
		                return 20;

				}});
            setAspectRatioTransformer(new Transformer<V,Float>() {

				public Float transform(V v) {
		            if (stretch) {
		                return (float)(graph.inDegree(v) + 1) / 
		                	(graph.outDegree(v) + 1);
		            } else {
		                return 1.0f;
		            }
				}});
        }
        
		public void setStretching(boolean stretch)
        {
            this.stretch = stretch;
        }
        
        public void setScaling(boolean scale)
        {
            this.scale = scale;
        }
        
        public void useFunnyShapes(boolean use)
        {
            this.funny_shapes = use;
        }
        
        public Shape transform(V v)
        {
            if (funny_shapes)
            {
                if (graph.degree(v) < 5)
                {	
                    int sides = Math.max(graph.degree(v), 3);
                    return factory.getRegularPolygon(v, sides);
                }
                else
                    return factory.getRegularStar(v, graph.degree(v));
            }
            else
                return factory.getEllipse(v);
        }
    }
    
    /**
     * a GraphMousePlugin that offers popup
     * menu support
     */
    protected class PopupGraphMousePlugin extends AbstractPopupGraphMousePlugin
    	implements MouseListener {
        
        public PopupGraphMousePlugin() {
            this(MouseEvent.BUTTON3_MASK);
        }
        public PopupGraphMousePlugin(int modifiers) {
            super(modifiers);
        }
        
        /**
         * If this event is over a Vertex, pop up a menu to
         * allow the user to increase/decrease the voltage
         * attribute of this Vertex
         * @param e
         */
        @SuppressWarnings("unchecked")
        protected void handlePopup(MouseEvent e) {
            final VisualizationViewer<Integer,Number> vv = 
                (VisualizationViewer<Integer,Number>)e.getSource();
            Point2D p = e.getPoint();//vv.getRenderContext().getBasicTransformer().inverseViewTransform(e.getPoint());

            GraphElementAccessor<Integer,Number> pickSupport = vv.getPickSupport();
            if(pickSupport != null) {
                final Integer v = pickSupport.getVertex(vv.getGraphLayout(), p.getX(), p.getY());
                if(v != null) {
                    JPopupMenu popup = new JPopupMenu();
                    popup.add(new AbstractAction("Decrease Transparency") {
                        public void actionPerformed(ActionEvent e) {
                        	Double value = Math.min(1, 
                        		transparency.get(v).doubleValue()+0.1);
                        	transparency.put(v, value);
                            vv.repaint();
                        }
                    });
                    popup.add(new AbstractAction("Increase Transparency"){
                        public void actionPerformed(ActionEvent e) {
                        	Double value = Math.max(0, 
                            		transparency.get(v).doubleValue()-0.1);
                            	transparency.put(v, value);
                            vv.repaint();
                        }
                    });
                    popup.show(vv, e.getX(), e.getY());
                } else {
                    final Number edge = pickSupport.getEdge(vv.getGraphLayout(), p.getX(), p.getY());
                    if(edge != null) {
                        JPopupMenu popup = new JPopupMenu();
                        popup.add(new AbstractAction(edge.toString()) {
                            public void actionPerformed(ActionEvent e) {
                                System.err.println("got "+edge);
                            }
                        });
                        popup.show(vv, e.getX(), e.getY());
                       
                    }
                }
            }
        }
    }
    
    public class VoltageTips<E>
    	implements Transformer<Integer,String> {
        
        public String transform(Integer vertex) { 
        	
            DecimalFormat df2 = new DecimalFormat( "#,###,###,##0.00" );
            String vertex_info = "<html>";
            vertex_info = vertex_info + "Voltage: "+voltages.transform(vertex) + "<br>";
            vertex_info = vertex_info + "Posts: "+noposts.get(vertex) + "<br>";
            vertex_info = vertex_info + "Degree: "+degree.get(vertex) + "<br>";
            vertex_info = vertex_info + "In-Degree: "+indegree.get(vertex) + "<br>";
            vertex_info = vertex_info + "Out-Degree: "+outdegree.get(vertex) + "<br>";
            vertex_info = vertex_info + "Betweenness Centrality: "+df2.format(betweennesscentrality.get(vertex)) + "<br>";
            //vertex_info = vertex_info + "Closeness Centrality: "+df2.format(closenesscentrality.get(vertex)) + "<br>";
            vertex_info = vertex_info + "Eigenvector Centrality: "+df2.format(eigenvectorcentrality.get(vertex)) + "<br>";    
            vertex_info = vertex_info + "</html>";
           return vertex_info;
        }
    }
    
    public class GradientPickedEdgePaintFunction<V,E> extends GradientEdgePaintTransformer<V,E> 
    {
        private Transformer<E,Paint> defaultFunc;
        protected boolean fill_edge = false;
        Predicate<Context<Graph<V,E>,E>> selfLoop = new SelfLoopEdgePredicate<V,E>();
        
        public GradientPickedEdgePaintFunction(Transformer<E,Paint> defaultEdgePaintFunction, 
                VisualizationViewer<V,E> vv) 
        {
            super(Color.WHITE, Color.BLACK, vv);
            this.defaultFunc = defaultEdgePaintFunction;
        }
        
        public void useFill(boolean b)
        {
            fill_edge = b;
        }
        
        public Paint transform(E e) {
            if (gradient_level == GRADIENT_NONE) {
                return defaultFunc.transform(e);
            } else {
            	return super.transform(e);
            }
        }
        
        protected Color getColor2(E e)
        {
            return vv.getPickedEdgeState().isPicked(e)? Color.CYAN : c2;
        }
        
        
    }
    
    static class ViewGrid implements Paintable {

        VisualizationViewer master;
        VisualizationViewer vv;
        
        public ViewGrid(VisualizationViewer vv, VisualizationViewer master) {
            this.vv = vv;
            this.master = master;
        }
        public void paint(Graphics g) {
            ShapeTransformer masterViewTransformer = master.getRenderContext().getMultiLayerTransformer().getTransformer(Layer.VIEW);
            ShapeTransformer masterLayoutTransformer = master.getRenderContext().getMultiLayerTransformer().getTransformer(Layer.LAYOUT);
            ShapeTransformer vvLayoutTransformer = vv.getRenderContext().getMultiLayerTransformer().getTransformer(Layer.LAYOUT);

            Rectangle rect = master.getBounds();
            GeneralPath path = new GeneralPath();
            path.moveTo(rect.x, rect.y);
            path.lineTo(rect.width,rect.y);
            path.lineTo(rect.width, rect.height);
            path.lineTo(rect.x, rect.height);
            path.lineTo(rect.x, rect.y);
            
            for(int i=0; i<=rect.width; i+=rect.width/10) {
            		path.moveTo(rect.x+i, rect.y);
            		path.lineTo(rect.x+i, rect.height);
            }
            for(int i=0; i<=rect.height; i+=rect.height/10) {
            		path.moveTo(rect.x, rect.y+i);
            		path.lineTo(rect.width, rect.y+i);
            }
            Shape lens = path;
            lens = masterViewTransformer.inverseTransform(lens);
            lens = masterLayoutTransformer.inverseTransform(lens);
            lens = vvLayoutTransformer.transform(lens);
            Graphics2D g2d = (Graphics2D)g;
            Color old = g.getColor();
            g.setColor(Color.cyan);
            g2d.draw(lens);
            
            path = new GeneralPath();
            path.moveTo((float)rect.getMinX(), (float)rect.getCenterY());
            path.lineTo((float)rect.getMaxX(), (float)rect.getCenterY());
            path.moveTo((float)rect.getCenterX(), (float)rect.getMinY());
            path.lineTo((float)rect.getCenterX(), (float)rect.getMaxY());
            Shape crosshairShape = path;
            crosshairShape = masterViewTransformer.inverseTransform(crosshairShape);
            crosshairShape = masterLayoutTransformer.inverseTransform(crosshairShape);
            crosshairShape = vvLayoutTransformer.transform(crosshairShape);
            g.setColor(Color.black);
            g2d.setStroke(new BasicStroke(3));
            g2d.draw(crosshairShape);
            
            g.setColor(old);
        }

        public boolean useTransform() {
            return true;
        }
    }
    
    /**
     * @return
     */
    @SuppressWarnings("unchecked")
    private static Class<? extends Layout>[] getCombos()
    {
        List<Class<? extends Layout>> layouts = new ArrayList<Class<? extends Layout>>();
        layouts.add(KKLayout.class);
        layouts.add(FRLayout.class);
        layouts.add(CircleLayout.class);
        layouts.add(SpringLayout.class);
        layouts.add(SpringLayout2.class);
        layouts.add(ISOMLayout.class);
        return layouts.toArray(new Class[0]);
    }
    
    private static final class LayoutChooser implements ActionListener
    {
        private final JComboBox jcb;
        private final VisualizationViewer<Integer,Number> vv;

        private LayoutChooser(JComboBox jcb, VisualizationViewer<Integer,Number> vv)
        {
            super();
            this.jcb = jcb;
            this.vv = vv;
        }

        public void actionPerformed(ActionEvent arg0)
        {

            try
            {
            
                Layout<Integer,Number> l = new FRLayout<Integer,Number>(g);

                l.setInitializer(vv.getGraphLayout());
                l.setSize(vv.getSize());
                
				LayoutTransition<Integer,Number> lt =
					new LayoutTransition<Integer,Number>(vv, vv.getGraphLayout(), l);
				Animator animator = new Animator(lt);
				animator.start();
				vv.getRenderContext().getMultiLayerTransformer().setToIdentity();
				vv.repaint();
                
            }
            catch (Exception e)
            {
                e.printStackTrace();
            }
        }
    }
}