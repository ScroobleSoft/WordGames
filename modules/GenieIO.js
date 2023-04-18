
//-------------------------------------------
//---------- GENIE MOUSE --------------------
var GenieMouse = function () {
   var X, Y;
   var Click, Down;				//coords
   var Downed, Moved;				//flags
   var LeftClicked, RightClicked;		//flags
   var LeftDoubleClicked, RightDoubleClicked;	//flags
   var CanvasId;
};
GenieMouse.prototype = {
   Set() {

      this.Click = new Coordinate2D();
      this.Down = new Coordinate2D();
   },
   GetCoordinates(coords) {

      if (coords)
	 coords.Set(this.X, this.Y);
      else
	 return ( { X: this.X, Y: this.Y } );
   },
   GetClickCoordinates(coords) {
      if (coords)
	 coords.Set(this.Click.X, this.Click.Y);
      else
	 return ( { X: this.Click.X, Y: this.Click.Y } );
   },
   CheckClicked(id) {  //NOTE: just check if canvas is clicked without clearing anything

      if (id)
	 if (this.CanvasId!=id)
	    return(false);

      return (this.LeftClicked | this.RightClicked);
   },
   CheckLeftClicked(id) {

      if (id)
	 if (this.CanvasId!=id)
	    return(false);

      if (this.LeftClicked) {
	 this.LeftClicked = false;
	 return (true);
      } else
	 return (false);
   },
   CheckRightClicked(id) {

      if (id)
	 if (this.CanvasId!=id)
	    return(false);

      if (this.RightClicked) {
	 this.RightClicked = false;
	 return (true);
      } else
	 return (false);
   },
   CheckDowned(id) {

      if (id)
	 if (this.CanvasId!=id)
	    return(false);

      if (this.Downed) {
	 this.Downed = false;
	 return (true);
      } else
	 return (false);
   },
   CheckMoved(id) {

      if (id)
	 if (this.CanvasId!=id)
	    return(false);

      if (this.Moved) {
	 this.Moved = false;
	 return (true);
      } else
	 return (false);
   },
   ClickedIn(rct) {  //TODO: REDUNDANT
//      return (Utilities.PointInBox( { X: this.ClickX, Y: this.ClickY }, rct ));
      return (Utilities.PointInBox( { X: this.Click.X, Y: this.Click.Y }, rct ));
   },
   CheckBoxClicked(rct) {
//      return (Utilities.PointInBox( { X: this.ClickX, Y: this.ClickY }, rct ));
      return (Utilities.PointInBox( { X: this.Click.X, Y: this.Click.Y }, rct ));
   },
   CheckOverCircle(cCentre, cRadius, cnvs) {
      if (this.CanvasId==cnvs)
	 return (Utilities.CheckPointInCircle(this, cCentre, cRadius));
      else
	 return (false);
   },
   ClearClicks() {

      this.LeftClicked = false;
      this.RightClicked = false;
      this.LeftDoubleClicked = false;
      this.RightDoubleClicked = false;
   },
   ClearDownings() {

      this.Downed = false;
   }
};
Mouse = new GenieMouse();
Mouse.Set();

//--------------------------------------------
//----------GENIE KEYBOARD--------------------
var GenieKey = function() {
   var Code;
   var State;
   var Action;
};
GenieKey.prototype.Set = function(code, action) {
   this.Code = code;
   this.State = KEySTATE.READY;
   this.Action = action || KEyPRESS.CONTINUOUS;
};

var NewGenieKeyboard = function () {
   var Keys;
};
NewGenieKeyboard.prototype = {
   Set() {
      this.Keys =  new Array();
   },
   DesignateSingleFireKeys(keyArray) {
      var i;
      var key;

      for (i=0;i<keyArray.length;++i) {
	 key = new GenieKey();
	 key.Set(keyArray[i], KEyPRESS.SINGLeFIRE);
	 this.Keys.push(key);
      }
   },
   KeyPushed(keycode) {
      var key;

      key = this.GetKey(keycode);
      if (!key) {
	 key = new GenieKey();
	 key.Set(keycode, KEyPRESS.CONTINUOUS);
	 key.State = KEySTATE.PRESSED;
	 this.Keys.push(key);
      } else {
	 if (key.State==KEySTATE.READY)
	    key.State = KEySTATE.PRESSED;
      }
    },
   KeyReleased(keycode) {
      var i;

      for (i=0;i<this.Keys.length;++i)
	 if (this.Keys[i].Code==keycode) {
	    this.Keys[i].State = KEySTATE.READY;
	    return;
	 }
   },
   GetKey(keycode) {
      var i;

      for (i=0;i<this.Keys.length;++i)
	 if (this.Keys[i].Code==keycode)
	    return (this.Keys[i]);

      return (null);
   },
   CheckKeyPressed(keyCode) {
      var key;
      var bKeyPressed;

      key = this.GetKey(keyCode);
      if (!key)
	 return (false);
      else {
	 bKeyPressed = (key.State==KEySTATE.PRESSED);
	 if (bKeyPressed && (key.Action==KEyPRESS.SINGLeFIRE))
	    key.State = KEySTATE.FIRED;
	 return (bKeyPressed);
	 }
   }
};

