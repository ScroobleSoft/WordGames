
//----------------------------------------------
//----------ANIMATED SPRITE---------------------
var AnimatedSprite = function() {
   var State;
   var Offset;
   var Columns;
   var ZeroStateLeft;
   var ZeroStateTop;
};
AnimatedSprite.prototype = new StaticSprite();
AnimatedSprite.prototype.Set = function(cntxt, imgs, specs) {
   StaticSprite.prototype.Set.call(this, cntxt, imgs, specs);

   this.State = 0;
   this.Offset = specs.O;
   this.Columns = specs.C || 0;
   this.ZeroStateLeft = this.Left;
   this.ZeroStateTop = this.Top;
};
AnimatedSprite.prototype.SetDraw = function(state) {
/*
   if (!state)			//NOTE: this applies to both 0 and 'undefined'
      this.State = 0
   else
      this.State = state;
*/
//   this.State = state ? state : 0;
//   if (state==undefined)
//      this.State = 0;
//   else
   if (state!=undefined)
      this.State = state;
   if (this.Columns) {
      this.Left = this.ZeroStateLeft + ((this.State % this.Columns)*(this.Width+this.Offset));
      this.Top = this.ZeroStateTop + (Math.floor(this.State/this.Columns)*(this.Height+this.Offset));
   }
   else
      this.Left = this.ZeroStateLeft + (this.State*(this.Width+this.Offset));
};
AnimatedSprite.prototype.CreateImageGallery = function(tInfo) {  //UNTESTED
   var i;

   StaticSprite.prototype.CreateImageGallery.call(this);

   tInfo = tInfo || this.Specs.TI;
   for (i=1;i<this.Specs.S;++i) {
      this.Left = this.ZeroStateLeft + i*(this.Width+this.Offset);
//      this.AddColumnToGallery(this.Specs.TI);		//ISSUE: different approach for MultiSpecs
      this.AddColumnToGallery(tInfo);
//      CompositeSprite.prototype.AddColumnToGallery.call(this);
   }
}
AnimatedSprite.prototype.Draw = function(x, y, state) {
   this.SetDraw(state);
/*
   this.State = state || this.State;
   if (this.Columns) {
      this.Left = this.ZeroStateLeft + ((this.State % this.Columns)*(this.Width+this.Offset));
      this.Top = this.ZeroStateTop + (Math.floor(this.State/this.Columns)*(this.Height+this.Offset));
   }
   else
      this.Left = this.ZeroStateLeft + (this.State*(this.Width+this.Offset));
*/

   StaticSprite.prototype.Draw.call(this, x, y);
};
AnimatedSprite.prototype.DrawCentred = function(x, y, state) {
   this.Draw(x-Math.round(this.Width/2), y+Math.round(this.Height/2), state);
};
AnimatedSprite.prototype.DrawResized = function(x, y, scale, state, alignment) {
   this.SetDraw(state);

   StaticSprite.prototype.DrawResized.call(this, x, y, scale, alignment);
};
AnimatedSprite.prototype.DrawFlipped = function(x, y, orntd, state, alignment) {
   this.SetDraw(state);

   StaticSprite.prototype.DrawFlipped.call(this, x, y, orntd, alignment);
};
AnimatedSprite.prototype.DrawRotated = function(x, y, angle, state) {
   this.SetDraw(state);

   StaticSprite.prototype.DrawRotated.call(this, x, y, angle);
};

//   GetState : function(sctchBuffer, imgBuffer, state) {
   //write relevant portion to scratch buffer - have to clear it first, or set the right width/height, or, worst case
   //	scenario, create new canvas and use that (might even need a custom canvas buffer object w/ relevant methods)
   //copy to imgBuffer
//   }
//};

