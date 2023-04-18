
//----------------------------------------------
//---------- LIBRARY OBJECTS -------------------

var SkeletonScape;
var SkeletonGraphics;
var SkeletonCalcPad;
var SkeletonText;
var SkeletonRandomizer;
var Controller;

//-------------------------------------------
//---------- CORE OBJECTS -------------------

//------------------------------------------
//---------- SIM OBJECTS -------------------

var Intro;
var MiniGames;

//------------------------------------
//---------- TOOLS -------------------

var Testing;

//Scratch variables
var indx;

//---------------------------------------
//---------- CONTROLS -------------------

var NewGameButton;
var TutorialButton;
var DemoButton;
var MiniGamesButton;

var GamePushButtonImage;
var ShufflePushButton, CracklePushButton;

//-------------------------------------
//---------- IMAGES -------------------

var TestingImage;

//--------------------------------------
//---------- SPRITES -------------------

var MouthSprite;

//---------------------------------
//---------- FX -------------------

//-------------------------------------
//---------- SOUNDS -------------------

//--------------------------------------------------
//---------- SKELETON COMPONENTS -------------------
var SkeletonComponents = function() {
   var Interface;
   var Screen, InfoBox, ControlPanel;
   var GraphicsTool, CalcPad, TextWriter;
   var Randomizer;
   var Controller;
};
SkeletonComponents.prototype = {
   Set(intrfc, gTool, cPad, tWriter, rGenerator, sRect, cntrllr) {
      this.Interface = intrfc;
      this.Screen = this.Interface.PrimeScape.Context;
      this.InfoBox = this.Interface.ZoomScape.Context;
      this.ControlPanel = this.Interface.Console;
      this.GraphicsTool = gTool;
      this.CalcPad = cPad;
      this.TextWriter = tWriter;
      this.Randomizer = rGenerator;
      this.ScreenRect = sRect;
      this.Controller = cntrllr;

      this.SetData();

      this.CreateCoreObjects();
      this.CreateSimObjects();
      this.CreateTools();
      this.CreateControls();
      this.CreateImages();
      this.CreateViews();
      this.CreateSprites();
      this.CreateAgents();
      this.CreateSounds();

      this.SetCoreObjects();
      this.SetSimObjects();
      this.SetTools();
      this.SetControls();
      this.SetImages();
      this.SetViews();
      this.SetSprites();
      this.SetAgents();
      this.SetSounds();
   },
   SetData() {
   },
   CreateCoreObjects() {
   },
   SetCoreObjects() {
   },
   CreateSimObjects() {

      //UNLOGGED

      Intro = new HouseIntro();
      MiniGames = new HouseMiniGames();
   },
   SetSimObjects() {

      //UNLOGGED

      Intro.Set(this.Screen, this.InfoBox, this.ControlPanel, this.GraphicsTool, this.TextWriter, this.Randomizer, this.ScreenRect);
      MiniGames.Set(this.Interface, this.Screen, this.InfoBox, this.ControlPanel, this.GraphicsTool, this.TextWriter, this.Randomizer, this.ScreenRect);
   },
   CreateTools() {

      //UNLOGGED

      Testing = new HouseTesting();
   },
   SetTools() {

      //UNLOGGED

      Testing.Set(this.Interface, this.Screen, this.InfoBox, this.ControlPanel, this.GraphicsTool, this.TextWriter, this.Randomizer);
   },
   CreateControls() {

      //UNLOGGED

      NewGameButton = new ImageButton();
      TutorialButton = new ImageButton();
      DemoButton = new ImageButton();
      MiniGamesButton = new ImageButton();

      GamePushButtonImage = new GenieImage();
      ShufflePushButton = new GeniePushButton();
      CracklePushButton = new GeniePushButton();
   },
   SetControls() {

      //UNLOGGED

      NewGameButton.Set(this.Interface.ZoomScape, NEwGAMeBUTTOnIMAGE, ImageManager.Pics[IMAGeINDEX.GENIeIMAGES]);
      TutorialButton.Set(this.Interface.ZoomScape, TUTORIAlBUTTOnIMAGE, ImageManager.Pics[IMAGeINDEX.GENIeIMAGES]);
      DemoButton.Set(this.Interface.ZoomScape, DEMoBUTTOnIMAGE, ImageManager.Pics[IMAGeINDEX.GENIeIMAGES]);
      MiniGamesButton.Set(this.Interface.ZoomScape, MINiGAMEsBUTTOnIMAGE, ImageManager.Pics[IMAGeINDEX.GENIeIMAGES]);

      GamePushButtonImage.Set(this.Screen, ImageManager.Pics[IMAGeINDEX.CONTROLS], HOUSePUShBUTTOnIMAGE);
      ShufflePushButton.Set(this.Interface.PrimeScape, SHUFFLePUShBUTTON, GamePushButtonImage, SHUFFLePUShBUTTOnIMAGE);
      CracklePushButton.Set(this.Interface.PrimeScape, CRACKLePUShBUTTON, GamePushButtonImage, CRACKLePUShBUTTOnIMAGE);
   },
   CreateImages() {

      //UNLOGGED

      TestingImage = new GenieImageMap();
      MiniGamesImage = new GenieImageMap();
   },
   SetImages() {

      //UNLOGGED

      TestingImage.Set(this.Screen, ImageManager.Pics[IMAGeINDEX.TESTING], TESTINgIMAGE, TestingMap);
      MiniGamesImage.Set(this.Screen, ImageManager.Pics[IMAGeINDEX.MINiGAMES], MINiGAMEsIMAGE, MiniGamesMap);
   },
   CreateViews() {
   },
   SetViews() {
   },
   CreateSprites() {

      //UNLOGGED

      MouthSprite = new AnimatedSprite();
   },
   SetSprites() {

      //UNLOGGED

      MouthSprite.Set(this.Screen, ImageManager.Pics[IMAGeINDEX.SPRITES], MOUThSPRITE);
   },
   CreateAgents() {
   },
   SetAgents() {
   },
   CreateFX() {
   },
   SetFX() {
   },
   CreateSounds() {
   },
   SetSounds() {
   }
};
