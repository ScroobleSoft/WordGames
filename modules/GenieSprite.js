
//TODO: skewing will be implemented later, likely in Genie2D, until then will be ignored
//TODO: blurring outline, once implemented, isn't really a 'state'

//---------- TRANSFORM INFO ----------
//NOTE: Transform Data is passed in following format -
//  [ { Form: form, Scale/Orientation/Angle/Colours/Shadow: sh/o/a/c/sh, . . . Scale/.../Shadow: sc/o/a/c/sh } ],
//    (1-5 sc/o/a/c/sh's); Shadow is indicated by true or false
var TransformInfo = function() {
   var Form;		//flipped, scaled, rotated and/or coloured
   var L, T, W, H;	//place in buffer
   var Orientation, Scale, Angle, Colour, Shadow;
};
TransformInfo.prototype.Set = function(lft, top, wdth, hght, trnsfrm) {
   this.L = left; this.T = top; this.W = wdth; this.H = hght;
   this.SetTransformInfo(trnsfrm);
};
TransformInfo.prototype.SetTransformInfo = function(trnsfrm) {
   this.Form = trnsfrm.Form;
   this.Orientation = trnsfrm.Ornt || FLIPPED.FALSE;	//ISSUE: all the '||'s could be dropped
   this.Scale = trnsfrm.Scale || 1.0;
   this.Angle = trnsfrm.Angle || 0;
   this.Colours = trnsfrm.Colours;
   this.Shadow = trnsfrm.Shadow || false;
};

//---------- SPRITE BUFFER ----------
var SpriteBuffer = function() {
   var Left, Top;
   var Width, Height;		//only needed for multi-column buffers
   var GalleryInfo;
};
SpriteBuffer.prototype = new GenieBuffer();
SpriteBuffer.prototype.Set = function(info, width, height, columns) {
   var size;

   this.Left = 1;
   this.Top = 1;
   this.Width = 0;
   this.GalleryInfo = new Array();
   if (info)
      size = this.CalculateSize(info, width, height, columns);
   else
      size = { Width: width, Height: height };

   GenieBuffer.prototype.Set.call(this, size);
};
SpriteBuffer.prototype.CalculateSize = function(info, width, height, columns) {  //this method also adds to GalleryInfo array
   var i;
   var slotInfo;
   var top, left;
   var columnWidth;
   var maxSize;

   //Calculate size of image column, store info on images
   left = this.Left;
   top = this.Top;	//not really needed since will always be 1
   columnWidth = 0;
   maxSize = Math.ceil(Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)));
   for (i=0;i<info.length;++i) {
      slotInfo = new TransformInfo();
      slotInfo.SetTransformInfo(info[i]);
      slotInfo.L = left;
      slotInfo.T = top;
      if (slotInfo.Form & SPRITeFORM.ROTATED) {
	 slotInfo.W = maxSize;
	 slotInfo.H = maxSize;
      }
      else {
	  if (slotInfo.Form & SPRITeFORM.SCALED) {
	    slotInfo.W = Math.ceil(width*slotInfo.Scale);
	    slotInfo.H = Math.ceil(height*slotInfo.Scale);
	  }
          else {  //COLOURED, FLIPPED and SHADOW have no effect on width and height
	     slotInfo.W = width;
	     slotInfo.H = height;
	  }
      }
      this.GalleryInfo.push(slotInfo);
      columnWidth = Math.max(columnWidth, slotInfo.W);
      top += slotInfo.H + 1;
   }
   this.Left += columnWidth + 1;
   if (!this.Width) {
      columns = columns || 1;
      this.Width = columns*columnWidth;
   }
   this.Height = top;

   return ( { Width: this.Width, Height: this.Height } );
};