//----------------------------------------------
//----------GEOMETRIC SPRITE--------------------
var GeometricSprite = function() {  //NOTE: no buffer usage here - will scale/flip/rotate/colour/shadow directly to screen
   var GraphicsTool;
   var GeoSpecs;
   var TransformedSpecs;
   var TempSpecs;		//to be used for temporary transformations
   var SpecsReset;		//code directed to use original
   var Alignment;		//undefined to be interpreted as bottom-left (default)
   var Composite;		//may seem spurious, but is for later activation per multiple inheritance approach

   var i, j, k;
};
GeometricSprite.prototype = new StaticSprite();
GeometricSprite.prototype.Set = function(cntxt, specs, gTool, iBox) {
   this.GraphicsTool = gTool;
   this.Angle = 0;
   this.GeoSpecs = specs.GS;
   this.SpecsReset = true;

   if (!this.Composite)
      StaticSprite.prototype.Set.call(this, cntxt, null, specs, iBox);  //ISSUE: shouldn't do this like that
};
GeometricSprite.prototype.SwitchContext = function() {
   StaticSprite.prototype.SwitchContext.call(this);

   this.GraphicsTool.SwitchContext(this.SecondaryContext);
};
GeometricSprite.prototype.RestoreContext = function() {
   StaticSprite.prototype.RestoreContext.call(this);

   this.GraphicsTool.RestoreContext();
};
GeometricSprite.prototype.GetSpecs = function() {
   if (this.TransformedSpecs && !this.SpecsReset)
      return (this.TransformedSpecs);
   else
      return (this.GeoSpecs);
};
GeometricSprite.prototype.SetTransformedSpecs = function() {
   if (!this.TransformedSpecs)
      this.TransformedSpecs = JSON.parse(JSON.stringify(this.GeoSpecs));
   else if (this.SpecsReset)
      this.TransformedSpecs = JSON.parse(JSON.stringify(this.GeoSpecs));	//TODO: copy structure
   this.SpecsReset = false;
};
GeometricSprite.prototype.CloneSpecs = function(targetSpecs, destinationSpecs) {
   for (this.i=0;this.i<targetSpecs.length;++this.i)
      for (this.j=0;this.j<targetSpecs[this.i].length;++this.j)
	 if (this.j==SHAPeSPEC.DIMENSIONS)
	    for (this.k=0;this.k<targetSpecs[this.i][this.j].length;++this.k)
	       destinationSpecs[this.i][this.j][this.k] = targetSpecs[this.i][this.j][this.k];
	 else
	    destinationSpecs[this.i][this.j] = targetSpecs[this.i][this.j];
};
/*
GeometricSprite.prototype.CreateImageGallery = function(info, columns) {
   var screenContext;
   var originalLeft, originalTop;

   //Draw base image in ScratchPad
   this.GraphicsTool.GOL.ScratchPad.Set( { Width: this.Width, Height: this.Height } );
   screenContext = this.Context;
   this.Context = this.GraphicsTool.GOL.ScratchPad.Context;
   this.GraphicsTool.GOL.Screen = this.GraphicsTool.GOL.ScratchPad.Context;
   this.Draw(0, 0);	//ISSUE: CENTRE ALIGNED hex, diamond, circle etc drawings would not fit in buffer like this
   this.Context = screenContext;
   this.GraphicsTool.RestoreContext();

   //Call base class method to create buffered images
   originalLeft = this.Left;
   originalTop = this.Top;
   this.Left = 0;
   this.Top = 0;
   this.Pic = this.GraphicsTool.GOL.ScratchPad.Canvas;
   StaticSprite.prototype.CreateImageGallery.call(this, info);
   this.Left = originalLeft;
   this.Top = originalTop;
   this.GraphicsTool.GOL.ScratchPad.Clear();
};
*/
GeometricSprite.prototype.ResetSpecs = function() {
   this.SpecsReset = true;
};
GeometricSprite.prototype.Flip = function(orntd) {
   var i;

   this.TransformedSpecs = JSON.parse(JSON.stringify(this.GeoSpecs));	//TODO: copy structure
   for (i=0;i<this.TransformedSpecs.length;++i) {
      if (orntd & FLIPPED.HORIZONTAL)
	 this.TransformedSpecs[i][SHAPeSPEC.DIMENSIONS][0] = -this.TransformedSpecs[i][SHAPeSPEC.DIMENSIONS][0];
      if (orntd & FLIPPED.VERTICAL)
	 this.TransformedSpecs[i][SHAPeSPEC.DIMENSIONS][1] = -this.TransformedSpecs[i][SHAPeSPEC.DIMENSIONS][1];
   }
   this.SpecsReset = false;
};
GeometricSprite.prototype.Resize = function(scale) {
   var i, j;

   this.TransformedSpecs = JSON.parse(JSON.stringify(this.GeoSpecs));	//TODO: copy structure
   for (i=0;i<this.TransformedSpecs.length;++i)
      if (this.TransformedSpecs[i][SHAPeSPEC.SHAPE]==SHAPE.IRREGULAR)
	 for (j=0;j<this.TransformedSpecs[i][SHAPeSPEC.DIMENSIONS].length;++j) {  //resize each vertex
	    this.TransformedSpecs[i][SHAPeSPEC.DIMENSIONS][j][0] *= scale;
	    this.TransformedSpecs[i][SHAPeSPEC.DIMENSIONS][j][1] *= scale;
	 }
      else {
	 this.TransformedSpecs[i][SHAPeSPEC.DIMENSIONS][0] *= scale;
	 this.TransformedSpecs[i][SHAPeSPEC.DIMENSIONS][1] *= scale;
	 this.TransformedSpecs[i][SHAPeSPEC.DIMENSIONS][2] *= scale;
	 if (this.TransformedSpecs[i][SHAPeSPEC.SHAPE]==SHAPE.LINE||this.TransformedSpecs[i][SHAPeSPEC.SHAPE]==SHAPE.RECTANGLE)
	    this.TransformedSpecs[i][SHAPeSPEC.DIMENSIONS][3] *= scale;
      }
   this.SpecsReset = false;
};
GeometricSprite.prototype.Rotate = function(angle) {
   var i;
//   var specs;

   this.Angle = this.Angle || 0;
   this.Angle += angle;
   this.SetTransformedSpecs();
   this.SpecsReset = false;

   //Rotate all line shapes
   for (i=0;i<this.TransformedSpecs.length;++i) {
/*
      this.coords = Utilities.RotateCoordinates( { X: this.TransformedSpecs[i][SHAPeSPEC.DIMENSIONS][0], Y: -this.TransformedSpecs[i][SHAPeSPEC.DIMENSIONS][1] }, angle, false, true);
*/
      this.coords = Utilities.RotateCoordinates( { X: this.TransformedSpecs[i][SHAPeSPEC.DIMENSIONS][0], Y: -this.TransformedSpecs[i][SHAPeSPEC.DIMENSIONS][1] }, angle, false);
      this.TransformedSpecs[i][SHAPeSPEC.DIMENSIONS][0] = this.coords.X;
      this.TransformedSpecs[i][SHAPeSPEC.DIMENSIONS][1] = -this.coords.Y;
      switch (this.TransformedSpecs[i][SHAPeSPEC.SHAPE]) {
	 case SHAPE.LINE:
/*
	    this.coords = Utilities.RotateCoordinates( { X: this.TransformedSpecs[i][SHAPeSPEC.DIMENSIONS][2], Y: -this.TransformedSpecs[i][SHAPeSPEC.DIMENSIONS][3] }, angle, false, true);
*/
	    this.coords = Utilities.RotateCoordinates( { X: this.TransformedSpecs[i][SHAPeSPEC.DIMENSIONS][2], Y: -this.TransformedSpecs[i][SHAPeSPEC.DIMENSIONS][3] }, angle, false);
	    this.TransformedSpecs[i][SHAPeSPEC.DIMENSIONS][2] = this.coords.X;
	    this.TransformedSpecs[i][SHAPeSPEC.DIMENSIONS][3] = -this.coords.Y;
	    break;
	 case SHAPE.IRREGULAR:
	    //TODO: rotate each vertex
	    break;
      }
   }
};
GeometricSprite.prototype.ReColour = function(aPairs) {
/*
   for (this.i=0;this.i<this.GeoSpecs.length;++this.i)
      for (this.j=0;this.j<aPairs.length;++this.j)
	 if (this.GeoSpecs[this.i][SHAPeSPEC.COLOUR]==aPairs[this.j][0]) {
	    this.GeoSpecs[this.i][SHAPeSPEC.COLOUR] = aPairs[this.j][1];
	    break;
	 }
*/
   if (Array.isArray(aPairs[0])) {  //check if array or array of arrays is passed
      if (Array.isArray(this.GeoSpecs[0][0])) {	//check if its an Animated Composite Sprite
	 for (this.i=0;this.i<aPairs.length;++this.i)
	    for (this.j=0;this.j<this.GeoSpecs.length;++this.j)
	       for (this.k=0;this.k<this.GeoSpecs[this.j].length;++this.k)
	          if (this.GeoSpecs[this.j][this.k][1]==aPairs[this.i][0])
		     this.GeoSpecs[this.j][this.k][1] = aPairs[this.i][1];
      } else {						//only a Composite Sprite
	 for (this.i=0;this.i<aPairs.length;++this.i)
	    for (this.j=0;this.j<this.GeoSpecs.length;++this.j)
	       if (this.GeoSpecs[this.j][1]==aPairs[this.i][0])
		  this.GeoSpecs[this.j][1] = aPairs[this.i][1];
      }
   } else {
      if (Array.isArray(this.GeoSpecs[0][0])) {	//check if its an Animated Composite Sprite
	 for (this.i=0;this.i<this.GeoSpecs.length;++this.i)
	    for (this.j=0;this.j<this.GeoSpecs[this.i].length;++this.j)
	       if (this.GeoSpecs[this.i][this.j][1]==aPairs[0])
		  this.GeoSpecs[this.i][this.j][1] = aPairs[1];
      } else {
	 for (this.i=0;this.i<this.GeoSpecs.length;++this.i)
	    if (this.GeoSpecs[this.i][1] = aPairs[0])
	       this.GeoSpecs[this.i][1] = aPairs[1];
      }
   }
};
/*
GeometricSprite.prototype.Recolour = function() {
   var i;

   for (i=0;i<arguments.length;++i)
      this.GeoSpecs[i][SHAPeSPEC.COLOUR] = arguments[i];
};
*/
GeometricSprite.prototype.DrawFlipped = function(x, y, orntd, opcty) {  //ISSUE: only works for centre-drawn shapes (but not accurately)

   //TODO: really the only way to implement this is by using a buffer
/*
   this.SetTransformedSpecs();
   this.TempSpecs = JSON.parse(JSON.stringify(this.TransformedSpecs));
   if (orntd & FLIPPED.HORIZONTAL)
      for (this.i=0;this.i<this.TransformedSpecs.length;++this.i)
	 this.TransformedSpecs[this.i][SHAPeSPEC.DIMENSIONS][0] = this.Width - this.TransformedSpecs[this.i][SHAPeSPEC.DIMENSIONS][0];
   if (orntd & FLIPPED.VERTICAL)
      for (this.i=0;this.i<this.TransformedSpecs.length;++this.i)
	 this.TransformedSpecs[this.i][SHAPeSPEC.DIMENSIONS][0] = -(this.Height-this.TransformedSpecs[this.i][SHAPeSPEC.DIMENSIONS][0]);
   this.Draw(x, y, opcty);
   this.TransformedSpecs = JSON.parse(JSON.stringify(this.TempSpecs));
*/
   if (orntd & FLIPPED.HORIZONTAL)
      for (this.i=0;this.i<this.Specs.length;++this.i)
	 this.Specs[this.i][SHAPeSPEC.DIMENSIONS][0] = this.Width - this.Specs[this.i][SHAPeSPEC.DIMENSIONS][0];
   if (orntd & FLIPPED.VERTICAL)
      for (this.i=0;this.i<this.Specs.length;++this.i)
	 this.Specs[this.i][SHAPeSPEC.DIMENSIONS][1] = -(this.Height-this.TransformedSpecs[this.i][SHAPeSPEC.DIMENSIONS][1]);
   this.Draw(x, y, opcty);
   if (orntd & FLIPPED.HORIZONTAL)
      for (this.i=0;this.i<this.Specs.length;++this.i)
	 this.Specs[this.i][SHAPeSPEC.DIMENSIONS][0] = this.Width - this.Specs[this.i][SHAPeSPEC.DIMENSIONS][0];
   if (orntd & FLIPPED.VERTICAL)
      for (this.i=0;this.i<this.Specs.length;++this.i)
	 this.Specs[this.i][SHAPeSPEC.DIMENSIONS][1] = -(this.Height-this.TransformedSpecs[this.i][SHAPeSPEC.DIMENSIONS][1]);
};
GeometricSprite.prototype.DrawResized = function(x, y, scale, opcty) {
   var i, j;

   //Save current specs to temporary storage
   this.SetTransformedSpecs();
   if (!this.TempSpecs)
      this.TempSpecs = JSON.parse(JSON.stringify(this.TransformedSpecs));
   else
      this.TempSpecs = JSON.parse(JSON.stringify(this.GeoSpecs));	//TODO: copy structure

   //Scale all relevant variables
   for (i=0;i<this.TransformedSpecs.length;++i)
      for (j=0;j<this.TransformedSpecs[i][SHAPeSPEC.DIMENSIONS].length;++j)
         if ((this.TransformedSpecs[i][SHAPeSPEC.SHAPE]==SHAPE.POLYGON || this.TransformedSpecs[i][SHAPeSPEC.SHAPE]==SHAPE.ARC) && j==3)
	    continue;
	 else
	    this.TransformedSpecs[i][SHAPeSPEC.DIMENSIONS][j] *= scale;
   this.Draw(x, y, opcty);
//   this.TransformedSpecs = JSON.parse(JSON.stringify(this.TempSpecs)); - NOTE: remove when all fixed

   //Restore saved specs
   this.TransformedSpecs = JSON.parse(JSON.stringify(this.TempSpecs));	//TODO: copy structure

   if (this.Composite)
      StaticSprite.prototype.DrawResized.call(this, x, y+this.Height);
};
/*
GeometricSprite.prototype.DrawRotated = function(x, y, angle, opcty) {
   //TODO
};
*/
GeometricSprite.prototype.DrawRecoloured = function(x, y, colourArray, subbedColours) {
   var i, j;
   var colour, originalColours;

   //Save the base colours
   originalColours = new Array();
   for (i=0;i<this.GeoSpecs.length;++i) {
      colour = this.GeoSpecs[i][SHAPeSPEC.COLOUR];
      originalColours.push(colour);
   }

   //Switch colours
   if (subbedColours) {  //NOTE: sizes of colourArray and subbedColours have to match
      for (i=0;i<colourArray.length;++i)
	 for (j=0;j<this.GeoSpecs.length;++j)
	    if (this.GeoSpecs[j][SHAPeSPEC.COLOUR]==subbedColours[i])
		this.GeoSpecs[j][SHAPeSPEC.COLOUR] = colourArray[i];
   } else  //sizes of ColourArray and GeoSpecs array have to match
      for (i=0;i<this.GeoSpecs.length;++i)
	 this.GeoSpecs[i][SHAPeSPEC.COLOUR] = colourArray[i];

   this.Draw(x, y);

   //Restore original colours
   for (i=0;i<this.GeoSpecs.length;++i)
      this.GeoSpecs[i][SHAPeSPEC.COLOUR] = originalColours[i];
};
GeometricSprite.prototype.DrawShadow = function(x, y, angle) {
};
GeometricSprite.prototype.Draw = function(x, y, opcty) {
   var i, j;
   var l, t, w, h, r, a;
   var size, sides, vertices;
   var vx, vy;
   var specs;
   var angle;

   this.GraphicsTool.SwitchContext(this.Context);
   specs = this.GetSpecs();
   angle = this.Angle || 0;
   for (i=0;i<specs.length;++i) {
      l = specs[i][SHAPeSPEC.DIMENSIONS][0];
      t = specs[i][SHAPeSPEC.DIMENSIONS][1];
      switch (specs[i][SHAPeSPEC.SHAPE]) {
	 case SHAPE.LINE:  //TODO: there could be a Bas-Relief option here too
	    if (this.GraphicsTool.GOL)
	       this.GraphicsTool.GOL.G2D.DrawLine(x+l[0], y+l[1], x+t[0], y+t[1], specs[i][SHAPeSPEC.COLOUR], specs[i][SHAPeSPEC.WIREFRAME], opcty);
	    else
	       this.GraphicsTool.DrawLine( { X: x+l[0], Y: y+l[1] }, { X: x+t[0], Y: y+t[1] }, specs[i][SHAPeSPEC.COLOUR], specs[i][SHAPeSPEC.WIREFRAME], opcty);
	    break;
	 case SHAPE.ARC :
	    r = specs[i][SHAPeSPEC.DIMENSIONS][2];
	    this.GraphicsTool.DrawArc(x+l, y+t, r, specs[i][SHAPeSPEC.DIMENSIONS][3], specs[i][SHAPeSPEC.DIMENSIONS][4], specs[i][SHAPeSPEC.COLOUR], specs[i][SHAPeSPEC.WIREFRAME], specs[i][SHAPeSPEC.STYLE], angle, opcty);
	    break;
	 case SHAPE.CIRCLE :
	    r = specs[i][SHAPeSPEC.DIMENSIONS][2];
	    if (this.GraphicsTool.GOL)
	       this.GraphicsTool.DrawCircle(x+l, y+t, r, specs[i][SHAPeSPEC.COLOUR], specs[i][SHAPeSPEC.WIREFRAME], specs[i][SHAPeSPEC.STYLE], angle, opcty);
	    else
	       this.GraphicsTool.DrawCircle(x+l, y+t, r, specs[i][SHAPeSPEC.COLOUR], specs[i][SHAPeSPEC.WIREFRAME], opcty);
	    break;
	 case SHAPE.ELLIPSE:  //UNTESTED
	    w = specs[i][SHAPeSPEC.DIMENSIONS][2];
	    h = specs[i][SHAPeSPEC.DIMENSIONS][3];
	    this.GraphicsTool.DrawEllipse(x+l, y+t, w, h, specs[i][SHAPeSPEC.COLOUR], specs[i][SHAPeSPEC.WIREFRAME], specs[i][SHAPeSPEC.STYLE], angle, opcty);
	    break;
	 case SHAPE.TRIANGLE :
	    size = specs[i][SHAPeSPEC.DIMENSIONS][2];
	    a = specs[i][SHAPeSPEC.DIMENSIONS][3];
	    this.GraphicsTool.DrawEquilateralTriangle(x+l, y+t, size, specs[i][SHAPeSPEC.COLOUR], specs[i][SHAPeSPEC.WIREFRAME], a, specs[i][SHAPeSPEC.STYLE], angle, opcty);
	    break;
	 case SHAPE.RECTANGLE :
	    w = specs[i][SHAPeSPEC.DIMENSIONS][2];
	    h = specs[i][SHAPeSPEC.DIMENSIONS][3];
	    this.GraphicsTool.DrawRectangle(x+l, y+t, w, h, specs[i][SHAPeSPEC.COLOUR], specs[i][SHAPeSPEC.WIREFRAME], specs[i][SHAPeSPEC.STYLE], angle, opcty);
	    break;
	 case SHAPE.DIAMOND :
	    r = specs[i][SHAPeSPEC.DIMENSIONS][2];
	    if (this.GraphicsTool.GOL) {  //ISSUE: this is obviously only implemented for a particular case
	       this.GraphicsTool.GOL.BasRelief.Inverted = true;
	       this.GraphicsTool.DrawDiamond(x+l, y+t, r, specs[i][SHAPeSPEC.COLOUR], specs[i][SHAPeSPEC.WIREFRAME], specs[i][SHAPeSPEC.STYLE], opcty);
	       this.GraphicsTool.GOL.BasRelief.Inverted = false;
	    } else
	       this.GraphicsTool.DrawDiamond(x+l, y+t, r, specs[i][SHAPeSPEC.COLOUR], specs[i][SHAPeSPEC.WIREFRAME], opcty);
	    break;
	 case SHAPE.POLYGON :
	    size = specs[i][SHAPeSPEC.DIMENSIONS][2];
	    sides = specs[i][SHAPeSPEC.DIMENSIONS][3];
	    this.GraphicsTool.DrawPolygon(x+l, y+t, size, sides, specs[i][SHAPeSPEC.COLOUR], specs[i][SHAPeSPEC.WIREFRAME], specs[i][SHAPeSPEC.STYLE], angle, opcty);
	    break;
	 case SHAPE.HEXAGON :
	    size = specs[i][SHAPeSPEC.DIMENSIONS][2];
	    this.GraphicsTool.DrawHexagon(x+l, y+t, size, specs[i][SHAPeSPEC.COLOUR], specs[i][SHAPeSPEC.WIREFRAME], specs[i][SHAPeSPEC.STYLE], angle, opcty);
	    break;
	 case SHAPE.OCTAGON :
	    size = specs[i][SHAPeSPEC.DIMENSIONS][2];
	    this.GraphicsTool.DrawOctagon(x+l, y+t, size, specs[i][SHAPeSPEC.COLOUR], specs[i][SHAPeSPEC.WIREFRAME], specs[i][SHAPeSPEC.STYLE], angle, opcty);
	    break;
	 case SHAPE.IRREGULAR :
	    vertices = new Array();
	    for (j=0;j<specs[i][SHAPeSPEC.DIMENSIONS].length;++j) {
	       //NOTE: need to use specs directly
	       vx = specs[i][SHAPeSPEC.DIMENSIONS][j][0];
	       vy = specs[i][SHAPeSPEC.DIMENSIONS][j][1];
	       vertices.push( { X: vx, Y: -vy } );
	    }

	    //TEMP - this check is to distinguish between the two different GenieGraphics
	    if (this.GraphicsTool.GOL)
	       this.GraphicsTool.GOL.G2D.DrawPolygonFromVertices(x, y, vertices, specs[i][SHAPeSPEC.COLOUR], specs[i][SHAPeSPEC.WIREFRAME], angle, opcty);
	    else
	       this.GraphicsTool.DrawPolygon(x, y, vertices, specs[i][SHAPeSPEC.COLOUR], specs[i][SHAPeSPEC.WIREFRAME], opcty);
	    break;
      }
   }

   this.GraphicsTool.RestoreContext();

//   if (this.Composite)
//      StaticSprite.prototype.Draw.call(this, x, y);
};

