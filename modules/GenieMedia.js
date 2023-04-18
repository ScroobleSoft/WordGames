
//-----------------------------------------------------
//---------- IMAGE LOADING MONITOR --------------------
var GenieImageManager = function () {
   var Pics;
   var Srcs;
   var ImagesLoaded;
   var AnimationFrameHandle;
};
GenieImageManager.prototype = {
   Set(srcs) {
      this.Pics = new Array();
      this.Srcs = srcs;
      this.AllLoaded = false;
      this.ImagesLoaded = 0;
   },
   LoadImages(pics) {
      var i;
      var img;

      for (i=0;i<this.Srcs.length;++i) {
	 img = new Image();
	 this.Pics.push(img);
	 this.Pics[i].addEventListener("load", this.Loaded.bind(this));	 
	 this.Pics[i].src = this.Srcs[i];
      }
   },
   Loaded() {
      ++this.ImagesLoaded;
   },
   Check() {

      this.AnimationFrameHandle = requestAnimationFrame(this.Check.bind(this));

      if (this.ImagesLoaded==this.Srcs.length) {
	 this.AllLoaded = true;
	 cancelAnimationFrame(this.AnimationFrameHandle);
      }
   }
};
ImageManager = new GenieImageManager();

//--------------------------------------------
//-----------STATIC IMAGES--------------------
var StaticImage = function () {
   var Context;
   var Pic;
   var Left, Top;
   var Width, Height;
   var X, Y;
   var PatchWidth, PatchHeight;
   var Rows, Columns;
   var Offset;
   var Specs;
};
StaticImage.prototype = {
   Set(context, pic, specs) {
      this.Context = context;
      this.Pic = pic;
      if (specs) {
	 this.Left = specs.L || 0;
	 this.Top = specs.T || 0;
	 this.Width = specs.W || 0;
	 this.Height = specs.H || 0;
	 this.X = specs.X || 0;
	 this.Y = specs.Y || 0;
	 this.Specs = specs;
      }
   },
   GetSpecs() {
      var sLeft, sTop;
      var sWidth, sHeight;
      var coordx, coordy;

      sLeft = this.Left ? this.Left : this.Specs.L;
      sTop = this.Top ? this.Top : this.Specs.T;
      sWidth = this.Width ? this.Width : this.Specs.W;
      sHeight = this.Height ? this.Height : this.Specs.H;
      coordx = this.X ? this.X : this.Specs.X;
      coordy = this.Y ? this.Y : this.Specs.Y;

      return ( { left: sLeft, top: sTop, width: sWidth, height: sHeight, x: coordx, y: coordy } );
   },
   GetWidth() {
      if (!this.Width && !this.Specs.W)
	 return (null);
      else
	 return (this.Width ? this.Width : this.Specs.W);
   },
   GetHeight() {
      if (!this.Height && !this.Specs.H)
	 return (null);
      else
	 return (this.Height ? this.Height : this.Specs.H);
   },
   GetPatchSpecs() {
      var nRows, nCols;
      var pWidth, pHeight, pOffset;

      nRows = this.Rows ? this.Rows : this.Specs.R;
      nCols = this.Columns ? this.Columns : this.Specs.C;
      pWidth = this.Width ? this.PatchWidth : this.Specs.PW;
      pHeight = this.Height ? this.PatchHeight : this.Specs.PH;
      pOffset = this.Offset ? this.Offset : this.Specs.O;

      return ( { rows: nRows, cols: nCols, width: pWidth, height: pHeight, offset: pOffset } );
   },
   Draw(x, y) {
      var picX, picY;
      var specs;

      specs = this.GetSpecs();
      picX = x || specs.x;
      picY = y || specs.y;
      if (picX===undefined)
	 picX = 0;
      if (picY===undefined)
	 picY = 0;
//      if (!picX || !picY)	//ISSUE: still do need a check, but for 'null' or 'NaN/undefined'
//	 return;
      if (specs.left)
	 this.DrawPatch(specs.left, specs.top, specs.width, specs.height, picX, picY);
      else
//	 if (this.Width && this.Height)
//	    this.Context.drawImage(this.Pic, picX, picY, this.Width, this.Height);
//	 else
	    this.Context.drawImage(this.Pic, picX, picY);
   },
   DrawPatch(sx, sy, wdth, hght, x, y) {
      var picX, picY;

      picX = x || this.X;
      picY = y || this.Y;
      this.Context.drawImage(this.Pic, sx, sy, wdth, hght, picX, picY, wdth, hght);
   },
   DrawPatchNumber(ptchNum, x, y) {
      var specs;
      var row, col;
      var sx, sy;

      specs = this.GetPatchSpecs();
      row = Math.floor(ptchNum/specs.cols);
      col = ptchNum % specs.cols;
      sx = col*(specs.width+specs.offset);
      sy = row*(specs.height+specs.offset);
      this.DrawPatch(sx, sy, specs.width, specs.height, x, y);
   },
   Blur() {
      //TODO: a blurry (pixelated) fade-in (and -out) for an image, useful effect when trying to resolve a clue for example
   },
   Clear() {  //complements ::Blur
   }
};

