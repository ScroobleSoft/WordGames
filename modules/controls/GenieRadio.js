/*
 *  TODO (MAJOR): don't need to have separate specs for radio controls - instead could list options in specs
 *  actually, on second thoughts, remembered that implemented it this way to allow for irregular spacing between options
 *  so, will keep this, and provide default horizontal and vertical options via main Specs ( { OPTIONS: [ "label", "label" ] } )
 *  will also need to specify GAP in specs, and some calculations will have to be made with font and length of title
 */
//---------------------------------------------------
//---------- GENIE RADIO CONTROL --------------------
var GenieRadioControl = function() {
   var Index;		//unused and so REDUNDANT at the moment
   var Selected;
   var Group;
   var ImageWidth;
};
GenieRadioControl.prototype = new GenieCanvasControl();
GenieRadioControl.prototype.Set = function(canvas, iSheet, specs, tWriter, indx, group) {
   GenieCanvasControl.prototype.Set.call(this, canvas, iSheet, specs, null, tWriter);

   this.Index = indx;
   this.Group = group;
   this.ImageWidth = this.Specs.W;
   this.Specs.W += (3 + this.Context.measureText(this.Specs.LABEL).width);
};
GenieRadioControl.prototype.Draw = function() {
   this.DrawControl();
   this.TextWriter.Context = this.Context;
   this.TextWriter.Write(this.Specs.LABEL, this.Specs.L+this.ImageWidth+3, this.Specs.T+this.Specs.H);
   this.TextWriter.RestoreContext();
};
GenieRadioControl.prototype.DrawControl = function() {

   if (this.Specs.BACKGROUND) {
      this.Context.fillStyle = this.Specs.BACKGROUND;
      this.Context.fillRect(this.Specs.L, this.Specs.T, this.ImageWidth, this.Specs.H);
   } else
      this.Context.clearRect(this.Specs.L, this.Specs.T, this.ImageWidth, this.Specs.H);

   if (this.Selected)
      this.Context.drawImage(this.ImageSheet, this.Specs.SX+this.ImageWidth+this.Specs.O, this.Specs.SY, this.ImageWidth, this.Specs.H, this.Specs.L, this.Specs.T, this.ImageWidth, this.Specs.H);
   else
      this.Context.drawImage(this.ImageSheet, this.Specs.SX, this.Specs.SY, this.ImageWidth, this.Specs.H, this.Specs.L, this.Specs.T, this.ImageWidth, this.Specs.H);
};
GenieRadioControl.prototype.Select = function() {
   this.Selected = true;
   this.Group.DeselectCurrentOption();
   this.Group.OptionSelected = this;
   this.DrawControl();
};
GenieRadioControl.prototype.Deselect = function() {
   this.Selected = false;
   this.Group.OptionSelected = null;
   this.DrawControl();
};
GenieRadioControl.prototype.ClickedOn = function() {
   if (!this.Selected)
      this.Select();
};

