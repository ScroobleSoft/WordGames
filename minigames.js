
//------------------------------------------------
//---------- HOUSE MINI GAMES --------------------
var HouseMiniGames = function() {
   var Interface;
   var Screen, InfoBox, ControlPanel;
   var GraphicsTool, CalcPad, TextWriter;
   var Randomizer;
   var ScreenRect;
   var State, Frames;

   //SHUFFLE
   var Board, ShuffleInfo;				//GUI
   var ShuffleHintButton, ShuffleRestartButton;		//buttons
   var WordDistribution, WordList;
   var ShuffleWords, FourWords;
   var SelectedTile;					//contains indices
   var DownTile, ClickTile, TargetTile;
   var Moves, Shuffles, Hints;

   //JUMBLE
   var JumbleGrid;
   var JumbleWords, JumbleDistribution;
   var JumbleWordsSelector;
   var JumbleButtonImages, JumbleLetterImages;

   //SCRAMBLE

   //CRACKLE
   var CRACKLeFIVeOPTION, CRACKLeSIxOPTION, CRACKLeSEVEnOPTION, CRACKLeRANDOmOPTION, CRACKLeOPTIONsRADIoGROUP;
   var CrackleFiveOption, CrackleSixOption, CrackleSevenOption, CrackleRandomOption, CrackleOptionsRadioGroup;
   var CrackleWords, CrackleWordLength, CrackleAttempts;			//data
   var CrackleLetterImages, CrackleSectionImage;				//images
   var CrackleLedger, CrackleSubmission, CrackleKeyboard;			//interface
   var CrackleSubmitButton, CrackleEraseButton, CrackleRestartButton;

   var i;
   var t1, t2;
};
HouseMiniGames.prototype = {
   Set(intrfc, cntxt, iBox, cPanel, gTool, tWriter, rGenerator, sRect) {
      this.Interface = intrfc;
      this.Screen = cntxt;
      this.InfoBox = iBox;
      this.ControlPanel = cPanel;
      this.GraphicsTool = gTool;
//      this.CalcPad = cPad;
      this.TextWriter = tWriter;
      this.Randomizer = rGenerator;
      this.ScreenRect = sRect;
   },
   Start() {

      this.Screen.clearRect(0, 0, SCREEN.WIDTH, SCREEN.HEIGHT);
      MiniGamesImage.Draw();
      this.Play();
   },
   Play() {

      this.AnimationFrameHandle = requestAnimationFrame(this.Play.bind(this));

      if (Mouse.CheckLeftClicked()) {
	 if (MiniGamesImage.CheckClicked()) {
	    cancelAnimationFrame(this.AnimationFrameHandle);
	    indx = MiniGamesImage.GetMapEntry(CLICKED);
	    switch (indx) {
	       case MINiGAME.SHUFFLE:
		  this.SetWordShuffle();
		  this.PlayWordShuffle();
		  break;
	       case MINiGAME.JUMBLE:
		  this.SetWordJumble();
		  this.PlayWordJumble();
		  break;
	       case MINiGAME.SCRAMBLE:
		  this.SetWordScramble();
		  this.PlayWordScramble();
		  break;
	       case MINiGAME.CRACKLE:
		  this.SetWordCrackle();
		  this.PlayWordCrackle();
		  break;
	    }
	 }
      } else {
	 indx = MiniGamesImage.GetMapEntry();
	 if (indx!=-1) {
	    this.InfoBox.clearRect(0, 0, INFoBOX.WIDTH, INFoBOX.HEIGHT);
	    this.TextWriter.SwitchContext(CANVAS.ZOOM);
	    this.TextWriter.Write(MiniGameDescriptions[indx], 5, 20);
	    this.TextWriter.RestoreContext();
	 }
      }
   }
};
