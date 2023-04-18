
//---------------------------------------
//---------- BITMAPS --------------------

var SkeletonImages = [
   "LCPSprites.png",
   "HouseImages.png",
   "HouseTesting.png",
   "SkeletonDemo.png",
   "MiniGames.png",
   "modules/GenieImages.png",
   "minigames/MiniImages.png",
   "HouseControls.png",
   "modules/GenieControls.png"
];
var IMAGeINDEX = {
   SPRITES:	0,
   IMAGES:	1,
   TESTING:	2,
   DEMO:	3,
   MINiGAMES:	4,
   GENIeIMAGES:	5,
   MINiIMAGES:	6,
   CONTROLS:	7,
   GENIeCONTROLS: 8
};

//---------------------------------------------
//---------- HTML CONTROLS --------------------

var SkeletonControls = [
   ["StartButton", "620px", "575px"],
   ["LoadButton",  "680px", "575px"],
   ["SaveButton",  "740px", "575px"],
   ["TestButton",  "820px", "575px"]
];
var CONTROLS = {
   STARtBUTTON: 0,
   LOAdBUTTON:  1,
   SAVeBUTTON:  2,
   TEStBUTTON:  3
};
var EVENT = {
   STARtBUTTOnCLICKED: 0,
   LOAdBUTTOnCLICKED:  1,
   SAVeBUTTOnCLICKED:  2,
   TEStBUTTOnCLICKED:  3
};

//-------------------------------------
//---------- SOUNDS -------------------

//----------------------------------------
//---------- CORE DATA -------------------

var SCREEN = { WIDTH: 600, HEIGHT: 600 };
var INFoBOX = { WIDTH: 240, HEIGHT: 240 };

//----------------------------------------
//---------- GAME DATA -------------------

//---------------------------------------
//---------- CONTROLS -------------------

var CRACKLePUShBUTTON = { L: 100, T: 100, W: 160, H: 160, BACKGROUND: PAINT.SKY };
var SHUFFLePUShBUTTON = { L: 340, T: 100, W: 160, H: 160, BACKGROUND: PAINT.SKY };

//Images
var HOUSePUShBUTTOnIMAGE = { L: 1, T: 1, W: 322, H: 160, O: 2, C: 2, R: 1, PATCH: { W: 160, H: 160 } };
var CRACKLePUShBUTTOnIMAGE = { L: 1, T: 163, W: 150, H: 150 };
var SHUFFLePUShBUTTOnIMAGE = { L: 153, T: 163, W: 150, H: 150 };

//------------------------------------------
//---------- IMAGE MAPS --------------------

//Demo
var DEMO = { ONE: 0, TWO: 1 };
var DEMoIMAGE = { L: 0, T: 0, W: 237, H: 291, X: 20, Y: 20 };
var DemoMap = [ { L: 1, T: 1, W: 58, H: 72 }, { L: 1, T: 74, W: 58, H: 71 } ];
var DemoDescriptions = [ [ "Demo One" ], [ "Demo Two" ]
			  ];
//Mini Games
var MINiGAME = { SHUFFLE: 0, JUMBLE: 1, SCRAMBLE: 2, CRACKLE: 3 };
var MINiGAMEsIMAGE = { L: 0, T: 0, W: 237, H: 291, X: 20, Y: 20 };
var MiniGamesMap = [ { L: 1, T: 1, W: 58, H: 68 }, { L: 1, T: 70, W: 58, H: 65 }, { L: 1, T: 136, W: 58, H: 66 }, { L: 1, T: 203, W: 58, H: 89 } ];
var MiniGameDescriptions = [ [ "4-word challenge." ], [ "Cross-words." ], [ "Floating letters." ], [ "Cracking pass-codes." ]
			  ];
//Testing
var TEST = { CONTROLS: 0, TWO: 1 };
var TESTINgIMAGE = { L: 0, T: 0, W: 237, H: 291, X: 20, Y: 20 };
var TestingMap = [ { L: 1, T: 1, W: 58, H: 68 }, { L: 1, T: 74, W: 58, H: 71 } ];
var TestingDescriptions = [ [ "Alternative control disabling display" ], [ "Test Two" ]
			  ];

//--------------------------------------
//---------- IMAGES --------------------

//--------------------------------------
//---------- SPRITES -------------------

var MOUThSPRITE = { L: 1, T: 1, W: 6, H: 3, O: 1 };

//---------------------------------
//---------- FX -------------------
