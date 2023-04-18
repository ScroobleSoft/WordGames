
//----------ToolTip----------------------------------------
var ToolTip = function() {
   var X, Y;
   var Width, Height;
   var OriginalImg;
};
ToolTip.prototype.Set = function(x, y, wdth, hght, img) {
   this.X = x; this.Y = y; this.Width = wdth; this.Height = hght;
   this.OriginalImg = img;
};

var GraphicIndexEntry = function() {
   var List;
   var Element;
};
var GraphicElements = function() {
   var ScreenHeight;
   var Index;
   var Lists;
};

//--------------------------------------------
//---------- GENIE CANVAS --------------------
var GenieCanvas = function () {

   var MouseWithin;		//ISSUE: redundant?
   var Element;
   var Id;
   var Context;
   var Controls;
   var ControlEngaged;		//ISSUE: redundant?
   var DrawCycleFlag;

   var ToolTipsEnabled;
   var GraphicsZOrder;		//hash table
   var GraphicsTool;

   var TessellatingTile;
   var ToolTips;
   var ToolTipDrawn;
   var ToolTipTextHeight;
   var ToolTipX, ToolTipY;
   var ToolTipBuffer, ToolTipBufferContext;

   var i, j, y, nElements;
};
GenieCanvas.prototype = {
   Set(cnvs, font, bWebGL) {

      this.Element = document.getElementById(cnvs);
      if (bWebGL)
	 this.Context = this.Element.getContext("webgl");
      else
	 this.Context = this.Element.getContext("2d");

//      this.Element = document.getElementById(cnvs);
//      this.Context = this.Element.getContext("2d");
      this.MouseWithin = false;
      this.Context.font = font ? font : DEFAULT.FONT;
      this.DrawCycleFlag = false;

      //Register mouse event handlers
      this.Element.addEventListener("mousemove", this.TrackMouse.bind(this));
      this.Element.addEventListener("mouseover", this.MousePresent.bind(this));
      this.Element.addEventListener("mouseout", this.MouseAbsent.bind(this));
      this.Element.addEventListener("click", this.MouseClicked.bind(this));
      this.Element.addEventListener("dblclick", this.MouseDoubleClicked.bind(this));
      this.Element.addEventListener("mousedown", this.MouseDown.bind(this));
      this.Element.addEventListener("mouseup", this.MouseUp.bind(this));
   },
   SetAntiAliasingOn() {

      this.Context.imageSmoothingEnabled = true;
   },
   SetAntiAliasingOff() {

      this.Context.imageSmoothingEnabled = false;
   },
   DisableRightClickMenu() {
      var cnvs = this;

      var DisableMenu = function(event) {
	 event.preventDefault();
	 cnvs.MouseClicked(event);		//NOTE: this works, but causes continuous fire
      }

      this.Element.addEventListener("contextmenu", DisableMenu);
   },
   CheckDrawCycle() {

      return (this.DrawCycleFlag);
   },
   FlipDrawCycle() {

      this.DrawCycleFlag = !this.DrawCycleFlag;
   },
   Clear() {
      this.Context.clearRect(0, 0, this.Element.width, this.Element.height);
   },
   EnableToolTips() {
      this.ToolTipsEnabled = true;
   },
   RegisterControl(cntrl) {
      if (!this.Controls)
	 this.Controls = new Array();
      this.Controls.push(cntrl);
   },
   DisplayAllVisibleControls() {
      var i;

      if (this.Controls)
	 for (i=0;i<this.Controls.length;++i)
	    if (this.Controls[i].Visible)
	       this.Controls[i].Display();
   },
   TrackMouse(event) {
      var i;

      Mouse.X = event.offsetX; 
      Mouse.Y = event.offsetY;
      Mouse.CanvasId = this.Id;
      Mouse.Moved = true;

      //If tool-tips are enabled, re-draw all controls
/*
      if (this.ToolTips) {  //hopefully will be REDUNDANT
	 this.ShowToolTip();
      }
*/
      if (this.ToolTipsEnabled) {
	 this.Clear();
	 this.DisplayAllVisibleControls();
      }

      //Check if mouse is over a control
      if (this.Controls)
	 for (i=0;i<this.Controls.length;++i)
	    if (this.Controls[i].Enabled)
	       if (Utilities.PointInBox(Mouse, this.Controls[i].Specs)) {
		  this.Controls[i].MouseOver();
		  this.ControlEngaged = this.Controls[i];
		  if (this.ToolTipsEnabled)
		     this.Controls[i].DrawToolTip();
		  return;
	       }
      if (this.ControlEngaged) {  //ISSUE: not sure this is useful, except maybe ::MouseOut to be implemented in CanvasButton
	 this.ControlEngaged.MouseOut();
	 this.ControlEngaged = null;
      }

      //ISSUE: changing too fast from one control to another prevents first control from getting .MouseOut message
      //       increased spacing, even by a few pixels, could fix that
   },
   MouseClicked(event) {

      Mouse.ClickX = event.offsetX;
      Mouse.ClickY = event.offsetY;
      Mouse.Click.Set(Mouse.ClickX, Mouse.ClickY);	//REDUNDANT: would like to eliminate the previous 2 lines
      Mouse.CanvasId = this.Id;

      //Check controls to see if any of them were clicked
      if (this.Controls)
	 for (this.i=0;this.i<this.Controls.length;++this.i)
	    if (this.Controls[this.i].Enabled) {
//	       this.ControlEngaged = this.Controls[this.i];
	       if (this.Controls[this.i].CheckClickedOn()) {
		  this.Controls[this.i].ClickedOn();
		  return;
	       }
	    }

      switch(event.button) {
	 case MOUSE.LEFTBUTTON:
	    Mouse.LeftClicked = true;
	    break;
	 case MOUSE.RIGHTBUTTON:
	    Mouse.RightClicked = true;
	    break;
      }
   },
   MouseDoubleClicked(event) {  //NOTE: not passing message to controls
      var i;

      //LOGGED - UNTESTED

      switch(event.button) {
	 case MOUSE.LEFTBUTTON:
	    Mouse.LeftDoubleClicked = true;
	    break;
	 case MOUSE.RIGHTBUTTON:
	    Mouse.RightDoubleClicked = true;
	    break;
      }
      Mouse.ClickX = event.offsetX; 
      Mouse.ClickY = event.offsetY;
      Mouse.CanvasId = this.Id;
   },
   MouseDown(event) {  //NOTE: only used for right clicks
      var i;

      Mouse.Down.Set(event.offsetX, event.offsetY);
      Mouse.CanvasId = this.Id;

      //Check if mouse button is pressed down over a control
      if (this.Controls)
	 for (i=0;i<this.Controls.length;++i)
	    if (this.Controls[i].Enabled)
	       if (Utilities.CheckPointInBox(Mouse.Down, this.Controls[i].Specs)) {
		  this.Controls[i].MouseDown();
		  return;
	       }
      Mouse.Downed = true;
   },
   MouseUp(event) {
      var i;

      //Check if mouse is over a control
      if (this.Controls)
	 for (i=0;i<this.Controls.length;++i)
	    if (this.Controls[i].Enabled)
	       if (Utilities.CheckPointInBox( { X: event.offsetX, Y: event.offsetY }, this.Controls[i].Specs)) {
		  this.Controls[i].MouseUp();
		  break;
	       }
      Mouse.Downed = false;
/*
      if (event.button==MOUSE.RIGHTBUTTON)
	 Mouse.RightClicked = true;
*/
   },
   MousePresent(Event) {

      this.MouseWithin = true;
      Mouse.CanvasId = this.Id;
   },
   MouseAbsent(Event) {

      this.MouseWithin = false;
//      Mouse.CanvasId = 0;		TODO: commenting this out for now as it is more useful to know most recently visited canvas
      Mouse.X = Event.offsetX; 
      Mouse.Y = Event.offsetY;
      Mouse.CanvasId = CANVAS.NONE;
   },
   SetTessellatedBackground(tImage) {
      this.TessellatingTile = tImage;
   },
   DrawTessellatedBackground(fileName) {
      var x, y;
      var width, height;

      //Check if 'createPattern' is to be used
      if (fileName) {
	 this.DrawPatternedBackground();
	 return;
      }

      //Safety check
      if (!this.TessellatingTile)
	 return;

      //Tile image
/*
      width = this.TessellatingTile.GetWidth();
      height = this.TessellatingTile.GetHeight();
*/
      width = this.TessellatingTile.Specs.W;
      height = this.TessellatingTile.Specs.H;
      x = 0;
      if (!height || !width)
	 return (null);
      while (x<SCREEN.WIDTH) {
	 y = 0;
	 while (y<SCREEN.HEIGHT) {
	    this.TessellatingTile.Draw(x, y);
	    y += height;
	 }
	 x += width;
      }
   },
   DrawPatternedBackground(fileName) {
      var img;
      var tile;

      img = document.getElementById(fileName);
      tile = this.Context.createPattern(img, "repeat");
      this.Context.rect(0, 0, SCREEN.WIDTH, SCREEN.HEIGHT);  //NOTE: no height/width safety checks, probably should
      this.Context.fillStyle = tile;
      this.Context.fill();
   },
   WriteText(txtInfoArray, gtool) {  //TODO: want to replace this with GenieText
      var i;
      var txtWdth;
      var str;

      for (i=0;i<txtInfoArray.length;++i) {
	 str = txtInfoArray[i][TEXtSPECS.STRING];
	 if (txtInfoArray[i][TEXtSPECS.FONT]=="")
	    this.Context.font = DEFAULT.FONT;
	 else
	    this.Context.font = txtInfoArray[i][TEXtSPECS.FONT];
	 if (txtInfoArray[i][TEXtSPECS.STYLE]) {
	    //Have to check if graphics tool has been specified
	    if (txtInfoArray[i][TEXtSPECS.STYLE] & (FONtSTYLE.UNDERLINE | FONtSTYLE.OVERLINE | FONtSTYLE.LINETHROUGH)) {
	       if (!this.GraphicsTool && !gtool)
		  return;
	       this.GraphicsTool = gtool ? gtool : this.GraphicsTool;
	    }
	    if (txtInfoArray[i][TEXtSPECS.STYLE] & FONtSTYLE.BOLD)
	       this.Context.font = "bold " + txtInfoArray[i][TEXtSPECS.FONT];
	    if (txtInfoArray[i][TEXtSPECS.STYLE] & FONtSTYLE.ITALICS)
	       this.Context.font = "italic " + txtInfoArray[i][TEXtSPECS.FONT];
	    if (txtInfoArray[i][TEXtSPECS.STYLE] & FONtSTYLE.UNDERLINE)
	       //TDB: this will have to be done manually using lineTo
	       txtWdth = this.Context.measureText(str).width;
	    if (txtInfoArray[i][TEXtSPECS.STYLE] & FONtSTYLE.OVERLINE)
	       //TDB: this will have to be done manually using lineTo
	       txtWdth = this.Context.measureText(str).width;
	    if (txtInfoArray[i][TEXtSPECS.STYLE] & FONtSTYLE.LINETHROUGH)
	       //TDB: this will have to be done manually using lineTo
	       txtWdth = this.Context.measureText(str).width;
	 }
	 if (txtInfoArray[i][TEXtSPECS.COLOUR])
	    str.fontcolor(txtInfoArray[i][TEXtSPECS.COLOUR]);
	 else
	    this.Context.fillStyle = "black";

	 this.Context.fillText(str, txtInfoArray[i][TEXtSPECS.L], txtInfoArray[i][TEXtSPECS.T]);
      }
   },
   PointInBox : function(x, y, l, b, w, h) {
      if(((x>=l)&&(x<=(l+w)))&&((y<=(b+h))&&(y>=b)))
	 return true;
      else
	 return false;
   },
   EnableToolTips : function(bffr, cntxt) {
      this.ToolTips = new Array();
      this.ToolTipDrawn = false;
//TODO: get pre-existing font, or set one if none exists
      this.ToolTipTextHeight = parseInt(this.Context.font.split(' ')[0].replace('px', ''));
      this.ToolTipBuffer = bffr;
      this.ToolTipBufferContext = cntxt;
   },
//   AddToolTips : function(tips) {
//      this.ToolTips = tips;
//   },
   ShowToolTip : function() {
      var i;
      var txtWidth;

      for (i=0;i<this.ToolTips.length;++i)
	 if (this.PointInBox(Mouse.X, Mouse.Y, this.ToolTips[i].X, this.ToolTips[i].Y-this.ToolTips[i].Height, this.ToolTips[i].Width, this.ToolTips[i].Height)) {
	    if (this.ToolTipDrawn) break;
	    //Save image of area tool tip will be drawn over
	    txtWidth = Math.round(this.Context.measureText(this.ToolTips[i].Tip).width);
	    this.ToolTipX = this.ToolTips[i].X+this.ToolTips[i].Width-txtWidth - 6;
	    this.ToolTipY = this.ToolTips[i].Y;
	    this.ToolTipBufferContext.clearRect(0, 0, this.ToolTipBuffer.width, this.ToolTipBuffer.height);
	    this.ToolTipBufferContext.drawImage(this.Element, this.ToolTipX, this.ToolTipY, this.ToolTipBuffer.width, this.ToolTipBuffer.height, 0, 0, this.ToolTipBuffer.width, this.ToolTipBuffer.height);
	    this.Context.fillStyle = "rgb(255, 255, 128)";
	    this.Context.fillRect(this.ToolTipX, this.ToolTipY, txtWidth+4, this.ToolTipTextHeight+4);
	    this.Context.fillStyle = "black";
	    this.Context.fillText(this.ToolTips[i].Tip, this.ToolTipX+2, this.ToolTips[i].Y+this.ToolTipTextHeight);
	    this.ToolTipDrawn = true;
	    break;
	 }

      if ((i==this.ToolTips.length)&&(this.ToolTipDrawn)) {
	 this.Context.drawImage(this.ToolTipBuffer, this.ToolTipX, this.ToolTipY);
	 this.ToolTipDrawn = false;
      }
   },
   HideToolTip : function() {
   },
   SetGraphicsList(sHeight) {  //sHeight- screen height UNTESTED!!
      var i;
      var nElements;

      this.GraphicsZOrder = new GraphicElements();
      this.GraphicsZOrder.ScreenHeight = sHeight;
      this.GraphicsZOrder.Lists = new Array();
      for (i=1;i<arguments.length;++i)
	 this.GraphicsZOrder.Lists.push(arguments[i]);
      nElements = 0;
      for (i=0;i<this.GraphicsZOrder.Lists.length;++i)
	 nElements += this.GraphicsZOrder.Lists[i].length;
      this.GraphicsZOrder.Index = Utilities.CreateArray(nElements, GraphicIndexEntry);
   },
   DrawGraphics() {  //UNTESTED!!

      //The following is very INEFFICIENT, some type of bubble sort or such perhaps being preferrable

      //Check cumulative length of lists, adjust length of index array if necessary
      this.nElements = 0;
      for (this.i=0;this.i<this.GraphicsZOrder.Lists.length;++this.i)
	 this.nElements += this.GraphicsZOrder.Lists[this.i].length;
      if (this.nElements>this.GraphicsZOrder.Index.length)
	 Utilities.ExtendArray(this.GraphicsZOrder.Index, this.nElements-this.GraphicsZOrder.Index.length, GraphicIndexEntry);

      //Traverse list to create index
      this.nElements = 0;
      for (this.y=0;this.y<this.GraphicsZOrder.ScreenHeight;++this.y)
	 for (this.i=0;this.i<this.GraphicsZOrder.Lists.length;++this.i)
	    for (this.j=0;this.j<this.GraphicsZOrder.Lists[this.i].length;++this.j)
	       if (this.GraphicsZOrder.Lists[this.i][this.j].Extant)
		  if (y==Math.round(this.GraphicsZOrder.Lists[this.i][this.j].Position.Y)) {
		     ++this.nElements;
		     this.GraphicsZOrder.Index[this.nElements].List = i;
		     this.GraphicsZOrder.Index[this.nElements].Element = j;
		  }
      if (this.nElements<this.GraphicsZOrder.Index.length-1) {
	 this.GraphicsZOrder.Index[this.nElements+1].List = -1;
	 this.GraphicsZOrder.Index[this.nElements+1].Element = -1;
      }

      //Draw graphic elements
      for (this.i=0;this.i<this.this.GraphicsZOrder.Index.length;++this.i)
	 this.GraphicsZOrder.Lists[this.GraphicsZOrder.Index[this.i].List][this.GraphicsZOrder.Index[this.i].Element].Draw();

      //ISSUE: this only works for sprites, as lasers, specifically diagonal ones, will cause problems
   }
};

