/* 
   below is the algorithm implemented (called xorshift128+) in ::GetValue

	uint64_t a = s[0];
	uint64_t b = s[1];
	s[0] = b;
	a ^= a << 23;
	a ^= a >> 18;
	a ^= b;
	a ^= b >>  5;
	s[1] = a;
	return a + b;

   TODO: eventually, will add Mersenne Twister as an option to use, but not any time soon since it is a bit elaborate
	 also, Middle Square will be retired
*/
//------------------------------------------------
//---------- GENIE RANDOMIZER --------------------
var GenieRandomizer = function() {
   var Seed1, Seed2;
   var SavedSeed1, SavedSeed2;
   var Value;

   var i, j, flag, sum, thrshld, num1, num2;		//scratch variables
};
GenieRandomizer.prototype = {
   Set(seed1, seed2) {
      this.Seed1 = seed1;
      this.Seed2 = seed2;
      if (!this.Seed1 && !this.Seed2)
	 this.GenerateSeeds();
   },
   SetSeeds(sd1, sd2) {

      this.Seed1 = sd1;
      this.Seed2 = sd2;
   },
   SaveSeeds() {

      this.SavedSeed1 = this.Seed1;
      this.SavedSeed2 = this.Seed2;
   },
   RestoreSeeds() {

      this.Seed1 = this.SavedSeed1;
      this.Seed2 = this.SavedSeed2;
   },
   GenerateSeeds() {

      this.Seed1 = Math.round(Math.pow(2, 32)*Math.random());		//NOTE: picking 2^32 as max number to be on the safe side and avoid overflows
      this.Seed2 = Math.round(Math.pow(2, 32)*Math.random());
   },
   GetValue() {  //returns between 0 and 2^32 . . . this is the main algorithm implementation

      this.num1 = this.Seed1;
      this.num2 = this.Seed2;

      this.Seed1 = this.num2;
      this.num1 ^= this.num1 << 23;
      this.num1 ^= this.num1 >> 18;
      this.num1 ^= this.num2;
      this.num1 ^= this.num2 >>  5;
      this.Seed2 = this.num1;

      return (this.num1+this.num2);   
   },
   GetSeededValue(sd1, sd2, iVal) {  //iVal- number in seeded sequence

      this.SaveSeeds();
      this.SetSeeds(sd1, sd2);
      for (this.i=0;this.i<iVal;++this.i)
	 this.Value = this.GetValue();
      this.RestoreSeeds();
      return (this.Value);
   },
   GetInRange(start, end) {

      if (start<0 || end<0)
	 return (null);
      if (start==end)
	 return (start);
      if (end<start) {		//check if values need to be flipped
	 this.Value = start;
	 start = end;
	 end = this.Value;
      }
      this.Value = this.GetValue() % ((end-start)+1);
      this.Value += start;
      return (this.Value);
   },
   GetIndex(nItems) {  //NOTE: to be used when start of range is 0

      if (nItems<=1)
	 return (0);
      else
	 return (this.GetInRange(0, nItems-1));
   },
   CheckBoolean() {

      return (this.GetValue() % 2);
   },
   GetUnique(aNum, quantity, start, end) {  //NOTE: aNum array must be created before being passed in

      //Initialize array
      for (this.i=0;this.i<aNum.length;++this.i)
	 aNum[this.i] = -1;

      //Populate array
      for (this.i=0;this.i<quantity;++this.i) {
	 do {
	    this.Value = this.GetInRange(start, end);
	 } while (aNum.includes(this.Value));
	 aNum[this.i] = this.Value;
      }
   },
   GetUniqueIndices(aNum, quantity, nIndices) {

      this.GetUnique(aNum, quantity, 0, nIndices-1);
   },
   Shuffle(aNum, size, bInit) {  //NOTE: this is Durstenfeld's version of the Fisher-Yates Shuffle, and more efficient than ::GetUniqueNumbers

      //NOTE: this cannot replace ::GetUniqueNumbers since the latter can be used to deliver a sub-set of numbers within a range

      //Create array if necessary
      if (!aNum) {
	 aNum = new Array(size);
	 this.flag = true;
      } else
	 this.flag = false;

      //Fill array if indicated
      if (bInit)
	 for (this.i=0;this.i<aNum.length;++this.i)
	    aNum[this.i] = this.i;

      //Pick a random index, move value located there to front of array, repeat while contracting array from the front
      for (this.i=0;this.i<(aNum.length-1);++this.i) {
	 this.j = this.GetInRange(this.i, aNum.length-1);
	 if (this.j==this.i)
	    continue;
	 else {
	    this.Value = aNum[this.i];
	    aNum[this.i] = aNum[this.j];
	    aNum[this.j] = this.Value;
	 }
      }

      //Return array if it has been newly created
      if (this.flag)
	 return (aNum);
   },
   CheckUnderOdds(nmrtr, dnmntr) {

      return (this.GetInRange(1,dnmntr)<=nmrtr);
   },
   GetSlot(sArray) {  //s- slot . . . NOTE: no slot value should be 0

      //Get cumulative sum of values in slots
      this.sum = 0;
      for (this.i=0;this.i<sArray.length;++this.i)
	 this.sum += sArray[this.i];

      this.Value = this.GetIndex(this.sum);

      //Pick slot
      this.thrshld = 0;
      for (this.i=0;this.i<sArray.length;++this.i) {
	 this.thrshld += sArray[this.i];
	 if (this.Value<this.thrshld)
	    return (this.i);
      }
   },
   GetDistributedArray(dArray, wArray) {  //d- distributed, w- weighted . . . the dArray is filled up based on weight of each slot - NOTE: dArray.length==wArray.length

      //Get total number of values to be distributed
      this.sum = 0;
      for (this.i=0;this.i<wArray.length;++this.i) {
	 this.sum += wArray[this.i];
	 dArray[this.i] = 0;
      }

      //Fill up the distributed array
      for (this.i=0;this.i<this.sum;++this.i) {
	 this.Value = this.GetIndex(this.sum);
	 this.thrshld = 0;
	 for (this.j=0;this.j<wArray.length;++this.j) {
	    this.thrshld += wArray[this.j];
	    if (this.Value<this.thrshld)
	       break;
	 }
	 ++dArray[this.j];
      }
   },
   GetWinner(val1, val2, invrtd) {    //index of winner is returned; INVERTED means lower value is better

      if (!val1 || !val2) {  //NOTE: this check is added in case agent ratings are being passed (in which case values can be 0)
	 ++val1;
	 ++val2;
      }
      this.sum = val1 + val2;
      if (this.GetInRange(1, this.sum)>val1) {
	 if (invrtd)
	    return (0);
	 else
	    return (1);
      } else {
	 if (invrtd)
	    return (1);
	 else
	    return (0);
      }
   },
   PickRandomValue(aValues) {

      return (aValues[this.GetIndex(aValues.length)]);
   },
   Fluctuate() {

      this.Value = this.GetInRange(0,2);
      --this.Value;
      return (this.Value);
   }
};