var GenieKeyboard = function () {
   var KeysPressed;
   var KeysReleased;
};
GenieKeyboard.prototype = {
   Set() {
      this.KeysPressed =  new Array();
   },
   ActivateSingleFire(allKeys) {
      if (!this.KeysReleased)
	 if (allKeys)
	    this.KeysReleased = Utilities.CreateArray(KEY.COUNT);
	 else
	    this.KeysReleased = new Array();
   },
   DesignateSingleFire(keyArray) {
      
   },
   KeyPushed(keycode) {
      if (!this.KeyDown(keycode))
	 this.KeysPressed.push(keycode);
    },
   KeyReleased(keycode) {
      var i;
      var key;

      for (i=0;i<this.KeysPressed.length;++i)
	 if (this.KeysPressed[i]==keycode) {
	    key = this.KeysPressed.splice(i, 1);
//	    if (this.KeysReleased)
//	       this.KeysReleased(key);
	    break;
	 }
   },
   KeyDown(keycode) {
      var i;

      for (i=0;i<this.KeysPressed.length;++i)
	 if (this.KeysPressed[i]==keycode)
	       return true;

      return false;
   }
};
Keyboard = new NewGenieKeyboard();

//-------------------------------------
//----------GAMEPAD--------------------

//--CONTROL PAD--	LOOKS REDUNDANT
var ControlPad = function() {
   var Left, Up, Right, Down, LeftClick, RightClick;
};
ControlPad.prototype.Set = function() {
   this.Left = true; this.Right = true; this.Up = true; this.Down = true; this.LeftClick = true; this.RightClick = true;
};

