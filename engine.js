
//---------------------------------------------
//----------SKELETON ENGINE--------------------
var SkeletonEngine = function () {
   var Interface;
   var Screen, InfoBox, ControlPanel;
   var GraphicsTool, CalcPad, TextWriter;
   var Randomizer;
   var ScreenRect;
   var Controller;
   var Components;
   var AnimationFrameHandle;
   var Reset;
};
SkeletonEngine.prototype = {
   Set(interface, gTool, cPad, tWriter, rGenerator, cntrllr) {
      this.Interface = interface;
      this.Screen = this.Interface.PrimeScape.Context;
      this.InfoBox = this.Interface.ZoomScape.Context;
      this.ControlPanel = this.Interface.Console.Canvas;
      this.GraphicsTool = gTool;
      this.TextWriter = tWriter;
      this.CalcPad = cPad;
      this.Randomizer = rGenerator;
      this.ScreenRect = new GenieRect();
      this.Controller = cntrllr;
      this.Components = new SkeletonComponents();
      this.Reset = false;
   },
   CheckImagesLoaded() {

      this.AnimationFrameHandle = requestAnimationFrame(this.CheckImagesLoaded.bind(this));

      if (ImageManager.AllLoaded) {
	 cancelAnimationFrame(this.AnimationFrameHandle);
	 this.Components.Set(this.Interface, this.GraphicsTool, this.CalcPad, this.TextWriter, this.Randomizer, this.ScreenRect, this.Controller);
/*
	 this.CreateSpriteBuffers();
*/
	 this.Start();
      }
   },
   Start() {
/*
      this.InfoBox.fillStyle = GREY.LIGHT;
      this.InfoBox.fillRect(0, 0, INFoBOX.WIDTH, INFoBOX.HEIGHT);

      NewGameButton.Show();
      TutorialButton.Show();
      DemoButton.Show();
      MiniGamesButton.Show();
*/
      this.Screen.fillStyle = PAINT.SKY;
      this.Screen.fillRect(0, 0, SCREEN.WIDTH, SCREEN.HEIGHT);

      ShufflePushButton.Show();
      this.TextWriter.Write("Crackle", 139, 290, { COLOUR: "blue", FONT: "24px Arial" } );
      CracklePushButton.Show();
      this.TextWriter.Write("Shuffle", 383, 290, { COLOUR: "blue", FONT: "24px Arial" } );

      Intro.Play();
   },
   PollButtons() {

      this.AnimationFrameHandle = requestAnimationFrame(this.PollButtons.bind(this));

      if (NewGameButton.CheckClicked()) {
	 cancelAnimationFrame(this.AnimationFrameHandle);
	 this.HideButtons();
	 this.Play();
      }

      if (TutorialButton.CheckClicked()) {
	 cancelAnimationFrame(this.AnimationFrameHandle);
      }

      if (DemoButton.CheckClicked()) {
	 cancelAnimationFrame(this.AnimationFrameHandle);
      }

      if (MiniGamesButton.CheckClicked()) {
	 cancelAnimationFrame(this.AnimationFrameHandle);
	 this.HideButtons();
	 MiniGames.Start();
      }
   },
   HideButtons() {
      NewGameButton.Hide();
      TutorialButton.Hide();
      DemoButton.Hide();
      MiniGamesButton.Hide();
   },
   Play() {

      this.AnimationFrameHandle = requestAnimationFrame(this.Play.bind(this));

   }
};
