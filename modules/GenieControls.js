
//--------------------------------------------
//-----------GENIE CONTROL--------------------
var GenieCanvasControl = function() {
   var Context;
   var GraphicsTool;
   var TextWriter;
//   var Type;		this and the one below can be added so that a ::ControlClicked method added to game Scape
//   var Index;		could process all such messages in the same place
   var Left, Top;	//REDUNDANT
   var Width, Height;	//REDUNDANT
   var Specs;
   var ImageSheet;
   var Clicked;
   var Visible;		//REDUNDANT
   var Enabled;
   var ToolTip;

   var clicked, cntxt;	//scratch variables
};
GenieCanvasControl.prototype = {
   Set(canvas, iSheet, specs, gTool, tWriter) {  //i- image
      canvas.RegisterControl(this);
      this.Context = canvas.Context;
      this.GraphicsTool = gTool;
      this.TextWriter = tWriter;
      this.ImageSheet = iSheet;
/* REDUNDANT
      if (specs) {
      if (specs.L) this.Left = specs.L;
      if (specs.T) this.Top = specs.T;
      if (specs.W) this.Width = specs.W;
      if (specs.H) this.Height = specs.H;
      }
      this.Target = target;
*/
      this.Visible = false;		//REDUNDANT
      this.Specs = specs;
      this.Enabled = false;
      this.Clicked = false;
      if (this.Specs)			//here TEMPorarily, will be removed once NFL controls are synced up
      if (this.Specs.TOOLTIP) {
	 this.ToolTip = new GenieToolTip();
	 this.ToolTip.Set(this.Context, this.GraphicsTool, this.TextWriter, this.Specs.TOOLTIP);
      }
   },
   MakeSpecsUnique() {
//      this.OriginalSpecs = this.Specs;
      this.Specs = Object.assign({}, this.Specs);		//UNTESTED!
   },
   Display() {  //to be made REDUNDANT
//      this.Active = true;
      this.Visible = true;
      this.Draw();
      this.Enabled = true;
   },
   Show() {  //TODO: will replace ::Display
      this.Draw();
      this.Enabled = true;
   },
   Enable() {
      this.Context.clearRect(this.Specs.L, this.Specs.T, this.Specs.W, this.Specs.H);
      this.Show();
   },
   Disable() {  //TODO: for most controls, could set opacity to 0.5 in over-riding functions
      this.Enabled = false;
      this.DrawDisabled();
   },
   Hide(colour) {
      this.Enabled = false;
      if (colour) {
	 this.Context.fillStyle = colour;
	 this.Context.fillRect(this.Specs.L, this.Specs.T, this.Specs.W, this.Specs.H);
      } else
	 this.Context.clearRect(this.Specs.L, this.Specs.T, this.Specs.W, this.Specs.H);
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
//      this.Context.clearRect(this.Specs.L, this.Specs.T, this.Specs.W, this.Specs.H);
//      this.Draw();  //NOTE: this effectively switches opacity from 0.9 to 1.0
   },
   MouseUp() {
   },
   ClickedOn() {
      //NOTE: mousedown coordinates need to be checked to see if they were in the same control
      this.Clicked = true;
   },
   CheckClickedOn() {
      if (Utilities.PointInBox( { X: Mouse.ClickX, Y: Mouse.ClickY }, this.Specs))
	 return (true);
      else
	 return (false);
   },
   CheckClicked() {
      this.clicked = this.Clicked;
      this.Clicked = false;
      return (this.clicked);
   },
   DrawDisabled() {
      this.Context.clearRect(this.Specs.L, this.Specs.T, this.Specs.W, this.Specs.H);
      this.Context.globalAlpha = 0.5;
      this.Draw();
      this.Context.globalAlpha = 1.0;
   }
};
/* NOTE: this will have to re-enabled for apps like CRICKET
//Checkbox---------------------
var GenieCheckBox = function() {
   var Id;
   var TextId;
   var Enabled;
   var Checked;
   var AppConsole;
};
GenieCheckBox.prototype = {
   Set : function(Id, txtId, lbl, cnsl) {
      this.Id = Id;
      this.TextId = txtId;
      this.Enabled = true;
      this.Checked = false;
      this.AppConsole = cnsl;

      document.getElementById(txtId).innerHTML = lbl;
      document.getElementById(this.Id).addEventListener("click", this.Clicked.bind(this));
   },
   Clicked : function() {
      if (this.Checked) {
	 this.Checked = false;
	 document.getElementById(this.Id).src = "../modules/checkbox.png";
      } else {
	 this.Checked = true;
	 document.getElementById(this.Id).src = "../modules/checkedbox.png";
      }
//      this.AppConsole.ActiveControls.push(this.Id);
   },
   Enable : function (Event) {
      document.getElementById(this.Id).style.opacity = "1.0";
      document.getElementById(this.TextId).style.opacity = "1.0";
      this.Enabled = true;
   },
   Disable : function (Event) {
      document.getElementById(this.Id).style.opacity = "0.5";
      document.getElementById(this.TextId).style.opacity = "0.5";
      this.Enabled = false;
   }
};
*/
//Button-----------------------
var GenieButton = function() {
   var Id;
   var State;
   var Clicked;
   var AppConsole;
};
GenieButton.prototype = {
   Set : function(Id, cnsl) {
      this.Id = Id;
      this.State = BUTTONSTATE.ENABLED;
      this.Clicked = false;
      this.AppConsole = cnsl;

      document.getElementById(this.Id).style.opacity = "0.9";
      document.getElementById(this.Id).style.boxShadow = "5px 5px 0px grey";
      document.getElementById(this.Id).style.borderRadius = "5px";
      document.getElementById(this.Id).addEventListener("mouseover", this.Entered.bind(this));
      document.getElementById(this.Id).addEventListener("mouseout", this.Exited.bind(this));
      document.getElementById(this.Id).addEventListener("mousedown", this.Pushed.bind(this));
      document.getElementById(this.Id).addEventListener("mouseup", this.Released.bind(this));
   },
   Pushed : function (Event) {
      if (this.State==BUTTONSTATE.ENABLED) {
	 document.getElementById(this.Id).style.boxShadow = "unset";
	 document.getElementById(this.Id).style.transform = "translateY(4px)";
	 this.State = BUTTONSTATE.PUSHED;
	 this.Clicked = true;
	 this.AppConsole.EventQueue.push(this.Id);
      }
   },
   Released : function (Event) {
      if (this.State==BUTTONSTATE.PUSHED) {	//have to check because button may be disabled
	 document.getElementById(this.Id).style.boxShadow = "5px 5px 0px SlateGray";
	 document.getElementById(this.Id).style.transform = "translateY(0px)";
	 this.State = BUTTONSTATE.ENABLED;
      }
   },
   Entered : function(Event) {
      if (this.State==BUTTONSTATE.ENABLED) {
	 document.getElementById(this.Id).style.opacity = "1.0";
      }
   },
   Exited : function(Event) {
      if (this.State!=BUTTONSTATE.DISABLED) {
	 document.getElementById(this.Id).style.opacity = "0.9";
      }
      if (this.State==BUTTONSTATE.PUSHED) {
	 document.getElementById(this.Id).style.boxShadow = "5px 5px 0px SlateGray";
	 document.getElementById(this.Id).style.transform = "translateY(0px)";
	 this.State = BUTTONSTATE.ENABLED;
      }
   },
   Enable : function (Event) {
      document.getElementById(this.Id).style.opacity = "0.9";
      this.State = BUTTONSTATE.ENABLED;
   },
   Disable : function (Event) {
      document.getElementById(this.Id).style.opacity = "0.5";
      this.State = BUTTONSTATE.DISABLED;
   }
};

