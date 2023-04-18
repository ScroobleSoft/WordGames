
//---------------------------------------------------
//---------- GEOMETRIC UTILITIES --------------------
var GeometricUtilities = function() {
   //FUTURE: if getting cos and sin is slow, can keep a table of values of principle or all 360 angles
   var SinHalf45, CosHalf45;

   var X, Y;
   var Angle;
   var Rectangle;

   var i;
};
GeometricUtilities.prototype = {
   Set() {
      this.SinHalf45 = Math.sin(Math.PI/8);
      this.CosHalf45 = Math.cos(Math.PI/8);
      this.Rectangle = new GenieRect();

      //TODO: could set ScreenRect here
   },
   DegreesToRadians(degrees) {

      return((degrees/180)*Math.PI);
   },
   RadiansToDegrees(radians) {

      this.Angle = Math.round((radians/Math.PI)*180);
      if (this.Angle<0)
	 this.Angle += DEGREES;
      if (this.Angle==DEGREES)
	 this.Angle = 0;

      return(this.Angle);
   },
   NormalizeAngle(angl) {

      if (angl<0)
	 angl += DEGREES;
      if (angl>=DEGREES)
	 angl -= DEGREES;

      return (angl);
   },
   GetAngle(vctrA, vctrB) {  //NOTE: if a second parameter is used, the arguments actually refer to unit positions

      if (vctrB)
	 this.Angle = this.RadiansToDegrees(Math.atan2(vctrB.X-vctrA.X, vctrA.Y-vctrB.Y));
      else
	 this.Angle = this.RadiansToDegrees(Math.atan2(vctrA.X, -vctrA.Y));

      if (this.Angle<0)
	 this.Angle += DEGREES;

      return (this.Angle);
   },
   Rotate(crds, angle, bAnticlockwise) {
      angle = this.DegreesToRadians(angle);
      if (bAnticlockwise) {  //NOTE: rotating in opposite direction due to negation of Y coord
	 this.X = (crds.X*Math.cos(angle)) + (Math.sin(angle)*crds.Y);
	 this.Y = (crds.Y*Math.cos(angle)) - (Math.sin(angle)*crds.X);
      } else {
	 this.X = (crds.X*Math.cos(angle)) - (crds.Y*Math.sin(angle));
	 this.Y = (crds.X*Math.sin(angle)) + (crds.Y*Math.cos(angle));
      }
      crds.X = this.X;
      crds.Y = this.Y;
   },
   RotateCoordsArray(aCoords, angle, bAnticlockwise) {
      if (!angle)
	 return;
      for (this.i=0;this.i<aCoords.length;++this.i)
	 this.Rotate(aCoords[this.i], angle, bAnticlockwise);
   },
   Get360Rotations(crds, aCoords) {
      var i;

      for (i=0;i<DEGREES;++i) {
	 aCoords[i].Set(crds.X, crds.Y);
	 this.Rotate(aCoords[i], i);
      }
   },
   DuplicateVertices(trgt, src) {
      for (this.i=0;this.i<src.length;++this.i)
	 trgt[this.i].Set(src[this.i].X, src[this.i].Y);
   },
   GetClosestDirection(angl1, angl2) {  //NOTE: if angl1 is closer to angl2 clockwise, return -1, else +1

      angl1 -= angl2;
      if (angl1<0)
	 angl1 += DEGREES;
      if (angl1<180)
	 return (-1);
      else
	 return (1);
   },
   CartesianToIsometric(crds, bAnticlockwise, bModify, page) {
      if (page) {
	 crds.X -=  page.W/2;
	 crds.Y -=  page.H/2;
      } else {
	 crds.X -=  SCREEN.WIDTH/2;
	 crds.Y -=  SCREEN.HEIGHT/2;
      }
      if (bAnticlockwise) {
	 this.X = 0.5*(crds.X+crds.Y);
	 this.Y = 0.25*(crds.Y-crds.X);
      } else {
	 this.X = 0.5*(crds.X-crds.Y);
	 this.Y = 0.25*(crds.X+crds.Y);
      }
      if (page) {
	 this.X +=  page.W/2;
	 this.Y +=  page.H/2;
      } else {
	 this.X += SCREEN.WIDTH/2;
	 this.Y += SCREEN.HEIGHT/2;
      }
      if (bModify) {
	 crds.X = this.X;
	 crds.Y = this.Y;
      } else
	 return ( { X: this.X, Y: this.Y } );
   },
   IsometricToCartesian(crds, bAnticlockwise, bModify, page) {
      if (page) {
	 crds.X -=  page.W/2;
	 crds.Y -=  page.H/2;
      } else {
	 crds.X -=  SCREEN.WIDTH/2;
	 crds.Y -=  SCREEN.HEIGHT/2;
      }
      if (bAnticlockwise) {  //totally UNTESTED
	 this.X = crds.X + (2*crds.Y);
	 this.Y = crds.X - (2*crds.Y);
      } else {
	 this.X = crds.X - (2*crds.Y);
	 this.Y = crds.X + (2*crds.Y);
      }
      if (page) {
	 this.X +=  page.W/2;
	 this.Y +=  page.H/2;
      } else {
	 this.X += SCREEN.WIDTH/2;
	 this.Y += SCREEN.HEIGHT/2;
      }
      if (bModify) {
	 crds.X = this.X;
	 crds.Y = this.Y;
      } else
	 return ( { X: this.X, Y: this.Y } );
   },
   CartesianToSemiIsometric(crds, bAnticlockwise, bModify, page) {

      //TODO: should factor in ScreenRect here instead of doing it before calling method

      if (page) {
	 crds.X -=  page.W/2;
	 crds.Y -=  page.H/2;
      } else {
	 crds.X -=  SCREEN.WIDTH/2;
	 crds.Y -=  SCREEN.HEIGHT/2;
      }
      if (bAnticlockwise) {  //NOTE: rotating in opposite direction due to negation of Y coord
	 this.X = (this.CosHalf45*crds.X) + (this.SinHalf45*crds.Y);
	 this.Y = ((this.CosHalf45*crds.Y)-(this.SinHalf45*crds.X))/2;
      } else {
	 this.X = (this.CosHalf45*crds.X) - (this.SinHalf45*crds.Y);
	 this.Y = ((this.SinHalf45*crds.X)+(this.CosHalf45*crds.Y))/2;
      }
      if (page) {
	 this.X +=  page.W/2;
	 this.Y +=  page.H/2;
      } else {
	 this.X += SCREEN.WIDTH/2;
	 this.Y += SCREEN.HEIGHT/2;
      }
      if (bModify) {
	 crds.X = this.X;
	 crds.Y = this.Y;
      } else
	 return ( { X: this.X, Y: this.Y } );
   },
   SemiIsometricToCartesian(crds, bAnticlockwise, bModify, page) {

      //TODO: should factor in ScreenRect here instead of doing it before calling method

      crds.X -=  SCREEN.WIDTH/2;
      crds.Y -=  SCREEN.HEIGHT/2;
      crds.Y *= 2;
      if (bAnticlockwise) {  //NOTE: rotating in opposite direction due to negation of Y coord
	 this.X = (this.CosHalf45*crds.X) + (this.SinHalf45*crds.Y);
	 this.Y = (this.CosHalf45*crds.Y) - (this.SinHalf45*crds.X);
      } else {
	 this.X = (this.CosHalf45*crds.X) - (this.SinHalf45*crds.Y);
	 this.Y = (this.SinHalf45*crds.X) + (this.CosHalf45*crds.Y);
      }
      if (page) {
      this.X += page.W/2;
      this.Y += page.H/2;
      } else {
      this.X += SCREEN.WIDTH/2;
      this.Y += SCREEN.HEIGHT/2;
      }
      if (bModify) {
	 crds.X = this.X;
	 crds.Y = this.Y;
      } else
	 return ( { X: this.X, Y: this.Y } );
   },
   CheckPointInBox(crds, rect, border) {
      border = border || 0;
      if (!(rect.X==undefined)) {
	 this.Rectangle.L = rect.X;
	 this.Rectangle.T = rect.Y;
      } else {
	 this.Rectangle.L = rect.L;
	 this.Rectangle.T = rect.T;
      }
      this.Rectangle.L -= (border/2);
      this.Rectangle.T -= (border/2);
      this.Rectangle.W = rect.W + border;
      this.Rectangle.H = rect.H + border;
	 
      return ((crds.X>=this.Rectangle.L) && (crds.X<=this.Rectangle.L+this.Rectangle.W) && (crds.Y>=this.Rectangle.T) && (crds.Y<=this.Rectangle.T+this.Rectangle.H));
   },
   PerspectiveAdjust(crds, prspctv, reverse) {  //ISSUE: is reverse REDUNDANT?
      if (reverse)
	 switch (prspctv) {
	    case PERSPECTIVE.SIDeVIEW:
	       crds.Y *= 2;
	       break;
	    case PERSPECTIVE.ISOMETRIC:
	       this.IsometricToCartesian(crds, CLOCKWISE, MODIFY, SCREEN);
	       break;
	    case PERSPECTIVE.SEMiISOMETRIC:
	       this.SemiIsometricToCartesian(crds, CLOCKWISE, MODIFY, SCREEN);
	       break;
	 }
      else
	 switch (prspctv) {
	    case PERSPECTIVE.SIDeVIEW:
	       crds.Y /= 2;
	       break;
	    case PERSPECTIVE.ISOMETRIC:
	       this.CartesianToIsometric(crds, ANTiCLOCKWISE, MODIFY, SCREEN);
	       break;
	    case PERSPECTIVE.SEMiISOMETRIC:
	       this.CartesianToSemiIsometric(crds, ANTiCLOCKWISE, MODIFY, SCREEN);
	       break;
	 }
   }
};

var GeoUtils = new GeometricUtilities();
GeoUtils.Set();
