
//-------------------------------------------------------
//----------COORDINATE DATA STRUCTURES-------------------

//--2D--
var Coordinate2D = function() {var X, Y;};
Coordinate2D.prototype.Set = function(x, y) { this.X = x; this.Y = y; };
Coordinate2D.prototype.RoundOff = function() { this.X = Math.round(this.X); this.Y = Math.round(this.Y); };
Coordinate2D.prototype.Copy = function(crds) { this.X = crds.X; this.Y = crds.Y; };

//--3D--
var Coordinate3D = function() {var X, Y, Z;};
Coordinate3D.prototype.Set = function(x, y, z) { this.X = x; this.Y = y; this.Z = z; };
Coordinate3D.prototype.Rotate = function(angl) {
   var x, y, z;

   x = this.X*Math.cos(angl.Y)*Math.cos(angl.Z) + this.Z*Math.sin(angl.Y) - this.Y*Math.sin(angl.Z);
   y = this.Y*Math.cos(angl.Z)*Math.cos(angl.X) + this.X*Math.sin(angl.Z) - this.Z*Math.sin(angl.X);
   z = this.Z*Math.cos(angl.X)*Math.cos(angl.Y) + this.Y*Math.sin(angl.X) - this.X*Math.sin(angl.Y);
   this.X = x;
   this.Y = y;
   this.Z = z;
};

//---------------------------------------
//----------GENIE RECT-------------------
var GenieRect = function() {
   var L, T, W, H;
   var Context;
   var GraphicsTool;
   var Colour, LineWidth, Style, Angle, Opacity;
};
GenieRect.prototype = {
   Set(lft, top, wdth, hght) {
      this.L = lft;
      this.T = top;
      this.W = wdth;
      this.H = hght;
   },
   SetLinks(cntxt, gTool) {
      this.Context = cntxt;
      this.GraphicsTool = gTool;
   },
   SetFromRect(rect) {
      this.L = rect.L;
      this.T = rect.T;
      this.W = rect.W;
      this.H = rect.H;
   },
   Copy(rect) {		//TODO: make ::SetFromRect REDUNDANT
      this.L = rect.L;
      this.T = rect.T;
      this.W = rect.W;
      this.H = rect.H;
   },
   SetSpecs(colour, lineWidth, style, angle, opcty) {
      this.Colour = colour;
      this.LineWidth = lineWidth;
      this.Style = style;
      this.Angle = angle;
      this.Opacity = opcty;
   },
   SetFromSpecs(specs) {
      this.Colour = specs.COLOUR;
      this.LineWidth = specs.THICKNESS;
      this.Style = specs.STYLE;
      this.Angle = specs.A;
      this.Opacity = specs.OPACITY;
   },
   Inside(x, y) {
      if(((x>=this.L)&&(x<=(this.L+this.W)))&&((y>=this.T)&&(y<=(this.T+this.H))))
	 return true;
      else
	 return false;
   },
   CheckInside(x, y) {
      return (this.Inside(x, y));
   },
   Draw(colour, lineWidth, style, angle, opcty) {
      colour = colour || this.Colour;
      lineWidth = lineWidth || this.LineWidth;
      style = style || this.Style;
      angle = angle || this.Angle;
      opcty = opcty || this.Opacity;
      if (this.Context)
	 this.GraphicsTool.SwitchContext(this.Context);
      this.GraphicsTool.DrawRectangle(this.L, this.T, this.W, this.H, colour, lineWidth, style, angle, opcty);
      this.GraphicsTool.RestoreContext();
   },
   Normalize(lft, top, rght, bttm) {

      if (this.L<lft)  this.L = lft;
      if (this.T<top)  this.T = top;
      if (this.L>rght) this.L = rght;
      if (this.T>bttm) this.T = bttm;
   }
};