//---------------------------------------------
//---------- GENIE CONSOLE --------------------
var GenieConsole = function () {
   var Controls;
   var Canvas;
   var CanvasDiv;
//   var EventQueue;			//ones w/ pending notifications (events)
};
GenieConsole.prototype = {
   Set(cntrls, cnvs) {
      this.Controls = cntrls;
      this.PositionAllControls();
      if (cnvs) {
	 this.Canvas = new GenieCanvas();
	 this.Canvas.Set(cnvs);
      }
//      this.EventQueue = new Array();
   },
   CreateAndSetCanvas : function(lft, top, wdth, height, divId, cntrls) {
      //NOTE: this method might be redundant, but having the value of the div passed to the object will
      //      enable canvas to be moved
      this.Canvas = document.createElement('canvas');
//        this.CanvasDiv = document.getElementById(id); 
      this.Canvas.id = "ConsoleCanvas";
      this.Canvas.width = wdth;
      this.Canvas.height = hght;
//        canvas.style.zIndex   = 8;
      this.Canvas.style.position = "absolute";
//        canvas.style.border   = "1px solid";
      this.CanvasDiv.appendChild(this.Canvas)
      this.CanvasDiv = document.createElement("div");
//        this.CanvasDiv.className = "divGameStage";
      this.CanvasDiv.id = divId;
      this.CanvasDiv.appendChild(this.Canvas);
      document.body.appendChild(this.CanvasDiv)
      document.getElementById(this.CanvasDiv.id).style.top = top;
      document.getElementById(this.CanvasDiv.id).style.left = lft;
   },
   Clear() {
      this.Canvas.Context.clearRect(0, 0, CONTROlPANEL.WIDTH, CONTROlPANEL.HEIGHT);
   },
   PositionAllControls : function() {
      var i;
      for (i=0;i<this.Controls.length;++i) {
	 document.getElementById(this.Controls[i][CONTROL.ID]).style.position = "absolute";
         document.getElementById(this.Controls[i][CONTROL.ID]).style.top = this.Controls[i][CONTROL.TOP];
	 document.getElementById(this.Controls[i][CONTROL.ID]).style.left = this.Controls[i][CONTROL.LEFT];
      }
   },
   PositionControls : function(ControlArray) {
      var i;
      for (i=0;i<ControlArray.length;++i) {
         document.getElementById(this.Controls[i][CONTROL.ID]).style.top = this.Controls[i][CONTROL.TOP];
	 document.getElementById(this.Controls[i][CONTROL.ID]).style.left = this.Controls[i][CONTROL.LEFT];
      }
   },
   DisplayControls : function(ControlArray) {
      var i;
      for (i=0;i<ControlArray.length;++i)
	  document.getElementById(this.Controls[ControlArray[i]][CONTROL.ID]).style.visibility = "visible";
   },
   HideAllControls() {
      var i;

      for (i=0;i<this.Controls.length;++i)
	  document.getElementById(this.Controls[i][CONTROL.ID]).style.visibility = "hidden";
   },
   HideControls : function(ControlArray) {
      var i;
      for (i=0;i<ControlArray.length;++i)
	  document.getElementById(this.Controls[i][CONTROL.ID]).style.display = "none";
   },
   HideControl : function(ControlId) {
      document.getElementById(ControlId).style.display = "none";
   },
   DisableAllControls() {
      var i;

      for (i=0;i<this.Controls.length;++i)
	  document.getElementById(this.Controls[i][CONTROL.ID]).disabled = true;
   },
   DisableAndHideAllControls() {
      var i;

      for (i=0;i<this.Controls.length;++i) {
	  document.getElementById(this.Controls[i][CONTROL.ID]).style.visibility = "hidden";
	  document.getElementById(this.Controls[i][CONTROL.ID]).disabled = true;
      }
   }
};

