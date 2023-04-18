
//--------------------------------------------
//----------- GENIE IMAGE --------------------
var GenieImage = function () {
   var Context;
   var Pic;
   var Specs;
   var Left, Top;
   var X, Y;

   var sx, sy;
};
GenieImage.prototype = {
   Set(context, pic, specs) {
      this.Context = context;
      this.Pic = pic;
      this.Specs = specs;
      this.Left = this.Specs.L || 0;
      this.Top = this.Specs.T || 0;
      this.X = this.Specs.X;
      this.Y = this.Specs.Y;

      //ISSUE: if height and width are not declared in specs, they'll have to be determined and stored here
      //OPEN: may need X, Y fields in some apps
   },
   SetCoords(x, y) {
      if (this.Specs) {
	 this.X = x || this.Specs.X;
	 this.Y = y || this.Specs.Y;
      }
      this.X = this.X || 0;
      this.Y = this.Y || 0;
   },
   Draw(x, y, scale) {  //NOTE: images are drawn starting from Top-Left
      this.SetCoords(x, y);
      if (scale)
	 this.Context.drawImage(this.Pic, this.Left, this.Top, this.Specs.W, this.Specs.H, this.X, this.Y, scale*this.Specs.W, scale*this.Specs.H);
      else
	 this.Context.drawImage(this.Pic, this.Left, this.Top, this.Specs.W, this.Specs.H, this.X, this.Y, this.Specs.W, this.Specs.H);
   },
   DrawAligned(x, y, alignnmet) {  //TODO: plenty to do here, although no use has been found for it yet
      this.SetCoords(x, y);
      switch (alignnmet) {
	 case ALIGNMENT.BOTTOmCENTRE:
	    this.Draw(this.X-(this.Specs.W/2), this.Y-this.Specs.H);
	    break;
      }
   },
   DrawPatch(x, y, sx, sy, w, h) {

      this.SetCoords(x, y);
      this.Context.drawImage(this.Pic, this.Left+sx, this.Top+sy, w, h, this.X, this.Y, w, h);
   },
   DrawPatchNumber(nPatch, x, y) {

      this.SetCoords(x, y);
      this.sx = this.Left + ((nPatch % this.Specs.C)*(this.Specs.PATCH.W+this.Specs.O));
      this.sy = this.Top + (Math.floor(nPatch/this.Specs.C)*(this.Specs.PATCH.H+this.Specs.O));
      this.Context.drawImage(this.Pic, this.sx, this.sy, this.Specs.PATCH.W, this.Specs.PATCH.H, this.X, this.Y, this.Specs.PATCH.W, this.Specs.PATCH.H);
   },
   DrawCentred(x, y) {
      this.SetCoords(x, y);
      this.Draw(this.X-Math.round(this.Specs.W/2), this.Y-Math.round(this.Specs.H/2));
   },
   CheckMouseDown() {
      return (SpaceUtils.CheckPointInBox(Mouse.Down, { L: this.X, T: this.Y, W: this.Specs.W, H: this.Specs.H } ));
   },
   CheckClicked() {
      return (SpaceUtils.CheckPointInBox(Mouse.Click, { L: this.X, T: this.Y, W: this.Specs.W, H: this.Specs.H } ));
   },
   DrawScaled(x, y, w, h) {

      this.SetCoords(x, y);
      this.Context.drawImage(this.Pic, this.Left, this.Top, this.Specs.W, this.Specs.H, this.X, this.Y, w, h);
   }
};