//-----------------------------------------------
//---------- OLD GENIE SHAPE --------------------
var OldGenieShape = function() {
   var X, Y;
   var Size;
   var Colour;
   var Style;
   var ContourLineWidth;
   var Opacity;
   var GraphicsTool;
};
OldGenieShape.prototype.Set = function(size, colour, lnWdth, style, opcty) {
   if (size) this.Size = size;
   this.Colour = colour ? colour : "black";
   this.Style = style ? style : STYLE.WIReFRAME;
   if (lnWdth==null)
      this.ContourLineWidth = 1;
   else
      this.ContourLineWidth = lnWdth;
   this.Opacity = opcty;
};
OldGenieShape.prototype.SetLinks = function(gTool) {
   this.GraphicsTool = gTool;
};
OldGenieShape.prototype.SetPosition = function(x, y) {
   if (x) this.X = x;
   if (y) this.Y = y;
};

//---------- OLD GENIE CIRCLE --------------------
var OldGenieCircle = function() { };
OldGenieCircle.prototype = new OldGenieShape();
/*
OldGenieCircle.prototype.Set = function(radius, colour, lnWdth, style, opcty) {
   OldGenieShape.prototype.Set.call(this, radius, colour, lnWdth, style, opcty);

//   this.Centre = new Coordinate2D();
//   if (x && y)
//      this.SetPosition(x, y);
//   if (gtool)
//      this.GraphicsTool = gtool;
//};
*/
OldGenieCircle.prototype.Draw = function(x, y) {
//   if (x && y)
   this.SetPosition(x, y);
//   if (this.GraphicsTool)
   this.GraphicsTool.DrawCircle(this.X, this.Y, this.Size, this.Colour, this.ContourLineWidth, this.Style, 0, this.Opacity);
};

//-------------------------------------------
//---------- GENIE RANGE --------------------
var GenieRange = function() {
   var Min;
   var Max;
   var Segments;
};
GenieRange.prototype.Set = function(min, max, sgmnts) { this.Min = min; this.Max = max; this.Segments = sgmnts || -1; }
GenieRange.prototype.Within = function(num) {
   if (num>=this.Min && num<=this.Max)
      return true;
   else
      return false;
};
GenieRange.prototype.CheckWithin = function(num) {
   return (this.Within(num));
};