//-----------------------------------------------
//---------- COMPOSITE SPRITE -------------------
//NOTE: this type of sprite serves a dual purpose - a bitmap and geometric drawing composite, and also a buffered version of
// GeometricSprite, so bitmap could even be NULL
var CompositeSprite = function() {
//   var OutlineColour;
   var Colourizer;
};
CompositeSprite.prototype = new GeometricSprite();
CompositeSprite.prototype.Set = function(cntxt, iSrc, specs, gTool, iBox) {
   this.Composite = true;

   GeometricSprite.prototype.Set.call(this, cntxt, specs, gTool, iBox);
   StaticSprite.prototype.Set.call(this, cntxt, iSrc, specs, iBox);
};
CompositeSprite.prototype.Draw = function(x, y) {
   GeometricSprite.prototype.Draw.call(this, x, y);
   StaticSprite.prototype.Draw.call(this, x, y);
};
CompositeSprite.prototype.DrawOutline = function(x, y) {  //TEMP - NOTE: this is being used in antialiasing experiments

   //UNLOGGED

   StaticSprite.prototype.Draw.call(this, x, y);
};
CompositeSprite.prototype.CreateImageGallery = function(info, columns) {
   var originalContext;
   var originalPic, originalLeft, originalTop;

   //Draw base image in ScratchPad
   this.GraphicsTool.GOL.ScratchPad.Set( { Width: this.Width, Height: this.Height } );
   originalContext = this.Context;
   this.Context = this.GraphicsTool.GOL.ScratchPad.Context;
   this.GraphicsTool.GOL.Screen = this.GraphicsTool.GOL.ScratchPad.Context;
   this.Draw(0, this.Height);
   this.Context = originalContext;
   this.GraphicsTool.RestoreContext();

   //Call base class method to create buffered images
   originalLeft = this.Left;
   originalTop = this.Top;
   originalPic = this.Pic;
   this.Left = 0;
   this.Top = 0;
   this.Pic = this.GraphicsTool.GOL.ScratchPad.Canvas;
   GeometricSprite.prototype.CreateImageGallery.call(this, info, columns);
   this.Left = originalLeft;
   this.Top = originalTop;
   this.Pic = originalPic;
   this.GraphicsTool.GOL.ScratchPad.Clear();
};
CompositeSprite.prototype.AddColumnToGallery = function(info) {
   var originalContext;
   var originalPic, originalLeft, originalTop;

   //Draw base image in ScratchPad
   this.GraphicsTool.GOL.ScratchPad.Set( { Width: this.Width, Height: this.Height } );
   originalContext = this.Context;
   this.Context = this.GraphicsTool.GOL.ScratchPad.Context;
   this.GraphicsTool.GOL.Screen = this.GraphicsTool.GOL.ScratchPad.Context;
   this.Draw(0, this.Height);
   this.Context = originalContext;
   this.GraphicsTool.RestoreContext();

   //Call base class method to create buffered images
   originalLeft = this.Left;
   originalTop = this.Top;
   originalPic = this.Pic;
   this.Left = 0;
   this.Top = 0;
   this.Pic = this.GraphicsTool.GOL.ScratchPad.Canvas;
   GeometricSprite.prototype.AddColumnToGallery.call(this, info);
   this.Left = originalLeft;
   this.Top = originalTop;
   this.Pic = originalPic;
   this.GraphicsTool.GOL.ScratchPad.Clear();
};
CompositeSprite.prototype.DrawRecoloured = function(x, y, colourArray, subbedColours, outlineColour) {
   var recolouredImage;

   GeometricSprite.prototype.DrawRecoloured.call(this, x, y, colourArray, subbedColours);

//ISSUE: writing a lighter colour over black could pose problem, so might have to adjust opacity in colourizer, or set a
// flag in GeometricSprite to not draw outline, which will hopefully be monochrome

   if (outlineColour) {
      if (!this.Colourizer)
	 this.Colourizer = new GenieColourizer();
   recolouredImage = this.Colourizer.ReColorStencil(this.Pic, outlineColour, { Width: this.Width, Height: this.Height } );
   this.Context.drawImage(recolouredImage, x, y);
   }
};
/*
CompositeSprite.prototype.ReColour = function(aPairs) {

   //NOTE: mostly copying this from GenieAgent, and where it really belongs is neither there nor here, but in GeometricSprite (TODO)

   for (this.i=0;this.i<aPairs.length;++this.i)
      for (this.j=0;this.j<this.Specs.GS.length;++this.j)
	 if (this.Specs.GS[this.j][1]==aPairs[this.i][0])
	    this.Specs.GS[this.j][1] = aPairs[this.i][1];
};
*/

