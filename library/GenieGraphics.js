/*
 *  rule of thumb - use GenieGraphics if drawing simple lines and shapes that don't need storage, otherwise use GenieShapes and descendants
 */
//----------------------------------------------
//---------- GENIE GRAPHICS --------------------
var GenieGraphics = function() {
   var Context;
   var Screen, InfoBox, ControlPanel;
   var GlobalAlpha;
   var Offset;
   var Vertices;			//TEMP only - for backward compatibility (eventually will be used for Octagon drawing)
   var Octagon;

   var i, angle, radians, height, segment, coords, coords2;
};
GenieGraphics.prototype = {
   Set(cntxt, iBox, cPanel) {
      this.Context = cntxt;
      this.Screen = cntxt;
      this.InfoBox = iBox;
      this.ControlPanel = cPanel;

      this.Octagon = [ { X: -5, Y: -12 }, { X:  5, Y: -12 }, { X:  12, Y: -5 }, { X:  12, Y:  5 },
		       { X:  5, Y:  12 }, { X: -5, Y:  12 }, { X: -12, Y:  5 }, { X: -12, Y: -5 }  ];
      this.Vertices = Utilities.Create2DArray(8, Coordinate2D);

      this.coords = new Coordinate2D();
      this.coords2 = new Coordinate2D();
   },
   SwitchContext(cntxt) {
      if (cntxt)
	 this.Context = cntxt;
   },
   SwitchContextByID(id) {
      switch (id) {
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
   SwitchToInfoBox() {
      this.Context = this.InfoBox;
   },
   SwitchToControlPanel() {
      this.Context = this.ControlPanel.Canvas.Context;
   },
   RestoreContext() {
      this.Context = this.Screen;
   },
   SetOpacity(opcty) {

      if (opcty) {
	 this.GlobalAlpha = this.Context.globalAlpha;
	 this.Context.globalAlpha = opcty;
      } else
	 this.GlobalAlpha = null;
   },
   ResetOpacity() {

      if (this.GlobalAlpha)
	 this.Context.globalAlpha = this.GlobalAlpha;
   },
   DrawLine(pos, dstn, colour, lWidth, opcty) {

      this.SetOpacity(opcty);
      this.Context.beginPath();
      this.Context.strokeStyle = colour || "black";
      this.Context.lineWidth = lWidth || 1;
      this.Context.moveTo(pos.X, pos.Y);
      this.Context.lineTo(dstn.X, dstn.Y);
      this.Context.stroke();
      this.Context.closePath();
      this.ResetOpacity();
   },
   DrawHorizontalLine(pos, lngth, colour, lWidth, opcty) {  //NOTE: draws left to right
      if (lWidth % 2)
	 this.coords.Set(pos.X, pos.Y+0.5);
      else
	 this.coords.Set(pos.X, pos.Y+1);
      this.coords2.Set(this.coords.X+lngth, this.coords.Y);
      this.DrawLine(this.coords, this.coords2, colour, lWidth, opcty);
   },
   DrawVerticalLine(pos, lngth, colour, lWidth, opcty) {  //NOTE: draws top to bottom
      if (lWidth % 2)
	 this.coords.Set(pos.X+0.5, pos.Y);
      else
	 this.coords.Set(pos.X+1, pos.Y);
      this.coords2.Set(this.coords.X, this.coords.Y+lngth);
      this.DrawLine(this.coords, this.coords2, colour, lWidth, opcty);
   },
   DrawArc(x, y, rds, sAngle, eAngle, colour, lWidth, opcty) {
      this.SetOpacity(opcty);
      sAngle = Utilities.DegreesToRadians(sAngle) - (Math.PI/2);
      eAngle = Utilities.DegreesToRadians(eAngle) - (Math.PI/2);
      this.Context.beginPath();
      this.Context.arc(x, y, rds, sAngle, eAngle);
      if (lWidth) {
	 this.Context.lineWidth = lWidth;
	 this.Context.strokeStyle = colour || "black";
	 this.Context.stroke();
      } else {
	 this.Context.lineTo(x, y);
	 this.Context.fillStyle = colour || "black";
	 this.Context.fill();
      }
      this.Context.closePath();
      this.ResetOpacity(opcty);
   },
   DrawCircle(x, y, rds, colour, lWidth, opcty) {
      this.SetOpacity(opcty);
      this.Context.beginPath();
      this.Context.arc(x, y, rds, 0, 2*Math.PI);
      if (lWidth) {
	 this.Context.lineWidth = lWidth || 1;
	 this.Context.strokeStyle = colour || "black";
	 this.Context.stroke();
      } else {
	 this.Context.fillStyle = colour || "black";
	 this.Context.fill();
      }
      this.Context.closePath();
      this.ResetOpacity(opcty);
   },
   DrawEllipse(x, y, width, height, colour, lWidth, opcty) {
      this.SetOpacity(opcty);
      this.Context.beginPath();
      this.Context.ellipse(x, y, width/2, height/2, 0, 0, 2*Math.PI);
      if (lWidth) {
	 this.Context.lineWidth = lWidth;
	 this.Context.fillStyle = colour || "black";
	 this.Context.stroke();
      } else {
	 this.Context.fillStyle = colour || "black";
	 this.Context.fill();
      }
      this.Context.closePath();
      this.ResetOpacity(opcty);
   },
   DrawDiamond(x, y, rds, colour, lWidth, opcty) {
      this.SetOpacity(opcty);
      this.Context.beginPath();
      this.Context.moveTo(x, y-rds);
      this.Context.lineTo(x+rds, y);
      this.Context.lineTo(x, y+rds);
      this.Context.lineTo(x-rds, y);
      this.Context.lineTo(x, y-rds);
      if (lWidth) {
	 this.Context.lineWidth = lWidth;
	 this.Context.strokeStyle = colour;
	 this.Context.stroke();
      } else {
	 this.Context.fillStyle = colour;
	 this.Context.fill();
      }
      this.Context.closePath();
      this.ResetOpacity(opcty);
   },
   DrawSquare(x, y, size, colour, lWidth, opcty) {
      this.DrawRectangle(x, y, size, size, colour, lWidth, opcty);
   },
   DrawRectangle(x, y, w, h, colour, lWidth, opcty) {  //NOTE: putting a very basic one in here for now - should use GenieRectangle for style options

      //TODO: either implement angle rotation, or use GenieRectangle exclusively for that

      this.SetOpacity(opcty);
      colour = colour || "black";
      if (lWidth) {
	 this.Context.strokeStyle = colour;
	 this.Context.lineWidth = lWidth;
	 this.Offset = Math.floor(lWidth/2);
	 if (lWidth % 2)
	    this.Offset += 0.5;
	 this.Context.strokeRect(x+this.Offset, y+this.Offset, w-lWidth, h-lWidth);
      } else {
	 this.Context.fillStyle = colour;
	 this.Context.fillRect(x, y, w, h);
      }
      this.ResetOpacity(opcty);
   },
   DrawRoundedRectangle(x, y, w, h, r, fColour, bColour, lWidth) {  //r- radius of arcs, fColour- frame colour, bColour- background colour

      //Adjust coordinates for better graphical display
      x += 0.5;		//UNTESTED!
      y += 0.5;

      //Draw background if colour specified
      if (bColour) {
	 this.Context.fillStyle = bColour || "white";
	 this.Context.beginPath();
	 this.Context.arc(x+r, y+r, r, Math.PI, 1.5*Math.PI);
	 this.Context.lineTo(x+w-r, y);
	 this.Context.arc(x+w-r, y+r, r, 1.5*Math.PI, 0);
	 this.Context.lineTo(x+w, y+h-r);
	 this.Context.arc(x+w-r, y+h-r, r, 0, 0.5*Math.PI);
	 this.Context.lineTo(x+r, y+h);
	 this.Context.arc(x+r, y+h-r, r, 0.5*Math.PI, Math.PI);
	 this.Context.lineTo(x, y+r);
	 this.Context.fill();
	 this.Context.closePath();
	 r -= (lWidth-1);
      }

      //Draw frame if required, starting from top left corner
      if (fColour) {
	 this.Context.strokeStyle = fColour || "black";
	 this.Context.lineWidth = lWidth || 1;
	 this.Context.beginPath();
	 this.Context.arc(x+r, y+r, r, Math.PI, 1.5*Math.PI);
	 this.Context.lineTo(x+w-r, y);
	 this.Context.arc(x+w-r, y+r, r, 1.5*Math.PI, 0);
	 this.Context.lineTo(x+w, y+h-r);
	 this.Context.arc(x+w-r, y+h-r, r, 0, 0.5*Math.PI);
	 this.Context.lineTo(x+r, y+h);
	 this.Context.arc(x+r, y+h-r, r, 0.5*Math.PI, Math.PI);
	 this.Context.lineTo(x, y+r);
	 this.Context.stroke();
	 this.Context.closePath();
      }
   },
   DrawOctagon(x, y, size, colour, lWidth, opcty) {

      for (this.i=0;this.i<SIDES.OCTAGON;++this.i) {
	 this.Vertices[this.i].X = (size/24)*this.Octagon[this.i].X;
	 this.Vertices[this.i].Y = (size/24)*this.Octagon[this.i].Y;
      }
      this.DrawPolygon(x, y, this.Vertices, colour, lWidth, opcty);
   },
   DrawPolygon(x, y, vrtcs, colour, lWidth, opcty) {
      this.SetOpacity(opcty);
      if (lWidth) {
	 colour = colour || "black";
	 this.Context.lineWidth = lWidth;
	 this.Context.strokeStyle = colour;
      } else
	 this.Context.fillStyle = colour;
      this.Context.beginPath();
      this.Context.moveTo(x+vrtcs[0].X, y+vrtcs[0].Y);
      for (this.i=1;this.i<vrtcs.length;++this.i)
	 this.Context.lineTo(x+vrtcs[this.i].X, y+vrtcs[this.i].Y);
      if (lWidth) {
	 this.Context.lineTo(x+vrtcs[0].X, y+vrtcs[0].Y);
	 this.Context.stroke();
      } else
	 this.Context.fill();
      this.Context.closePath();
      this.ResetOpacity();
   },
/*
   DrawPolygon(x, y, size, nSides, colour, lineWidth, style, angle, opcty) {  //this is the old one, for backward compatibility

      //NOTE: .Vertices will alreay be set externally

      if (lineWidth) {
	 this.Context.strokeStyle = colour;
	 this.Context.lineWidth = lineWidth;
      } else
	 this.Context.fillStyle = colour;
      this.Context.beginPath();
      this.Context.moveTo(x+this.Vertices[0].X, y-this.Vertices[0].Y);
      for (i=1;i<this.Vertices.length;++i)
	 this.Context.lineTo(x+this.Vertices[i].X, y-this.Vertices[i].Y);
      if (lineWidth) {
	 this.Context.lineTo(x+this.Vertices[0].X, y-this.Vertices[0].Y);
	 this.Context.stroke();
      } else
	 this.Context.fill();
      this.Context.closePath();
   },
*/
   DrawGrid(x, y, specs) {

      //Colour in background if specified
      if (specs.BACKGROUND) {
	 this.Context.fillStyle = specs.BACKGROUND;
	 this.Context.fillRect(x, y, specs.W, specs.H);
      }

      //Draw frame
      this.DrawRectangle(x, y, specs.W, specs.H, specs.COLOUR, specs.LW);

      //Draw rows
      for (this.i=1;this.i<specs.R;++this.i) {
	 coords.X = x;
	 coords.Y = y + Math.round((this.i*(specs.H/specs.R)));
	 this.DrawHorizontalLine(coords, specs.W, specs.COLOUR, specs.LW);
      }

      //Draw columns
      for (this.i=1;this.i<specs.C;++this.i) {
	 coords.X = x + (this.i*(specs.W/specs.C));
	 coords.Y = y;
	 this.DrawVerticalLine(coords, specs.H, specs.COLOUR, specs.LW);
      }
   }
};