//--------------------------------------------
//---------- GENIE COLOUR --------------------
var GenieColour = function() {
   var Name;
   var RGB;
   var R, G, B;
   var OriginalHue;
   var Shades;
};
GenieColour.prototype = {
   Set(colour, bLookupname) {  //NOTE: if colour is passed in decimal form, it must have the format "rgb(000,000,000)"
      var i;
      var colour_hex;

      //TODO: make processing of decimal form more flexible

      //Check if colour is named or is in rgb form; process
      if (colour.substr(0, 3).toUpperCase() == "RGB") {
	 this.RGB = colour;
	 if (colour.length==19) {  //check if hexadecimal form
	    this.R = parseInt(this.RGB.substr(4, 4), 16);
	    this.G = parseInt(this.RGB.substr(9, 4), 16);
	    this.B = parseInt(this.RGB.substr(14, 4), 16);
	 } else {
	    this.R = parseInt(this.RGB.substr(4, 3));
	    this.G = parseInt(this.RGB.substr(8, 3));
	    this.B = parseInt(this.RGB.substr(12, 3));
	 }

	 if (bLookupname) {
	    colour_hex = (0x010000*this.R) + (0x000100*this.G) + this.B;
	    for (i=0;i<JSColours.length;++i)
	       if (colour_hex==JSColours[i][COLOUrTABLE.HEX]) {
		  this.Name = JSColours[i][COLOUrTABLE.NAME];
		  break;
	       }
	 }
      } else {
	 this.Name = colour;

	 //Get rgb values from a look-up table
	 for (i=0;i<JSColours.length;++i)
	    if (colour.toLowerCase()==JSColours[i][COLOUrTABLE.NAME]) {
	       colour_hex = JSColours[i][COLOUrTABLE.HEX];
	       break;
	    }

	 //Convert to RGB format
	 this.R = (colour_hex & 0xFF0000) % 0x00FF00;
	 this.G = (colour_hex & 0x00FF00) % 0x0000FF;
	 this.B = colour_hex & 0x0000FF;
	 this.RGB = "rgb(" + this.R + ", " + this.G + ", " + this.B + ")";
      }
      this.OriginalHue = this.RGB;
   },
   SeparateRGB() {
      this.R = parseInt(this.RGB.substr(4, 3));
      this.G = parseInt(this.RGB.substr(8, 3));
      this.B = parseInt(this.RGB.substr(12, 3));
   },
   GenerateRandom() {
      this.R = Utilities.GetRandomNumber(255);
      this.G = Utilities.GetRandomNumber(255);
      this.B = Utilities.GetRandomNumber(255);
   },
   GetRGBFormat() {
      if (!this.RGB)
	 this.RGB = "rgb(" + this.R + ", " + this.G + ", " + this.B + ")";
      return (this.RGB);
   },
   GetLighter(scale) {
      var r, g, b;

      r = this.R + Math.round((255-this.R)*scale);
      g = this.G + Math.round((255-this.G)*scale);
      b = this.B + Math.round((255-this.B)*scale);

      return ( "rgb(" + r + ", " + g + ", " + b + ")" );
   },
   Lighten(percentage) {
      //Can only do this with hex values
      if (!this.RGB)
         return;

      //Make colours lighter
      this.R += Math.round((255-this.R)*(percentage/100));
      this.G += Math.round((255-this.G)*(percentage/100));
      this.B += Math.round((255-this.B)*(percentage/100));
      this.RGB = "rgb("+ this.R + "," + this.G +"," + this.B + ")";
   },
   Darken(percentage) {
      //Can only do this with hex values
      if (!this.RGB)
         return;

      //Make colours lighter
      this.R -= Math.round(this.R*(percentage/100));
      this.G -= Math.round(this.G*(percentage/100));
      this.B -= Math.round(this.B*(percentage/100));
      this.RGB = "rgb(" + this.R + ", " + this.G + ", " + this.B + ")";
   },
   Invert() {
      this.R = 255 - this.R;
      this.G = 255 - this.G;
      this.B = 255 - this.B;
      this.RGB = "rgb(" + this.R + ", " + this.G + ", " + this.B + ")";
   },
   CombineColours(colour1, colour2) {  //NOTE: both are expected in GenieColour format
      this.R = colour1.R + colour2.R;
      this.G = colour1.G + colour2.G;
      this.B = colour1.B + colour2.B;
      this.RGB = "rgb(" + this.R + ", " + this.G + ", " + this.B + ")";
   },
   CheckColourClash(colour) {
      return ((Math.abs(this.R-colour.R)+Math.abs(this.G-colour.G)+Math.abs(this.B-colour.B))<96);
   },
   CheckGreyTone() {
      return ((Math.abs(this.R-this.G)+Math.abs(this.G-this.B)+Math.abs(this.B-this.R))<64);
   },
   Reset() {
      this.RGB = this.OriginalHue;
   },
   CreateShades(num) {  //creates lighter shades of number specified, up to, but not including, white
      var i;
      var r, g, b;

      this.Shades = new Array(10);
      for (i=0;i<num;++i) {
	 r = this.R + (Math.round((255-this.R)*(i/num)));
	 g = this.G + (Math.round((255-this.G)*(i/num)));
	 b = this.B + (Math.round((255-this.B)*(i/num)));
	 this.Shades[i] = "rgb("+ r + "," + g +"," + b + ")";
      }
   }
};

