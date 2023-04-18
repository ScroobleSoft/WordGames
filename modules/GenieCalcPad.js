
//Cos45
//In some games, might even need Cos1, Cos2 ... Cos90 - have to check speed

//----------------------------------------------
//---------- GENIE CALC PAD --------------------
var GenieCalcPad = function() {
   var Cos45;
   var Polygon;
//TODO: will give the option here of storing frequently used cos/sin of angles in attributes
   var ScreenRect;	//contains dimensions of map section currently on screen

   //Scratch variables
   var i, x1, x2, x, y, inc, distance, angle, iVector, hVector, hvNormal;
//   var vector1, vector2, plrty, cProduct;
};
GenieCalcPad.prototype = {
   Set() {
   },
   SetIsometric() {
      this.Cos45 = Math.cos(Math.PI/4);
   },
   SetPolygonCheck() {
      this.vector1 = new Coordinate2D();
      this.vector2 = new Coordinate2D();
      this.plrty = 0;
      this.cProduct = 0;
   },
   GetRandomNumber(num, rounding) {
      var rndm;

      rndm = Math.random()*num;
      switch (rounding) {
	 case RANDOM.FLOOR:
	    return(Math.floor(rndm));
	 case RANDOM.FLOAT:
	    return(Math.round(rndm));
	 case RANDOM.FLOAT:
	    return(Math.ceil(rndm));
	 default:
	    return(rndm);
      }
   },
   GetRandomNumbers(numArray, rounding) {
   },
   GetPolygonVertices(nSides, size, bAntiClockwise, angle) {
      var i;
      var x, y;
      var Vertex, VertexArray;

      angle = angle || 0;
      angle = Utilities.DegreesToRadians(angle);
      VertexArray = new Array();
      for (i=0;i<nSides;++i) {
	 Vertex = new Coordinate2D();
	 if (bAntiClockwise) {
	    //NOTE: no rounding will be done here
//	    Vertex.X = Math.round((size/2) * Math.sin(angle-(2*Math.PI*(i/nSides))));
//	    Vertex.Y = Math.round((size/2) * Math.cos(angle-(2*Math.PI*(i/nSides))));
	    Vertex.X = (size/2)*Math.sin(angle-(2*Math.PI*(i/nSides)));
	    Vertex.Y = (size/2)*Math.cos(angle-(2*Math.PI*(i/nSides)));
	 } else {
//	    Vertex.X = Math.round((size/2) * Math.cos(angle+(2*Math.PI*(i/nSides))));
//	    Vertex.Y = Math.round((size/2) * Math.sin(angle+(2*Math.PI*(i/nSides))));
	    Vertex.X = (size/2)*Math.sin(angle+(2*Math.PI*(i/nSides)));
	    Vertex.Y = (size/2)*Math.cos(angle+(2*Math.PI*(i/nSides)));
	 }
	 VertexArray.push(Vertex);
      }
   return (VertexArray);
   },
   GetFlatTopHexagonVertices(size, antiClockWise, angle) {  //TODO: REDUNDANT
      var i;
      var x, y;
      var VertexArray;

      angle = angle || 0;
      angle = Utilities.DegreesToRadians(angle);
      VertexArray = new Array();
      for (i=0;i<6;++i) {
	 //NOTE: rounding will cause smaller hexes to appear irregular, but approximately accurate
	 if (antiClockWise) {
	    //Starting with top right corner
	    x = Math.round((size/2) * Math.sin((2*Math.PI*((1/12)-(i/6)))+angle));
	    y = Math.round((size/2) * Math.cos((2*Math.PI*((1/12)-(i/6)))+angle));
	 } else {
	    //Starting with top left corner
	    x = Math.round((size/2) * Math.sin((2*Math.PI*((1/-12)+(i/6)))+angle));
	    y = Math.round((size/2) * Math.cos((2*Math.PI*((1/-12)+(i/6)))+angle));
	 }
	 VertexArray.push({ X: x, Y: y });
      }
      return (VertexArray);
   },
   GetHexagonVertices(size, antiClockWise, angle) {
      return (this.GetFlatTopHexagonVertices(size, antiClockWise, angle));
   },
   GetFlatTopOctagonVertices(size, antiClockWise, angle) {  //should make this REDUNDANT, use below
      angle = angle || 0;
      size = size*(1/Math.cos(Utilities.DegreesToRadians(ANGLE.SEMiISOMETRIC)));
      return(this.GetPolygonVertices(8, size, antiClockWise, ANGLE.SEMiISOMETRIC+angle));
/*
      var angle;
      var vertices;

      angle = Utilities.DegreesToRadians(ANGLE.SEMiISOMETRIC);
      vertices = new Array();
*/
   },
   GetOctagonVertices(size, antiClockWise, angle) {
      return (this.GetFlatTopOctagonVertices(size, antiClockWise, angle));
   },
   GetTruncatedPolygon(polygon, rect) {  //UNTESTED
      var i, j, n, nn;
      var coords;
      var tPolygon;  //t- truncated
      var sCorners;  //s- screen
      var pCentre;  //p- polygon

      //Set up arrays, determine screen corner coords
      tPolygon = new Array();
      sCorners = new Array();
      sCorners.push( { X: rect.L, Y: rect.T } );
      sCorners.push( { X: rect.L+rect.W, Y: rect.T } );
      sCorners.push( { X: rect.L+rect.W, Y: rect.T+rect.H } );
      sCorners.push( { X: rect.L, Y: rect.T+rect.H } );

      //Get all polygons points inside the rect
      for (i=0;i<polygon.length;++i)
	 if (Utilities.CheckPointInBox(polygon[i], rect))
	    tPolygon.push(polygon[i]);

      //Check if all the points are inside
      if (polygon.length==tPolygon.length)
	 return (tPolygon);

      //Get all polygon points intersecting the rect
      for (i=0;i<polygon.length;++i) {
	 n = (i!=polygon.length-1) ? i+1 : 0;
	 for (j=0;j<sCorners.length;++j) {
	    nn = (j!=sCorners.length-1) ? j+1 : 0;
	    coords = this.GetLinesIntersectionCoords(polygon[i], polygon[n], sCorners[j], sCorners[nn]);
	    if (coords)
	       tPolygon.push(coords);
	    }
      }

      //Get all rect corners inside polygon
      for (i=0;i<sCorners.length;++i)
	 if (this.CheckPointInPolygon(sCorners[i], polygon))
	    tPolygon.push(sCorners[i]);

      //Calculate centre of resulting polygon
      pCentre = new Coordinate2D();
      pCentre.X = 0;
      pCentre.Y = 0;
      for (i=0;i<tPolygon.length;++i) {
	 pCentre.X += tPolygon[i].X;
	 pCentre.Y += tPolygon[i].Y;
      }
      pCentre.X /= tPolygon.length;
      pCentre.Y /= tPolygon.length;

      //For each point calculate angle formed with centre, adding a field to store this and sort
      for (i=0;i<tPolygon.length;++i)
	 tPolygon[i].Angle = Math.atan2(tPolygon[i].Y-pCentre.Y, tPolygon[i].X-pCentre.X);
      tPolygon.sort(function(a,b) {return a.Angle-b.Angle;} );

      return (tPolygon);
      //ISSUE: 2 arrays left for garbage collector - switch to a more global scope
   },
   CheckLinesIntersect(sLineA, eLineA, sLineB, eLineB) {  //s- start, e- end
      var point;

      //ISSUE: have to be careful calling GetLinesIntersectionCoords since a divide by zero is possible, so have to check
      //  parameters being passed

      //IMPLEMENTATION: if lines intersect, point has to fall inside one of the two lines' bounding box
      point = this.GetLinesIntersectionCoords(sLineA, eLineA, sLineB, eLineB);
      if (Utilities.CheckPointInBox(point, this.GetVectorBox(sLineA, eLineA)))
	 return (true);  //NOTE: this is a pretty approximate, but probably accurate
      if (Utilities.CheckPointInBox(point, this.GetVectorBox(sLineB, eLineB)))
	 return (true);
      return (false);
   },
   GetLinesIntersectionCoords(sLineA, eLineA, sLineB, eLineB) {
      var x, y;

      //Check if lines are parallel
      if ((sLineA.X==eLineA.X || sLineB.Y==eLineB.Y) && (sLineA.Y==eLineA.Y || sLineB.X==eLineB.X))
	 return (null);  //saves from a divide by zero
      if ((sLineA.X-eLineA.X)/(sLineA.Y-eLineA.Y) == (sLineB.X-eLineB.X)/(sLineB.Y-eLineB.Y))
	 return (null);

      //Get intersection of the non-parallel lines
      x = ((((sLineA.X*eLineA.Y)-(sLineA.Y*eLineA.X))*(sLineB.X-eLineB.X)) - ((sLineA.X-eLineA.X)*((sLineB.X*eLineB.Y)-(sLineB.Y*eLineB.X))))/(((sLineA.X-eLineA.X)*(sLineB.Y-eLineB.Y))-((sLineA.Y-eLineA.Y)*(sLineB.X-eLineB.X)));
      y = ((((sLineA.X*eLineA.Y)-(sLineA.Y*eLineA.X))*(sLineB.Y-eLineB.Y)) - ((sLineA.Y-eLineA.Y)*((sLineB.X*eLineB.Y)-(sLineB.Y*eLineB.X))))/(((sLineA.X-eLineA.X)*(sLineB.Y-eLineB.Y))-((sLineA.Y-eLineA.Y)*(sLineB.X-eLineB.X)));

      //Make sure coords lie on both line segments before returning them
      if (Utilities.CheckPointInBox( { X: x, Y: y }, this.GetVectorBox(sLineA, eLineA)) && Utilities.CheckPointInBox( { X: x, Y: y }, this.GetVectorBox(sLineB, eLineB)))
	 return ( { X: x, Y: y } );
      else
	 return (null);
   },
   VerticesToScreenCoords(vArray, x, y) {  //v - vertex
      var i;

      for (i=0;i<vArray.length;++i) {
	 vArray[i].X += x;
	 vArray[i].Y = y - vArray[i].Y;
      }
   },
   CheckPointInPolygon(point, polygon) {  //NOTE: only works for convex polygons
      var i;
      var cProduct;		//c- cross
      var vector1, vector2;
      var polarity;

      vector1 = new Coordinate2D();
      vector2 = new Coordinate2D();
      for (i=0;i<polygon.length;++i) {
	 vector1.X = point.X-polygon[i].X;
	 vector1.Y = point.Y-polygon[i].Y;
	 if (i!=polygon.length-1) {
	    vector2.X = polygon[i+1].X-polygon[i].X;
	    vector2.Y = polygon[i+1].Y-polygon[i].Y;
	 } else {
	    vector2.X = polygon[0].X-polygon[i].X;
	    vector2.Y = polygon[0].Y-polygon[i].Y;
	 }
	 cProduct = (vector1.X*vector2.Y) - (vector1.Y*vector2.X);
	 if (!polarity)
	    polarity = cProduct>0 ? 2 : 1;
	 else {
	    if (polarity==2 && cProduct<0)
	       return (false);
	    if (polarity==1 && cProduct>0)
	       return (false);
	 }
      }

      return (true);
   },
   CheckLineCircleIntersect(sLine, eLine, cPos, cRds) {  //s- start, e- end, c- circle
      this.distance = Utilities.GetDistance(sLine, eLine);
      for (this.i=0;this.i<this.distance;++this.i) {
	 this.x = sLine.X + ((eLine.X-sLine.X)/this.distance);
	 this.y = sLine.Y + ((eLine.Y-sLine.Y)/this.distance);
	 if (Utilities.GetDistance( { X: this.x, Y: this.y }, cPos)<cRds)
	    return (true);
      }

      return (false);
   },
   GetVectorBox(sCoords, eCoords) {  //returns rect with vector as its diagonal
      var l, t, w, h;

      l = (sCoords.X<eCoords.X) ? sCoords.X : eCoords.X;
      t = (sCoords.Y<eCoords.Y) ? sCoords.Y : eCoords.Y;
      w = Math.abs(sCoords.X-eCoords.X);
      h = Math.abs(sCoords.Y-eCoords.Y);

      return( { L: l, T: t, W: w, H: h } );
   },
   StretchPolygon : function(vertices, scale, axis) {
      var i;

      for (i=0;i<vertices.length;++i) {
	 switch (axis) {
	    case AXIS.X :
	       vertices[i].X *= scale;
	       break;
	    case AXIS.Y :
	       vertices[i].Y *= scale;
	       break;
	    case AXIS.BOTH :
	       vertices[i].X *= scale;
	       vertices[i].Y *= scale;
	       break;
	 }
      }
      return(vertices);
   },
/*
   ScalePolygon(vertices, scale, axis) {
   },
*/
   GetResizedPolygon(vertices, scale) {
      var vertex;
      var polygon;

      polygon = new Array();
      for (this.i=0;this.i<vertices.length;++this.i) {
	 vertex = new Coordinate2D();
	 vertex.X = vertices[this.i].X*scale;
	 vertex.Y = vertices[this.i].Y*scale;
	 polygon.push(vertex);
      }
      return (polygon);
   },
   TopDownToIsometric : function (tdx, tdy) {		//for boards that are rotated anti-clockwise
      var isoLocation;
      var cosineValue;

      isoLocation = new Coordinate2D();
      cosineValue = Math.cos(Math.PI/4);		//to avoid calculating cos(45) every time, 'setting' for
      isoLocation.X = (tdx - tdy)*cosineValue;		//isometric (by calling Set(ISOMETRIC)) will allow a pre-calc
      isoLocation.Y = ((tdx + tdy)*cosineValue)/2;
      return(isoLocation);
   },
   IsometricToTopDown : function(isox, isoy) {
      var topDownLocation;
      var cosineValue;

      isoLocation = new Coordinate2D();
      cosineValue = Math.cos(Math.PI/4);
      topDownLocation.X = (isox/2 + isoy)/cosineValue;
      topDownLocation.Y = (isoy - (isox/2))/cosineValue;
      return(topDownLocation);
   },
   TopDownToOverheadIsometric(tdX, tdY) {		//ASSUMPTION: board rotated anti-clockwise
      return( { X: (tdX-tdY)*this.Cos45, Y: ((tdX+tdY)*this.Cos45)/1.5 } );
   },
   OverheadIsometricToTopDown(oiX, oiY) {
      return( { X: (oiX+oiY)/this.Cos45, Y: ((oiY-oiX)/this.Cos45)*1.5 } );
   },
   PolygonToIsometric : function(vertices) {
      var i;

      for (i=0;i<vertices.length;++i) {
	 vertices[i] = this.TopDownToIsometric(vertices[i].X, vertices[i].Y);
      }
   },
   GetHexagonCoordinates(x, y, size, bPointyTopHexagon) {  //centre of hexagon in a grid
      if (bPointyTopHexagon) {
	 //TBD: may never need this
      } else {
	 if (Math.abs(x) % 2)
	    if (y>=0)
	       return ( { X: Math.sin(60*(Math.PI/180))*size*x, Y: Math.sin(60*(Math.PI/180))*size*(y-0.5) } );
	    else
	       return ( { X: Math.sin(60*(Math.PI/180))*size*x, Y: Math.sin(60*(Math.PI/180))*size*(y+0.5) } );
	 else 
	    return ( { X: Math.sin(60*(Math.PI/180))*size*x, Y: Math.sin(60*(Math.PI/180))*size*y } );
      }
   },
   Transform3Dto2D : function(vrtx3D, c2c) {	//c2c is distance from camera to canvas
      var point2D;

      point2D = new Coordinate2D();
      point2D.X = (vrtx3D.X*c2c)/vrtx3D.Z;
      point2D.Y = (vrtx3D.Y*c2c)/vrtx3D.Z;
      return(point2D);
   },
   Transform3Dto2DFixed : function(vrtx3D, c2c) {	//c2c is distance from camera to canvas
//      var point2D;

//      point2D = new Coordinate2D();
//      point2D.X = (vrtx3D.X*c2c)/vrtx3D.Z;
 //     point2D.Y = (vrtx3D.Y*c2c)/vrtx3D.Z;
      return({ X: (vrtx3D.X*c2c)/vrtx3D.Z, Y: (vrtx3D.Y*c2c)/vrtx3D.Z });
   },
   Transform3DPolygonto2DImage : function(plygn, c2c) {
      var i;
      var point2D;
      var vrtxArray;

      vrtxArray = new Array();
      for (i=0;i<plygn.length;++i) {
	 point2D = new Coordinate2D();
	 point2D.X = (plygn[i].X*c2c)/(plygn[i].Z+c2c);
	 point2D.Y = (plygn[i].Y*c2c)/(plygn[i].Z+c2c);
	 vrtxArray.push(point2D);
      }
      return(vrtxArray);
   },
   GetRotatedPointsArray(coords, nPoints, angle, antiClockWise) {
      var i;
//      var rotAngle;
      var angleSin, angleCos;
      var point;
      var pointsArray;

      angle *= Math.PI/180;
      coords.Y = - coords.Y;
      pointsArray = new Array();
      for (i=0;i<nPoints;++i) {
	 angleSin = Math.sin(angle*i);
	 angleCos = Math.cos(angle*i);
	 point = new Coordinate2D();
	 if (antiClockWise) {
	    point.X = Math.round((coords.X*angleCos) - (coords.Y*angleSin));	//NOTE: rounding being done here
	    point.Y = Math.round((coords.X*angleSin) + (coords.Y*angleCos));	// as is likely more useful
	 } else {
	    point.X = Math.round((coords.X*angleCos) + (coords.Y*angleSin));
	    point.Y = Math.round(-(coords.X*angleSin) + (coords.Y*angleCos));
	 }
	 point.Y = - point.Y;
	 pointsArray.push(point);
      }
      return (pointsArray);
   },
   RotatePolygon(angle) {

   },
//   Rotate3DCoordinates : function(vrtx) {
// vertex.X = plygn.Vertices[i][0]*Math.cos(angl.Y)*Math.cos(angl.Z) + plygn.Vertices[i][2]*Math.sin(angl.Y) - //plygn.Vertices[i][1]*Math.sin(angl.Z) + pos.X;
// vertex.Y = plygn.Vertices[i][1]*Math.cos(angl.Z)*Math.cos(angl.X) + plygn.Vertices[i][0]*Math.sin(angl.Z) -  //plygn.Vertices[i][2]*Math.sin(angl.X) + pos.Y;
// vertex.Z = plygn.Vertices[i][2]*Math.cos(angl.X)*Math.cos(angl.Y) + plygn.Vertices[i][1]*Math.sin(angl.X) - //plygn.Vertices[i][0]*Math.sin(angl.Y) + pos.Z;
//   },
   GetInterceptingPath : function(quarryX, quarryY, qVelocityX, qVelocityY, hunterX, hunterY, speedRatio, bInterceptable) {
      var angle, size, distance;
      var hunterVectorX, hunterVectorY;
      var interceptionX, interceptionY;
      var hNormalx, hNormalY;
      var InterceptionVector;

      speedRatio = speedRatio || 1;

      //First check if hunted can be caught (independent of things like cannon range); return (-1, -1) if not
      InterceptionVector = new Coordinate2D();
      hunterVectorX = quarryX - hunterX;
      hunterVectorY = quarryY - hunterY;
      if (bInterceptable) {
	 if(!this.CheckInterceptible(quarryX, quarryY, qVelocityX, qVelocityY, hunterVectorX, hunterVectorY, speedRatio)) {
	    InterceptionVector.X = -1;
	    InterceptionVector.Y = -1;
	    return(InterceptionVector);
	 }
      }

      //Calculate distance, angle between hunted and hunter vectors, rotate normal of hunter vector
      distance = Math.sqrt(Math.pow(hunterVectorX, 2) + Math.pow(hunterVectorY, 2));
      this.distance = distance;
      angle = Math.atan2(qVelocityY, qVelocityX) - Math.atan2(-hunterVectorY, -hunterVectorX);
      angle /= speedRatio;	//adjust for speed differential (hunter's speed is numerator)
      hNormalX = hunterVectorX/distance;
      hNormalY = hunterVectorY/distance;
      InterceptionVector.X = hNormalX*Math.cos(angle) + hNormalY*Math.sin(angle);	//this is a clockwise rotation
      InterceptionVector.Y = hNormalY*Math.cos(angle) - hNormalX*Math.sin(angle);
      this.iVector = InterceptionVector;
      return (InterceptionVector);
   },
   GetInterceptionVelocity(hPosition, qPosition, qVelocity, speedRatio, bInterceptable) {  //speedRatio - hunter numerator
      //NOTE: h-hunter, q-quarry
/*
      return(this.GetInterceptingPath(qPosition.X, qPosition.Y, qVelocity.X, qVelocity.Y, hPosition.X, hPosition.Y, speedRatio, bInterceptable));
*/
      speedRatio = speedRatio || 1;
      if (!this.iVector)  //interception Vector
	 this.iVector = new Coordinate2D();
      if (!this.hVector)  //hunter vector
	 this.hVector = new Coordinate2D();
      if (!this.hvNormal)  //hunter vector normal
	 this.hvNormal = new Coordinate2D();

      //First check if hunted can be caught (independent of things like cannon range); return (-1, -1) if not
      this.hVector.X = qPosition.X-hPosition.X;
      this.hVector.Y = -(qPosition.Y-hPosition.Y);
/*
      hunterVectorX = quarryX - hunterX;
      hunterVectorY = quarryY - hunterY;
      if (bInterceptable) {
	 if(!this.CheckInterceptible(quarryX, quarryY, qVelocityX, qVelocityY, hunterVectorX, hunterVectorY, speedRatio)) {
	    InterceptionVector.X = -1;
	    InterceptionVector.Y = -1;
	    return(InterceptionVector);
	 }
      }
*/
      //Calculate distance, angle between hunted and hunter vectors, rotate normal of hunter vector
      this.distance = Math.sqrt(Math.pow(this.hVector.X, 2) + Math.pow(this.hVector.Y, 2));
//      this.angle = Math.atan2(qVelocity.Y, qVelocity.X) - Math.atan2(-this.hVector.Y, -this.hVector.X);
      //ISSUE: qVelocity may have to be negated
      this.angle = Math.atan2(qVelocity.Y, qVelocity.X) - Math.atan2(this.hVector.Y, this.hVector.X);
//      var angle1 = Math.atan2(qVelocity.Y, qVelocity.X) - Math.atan2(this.hVector.Y, this.hVector.X);
//      var angle2 = Math.atan2(qVelocity.Y, qVelocity.X) - Math.atan2(-this.hVector.Y, -this.hVector.X);
//angle = atan2(vector2.y, vector2.x) - atan2(vector1.y, vector1.x);
      this.angle -= Math.PI;
      this.angle /= speedRatio;		//adjust for speed differential (hunter's speed is numerator)
      this.hvNormal.X = this.hVector.X/this.distance;
      this.hvNormal.Y = this.hVector.Y/this.distance;
      this.iVector.X = this.hvNormal.X*Math.cos(this.angle) + this.hvNormal.Y*Math.sin(this.angle);  //clockwise rotation
      this.iVector.Y = - (this.hvNormal.Y*Math.cos(this.angle) - this.hvNormal.X*Math.sin(this.angle));
      return (this.iVector);
   },
   GetInterceptionSpot(hPosition, iVelocity, qPosition, qVelocity, sRatio) {
      this.x1 = hPosition.X;
      this.x2 = qPosition.X;
      this.inc = 0;
      do {
	 this.x1 += iVelocity.X;
	 this.x2 += qVelocity.X;
	 ++this.inc;
      } while (Math.abs(this.x1-this.x2)>sRatio);
      this.y = hPosition.Y + (this.inc*iVelocity.Y);
      return( { X: this.x1, Y: this.y } );
   },
   CheckInterceptible : function(quarryX, quarryY, qVelocityX, qVelocityY, hunterVectorX, hunterVectorY, speedRatio) {
      //First check if hunted can be caught (independent of things like cannon range); return (-1, -1) if not
/*
      hunterVectorX = quarryX - hunterX;
      hunterVectorY = quarryY - hunterY;
      size = Math.sqrt(Math.pow(qVelocityX, 2) + Math.pow(qVelocityY, 2));
      if (Math.abs(quarryX+qVelocityX)>Math.abs(hunterVectorX)) && ())
*/
   },
   GetAngleBetweenVectors(vctrA, vctrB) {
      return(Math.atan2(vctrB.Y, vctrB.X) - Math.atan2(-vctrA.Y, -vctrA.X));
   }
};