//-----------------------------------------
//----------GENIE SCAPE--------------------
var GenieScape = function () {
   var PrimeScape;
   var ZoomScape;
   var Console;
   var GraphicsTool;
   var ScratchBuffer;
   var ScratchContext;
   var Player;
   var ZoomOn;
   var ZoomRatio;
   var ControllerA;
   var ControllerB;
   var ScrollStrips;
};
GenieScape.prototype = {
   Set(cnvs1, cnvs2, cntrls, cnvs3, gTool, bWebGL) {

      this.PrimeScape = new GenieCanvas();
      this.PrimeScape.Set(cnvs1, null, bWebGL);
      this.PrimeScape.Id = CANVAS.PRIME;
      this.ZoomScape = new GenieCanvas();
      this.ZoomScape.Set(cnvs2);
      this.ZoomScape.Id = CANVAS.ZOOM;
      this.Console = new GenieConsole();
      this.Console.Set(cntrls, cnvs3);
      if (this.Console.Canvas)
	 this.Console.Canvas.Id = CANVAS.CONSOLE;
      this.GraphicsTool = gTool;
      this.ZoomOn = false;
      this.ControllerA = null;
      this.ControllerB = null;
      this.ScrollStrips = null;
   },
   ActivateZoom : function(ratio) {
      this.ZoomOn = false;
      this.ZoomRatio = ratio;
   },
   MouseClicked: function () {
   },
   AddController(cntrls, snglFireKeys) {
      if (this.ControllerA==null) {
	 this.ActivateKeyHandler();
	 this.ControllerA = new GenieGamePad();
	 this.ControllerA.Set(cntrls, snglFireKeys);
      } else {
	 this.ControllerB = new GenieGamePad();
	 this.ControllerB.Set(cntrls, snglFireKeys);
      }
   },
   ActivateKeyHandler : function() {
      document.addEventListener("keydown", this.KeyPushed);
      document.addEventListener("keyup", this.KeyReleased);
      Keyboard.Set();
   },
   KeyPushed : function(Event) {
      Keyboard.KeyPushed(Event.keyCode);
   },
   KeyReleased : function(Event) {
      Keyboard.KeyReleased(Event.keyCode);
   },
   EnableScrolling : function(type, objcts, spcng, y, spd, rws, gps, imgs) {
//      var scroller;

//      this.ScrollStrips = new Array();
//      switch (type) {
//	 case SCROLLING.RENDER :
//	    scroller = new RenderScroller();
//	    break;
//	 case SCROLLING.MULTIRENDER :
//	    scroller = new MultiRenderScroller();
//	    break;
//	 case SCROLLING.IMAGES :
//	    scroller = new ImageScroller();
//	    break;
//      }
//      this.ScrollStrips.push(scroller);
   },
   AddScrolling : function(type) {
      var scroller;

      if (this.ScrollStrips==null)
	 this.ScrollStrips = new Array();
//      switch (type) {
//	 case SCROLLING.RENDER :
//	    scroller = new RenderScroller();
//	    break;
//	 case SCROLLING.MULTIRENDER :
//	    scroller = new MultiRenderScroller();
//	    break;
//	 case SCROLLING.IMAGES :
//	    scroller = new ImageScroller();
//	    break;
//      }
      this.ScrollStrips.push(scroller);
   },
   ScrollLeft : function() {
//      this.PrimeScape.Context.
   },
   ScrollRight : function() {
   },
   CreateScratchBuffer : function(wdth, hght) {
//      var canvas, context;

      this.ScratchBuffer = document.createElement('canvas');
      this.ScratchContext = canvas.getContext('2d');
      this.ScratchBuffer.width = wdth;
      this.ScratchBuffer.height = hght;
   },
   TrackPlayer: function() {
//	Mouse.X = 
//      this.Player.MousePositionX = Event.pageX - this.Canvas.Dimensions.left; 
//      this.Player.MousePositionY = Event.pageY - this.Canvas.Dimensions.top;

	       //If mouse within landscape, update zoomscape
   }

//	    MouseWithin: function() {
//	       if (CricketPlayer.MousePositionX >= 0) {
//	          if (CricketPlayer.MousePositionX <= CricketCanvas.Dimensions.width) {
//		     if (CricketPlayer.MousePositionY >= 0) {
//	                if (CricketPlayer.MousePositionY <= CricketCanvas.Dimensions.height) {
//			   return true;
//			   }
//		        }
//		     }
//		  }
//	       return false;
//	       }
};

