
//--------------------------------------------------------
//---------- CRACKLE SUBMISSION FIELD --------------------
var CrackleSubmissionField = function() {
   var Screen;
   var LetterImages, SectionImage;
   var WordLength;
   var CurrentIndex;
   var Letters;
   var X, Y, W, H;
};
CrackleSubmissionField.prototype = {
   Set(cntxt) {

      this.Screen = cntxt;
      this.CurrentIndex = 0;
   },
   SetImages(lImages) {

      this.SectionImage = new GenieImage();
      this.SectionImage.Set(this.Screen, ImageManager.Pics[IMAGeINDEX.MINiIMAGES], { L: 69, T: 101, W: 41, H: 41 } );
      this.LetterImages = lImages;
   },
   SetWordLength(wLength) {

      this.WordLength = wLength;
      this.Letters = new Array(this.WordLength);
      this.Letters.fill("");
      this.X = CRACKLE.SUBMISSION.X - Math.round((this.WordLength-5)*(CRACKLE.SECTION.FRAME.W/2));
      this.Y = CRACKLE.SUBMISSION.Y;
      this.W = (this.WordLength*(CRACKLE.SECTION.FRAME.W-2)) + 2;
      this.H = CRACKLE.SECTION.FRAME.H;
   },
   Draw() {  //frame and background
      var i, x;

      //Make background white
      this.Screen.clearRect(this.X, this.Y, this.WordLength*(CRACKLE.SECTION.FRAME.W-2), CRACKLE.SECTION.FRAME.H);

      //Draw frame
      for (i=0;i<this.WordLength;++i) {
	 x = this.X + (i*(CRACKLE.SECTION.FRAME.W-2));
	 this.SectionImage.Draw(x, this.Y);
      }

      //Colour first section
      this.Screen.fillStyle = CRACKLE.COLOUR.SUBMISSION;
      x = this.X + (this.CurrentIndex*(CRACKLE.SECTION.FRAME.W-2)) + 2;
      this.Screen.fillRect(x, this.Y+2, CRACKLE.SECTION.W, CRACKLE.SECTION.H);
   },
   Update(iLetter) {
      var x, y;

      this.Letters[this.CurrentIndex] = Alphabet[iLetter];

      //Write letter
      x = this.X + (this.CurrentIndex*(CRACKLE.SECTION.FRAME.W-2));
      y = this.Y;
      this.Screen.clearRect(x+2, y+2, CRACKLE.SECTION.W, CRACKLE.SECTION.H);
      this.LetterImages.DrawPatchNumber(iLetter, x+10, y+6);

      //Shift section
      ++this.CurrentIndex;
      if (this.CurrentIndex==this.WordLength)
	 this.CurrentIndex = 0;
      this.SelectSection(this.CurrentIndex);
   },
   SelectSection(iSctn) {
      var x;

      this.Screen.fillStyle = CRACKLE.COLOUR.SUBMISSION;
      x = this.X + (iSctn*(CRACKLE.SECTION.FRAME.W-2));
      this.Screen.fillRect(x+2, this.Y+2, CRACKLE.SECTION.W, CRACKLE.SECTION.H);
      if (this.Letters[iSctn]!="")
	 this.LetterImages.DrawPatchNumber(Alphabet.indexOf(this.Letters[iSctn]), x+10, this.Y+6);
   },
   DeSelectSection(iSctn) {
      var x;

      x = this.X + (iSctn*(CRACKLE.SECTION.FRAME.W-2));
      this.Screen.clearRect(x+2, this.Y+2, CRACKLE.SECTION.W, CRACKLE.SECTION.H);
      if (this.Letters[iSctn]!="")
	 this.LetterImages.DrawPatchNumber(Alphabet.indexOf(this.Letters[iSctn]), x+10, this.Y+6);
   },
   UpdateClick() {
      var x;
      var iSection;

      iSection = Math.floor((Mouse.Click.X-this.X)/(CRACKLE.SECTION.FRAME.W-2));
      if (iSection!=this.CurrentIndex) {
	 this.DeSelectSection(this.CurrentIndex);
	 this.CurrentIndex = iSection;
	 this.SelectSection(this.CurrentIndex);
      }
   },
   Erase() {

      this.Screen.fillStyle = CRACKLE.COLOUR.BACKGROUND;
      this.Screen.fillRect(this.X, this.Y, (this.WordLength*(CRACKLE.SECTION.FRAME.W-2))+2, CRACKLE.SECTION.FRAME.H);
   },
   Clear() {

      this.CurrentIndex = 0;
      this.Draw();
      this.Letters.fill("");
   },
   CheckFilled() {

      return (!this.Letters.includes(""));
   },
   CheckPartiallyFilled() {
      var i;

      for (i=0;i<this.WordLength;++i)
	 if (this.Letters[i]!="")
	    return (true);

      return (false);
   }
};