//-----------Slider-----------------------
//TODO: this probably should be broken into 2 classes depending on whether it is image-based or rendered
var GenieSlider = function() {
   var AppConsole;
   var X, Y;		//location of body, not label, given in left-top coordinates
   var BodyId;
   var ThumbId;		//for simplicity's sake, relative location will be determined sprite size 
   var Label;		//always aligned at top for now
//   var Clicked;
   var Maximum;
   var Increment;	//if 1 (which is default), then basically it is continuous
   var Low, High;
   var TextValues;
   var Orientation;	//horizontal or vertical
   var Specs;		//null if body and thumb have image representations
   var Index;
};
GenieSlider.prototype = {
   Set : function(cnsl, bdyId, thmbId, x, y, tLbl, nMax, incrmnt, tLow, tHigh, valueArray, bOrntd, spcs) {
      this.AppConsole = cnsl;
      this.BodyId = bdyId; this.ThumbId = thmbId;
      this.X = x; this.Y = y;
      this.Label = tLbl;
//      this.Clicked = false;
      this.Maximum = nMax; this.Increment = incrmnt; this.Low = tLow; this.High = tHigh;
      this.Orientation = bOrntd;
      this.TextValues = valueArray;
      this.Specs = spcs;

      this.Index = 0;

      //Have to monitor mouse clicks, up, down and move to enable thumb dragging
      document.getElementById(this.BodyId).addEventListener("click", this.Clicked.bind(this));
   },
   Draw : function() {
      if (this.Body && this.Thumb) {	//not sure about this
//draw body at x,y and thumb depending on index
//write label, high, low and text values
      }
//if bdy and thmb are null, control has to be drawn geometrically
//DrawRect(size given)
//lineTo (Dark Gray)
//lineTo (Medium Gray)
//lineTo (Light Gray)
//draw dark gray L
//draw light gray L
   },
   Clicked : function(event) {
      var leftPos;

      leftPos = parseInt(document.getElementById(this.BodyId).style.left) + event.offsetX;
//      leftPos += parseInt(Math.floor(document.getElementById(this.ThumbId).style.width/2));
      document.getElementById(this.ThumbId).style.left = "" + leftPos + "px";

//Console will get the mouse clicked message, then it can be determined if and where click was based on x, y, size
// valueArray contains strings that are printed to the right of the control depending on selection, array size being
// equal to number of increments
   }
};
//Basically, will be a sprite, and in order to have flexible size, will need 3 components slapped together
// w/ bookmarks being identical, middle one scaled appropriately, and then an additional one for marking steps
// and another one for for the thumb; obviously, will go in console canvas('s)
//can leave things like dragging and vertical orientation for later
//of course, have to have enable/disable