//------------------------------------------
//----------SCROLL SCAPE--------------------

//----------Scrolling-----------------------------
var ScrollingInstances = function () { var Number, YGap;};	//0 repetitions means no replication
var Scroller  = function () {
   var Y;
   var Spacing;
   var Speed;
   var Index;
   var Instances;
};
Scroller.prototype = {
   Set: function(ypos, spcng, spd, rpts, ygap) {
      this.Y = ypos;
      this.Spacing = spcng;
      this.Speed = spd;		//could be per pixel, or frames per pixel if spd<1
      this.Index = 0;
      this.Instances = new ScrollingInstances();
      this.Instances.Number = rpts;
      this.Instances.YGap = ygap;
      }
};

var ImageScroller = function () {
//   var Items;		//includes blank spaces
     var Images;
     var ImageData;
     var MaxHeight;
     var TotalWidth;
};
ImageScroller.prototype = new Scroller();
ImageScroller.prototype.Set = function(imgs, imgData, pos, spcng, spd, rpts, ygap) {
   var i;

   Scroller.prototype.Set.call(this, pos, spcng, spd, rpts, ygap); 

   this.Images = imgs;
   this.ImageData = imgData;

   //Determine dimensions of strip
   this.MaxHeight = 0;
   this.TotalWidth = 0;
   for (i=0;i<this.ImageData.length;++i) {
      this.MaxHeight = Math.max(this.MaxHeight, this.ImageData[i][SCROLL.H]);
      this.TotalWidth += this.ImageData[i][SCROLL.W] + spcng;
   }
};
//don't forget bi-directional scrolling as in gj street

