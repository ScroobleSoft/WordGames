
//------------------------------------------------------
//---------- CRACKLE INPUT KEYBOARD --------------------
var CrackleInputKeyboard = function() {
   var Screen;
   var SubmissionBox;
   var KeyImages, LetterImages;
   var KeyRows;
   var KeyBox;
   var KeyIndex;
};
CrackleInputKeyboard.prototype = {
   Set(cntxt) {

      this.Screen = cntxt;
      this.KeyRows = [ "qwertyuiop", "asdfghjkl", "zxcvbnm" ];
      this.KeyBox = new GenieRect();
      this.SetImages();
   },
   SetLinks(sBox) {

      this.SubmissionBox = sBox;
   },
   SetImages() {

      this.KeyImages = new GenieImage();
      this.KeyImages.Set(this.Screen, ImageManager.Pics[IMAGeINDEX.MINiIMAGES], { L: 1, T: 101, W: 66, H: 32, O: 2, C: 2, R: 1, PATCH: { W: 32, H: 32 } } );
      this.LetterImages = new GenieImage();
      this.LetterImages.Set(this.Screen, ImageManager.Pics[IMAGeINDEX.MINiIMAGES], { L: 111, T: 63, W: 231, H: 44, O: 3, C: 13, R: 2, PATCH: { W: 15, H: 21 }});
   },
   Draw() {
      var i, j;

      for (i=0;i<CRACKLE.KEYBOARD.ROWS;++i)
	 for (j=0;j<this.KeyRows[i].length;++j)
	    this.DrawKey(i, j, !PRESSED);
   },
   DrawKey(row, col, bPressed) {
      var x, y;
      var iLetter;

      x = CRACKLE.KEYBOARD.X + ((CRACKLE.KEY.W/2)*row) + (CRACKLE.KEY.W*col);
      y = CRACKLE.KEYBOARD.Y + (CRACKLE.KEY.H*row);
      iLetter = Alphabet.indexOf(this.KeyRows[row][col]);
      if (bPressed) {
	 this.KeyImages.DrawPatchNumber(1, x, y);
	 this.LetterImages.DrawPatchNumber(iLetter, x+9, y+7);
      } else {
	 this.KeyImages.DrawPatchNumber(0, x, y);
	 this.LetterImages.DrawPatchNumber(iLetter, x+8, y+6);
      }
   },
   UpdateClick() {
      var i;
      var l, t, w;

      for (i=0;i<CRACKLE.KEYBOARD.ROWS;++i) {
	 l = CRACKLE.KEYBOARD.X + ((CRACKLE.KEY.W/2)*i);
	 t = CRACKLE.KEYBOARD.Y + (CRACKLE.KEY.H*i);
	 w = this.KeyRows[i].length * CRACKLE.KEY.W;
	 this.KeyBox.Set(l, t, w, CRACKLE.KEY.H);
	 if (SpaceUtils.CheckPointInBox(Mouse.Click, this.KeyBox)) {
	    this.KeyIndex = Math.floor((Mouse.Click.X-l)/CRACKLE.KEY.W);
	    this.DrawKey(i, this.KeyIndex, PRESSED);
	    setTimeout(this.DrawKey.bind(this, i, this.KeyIndex, !PRESSED), 100);
	    this.SubmissionBox.Update(Alphabet.indexOf(this.KeyRows[i][this.KeyIndex]));
	    return;
	 }
      }
   }
};
