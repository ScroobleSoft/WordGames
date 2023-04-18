
//-----------------------------------------------------
//---------- PERSPECTIVE UTILITIES --------------------
var PerspectiveUtilities = function() {
   var ScreenRect, ScreenQuad;
   var Perspective;
   var Scale;
   var CustomMapper;
   var TopWidth, BottomWidth, Height, LegOffset;	//dimensions are of inverted isoceles trapezoid; 'leg' refers to differential between
   var QuadCentre;					// top-left x-coord and bottom-left x-coord (for Bird's-Eye)
   var Quad;
};
PerspectiveUtilities.prototype = {
   Set() {
/*
      this.Coords = new Coordinate2D();
      this.Rectangle = new GenieRect();
      this.Vector1 = new Coordinate2D();
      this.Vector2 = new Coordinate2D();
*/
      this.QuadCentre = new Coordinate2D();
   },
   SetPerspective(prspctv, sRect, sQuad, scale, fnctn) {  //NOTE: scale is a scalar if SideView, or of type Coordinate2D if Bird's Eye; fnctn- callback function

      //UNLOGGED

      this.Perspective = prspctv;
      this.ScreenRect = sRect;
      this.ScreenQuad = sQuad;
      switch (this.Perspective) {
	 case PERSPECTIVE.TOpDOWN:
	    break;
	 case PERSPECTIVE.SIDeVIEW:
	    this.Scale = scale;
	    break;
	 case PERSPECTIVE.BIRDsEYE:
	    this.Scale = scale;
	    this.BottomWidth = this.ScreenRect.W;
	    this.TopWidth = this.ScreenRect.W/this.Scale.X;
	    this.Height = this.ScreenRect.H/this.Scale.Y;
	    this.LegOffset = (this.TopWidth-this.BottomWidth)/2;
	    this.Quad = ArrayUtils.Create(4, Coordinate2D);
	    break;
	 case PERSPECTIVE.ISOMETRIC:
	    break;
	 case PERSPECTIVE.SEMiISOMETRIC:
	    break;
	 case PERSPECTIVE.OVErHEAdISOMETRIC:
	    break;
	 case PERSPECTIVE.CUSTOM:
	    this.CustomMapper = fnctn;
	    break;
      }
   },
   CheckOnScreen(pos, elvtn, w, h) {  //w, h are for padding . . . NOTE: adding w, h to all corners since alignment of pos is unknown

      //UNLOGGED

      w = w || 0;			//ISSUE: these lines might trigger a lot of GARBAGE COLLECTION due to frequent use
      h = h || 0;			//	 ALTERNATIVELY, could set this object's members and then call method
      elvtn = elvtn || 0;
      switch (this.Perspective) {	//ISSUE: very INEFFICIENT to keep calculating quad, so maybe should do checks in batches with like sized units
	 case PERSPECTIVE.BIRDsEYE:
	    this.Quad[0].X = this.ScreenQuad[0].X - w;
	    this.Quad[0].Y = this.ScreenQuad[0].Y - h;
	    this.Quad[0].Y -= elvtn;
	    this.Quad[1].X = this.ScreenQuad[1].X + w;
	    this.Quad[1].Y = this.ScreenQuad[1].Y - h;
	    this.Quad[1].Y -= elvtn;
	    this.Quad[2].X = this.ScreenQuad[2].X + w;
	    this.Quad[2].Y = this.ScreenQuad[2].Y + h;
	    this.Quad[2].Y -= elvtn;
	    this.Quad[3].X = this.ScreenQuad[3].X - w;
	    this.Quad[3].Y = this.ScreenQuad[3].Y + h;
	    this.Quad[3].Y -= elvtn;
	    return (InterUtils.CheckPointPolygon(pos, this.Quad));	//TODO: if this is slow, will try different techniques, such as scaled pos
	    break;							//	checked against .ScreenRect
//	 case PERSPECTIVE.CUSTOM:
//	    break;
	 default:
	    return (true);
      }
   },
   DetermineQuad(x, y) {	//NOTE: x, y are Quad centre coords

      switch (this.Perspective) {
	 case PERSPECTIVE.BIRDsEYE:
//	    this.ScreenQuad[0].X = x - this.LegOffset;
//	    this.ScreenQuad[0].Y = y - this.Height;
	    this.ScreenQuad[0].X = x - (this.TopWidth/2);
	    this.ScreenQuad[0].Y = y - (this.Height/2);
	    this.ScreenQuad[1].X = this.ScreenQuad[0].X + this.TopWidth;
	    this.ScreenQuad[1].Y = this.ScreenQuad[0].Y;
//	    this.ScreenQuad[2].X = this.ScreenQuad[1].X;
//	    this.ScreenQuad[2].Y = y;
	    this.ScreenQuad[2].X = this.ScreenQuad[1].X - this.LegOffset;
	    this.ScreenQuad[2].Y = this.ScreenQuad[1].Y + this.Height;
//	    this.ScreenQuad[3].X = x;
//	    this.ScreenQuad[3].Y = y;
	    this.ScreenQuad[3].X = this.ScreenQuad[2].X - this.BottomWidth;
	    this.ScreenQuad[3].Y = this.ScreenQuad[2].Y;
//	    this.QuadCentre.X = x + (this.BottomWidth/2);
//	    this.QuadCentre.Y = y - (this.Height/2);
	    this.QuadCentre.Set(x, y);
	    break;
	 case PERSPECTIVE.SEMiISOMETRIC:
	    break;
      }
   },
   Map(pnt) {

      //UNLOGGED

      switch (this.Perspective) {
	 case PERSPECTIVE.SIDeVIEW:
	    pnt.Y = (pnt.Y-this.ScreenRect.T)/this.Scale;
	    break;
	 case PERSPECTIVE.BIRDsEYE:
	    pnt.X -= this.QuadCentre.X;
	    pnt.X -= (this.Scale.X/2)*((((this.ScreenRect.H/this.Scale.Y)-pnt.Y)/(this.ScreenRect.H/this.Scale.Y))*pnt.X);
	    pnt.X += this.ScreenRect.W/2;
	    pnt.Y = (this.ScreenRect.T+(this.ScreenRect.H/2)) - ((this.QuadCentre.Y-pnt.Y)*this.Scale.Y);
	    break;
	 case PERSPECTIVE.CUSTOM:
	    this.CustomMapper(pnt);		//NOTE: implemented in app if needed
	    break;
      }
   }
};

var PerspectiveUtils = new PerspectiveUtilities();
PerspectiveUtils.Set();