//-------------------------------------------------
//---------- GENIE RADIO GROUP --------------------
var GenieRadioGroup = function() {
   var Options;
   var OptionSelected;
};
GenieRadioGroup.prototype = new GenieCanvasControl();
GenieRadioGroup.prototype.Set = function(specs, canvas, tWriter) {
   var i;
   var specs;

   GenieCanvasControl.prototype.Set.call(this, canvas, null, specs, null, tWriter);

   if (this.Specs.LABELS) {
      this.Options = new Array(this.Specs.LABELS.length);
      for (i=0;i<this.Options.length;++i) {
	 this.Options[i] = new GenieRadioControl();
	 specs = { L: this.Specs.L+5, T: this.Specs.T+5+(15*i), LABEL: this.Specs.LABELS[i] };
	 specs = Object.assign({}, specs, GENIeRADIoCONTROL);
	 this.Options[i].Set(canvas, ImageManager.Pics[IMAGeINDEX.GENIeCONTROLS], specs, this.TextWriter, i, this);
      }
   } else {
      this.Options = new Array(arguments.length-3);
      for (i=3;i<arguments.length;++i) {
	 this.Options[i-3] = arguments[i];
	 this.Options[i-3].Index = i-3;
	 this.Options[i-3].Group = this;
      }
   }

   if (this.Specs.SELECTION)
      this.OptionSelected = this.Options[this.Specs.SELECTION];
   else
      this.OptionSelected = this.Options[0];
   this.OptionSelected.Selected = true;
};
GenieRadioGroup.prototype.Draw = function() {
   var i;

   if (this.Specs.TITLE) {
      this.TextWriter.Context = this.Context;
      this.TextWriter.Write(this.Specs.TITLE, this.Specs.L, this.Specs.T);
      this.TextWriter.RestoreContext();
   }
   for (i=0;i<this.Options.length;++i)
      this.Options[i].Draw();
};
GenieRadioGroup.prototype.Display = function() {
   GenieCanvasControl.prototype.Display.call(this);

   this.Options.forEach(function(option){option.Enabled = true;});
};
GenieRadioGroup.prototype.DeselectCurrentOption = function() {
   if (!(this.OptionSelected==null))
      this.OptionSelected.Deselect();
};
GenieRadioGroup.prototype.Show = function() {
   GenieCanvasControl.prototype.Show.call(this);

   this.Options.forEach(function(optn){optn.Enabled = true;});
};
GenieRadioGroup.prototype.Hide = function() {
   GenieCanvasControl.prototype.Hide.call(this);

   this.Context.clearRect(this.Specs.L, this.Specs.T-15, this.Specs.W, (15*(this.Options.length+1))+5);
    //HARD-CODED - may need to measure font size, or check specs
};
/*
//-------------------------------------------------
//---------- GENIE RADIO GROUP --------------------
var GenieRadioGroup = function() {
   var OptionSelected;
   var OptionBoxes;
   //in specs will need orientation, spacing, labels, label of an execute button, sprite

   var i;
};
GenieRadioGroup.prototype = new GenieCanvasControl();
GenieRadioGroup.prototype.Set = function(canvas, iSheet, specs, tWriter) {
   GenieCanvasControl.prototype.Set.call(this, canvas, iSheet, specs, null, tWriter);

   this.OptionSelected = 0;	//NOTE: defaults to first option
   if (this.Specs.SPRITE)
      this.Sprite = SpriteList[this.Specs.SPRITE];
   this.SetOptionBoxes();
};
GenieRadioGroup.prototype.SetOptionBoxes = function() {  //NOTE: implemented only for VERTICAl orientation and sprite use
   var i;

   this.OptionBoxes = Utilities.CreateArray(this.Specs.OPTIONS, Coordinate2D);
   for (i=0;i<this.Specs.OPTIONS;++i) {
      this.OptionBoxes[i].L = this.Specs.L + this.Specs.GAP;
      this.OptionBoxes[i].T = this.Specs.T + ((this.Specs.GAP*(i+1))+(this.Sprite.H*i));
      this.OptionBoxes[i].W = this.Sprite.W;
      this.OptionBoxes[i].H = this.Sprite.H;
   }
};
GenieRadioGroup.prototype.Draw = function() {  //TODO: in the future, want to have the option of using GraphicsTool vs sprite
   for (this.i=1;this.i<=this.Specs.OPTIONS;++this.i)
      if (this.OptionSelected==this.i)
	 this.Sprite.Draw(this.Specs.L+this.Specs.GAP, this.Specs.T+(this.Specs.GAP*this.i), 1);
      else
	 this.Sprite.Draw(this.Specs.L+this.Specs.GAP, this.Specs.T+(this.Specs.GAP*this.i), 0);
};
GenieRadioGroup.prototype.ClickedOn = function() {
   var i;

   GenieCanvasControl.prototype.ClickedOn.call(this);

   if (this.Clicked) {
      this.Clicked = false;
      for (i=0;i<this.Specs.OPTIONS;++i)
	 if (Utilities.PointInBox(Mouse.GetClickCoordinates(), this.OptionBoxes[i])) {
	    this.OptionSelected = i;
	    break;
	 }
   }
};
GenieRadioGroup.prototype.SelectOption = function() {
};
GenieRadioGroup.prototype.DeselectCurrentOption = function() {

   //UNLOGGED

};
*/
