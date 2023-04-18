/*
 *  .TODO: FOV can be an attribute when listing the strengths and weaknesses of various units - this would be really
 *   valuable in a game where can deploy units and leave them to their own devices, particularly if they have larger
 *   sensitivity radii
 *  .Range, Reductiveness, Reload, Resilience - for combat agents
 *  .back-tracking at half-speed
 */
//-------------------------------------------
//---------- GENIE AGENT --------------------
var GenieAgent = function() {
   var Unit;		/* SETTABLE */	//Contains .Mission attribute
   var Specs;
   var Sprite;
   var Form;		//Type-Value pairs will be useful, so FLIPPED-orientation / SCALED-scale / ROTATED - angle etc
   var SpriteOffset;
   var ScreenCoords;
   var Angle;
   var OriginalSpecs;
   var Selected;		//TODO: move to .Status
//   var SelectionOffset;	  now REDUNDANT
   var ToolTip;		/* INFO */
   var Target;
   var Extant;
   var Visible;		//whether it is currently on-screen or not
   var Frames;		//ISSUE: would like to use .Extant exclusively and hope there is no need for this

   //Location and movement
   var Perspective;
   var BottomLeftOffset;	//coordinates
   var CentreOffset;
   var BoundingBox;		//NOTE: valuable for selecting via clickes, and for depth sorting, particularly with lasers
   var MoveBox;			//indicates space occupied once move is completed
   var Footprint;		//NOTE: actual box used for collision detection
   var Path;
   var PathNode;		//last visited node

   //Links
   var ScreenRect;
   var InfoBox;
   var ControlPanel;
   var GraphicsTool;
   var TextWriter;
   var CalcPad;
   var Space;			//includes LOS calculation facility
   var SpriteList;
   var Controller;
   var Randomizer;
   var Owner;			//NOTE: pointer to parent . . . to be REDUNDANT
   var Buffer;

   var Foes, Comrades;		//ISSUE: hope these make part of GameSpace REDUNDANT

   //State
   var State;
   var Status;			//EXTANT: 1, VISIBLE: 2; (TRANSFORM) DIRECT: 4, SPRITeBUFFER: 8, TRANsBUFFER: 16; (KEYSTROKE) DISCRETE: 32, CONTINUOUS: 64
   var Stance;			//AGGRESSIVE/DEFENSIVE/PASSIVE etc
   var DrawState;
   var Animation;

   //Behaviour packs
   var Turn;
   var Vision;
   var Location;
   var Tracking;
   var Targeting;
   var PathFinding;
   var Sensitivity;

//   var Selection;	NOTE: not to be used for now - will come into play if SelectionPack is used

   //Combat
   var Cannon;
   var RocketLauncher;
   var Artillery;
   var MissilePod;
   var Shield;
   var Explosion;

//NOTE: Elevation becomes important for lobbed items to see when they might come in contact with units, whether or not
//	they are the intended target

   var i, j, k, x, y, distance;
};
GenieAgent.prototype = new MobileObject();
GenieAgent.prototype.Set = function(pos, dstn, drctn, specs, sprite, unit) {
   var speed;
   var turn;

   this.Specs = specs;
   if (this.Specs) {
      speed = this.Specs.SPEED || 0;
      turn = this.Specs.TURN ? this.Specs.TURN.A : 0;
      pos = pos || this.Specs.POSITION;
      dstn = dstn || this.Specs.DESTINATION;
      drctn = drctn || this.Specs.DIRECTION;
/*
      if (this.Specs.X) {
	 this.Position.X = this.Specs.X;
	 this.Position.Y = this.Specs.Y;
      }
*/
   }
   MobileObject.prototype.Set.call(this, speed, pos, dstn, drctn, turn);

   this.Sprite = sprite;
   this.Unit = unit;

   this.State = new AgentState();
   this.State.Motion = STATE.MOTION.STATIONARY;
   this.PathNode = -1;

   this.ScreenCoords = new Coordinate2D();
   this.BoundingBox = new GenieRect();
   this.Footprint = new GenieRect();

   if (this.Specs) {
      this.ActivatePacks();
      this.SetAlignmentOffsets();
   }
};
GenieAgent.prototype.SetLinks = function(sRect, iBox, gTool, cPad, gSpace, pFinder, sList, cPanel, tWriter, cntrllr, rGenerator, buffer) {
//GenieAgent.prototype.SetLinks = function(rGenerator, iBox, cPanel, gTool, tWriter, cPad, sList, sRect, cntrllr, gSpace, pFinder, buffer) {
   this.ScreenRect = sRect;
   this.InfoBox = iBox;
   this.ControlPanel = cPanel;
   this.GraphicsTool = gTool;
   this.TextWriter = tWriter;
   this.CalcPad = cPad;
   this.Space = gSpace;
   this.PathFinder = pFinder;
   this.SpriteList = sList;
   this.Controller = cntrllr;
   this.Randomizer = rGenerator;
   this.Buffer = buffer;
};
GenieAgent.prototype.SetPosition = function(pos) {
   MobileObject.prototype.SetPosition.call(this, pos);

   this.DetermineScreenCoords();
};
GenieAgent.prototype.SetDestination = function(dstn) {
   MobileObject.prototype.SetDestination.call(this, dstn);

   this.State.Motion = STATE.MOTION.ADVANCING;
};
GenieAgent.prototype.MakeSpecsUnique = function() {
   this.OriginalSpecs = this.Specs;
   this.Specs = Object.assign({}, this.Specs);		//UNTESTED!
};
GenieAgent.prototype.AddSpecs = function(specs, prop) {
   if (!(prop in specs))  //in first instance, create new set of specs to act as model for units of this type
      specs = Object.assign({}, this.Specs, specs);
   this.Specs = specs;
};
GenieAgent.prototype.ActivatePacks = function() {
/*
   switch (this.Specs.TYPE) {  //possibly REDUNDANT
      case ACTIVePACK.SELECTION:
	 this.ActivateSelectionPack();
	 break;
   }
   if (this.Specs.LOCATION)
      this.ActivateLocationPack();
*/
   if (this.Specs.CONTROLLER)
      this.Controller = this.Specs.CONTROLLER.TOOL;	//ISSUE: doesn't work
   if (this.Specs.AVOIDANCE)
      this.MoveBox = new GenieRect();	//ISSUE: MoveBox is already being created elsewhere
   if (this.Specs.SELECTION) {
//      this.ActivateSelectionPack();  right now REDUNDANT
      this.SelectionOffset = new Coordinate2D();
      this.SelectionOffset.Set(0, 0);
      if (!this.Specs.SELECTION.SHAPE || this.Specs.SELECTION.SHAPE==SHAPE.CIRCLE) //{  needs to be TESTED
	 if (!this.Sprite.Diagonal)
	    this.Sprite.SetDiagonal();
   }
/*
      } else if (this.Specs.SELECTION.SHAPE==SHAPE.CIRCLE)
	 if (!this.Sprite.Diagonal)
	    this.Sprite.SetDiagonal();
*/
   if (this.Specs.ANIMATION)
      this.ActivateAnimationPack();
   if (this.Specs.SENSITIVITY)
      this.ActivateSensitivityPack();
   if (this.Specs.TRACKING)
      this.ActivateTrackingPack();
   if (this.Specs.TARGETING)
      this.ActivateTargetingPack();
   if (this.Specs.CANNON) {
//      this.ActivateCannonPack();
      this.Cannon = new GenieCannon();
      this.Cannon.Set(this.Specs.CANNON, this);
   }
   if (this.Specs.ROCKET) {
//      this.ActivateRocketPodPack();
      this.RocketLauncher = new GenieRocketLauncher();
      this.RocketLauncher.Set(this.Specs.ROCKET, this);
   }
   if (this.Specs.SHIELD)
      this.ActivateShieldPack();
   if (this.Specs.EXPLOSION)
      this.ActivateExplosionPack();
};
GenieAgent.prototype.SetAlignmentOffsets = function() {
   var x, y;

   x = 0;
   y = 0;
   if (this.Specs.ALIGN) {
      this.SpriteOffset = new Coordinate2D();
      switch (this.Specs.ALIGN) {	//TODO: only implementing a few cases for now
/*	 case ALIGNMENT.BOTTOmLEFT:
	    x = 0;
	    y = 0;
	    break;
*/
	 case ALIGNMENT.TOpLEFT:
	    y += 1;
	    break;
	 case ALIGNMENT.BOTTOmCENTRE:
	    x -= 0.5;
	   break;
	 case ALIGNMENT.CENTRE:
	    x -= 0.5;
	    y += 0.5;
	   break;
      }
   }

   if (this.Sprite.DrawStart) {
      switch (this.Sprite.DrawStart) {  //NOTE: not sure if there will ever be more than 3 cases
	 case ALIGNMENT.TOpLEFT:
	    y -= 1;
	    break;
	 case ALIGNMENT.CENTRE:
	    x += 0.5;
	    y -= 0.5;
	    break;
      }
      if (this.SpriteOffset) {
	 this.SpriteOffset.X = x*this.Sprite.Width;
	 this.SpriteOffset.Y = y*this.Sprite.Height;
      }
      //ISSUE: this is for centred shapes like circles and hexes; for squares no adjustment will be needed (TODO)
      //       also, for BattleBase would like to use a triangle, but that can be done via over-ride
      //       at some point diamond will also be used, although that can be accomplished via variable opacity sprite
//      if (this.SelectionOffset) {
//	 this.SelectionOffset.X = (x+1)*this.Sprite.Width/2;
//	 this.SelectionOffset.Y = (y-1)*this.Sprite.Height/2;
//      }
   } else {  //defaults to BOTTOmLEFT
      if (this.SpriteOffset) {
	 this.SpriteOffset.X = x*this.Sprite.Width;
	 this.SpriteOffset.Y = y*this.Sprite.Height;
      }
//      if (this.SelectionOffset) {
//	 this.SelectionOffset.X = (x+1)*this.Sprite.Width/2;
//	 this.SelectionOffset.Y = (y-1)*this.Sprite.Height/2;
//      }
   }

   this.DetermineLocationOffsets(x, y);
   if (this.SelectionOffset) {
      this.SelectionOffset.X = (x+1)*this.Sprite.Width/2;
      this.SelectionOffset.Y = (y-1)*this.Sprite.Height/2;
   }
};
GenieAgent.prototype.Clone = function(agent) {
   this.Set(null, null, null, agent.OriginalSpecs || agent.Specs, agent.Sprite);
//   this.SpriteAlignment = agent.SpriteAlignment;
   this.InfoBox = agent.InfoBox;
   this.GraphicsTool = agent.GraphicsTool;
   this.CalcPad = agent.CalcPad;
   this.Space = agent.Space;
   this.PathFinder = agent.PathFinder;
   this.SpriteList = agent.SpriteList;
};
//----------
//-- DRAW --
//----------
GenieAgent.prototype.Draw = function(state, zoom) {
/* TODO: can replace entire method with -
   this.DetermineScreenCoords();
   this.QuickDraw();
*/
   if (state==null)
      if (this.Animation)
	 state = this.Animation.State;

   //ISSUE: DrawState most likely REDUNDANT

   //Determine screen coordinates based on map area selected
   if (this.ScreenRect) {
      this.ScreenCoords.X = this.Position.X - this.ScreenRect.L;
      this.ScreenCoords.Y = this.Position.Y - this.ScreenRect.T;
   } else {
      this.ScreenCoords.X = this.Position.X;
      this.ScreenCoords.Y = this.Position.Y;
   }

   //Adjust coordinates for game perspective and/or zoom . . . TODO: want to ditch zoom and handle it in sub-classes
   if (this.Space || zoom) {  //this should be REDUNDANT when Perspective addition is complete
      this.ScreenCoords.X -= this.Space.ScreenSize.X/2;
      this.ScreenCoords.Y = (this.Space.ScreenSize.Y/2) - this.ScreenCoords.Y;
      if (zoom) {
	 this.ScreenCoords.X /= zoom;
	 this.ScreenCoords.Y /= zoom;
      }
      this.Space.MapTopDownToPerspective(this.ScreenCoords);
   }

   if (this.Perspective)
      GeoUtils.PerspectiveAdjust(this.ScreenCoords, this.Perspective);

   //Adjust coordinates for sprite alignment
   if (this.Status & STATUS.TRANSFORM.TRANsBUFFER) {  //NOTE: always going to align with centre coords if buffer is used

      //*** HACK! ***
      if (!this.CentreOffset) {
	 this.CentreOffset = new Coordinate2D();
	 this.CentreOffset.Set(0,0);
      }
      //*** HACK! ***

      this.ScreenCoords.X += this.CentreOffset.X;
      this.ScreenCoords.Y += this.CentreOffset.Y;
/*							//TODO: .SpriteOffset may be REDUNDANT, but need to be 100% sure
      if (!this.Form.Type) {
	 this.ScreenCoords.X += this.SpriteOffset.X;
	 this.ScreenCoords.Y += this.SpriteOffset.Y;
      }
*/
   } else if (this.SpriteOffset) {
      this.ScreenCoords.X += this.SpriteOffset.X;
      this.ScreenCoords.Y += this.SpriteOffset.Y;
   }

   //Factor in possible elevation
   if (this.OnParabolicPath)
     this.ScreenCoords.Y -= this.Elevation;		//ISSUE: don't have to be on parabolic path to be elevated
   else if (this.Elevation)  //TODO: probably will only adjust .Elevation even if .OnParabolicPath (taken care of in ::Update)
     this.ScreenCoords.Y -= this.Elevation;

   //Check if stationary
   if (this.State.Motion===STATE.MOTION.STATIONARY) {
      this.ScreenCoords.X = Math.round(this.ScreenCoords.X);
      this.ScreenCoords.Y = Math.round(this.ScreenCoords.Y);
   }
/*
   //ISSUE: this is fine unless it is turning and TURN.IMAGE.TRANSFORM is selected, and DrawRotate needs to be called
   if (zoom)
      this.Sprite.DrawResized(this.ScreenCoords.X, this.ScreenCoords.Y, 1/zoom, state);
   else
      this.Sprite.Draw(this.ScreenCoords.X, this.ScreenCoords.Y, state);
   //ISSUE: something similar may have to be done with .Angle if rotation is to be implemented; NOTE: if multiple
   //       transformations are needed, should probably make it a discrete zoom, and then use buffered forms
*/
   if (this.Form)
      if (this.Form.Type) {
	 this.DrawTransformed(state);
	 return;
      }

   this.Sprite.Draw(this.ScreenCoords.X, this.ScreenCoords.Y, state);
};
GenieAgent.prototype.DetermineScreenCoords = function() {

   if (this.ScreenRect) {
      this.ScreenCoords.X = this.Position.X - this.ScreenRect.L;
      this.ScreenCoords.Y = this.Position.Y - this.ScreenRect.T;
   } else {
      this.ScreenCoords.X = this.Position.X;
      this.ScreenCoords.Y = this.Position.Y;
   }

   if (this.Perspective)
      GeoUtils.PerspectiveAdjust(this.ScreenCoords, this.Perspective);

   //Adjust coordinates for sprite alignment
   if (this.Status & STATUS.TRANSFORM.TRANsBUFFER) {  //NOTE: always going to align with centre coords if buffer is used
      this.ScreenCoords.X += this.CentreOffset.X;
      this.ScreenCoords.Y += this.CentreOffset.Y;
   } else if (this.SpriteOffset) {
      this.ScreenCoords.X += this.SpriteOffset.X;
      this.ScreenCoords.Y += this.SpriteOffset.Y;
   }

   if (this.Elevation)
      this.ScreenCoords.Y -= this.Elevation;

   //Check if stationary
   if (this.State.Motion===STATE.MOTION.STATIONARY) {
      this.ScreenCoords.X = Math.round(this.ScreenCoords.X);
      this.ScreenCoords.Y = Math.round(this.ScreenCoords.Y);
   }
};
GenieAgent.prototype.DrawIndicators = function() {  //NOTE: only called if agent is selected
   this.DrawSelectionIndicator();
   this.DrawTargetingIndicators();
   this.DrawSensitivityIndicators();
   this.DrawVisionIndicator();
};
GenieAgent.prototype.DrawSelectionIndicator = function() {
   //ISSUE: only TESTED and verified for Dominion MicroAirDuel case
/*
   if (this.SelectionOffset) {
      this.x = this.ScreenCoords.X + this.SelectionOffset.X;
      this.y = this.ScreenCoords.Y + this.SelectionOffset.Y;
   }
*/
/* NOTE: switching this off for now, since shape will be more sprite based rather than perspective based
//   this.distance = (this.Sprite.Diagonal/2)+Math.ceil(this.Specs.SELECTION.THICKNESS/2);
   if (this.Space)
      if (this.Space.Perspective) {
	 if (this.Specs.SELECTION)
	    this.GraphicsTool.DrawEllipse(this.x, this.y, this.distance, this.distance/2, this.Specs.SELECTION.COLOUR, this.Specs.SELECTION.THICKNESS, 0, 0, this.Specs.SELECTION.OPACITY);
	 else
	    this.GraphicsTool.DrawEllipse(this.x, this.y, this.distance, this.distance/2, SELECTION.COLOUR, SELECTION.THICKNESS, 0, 0, SELECTION.OPACITY);
	 return;
      }
*/
/*
   if (this.Specs.SELECTION)
      this.GraphicsTool.DrawCircle(this.x, this.y, this.distance, this.Specs.SELECTION.COLOUR, this.Specs.SELECTION.THICKNESS, 0, 0, this.Specs.SELECTION.OPACITY);
   else
      this.GraphicsTool.DrawCircle(this.x, this.y, this.distance, SELECTION.COLOUR, SELECTION.THICKNESS, 0, 0, SELECTION.OPACITY);
*/
   switch (this.Specs.SELECTION.SHAPE) {  //TODO: check if all these OR statements are inefficient (maybe better to use a shared pack - in AgentArray?)
      case SHAPE.RECTANGLE:
	 this.x = this.ScreenCoords.X + this.BottomLeftOffset.X - (this.Specs.SELECTION.THICKNESS || SELECTION.THICKNESS);
	 this.y = this.ScreenCoords.Y + this.BottomLeftOffset.Y - (this.Sprite.Height+(this.Specs.SELECTION.THICKNESS || SELECTION.THICKNESS));
	 this.GraphicsTool.DrawRectangle(this.x, this.y, this.Sprite.Width+(2*(this.Specs.SELECTION.THICKNESS || SELECTION.THICKNESS)), this.Sprite.Height+(2*(this.Specs.SELECTION.THICKNESS || SELECTION.THICKNESS)), this.Specs.SELECTION.COLOUR || SELECTION.COLOUR, this.Specs.SELECTION.THICKNESS || SELECTION.THICKNESS, 0, 0, this.Specs.SELECTION.OPACITY || SELECTION.OPACITY);
	 break;
/* OPEN: might be needed as may TRIANGLE (less likely)
      case SHAPE.DIAMOND:
	 break;
*/
      case SHAPE.CIRCLE:
      default:
	 this.x = this.ScreenCoords.X + this.CenterOffset.X;
	 this.y = this.ScreenCoords.Y + this.CenterOffset.Y;
	 this.GraphicsTool.DrawCircle(this.x, this.y, (this.Sprite.Diagonal/2)+(this.Specs.SELECTION.THICKNESS || SELECTION.THICKNESS), this.Specs.SELECTION.COLOUR || SELECTION.COLOUR, this.Specs.SELECTION.THICKNESS || SELECTION.THICKNESS, 0, 0, this.Specs.SELECTION.OPACITY || SELECTION.OPACITY);
   }
};
GenieAgent.prototype.DrawTargetingIndicators = function() {
//   if (this.Targeting) {
//      if (this.Targeting.Mode & TARGETING.SHOT)
   //TODO: this may be the place to scan for targets
   if (!this.Target)
      return;
   if (this.Cannon)
      if (this.Cannon.State==WEAPON.STATE.ARMED) {  //NOTE: drawing only if fully charged
//	 this.DrawFiringArc();
	 if (this.Target)
	    this.Cannon.DrawReticle();
      }
   if (this.Rocket)
      this.DrawRocketSight();
   if (this.Shell)
      this.DrawShellBullsEye();
   if (this.Missile)
      this.DrawMissileLock();
};
GenieAgent.prototype.DrawSensitivityIndicators = function() {

   //UNLOGGED

};
GenieAgent.prototype.DrawVisionIndicator = function() {

   //UNLOGGED

   //NOTE: not sure if LOS and FOV should me mixed up here, so could check to see if GameSpace pointer is actualized,
   //	   and maybe there is an option somewhere whether obstacles should be accounted for
};
GenieAgent.prototype.ScanTargets = function() {

   //UNLOGGED - this is complicated because it depends on things like direction faced, firing arc etc

   //-this would depend on whether .Angle or .Direction, as well as FOV, is specified, and then .Foes array(s) can be searched
   //-FOV can specify an angle, and possibly distance
   //-undefined .Angle, .Direction and .FOV might simplify the calculation to everything .Visible being targetable
};
//------------
//-- UPDATE --
//------------
GenieAgent.prototype.Update = function() {
   //TODO: this is where 'selected' status should be verified/updated
   //TODO: there could be default behaviour of 0.5 opacity yellow rectangle around selected agent

   //First check if on a path; if so, check to see if at destination - if so, set the destination for the next node if there is one
   if (this.Path) {  //TODO: should check motion status rather than this (PATHFOLLOWING?)
      if (this.CheckAtDestination()) {
	 ++this.PathNode;
	 if (this.PathNode==this.Path.length) {
	    if (this.State.Motion = STATE.MOTION.PATROLLING) {
	       this.PathNode = 0;
	       this.SetDestination(this.Path[this.PathNode]);
	    } else {
	       this.Velocity.X = 0;
	       this.Velocity.Y = 0;
	       this.State.Motion = STATE.MOTION.STATIONARY;
	       this.Path = null;					//ISSUE: could become garbage collection inefficient in some cases
	    }
	 } else
	    this.SetDestination(this.Path[this.PathNode]);
      } else
	 this.Move();
   }

   //Process movement
   if (this.Controller && this.Selected) {
      this.Controller.CheckControls();
      if (this.Specs.CONTROLLER.TYPE==CONTROLLER.TANK) {
	 if (this.Controller.Left) this.TurnLeft();
	 if (this.Controller.Right) this.TurnRight();
	 if (this.Controller.Up) this.Position.Y -= this.Specs.SPEED;		//ISSUE: this is wrong - doesn't account for direction
	 if (this.Controller.Down) this.Position.Y += this.Specs.SPEED/2;
      } else if (this.Specs.CONTROLLER.TYPE==CONTROLLER.FREeROAMING) {
	 if (this.Controller.Left) this.Position.X -= this.Specs.SPEED;
	 if (this.Controller.Right) this.Position.X += this.Specs.SPEED;
	 if (this.Controller.Up) this.Position.Y -= this.Specs.SPEED;
	 if (this.Controller.Down) this.Position.Y += this.Specs.SPEED;
      }
   }

   if (this.State.Motion==STATE.MOTION.ADVANCING) {
      this.Move();
      if (this.Animation)		//update sprite state if animated
	 this.UpdateAnimation();
      if (this.CheckAtDestination())
	 this.State.Motion = STATE.MOTION.STATIONARY;
   }

   //Fire cannon if present and charged
   if (this.Cannon)
//      this.ProcessCannon();
      this.Cannon.Update();
};
GenieAgent.prototype.UpdateAnimation = function() {
   ++this.Animation.Frames;
   if (this.Animation.Frames==(this.Specs.ANIMATION.F || ANIMATION.F)) {
      this.Animation.Frames = 0;
      if (this.Animation.Sequence)
	 this.UpdateAnimationSequence();
      else {
	 ++this.Animation.State;
	 if (this.Animation.State==this.Sprite.Specs.S)
	    this.Animation.State = 0;
      }
   }
};
//--------------
//-- LOCATION --
//--------------
GenieAgent.prototype.DetermineLocationOffsets = function() {

   //Location
   this.BottomLeftOffset = new Coordinate2D();
   this.CentreOffset = new Coordinate2D();
   switch (this.Specs.ALIGN) {  //NOTE: only a few cases right now
      case ALIGNMENT.CENTRE:
	 this.BottomLeftOffset.X = -0.5*this.Sprite.Width;
	 this.BottomLeftOffset.Y = 0.5*this.Sprite.Height;
	 this.CentreOffset.X = 0 - 0.5;
	 this.CentreOffset.Y = 0 - 0.5;
	 break;
      default:  //ALIGNMENT.BOTTOmLEFT
	 this.BottomLeftOffset.X = 0;
	 this.BottomLeftOffset.Y = 0;
	 this.CentreOffset.X = (0.5*this.Sprite.Width) - 0.5;
	 this.CentreOffset.Y = (-0.5*this.Sprite.Height) - 0.5;
	 break;
   }

   //Footprint and movement
   if (this.Sprite)
      if (this.Sprite.Specs) {
	 this.Footprint.W = this.Sprite.Specs.W;
	 if (this.Perspective)
	    this.Footprint.H = this.Sprite.Specs.B ? this.Sprite.Specs.B : this.Sprite.Specs.H;
	 else
	    this.Footprint.H = this.Sprite.Specs.H;
	 this.MoveBox = new GenieRect();			//indicates space occupied once move is completed
	 this.MoveBox.W = this.Sprite.Width;
	 this.MoveBox.H = this.Footprint.H;
     }
};
GenieAgent.prototype.CheckClicked = function() {
   this.DetermineBoundingBox();
//   return (Utilities.PointInBox( { X: Mouse.ClickX, Y: Mouse.ClickY }, this.BoundingBox));
   return (Utilities.PointInBox(Mouse.GetClickCoordinates(), this.BoundingBox));
};
GenieAgent.prototype.CheckUnderCursor = function() {

   //UNLOGGED - have to add options for different bounding shapes

   this.DetermineBoundingBox();
   return (Utilities.PointInBox(Mouse.GetCoordinates(), this.BoundingBox));
};
GenieAgent.prototype.GetCentreCoords = function() {
   return ( { X: this.ScreenCoords.X+this.CentreOffset.X, Y: this.ScreenCoords.Y+this.CentreOffset.Y } );
};
GenieAgent.prototype.GetCenterCoords = function(coords) {
   if (coords) {
      coords.X = this.ScreenCoords.X + this.CentreOffset.X;
      coords.Y = this.ScreenCoords.Y + this.CentreOffset.Y;
   } else
      return ( { X: this.ScreenCoords.X+this.CentreOffset.X, Y: this.ScreenCoords.Y+this.CentreOffset.Y } );
};
GenieAgent.prototype.DetermineBoundingBox = function() {

   //ASSUMPTION: if DIMENSIONS are specified, only box-based collision detection will be considered

   this.BoundingBox.L = this.ScreenCoords.X+this.BottomLeftOffset.X;
   this.BoundingBox.T = this.ScreenCoords.Y+this.BottomLeftOffset.Y-this.Sprite.Height;
   if (this.Specs.DIMENSIONS) {
      this.BoundingBox.W = this.Specs.DIMENSIONS.L;	//L- Length
      this.BoundingBox.H = this.Specs.DIMENSIONS.B;	//B- Breadth, with height also specified in DIMENSIONS as .H
   } else {
      this.BoundingBox.W = this.Sprite.Width;
      this.BoundingBox.H = this.Sprite.Height;
   }
};
GenieAgent.prototype.DetermineMoveBox = function() {
   this.DetermineFootprint();
   this.MoveBox.L = this.Footprint.L+this.Velocity.X;
   this.MoveBox.T = this.Footprint.T+this.Velocity.Y;
};
GenieAgent.prototype.DetermineFootprint = function() {
   this.Footprint.L = this.Position.X + this.BottomLeftOffset.X;
   this.Footprint.T = (this.Position.Y + this.BottomLeftOffset.Y) - this.Footprint.H;
/* pretty sure this is all REDUNDANT
   if (this.Specs.FOOTPRINT)  //NOTE: Specs needed whenever agent does not have a square base
      this.breadth = this.Specs.FOOTPRINT.H;
   else
      if (this.Space)
	 this.breadth = this.Sprite.Width;
      else  //TOpDOWN
	 this.breadth = this.Sprite.Height;
   this.Footprint.H = this.breadth;

   if (this.Space) {
      if (this.Space.Perspective==PERSPECTIVE.TOpDOWN || this.Space.Perspective==PERSPECTIVE.SIDeVIEW)
	 this.Footprint.T = this.Position.Y+this.BottomLeftOffset.Y-this.Footprint.H;
      else  //NOTE: for the various isometric cases - inexact due to diagonal, better in Specs
	 this.Footprint.T = this.Position.Y-this.BottomLeftOffset.Y;	//NOTE: ScreenCoords will be handled differently
   } else
	 this.Footprint.T = this.Position.Y+this.BottomLeftOffset.Y-this.Footprint.H;
*/
};
GenieAgent.prototype.DetectCollision = function(rect) {
//ISSUE:use-footprint-instead
   this.DetermineBoundingBox();
   return (Utilities.CheckBoxBoxIntersection(this.BoundingBox, rect));
};
//--------------
//-- MOVEMENT --
//--------------
GenieAgent.prototype.Move = function() {
   if (this.Tracking)
      if (this.Mode==MOTION.FOLLOWING)
	 this.SetDestination(this.Target.Position);

   if (this.Velocity)
      MobileObject.prototype.Move.call(this);
};
GenieAgent.prototype.Turn = function(direction, angle) {  //default direction - DIRECTION.RIGHT (otherwise DIRECTION.LEFT)
   //ISSUE: there is a catch here - if sprite states are going to be used for turns, then separate ones will have to be
   // used for different actions
   //have to specify whether using states or forms - differentiation has to be made

   //Make sure correct image is set up to be drawn
/*
   if (!this.Specs.TURN)
      this.DrawState = 0;
   else if (this.Specs.TURN.M) {
      
   }
      switch (this.Specs.TURN.M) {
	 case TURnMODE.SPIN:
      }
   }
*/
   //ISSUE: actually, below is called only if TURnMODE is DIRECTION
   MobileObject.prototype.Turn.call(this, direction, angle);
};
GenieAgent.prototype.TurnAround = function() {
   //NOTE: consciously not incorporating this in ::Turn since a sequence is initiated
   //LOGGED
};
GenieAgent.prototype.SetPath = function(nArray) {  //n- nodes
   this.Path = nArray || this.Path;	//path may already be assigned elsewhere
   this.PathNode = 0;
   this.SetDestination(this.Path[0]);
};
GenieAgent.prototype.ReColour = function(aPairs) {  //TODO: method should be in relevant sprites
   if (Array.isArray(aPairs[0])) {  //check if array or array of arrays is passed
      if (Array.isArray(this.Sprite.Specs.GS[0][0])) {	//check if its an Animated Composite Sprite
	 for (this.i=0;this.i<aPairs.length;++this.i)
	    for (this.j=0;this.j<this.Sprite.Specs.GS.length;++this.j)
	       for (this.k=0;this.k<this.Sprite.Specs.GS[this.j].length;++this.k)
	          if (this.Sprite.Specs.GS[this.j][this.k][1]==aPairs[this.i][0])
		     this.Sprite.Specs.GS[this.j][this.k][1] = aPairs[this.i][1];
      } else {						//only a Composite Sprite
	 for (this.i=0;this.i<aPairs.length;++this.i)
	    for (this.j=0;this.j<this.Sprite.Specs.GS.length;++this.j)
	       if (this.Sprite.Specs.GS[this.j][1]==aPairs[this.i][0])
		  this.Sprite.Specs.GS[this.j][1] = aPairs[this.i][1];
      }
   } else {
      if (Array.isArray(this.Sprite.Specs.GS[0][0])) {	//check if its an Animated Composite Sprite
	 for (this.i=0;this.i<this.Sprite.Specs.GS.length;++this.i)
	    for (this.j=0;this.j<this.Sprite.Specs.GS[this.i].length;++this.j)
	       if (this.Sprite.Specs.GS[this.i][this.j][1]==aPairs[0])
		  this.Sprite.Specs.GS[this.i][this.j][1] = aPairs[1];
      } else {
	 for (this.i=0;this.i<this.Sprite.Specs.GS.length;++this.i)
	    if (this.Sprite.Specs.GS[this.i][1] = aPairs[0])
	       this.Sprite.Specs.GS[this.i][1] = aPairs[1];
      }
   }
};
GenieAgent.prototype.DrawTransformed = function(state) {

   //UNLOGGED

   //-forms can be available via sprite buffer, produced through TransformBuffer, or drawn directly in relevant state to screen
   //-if form comes via sprite buffer, .Form will simply be an integer, and not a 2-field structure

   //Adjust coordinates to centre if needed for TransformBuffer
//   if (this.Status & STATUS.TRANSFORM.TRANsBUFFER) {
//      this.x = this.ScreenCoords.X + this.CentreOffset.X;
//      this.y = this.ScreenCoords.Y + this.CentreOffset.Y;
/* want to be ABSOLUTELY sure that below can be thrown away
      this.x = this.ScreenCoords.X;
      this.y = this.ScreenCoords.Y;
      if (this.SpriteOffset) {
	 this.x -= this.SpriteOffset.X;
	 this.y -= this.SpriteOffset.Y;
      }
*/
//   }

   if (this.Status & STATUS.TRANSFORM.SPRITeBUFFER)  //STATUS = { NONE: 0, EXTANT: 1, VISIBLE: 2, TRANSFORM: { DIRECT: 32, SPRITeBUFFER: 64, TRANsBUFFER: 128 } }
      this.Sprite.DrawForm(this.Form, this.ScreenCoords.X, this.ScreenCoords.Y);  //TODO: have to account for various alignments
   else {
      switch (this.Form.Type) {
	 case SPRITeFORM.FLIPPED:
	    if (this.Status & STATUS.TRANSFORM.DIRECT)
	       this.Sprite.DrawFlipped(this.ScreenCoords.X, this.ScreenCoords.Y, this.Form.Orientation, state);
	    else
//	       this.Buffer.DrawFlipped(this.Sprite, state, null, this.x, this.y, this.Form.Orientation)
	       this.Buffer.DrawFlipped(this.Sprite, state, null, this.ScreenCoords.X, this.ScreenCoords.Y, this.Form.Orientation)
	    break;
	 case SPRITeFORM.SCALED:
	    if (this.Status & STATUS.TRANSFORM.DIRECT)
	       //-adjustments have to be made for offset (alignments being factored in)
	       this.Sprite.DrawScaled(this.ScreenCoords.X, this.ScreenCoords.Y, this.Form.Scale, this.i);
	    else {
	    //TODO:
	    }
	    break;
	 case SPRITeFORM.ROTATED:
	    if (this.Status & STATUS.TRANSFORM.DIRECT)
	       this.Sprite.DrawRotated(this.ScreenCoords.X, this.ScreenCoords.Y, this.Angle, this.i);
	    else
//	       this.Buffer.DrawRotated(this.Sprite, state, null, this.x, this.y, this.Form.Angle);
	       this.Buffer.DrawRotated(this.Sprite, state, null, this.ScreenCoords.X, this.ScreenCoords.Y, this.Angle);
	    break;
      }
   }
};
GenieAgent.prototype.QuickDraw = function() {

   //UNLOGGED - have to have the .DrawTransformed option here too

   if (this.Animation)
      this.i = this.Animation.State;

   if (this.Form)
      if (this.Form.Type) {
	 this.DrawTransformed(this.i);
	 return;
      }

   this.i = this.i || 0;
   this.Sprite.Draw(this.ScreenCoords.X, this.ScreenCoords.Y, this.i);
};
GenieAgent.prototype.SetExtant = function() {
   this.Extant = true;
};
GenieAgent.prototype.SetVisible = function() {
   this.Visible = true;
};
GenieAgent.prototype.UnsetExtant = function() {
   this.Extant = false;
};
GenieAgent.prototype.UnsetVisible = function() {
   this.Visible = false;
};
GenieAgent.prototype.CheckExtant = function() {
   return (this.Extant);
};
GenieAgent.prototype.CheckVisible = function() {
   return (this.Visible);
};
GenieAgent.prototype.GetFiringPoint = function(wpn, coords) {

   //UNLOGGED . . . TODO: have to look into automating this - might need a .Weapons array, as well as other fields for behaviour related to direction/angle faced

//   coords.Set(0, 0);
};
GenieAgent.prototype.GetFiringDirection = function(wpn, coords) {  //NOTE: this is if third option (key press) is picked for firing

   //UNLOGGED

};

