
//------------------------------------------------------
//---------- INTERSECTION UTILITIES --------------------
var IntersectionUtilities = function() {
   var Coords, Rectangle;
   var Vector1, Vector2;		//for ::PointInPolygon
   var CrossProduct, Polarity;		//for ::PointInPolygon

   var i, j, dstnc;
};
IntersectionUtilities.prototype = {
   Set() {

      this.Coords = new Coordinate2D();
      this.Rectangle = new GenieRect();
      this.Vector1 = new Coordinate2D();
      this.Vector2 = new Coordinate2D();
   },
   CheckBoxBox(rct1, rct2) {

      if ( (rct1.L<(rct2.L+rct2.W)) && ((rct1.L+rct1.W)>rct2.L) && (rct1.T<(rct2.T+rct2.H)) && ((rct1.T+rct1.H)>rct2.T) )
	 return (true);
      else
	 return (false);
   },
   CheckPointPolygon(pnt, plygn) {  //NOTE: only works for convex polygons

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
   }
};

var InterUtils = new IntersectionUtilities();
InterUtils.Set();
