
//---------------------------------------------
//---------- SHUFFLE BOARD --------------------
var ShuffleBoard = function() {
   var Screen;
   var Randomizer;
   var TileGrid, BorderIndices, InnerIndices;
   var TopRow, RightColumn, BottomRow, LeftColumn;
   var Alphabet, WordsString;
   var TileImages, LetterImages, ShuffleImage;

   var c, r;			//scratch variables
};
ShuffleBoard.prototype = {
   Set(cntxt, rGenerator) {

      this.Screen = cntxt;
      this.Randomizer = rGenerator;
      this.SetGrid();
      this.SetImages();
      this.SetData();
   },
   SetGrid() {
      var r, c;
      var iTile;

      this.TileGrid = ArrayUtils.Create2D(SHUFFLE.BOARD.R, SHUFFLE.BOARD.C, ShuffleTile);

      iTile = 0;      
      for (r=0;r<SHUFFLE.BOARD.R;++r)
	 for (c=0;c<SHUFFLE.BOARD.C;++c) {
	    this.TileGrid[r][c].Set(this.Screen, this, iTile);
	    this.TileGrid[r][c].X = SHUFFLE.BOARD.L + (SHUFFLE.TILE.SIZE.W*c);
	    this.TileGrid[r][c].Y = SHUFFLE.BOARD.T + (SHUFFLE.TILE.SIZE.H*r);
	    ++iTile;
	 }
   },
   SetImages() {

      this.LetterImages = new GenieImage();
      this.LetterImages.Set(this.Screen, ImageManager.Pics[IMAGeINDEX.MINiIMAGES], { L: 1, T: 1, W: 308, H: 60, O: 4, C: 13, R: 2, PATCH: { W: 20, H: 28 } } );
      this.TileImages = new GenieImage();
      this.TileImages.Set(this.Screen, ImageManager.Pics[IMAGeINDEX.MINiIMAGES], { L: 1, T: 63, W: 74, H: 36, O: 2, C: 2, R: 1, PATCH: { W: 36, H: 36 } } );
      this.ShuffleImage = new GenieImage();
      this.ShuffleImage.Set(this.Screen, ImageManager.Pics[IMAGeINDEX.MINiIMAGES], { L: 77, T: 63, W: 32, H: 32 } );
   },
   SetData() {

      this.BorderIndices = [0,1,2,3,4,5,6,13,20,27,34,41,48,47,46,45,44,43,42,35,28,21,14,7];
      this.InnerIndices = [ [1,1],[2,1],[3,1],[4,1],[5,1],
			    [1,2],[2,2],[3,2],[4,2],[5,2],
			    [1,3],[2,3],[4,3],[5,3],
			    [1,4],[2,4],[3,4],[4,4],[5,4],
			    [1,5],[2,5],[3,5],[4,5],[5,5]  ];
      this.Alphabet = "abcdefghijklmnopqrstuvwxyz";
   },
   SetWords(aWords) {  //-there will be several statements here
      var word, aLttrs;

      //Record strings
      this.TopRow = aWords[0];
      this.RightColumn = aWords[1];
      this.BottomRow = aWords[2];
      this.LeftColumn = aWords[3];

      //Process strings
      this.WordsString = this.TopRow.concat(this.RightColumn.substring(1));
      word = this.BottomRow.substring(0,6);
      word = Utils.ReverseString(word);
      this.WordsString = this.WordsString.concat(word);
      word = this.LeftColumn.substring(1, 6);
      word = Utils.ReverseString(word);
      this.WordsString = this.WordsString.concat(word);

      this.AssignLetters();
      this.ShuffleTiles();
   },
   AssignLetters() {
      var r, c;
      var iTile;

      iTile = 0;
      for (r=1;r<SHUFFLE.BOARD.R-1;++r)
	 for (c=1;c<SHUFFLE.BOARD.C-1;++c) {
	    if (r==3 && c==3)
	       continue;
	    else
	       this.TileGrid[r][c].Letter = this.WordsString[iTile];
	    ++iTile;
	 }
   },
   ShuffleTiles() {
      var i;
      var r1, c1, r2, c2;
      var lttr;
      var iLetters;

      iLetters = new Array(this.WordsString.length);
      this.Randomizer.Shuffle(iLetters, null, true);
      for (i=0;i<this.WordsString.length/2;++i) {
	 r1 = this.InnerIndices[iLetters[2*i]][0];
	 c1 = this.InnerIndices[iLetters[2*i]][1];
	 lttr = this.TileGrid[r1][c1].Letter;
	 r2 = this.InnerIndices[iLetters[(2*i)+1]][0];
	 c2 = this.InnerIndices[iLetters[(2*i)+1]][1];
	 this.TileGrid[r1][c1].Letter = this.TileGrid[r2][c2].Letter;
	 this.TileGrid[r2][c2].Letter = lttr;
      }
   },
   Draw() {
      var x, y;

      this.Screen.fillStyle = SHUFFLE.BACKGROUND.COLOUR;
      this.Screen.fillRect(SHUFFLE.BOARD.L-(2*SHUFFLE.TILE.SIZE.W), SHUFFLE.BOARD.T-(2*SHUFFLE.TILE.SIZE.H), SHUFFLE.BOARD.W+(4*SHUFFLE.TILE.SIZE.W), SHUFFLE.BOARD.H+(4*SHUFFLE.TILE.SIZE.H));

      this.Screen.fillStyle = SHUFFLE.BORDER.COLOUR;
      this.Screen.fillRect(SHUFFLE.BOARD.L-SHUFFLE.TILE.SIZE.W, SHUFFLE.BOARD.T-SHUFFLE.TILE.SIZE.H, SHUFFLE.BOARD.W+(2*SHUFFLE.TILE.SIZE.W), SHUFFLE.BOARD.H+(2*SHUFFLE.TILE.SIZE.H));

      for (this.r=0;this.r<SHUFFLE.BOARD.R;++this.r)
	 for (this.c=0;this.c<SHUFFLE.BOARD.C;++this.c)
	    this.TileGrid[this.r][this.c].Draw();

      x = SHUFFLE.BOARD.L + (3*SHUFFLE.TILE.SIZE.W) + 2;
      y = SHUFFLE.BOARD.T + (3*SHUFFLE.TILE.SIZE.H) + 2;
      this.ShuffleImage.Draw(x, y);
   },
   CheckAccessed(bClicked) {

      if (bClicked) {
	 if ( Mouse.Click.X<SHUFFLE.BOARD.L || Mouse.Click.X>(SHUFFLE.BOARD.L+SHUFFLE.BOARD.W) )
	    return (false);
	 if ( Mouse.Click.Y<SHUFFLE.BOARD.T || Mouse.Click.Y>(SHUFFLE.BOARD.T+SHUFFLE.BOARD.H) )
	    return (false);
      } else {
	 if ( Mouse.Down.X<SHUFFLE.BOARD.L || Mouse.Down.X>(SHUFFLE.BOARD.L+SHUFFLE.BOARD.W) )
	    return (false);
	 if ( Mouse.Down.Y<SHUFFLE.BOARD.T || Mouse.Down.Y>(SHUFFLE.BOARD.T+SHUFFLE.BOARD.H) )
	    return (false);
      }

      return (true);
   },
   DetermineTile(tile, bClicked) {

      if (bClicked) {
	 tile.C = Math.floor((Mouse.Click.X-SHUFFLE.BOARD.L)/SHUFFLE.TILE.SIZE.W);
	 tile.R = Math.floor((Mouse.Click.Y-SHUFFLE.BOARD.T)/SHUFFLE.TILE.SIZE.H);
      } else {
	 tile.C = Math.floor((Mouse.Down.X-SHUFFLE.BOARD.L)/SHUFFLE.TILE.SIZE.W);
	 tile.R = Math.floor((Mouse.Down.Y-SHUFFLE.BOARD.T)/SHUFFLE.TILE.SIZE.H);
      }
   },
   SwapTiles(tile1, tile2) {  //tile1- target tile
      var letter;

      //Exchange letters
      letter = tile1.Letter;
      tile1.Letter = tile2.Letter;
      tile2.Letter = letter;

      //Re-draw tiles
      if (this.BorderIndices.includes(tile1.Index))
	 tile1.Status = this.DetermineTileStatus(tile1);
      tile1.Draw();
      if (this.BorderIndices.includes(tile2.Index))
	 tile2.Status = this.DetermineTileStatus(tile2);
      tile2.Draw();
   },
   DetermineTileStatus(tile) {
      var iLetter;
      var status;

      //Check if tile is now empty
      if (tile.Letter=="" || !tile.Letter)
	 return (SHUFFLE.TILE.STATUS.NEUTRAL);

      iLetter = this.BorderIndices.indexOf(tile.Index);
      if (tile.Letter==this.WordsString[iLetter])
	 return (SHUFFLE.TILE.STATUS.CORRECT);
      else {
	 if (tile.Row==0)						//top row
	    if (this.TopRow.includes(tile.Letter))
	       return (SHUFFLE.TILE.STATUS.CLOSE);
	 if (tile.Col==(SHUFFLE.BOARD.C-1))			//right column
	    if (this.RightColumn.includes(tile.Letter))
	       return (SHUFFLE.TILE.STATUS.CLOSE);
	 if (tile.Row==(SHUFFLE.BOARD.R-1))			//bottom row
	    if (this.BottomRow.includes(tile.Letter))
	       return (SHUFFLE.TILE.STATUS.CLOSE);
	 if (tile.Col==0)						//left column
	    if (this.LeftColumn.includes(tile.Letter))
	       return (SHUFFLE.TILE.STATUS.CLOSE);
	 return (SHUFFLE.TILE.STATUS.WRONG);
      }
   },
   PlaceHint() {
      var i;
      var r, c;
      var aIndcs;
      var iTile, lttr;

//      do {

      //Find empty tile on the border
      aIndcs = new Array(this.BorderIndices.length);
      this.Randomizer.GetUniqueIndices(aIndcs, this.BorderIndices.length, this.BorderIndices.length);
      for (i=0;i<this.BorderIndices.length;++i) {
	 this.c = this.BorderIndices[aIndcs[i]] % SHUFFLE.BOARD.C;
	 this.r = Math.floor(this.BorderIndices[aIndcs[i]]/SHUFFLE.BOARD.C);
	 if (this.TileGrid[this.r][this.c].Letter=="" || !this.TileGrid[this.r][this.c].Letter) {
	    iTile = (SHUFFLE.BOARD.C*this.r) + this.c;
	    lttr = this.WordsString[this.BorderIndices.indexOf(iTile)];

      //Find matching letter amid inner tiles
      for (r=1;r<(SHUFFLE.BOARD.R-1);++r)
	 for (c=1;c<(SHUFFLE.BOARD.C-1);++c) {
	    if (this.TileGrid[r][c].Letter==lttr) {
	       this.SwapTiles(this.TileGrid[this.r][this.c], this.TileGrid[r][c]);
	       return;
	    }
	 }
//	    break;
	 }
      }

      if (i==this.BorderIndices.length)
	 alert("No hints available");
/*
      //Find matching letter amid inner tiles
      for (r=1;r<(SHUFFLE.BOARD.R-1);++r)
	 for (c=1;c<(SHUFFLE.BOARD.C-1);++c) {
	    if (this.TileGrid[r][c].Letter==lttr) {
	       this.SwapTiles(this.TileGrid[this.r][this.c], this.TileGrid[r][c]);
	       return;
	    }
	 }
*/
//      } while ( r==(SHUFFLE.BOARD.R-1) && c==(SHUFFLE.BOARD.C-1) );
   },
   CheckSolved() {
      var i;

      for (i=0;i<this.BorderIndices.length;++i) {
	 this.r = Math.floor(this.BorderIndices[i]/SHUFFLE.BOARD.C);
	 this.c = this.BorderIndices[i] % SHUFFLE.BOARD.C;
	 if (this.TileGrid[this.r][this.c].Letter!=this.WordsString[i])
	    return (false);
      }

      return (true);
   }
};
