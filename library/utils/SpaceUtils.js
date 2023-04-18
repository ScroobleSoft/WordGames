/*
 *  COLLISION DETECTION: have to several ones - box-box, box-circle, polygon-box, polygon-ploygon, circle/box.mash-circle/box.mash and so on
 */
//-------------------------------------------------
//---------- SPATIAL UTILITIES --------------------
var SpatialUtilities = function() {
   var Coords, Rectangle;
   var Vector1, Vector2;		//for ::PointInPolygon
   var CrossProduct, Polarity;		//for ::PointInPolygon

   var i, j, dstnc;
};
SpatialUtilities.prototype = {
   Set() {
      this.Coords = new Coordinate2D();
      this.Rectangle = new GenieRect();
      this.Vector1 = new Coordinate2D();
      this.Vector2 = new Coordinate2D();
   },
   GetDistance(cA, cB) {  //c-coords
      return (Math.sqrt(Math.pow(cA.X-cB.X, 2) + Math.pow(cA.Y-cB.Y, 2)));
   },
   Get3DDistance(cA, cB) {  //c-coords
      return (Math.sqrt(Math.pow(cA.X-cB.X,2) + Math.pow(cA.Y-cB.Y,2) + Math.pow(cA.Z-cB.Z,2)));
   },
   CheckPointInCircle(pnt, cCenter, cRadius) {  //c- circle

      //First do a basic check to save calculation time - NOTE: this cuts down duration to roughly half
      if (Math.abs(pnt.X-cCenter.X)>cRadius)
	 return (false);
      if (Math.abs(pnt.Y-cCenter.Y)>cRadius)
	 return (false);

      return (this.GetDistance(pnt, cCenter)<=cRadius);
   },
   CheckPointInBox(pnt, rect, border) {
      if (!(rect.X==undefined)) {
	 this.Rectangle.L = rect.X;
	 this.Rectangle.T = rect.Y;
      } else {
	 this.Rectangle.L = rect.L;
	 this.Rectangle.T = rect.T;
      }
      this.Rectangle.W = rect.W;
      this.Rectangle.H = rect.H;
      if (border) {
	 this.Rectangle.L -= (border/2);
	 this.Rectangle.T -= (border/2);
	 this.Rectangle.W += border;
	 this.Rectangle.H += border;
      }
	 
      return ((pnt.X>=this.Rectangle.L) && (pnt.X<=this.Rectangle.L+this.Rectangle.W) && (pnt.Y>=this.Rectangle.T) && (pnt.Y<=this.Rectangle.T+this.Rectangle.H));
   },
   CheckBoxBoxIntersection(rect1, rect2) {
      if ( (rect1.L<(rect2.L+rect2.W)) && ((rect1.L+rect1.W)>rect2.L) && (rect1.T<(rect2.T+rect2.H)) && ((rect1.T+rect1.H)>rect2.T) )
	 return (true);
      else
	 return (false);
   },
   CheckPointInDiamond(pnt, dmnd) {  //same as ::CheckPointInPolygon, except with two quick additional tests for speed

      //First do a basic distance check
      if (Math.abs(pnt.X-dmnd[0].X)>dRadius)
	 return (false);
      if (Math.abs(pnt.Y-dmnd[1].Y)>dRadius)
	 return (false);

      //Check if in enclosing square
      this.Coords.Set(dmnd[0].X, dmnd[1].Y);		//diamond radius
      this.dstnc = dmnd[1].X - dmnd[0].X;		//diamond centre
      this.Rectangle.Set(this.Coords.X-this.dstnc, this.Coords.Y-this.dstnc, 2*this.dstnc, 2*this.dstnc);
      if (!this.CheckPointInBox(pnt, this.Rectangle))
	 return (false);

      return (this.CheckPointInPolygon(pnt, dmnd));
   },
   CheckPointInPolygon(pnt, plygn) {  //NOTE: only works for convex polygons

      this.Polarity = false;
      for (this.i=0;this.i<plygn.length;++this.i) {
	 this.Vector1.X = pnt.X - plygn[this.i].X;
	 this.Vector1.Y = pnt.Y - plygn[this.i].Y;
	 if (this.i!=plygn.length-1) {
	    this.Vector2.X = plygn[this.i+1].X - plygn[this.i].X;
	    this.Vector2.Y = plygn[this.i+1].Y - plygn[this.i].Y;
	 } else {
	    this.Vector2.X = plygn[0].X - plygn[this.i].X;
	    this.Vector2.Y = plygn[0].Y - plygn[this.i].Y;
	 }
	 this.CrossProduct = (this.Vector1.X*this.Vector2.Y) - (this.Vector1.Y*this.Vector2.X);
	 if (!this.Polarity)
	    this.Polarity = this.CrossProduct>0 ? 2 : 1;
	 else {
	    if (this.Polarity==2 && this.CrossProduct<0)
	       return (false);
	    if (this.Polarity==1 && this.CrossProduct>0)
	       return (false);
	 }
      }

      return (true);
   },
   CheckPolygonsIntersecting(plygn1, plygn2) {

      for (this.j=0;this.j<plygn1.length;++this.j)
	 if (this.CheckPointInPolygon(plygn1[this.j], plygn2))
	    return (true);

      return (false);
   },
   CheckBoxQuadIntersection(rct, plygn) {  //UNTESTED - needs to be renamed to BoxPolygon (TODO)

      //Check if any box corners are inside the polygon
      this.Coords.Set(rct.L, rct.T);
      if (this.CheckPointInPolygon(this.Coords, plygn))
	 return (true);
      this.Coords.Set(rct.L+rct.W, rct.T);
      if (this.CheckPointInPolygon(this.Coords, plygn))
	 return (true);
      this.Coords.Set(rct.L+rct.W, rct.T+rct.H);
      if (this.CheckPointInPolygon(this.Coords, plygn))
	 return (true);
      this.Coords.Set(rct.L, rct.T+rct.H);
      if (this.CheckPointInPolygon(this.Coords, plygn))
	 return (true);

      //Check if any polygon vertices are inside the box
      for (this.i=0;this.i<plygn.lngth;++this.i)
	 if (this.CheckPointInBox(plygn[this.i], rct))
	    return (true);
   },
   CheckCirclesIntersection(c1Center, c1Radius, c2Center, c2Radius) {

      //First do a cheap plus/minus based test
      if (Math.abs(c1Center.X-c2Center.X)>(c1Radius+c2Radius) || Math.abs(c1Center.Y-c2Center.Y)>(c1Radius+c2Radius))
	 return (false);

      //Now do the more expensive square and root test 
      this.dstnc = this.GetDistance(c1Center, c2Center);
      if (this.dstnc<=c1Radius+c2Radius)
	 return (true);
      else
	 return (false);
   },
   CheckBoxCircleIntersection(rct, cPos, rds) {  //NOTE: this is an inexact method (see Utilities.rtf for details)

      //Do a basic distance based check (pretty much a box-box check)
      this.Coords.Set(rct.L+(rct.W/2), rct.T+(rct.H/2));		//calculate rectangle mid-point
      if ((Math.abs(cPos.X-this.Coords.X)>(rds+(rct.W/2))) || (Math.abs(cPos.Y-this.Coords.Y)>(rds+(rct.H/2))))
	 return (false);

      //Check if any of the rectangle's corners are inside the circle
      if (this.CheckPointInCircle( { X: rct.L, Y: rct.T }, cPos, rds))
	 return (true);
      if (this.CheckPointInCircle( { X: rct.L+rct.W, Y: rct.T }, cPos, rds))
	 return (true);
      if (this.CheckPointInCircle( { X: rct.L+rct.W, Y: rct.T+rct.H }, cPos, rds))
	 return (true);
      if (this.CheckPointInCircle( { X: rct.L, Y: rct.T+rct.H }, cPos, rds))
	 return (true);

      //Do a width-wise and height-wise check
      if (Math.abs(cPos.X-this.Coords.X)<=(rds+(rct.W/2)) && Math.abs(cPos.Y-this.Coords.Y)<=(rds+(rct.H/2))) {
	 this.distance = Math.sqrt( Math.pow(rct.W/2,2) + Math.pow(rct.H/2,2) );			//calculate half the box's diagonal
	 if (this.GetDistance(this.Coords, cPos)<(this.distance+rds))
	    return (true);
	 }

      return (false);
   }
};

var SpaceUtils = new SpatialUtilities();
SpaceUtils.Set();