var RenderScroller = function () {
   var Shapes;
};
RenderScroller.prototype = new Scroller();
RenderScroller.prototype.Set = function(shpArray, pos, spcng, spd, rpts, ygap) {
   Scroller.prototype.Set.call(this, null, pos, spcng, spd, rpts, ygap); 

   this.Shapes = shpArray;
};

//TODO: get rid of above structures entirely, employ specs only; OR keep structures in case there is need to alter specs
//  or generate them in code

//--SCROLL SCAPE--
var ScrollScape = function () {
   var GraphicsTool;
   var ImageStrips;
   var GeometricStrips;
   //ISSUE: have to have vertical-horizontal thing taken care of here
};
ScrollScape.prototype = new GenieScape();
ScrollScape.prototype.Set = function(pCnvs, zCnvs, cntrls, gtool) {
   GenieScape.prototype.Set.call(this, pCnvs, zCnvs, cntrls);

   this.GraphicsTool = gtool;
};
ScrollScape.prototype.AddImageStrip = function(imgs, strp, spcs) {
   var ImageScroll;

   if (!this.ImageStrips)
      this.ImageStrips = new Array();
   ImageScroll = new ImageScroller();
   ImageScroll.Set(imgs, strp, spcs.Y, spcs.GAP, spcs.SPEED);
   this.ImageStrips.push(ImageScroll);
};
ScrollScape.prototype.AddGeometricStrip = function(specs) {
//   var RenderScroll;

//   RenderScroll = new RenderScroller();
//   RenderScroll.Set(imgs, strp, spcs.Y, spcs.GAP, spcs.SPEED);
//   this.RenderingStrips.push(RenderScroll);
   if (!this.GeometricStrips)
      this.GeometricStrips = new Array();
   this.GeometricStrips.push(specs);
};
ScrollScape.prototype.Draw = function(indx) {
   var i;

   for (i=0;i<this.ImageStrips.length;++i)
      this.DrawImageStrip(this.ImageStrips[i], indx);
   if (!this.GraphicsTool)
      return;
   else
      for (i=0;i<this.GeometricStrips.length;++i)
	 this.DrawGeometricStrip(this.GeometricStrips[i], indx);
};
ScrollScape.prototype.DrawImageStrip = function(imgStrp, indx) {
   var i, j;
   var sx, sy, x, y, wdth, hght;
   var bImg;					//indicates if image has to be drawn rather than gap
   var bFirstElement;				//first gap or image drawn
   var pxlsDrawn, pxlsToBeDrawn, wdthTrvrsd;

   //Check if indx will require imgStrp to wrap around to the beginning
//   if (indx+this.PrimeScape.Element.width>imgStrp.TotalWidth) {
//might need to see how many times strip has wrapped around
//   }
// OR reset index to 0 when restarting strip

   //Find location in image gallery from where drawing is to be started
   wdthTrvrsd = 0;
   bImg = false;
   i = 0;
   while (indx>=wdthTrvrsd)	//this is assuming we start drawing w/ an image, not the gap
      if (!bImg) {
	 wdthTrvrsd += imgStrp.ImageData[i][SCROLL.W];
	 bImg = true;
      } else {
	 wdthTrvrsd += imgStrp.Spacing;
	 bImg = false;
	 ++i;
	 if (i==(imgStrp.ImageData.length))
	    i = 0;		//see if gallery has to be rolled over
      }

   //Draw appropriate patches of image strip and gaps
   pxlsDrawn = 0;
   pxlsToBeDrawn = wdthTrvrsd - indx;
   bFirstElement = true;
   while (pxlsDrawn<this.PrimeScape.Element.width) {
      if (bImg) {
	 sx = imgStrp.ImageData[i][SCROLL.L];
	 sy = imgStrp.ImageData[i][SCROLL.T];
	 if (bFirstElement) {
	    wdth = pxlsToBeDrawn;
	    sx += imgStrp.ImageData[i][SCROLL.W] - pxlsToBeDrawn;
	 }
	 else wdth = imgStrp.ImageData[i][SCROLL.W];
	 hght = imgStrp.ImageData[i][SCROLL.H];
	 y =  imgStrp.Y + (imgStrp.MaxHeight-hght);
	 this.PrimeScape.Context.drawImage(imgStrp.Images, sx, sy, wdth, hght, pxlsDrawn, y, wdth, hght);
	 pxlsDrawn += wdth;
	 bImg = false;
	 if (i==(imgStrp.ImageData.length-1)) i = 0;	//see if gallery has to be rolled over
	 else 
	    ++i;
      } else {
	 if (bFirstElement)
	    pxlsDrawn += wdthTrvrsd - indx;
	 else
	    pxlsDrawn += imgStrp.Spacing;
	 bImg=true;
      }
	 bFirstElement = false;
   }
};
ScrollScape.prototype.DrawGeometricStrip = function(geoStrp, indx) {
   var i, j;

   for (i=0;i<geoStrp.xCOUNT;++i)
      switch (geoStrp.SHAPE) {
	 case SHAPE.RECTANGLE:
	    this.GraphicsTool.GOL.G2D.DrawRectangle(x, y, w, h, colour, lineWidth);
	    break;
	 //TODO: other shapes to be implemented later
      }
};

