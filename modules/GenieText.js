
//NOTE: one major difference beween GenieDialog and GenieText is latter only writes one line (former is for paragraphs)

//--------------------------------------
//---------- GENIE TEXT ----------------
var GenieText = function() {
   var Context;
   var Screen;
   var InfoBox;
   var ControlPanel;
   var Specs;

   var cntxt;		//scratch variables
};
GenieText.prototype = {
   Set(cntxt, specs, iBox, cPanel) {		//TODO: break this up into ::Set and SetLinks
      this.Context = cntxt;
      this.Screen = cntxt;
      this.InfoBox = iBox;
      this.ControlPanel = cPanel;
      this.Specs = specs || TEXT;
      if (!this.Specs.FONT)
	 this.Specs.FONT = TEXT.FONT;
      if (!this.Specs.COLOUR)
	 this.Specs.COLOUR = TEXT.COLOUR;
   },
   SetContext(cntxt) {
      this.Context = cntxt;
   },
   SwitchContext(cnvs) {
      switch (cnvs) {
	 case CANVAS.PRIME:
	    this.Context = this.Screen;
	    break;
	 case CANVAS.ZOOM:
	    this.Context = this.InfoBox;
	    break;
	 case CANVAS.CONSOLE:
	    this.Context = this.ControlPanel.Canvas.Context;
	    break;
      }
   },
   RestoreContext(cntxt) {
      if (cntxt)
	 this.Context = cntxt;
      else
	 this.Context = this.Screen;
   },
   Write(strng, x, y, specs, cnvs) {
      var tLength;  //t- text

      //Switch context if thus specified
      if (cnvs) {	//ASSUMPTION: cnvs is passed only if writing to Info Box or Control Panel
	 this.cntxt = this.Context;
	 switch (cnvs) {
	    case CANVAS.PRIME:
	       this.Context = this.Screen;
	       break;
	    case CANVAS.ZOOM:
	       this.Context = this.InfoBox;
	       break;
	    case CANVAS.CONSOLE:
	       this.Context = this.ControlPanel.Canvas.Context;
	       break;
	 }
      }

      if (specs) {
	 this.Context.font = specs.FONT || this.Specs.FONT;
	 this.Context.fillStyle = specs.COLOUR || this.Specs.COLOUR;
	 if (specs.STYLE) {
	    if (specs.STYLE & FONtSTYLE.BOLD)
	       this.Context.font = "bold " + this.Context.font;
	    if (specs.STYLE & FONtSTYLE.ITALICS)
	       this.Context.font = "italic " + this.Context.font;
	    if (specs.STYLE & FONtSTYLE.UNDERLINED) {
	       tLength = this.Context.measureText(strng).width;
	       this.Context.beginPath();
	       this.Context.strokeStyle = "black";
	       this.Context.lineWidth = 2;
	       this.Context.moveTo(x, y+4);
	       this.Context.lineTo(Math.round(x+tLength), y+4);
	       this.Context.stroke();
	       this.Context.closePath();
	    }
	 }
      } else {
	 this.Context.font = this.Specs.FONT;
	 this.Context.fillStyle = this.Specs.COLOUR;
      }
      this.Context.fillText(strng, x, y);

      //Restore original settings
      this.Context.font = this.Specs.FONT;
      this.Context.fillStyle = this.Specs.COLOUR;
      if (this.cntxt) {
	 this.Context = this.cntxt;
	 this.cntxt = null;
      }
   },
   WriteArray(aStrng, x, y, specs, cnvs) {
      //TODO: spacing is the only issue, delineated in specs with a default behaviour
   }
};
