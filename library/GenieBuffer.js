
//--------------------------------------------
//---------- GENIE BUFFER --------------------
var GenieBuffer = function() {
   var Canvas;
   var Context;
   var Screen;
   var Centre;		//for rotation
   var Angle;
   var ScaleX, ScaleY;
   var X, Y;
};
GenieBuffer.prototype = {
   Set(size, bTransform) {

      //Create buffer
      this.Canvas = document.createElement("canvas");
      this.Context = this.Canvas.getContext("2d");

      //NOTE: will re-size only if greater than default canvas width or height (300x150px)
      if (size)
	 if ((size.WIDTH>this.Canvas.width) || (size.HEIGHT>this.Canvas.height)) {
	    this.Canvas.width = size.WIDTH;
	    this.Canvas.height = size.HEIGHT;
	 }

      if (bTransform) {
	 this.Centre = new Coordinate2D();
	 this.Centre.Set(this.Canvas.width/2, this.Canvas.height/2);
	 this.Angle = 0;
      }

   },
   Resize(size, bExact) {
      if (bExact) {
	 if ((size.WIDTH!=this.Canvas.width) || (size.Height!=this.Canvas.height)) {
	    this.Canvas.width = size.WIDTH;
	    this.Canvas.height = size.HEIGHT;
	 }
      } else if ((size.Width>this.Canvas.width) || (size.Height>this.Canvas.height)) {
	    this.Canvas.width = size.HEIGHT;
	    this.Canvas.height = size.HEIGHT;
      }
   },
   Clear() {

      this.Context.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
   },
   DrawPatch(cntxt, x, y, sx, sy, w, h) {

      cntxt.drawImage(this.Canvas, sx, sy, w, h, x, y, w, h);
   },
   DrawRotated(sprite, state, offst, x, y, angle) {  //ISSUE: don't see the rationale for specifying offst here
      this.StartRotation(angle);
      this.DrawSpriteToBuffer(sprite, state, offst);
      this.DrawBufferToScreen(x, y);
      this.EndRotation();
   },
   StartRotation(angle) {
      this.Angle = angle;
      this.Clear();
      this.Context.translate(this.Centre.X, this.Centre.Y);
      this.Context.rotate(this.Angle*(Math.PI/180));
   },
   DrawSpriteToBuffer(sprite, state, offst) {  //NOTE: offst is from centre of sprite . . . ISSUE: should be called ::DrawSpriteRotated (maybe)
      state = state || 0;
      this.Screen = sprite.Context;
      sprite.Context = this.Context;
      if (offst)	//NOTE: drawing centre is presently centre of buffer
//	 sprite.DrawCentred(offst.X, offst.Y, state);
	 sprite.Draw(offst.X, offst.Y, state);
      else
	 sprite.DrawCentred(0, 0, state);
      sprite.Context = this.Screen;
   },
   DrawBufferToScreen(x, y) {
      this.Screen.drawImage(this.Canvas, x-this.Centre.X, y-this.Centre.Y);
   },
   EndRotation(angle) {
      this.Context.rotate(-this.Angle*(Math.PI/180));
      this.Context.translate(-this.Centre.X, -this.Centre.Y);
   },
   DrawFlipped(sprite, state, offst, x, y, orntd) {
      this.Clear();
      this.StartFlip(orntd);
      this.DrawSpriteFlipped(sprite, state, offst, x, y, orntd);
      this.EndFlip();
   },
   StartFlip(orntd) {
      this.ScaleX = 1;
      this.ScaleY = 1;
      if (orntd & FLIPPED.HORIZONTAL)
	 this.ScaleX = - this.ScaleX;
      if (orntd & FLIPPED.VERTICAL)
	 this.ScaleY = - this.ScaleY;
      this.Context.scale(this.ScaleX, this.ScaleY);
   },
   DrawSpriteFlipped(sprite, state, offst, x, y, orntd) {
      state = state || 0;
      this.Screen = sprite.Context;
      sprite.Context = this.Context;

      //Adjust coordinates
//      this.X = this.Centre.X - Math.round(sprite.Width/2);
//      this.Y = this.Centre.Y - Math.round(sprite.Height/2);
      this.X = this.Centre.X;
      this.Y = this.Centre.Y;
      if (offst) {
	 this.X += offst.X;	//ISSUE: UNTESTED!!
	 this.Y += offst.Y;
      }
      if (orntd & FLIPPED.HORIZONTAL)  //ISSUE: UNTESTED!!
	 this.X = - this.X;
      if (orntd & FLIPPED.VERTICAL)
	 this.Y = - this.Y;

      //Draw
      sprite.DrawCentred(this.X, this.Y, state);

      //TODO: adjust for alignment

      this.Screen.drawImage(this.Canvas, x-this.Centre.X, y-this.Centre.Y);
      sprite.Context = this.Screen;
   },
   EndFlip() {
      this.Context.scale(this.ScaleX, this.ScaleY);
   },
   DrawResized(sprite, state, offst, x, y, scale) {

      //LOGGED - UNTESTED

      this.DrawSprite(sprite, state, offst, x, y);
      this.DrawContentsResized(x, y, scale);
   },
   DrawContentsResized(x, y, scale) {
      this.X = x - (scale*this.Centre.X);
      this.Y = y - (scale*this.Centre.Y);
      this.Screen.drawImage(this.Canvas, 0, 0, this.Canvas.width, this.Canvas.height, this.X, this.Y, scale*this.Canvas.width, scale*this.Canvas.height);
   }
};
