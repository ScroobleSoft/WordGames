
//-----------------------------------------------
//---------- ARRAY UTILITIES --------------------
var ArrayUtilities = function() {
};
ArrayUtilities.prototype = {
   Create(size, type) {
      var i, j;
      var array;
      var element;
      var aArray;	//a- arguments

      array = new Array(size);
      for (i=0;i<size;++i) {
	 if (type) {
	    element = new type();
	    array[i] = element;
	    if (arguments.length>2) {
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
   Create2D(rows, columns, type) {
      var r, c;
      var column, array;
      var element;

      array = new Array(rows);
      for (r=0;r<rows;++r) {
	 column = new Array(columns);
	 for (c=0;c<columns;++c) {
	    if (type) {
	      element = new type();
	      column[c] = element;
	    } else
	      column[c] = 0;
	 }
	 array[r] = column;
      }
      return (array);
   },
   Clear2D(a2D, val) {
      var c, r;

      if (!val)
	 val = 0;

      for (c=0;c<a2D.length;++c)
	 for (r=0;r<a2D[c].length;++r)
	    a2D[c][r] = val;
   },
   Extract(arry, eIndx) {
      return (arry.splice(eIndx, 1)[0]);
   },
   InsertAtFront(arry, elmnt) {
      arry.unshift(elmnt);
   },
   GetAverage(arry) {
      var i;
      var sum;

      sum = 0;
      for (i=0;i<arry.length;++i)
	 sum += arry[i];

      return (sum/arry.length);
   }
};

var ArrayUtils = new ArrayUtilities();