//ALTERNATIVELY,
//---slider---
//horizontal/vertical
//size has to be adjustable, so maybe need a control canvas
//onmousedown: maybe only change colour
//onmousemove: if button pressed, move slider; if stepped, move only if past a tickmark
//onmouseup: change colour

//----------------------------------------------------
//----------GENIE GAUGE (or METER)--------------------
var GenieGauge = function() {
   var Context;
   var X;
   var Y;
   var Width;
   var Height;
   var Colour;
   var Label;
//   var Clicked;
   var Segments;	//if 1 (which is default), then basically it is continuous, else segmented
   var Orientation;	//horizontal or vertical
   var TextValues;
   var Enabled;
   var Filled;		//depending on type, gives amount or percentage filled
};
GenieGauge.prototype = {
   Set : function(cntxt, x, y, wdth, hght, clr, tLbl, sgmnts, bOrntd, tLow, tHigh, valueArray) {
//   Set(cntxt, x, y, specs) {
      this.Context = cntxt;
      this.X = x;
      this.Y = y;
      this.Width = wdth;
      this.Height = hght;
      this.Colour = clr;
      this.Label = tLbl;
//      this.State = BUTTONSTATE.ENABLED;
//      this.Clicked = false;
      this.Segments = sgmnts;
      this.Orientation = bOrntd;
      this.TextValues = valueArray;

      this.Filled = 0;
   },
   Draw : function() {
      var filled;

//drawRects, number equal to segments
// write text values, spacing depending on their number
// draggable thumb, but to be implemented later

      //Draw outline
      this.Context.strokeStyle = "black";
      this.Context.clearRect(this.X, this.Y, this.Width, this.Height);
      this.Context.strokeRect(this.X, this.Y, this.Width, this.Height);

      //Fill
      this.Context.fillStyle = this.Colour;
      filled = (this.Height-2)*(this.Filled/100);
//      this.Context.fillRect(this.X, this.Y+(this.Height-this.Filled), this.X-2, this.Filled);
      this.Context.fillRect(this.X, this.Y+(this.Height-filled), this.Width, filled);
   },
   Fill : function(nmbr) {
//nmbr represents % if not segmented, otherwise number of segments; fill, then call Draw
      this.Filled = nmbr;
      this.Draw();
   },
   Clicked : function() {
//      if (this.Checked) {this.Checked = false;} else {this.Checked = true;}
//      this.AppConsole.ActiveControls.push(this.Id);
   }
};

var TextIndex = function() {var Line, Character; };