//---------------------------------------------
//----------COMPOUND SPRITE--------------------

//--SPRITE ATTACHMENT INFO--
var SpriteAttachmentInfo = function() { var X, Y, Z; };
SpriteAttachmentInfo.prototype.Set = function(specs) { this.X = specs.X; this.Y = specs.Y; this.Z = specs.Z; };

//NOTE: this is AttachedSprite, but sprite attachments will now be handled in GameAgent, so this is likely REDUNDANT

//--COMPOUND SPRITE--
var CompoundSprite = function() {
   var Attachments;		//can be one or several
   var AttachmentInfo;
};
CompoundSprite.prototype = new StaticSprite();
CompoundSprite.prototype.Set = function(cntxt, src, specs, attachedSpritesSpecs) {
   var i;
   var sprite;
   var attachedSpriteInfo;

   StaticSprite.prototype.Set.call(this, cntxt, src, specs, attachedSpritesSpecs);

   this.ZOrder = specs.Z;

   //Create and set attached sprites
   this.Attachments = new Array();
   this.AttachmentInfo = new Array();
   for (i=3;i<arguments.length;++i) {
      switch (arguments[i].SHAPE) {
	 case SPRITE.STATIC:
	    sprite = new StaticSprite();
	    sprite.Set(cntxt, src, arguments[i]);
	    break;
	 case SPRITE.ANIMATED:
	    sprite = new AnimatedSprite();
	    sprite.Set(cntxt, src, arguments[i]);
	    break;
	 case SPRITE.GEOMETRIC:
	    sprite = new GeometricSprite();
	    sprite.Set(cntxt, src, arguments[i]);	//NOTE: a graphics tool will have to be attached
	    break;
	 case SPRITE.COMPOSITE:
	    sprite = new CompositeSprite();
	    sprite.Set(cntxt, src, arguments[i]);	//NOTE: a graphics tool will have to be attached
	    break;
      }
      this.Attachments.push(sprite);
      attachedSpriteInfo = new SpriteAttachmentInfo();
      attachedSpriteInfo.Set(arguments[i]);
      this.AttachmentInfo.push(attachedSpriteInfo);
   }

//   this.Attachments = sprites;
//   this.AttachInfo = info;
};
CompoundSprite.prototype.Draw = function(x, y) {
   var i;
   var zIndex;

   zIndex = 0;

   while (zIndex<=this.Attachments.length) {
      for (i=0;i<this.Attachments.length;++i)
	 if (this.ZOrder==zIndex)
	    StaticSprite.prototype.Draw.call(this, x, y);
	 else
	    if (this.Attachments[i].ZOrder==zIndex)
	       this.Attachments.Draw(x+this.AttachmentInfo[i].X, y+this.AttachmentInfo[i].Y);
      ++zIndex;
   }
};