//   for (i=0;i<this.RenderingStrips.length;++i) this.ImageStrips[i].Draw(x);

//var MultiRenderScroller = function () {	//render scroller
//   var Rows;
//   var Gaps;
//};
//MultiRenderScroller.prototype = new RenderScroller();
//MultiRenderScroller.prototype = {
//   Set : function(shapArray, pos, spcng, rws, gps, spd) {
//      RenderScroller.prototype.Set.call(this, pos, spcng, spd); 

//      this.Rows = rws;
//      this.Gaps = gps;
//   }
//};

//scrollobject = {
//   var width;
//   var image;	//null if a space, otherwise a pointer to a mass sprite, or dummy sprite
//};
//function will scan array from beginning till desired x is found "within" an object, then draw it, keep a record of such

var OldScrollScape = function () {
   var Background;
   var Ground;
   var Speed;
   var Intervals;
   var BookEnd;
   var Span;
};
OldScrollScape.prototype = {
   Set: function(bckgrnd, grnd, speed, intrvls, bknd) {
      var i;

      //Set all attributes
      this.Background = bckgrnd;
      this.Ground = grnd;
      this.Speed = speed;
      this.Intervals = intrvls;
      this.BookEnd = bknd;

      //Calculate length of scrollscape
      this.Span = 0;
      for (i=0;i<this.Background.length;++i) {
//	  this.Span += this.Background[i].pic.width + this.Intervals;
      }
      if (this.BookEnd) {
	 this.Span += this.Intervals;
      } else {
	 this.Span -= this.Intervals;
      }
   },
   Draw : function(x) {
      //First check if haven't scrolled off the screen
//      this.Pic.src = src;
//      this.Context.drawImage(this.Pic, sx, sy, this.Width, this.Height, this.Left, this.Top, this.Width, this.Height);
   }
};