//---------- TRANSITIONAL COLOUR ----------
var TransitionalColour = function() {  //ASSUMPTION: colours expected in RGB format
   var Start;		//format is { R: num, G: num, B: num }
   var End;		//format is { R: num, G: num, B: num }
   var Steps;		//format is { R: num, G: num, B: num }
   var Rate;
   var Current;
   var ColourSteps;
   var Status;

   var i;
};
TransitionalColour.prototype = new GenieColour();
TransitionalColour.prototype.Set = function(start, end, steps, rate) {
   this.Start = { R: null, G: null, B: null };
   this.AssignRGB(this.Start, start);
   this.End = { R: null, G: null, B: null };
   this.AssignRGB(this.End, end);
   this.Steps = steps;
   this.Rate = rate;
   this.Current = new GenieColour();
   this.Reset();
   if (this.Steps) {
      this.ColourSteps = new GenieColour();
      this.ColourSteps.R = (this.End.R - this.Start.R)/this.Steps;
      this.ColourSteps.G = (this.End.G - this.Start.G)/this.Steps;
      this.ColourSteps.B = (this.End.B - this.Start.B)/this.Steps;
   }
   this.Status = this.Rate;
};
TransitionalColour.prototype.AssignRGB = function(rgb, colour) {
   this.RGB = colour;
   this.SeparateRGB();
   rgb.R = this.R;
   rgb.G = this.G;
   rgb.B = this.B;
};
TransitionalColour.prototype.Reset = function(start, end, steps) {
   if (start)
      this.AssignRGB(this.Start, start);
   if (end)
      this.AssignRGB(this.End, end);
   if (steps) {
      this.Steps = steps;
      this.ColourSteps.R = (this.End.R - this.Start.R)/(this.Steps-1);		//NOTE: subtracting 1 since 'start' to 'end' is 1 step already
      this.ColourSteps.G = (this.End.G - this.Start.G)/(this.Steps-1);
      this.ColourSteps.B = (this.End.B - this.Start.B)/(this.Steps-1);
   }
   this.Current.R = this.Start.R;
   this.Current.G = this.Start.G;
   this.Current.B = this.Start.B;
};
TransitionalColour.prototype.GetIntermediateColour = function(pTransitioned) {  //p-percentage
   this.Current.R = this.Start.R + Math.round((this.End.R-this.Start.R)*(pTransitioned/100));
   this.Current.G = this.Start.G + Math.round((this.End.G-this.Start.G)*(pTransitioned/100));
   this.Current.B = this.Start.B + Math.round((this.End.B-this.Start.B)*(pTransitioned/100));
   return (this.Current.GetRGBFormat());
};
TransitionalColour.prototype.Update = function() {  //UNTESTED!!
   --this.Status;
   if (!this.Status) {
      this.Current.R += this.ColourSteps.R;
      this.Current.G += this.ColourSteps.G;
      this.Current.B += this.ColourSteps.B;
      this.Status = this.Rate;
      if (this.Current===this.End)
	 return (true);
   }
   return (false);
};
TransitionalColour.prototype.GetSpectrum = function() {
   var spectrum;

   spectrum = new Array(this.Steps);
   for (this.i=0;this.i<this.Steps;++this.i) {
      spectrum[this.i] = "rgb(";
      spectrum[this.i] += Math.round(this.Start.R + (this.i*this.ColourSteps.R)) + ",";
      spectrum[this.i] += Math.round(this.Start.G + (this.i*this.ColourSteps.G)) + ",";
      spectrum[this.i] += Math.round(this.Start.B + (this.i*this.ColourSteps.B)) + ")";
   }
   return (spectrum);
};

//------------------------------------------
//---------- GENIE NAME --------------------
//a generic name generating function could be used in several places, given different patterns and links to arrays
// containing first/last names, syllable, vowels/consonants etc; a name data structure in GenieData could handle that
var GenieName = function() {
   var First;
   var Last;
};
GenieName.prototype = {
   Set(first, last) {
      this.First = first;
      if (last)
	 this.Last = last;
   },
   PickFirstAndLast(fNameArray, lNameArray) {
      this.First = fNameArray[Utilities.GetRandomNumber(fNameArray.length, STARtAtZERO)];
      this.Last = lNameArray[Utilities.GetRandomNumber(lNameArray.length, STARtAtZERO)];
   },
   GetFullName() {
      if (this.Last)
	 return (this.First + " " + this.Last);
      else
	 return (this.First);
   }
};

//----------------------------------------------
//---------- PARABOLIC PATH --------------------
var ParabolicPath = function() {
   var MaxHeight;
   var MaxDistance;
   var Distance;
//   var XDistance, YDistance;
   var DistanceCovered;
};
ParabolicPath.prototype = {
   Set(start, end, sPercentage, ePercentage, apogee, speed) {  //s- start, e- end
      //coords will have to be rotated - don't see a way around it
      //can implement a very basic one to begin with (top-down, parallel to x-axis only)
   }
};