var MultiStateCompoundSprite = function() {
   var Attachment;
};
MultiStateCompoundSprite.prototype = new AnimatedSprite();
MultiStateCompoundSprite.prototype.Set = function(cntxt, src, specs) {
   AnimatedSprite.prototype.Set.call(this, cntxt, src, specs);
};

//--------------------------------------------------------
//----------ANIMATED COMPOSITE SPRITE---------------------
var AnimatedCompositeSprite = function() {
   var State;
   var Offset;
   var ZeroStateLeft;
   var MultiStateGeoSpecs;
};
AnimatedCompositeSprite.prototype = new CompositeSprite();
AnimatedCompositeSprite.prototype.Set = function(cntxt, imgs, specs, gTool, iBox) {
   var singleStateSpecs;

   //NOTE: correct GeoSpecs entry is assigned in ::Draw
   CompositeSprite.prototype.Set.call(this, cntxt, imgs, specs, gTool, iBox);

   this.MultiStateGeoSpecs = specs.GS;
   this.State = 0;
   this.Offset = specs.O;
   this.ZeroStateLeft = this.Left;
//   this.ZeroStateTop = this.Top;
};
AnimatedCompositeSprite.prototype.SetDraw = function(state) {  //NOTE: this is a total hack, but might be acceptable
   AnimatedSprite.prototype.SetDraw.call(this, state);
};
AnimatedCompositeSprite.prototype.CreateImageGallery = function(info) {  //UNTESTED
   var i;

   this.GeoSpecs = this.MultiStateGeoSpecs[0];
   CompositeSprite.prototype.CreateImageGallery.call(this);

   for (i=1;i<this.Specs.S;++i) {
      this.Left = this.ZeroStateLeft + i*(this.Width+this.Offset);
      this.GeoSpecs = this.MultiStateGeoSpecs[i];
      this.AddColumnToGallery(info);		//ISSUE: different approach for MultiSpecs
//      CompositeSprite.prototype.AddColumnToGallery.call(this);
   }
}
AnimatedCompositeSprite.prototype.DrawWireframe = function(x, y, state) {

   this.State = state || 0;
   this.Left = this.ZeroStateLeft + this.State*(this.Width+this.Offset);
   AnimatedSprite.prototype.Draw.call(this, x, y, this.State);
};
AnimatedCompositeSprite.prototype.Draw = function(x, y, state) {
   this.State = state || 0;
   this.Left = this.ZeroStateLeft + this.State*(this.Width+this.Offset);
   if (this.MultiStateGeoSpecs[0][0].length)
      this.GeoSpecs = this.MultiStateGeoSpecs[this.State];

//   CompositeSprite.prototype.Draw.call(this, x, y);
   GeometricSprite.prototype.Draw.call(this, x, y);
   AnimatedSprite.prototype.Draw.call(this, x, y, this.State);

//   this.GeoSpecs = this.MultiStateGeoSpecs;
};
/* */
AnimatedCompositeSprite.prototype.DrawCentred = function(x, y, state) {
   if (!this.DrawStart)
      this.Draw(Math.round(x-(this.Width/2)), Math.round(y+(this.Height/2)), state);
   else
      switch (this.DrawStart) {  //TODO: only handling one case, but there can be several of them
	 case ALIGNMENT.CENTRE:
	    this.Draw(x, y, state);
	    break;
      }
};
/*
AnimatedCompositeSprite.prototype.Recolour = function() {  //TODO: re-write if it is ever used
   var i, j;

   for (i=0;i<this.MultiStateGeoSpecs.length;++i)
      for (j=0;j<arguments.length;++j)  //ISSUE: different states can have different number of entries
	 this.MultiStateGeoSpecs[i][j][SHAPeSPEC.COLOUR] = arguments[j];
};
//   GetState : function(sctchBuffer, imgBuffer, state) {
   //write relevant portion to scratch buffer - have to clear it first, or set the right width/height, or, worst case
   //	scenario, create new canvas and use that (might even need a custom canvas buffer object w/ relevant methods)
   //copy to imgBuffer
//   }
//};
*/
AnimatedCompositeSprite.prototype.IndexedReColour = function(aColours) {
   var i, j, k;

   for (i=0;i<aColours.length;++i)
      for (j=0;j<aColours[i].length;++j)
	 for (k=0;k<aColours[i][j][1].length;++k)
	    this.Specs.GS[i][aColours[i][j][1][k]][SHAPeSPEC.COLOUR] = aColours[i][j][0];
};
AnimatedCompositeSprite.prototype.IndexedReColourState = function(aColours, state) {
   var i, j;

   for (i=0;i<aColours.length;++i)
      for (j=0;j<aColours[i][1].length;++j)
	 this.Specs.GS[state][aColours[i][1][j]][SHAPeSPEC.COLOUR] = aColours[i][0];
};

