
//---------------------------------------------
//----------GENIE UTILITIES--------------------
var GenieUtilities = function() {
   var AnimationFrameHandle;
   var Frames;
   var RandomBits, NumberOfRandomBits;
   var WaitFrames;

   var x, y;
};
GenieUtilities.prototype = {
   CreateArray(size, type) {	/* ARRAYS */
      var i, j;
      var array;
      var element;
      var aArray;	//a- arguments
/*
      array = new Array();
      for (i=0;i<size;++i) {
	 if (type) {
	   element = new type();
	   array.push(element);
	 } else
	   array.push(0);
      }
*/
      array = new Array(size);
      for (i=0;i<size;++i) {
	 if (type) {
	    element = new type();
	    array[i] = element;
	    if (arguments.length>2) {  //UNTESTED
	       aArray = new Array(arguments.length-2);
	       for (j=2;j<arguments.length;++j)
		  aArray[j-2] = arguments[j];
	       element.Set.apply(element, aArray);
	    }
	 } else
	    array[i] = 0;
      }
      return (array);
   },
   Create2DArray(rows, columns, type) {
      var r, c;
      var column, array;
      var element;

      array = new Array(rows);
      for (r=0;r<rows;++r) {
	 column = new Array(columns);
	 for (c=0;c<columns;++c) {
	    if (type) {
	      element = new type();
//	      column.push(element);
	      column[c] = element;
	    } else
//	      column.push(0);
	      column[c] = 0;
	 }
//	 array.push(column);
	 array[r] = column;
      }
      return (array);
   },
   ExtendArray(array, entries, type) {
      var i;
      var element;

      for (i=0;i<entries;++i) {
	 element = new type();
	 array.push(element);
      }
   },
   CreateArrayFromElements(elements) {
      var i;
      var array;

      array = new Array;
      for (i=0;i<elements.length;++i)
	 array.push(elements[i]);
      return (array);
   },
   GetMagnitude(vector) {	/* DISTANCE */
      return (Math.sqrt(Math.pow(vector.X, 2) + Math.pow(vector.Y, 2)));
   },
   GetDistance(pointA, pointB) {
      return (this.GetMagnitude( { X: pointA.X-pointB.X, Y: pointA.Y-pointB.Y } ));
   },
   GetTextHeight(cntxt) {
      return (parseInt(cntxt.font.split(' ')[0].replace('px', '')));
   },
   DegreesToRadians(degrees) {	/* DEGREES */
      return((degrees/180)*Math.PI);
   },
   RadiansToDegrees(radians) {
      return((radians/Math.PI)*180);
   },
   NumberToGrade(number) {	/* GRADES */
      var grade;
      var remainder;

      grade = String.fromCharCode(Math.floor((number/3)+65));
      remainder = number % 3;
      switch (remainder) {
	 case 0 :
	    grade += "+";
	    break;
	 case 2 :
	    grade += "-";
	    break;
      }
      return(grade);
   },
   GradeToNumber(grade) {
      var number;

      //NOTE: UNTESTED!!
      number = 3*(grade.charCodeAt(0)-65);
      if (grade.length==1)
	 ++number;
      else if (grade[1]=="-")
	 number += 2;
      return (number);
   },
   GetFontHeight(cntxt) {
      return(parseInt(cntxt.font.split(' ')[0].replace('px', '')));
   },
   GetRGB(colour) {		/* COLOUR */
      var r, g, b;

      //ISSUE: this only works if colour is in RGB(NxNN, NxNN, NxNN) format
      r = parseInt(colour.substr( 4, 8), 16);
      g = parseInt(colour.substr(10, 14), 16);
      b = parseInt(colour.substr(16, 20), 16);
      return( { R: r, G: g, B: b } );
      //TODO: should utilize this in GenieColour
   },
				/* RANDOM NUMBERS */
   GetRandomNumber(range, zeroStart) {  //if zeroStart, return range from zero to range-1
      var exponent;
      var num;

      //Error check
      if (range<=1)
	 if (zeroStart)
	    return (0);
	 else
	    return (range);

      if (!this.RandomBits) {
	 this.RandomBits = Math.random()*0x7FFFFFFF;
	 this.NumberOfRandomBits = 31;
	 this.RandomBits &= 0x7FFFFFFF;
      }

      //Check how many bits are needed
      exponent = 1;
      while (Math.pow(2, exponent)<range)
	 ++exponent;

      //Cycle through bits till value is found in range
      do {
	  //Check if we are short of bits
	 if ( (exponent>this.NumberOfRandomBits) || (this.RandomBits==0) ) {
	    this.RandomBits = Math.random()*0x7FFFFFFF;
	    this.NumberOfRandomBits = 31;
	    this.RandomBits &= 0x7FFFFFFF;
	 }
	 num = (this.RandomBits & (Math.pow(2, exponent)-1)) + 1;
	 if (num<=range) {
	    this.RandomBits = this.RandomBits >> exponent;
	    this.NumberOfRandomBits -= exponent;
	    if (zeroStart)
	       return (num-1);
	    else
	       return (num);
	 } else {
	    this.RandomBits = this.RandomBits >> 1;
	    --this.NumberOfRandomBits;
	 }
      } while (true)
   },
   GetRandomNumbers(rndmNums, quantity, range, zeroStart, unique) {
      var i, j;
      var num;
      var repeatedNum;
/*
//      rndmNums = new Array();		//TODO: see if can get this to work
*/
/* */
      if (!rndmNums)
	 rndmNums = new Array();
/* */
      //TODO: might be a good idea here to set all elements of rndNums to -1
      for (i=0;i<quantity;++i) {
	 num = this.GetRandomNumber(range, zeroStart);
	 if (unique)
	    do {
	       repeatedNum = false;
	       for (j=0;j<rndmNums.length;++j)
		  if (num==rndmNums[j]) {
		     repeatedNum = true;
		     num = this.GetRandomNumber(range, zeroStart);
		     break;
		  }
	    } while (repeatedNum)
	 if (rndmNums[i]===undefined)
	    rndmNums.push(num);
	 else
	    rndmNums[i] = num;
      }
      return (rndmNums);
   },
   GetUniqueRandomNumbers(rndmNums, quantity, range, zeroStart) {
      this.GetRandomNumbers(rndmNums, quantity, range, zeroStart, true);
   },
   GetRandomDistribution(numbers, array, initialize) {  //initialize indicates if array needs resetting
      var i;
      var num;

      if (initialize)
	 for (i=0;i<array.length;++i)
	    array[i] = 0;
      for (i=0;i<numbers;++i) {
	 num = this.GetRandomNumber(array.length, true);
	 ++array[num];
      }
   },
   GetRandomSlot(sArray, nSlots) {  //s- slots
      var i;
      var num;
      var threshold;

      num = this.GetRandomNumber(nSlots, STARtAtZERO);
      threshold = 0;
      for (i=0;i<sArray.length;++i) {
	 threshold += sArray[i];
	 if (num<threshold)
	    return (i);
      }
   },
   GetRandomBoolean() {  //UNTESTED
      return (Math.round(Math.random())==1);
   },
   PointInBox(coords, rect, XY) {		/* ----- COLLISION ----- */
      if (!(rect.X==undefined))  //check if rect coords are passed as X, Y
	 return ((coords.X>=rect.X) && (coords.X<=rect.X+rect.W) && (coords.Y>=rect.Y) && (coords.Y<=rect.Y+rect.H));
      if (rect.L==undefined)  //check if specs are passed as L/T/W/H or Left/Top/Width/Height
	 return ((coords.X>=rect.Left) && (coords.X<=rect.Left+rect.Width) && (coords.Y>=rect.Top) && (coords.Y<=rect.Top+rect.Height));
      else
	 return ((coords.X>=rect.L) && (coords.X<=rect.L+rect.W) && (coords.Y>=rect.T) && (coords.Y<=rect.T+rect.H));
   },
   CheckPointInBox(coords, rect, XY) {
      return (this.PointInBox(coords, rect, XY));
   },
   PointInCircle(point, cCenter, cRadius) {  //OBSOLETE
      var distanceX, distanceY;

      distanceX = cCenter.X - point.X;
      distanceY = cCenter.Y - point.Y;

      return (this.GetMagnitude( { X: distanceX, Y: distanceY } )<=cRadius)
   },
   CheckPointInCircle(point, cCenter, cRadius) {  //c- circle

      //First do a basic check to save calculation time - NOTE: this cuts down duration to roughly half
      if (Math.abs(point.X-cCenter.X)>cRadius)
	 return (false);
      if (Math.abs(point.Y-cCenter.Y)>cRadius)
	 return (false);

      return (this.PointInCircle(point, cCenter, cRadius));
   },
   CheckCirclesIntersection(c1Center, c1Radius, c2Center, c2Radius) {
      var distance;	//between centers

//      distance = this.GetMagnitude(c1Center.X-c2Center.X, c1Center.Y-c2Center.Y);
      distance = this.GetDistance(c1Center, c2Center);
      return(distance<=c1Radius+c2Radius);
   },
   BoxesIntersecting(rect1, rect2) {  //TODO: REDUNDANT
      if (this.PointInBox( { X: rect1.L, Y: rect1.T }, rect2))
	 return (true);
      if (this.PointInBox( { X: rect1.L+rect1.W, Y: rect1.T }, rect2))
	 return (true);
      if (this.PointInBox( { X: rect1.L+rect1.W, Y: rect1.T+rect1.H }, rect2))
	 return (true);
      if (this.PointInBox( { X: rect1.L, Y: rect1.T+rect1.H }, rect2))
	 return (true);
      return (false);
   },
   CheckBoxBoxIntersection(rect1, rect2) {
      return (this.BoxesIntersecting(rect1, rect2));
   },
   CheckBoxCircleIntersection(rct, cPos, rds) {
      if (this.CheckPointInBox(cPos, rct))
	 return (true);
      if (this.CheckPointInCircle( { X: rct.L, Y: rct.T }, cPos, rds))
	 return (true);
      if (this.CheckPointInCircle( { X: rct.L+rct.W, Y: rct.T }, cPos, rds))
	 return (true);
      if (this.CheckPointInCircle( { X: rct.L+rct.W, Y: rct.T+rct.H }, cPos, rds))
	 return (true);
      if (this.CheckPointInCircle( { X: rct.L, Y: rct.T+rct.H }, cPos, rds))
	 return (true);
      return (false);
   },
   RotateCoordinates(coords, angle, bAnticlockwise, bModify) {
      if (!angle)	//NOTE: this situation can occur in some computation-heavy situations
	 return;
      angle = this.DegreesToRadians(angle);
      if (bAnticlockwise) {
	 this.x = (coords.X*Math.cos(angle)) - (coords.Y*Math.sin(angle));
	 this.y = (coords.X*Math.sin(angle)) + (coords.Y*Math.cos(angle));
      } else {
	 this.x = (coords.Y*Math.sin(angle)) + (coords.X*Math.cos(angle));
	 this.y = (coords.Y*Math.cos(angle)) - (coords.X*Math.sin(angle));
      }

      if (bModify) {
	 coords.X = this.x;
	 coords.Y = this.y;
      } else
	 return ( { X: this.x, Y: this.y } );
   },
   Wait(frames) {  //NON-FUNCTIONAL
      this.WaitFrames = frames;
      this.Frames = 0;
      this.ExecuteWaitLoop();
   },
   ExecuteWaitLoop() {  //NON-FUNCTIONAL

      this.AnimationFrameHandle = requestAnimationFrame(this.ExecuteWaitLoop.bind(this));

      ++this.Frames;
      if (this.Frames==this.WaitFrames)
	 cancelAnimationFrame(this.AnimationFrameHandle);
   },
   StringOrInteger(value) {
      var val;

      val = parseInt(value);
      if (val || (val===0))
	 return (val);
      else
	 return (value);
   }
};

Utilities = new GenieUtilities();