//----------SCROLLING TICKER---------------------
var GenieNewsTicker = function() {
   var Context;
   var X, Y, TextY;
   var Width, Height, BorderWidth;
   var BackgroundColour, TextColour;
   var PixelIndex, CharIndex;
   var StringsGap, WrapGap;
   var Separator;
   var Messages;

   var StringsLength;		//this is to avoid constant re-calculation
   var GapWritten;		//-1 indicates are not starting writing w/ gap
   var SeparatorWidth;		//ASSUMPTION: this is less than size of gap
   var BlankSpace;		//useful for gap calculations
//   var State;
//   var Clicked;
//   var Label;
//   var Enabled, ScrollSpeed;
};
GenieNewsTicker.prototype = {
   Set : function(cntxt, specs, messages) {
      var i;
      var textHeight;

      this.Context = cntxt;
      this.X = specs.L; this.Y = specs.T;
      this.Width = specs.W; this.Height = specs.H; this.BorderWidth = specs.BORDER;
      this.BackgroundColour = specs.COLOUR; this.TextColour = specs.TEXT;
      this.StringsGap = specs.GAP; this.WrapGap = specs.WRAP;
      this.Separator = specs.SEPARATOR;
      this.Messages = messages;

      this.PixelIndex = -1;			//just to indicate that nothing has been drawn yet
      this.CharIndex = new TextIndex();
      this.CharIndex.Line = 0; this.CharIndex.Character = 0;
      this.GapWritten = -1;

      //Determine center of display for writing text
      this.Context.font = "12px Arial";
      txtHeight = parseInt(this.Context.font.split(' ')[0].replace('px', ''));	//measure height of text
      this.TextY = this.Y + (this.Height-(this.BorderWidth*2)) + ((this.Height-((this.BorderWidth*2)+txtHeight))/2);

      //Populate strings length array
      this.StringLengths = new Array();
      for (i=0;i<this.Messages.length;++i)
	 this.StringLengths.push(this.Context.measureText(this.Messages[i]).width);

      //Frequently used calculations done once and stored
      this.SeparatorWidth = this.Context.measureText(this.Separator).width;
      this.BlankSpace = (this.StringsGap-this.SeparatorWidth)/2;
   },
   Draw : function() {
      var txtWidth, pxlsWritten, spaceLeft, lineNo;
      var message;
      var bDrawingGap, bImgDrawnFirst;

//TODO: should pause momentarily (maybe 1 sec) before scrolling
//ISSUE: what if entire first string is longer than display width? Would that
//TODO: Scrolling is not totally smooth (occasional jarring) - is happening w/ handling of last character of message
// scrollin off the screen to the left

      //Draw background
      this.Context.fillStyle = this.BackgroundColour;
      this.Context.fillRect(this.X, this.Y, this.Width, this.Height);

      //Setup text for writing
//      this.Context.font = "12px Arial";
      this.Context.fillStyle = this.TextColour;

      //Find location to start writing from
      pxlsWritten = 0;
      txtWidth = 0;
      lineNo = this.CharIndex.Line;
      bDrawingGap = false;
      bImgDrawnFirst = false;
      if (this.PixelIndex==-1) {  //check if text is being written for the very first time
	 txtWidth = Math.round(this.Context.measureText(this.Messages[this.CharIndex.Line]).width);
	 if (txtWidth<=(this.Width-(2*this.BorderWidth)))  {//check if first message fits
	    this.PixelIndex = Math.round((this.Width-txtWidth)/2);
	 } else {
//TODO: message will have to be truncated here
	    this.PixelIndex = 0;
	 }
	 this.Context.fillText(this.Messages[0], this.PixelIndex, this.TextY);
	 pxlsWritten = this.PixelIndex + txtWidth;
	 bDrawingGap = true;					//make sure gap is written next
	 bImgDrawnFirst = true;
	 ++lineNo;
      } else {
	 if (this.GapWritten==-1) {  //first make sure it's not gap writing time
	    message = this.Messages[this.CharIndex.Line].substring(this.CharIndex.Character);
	    txtWidth = Math.round(this.Context.measureText(message).width);
//TODO: truncate message if necessary
	    this.Context.fillText(message, this.PixelIndex, this.TextY);
	    pxlsWritten = this.PixelIndex + txtWidth;

	    //Update indices if necessary
	    if (this.PixelIndex==0) {  //check if have reached left of ticker
	       txtWidth = this.Context.measureText(this.Messages[this.CharIndex.Line].charAt(this.CharIndex.Character)).width;
               this.PixelIndex += Math.round(txtWidth);
	       ++this.CharIndex.Character;  //start writing at next character
	       if (this.CharIndex.Character==this.Messages[this.CharIndex.Line].length) {  //see if out of characters

	       //Set up next line to be written
	       this.CharIndex.Character = 0;
	       if (this.CharIndex.Line==(this.Messages.length-1))	//check if this was the last string
		  this.CharIndex.Line = 0;
	       else
		  ++this.CharIndex.Line;
	       this.GapWritten = 50;
	       }
	    }
	    bDrawingGap = true;					//make sure gap is written next
	    bImgDrawnFirst = true;
	    ++lineNo;
	 } else {
	    //Write appropriate portion of gap
	    if (this.GapWritten>=(this.BlankSpace+this.SeparatorWidth))  //check if there is space to draw separator
	       this.Context.fillText(this.Separator,this.GapWritten-(this.BlankSpace+this.SeparatorWidth), this.TextY);
	    pxlsWritten = this.GapWritten;

	    --this.GapWritten;
            bDrawingGap = false;
	 }
      }

      //Writing further messages, draw gaps and separators
      while (pxlsWritten<this.Width) {
	 if (lineNo==this.Messages.length)	//check if last string has been drawn
	    lineNo = 0;
	 spaceLeft = this.Width - pxlsWritten;
	 if (bDrawingGap) {
	    if (spaceLeft>=(this.BlankSpace+this.SeparatorWidth))
	       this.Context.fillText(this.Separator, pxlsWritten + ((this.StringsGap-this.SeparatorWidth)/2), this.TextY);
//	    } else if (spaceLeft<=this.BlankSpace) {
	    pxlsWritten += this.StringsGap;
	    bDrawingGap = false;
	 } else {
	    if (bImgDrawnFirst)
	       message = this.Messages[lineNo];
	    else
	       message = this.Messages[lineNo].substring(this.CharIndex.Character);

	    //See if current message fits
	    txtWidth = this.Context.measureText(message).width;
//TODO: truncate message if necessary
//	    if (spaceLeft>txtWidth) {
//	       message = this.Messages[this.CharIndex.Line];
//	       if (spaceLeft>(txtWidth+this.StringsGap))
//		  if (lineNo==(this.Messages.length-1))	//check if this was the last string
//		     lineNo = 0;
//		  else
		     ++lineNo;
//	    } else {
	       //First truncate message to avoid overflow
//	       message = this.Messages[this.CharIndex.Line].substring(this.CharIndex.Character);
//	    }
	    this.Context.fillText(message, pxlsWritten, this.TextY);
	    pxlsWritten += Math.round(txtWidth);
	    bDrawingGap = true;
	 }
      }

      if (this.PixelIndex!=0)
	 --this.PixelIndex;

      //Draw border
      this.Context.lineWidth = this.BorderWidth;
      this.Context.strokeRect(this.X+(this.BorderWidth/2), this.Y+(this.BorderWidth/2), this.Width-this.BorderWidth, this.Height-this.BorderWidth);
   },
   Flash : function(mssg) {		//stop scrolling, if mssg==NULL, flash whatever was on the screen
   },
   Clicked : function() {		//this might need to be over-ridden by app depending on what is needed
   }
};

