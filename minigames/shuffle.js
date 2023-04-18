/*
 *  TODO: fix solved alert pre-emption; better yet, have re-start method with a pop-up window
 *  TODO: disable right click
 *  TODO: make empty border tiles immovable
 *  TODO: post score
 *  TODO: don't count correct moves
 */
HouseMiniGames.prototype.SetWordShuffle = function() {

   this.Screen.fillStyle = SHUFFLE.BACKGROUND.COLOUR;
   this.Screen.fillRect(0, 0, SCREEN.WIDTH, SCREEN.HEIGHT);
   this.SetShuffleData();
   this.SelectShuffleWords();
   this.SetShuffleBoard();
   this.SetShuffleHint();
   this.SetShuffleRestart();
};
HouseMiniGames.prototype.SwitchFullScreen = function() {

   //UNLOGGED

   let elem = document.documentElement;

   elem.requestFullscreen({ navigationUI: "show" }).then(() => {}).catch(err => {
      alert(`An error occurred while trying to switch into fullscreen mode: ${err.message} (${err.name})`);});
};
HouseMiniGames.prototype.SetShuffleData = function() {
   var i;

   this.FourWords = new Array(4);
   this.State = SHUFFLE.STATE.STATIC;
   this.ShuffleWords = [ Words7a, Words7b, Words7c, Words7d, Words7e, Words7f, Words7g, Words7h, Words7i, Words7j, Words7k, Words7l, Words7m,
			 Words7n, Words7o, Words7p, Words7q, Words7r, Words7s, Words7t, Words7u, Words7v, Words7w ];
   this.WordDistribution = new Array(this.ShuffleWords.length);
   for (i=0;i<this.ShuffleWords.length;++i)
      this.WordDistribution[i] = this.ShuffleWords[i].length;
   this.ShuffleInfo = new ShuffleInfoPanel();
   this.ShuffleInfo.Set(this.Screen, this.GraphicsTool, this.TextWriter);
   this.ShuffleInfo.Display();
};
HouseMiniGames.prototype.SetShuffleBoard = function() {

   this.Board = new ShuffleBoard();
   this.Board.Set(this.Screen, this.Randomizer);
   this.Board.SetWords(this.FourWords);
   this.Board.Draw();
   this.SelectedTile = new GenieTile();
};
HouseMiniGames.prototype.SetShuffleHint = function() {
   var l, t;

   l = SHUFFLE.BOARD.L + SHUFFLE.BOARD.W + (2*SHUFFLE.TILE.SIZE.W);
   t = SHUFFLE.BOARD.T + SHUFFLE.BOARD.H - 20;
   this.ShuffleHintButton = new TextButton();
   this.ShuffleHintButton.Set(this.Interface.PrimeScape, { L: l, T: t, W: 60, H: 20, LABEL: "Hint", COLOUR: GREY.ASH, BACKGROUND: GREY.LIGHT }, this.TextWriter);
   this.ShuffleHintButton.Show();
};
HouseMiniGames.prototype.SetShuffleRestart = function() {
   var l, t;

   l = SHUFFLE.BOARD.L + (SHUFFLE.BOARD.W/2) - 40;
   l = Math.round(l);
   t = SHUFFLE.BOARD.T + SHUFFLE.BOARD.H + (2*SHUFFLE.TILE.SIZE.W);
   this.ShuffleRestartButton = new TextButton();
   this.ShuffleRestartButton.Set(this.Interface.PrimeScape, { L: l, T: t, W: 80, H: 20, LABEL: "Restart", COLOUR: GREY.ASH, BACKGROUND: GREY.LIGHT }, this.TextWriter);
   this.ShuffleRestartButton.Show();
};
HouseMiniGames.prototype.SelectShuffleWords = function() {  //TODO: duplicate 3rd and 4th words can exist
   var iSlot, iLttr;
   var aWords;

   //Get first 3 words
   do {

      //Pick top-left letter, get list of words starting with it
      iSlot = this.Randomizer.GetSlot(this.WordDistribution);
      this.GetTruncatedList(this.ShuffleWords[iSlot]);

      //Get top and left words
      aWords = new Array(2);
      this.Randomizer.GetUniqueIndices(aWords, 2, this.WordList.length);
      this.FourWords[0] = this.WordList[aWords[0]];
      this.FourWords[3] = this.WordList[aWords[1]];

      //Get right word
      iLttr = Alphabet.indexOf(this.FourWords[0][6]);
      this.GetTruncatedList(this.ShuffleWords[iLttr]);
      iSlot = this.Randomizer.GetIndex(this.WordList.length);
      this.FourWords[1] = this.WordList[iSlot];

      //Get bottom word
      iLttr = Alphabet.indexOf(this.FourWords[3][6]);
      this.GetTruncatedList(this.ShuffleWords[iLttr], this.FourWords[1][6]);
   } while (this.WordList.length==0);

   //Pick final word
   iSlot = this.Randomizer.GetIndex(this.WordList.length);
   this.FourWords[2] = this.WordList[iSlot];
};
HouseMiniGames.prototype.GetTruncatedList = function(aWords, eLttr) {  //e- end . . . NOTE: this eliminates words that won't fit in a quartet
   var i;

   this.WordList = new Array();
   for (i=0;i<aWords.length;++i)
      if (aWords[i][6]!="x" && aWords[i][6]!="y" && aWords[i][6]!="z") {
	 if (eLttr) {
	    if (aWords[i][6]==eLttr)
	       this.WordList.push(aWords[i]);
	 } else
	    this.WordList.push(aWords[i]);
      }
};
HouseMiniGames.prototype.SetShuffleLetters = function() {
   var r, c;
   var iTile;

   this.WordLetters = this.FourWords[0].concat(this.FourWords[1].substring(1), this.FourWords[2].substring(0, 6), this.FourWords[3].substring(1, 6));
   this.LetterIndices = new Array(this.WordLetters.length);
   this.Randomizer.Shuffle(this.LetterIndices, null, true);
   this.LetterGrid = ArrayUtils.Create2D(7, 7);
   iTile = 0;
   for (r=1;r<6;++r)
      for (c=1;c<6;++c) {
	 if (r==3 && c==3)
	    continue;
	 else
	    this.LetterGrid[r][c] = this.WordLetters[this.LetterIndices[iTile]];
	 ++iTile;
      }
};
HouseMiniGames.prototype.PlayWordShuffle = function() {

   this.AnimationFrameHandle = requestAnimationFrame(this.PlayWordShuffle.bind(this));

   this.ProcessShuffleMouse();
   this.DrawShuffleTile();
};
HouseMiniGames.prototype.ProcessShuffleMouse = function() {

   this.ProcessShuffleDown();
   this.ProcessShuffleClick();
   this.ShuffleMouseAbsent();
};
HouseMiniGames.prototype.ProcessShuffleDown = function() {
   var iTile;

   if (Mouse.CheckDowned(CANVAS.PRIME)) {

      //Process downings outside play area
      if (!this.Board.CheckAccessed(!CLICKED)) {
	 if (this.State==SHUFFLE.STATE.SELECTING) {
	    this.DownTile.Reset();
	    this.State = SHUFFLE.STATE.STATIC;
	    this.Board.Draw();
	 }
	 return;
      }

      //Ignore if shuffle tile is downed
      this.Board.DetermineTile(this.SelectedTile, !CLICKED);
      if (this.SelectedTile.C==3 && this.SelectedTile.R==3)
	 return;

      //Process downings in play area
      if (this.State==SHUFFLE.STATE.STATIC) {				//determine tile, re-draw it
	 this.DownTile = this.Board.TileGrid[this.SelectedTile.R][this.SelectedTile.C];
	 if (this.DownTile.Letter) {
	    this.DownTile.State = SHUFFLE.TILE.STATE.DOWNED;
	    this.DownTile.Draw();
	 }
      } else {
	 this.TargetTile = this.Board.TileGrid[this.SelectedTile.R][this.SelectedTile.C];
	 if (this.TargetTile===this.DownTile) {
/*
	    this.TargetTile.State = SHUFFLE.TILE.STATE.NORMAL;
	    this.State = SHUFFLE.STATE.STATIC;
	    this.Board.Draw();
*/
	 } else {
	    this.Board.SwapTiles(this.TargetTile, this.DownTile);
	    this.TargetTile.Reset();
	    this.DownTile.Reset();
	    this.Board.Draw();
	    if (this.TargetTile.Status!=SHUFFLE.TILE.STATUS.CORRECT)
	       ++this.ShuffleInfo.Moves;
	    this.ShuffleInfo.DisplayMovesBox();
	    this.CheckShuffleSolved();
	 }
	 this.State = SHUFFLE.STATE.STATIC;
      }
   } else
      Mouse.ClearDownings();
};
HouseMiniGames.prototype.ProcessShuffleClick = function() {

   if (this.ShuffleHintButton.CheckClicked()) {
      this.Board.PlaceHint();
      ++this.ShuffleInfo.Hints;
      this.ShuffleInfo.DisplayHintsBox();
      return;
   }

   if (this.ShuffleRestartButton.CheckClicked()) {
      this.RestartShuffle();
      return;
   }

   if (Mouse.CheckLeftClicked(CANVAS.PRIME)) {

      //Process downings outside play area
      if (!this.Board.CheckAccessed(CLICKED)) {
	 if (this.State==SHUFFLE.STATE.SELECTING) {
	    this.DownTile.State = SHUFFLE.TILE.STATE.NORMAL;
	    this.Board.Draw();
	    this.State = SHUFFLE.STATE.STATIC;
	 }
	 return;
      }

      //Determine tile clicked
      this.SelectedTile.C = Math.floor((Mouse.Click.X-SHUFFLE.BOARD.L)/SHUFFLE.TILE.SIZE.W);
      this.SelectedTile.R = Math.floor((Mouse.Click.Y-SHUFFLE.BOARD.T)/SHUFFLE.TILE.SIZE.H);
      this.TargetTile = this.Board.TileGrid[this.SelectedTile.R][this.SelectedTile.C];

      //Check if shuffle tile is clicked
      if (this.SelectedTile.C==3 && this.SelectedTile.R==3) {
	 if (this.DownTile) {
	    this.DownTile.Reset();
	    this.State = SHUFFLE.STATE.STATIC;
	 }
	 this.Board.ShuffleTiles();
	 ++this.ShuffleInfo.Shuffles;
	 this.ShuffleInfo.DisplayShufflesBox();
	 this.Board.Draw();
	 return;
      }

      //Swap tiles or select tile, depending on state
      if (this.State==SHUFFLE.STATE.STATIC) {
	 if ( this.TargetTile.Letter=="" || !this.TargetTile.Letter )
	    return;
	 if (this.TargetTile===this.DownTile)		//select tile to be re-located
	    this.State = SHUFFLE.STATE.SELECTING;
	 else						//cancel downed tile
	    this.DownTile.Reset();
      } else {						//ignore click if tile is being placed
	 this.State = SHUFFLE.STATE.STATIC;
      }
   } else
      Mouse.ClearClicks();
};
HouseMiniGames.prototype.ShuffleMouseAbsent = function() {

   if ( Mouse.X<(SHUFFLE.BOARD.L-SHUFFLE.TILE.SIZE.W) || Mouse.X>(SHUFFLE.BOARD.L+SHUFFLE.BOARD.W+SHUFFLE.TILE.SIZE.W)
	|| Mouse.Y<(SHUFFLE.BOARD.T-SHUFFLE.TILE.SIZE.H) || Mouse.Y>(SHUFFLE.BOARD.T+SHUFFLE.BOARD.H+SHUFFLE.TILE.SIZE.H) )
      if (this.State==SHUFFLE.STATE.SELECTING) {
	 this.DownTile.Reset();
	 this.State = SHUFFLE.STATE.STATIC;
	 this.Board.Draw();
      }
};
HouseMiniGames.prototype.DrawShuffleTile = function() {
   var iLetter;

   if (this.State==SHUFFLE.STATE.SELECTING) {
      this.Board.Draw();
      this.Screen.globalAlpha = 0.5;
      this.Screen.fillStyle = "rgb(191,191,255)";
      this.Screen.fillRect(Mouse.X, Mouse.Y, SHUFFLE.TILE.SIZE.W, SHUFFLE.TILE.SIZE.H);
      iLetter = this.Board.Alphabet.indexOf(this.DownTile.Letter);
      this.Board.LetterImages.DrawPatchNumber(iLetter, Mouse.X+6, Mouse.Y+2);
      this.Screen.globalAlpha = 1.0;
   }
};
HouseMiniGames.prototype.CheckShuffleSolved = function() {

   if (this.Board.CheckSolved()) {
      cancelAnimationFrame(this.AnimationFrameHandle);
      alert("Puzzle solved!");
      this.PollRestart();
   }
};
HouseMiniGames.prototype.RestartShuffle = function() {

   this.ShuffleInfo.Reset();
   this.ShuffleInfo.Display();
   this.SelectShuffleWords();
   this.SetShuffleBoard();
};
HouseMiniGames.prototype.PollRestart = function() {

   this.AnimationFrameHandle = requestAnimationFrame(this.PollRestart.bind(this));

   if (this.ShuffleRestartButton.CheckClicked()) {
      cancelAnimationFrame(this.AnimationFrameHandle);
      this.RestartShuffle();
      Mouse.ClearClicks();
      this.PlayWordShuffle();
   }
};
