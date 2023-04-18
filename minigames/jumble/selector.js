
//-----------------------------------------------------
//---------- JUMBLE WORDS SELECTOR --------------------
var JumbleWordsSelector = function() {
   var Randomizer;
   var JumbleWords, SelectedWords;
   var Distribution;
   var WordList, FourthWordList, FifthWordList, SixthWordList;
};
JumbleWordsSelector.prototype = {
   Set(rGenerator) {

      this.Randomizer = rGenerator;
      this.SelectedWords = new Array(6);
      this.SetData();
   },
   SetData() {
      var i;

      //Words
      this.JumbleWords = [ Words5a, Words5b, Words5c, Words5d, Words5e, Words5f, Words5g, Words5h, Words5i, Words5j, Words5k, Words5l, Words5m,
			   Words5n, Words5o, Words5p, Words5q, Words5r, Words5s, Words5t, Words5u, Words5v, Words5w ];
      this.Distribution = new Array(this.JumbleWords.length);
      for (i=0;i<this.JumbleWords.length;++i)
	 this.Distribution[i] = this.JumbleWords[i].length;

      //Lists
      this.WordList = new Array();
      this.FourthWordList = new Array();
      this.FifthWordList = new Array();
      this.SixthWordList = new Array();
   },
   Select() {  //TODO: duplicates still an issue
      var iLttr;
      var iSlot;

      do {
	 this.GetThreeWords();

	 //Get next 3 words
	 iLttr = Alphabet.indexOf(this.SelectedWords[3][4]);
	 this.GetParedList(this.JumbleWords[iLttr], this.SelectedWords[1][4], this.FourthWordList);
	 if (this.FourthWordList.length!=0) {
	    iSlot = this.Randomizer.GetIndex(this.FourthWordList.length);
	    this.SelectedWords[2] = this.FourthWordList[iSlot];						//bottom word
	    iLttr = Alphabet.indexOf(this.SelectedWords[0][2]);
	    this.GetParedList(this.JumbleWords[iLttr], this.SelectedWords[2][2], this.FifthWordList);
	    if (this.FifthWordList.length!=0) {
	       iSlot = this.Randomizer.GetIndex(this.FifthWordList.length);
	       this.SelectedWords[4] = this.FifthWordList[iSlot];					//middle vertical word
	       iLttr = Alphabet.indexOf(this.SelectedWords[3][2]);
	       this.GetParedList(this.JumbleWords[iLttr], this.SelectedWords[1][2], this.SixthWordList);
	       if (this.SixthWordList.length!=0) {
		  this.GetMatchingList(this.SixthWordList, this.SelectedWords[4][2]);		//match middle letter
		  if (this.SixthWordList.length!=0) {
		     iSlot = this.Randomizer.GetIndex(this.SixthWordList.length);
		     this.SelectedWords[5] = this.SixthWordList[iSlot];					//middle horizontal word
		  }
	       }
	    }
	 }
      } while (this.FourthWordList.length==0 || this.FifthWordList.length==0 || this.SixthWordList.length==0);
   },
   GetThreeWords() {  //top, left and right
      var iSlot;
      var aWords;
      var iLttr;

      //Pick top-left letter, get list of words starting with it
      iSlot = this.Randomizer.GetSlot(this.Distribution);
      this.GetParedList(this.JumbleWords[iSlot], null, this.WordList);

      //Get top and left words
      aWords = new Array(2);
      this.Randomizer.GetUniqueIndices(aWords, 2, this.WordList.length);
      this.SelectedWords[0] = this.WordList[aWords[0]];
      this.SelectedWords[3] = this.WordList[aWords[1]];

      //Get right word
      iLttr = Alphabet.indexOf(this.SelectedWords[0][4]);
      this.GetParedList(this.JumbleWords[iLttr], null, this.WordList);
      iSlot = this.Randomizer.GetIndex(this.WordList.length);
      this.SelectedWords[1] = this.WordList[iSlot];
   },
   GetParedList(aWords, eLttr, wList) {  //e- end . . . NOTE: this eliminates words that won't fit in a quartet
      var i;

      wList.length = 0;
      for (i=0;i<aWords.length;++i)
      if (aWords[i][4]!="x" && aWords[i][4]!="y" && aWords[i][4]!="z") {
	 if (eLttr) {
	    if (aWords[i][4]==eLttr)
	       wList.push(aWords[i]);
	 } else
	    wList.push(aWords[i]);
      }
   },
   GetMatchingList(wList, lttr) {
      var i;
      var aWords;

      aWords = new Array();
      for (i=0;i<wList.length;++i)
	 if (wList[i]==lttr)
	    aWords.push(wList[i]);
      wList = aWords;
   }
};
