
//---------------------------------------------------
//---------- CRACKLE WORD LEDGER --------------------
var CrackleWordLedger = function() {
   var Screen;
   var SectionImage, LetterImages;
   var Entries;
   var Word;
   var EntryIndex;
   var X, Y;
};
CrackleWordLedger.prototype = {
   Set(cntxt) {

      this.Screen = cntxt;
      this.EntryIndex = 0;
      this.Entries = new Array();
   },
   SetImages(lImages) {

      this.SectionImage = new GenieImage();
      this.SectionImage.Set(this.Screen, ImageManager.Pics[IMAGeINDEX.MINiIMAGES], { L: 69, T: 101, W: 41, H: 41 } );
      this.LetterImages = lImages;
   },
   SetWord(word) {

      this.Word = word;
      this.X = CRACKLE.LEDGER.X - Math.round((this.Word.length-5)*(CRACKLE.SECTION.FRAME.W/2));
      this.Y = CRACKLE.LEDGER.Y;
   },
   Draw() {  //Frame and background
      var i, j;
      var x, y;

      this.Screen.fillStyle = CRACKLE.COLOUR.SECTION;
      this.Screen.fillRect(this.X, this.Y, this.Word.length*(CRACKLE.SECTION.FRAME.W-2), this.Word.length*(CRACKLE.SECTION.FRAME.H-2));
      for (i=0;i<this.Word.length;++i)
	 for (j=0;j<this.Word.length;++j) {
	    x = this.X + (j*(CRACKLE.SECTION.W+2));
	    y = this.Y + (i*(CRACKLE.SECTION.H+2));
	    this.SectionImage.Draw(x, y);
	 }
   },
   DrawEntry(iEntry) {
      var i;
      var x, y;

      for (i=0;i<this.Word.length;++i) {

	 x = this.X + (i*(CRACKLE.SECTION.FRAME.W-2));
	 y = this.Y + (iEntry*(CRACKLE.SECTION.FRAME.W-2));
	 if (this.Entries.length>this.Word.length)
	    y -= (this.Entries.length-this.Word.length)*(CRACKLE.SECTION.FRAME.W-2);
//	    y -= ((iEntry-this.Word.length)+1)*(CRACKLE.SECTION.FRAME.W-2);

	 //Section colour
	 if (this.Entries[iEntry][i]==this.Word[i])
	    this.Screen.fillStyle = CRACKLE.SECTION.COLOUR.CORRECT;
	 else if (this.Word.includes(this.Entries[iEntry][i]))
	    this.Screen.fillStyle = CRACKLE.SECTION.COLOUR.CLOSE;
	 else
	    this.Screen.fillStyle = CRACKLE.SECTION.COLOUR.WRONG;
	 this.Screen.fillRect(x+2, y+2, CRACKLE.SECTION.W, CRACKLE.SECTION.H);

	 //Letter
	 this.LetterImages.DrawPatchNumber(Alphabet.indexOf(this.Entries[iEntry][i]), x+10, y+6);
      }
   },
   DrawEntries() {
      var i;

      if (this.Entries.length>this.Word.length)
	 for (i=this.Word.length;i>0;--i)
	    this.DrawEntry(this.Entries.length-i);
      else
	 this.DrawEntry(this.Entries.length-1);
   },
   Update(letters) {
      var i;
      var aLetters;

      aLetters = new Array(this.Word.length);
      for (i=0;i<this.Word.length;++i)
	 aLetters[i] = letters[i];
      this.Entries.push(aLetters);
      this.DrawEntries();
   },
   Clear() {

      this.Entries.length = 0;
      this.Screen.fillStyle = CRACKLE.COLOUR.BACKGROUND;
      this.Screen.fillRect(this.X, this.Y, this.Word.length*CRACKLE.SECTION.FRAME.W, this.Word.length*CRACKLE.SECTION.FRAME.H);
   }
};
