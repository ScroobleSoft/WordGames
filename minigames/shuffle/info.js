
//--------------------------------------------------
//---------- SHUFFLE INFO PANEL --------------------
var ShuffleInfoPanel = function() {
   var Screen;
   var GraphicsTool, TextWriter;
   var Moves, Shuffles, Hints;
   var Left;
};
ShuffleInfoPanel.prototype = {
   Set(cntxt, gTool, tWriter) {

      this.Screen = cntxt;
      this.GraphicsTool = gTool;
      this.TextWriter = tWriter;
      this.Moves = 0;
      this.Shuffles = 0;
      this.Hints = 0;
      this.Left = SHUFFLE.BOARD.L + SHUFFLE.BOARD.W + (2*SHUFFLE.TILE.SIZE.W);
   },
   Reset() {

      this.Moves = 0;
      this.Shuffles = 0;
      this.Hints = 0;
   },
   Display() {

      this.DisplayMovesBox();
      this.DisplayShufflesBox();
      this.DisplayHintsBox();
   },
   DisplayMovesBox(moves) {

      this.DisplayInfoBox(20, "Moves", this.Moves);
   },
   DisplayShufflesBox() {

      this.DisplayInfoBox(80, "Shuffles", this.Shuffles);
   },
   DisplayHintsBox() {

      this.DisplayInfoBox(140, "Hints", this.Hints);
   },
   DisplayInfoBox(y, str, num) {

      y += SHUFFLE.BOARD.T;
      this.Screen.clearRect(this.Left, y, 100, 40);
      this.GraphicsTool.DrawRectangle(this.Left, y, 100, 40, SHUFFLE.BORDER.COLOUR, 0);
      this.GraphicsTool.DrawRectangle(this.Left, y, 100, 40, "white", 1);
      this.TextWriter.Write(str+":", this.Left+10, y+25, { COLOUR: "white" } );
      this.TextWriter.Write(num, this.Left+80, y+25, { COLOUR: "white" } );
   }
};
