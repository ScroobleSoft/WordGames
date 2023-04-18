
//Degrees (actually, this could be here)
//Magnitude or distance
//Font height
//String or integer

/*
   2 methods that can think of right now that will be here-
   ::CreateArray
   ::Create2DArray
*/

/*
will break it apart into
-GradeUtilities (actually, this could be here)
-RandomUtilities
-MagnitudeUtilities
-ArrayUtilities
-IntersectionUtilities
-CoordinateUtilities
don't have to include all of these - only the ones being used, and can have a few more
-StringUtilities
*/

//-----------------------------------------------
//---------- GENIE UTILITIES --------------------
var GeneralGenieUtilities = function() {		//TODO: 'General' will be removed once old Utilities have been phased out
/*
   //FUTURE: if getting cos and sin is slow, can keep a table of values of principle or all 360 angles
   var SinHalf45, CosHalf45;

   var X, Y;
   var Rectangle;

*/
   var AnimationFrameHandle;
   var Object, Ticks, FunctionIndex;		//used for delay
   var i;
};
GeneralGenieUtilities.prototype = {
   Set() {
   },
   CreateArray(size, type) {  //TODO: move to ArrayUtils
      var i, j;
      var array;
      var element;

      array = new Array(size);
      for (i=0;i<size;++i) {
	 if (type) {
	   element = new type();
	   array[i] = element;
	 } else
	   array[i] = 0;
      }
      return (array);
   },
   SwapElements(array, eIndx1, eIndx2) {  //NOTE: method for work on arrays that are not GenieArray . . . TODO: move to ArrayUtils
      var elmnt;

      elmnt = array[eIndx2];
      array[eIndx2] = array[eIndx1];
      array[eIndx1] = elmnt;
   },
   CheckEven(val) {

      return ((val % 2)==0);
   },
   CheckOdd(val) {

      return (val % 2);
   },
   SwapValues(val1, val2) {
      var val;

      val = val2;
      val2 = val1;
      val1 = val;
   },
   SafeIncrement(val, ovrflw) {

      ++val;
      if (val>=ovrflw)
      val -= ovrflw;
      return (val);
   },
   CheckVowel(lttr) {
      lttr = lttr.toLowerCase();
      if (Vowels.indexOf(lttr)==-1)
	 return (false);
      else
	 return (true);
   },
   CheckConsonant(lttr) {
      var iCnsnnt;

      lttr = lttr.toLowerCase();
      if (Consonants.indexOf(lttr)==-1)
	 return (false);
      else
	 return (true);
   },
   CheckBit(intgr, iBit) {
      return (intgr & Math.pow(2,iBit));
   },
   Delay(objct, ticks, iFnctn) {  //UNTESTED . . . NOTE: naturally, delay is in frames and not ms

      this.Object = object;
      this.Ticks = ticks;
      this.FunctionIndex = iFnctn;
      this.i = 0;
      this.DelayLoop();
   },
   DelayLoop() {

      this.AnimationFrameHandle = requestAnimationFrame(this.DelayLoop.bind(this));

      ++this.i;
      if (this.i==this.Ticks) {
	 cancelAnimationFrame(this.AnimationFrameHandle);
	 Mouse.ClearClicks();						//NOTE: number of Controllers is unknown, so have to be reset elsewhere
	 this.Object.DelayOver(this.FunctionIndex);			//ASSUMPTION: object has ::DelayOver implemented
      }
   },
   GetBits(val, sBits, eBits) {  //s- start, e- end (from left to right)
      var mask;

      mask = Math.pow(2,(sBits-eBits)+1) - 1;
      mask << eBits;
      val &= mask;
      return (val >> eBits);
   },
   NumberToGrade(number) {
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
   ReverseString(str) {
      var aLttrs;

      aLttrs = Array.from(str);
      aLttrs.reverse();
      str = aLttrs.join("");
      return (str);
   }
};

var Utils = new GeneralGenieUtilities();
Utils.Set();