//-------------------------------------------
//---------- BASIC SPRITE -------------------
var StaticSprite = function() {
   var Context;
   var PrimaryContext;
   var SecondaryContext;
   var Pic;
   var Specs, OriginalSpecs;
   var ImageGallery;
   var CurrentForm;
   var Reset;			//ISSUE: to original state (unscaled, non-rotated, unflipped) - could also be redundant
   var BoundingPolygon;
   var CurrentFormBoundingPolygon;	//changes depending on state, rotation, flipping, scaling
   var BoundingShapes;		//can be circles or rects; circles only if rotatable
   var CurrentFormBoundingShapes;
   var Top, Left, Width, Height;
   var Diagonal;		//longest diagonal, used in buffering and collision detection
   var DrawStart;
   var RotationCentre;		//NOTE: not storing actual centre since that can be calculated easily
   var Scale, Angle, Flipped;
   var ZOrder;
   var Colourizer, ImageOutline, GeoColourSpecs;

   var coords;
};
StaticSprite.prototype = {
   Set(cntxt, iSrc, specs, iBox) {
      this.Context = cntxt;
      if (iBox) {
	 this.PrimaryContext = this.Context;
	 this.SecondaryContext = iBox;
      }
      this.Pic = iSrc;
      this.Specs = specs;
      this.Top = this.Specs.T; this.Left = this.Specs.L, this.Width = this.Specs.W; this.Height = this.Specs.H;
      this.DrawStart = this.Specs.DS;
      if (this.Specs.DIAGONAL)
	 this.SetDiagonal();
/*
      if (specs.RC) {  //RC.L and .T are relative to T and L
	 this.RotationCentre = new Coordinate2D();
	 this.RotationCentre.X = (this.Width/2) - specs.RL;
	 this.RotationCentre.Y = specs.RT - (this.Height/2);
      }
*/
      if (this.Specs.BP)
	 this.BoundingPolygon = this.Specs.BP;
      if (this.Specs.BS)
	 this.BoundingShapes = this.Specs.BS;
      this.Scale = 1.0; this.Angle = 0; this.Flipped = false;
      if (this.Specs.Z)
	 this.ZOrder = this.Specs.Z;
      this.UsingBuffer = false; this.CurrentForm = 0; this.Reset = true;
   },
   BackupSpecs() {
      this.OriginalSpecs = Object.assign({}, this.Specs);		//UNTESTED!
   },
   SetRotationCentre(coords) {
      if (!this.RotationCentre)
	 this.RotationCentre = new Coordinate2D();
      this.RotationCentre.X = coords.X;
      this.RotationCentre.Y = coords.Y;
   },
   SetDiagonal() {  //will be needed for collision detection if sprite will be rotated
      this.Diagonal = Math.ceil(Math.sqrt(Math.pow(this.Width, 2) + Math.pow(this.Height, 2)));
   },
   SwitchContext() {
      this.Context = this.SecondaryContext;
   },
   RestoreContext() {
      this.Context = this.PrimaryContext;
   },
   AdjustBoundingPolygonToCentre() {
      var i;

      for (i=0;i<this.BoundingPolygon.length;++i) {
	 this.BoundingPolygon[i][0] -= Math.round(this.Width/2);
	 this.BoundingPolygon[i][1] += Math.round(this.Height/2);
      }
   },
   ResetBoundingPolygon() {
      var i;

      for (i=0;i<this.BoundingPolygon.length;++i) {
	 this.BoundingPolygon[i][0] += Math.round(this.Width/2);
	 this.BoundingPolygon[i][1] -= Math.round(this.Height/2);
      }
   },
   CreateImageGallery(info, columns) {  //NOTE: only draws one column, leaves space for others
      var i;
      var screenContext;
      var xOffset, yOffset;

      info = info || this.Specs.TI;
      columns = columns || this.Specs.S;
      this.ImageGallery = new SpriteBuffer();
      this.ImageGallery.Set(info, this.Width, this.Height, columns);

      //Draw to buffer
//      this.DrawToBuffer(0, this.ImageGallery.GalleryInfo.length);
      screenContext = this.Context;
      this.Context = this.ImageGallery.Context;
      for (i=0;i<this.ImageGallery.GalleryInfo.length;++i) {
	 if (this.ImageGallery.GalleryInfo[i].Form & SPRITeFORM.ROTATED) {
	    xOffset = (this.ImageGallery.GalleryInfo[i].W-this.Width)/2;
	    yOffset = (this.ImageGallery.GalleryInfo[i].H-this.Height)/2;
	 } else {
	    xOffset = 0;
	    yOffset = 0;
	 }
	 this.DrawTransformed(this.ImageGallery.GalleryInfo[i].L+xOffset, this.ImageGallery.GalleryInfo[i].T-yOffset +  this.ImageGallery.GalleryInfo[i].H, this.ImageGallery.GalleryInfo[i].Form, this.ImageGallery.GalleryInfo[i].Orientation, this.ImageGallery.GalleryInfo[i].Angle, this.ImageGallery.GalleryInfo[i].Scale, this.ImageGallery.GalleryInfo[i].Colours);
      }
      this.Context = screenContext;
   },
   DrawToBuffer(start, stop) {  //start, stop location in ImageGallery Info array
      var i;
      var screenContext;
      var xOffset, yOffset;

      screenContext = this.Context;
      this.Context = this.ImageGallery.Context;
      for (i=start;i<stop;++i) {
      if (this.ImageGallery.GalleryInfo[i].Form & SPRITeFORM.ROTATED) {
	 xOffset = Math.round((this.ImageGallery.GalleryInfo[i].W-this.Width)/2);
	 yOffset = Math.round((this.ImageGallery.GalleryInfo[i].H-this.Height)/2);
      } else {
	 xOffset = 0;
	 yOffset = 0;
      }
	 this.DrawTransformed(this.ImageGallery.GalleryInfo[i].L+xOffset, this.ImageGallery.GalleryInfo[i].T-yOffset +  this.ImageGallery.GalleryInfo[i].H, this.ImageGallery.GalleryInfo[i].Form, this.ImageGallery.GalleryInfo[i].Orientation, this.ImageGallery.GalleryInfo[i].Angle, this.ImageGallery.GalleryInfo[i].Scale, this.ImageGallery.GalleryInfo[i].Colours);
      }
      this.Context = screenContext;
   },
   AddColumnToGallery(info) {
      var size;
      var start, stop;

      start = this.ImageGallery.GalleryInfo.length;
      stop = start + info.length;
      size = this.ImageGallery.CalculateSize(info, this.Width, this.Height);

      //Draw column
      this.DrawToBuffer(start, stop);
   },
//   DrawRecoloured(colourArray) {
//      var context;
//      var originalContext;

//      originalContext = this.Context;
//      this.Context = this.Colourizer.Buffer.Context;
//      this.DrawRecreation(0, 0);
//      this.DrawOutline(0, 0);
//      this.Colourizer.ChangeColours(colourArray);
//      this.Context = originalContext;
//      originalPic = this.Pic;
//      this.Pic = this.Colourizer.Buffer.Canvas;
//      this.Draw(0, 0);
//      this.Pic = originalPic;      
//   },
   DrawShadow(loc) {  //of lightsource in 3D coordinates
      var lightSourceLoc;		//ISSUE: brightness can vary, needs to be specified

      lightSourceLoc = loc || 0;	//if no lightsource, then just a dark silhouette
   },
   DrawFlipped(x, y, orntd) {
      var xScale, yScale;

      xScale = 1;
      yScale = 1;
      if (orntd & FLIPPED.HORIZONTAL) {
	 xScale = - xScale;
	 x = - x - this.Width;
      }
      if (orntd & FLIPPED.VERTICAL) {
	 yScale = - yScale;
	 y = - y + this.Height;
      }

      if (orntd)				//NOTE: sometimes it can be useful to call this method with no flipping specified
	 this.Context.scale(xScale, yScale);
      this.Draw(x, y);
      if (orntd)
	 this.Context.scale(xScale, yScale);
   },
   DrawResized(x, y, scale, alignment) {
      //ASSUMPTION: image won't be expanded, or else will overflow
      //NOTE: shrunken images may need further treatment for transparency
      var width, height;

      width = this.Width*scale;
      height = this.Height*scale;
      if (alignment==ALIGNMENT.CENTRE)  //TODO: in the future, should have a method that returns alignment offsets
	 this.Context.drawImage(this.Pic, this.Left, this.Top, this.Width, this.Height, x-Math.round(width/2), y-height+Math.round(height/2), width, height);
      else if (alignment==ALIGNMENT.BOTTOmCENTRE)  //TODO: with more than two cases now, should use switch
	 this.Context.drawImage(this.Pic, this.Left, this.Top, this.Width, this.Height, x-Math.round(width/2), y-height, width, height);
      else
	 this.Context.drawImage(this.Pic, this.Left, this.Top, this.Width, this.Height, x, y-height, width, height);
   },
   DrawRotated(x, y, angle) {

/* this is the old, inefficient version
      var rx, ry;
      var rw, rh;
      var angleSin, angleCos;

      if (!this.coords)
	 this.coords = new Coordinate2D();
      this.coords.X = 0;
      this.coords.Y = 0;

      y = -y;
      angle *= Math.PI/180;
      angleSin = Math.sin(angle);
      angleCos = Math.cos(angle);
      rx = x*angleCos - y*angleSin;
      ry = x*angleSin + y*angleCos;
//      rw = (this.Width/2)*angleCos + (-this.Height/2)*angleSin;  //clockwise
//      rh = -(this.Width/2)*angleSin + (-this.Height/2)*angleCos;
      rw = ((this.Width/2)-this.coords.X)*angleCos + (this.coords.Y-(this.Height/2))*angleSin;  //clockwise
      rh = -((this.Width/2)-this.coords.X)*angleSin + (this.coords.Y-(this.Height/2))*angleCos;
      x = Math.round(rx + rw - (this.Width/2));
      y = Math.round(ry - rh + (this.Height/2));

      //Check if location has to be adjusted because of rotation centre specification
      if (this.Specs.RC) {
	 x += this.Specs.RC.X;
	 y -= this.Specs.RC.Y;
      }
      this.Context.rotate(angle);
      this.Context.drawImage(this.Pic, this.Left, this.Top, this.Width, this.Height, x, -y, this.Width, this.Height);
      this.Context.rotate(-angle);
*/  //below is the version that requires fewer calculations

      angle = GeoUtils.DegreesToRadians(angle);

      //Move to centre of sprite
      x += Math.round(this.Specs.W/2);
      y -= Math.round(this.Specs.H/2);

      //Prepare for drawing
      if (this.Specs.RC)
	 this.Context.translate(x+this.Specs.RC.X, y+this.Specs.RC.Y);
      else
	 this.Context.translate(x, y);
      this.Context.rotate(angle);

      //Draw with rotation centre adjustment if needed
      if (this.Specs.RC)
	 this.Context.drawImage(this.Pic, this.Left, this.Top, this.Specs.W, this.Specs.H, -this.Specs.RC.X-Math.round(this.Specs.W/2), -this.Specs.RC.Y-Math.round(this.Specs.H/2), this.Specs.W, this.Specs.H);
      else
	 this.Context.drawImage(this.Pic, this.Left, this.Top, this.Specs.W, this.Specs.H, -Math.round(this.Specs.W/2), -Math.round(this.Specs.H/2), this.Specs.W, this.Specs.H);

      //Restore original canvas state
      this.Context.rotate(-angle);
      if (this.Specs.RC)
	 this.Context.translate(-x-this.Specs.RC.X, -y-this.Specs.RC.Y);
      else
	 this.Context.translate(-x, -y);
   },
   DrawTransformed(x, y, form, orntd, angle, scale, colours) {  //this is for multiple transforms
//TODO: probably have to change how specs are passed
      var xScale, yScale;
      var xOriginal, yOriginal;
      var width_half, height_half;
      var width, height;
      var xOffset, yOffset;
      var rx, ry;
      var rw, rh;
      var originalPic, originalContext;

      //ISSUE: use '&' below instead of '-'
      if (form-SPRITeFORM.COLOURED==0)
	 this.DrawRecoloured(x, y, colours);
      else if (form-SPRITeFORM.ENSHADOWED==0) {
	 var lightsource = 0;	//ISSUE: obviously, this will go
	 this.DrawShadow(x, y, lightsource);
      }
      else if (form-SPRITeFORM.FLIPPED==0)
	 this.DrawFlipped(x, y, orntd);
      else if (form-SPRITeFORM.SCALED==0)
	 this.DrawResized(x, y, scale);
      else if (form-SPRITeFORM.ROTATED==0)
	 this.DrawRotated(x, y, angle);

//------>
      return;
//------>

//ISSUE: revert to base colours in colourizer?
      if ((form & SPRITeFORM.COLOURED) || (form & SPRITeFORM.ENSHADOWED)) {
	 originalContext = this.Context;
	 this.Context = this.Colourizer.Buffer.Context;
	 this.DrawRecreation(0, 0);
	 this.Context = originalContext;
	 if (form & SPRITeFORM.COLOURED)
	    this.Colourizer.ChangeColours(colours);
	 originalPic = this.Pic;
	 this.Pic = this.Colourizer.Buffer.Canvas;
      }

//if rotated {
      x += (this.Width/2)*(1-scale);
      y -= (this.Height/2)*(1-scale);
//}
      y -= this.Height;

      //First set for flipping if necessary
      xScale = 1;
      yScale = 1;
      xOffset = 0;
      yOffset = 0;
      if (form & SPRITeFORM.FLIPPED) {
	 if (orntd & FLIPPED.HORIZONTAL) {
	    xScale = - xScale;
	    x = - x;
	    angle = - angle;
	    xOffset = - this.Width;
	 }
	 if (orntd & FLIPPED.VERTICAL) {
	    yScale = - yScale;
	    y = - y;
	    angle = - angle;
	 }
         this.Context.scale(xScale, yScale);
      }

      //Then, implement scaling if asked for
      if (form & SPRITeFORM.SCALED) {
	 width = this.Width*scale;
	 height = this.Height*scale;
	 xOffset += (this.Width-width)/2;
	 yOffset += ((this.Height-height)/2)*yScale;
      } else {
	 width = this.Width;
	 height = this.Height;
      }

      if (form & SPRITeFORM.ROTATED) {
	 x += xOffset;
	 y += yOffset;
	 if (form & SPRITeFORM.FLIPPED) {
	    if (orntd==FLIPPED.HORIZONTAL)
	       y += this.Height;
	 } else if (angle<0 || angle>180)
//	 } else if (angle<0)
	    y += this.Height;
	 y = -y;
	 angle *= Math.PI/180;
	 angleCos = Math.cos(angle);
	 angleSin = Math.sin(angle);
	 rx = x*angleCos - y*Math.sin(angle);
	 ry = x*Math.sin(angle) + y*angleCos;
	 rw = (this.Width/2)*angleCos + (-this.Height/2)*angleSin;	//clockwise
	 rh = -(this.Width/2)*angleSin + (-this.Height/2)*angleCos;
//	 x = rx + rw - (this.Width/2);
//	 y = ry - rh + (this.Height/2);
	 x = rx + rw - ((this.Width/2)*scale);
	 y = ry - rh + ((this.Height/2)*scale);
	 this.Context.rotate(angle);
	 this.Context.drawImage(this.Pic, this.Left, this.Top, this.Width, this.Height, x, -y, width, height);
	 this.Context.rotate(-angle);
      } else
	 this.Context.drawImage(this.Pic, this.Left, this.Top, this.Width, this.Height, x+xOffset, y+yOffset, width, height);

      if (form & SPRITeFORM.FLIPPED)
	 this.Context.scale(xScale, yScale);

      if ((form & SPRITeFORM.COLOURED) || (form & SPRITeFORM.ENSHADOWED))
	 this.Pic = originalPic;
   },
   DrawBufferedImage(indx) {  //which one - gallery or current state?
//instead of index to buffer info array, could specify transform type, then search for it
//this adds the possibility of searching buffers in some situations where the need for a certain transform comes
// up dynamically, and needs to be generated if not already present
//there could be an issue with discarded states littering CurrentStateBuffer, and maybe even ImageGallery
   },
   Draw(x, y) {  //TODO: add alignment argument, making next 3 (or 4) methods redundant
      if (x==undefined && y==undefined) {
	 x = this.Specs.X;
	 y = this.Specs.Y;
      }
      this.Context.drawImage(this.Pic, this.Left, this.Top, this.Width, this.Height, x, y-this.Height, this.Width, this.Height);
   },
   DrawCentred(x, y) {

      switch (this.Specs.ALIGN) {  //TODO: only handling two cases right now
	 case ALIGNMENT.CENTRE:
	    this.Draw(x, y);
	    break;
	 case ALIGNMENT.BOTTOmLEFT:
	 default:
	    this.Draw(Math.round(x-(this.Specs.W/2)), Math.round(y+(this.Specs.H/2)));
	    break;
      }
   },
   DrawXCentred(x, y) {
      this.Draw(Math.round(x-(this.Width/2)), y);
   },
   DrawYCentred(x, y) {
      this.Draw(x, Math.round(y+(this.Height/2)));
   },
   DrawCentredAndRotated(x, y, angle) {
      this.DrawRotated(Math.round(x-(this.Width/2)), Math.round(y+(this.Height/2)), angle);
   },
   DrawForm(form, x, y, alignment) {  //ASSUMPTION: buffer has always been created, so don't have to check every time
      var l, t, w, h;
      var coords;

      this.CurrentForm = form;
      l = this.ImageGallery.GalleryInfo[form].L;
      t = this.ImageGallery.GalleryInfo[form].T;
      w = this.ImageGallery.GalleryInfo[form].W;
      h = this.ImageGallery.GalleryInfo[form].H;

      //Adjust coordinates if not starting drawing from bottom-left
      if (alignment)
	 switch (alignment) {				//NOTE: will implement other cases when used
	    case ALIGNMENT.BOTTOmCENTRE:
	       x -= Math.round(w/2);
	       break;
	    case ALIGNMENT.CENTRE: 
	       x -= Math.round(w/2);
	       y += Math.round(h/2);
	       break;
	 }

      if (this.ImageGallery.GalleryInfo[form].Form & SPRITeFORM.ROTATED) {  //correct for rotated images
//	 x -= (w-this.Width)/2;		//NOTE: commented out since are going to leave responsibility to
//	 y += (h-this.Height)/2;	//      calling app for position correction for now
	 if (this.RotationCentre) {  //check if location has to be adjusted
	    coords = Utilities.RotateCoordinates(this.RotationCentre, this.ImageGallery.GalleryInfo[form].Angle);
	    x += Math.round(coords.X);
	    y += Math.round(coords.Y);
	 }
      }

      this.Context.drawImage(this.ImageGallery.Canvas, l, t, w, h, x, y-h, w, h);
   },
   DrawFormCentred(form, x, y) {
      var xOffset, yOffset;

//      xOffset = Math.round((this.ImageGallery.GalleryInfo[form].W-this.Width)/2);
//      yOffset = Math.round((this.ImageGallery.GalleryInfo[form].H-this.Height)/2);
      xOffset = Math.round(this.ImageGallery.GalleryInfo[form].W/2);
      yOffset = Math.round(this.ImageGallery.GalleryInfo[form].H/2);
      this.DrawForm(form, x-xOffset, y+yOffset);
   },
   DrawCurrentForm(x, y) {
      this.DrawForm(this.CurrentForm, x, y);
   },
   DrawPatch(x, y, strtx, strty, wdth, hght) {
      this.Context.drawImage(this.Pic, this.Left+strtx, this.Top+strty, wdth, hght, x, y-hght, wdth, hght);
   },
   DetectBasicCollision(x, y, rect, centreCoords) {  //simple bounding box check
      var width, height;

      //Check if image might have been rotated
      if (this.Diagonal) {
	 width = this.Diagonal;
	 height = this.Diagonal;
      } else {
	 width = this.Width;
	 height = this.Height;
      }

      //Check if coordinates are of sprite centre
      if (centreCoords) {
	 x -= Math.round(width/2);
	 y += Math.round(height/2);
      }

      //Test each corner
      if (Utilities.PointInBox( { X: x, Y: y }, rect))			//sprite bottom-left corner
	 return true;
      if (Utilities.PointInBox( { X: x+width, Y: y }, rect))		//bottom-right
	 return true;
      if (Utilities.PointInBox( { X: x+width, Y: y-height }, rect))	//top-right
	 return true;
      if (Utilities.PointInBox( { X: x, Y: y-height }, rect))		//top-left
	 return true;
   },
   DetectBarrierCollision(x, y, rect, centreCoords) {
      var i;
      var collision;
      var contour;

      //First do a basic bounding-box collision test
      if (this.DetectBasicCollision(x, y, rect, centreCoords))
	 return true;

      //ASSUMPTION: calling function will maintain centre vs bottom-left coordinates sync, reset them if need be

      //Get bounding polygon based on current form
      if (!this.CurrentForm)
	 contour = this.GetAdjustedBoundingPolygon();
      else
	 contour = this.BoundingPolygon;

      //Check if any of sprite's bounding polygon vertices fall inside barrier rectangle
      collision = false;
      for (i=0;i<this.contour.length;++i)
	 if (Utilities.PointInBox( { X: contour[i][0]+x, Y: contour[i][1]+y }, rect)) {
	    collision = true;
	    break;
	 }
      return (collision);
   },
   DetectSpriteCollision(x, y, centreCoords, sprite, x2, y2, centreCoords2) {  //x2, y2 are coordinates of 2nd sprite
      var i, j;
      var rect;
      var collision;
      var circle1, circle2;

      collision = false;

      //3 step collision detection process, starting with basic bounding box (1) and vertex in box (2) tests
      if (centreCoords2)
	 rect = { T: y2-sprite.Height, L: x2, W: sprite.Width, H: sprite.Height };
      else
	 rect = { T: y2-(sprite.Height/2), L: x2-(sprite.Width/2), W: sprite.Width, H: sprite.Height };
      if (this.DetectBarrierCollision(x, y, rect, centreCoords))
	 return (true);

      //Last step (3) is bounding circles to bounding circles test
      if (!this.CurrentForm)
	 circle1 = this.GetAdjustedBoundingCircles();
      else
	 circle1 = this.BoundingCircle;
      if (!sprite.CurrentForm)
	 circle2 = sprite.GetAdjustedBoundingCircles();
      else
	 circles2 = sprite.BoundingCircle;
      for (i=0;i<this.circles1.length;++i)
	 for (j=0;j<this.circles2.length;++j)
	    if (Utilities.CheckCirclesIntersection( { X: circles1[i][0]+x1, Y: circles1[i][1]+y1 }, circles1[i][2], { X: circles2[j][0]+x2, Y: circles2[j][1]+y2 }, circles2[j][2])) {
	       collision = true;
	       break;
	    }

      return (collision);
   },
   GetAdjustedBoundingPolygon() {
      var i;
      var coords;

      //NOTE: right now only being implemented for centred coordinates

      //Create a bounding polygon for current form if one is needed
      if (!this.CurrentFormBoundingPolygon) {
	 this.CurrentFormBoundingPolygon = new Array();
	 for (i=0;i<this.BoundingPolygon.length;++i) {
	    coords = new Coordinate2D();
	    this.CurrentFormBoundingPolygon.push(coords);
	 }
      }

      //Copy original bounding polygon coordinates
      for (i=0;i<this.BoundingPolygon.length;++i) {
	 this.CurrentFormBoundingPolygon[i][0] = this.BoundingPolygon[i][0];
	 this.CurrentFormBoundingPolygon[i][1] = this.BoundingPolygon[i][1];
      }

      //Adjust for flipping
      if (this.ImageGallery.GalleryInfo[this.CurrentForm].Form & SPRITeFORM.FLIPPED) {
	 if (this.ImageGallery.GalleryInfo[this.CurrentForm].Orientation & FLIPPED.HORIZONTAL)
	    for (i=0;i<this.CurrentFormBoundingPolygon.length;++i)
	       this.CurrentFormBoundingPolygon[i][0] = -this.BoundingPolygon[i][0];
	 if (this.ImageGallery.GalleryInfo[this.CurrentForm].Orientation & FLIPPED.VERTICAL)
	    for (i=0;i<this.CurrentFormBoundingPolygon.length;++i)
	       this.CurrentFormBoundingPolygon[i][1] = -this.BoundingPolygon[i][1];
      }

      //Adjust for scaling
      if (this.ImageGallery.GalleryInfo[this.CurrentForm].Form & SPRITeFORM.SCALED)
	 for (i=0;i<this.CurrentFormBoundingPolygon.length;++i) {
	    this.CurrentFormBoundingPolygon[i][0] *= this.ImageGallery.GalleryInfo[this.CurrentForm].Scale;
	    this.CurrentFormBoundingPolygon[i][1] *= this.ImageGallery.GalleryInfo[this.CurrentForm].Scale;
	 }

      //Adjust for rotation
      if (this.ImageGallery.GalleryInfo[this.CurrentForm].Form & SPRITeFORM.ROTATED)
	 for (i=0;i<this.CurrentFormBoundingPolygon.length;++i) {
	    coords = Utilities.RotateCoordinates( { X: this.CurrentFormBoundingPolygon[i][0], Y: this.CurrentFormBoundingPolygon[i][1] }, this.ImageGallery.GalleryInfo[this.CurrentForm].Angle);
	    this.CurrentFormBoundingPolygon[i][0] = coords.X;
	    this.CurrentFormBoundingPolygon[i][1] = coords.Y;
	 }
   },
   GetAdjustedBoundingCircles() {
      var i;
      var x, y, rds;
      var coords;
      var circles;	//array of 3 member sets


      //Create a bounding circles array for current form if one is needed
      if (!this.CurrentFormBoundingCircles) {
	 this.CurrentFormBoundingCircles = new Array();
	 for (i=0;i<this.BoundingCircles.length;++i) {
	    x = this.BoundingCircles[i][0];
	    y = this.BoundingCircles[i][1];
	    rds = this.BoundingCircles[i][2];
	    this.CurrentFormBoundingCircles.push( [ x, y, rds ] );	//ISSUE: WILL THIS WORK?? (brackets instead?)
	 }
      }

      //Adjust for flipping
      if (this.ImageGallery.GalleryInfo[this.CurrentForm].Form & SPRITeFORM.FLIPPED) {
	 if (this.ImageGallery.GalleryInfo[this.CurrentForm].Orientation & FLIPPED.HORIZONTAL)
	    for (i=0;i<this.CurrentFormBoundingCircles.length;++i)
	       this.CurrentFormBoundingCircles[i][0] = -this.BoundingCircles[i][0];
	 if (this.ImageGallery.GalleryInfo[this.CurrentForm].Orientation & FLIPPED.VERTICAL)
	    for (i=0;i<this.CurrentFormBoundingCircles.length;++i)
	       this.CurrentFormBoundingCircles[i][1] = -this.BoundingCircles[i][1];
      }

      //Adjust for scaling
      if (this.ImageGallery.GalleryInfo[this.CurrentForm].Form & SPRITeFORM.SCALED)
	 for (i=0;i<this.CurrentFormBoundingCircles.length;++i) {
	    this.CurrentFormBoundingCircles[i][0] *= this.ImageGallery.GalleryInfo[this.CurrentForm].Scale;
	    this.CurrentFormBoundingCircles[i][1] *= this.ImageGallery.GalleryInfo[this.CurrentForm].Scale;
	    this.CurrentFormBoundingCircles[i][2] *= this.ImageGallery.GalleryInfo[this.CurrentForm].Scale;
	 }

      //Adjust for rotation
      if (this.ImageGallery.GalleryInfo[this.CurrentForm].Form & SPRITeFORM.ROTATED)
	 for (i=0;i<this.CurrentFormBoundingCircles.length;++i) {
	    coords = Utilities.RotateCoordinates( { X: this.CurrentFormBoundingCircles[i][0], Y: this.CurrentFormBoundingCircles[i][1] }, this.ImageGallery.GalleryInfo[this.CurrentForm].Angle);
	    this.CurrentFormBoundingCircles[i][0] = coords.X;
	    this.CurrentFormBoundingCircles[i][1] = coords.Y;
	 }
   }
}
