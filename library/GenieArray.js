
//-------------------------------------------
//---------- GENIE ARRAY --------------------
var GenieArray = function() {
   var Empty;	//index of next open slot
};
GenieArray.prototype = new Array();  //NOTE: declaring size here will never work
GenieArray.prototype.Set = function(quantity, type, indxd) {
   var i;
   var element;
   var aArray;  //a- arguments

   this.Empty = 0;

   if (arguments.length>3) {
      aArray = new Array(arguments.length-3);
      for (i=0;i<aArray.length;++i)
	 aArray[i] = arguments[i+3];
   }

   for (i=0;i<quantity;++i) {
      if (arguments[1]) {
	 element = new type();
	 if (indxd)
	    element.Index = i;
	 if (element.Set)
	    element.Set.apply(element, aArray);
      } else
	 element = 0;
      this.push(element);
   }
};
GenieArray.prototype.GetSubArray = function(start, end) {
   var i;
   var sArray;  //s- sub

   //UNLOGGED - UNTESTED

   sArray = new Array((end-start)+1);
   for (i=start;i<=end;++i)
      sArray[i-start] = this[i];

   return (sArray);
};
GenieArray.prototype.Insert = function(elmnt, eIndx) {
   this.splice(eIndx, 0, elmnt);
};
GenieArray.prototype.InsertAtFront = function(elmnt) {
   this.unshift(elmnt);
};
GenieArray.prototype.AddSafe = function(elmnt) {
   if (this.Empty==this.length)
      this.push(elmnt);
   else
      this[this.Empty] = elmnt;
   ++this.Empty;
};
GenieArray.prototype.AddUnique = function(elmnt) {
   if (!this.includes[elmnt])
      this.push(elmnt);
};
GenieArray.prototype.Remove = function(eIndx, nItems) {
   nItems = nItems || 1;
   this.splice(eIndx, nItems);
};
GenieArray.prototype.RemoveAll = function() {  //NOTE: this could be re-written if a better garbage collection method is found
   this.length = 0;
};
GenieArray.prototype.RemoveElement = function(elmnt) {  //NOTE: returns 'false' is element not found
   var i;

   for (i=0;i<this.length;++i)
      if (this[i]===elmnt) {
	 this.Remove(i);
	 return (true);
      }
   return (true);
};
GenieArray.prototype.Extract = function(eIndx) {  //e- element . . . NOTE: only one item retrieved
   return (this.splice(eIndx, 1)[0]);
};
GenieArray.prototype.Swap = function(eIndx1, eIndx2) {  //e- element
   var element;

   element = this.splice(eIndx1, 1);
   this.splice(eIndx2, 0, element[0]);
   if (eIndx1<eIndx2)
      element = this.splice(eIndx2-1, 1);
   else
      element = this.splice(eIndx2+1, 1);
   this.splice(eIndx1, 0, element[0]);
};
GenieArray.prototype.Flush = function(val) {  //TODO: can instead just use .fill() if a value is supplied
   var i;

   val = val || 0;
   for (i=0;i<this.length;++i)
      this[i] = val;
};
GenieArray.prototype.GetMinIndex = function() {  //returns index of smallest entry (assuming all entries are numbers)
   var i;
   var val;
   var indx;

   //NOTE: if there are duplicate minimum values, one with the lowest index is returned

   indx = 0;
   val = this[indx];
   for (i=1;i<this.length;++i)
      if (this[i]<val) {
	 val = this[i];
	 indx = i;
      }
   return(indx);
};
GenieArray.prototype.RotateLeft = function(nElmnts) {
   var i, j;
   var elmnt;

   if (nElmnts==0)
      return;

   for (i=0;i<nElmnts;++i) {
      elmnt = this[0];
      for (j=0;j<this.length-1;++j)
	 this[j] = this[j+1];
      this[this.length-1] = elmnt;
   }
};
GenieArray.prototype.RotateRight = function(nElmnts) {
   var i, j;
   var elmnt;

   if (nElmnts==0)
      return;

   for (i=0;i<nElmnts;++i) {
      elmnt = this[this.length-1];
      for (j=this.length-1;j>0;--j)
	 this[j] = this[j-1];
      this[0] = elmnt;
   }
};
