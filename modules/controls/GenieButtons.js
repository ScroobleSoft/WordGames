/*
 *  could also have a TextButton and PictureButton sub-classes, difference being in DrawLabel call
 */
//--------------------------------------------
//---------- CANVAS BUTTON -------------------
var CanvasButton = function() {
};
CanvasButton.prototype = new GenieCanvasControl();
CanvasButton.prototype.Set = function(cnvs, iSheet, specs, tWriter) {  //i- image
   GenieCanvasControl.prototype.Set.call(this, cnvs, iSheet, specs, null, tWriter);

};
CanvasButton.prototype.Draw = function(pressed) {
   var offset;

   this.Context.clearRect(this.Specs.L-2, this.Specs.T-2, this.Specs.W+2, this.Specs.H+2);
   this.Context.lineWidth = 1.0;	//NOTE: cannot assume it will always be 1.0 when app starts
   if (pressed) {
      this.Context.strokeStyle = this.Specs.COLOUR3 || GREY.MOCHA;
      this.Context.strokeRect(this.Specs.L-1.5, this.Specs.T-1.5, this.Specs.W, this.Specs.H);
      this.Context.strokeStyle = this.Specs.COLOUR4 || GREY.MEDIUM;
      this.Context.strokeRect(this.Specs.L-0.5, this.Specs.T-0.5, this.Specs.W, this.Specs.H);
      this.Context.strokeStyle = this.Specs.COLOUR2 || GREY.LIGHT;
      this.Context.strokeRect(this.Specs.L+0.5, this.Specs.T+0.5, this.Specs.W, this.Specs.H);
      this.Context.strokeStyle = this.Specs.COLOUR1 || "white";
      this.Context.strokeRect(this.Specs.L+1.5, this.Specs.T+1.5, this.Specs.W, this.Specs.H);
//      offset = 0;
   } else {
      this.Context.strokeStyle = this.Specs.COLOUR1 || "white";
      this.Context.strokeRect(this.Specs.L-1.5, this.Specs.T-1.5, this.Specs.W, this.Specs.H);
      this.Context.strokeStyle = this.Specs.COLOUR2 || GREY.LIGHT;
      this.Context.strokeRect(this.Specs.L-0.5, this.Specs.T-0.5, this.Specs.W, this.Specs.H);
      this.Context.strokeStyle = this.Specs.COLOUR3 || GREY.MOCHA;
      this.Context.strokeRect(this.Specs.L+1.5, this.Specs.T+1.5, this.Specs.W, this.Specs.H);
      this.Context.strokeStyle = this.Specs.COLOUR4 || GREY.MEDIUM;
      this.Context.strokeRect(this.Specs.L+0.5, this.Specs.T+0.5, this.Specs.W, this.Specs.H);
//      offset = 2;
   }
   offset = 0;
   this.Context.fillStyle = this.Specs.COLOUR || "lightgrey";
   this.Context.fillRect(this.Specs.L, this.Specs.T, this.Specs.W, this.Specs.H);
/*
   if (pressed) {
      if (this.Specs.LABEL)
	 this.WriteLabel();
      else
	 this.Context.drawImage(this.ImageSheet, this.Specs.SX, this.Specs.SY, this.Specs.W-2, this.Specs.H-2, this.Specs.L+2, this.Specs.T+2, this.Specs.W-2, this.Specs.H-2);
   } else {
      if (this.Specs.LABEL)
	 this.WriteLabel();
      else
	 this.Context.drawImage(this.ImageSheet, this.Specs.SX, this.Specs.SY, this.Specs.W, this.Specs.H, this.Specs.L, this.Specs.T, this.Specs.W, this.Specs.H);
   }
*/
   if (this.ImageSheet) {
      if (this.Specs.LABEL) {
	 this.Context.drawImage(this.ImageSheet, this.Specs.SX, this.Specs.SY, this.Specs.H-offset, this.Specs.H-offset, this.Specs.L+offset, this.Specs.T+offset, this.Specs.H-offset, this.Specs.H-offset);
	 this.WriteLabel(this.Specs.H+3);
      } else
	 this.Context.drawImage(this.ImageSheet, this.Specs.SX, this.Specs.SY, this.Specs.W-offset, this.Specs.H-offset, this.Specs.L+offset, this.Specs.T+offset, this.Specs.W-offset, this.Specs.H-offset);
   } else
      this.WriteLabel();
};
CanvasButton.prototype.DrawPressed = function() {
//   this.Draw("lightgrey", "white");
   this.Draw(true);
/*
   this.Context.clearRect(this.Specs.L-1, this.Specs.T-1, this.Specs.W+2, this.Specs.H+2);
   this.Context.strokeStyle = "white";
   this.Context.strokeRect(this.Specs.L+1, this.Specs.T+1, this.Specs.W, this.Specs.H);
   this.Context.strokeStyle = "grey";
   this.Context.strokeRect(this.Specs.L-1, this.Specs.T-1, this.Specs.W, this.Specs.H);
   this.Context.fillStyle = "lightgrey";
   this.Context.fillRect(this.Specs.L, this.Specs.T, this.Specs.W, this.Specs.H);
   this.Context.drawImage(this.ImageSheet, this.Specs.SX, this.Specs.SY, this.Specs.W, this.Specs.H, this.Specs.L, this.Specs.T, this.Specs.W, this.Specs.H);
*/
};
CanvasButton.prototype.MouseDown = function() {
   GenieCanvasControl.prototype.MouseDown.call(this);

   this.DrawPressed();
};
CanvasButton.prototype.MouseUp = function() {
   GenieCanvasControl.prototype.MouseUp.call(this);

   this.Draw();
};
CanvasButton.prototype.WriteLabel = function(offset) {
   var x, y;

   //Centre horizontally (unless otherwise specified via 'offset')
   x = this.Specs.L;
   if (offset)
      x += offset;
   else
      x += Math.round((this.Specs.W-this.Context.measureText(this.Specs.LABEL).width)/2);

   //Centre vertically
   y = parseInt(this.Context.font.split(' ')[0].replace('px', ''));		//get height of font
   y += Math.round((this.Specs.H-y)/2);						//add padding
   y += this.Specs.T;
   y -= 1;									//this appears to be necessary because of how JS write text
   this.TextWriter.cntxt = this.TextWriter.Context;
   this.TextWriter.Context = this.Context;
   this.TextWriter.Write(this.Specs.LABEL, x, y, this.Specs.TEXT);
   this.TextWriter.RestoreContext(this.TextWriter.cntxt);
};
CanvasButton.prototype.Hide = function(colour) {
   this.Enabled = false;
   if (colour) {
      this.Context.fillStyle = colour;
      this.Context.fillRect(this.Specs.L-2, this.Specs.T-2, this.Specs.W+4, this.Specs.H+4);
   } else
      this.Context.clearRect(this.Specs.L-2, this.Specs.T-2, this.Specs.W+4, this.Specs.H+4);
};
CanvasButton.prototype.Enable = function() {
   this.Context.clearRect(this.Specs.L-2, this.Specs.T-2, this.Specs.W+4, this.Specs.H+4);
   this.Show();
};
CanvasButton.prototype.DrawDisabled = function() {
   this.Context.clearRect(this.Specs.L-2, this.Specs.T-2, this.Specs.W+4, this.Specs.H+4);
   this.Context.globalAlpha = 0.5;
   this.Draw();
   this.Context.globalAlpha = 1.0;
};
/*
CanvasButton.prototype.MouseOver = function() {
   this.Context.clearRect(this.Specs.L, this.Specs.Y, this.Specs.W, this.Specs.H);
   this.Context.globalAlpha = 0.9;
   this.Context.drawImage(this.ImageSheet, this.Specs.SX, this.Specs.SY, this.Specs.W, this.Specs.H, this.Specs.L, this.Specs.T, this.Specs.W, this.Specs.H);
   this.Context.globalAlpha = 1.0;
};
*/
/*
CanvasButton.prototype.ClickedOn = function() {
//   this.DrawPressed();
//   this.Target.Clicked();

   this.Clicked = true;
};
CanvasButton.prototype.CheckClicked = function() {
   this.clicked = this.Clicked;
   this.Clicked = false;
   return (this.clicked);
};
*/

//------------------------------------------
//---------- PUSH BUTTON -------------------
var CanvasPushButton = function() {
};
CanvasPushButton.prototype = new CanvasButton();
