
//--------------------------------------------
//---------- SHUFFLE TILE --------------------
var ShuffleTile = function() {
   var Screen;
   var Board;
   var X, Y, Row, Col, Index;
   var Status;			//correctness of placement
   var Letter;
   var State;			//downed/normal

   var num, colour;
};
ShuffleTile.prototype = {
   Set(cntxt, board, indx) {

      this.Screen = cntxt;
      this.Board = board;
      this.Index = indx;
      this.Row = Math.floor(this.Index/SHUFFLE.BOARD.C);
      this.Col = this.Index % SHUFFLE.BOARD.C;
      this.Status = SHUFFLE.TILE.STATUS.NEUTRAL;
      this.State = SHUFFLE.TILE.STATE.NORMAL;
   },
   Reset() {

      this.State = SHUFFLE.TILE.STATE.NORMAL;
      this.Board.DetermineTileStatus(this);
      this.Draw();
   },
   Draw() {

      this.DrawBackground();
      this.DrawOutline();
      this.DrawLetter();
   },
   DrawBackground() {

      switch (this.Status) {
	 case SHUFFLE.TILE.STATUS.NEUTRAL:
	    if (this.Board.BorderIndices.includes(this.Index))
	       colour = SHUFFLE.TILE.COLOUR.OUTER;
	    else
	       colour = SHUFFLE.TILE.COLOUR.INNER;
	    break;
	 case SHUFFLE.TILE.STATUS.WRONG:
	    colour = SHUFFLE.TILE.COLOUR.WRONG;
	    break;
	 case SHUFFLE.TILE.STATUS.CLOSE:
	    colour = SHUFFLE.TILE.COLOUR.CLOSE;
	    break;
	 case SHUFFLE.TILE.STATUS.CORRECT:
	    colour = SHUFFLE.TILE.COLOUR.CORRECT;
	    break;
      }
      this.Screen.fillStyle = colour;
      this.Screen.fillRect(this.X, this.Y, SHUFFLE.TILE.SIZE.W, SHUFFLE.TILE.SIZE.H);
   },
   DrawOutline() {

      switch (this.State) {
	 case SHUFFLE.TILE.STATE.NORMAL:
	    this.Board.TileImages.DrawPatchNumber(0, this.X, this.Y);
	    break;
	 case SHUFFLE.TILE.STATE.DOWNED:
	    this.Board.TileImages.DrawPatchNumber(1, this.X, this.Y);
	    break;
      }
   },
   DrawLetter() {

      if (this.Letter) {
	 if (this.State==SHUFFLE.TILE.STATE.NORMAL) {
	    this.num = this.Board.Alphabet.indexOf(this.Letter);
	    this.Board.LetterImages.DrawPatchNumber(this.num, this.X+8, this.Y+4);
	 } else {
	    this.num = this.Board.Alphabet.indexOf(this.Letter);
	    this.Board.LetterImages.DrawPatchNumber(this.num, this.X+9, this.Y+5);
	 }
      }
   }
};
