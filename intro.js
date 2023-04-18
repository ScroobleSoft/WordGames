
//------------------------------------------
//---------- HOUSE INTRO -------------------
var HouseIntro = function() {
   var Screen, InfoBox, ControlPanel;
   var GraphicsTool, TextWriter;
   var Randomizer;
   var State;
};
HouseIntro.prototype = {
   Set(cntxt, iBox, cPanel, gTool, tWriter, rGenerator) {
      this.Screen = cntxt;
      this.InfoBox = iBox;
      this.ControlPanel = cPanel;
      this.GraphicsTool = gTool;
      this.TextWriter = tWriter;
      this.Randomizer = rGenerator;
//      this.State = 
   },
   Play() {

      this.AnimationFrameHandle = requestAnimationFrame(this.Play.bind(this));

      this.CheckButtons();
   },
   CheckButtons() {
/*
      if (NewGameButton.CheckClicked()) {
	 cancelAnimationFrame(this.AnimationFrameHandle);
	 this.HideButtons();
	 Game.Play();
      }
      if (TutorialButton.CheckClicked()) {
	 cancelAnimationFrame(this.AnimationFrameHandle);
	 this.HideButtons();
	 Tutorial.Start();
      }
      if (DemoButton.CheckClicked()) {
	 cancelAnimationFrame(this.AnimationFrameHandle);
	 this.HideButtons();
	 Demo.Start();
      }
      if (MiniGamesButton.CheckClicked()) {
	 cancelAnimationFrame(this.AnimationFrameHandle);
	 this.HideButtons();
	 MiniGames.Start();
      }
*/
      if (CracklePushButton.CheckClicked()) {
	 cancelAnimationFrame(this.AnimationFrameHandle);
	 this.HideButtons();
	 setTimeout(this.LaunchCrackle.bind(this), 45);
      }
      if (ShufflePushButton.CheckClicked()) {
	 cancelAnimationFrame(this.AnimationFrameHandle);
	 this.HideButtons();
	 setTimeout(this.LaunchShuffle.bind(this), 45);
      }
   },
   HideButtons() {

      CracklePushButton.Hide();
      ShufflePushButton.Hide();
   },
   LaunchCrackle() {

      Mouse.ClearClicks();
      MiniGames.SetWordCrackle();
//      MiniGames.PlayWordCrackle();
      MiniGames.DisplayCrackleOptions();
      MiniGames.PollCrackleOptions();
   },
   LaunchShuffle() {

      Mouse.ClearClicks();
      MiniGames.SetWordShuffle();
      MiniGames.PlayWordShuffle();
   }
};