//---------------------------------------------
//----------- STATIC IMAGE --------------------
var StaticImage2 = function () {
   var Context;
   var Pic;
   var Specs;
   var Left, Top;
};
StaticImage2.prototype = {
   Set(context, pic, specs) {
      this.Context = context;
      this.Pic = pic;
      this.Specs = specs;
      this.Left = this.Specs.L || 0;
      this.Top = this.Specs.T || 0;

      //ISSUE: if height and width are not declared in specs, they'll have to be determined and stored here
   },
   Draw(x, y, scale) {
      if (this.Specs) {
	 x = x || this.Specs.X;
	 y = y || this.Specs.Y;
      }
      x = x || 0;
      y = y || 0;
      if (scale)
	 this.Context.drawImage(this.Pic, this.Left, this.Top, this.Specs.W, this.Specs.H, x, y, scale*this.Specs.W, scale*this.Specs.H);
      else
	 this.Context.drawImage(this.Pic, this.Left, this.Top, this.Specs.W, this.Specs.H, x, y, this.Specs.W, this.Specs.H);
   },
   DrawAligned(x, y, alignnmet) {
      switch (alignnmet) {
	 case ALIGNMENT.BOTTOmCENTRE:
	    this.Draw(x-(this.Specs.W/2), y-this.Specs.H);
	    break;
      }
   },
   DrawPatch(x, y, sx, sy, w, h) {  //UNTESTED
      if (this.Specs) {
	 x = x || this.Specs.X;
	 y = y || this.Specs.Y;
      }
      x = x || 0;
      y = y || 0;
      this.Context.drawImage(this.Pic, this.Left+sx, this.Top+sy, w, h, x, y, w, h);
   }
};

//-------------------------------------------
//-----------STATIC SHAPE--------------------
var StaticShape = function () {
   var Context;
   var GraphicsTool;
   var OriginalSpecs;
   var Specs;
   var X, Y;

   var specs;
};
StaticShape.prototype = {
   Set(cntxt, gTool, specs) {
      this.Context = cntxt;
      this.GraphicsTool = gTool;
      this.OriginalSpecs = specs;
      this.Specs = Object.assign( {}, this.OriginalSpecs);
   },
   ReverToOriginalSpecs() {
      this.Specs = null;	//ISSUE: make sure this is being garbage collected
      this.Specs = Object.assign( {}, this.OriginalSpecs);
   },
   Draw(x, y) {

      //Check if x, y supplied, otherwise use default
      x = x || this.X;
      y = y || this.Y;

      switch(this.Specs.SHAPE) {
	 case SHAPE.LINE:
	    break;
	 case SHAPE.CIRCLE:
	    break;
	 case SHAPE.TRIANGLE:
	    break;
	 case SHAPE.RECTANGLE:
	    break;
	 case SHAPE.DIAMOND:
	    break;
	 case SHAPE.POLYGON:
	    break;
	 case SHAPE.HEXAGON:
	    break;
	 case SHAPE.OCTAGON:
	    break;
	 case SHAPE.IRREGULAR:
	    break;
      }
   }
};

//-------------------------------------------
//---------- GENIE SOUND --------------------
var GenieSound = function () {
   var Audio;
   var Active;
};
GenieSound.prototype = {
   Set(sSrc) {  //s- src
      this.Audio = document.createElement("audio");
      this.Audio.src = sSrc;
      this.Audio.setAttribute("preload", "auto");
      this.Audio.style.display = "none";
      document.body.appendChild(this.Audio);
   },
   Play() {
      this.Active = true;
      this.Audio.play();
   },
   Stop() {
      this.Audio.pause();
      this.Audio.currentTime = 0;
      this.Active = false;
   },
   CheckStopped() {
      if (this.Audio.ended)
	 this.Active = false;
      return (!this.Active);
   }
};

//--------------------------------------------
//---------- SOUND CHAIN ---------------------
var SoundChain = function() {
   var ClipSrc;
   var Clips;
};
SoundChain.prototype = {
   Set(sSrc) {  //s- sound
      var sound;

      this.ClipSrc = sSrc;
      this.Clips = new Array();
      sound = new GenieSound();
      sound.Set(this.ClipSrc);
      this.Clips.push(sound);
   },
   Play() {

      //LOGGED

      var i;

      //TODO: go through list and see if any clip has stopped playing (might need to add a field), add to list if none found
      //ISSUE: UNRESOLVED whether this is needed, since it is possible js simply restarts and plays same clip again even if
      //  multiple instance of it are created (hard to tell for sure by simply listening); honestly, if it is doing that,
      //  overall purpose is more or less achieved
   }
};
