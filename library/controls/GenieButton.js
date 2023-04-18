/*
 *  NOTE: this is a dummy class - only TextButton, ImageButton and ComboButton should be used - unless a label-less or image-less button is needed
 *  NOTE: because of ComboButton and lack of multiple inheritance, all methods will be implemented here and called where relevant by derived classes
 *  TODO: should have more button style and outline options
 */
//-------------------------------------------
//---------- GENIE BUTTON -------------------
var GenieButton = function() {
};
GenieButton.prototype = new GenieControl();
GenieButton.prototype.Erase = function(colour) {

   if (colour) {
      this.Context.fillStyle = colour;
      this.Context.fillRect(this.Specs.L-2, this.Specs.T-2, this.Specs.W+4, this.Specs.H+4);
   } else {
      if (this.Specs.BACKGROUND) {
	 this.Context.fillStyle = this.Specs.BACKGROUND;
	 this.Context.fillRect(this.Specs.L-2, this.Specs.T-2, this.Specs.W+4, this.Specs.H+4);
      } else
	 this.Context.clearRect(this.Specs.L-2, this.Specs.T-2, this.Specs.W+4, this.Specs.H+4);
   }
};
GenieButton.prototype.Draw = function(bPressed) {

   this.Erase();
   this.Context.lineWidth = 1.0;	//NOTE: cannot assume it will always be 1.0 when app starts
   if (bPressed) {
      this.Context.strokeStyle = this.Specs.COLOUR3 || GREY.MOCHA;
      this.Context.strokeRect(this.Specs.L-1.5, this.Specs.T-1.5, this.Specs.W, this.Specs.H);
      this.Context.strokeStyle = this.Specs.COLOUR4 || GREY.MEDIUM;
      this.Context.strokeRect(this.Specs.L-0.5, this.Specs.T-0.5, this.Specs.W, this.Specs.H);
      this.Context.strokeStyle = this.Specs.COLOUR2 || GREY.LIGHT;
      this.Context.strokeRect(this.Specs.L+0.5, this.Specs.T+0.5, this.Specs.W, this.Specs.H);
      this.Context.strokeStyle = this.Specs.COLOUR1 || "white";
      this.Context.strokeRect(this.Specs.L+1.5, this.Specs.T+1.5, this.Specs.W, this.Specs.H);
   } else {
      this.Context.strokeStyle = this.Specs.COLOUR1 || "white";
      this.Context.strokeRect(this.Specs.L-1.5, this.Specs.T-1.5, this.Specs.W, this.Specs.H);
      this.Context.strokeStyle = this.Specs.COLOUR2 || GREY.LIGHT;
      this.Context.strokeRect(this.Specs.L-0.5, this.Specs.T-0.5, this.Specs.W, this.Specs.H);
      this.Context.strokeStyle = this.Specs.COLOUR3 || GREY.MOCHA;
      this.Context.strokeRect(this.Specs.L+1.5, this.Specs.T+1.5, this.Specs.W, this.Specs.H);
      this.Context.strokeStyle = this.Specs.COLOUR4 || GREY.MEDIUM;
      this.Context.strokeRect(this.Specs.L+0.5, this.Specs.T+0.5, this.Specs.W, this.Specs.H);
/* old style, currently unused
      this.Context.strokeStyle = this.Specs.COLOUR1 || "white";
      this.Context.strokeRect(this.Specs.L-2, this.Specs.T-2, this.Specs.W, this.Specs.H);
      this.Context.strokeStyle = this.Specs.COLOUR2 || GREY.LIGHT;
      this.Context.strokeRect(this.Specs.L-1, this.Specs.T-1, this.Specs.W, this.Specs.H);
      this.Context.strokeStyle = this.Specs.COLOUR3 || GREY.MOCHA;
      this.Context.strokeRect(this.Specs.L+2, this.Specs.T+2, this.Specs.W, this.Specs.H);
      this.Context.strokeStyle = this.Specs.COLOUR4 || GREY.MEDIUM;
      this.Context.strokeRect(this.Specs.L+1, this.Specs.T+1, this.Specs.W, this.Specs.H);
*/
   }
   this.Context.fillStyle = this.Specs.COLOUR || "lightgrey";		//NOTE: "lightgrey" is "rgb(211,211,211)
   this.Context.fillRect(this.Specs.L, this.Specs.T, this.Specs.W, this.Specs.H);
};
GenieButton.prototype.DrawPressed = function() {

   this.Draw(PRESSED);
};
GenieButton.prototype.DrawKeyPadStyle = function(bPressed) {

   //UNLOGGED

   this.GraphicsTool.DrawRectangle(5, 5, 48, 48, "rgb(191,191,191)", 0);
   this.GraphicsTool.DrawPolygonFromVertices(5, 5, [ { X: 48, Y: 0 }, { X: 48, Y: -48 }, { X: 0, Y: -48 } ], "rgb(127,127,127)", 0);
};
GenieButton.prototype.MouseDown = function() {
   GenieControl.prototype.MouseDown.call(this);

   this.DrawPressed();
};
GenieButton.prototype.MouseUp = function() {
   GenieControl.prototype.MouseUp.call(this);

   this.Draw();
};
GenieButton.prototype.WriteLabel = function(offset, lbl) {

   //Centre horizontally (unless otherwise specified via 'offset')
   this.x = this.Specs.L;
   if (offset)
      this.x += offset;
   else
      this.x += Math.round((this.Specs.W-this.Context.measureText(this.Specs.LABEL).width)/2);

   //Centre vertically
   this.y = parseInt(this.Context.font.split(' ')[0].replace('px', ''));		//get height of font
   this.y += Math.round((this.Specs.H-this.y)/2);					//add padding
   this.y += this.Specs.T;
   this.y -= 1;										//this appears to be necessary because of how JS writes text
   this.TextWriter.cntxt = this.TextWriter.Context;
   this.TextWriter.Context = this.Context;
   this.TextWriter.Write(lbl || this.Specs.LABEL, this.x, this.y, this.Specs.TEXT);
   this.TextWriter.RestoreContext(this.TextWriter.cntxt);
};
GenieButton.prototype.DrawImage = function(offset) {  //offset in Coordinate2D format

   if (offset)
      this.Context.drawImage(this.Pic, this.Specs.SX, this.Specs.SY, this.Specs.W-offset.X, this.Specs.H-offset.Y, this.Specs.L+offset.X, this.Specs.T+offset.Y, this.Specs.W-offset.X, this.Specs.H-offset.Y);
   else
      this.Context.drawImage(this.Pic, this.Specs.SX, this.Specs.SY, this.Specs.W, this.Specs.H, this.Specs.L, this.Specs.T, this.Specs.W, this.Specs.H);
};
/*
GenieButton.prototype.MouseOver = function() {
   this.Context.clearRect(this.Specs.L, this.Specs.Y, this.Specs.W, this.Specs.H);
   this.Context.globalAlpha = 0.9;
   this.Context.drawImage(this.ImageSheet, this.Specs.SX, this.Specs.SY, this.Specs.W, this.Specs.H, this.Specs.L, this.Specs.T, this.Specs.W, this.Specs.H);
   this.Context.globalAlpha = 1.0;
};
*/
/*
GenieButton.prototype.ClickedOn = function() {
//   this.DrawPressed();
//   this.Target.Clicked();

   this.Clicked = true;
};
GenieButton.prototype.CheckClicked = function() {
   this.clicked = this.Clicked;
   this.Clicked = false;
   return (this.clicked);
};
*/
