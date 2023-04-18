
//-------------------------------------------------
//---------- GENIE PUSH BUTTON --------------------
var GeniePushButton = function() {
   var SurfacePic;
   var Pressed;
   var Offset;		//of surface pic from top-left coords of control
};
GeniePushButton.prototype = new GenieControl();
GeniePushButton.prototype.Set = function(canvas, specs, iEdges, pSpecs) {  //i- image
   GenieControl.prototype.Set.call(this, canvas, specs, iEdges);

   this.SurfacePic = new GenieImage();
   this.SurfacePic.Set(this.Context, ImageManager.Pics[IMAGeINDEX.CONTROLS], pSpecs);

   this.Pressed = false;
   this.Offset = new Coordinate2D();
   this.Offset.X = (this.Pic.Specs.PATCH.W-this.SurfacePic.Specs.W)/2;
   this.Offset.Y = (this.Pic.Specs.PATCH.H-this.SurfacePic.Specs.H)/2;
};
GeniePushButton.prototype.Draw = function(bPressed) {
   this.Erase(this.Specs.BACKGROUND);
   this.SurfacePic.Draw(this.Specs.L+this.Offset.X, this.Specs.T+this.Offset.Y);
   if (bPressed)
      this.Pic.DrawPatchNumber(1, this.Specs.L, this.Specs.T);
   else
      this.Pic.DrawPatchNumber(0, this.Specs.L, this.Specs.T);
};
GeniePushButton.prototype.MouseDown = function() {
   this.Pressed = true;
   this.Draw(PRESSED);
   setTimeout(this.Reset.bind(this), 30);
};
GeniePushButton.prototype.Reset = function() {
   this.Draw();
};