//-----------------------------------------------
//---------- CHARACTER SPRITE--------------------  //ISSUE: this, and others, will move to Sprights, will all be mobile ones
//TODO: Need a CharacterSprite soon that comes replete with a 2D image plus small snippets of facial expressions, easily 
// transposed to display varying emotions; should also do something similar with arms and hands as gesticular accompaniments
var CharacterSprite = function() {  //this is a mobile, animated, possibly colourable, sprite
   var MC;			//motion component
   var Expressions;		//at the moment will be a chain of location in sprite sheet
   var Face;			//top-left coordinates of where it begins; or maybe rect w/ W-H also
};
CharacterSprite.prototype = new AnimatedSprite();
CharacterSprite.prototype.Set = function(cntxt, imgs, specs) {
   //have to save left-right rotated images to buffer; probably have to do that for expressions as well
};
CharacterSprite.prototype.Draw = function() {
   //Draw the main sprite per usual, then superimpose expression over it; list of expressions can be enumerated in data
   // var EXPRESSION = { HAPPY: 0, SAD: 1, A: 2, E: 3, I: 4, O: 5, U: 6 };
   // pronouncing vowels is what changes the shape of the mouth, since consonants usually just cause closing of lips at
   // the most
};

//----------CHAMELEON SPRITE--------------------	//ISSUE: this is slated to be ditched altogether
//var ChameleonSprite = function() {
//   var CC;			//Colouring component
//};
//ChameleonSprite.prototype = new StaticSprite();
//ChameleonSprite.prototype.Set = function(cntxt, imgs, specs, buffer, colourPairs) {
//      StaticSprite.prototype.Set.call(this, cntxt, imgs, specs);
//
//      this.CC = new ColouringObject();
//      this.CC.Set(specs.BaseColour);	//NOTE: several components can be re-colourized, so maybe several base colours needed
//};
var ChameleonSprite = function() { };
ChameleonSprite.prototype = new StaticSprite();
ChameleonSprite.prototype.Set = function(cntxt, imgs, specs, buffer, baseColours, outline, geoClrSpecs) {
      StaticSprite.prototype.Set.call(this, cntxt, imgs, specs);

      this.EnableChameleonCapability(buffer, baseColours);
      this.ImageOutline = outline;
      this.GeoColourSpecs = geoClrSpecs;
};
