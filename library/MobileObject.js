
//---------------------------------------------
//---------- MOBILE OBJECT --------------------

//-- PARABOLIC PATH --
var MOParabolicPath = function() {
   var Start;
   var MaxHeight;
   var MaxDistance;
   var Distance;
//   var XDistance, YDistance;
   var DistanceCovered;
};

var MobileObject = function() {
   var Position, Destination;
   var Elevation;
   var Speed, Velocity, ZVelocity;
   var Acceleration, Deceleration;
   var Direction;
   var TurningAngle;
   var OnParabolicPath;			//to be REDUNDANT
   var ParabolicPath;			//to be REDUNDANT

  var distanceX, distanceY, distance;
};
MobileObject.prototype = {
   Set(spd, pos, dstn, drctn, trn) {
      this.Speed = spd || 1;
      this.Position = new Coordinate2D();
      if (pos) {
	 this.Position.X = pos.X;
	 this.Position.Y = pos.Y;
      }
//      this.Elevation = 0;	//NOTE: want to initialize this only if used
      this.Destination = new Coordinate2D();
      if (dstn) {
	 this.Destination.X = dstn.X;
	 this.Destination.Y = dstn.Y;
      }
      this.Direction = drctn;
      this.Velocity = new Coordinate2D();
      if (pos && dstn)
	 this.CalculateVelocity();
      else if (pos && drctn!=null)
	 this.SetDirection(drctn);

      this.TurningAngle = trn || 0;
   },
   SetPosition(pos) {
      if (!(pos.X===undefined)) {
	 this.Position.X = pos.X;
	 this.Position.Y = pos.Y;
      } else {
	 this.Position.X = pos[0];
	 this.Position.Y = pos[1];
      }
      if (this.Speed) {
	 if (this.Destination.X)
	    this.CalculateVelocity();
	 else if (!(this.Direction==null))
	    this.SetDirection(this.Direction);
      }
   },
   SetDestination(dstn) {

      this.Destination.X = dstn.X;
      this.Destination.Y = dstn.Y;
      this.CalculateVelocity();
   },
   SetDirection(drctn) {

      this.Direction = drctn;
      switch (this.Direction) {
	 case DIRECTION.NW :
	 case DIRECTION.TL :
	    this.CalculateVelocity( { X: this.Position.X-this.Speed, Y: this.Position.Y-this.Speed } );
	    break;
	 case DIRECTION.N :
	 case DIRECTION.T :
	    this.Velocity.X = 0;
	    this.Velocity.Y = -this.Speed;
	    break;
	 case DIRECTION.NE :
	 case DIRECTION.TR :
	    this.CalculateVelocity( { X: this.Position.X+this.Speed, Y: this.Position.Y-this.Speed } );
	    break;
	 case DIRECTION.E :
	 case DIRECTION.R :
	    this.Velocity.X = this.Speed;
	    this.Velocity.Y = 0;
	    break;
	 case DIRECTION.SE :
	 case DIRECTION.BR :
	    this.CalculateVelocity( { X: this.Position.X+this.Speed, Y: this.Position.Y+this.Speed } );
	    break;
	 case DIRECTION.S :
	 case DIRECTION.B :
	    this.Velocity.X = 0;
	    this.Velocity.Y = this.Speed;
	    break;
	 case DIRECTION.SW :
	 case DIRECTION.BL :
	    this.CalculateVelocity( { X: this.Position.X-this.Speed, Y: this.Position.Y+this.Speed } );
	    break;
	 case DIRECTION.W :
	 case DIRECTION.L :
	    this.Velocity.X = -this.Speed;
	    this.Velocity.Y = 0;
	    break;
      } 
   },
   ReverseDirection() {
      if (!(this.Direction===null)) {
	 this.Direction -= DIRECTION.COUNT/2;
	 if (this.Direction<0)
	    this.Direction += DIRECTION.COUNT;
      }
      this.Velocity.X = -this.Velocity.X;
      this.Velocity.Y = -this.Velocity.Y;
   },
   SetVelocity(vlcty) {

      this.Velocity.X = vlcty.X;
      this.Velocity.Y = vlcty.Y;
   },
   CalculateVelocity(dstn) {
      if (dstn) {
	 this.distanceX = dstn.X - this.Position.X;
	 this.distanceY = dstn.Y - this.Position.Y;
      } else {
	 this.distanceX = this.Destination.X - this.Position.X;
	 this.distanceY = this.Destination.Y - this.Position.Y;
      }
      if (!this.distanceX && !this.distanceY) {  //check if position and destination are the same
	 this.Velocity.X = 0;
	 this.Velocity.Y = 0;
	 return;
      }
      this.distance = Math.sqrt(Math.pow(this.distanceX, 2) + Math.pow(this.distanceY, 2));
      this.Velocity.X = (this.distanceX/this.distance)*this.Speed;
      this.Velocity.Y = (this.distanceY/this.distance)*this.Speed;
      if (this.OnParabolicPath) {
	 this.ParabolicPath.Distance = this.distance;
	 this.ParabolicPath.MaxHeight = (this.distance/Math.PI)*(this.distance/this.ParabolicPath.MaxDistance);
      }
   },
   ChangeSpeed(spd) {
      this.Velocity.X *= spd/this.Speed;
      this.Velocity.Y *= spd/this.Speed;
      this.Speed = spd;
   },
   Accelerate(factor) {
      factor = factor || this.Acceleration;
      this.Speed *= factor;
      this.Velocity.X *= factor;
      this.Velocity.Y *= factor;
   },
   Decelerate(factor) {
      factor = factor || this.Deceleration;
      this.Speed /= factor;
      this.Velocity.X /= factor;
      this.Velocity.Y /= factor;
   },
   Move(vlcty, zVlcty) {

      if (!vlcty) {
	 this.Position.X += this.Velocity.X;
	 this.Position.Y += this.Velocity.Y;
      } else {
	 this.Position.X += vlcty.X;
	 this.Position.Y += vlcty.Y;
      }
      if (this.ZVelocity)
	 this.Elevation += this.ZVelocity;
      if (zVlcty)
	 this.Elevation += zVlcty;
      if (this.OnParabolicPath) {  //NOTE: makes sense to round here
	 this.Elevation = Math.round(Math.sin(Math.PI*(this.ParabolicPath.DistanceCovered/this.ParabolicPath.Distance)) * this.ParabolicPath.MaxHeight);
	 this.ParabolicPath.DistanceCovered += this.Speed;
      }
   },
   Reverse() {
      this.Position.X -= this.Velocity.X/2;
      this.Position.Y -= this.Velocity.Y/2;
   },
   MoveTo(destination) {  //previously called ChangeDestination
//calculate new velocity
   },
   JumpTo(x, y) {
      this.Position.X = x;
      this.Position.Y = y;
   },
   Turn(direction, angle) {  //NOTE: supplying no arguments is the same as calling ::ReverseDirection
      if (!direction)
	 this.ReverseDirection();
      else {
//	 if (direction==DIRECTION.LEFT)
//	    angle = -angle;
	 angle = angle || this.TurningAngle;
	 Utilities.RotateCoordinates(this.Velocity, angle, (direction==DIRECTION.LEFT), true);
	 this.Direction = null;
      }
   },
   CheckAtDestination() {
      if (!this.Position || !this.Destination)
	 return (false);

//      return ((Math.abs(this.Position.X-this.Destination.X)<1) && (Math.abs(this.Position.Y-this.Destination.Y)<1));  //ISSUE: this works only if speed<1

      //Check if destination is reached exactly
      if (this.Position.X==this.Destination.X && this.Position.Y==this.Destination.Y)
	 return (true);

      switch (true) {  //ISSUE: is there a shorter and more elegant way to do this? (maybe not)
	 case (this.Velocity.X<=0 && this.Velocity.Y<=0):
	    return (this.Position.X<=this.Destination.X && this.Position.Y<=this.Destination.Y);
	    break;
	 case (this.Velocity.X>0 && this.Velocity.Y<=0):
	    return (this.Position.X>this.Destination.X && this.Position.Y<=this.Destination.Y);
	    break;
	 case (this.Velocity.X<=0 && this.Velocity.Y>0):
	    return (this.Position.X<=this.Destination.X && this.Position.Y>this.Destination.Y);
	    break;
	 case (this.Velocity.X>0 && this.Velocity.Y>0):
	    return (this.Position.X>this.Destination.X && this.Position.Y>this.Destination.Y);
	    break;
      }

      return (false);
   },
   CheckAtLocation(lctn, margin) {
      margin = margin || 1;
      return ((Math.abs(this.Position.X-lctn.X)<margin) && (Math.abs(this.Position.Y-lctn.Y)<margin));
   },
   SetParabolicPath(maxDistance) {  //represents distance travelled if starting at 45 degrees
//      var distance, xDistance, yDistance;

      this.OnParabolicPath = true;
      if (!this.ParabolicPath) {
	 this.ParabolicPath = new MOParabolicPath();
	 this.Start = new Coordinate2D();
      }
      this.Start.X = this.Position.X;
      this.Start.Y = this.Position.Y;

      //This is also done in ::CalculateVelocity, but calling it would create redundancy
//      this.ParabolicPath.XDistance = this.Destination.X - this.Position.X;
//      this.ParabolicPath.YDistance = this.Destination.Y - this.Position.Y;
//      xDistance = this.Destination.X - this.Position.X;
//      yDistance = this.Destination.Y - this.Position.Y;
//      this.ParabolicPath.Distance = Utilities.GetMagnitude(this.ParabolicPath.XDistance, this.ParabolicPath.YDistance);
//      this.ParabolicPath.Distance = Utilities.GetMagnitude(xDistance, yDistance);

      this.ParabolicPath.MaxDistance = maxDistance;
      this.CalculateVelocity();
      this.ParabolicPath.MaxHeight = (this.ParabolicPath.Distance/Math.PI)*(this.ParabolicPath.Distance/maxDistance);
      this.ParabolicPath.DistanceCovered = 0;
   }
//   MoveAlongParabolicPath() {
//---->
//      this.Elevation = (Math.sin(Math.PI*(this.ParabolicPath.DistanceCovered/this.ParabolicPath.Distance)) * //this.ParabolicPath.MaxHeight);
//      this.Position.X += this.Speed*(this.ParabolicPath.XDistance/this.ParabolicPath.Distance);
//      this.Position.Y += this.Speed*(this.ParabolicPath.XDistance/this.ParabolicPath.Distance);
//      this.ParabolicPath.DistanceCovered += this.Speed;
//---->
//   }
};