//----------------------------------------
//----------GENIE TABLE-------------------	//TODO: entries are column-wise (up-down); need row-wise option as well
var GenieTable = function() {  //this is a clickable table, possibly with bas-relief buttons
   var Context;
   var GraphicsTool;
   var Rows, Columns;			//leaving these attributes in, in case
   var ColumnWidth, RowHeight;		// they are not given in specs and are
   var RowGap, ColumnGap;		// set in code, or are dynamically re-sizes
   var Style;
   var IrregularColumns;		//unless this is true, all columns are of the same width; will expect various
					// widths stated in specs
};
GenieTable.prototype = new GenieCanvasControl();
GenieTable.prototype.Set = function(cnvs, gtool, specs, irregularCols) {
   GenieCanvasControl.prototype.Set.call(this, cnvs, specs);

   this.GraphicsTool = gtool;
   this.IrregularColumns = irregularCols ? true : false;

   //Calculate width and height from other specs if not specified
   if (!this.Width)
      this.Width = CONFERENCeTABLE.C*(CONFERENCeTABLE.CW+CONFERENCeTABLE.CG);
   if (!this.Height)
      this.Height = CONFERENCeTABLE.R*(CONFERENCeTABLE.RH+CONFERENCeTABLE.RG);
};
GenieTable.prototype.GetFormat = function() {
   var numRows, numCols;
   var rowGap, colGap;
   var rowHeight, colWidth;

   numRows = this.Rows ? this.Rows : this.Specs.R;
   numCols = this.Columns ? this.Columns : this.Specs.C;
   rowHeight = this.RowHeight ? this.RowHeight : this.Specs.RH;
   colWidth = this.ColumnWidth ? this.ColumnWidth : this.Specs.CW;
   rowGap = this.RowGap ? this.RowGap : this.Specs.RG;
   colGap = this.ColumnGap ? this.ColumnGap : this.Specs.CG;

   return ( { rows: numRows, cols: numCols, rHeight: rowHeight, cWidth: colWidth, rGap: rowGap, cGap: colGap } );
};
GenieTable.prototype.RevertToSpecs = function() {	//ISSUE: should have a base function in base class for L, T, W, H
};
GenieTable.prototype.Draw = function(x, y) {
   //ISSUE: dummy function to make work with current GenieCanvasControl format
};
GenieTable.prototype.Display = function(x, y) {
   var style;

   GenieCanvasControl.prototype.Display.call(this);

   this.Left = x ? x : this.Left;
   this.Top = y ? y : this.Top;
   if (this.Style)
      style = this.Style;
   else
      style = this.Specs.S ? this.Specs.S : STYLE.WIReFRAME;
   switch (style) {
      case STYLE.WIReFRAME:
	 this.DrawWireFrame(this.Left, this.Top);
	 break;
      case STYLE.BAsRELIEF:
	 this.DrawBasRelief(this.Left, this.Top);
	 break;
   }
};
GenieTable.prototype.DrawWireFrame = function(x, y) {
};
GenieTable.prototype.DrawBasRelief = function(x, y) {
   var i, j;
   var left, top;
   var format;

   format = this.GetFormat();
   for (i=0;i<format.cols;++i)
      for (j=0;j<format.rows;++j) {
	 left = x + ((format.cWidth+format.cGap)*i);
	 top = y + (format.rHeight+format.rGap)*j;
	 this.GraphicsTool.GOL.BasRelief.DrawRectangle(left, top, format.cWidth, format.rHeight);
      }
};
GenieTable.prototype.Populate = function(entries) {
   var i;
   var x, y;
   var yOffset;
   var format;
   var row, col;

   format = this.GetFormat();
   row = 0;
   col = 0;
   yOffset = (format.rHeight + parseInt(this.Context.font.split(' ')[0].replace('px', '')))/2;
   for (i=0;i<entries.length;++i) {
      if (row==4) {
	 ++col;
	 row = 0;
      }
      x = this.Left + ((format.cWidth+format.cGap)*col);
      x += Math.round((format.cWidth-this.Context.measureText(entries[i]).width)/2);
      y = this.Top + ((format.rHeight+format.rGap)*row) + yOffset;
      this.Context.fillStyle = "black";
      this.Context.fillText(entries[i], x, y);
      ++row;
   }
};
GenieTable.prototype.GetEntryCoords = function(nEntry) {  //returns top-left coordinates of entry's box
   var x, y;
   var row, col;
   var format;

   format = this.GetFormat();
//   row = Math.floor(nEntry/format.rows);
//   col = nEntry % format.cols;
   row = nEntry % format.rows;
   col = Math.floor(nEntry/format.cols);
   x = this.Left + col*(format.cWidth+format.cGap);
   y = this.Top + row*(format.rHeight+format.rGap);

   return ( { X: x, Y: y } );
};
GenieTable.prototype.Clicked = function() {
   var row, col;
   var x, y;
   var format;

   GenieCanvasControl.prototype.Clicked.call(this);

   x = Mouse.ClickX - this.Left;
   y = Mouse.ClickY - this.Top;

   //Determine row and column number clicked on
   row = -1;
   if (this.IrregularColumns) {
   } else {
      format = this.GetFormat();
      if (y % (format.rHeight+format.rGap) <= format.rHeight)
	 row = Math.floor(y/(format.rHeight+format.rGap));
      if (x % (format.cWidth+format.cGap) <= format.cWidth)
	 col = Math.floor(x/(format.cWidth+format.cGap));
   }

   if ((row>=0) && this.EntryClicked) {
      x = this.Left+((format.cWidth+format.cGap)*col);
      y = this.Top+((format.rHeight+format.rGap)*row);
      this.GraphicsTool.GOL.BasRelief.DrawRectangle(x, y, format.cWidth, format.rHeight, null, true);
      this.EntryClicked(row, col);
   }
};