//--GENIE GAME PAD--
var GenieGamePad = function() {
   var Left;
   var Up;
   var Right;
   var Down;
   var LeftClick;
   var RightClick;
   var TopLeft, TopRight, BottomLeft, BottomRight;	//numeric keypad
   var Controls;
//   var KeysPrimed;
//   var SingleFire;	//IMPLEMENTATION NOTE: might need to be a two element array w/ key id and state
//   var KeysState;
};
GenieGamePad.prototype = {
   Set(cntrls, snglFireKeys) {
      this.ResetControls();
      this.Controls = cntrls || GAMePAD.ARROWS;
      if (snglFireKeys)
	 Keyboard.DesignateSingleFireKeys(snglFireKeys);
   },
   ResetControls() {
      this.Left = false;
      this.Up = false;
      this.Right = false;
      this.Down = false;
      this.LeftClick = false;
      this.RightClick = false;
      this.TopLeft = false;
      this.TopRight = false;
      this.BottomLeft = false;
      this.BottomRight = false;
   },
   CheckControls() {
      this.ResetControls();
      if (this.Controls==GAMePAD.ARROWS) {
/*	 if (Keyboard.KeyDown(ARROwPAD.LEFT)) {  //ISSUE: highly experimental!!!
	    if (this.KeysPrimed) {
	       if (this.KeysPrimed.Left) {
		  this.Left = true;
		  this.KeysPrimed.Left = false;
	       }
	    } else
	       this.Left = true;
	 } else {
	    if (this.KeysPrimed)
	       this.KeysPrimed.Left = true;
	 }
*/
//
	 if (Keyboard.CheckKeyPressed(ARROwPAD.LEFT))	    this.Left = true;
	 if (Keyboard.CheckKeyPressed(ARROwPAD.RIGHT))      this.Right = true;
	 if (Keyboard.CheckKeyPressed(ARROwPAD.UP))         this.Up = true;
	 if (Keyboard.CheckKeyPressed(ARROwPAD.DOWN))       this.Down = true;
	 if (Keyboard.CheckKeyPressed(ARROwPAD.CLICkLEFT))  this.LeftClick = true;
	 if (Keyboard.CheckKeyPressed(ARROwPAD.CLICkRIGHT)) this.RightClick = true;
/*
	 if (Keyboard.KeyDown(ARROwPAD.LEFT))       this.Left = true;
	 if (Keyboard.KeyDown(ARROwPAD.RIGHT))      this.Right = true;
	 if (Keyboard.KeyDown(ARROwPAD.UP))         this.Up = true;
	 if (Keyboard.KeyDown(ARROwPAD.DOWN))       this.Down = true;
	 if (Keyboard.KeyDown(ARROwPAD.CLICkLEFT))  this.LeftClick = true;
	 if (Keyboard.KeyDown(ARROwPAD.CLICkRIGHT)) this.RightClick = true;
*/
/*
	 if (Keyboard.CheckKeyPressed(ARROwPAD.LEFT))
//	    if (this.CheckKeyReady(KEY.LEFT))
	       this.Left = true;
	 if (Keyboard.KeyDown(ARROwPAD.RIGHT))      this.HandleKeyPress(this.Right);
	 if (Keyboard.KeyDown(ARROwPAD.UP))         this.HandleKeyPress(this.Up);
	 if (Keyboard.KeyDown(ARROwPAD.DOWN))       this.HandleKeyPress(this.Down);
	 if (Keyboard.KeyDown(ARROwPAD.CLICkLEFT))  this.HandleKeyPress(this.LeftClick);
	 if (Keyboard.KeyDown(ARROwPAD.CLICkRIGHT)) this.HandleKeyPress(this.RightClick);
*/
      }
      if (this.Controls==GAMePAD.WASD) {
/*
	 if (Keyboard.KeyDown(WASdPAD.LEFT)) {
	    this.Left = true;
	 }
	 if (Keyboard.KeyDown(WASdPAD.RIGHT)) {
	    this.Right = true;
	 }
	 if (Keyboard.KeyDown(WASdPAD.UP)) {
	    this.Up = true;
	 }
	 if (Keyboard.KeyDown(WASdPAD.DOWN)) {
	    this.Down = true;
	 }
	 if (Keyboard.KeyDown(WASdPAD.CLICkLEFT)) {
	    this.LeftClick = true;
	 }
	 if (Keyboard.KeyDown(WASdPAD.CLICkRIGHT)) {
	    this.RightClick = true;
	 }
*/
	 if (Keyboard.CheckKeyPressed(WASdPAD.LEFT))	   this.Left = true;
	 if (Keyboard.CheckKeyPressed(WASdPAD.RIGHT))      this.Right = true;
	 if (Keyboard.CheckKeyPressed(WASdPAD.UP))         this.Up = true;
	 if (Keyboard.CheckKeyPressed(WASdPAD.DOWN))       this.Down = true;
	 if (Keyboard.CheckKeyPressed(WASdPAD.CLICkLEFT))  this.LeftClick = true;
	 if (Keyboard.CheckKeyPressed(WASdPAD.CLICkRIGHT)) this.RightClick = true;
      }
      if (this.Controls==GAMePAD.NUMERIC) {
	 if (Keyboard.CheckKeyPressed(NUMERIcPAD.LEFT))        this.Left = true;
	 if (Keyboard.CheckKeyPressed(NUMERIcPAD.RIGHT))       this.Right = true;
	 if (Keyboard.CheckKeyPressed(NUMERIcPAD.UP))          this.Up = true;
	 if (Keyboard.CheckKeyPressed(NUMERIcPAD.DOWN))        this.Down = true;
	 if (Keyboard.CheckKeyPressed(NUMERIcPAD.TOpLEFT))     this.TopLeft = true;
	 if (Keyboard.CheckKeyPressed(NUMERIcPAD.TOpRIGHT))    this.TopRight = true;
	 if (Keyboard.CheckKeyPressed(NUMERIcPAD.BOTTOmLEFT))  this.BottomLeft = true;
	 if (Keyboard.CheckKeyPressed(NUMERIcPAD.BOTTOmRIGHT)) this.BottomRight = true;
      }
   },
   HandleKeyPress(key, keyPrimeState) {
      if (keyPrimeState) {
	 key = true;
	 keyPrimeState = false;
      }
   },
   CheckKeyReady(key) {
      if (!this.KeysState)
	 return (true);
      else {
	 if (this.SingleFire)
//	    switch (key) {
	       //check all keys individually
	    var temp = 0;
//	    }
	 else
	    //check if key is in array, check its state
	    var temp = 0;
      }
   }
};
