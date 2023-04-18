
//----------------------------------------------
//----------- GENIE CONTROL --------------------
var GenieControl = function() {
   var Context;
   var GraphicsTool, TextWriter;
   var Specs;
   var Pic;
   var Clicked, MouseDowned;
   var Enabled;
   var ToolTip;

   var i, x, y, rct, clicked;		//TODO: nearly 100% sure 'clicked' is REDUNDANT
};
GenieControl.prototype = {
   Set(canvas, specs, img) {
      canvas.RegisterControl(this);
      this.Context = canvas.Context;
      this.Specs = specs;
      this.Pic = img;
      this.Enabled = false;
      this.MouseDowned = false;
      this.Clicked = false;
      if (this.Specs.TOOLTIP) {
	 this.ToolTip = new GenieToolTip();
	 this.ToolTip.Set(this.Context, this.GraphicsTool, this.TextWriter, this.Specs.TOOLTIP);
      }
   },
   SetLinks(gTool, tWriter) {

      this.GraphicsTool = gTool;
      this.TextWriter = tWriter;
   },
   MakeSpecsUnique() {

      this.Specs = Object.assign({}, this.Specs);		//UNTESTED!
   },
   Erase(colour) {

      if (colour) {
	 this.Context.fillStyle = colour;
	 this.Context.fillRect(this.Specs.L, this.Specs.T, this.Specs.W, this.Specs.H);
      } else {
	 if (this.Specs.BACKGROUND) {
	    this.Context.fillStyle = this.Specs.BACKGROUND;
	    this.Context.fillRect(this.Specs.L, this.Specs.T, this.Specs.W, this.Specs.H);
	 } else
	    this.Context.clearRect(this.Specs.L, this.Specs.T, this.Specs.W, this.Specs.H);
      }
   },
   Show() {

      this.Draw();
      this.Enabled = true;
   },
   Hide(colour) {  //TODO: should have the option as in ::DrawDisabled to state colour in specs

      this.Enabled = false;
      this.Erase(colour);
   },
   Enable() {

      this.Show();
   },
   Disable() {  //TODO: for most controls, could set opacity to 0.5 in over-riding functions

      this.Enabled = false;
      this.DrawDisabled();
   },
   MouseOver() {
/*
      this.Context.clearRect(this.Specs.L, this.Specs.T, this.Specs.W, this.Specs.H);
      this.Context.globalAlpha = 0.8;
      this.Draw();
      this.Context.globalAlpha = 1.0;
*/
   },
   MouseOut() {
//      this.Draw();
   },
   MouseDown() {

      //UNLOGGED

//      this.Context.clearRect(this.Specs.L, this.Specs.T, this.Specs.W, this.Specs.H);
//      this.Draw();  //NOTE: this effectively switches opacity from 0.9 to 1.0

      this.MouseDowned = true;
   },
   MouseUp() {
   },
   ClickedOn() {
      //NOTE: mousedown coordinates need to be checked to see if they were in the same control
      this.Clicked = true;
   },
   CheckClickedOn() {  //to be REDUNDANT

      if (Utilities.CheckPointInBox( { X: Mouse.Click.X, Y: Mouse.Click.Y }, this.Specs))
	 return (true);
      else
	 return (false);
   },
   CheckClicked() {

      if (!this.Clicked)
	 return (false);
      else {
	 this.Clicked = false;
	 return (true);
      }
   },
   CheckMouseDown() {

      if (!this.MouseDowned)
	 return (false);
      else {
	 this.MouseDowned = false;
	 return (true);
      }
   },
   DrawDisabled() {

      this.Context.globalAlpha = 0.5;
      this.Draw();
      this.Context.globalAlpha = 1.0;
   }
};
