
//-----------------------------------------
//---------- CONSTANTS --------------------

const STARtAtZERO = true;
const MODIFY = true;
const CLOCKWISE = false;
const ANTiCLOCKWISE = true;
const UNIQUE = true;
const FIXEdSIZeLISTs = true;
const INITIALIZE = true;
const INDEXED = true;
const NORMAL = false;
const INVERTED = true;
const DEGREES = 360;
const ROTATABLE = true;
const TRANSFORMABLE = true;
const CLICKED = true;
const REVERSE = true;
const INTERSECTION = true;
const PRESSED = true;
const DRAW = true;
const WEBGL = true;

//--------------------------------------
//---------- GENERAL -------------------

var GAME = { PENDING: 0, STARTED: 1, PAUSED: 2 };
var RESULT = { FAILURE: 0, SUCCESS: 1 };
var DEFAULT = { FONT: "14px Arial", SCREEnWIDTH: 600, SCREEnHEIGHT: 600, INFoBOxWIDTH: 240, INFoBOxHEIGHT: 240 };
var CANVAS = { NONE: 0, PRIME: 1, ZOOM: 2, CONSOLE: 3 };
var AXIS = { X: 0, Y: 1, BOTH: 2 };
var ROTATION = { NONE: 0, QUARTER: 90, HALF: 180, FULL: 360 };
var RANDOM = { FLOAT: 0, FLOOR: 1, ROUND: 2, CEIL: 3, SIZE: 1000, RANGE: 1000 };
var GRADE = { Aplus: 0, A: 1, Aminus: 2, Bplus: 3, B: 4, Bminus: 5, Cplus: 6, C: 7, Cminus: 8, Dplus: 9, D: 10, Dminus: 11, Eplus: 12, E: 13, Eminus: 14,
	      Fplus: 0, F: 1, Fminus: 2, Gplus: 3, G: 4, Gminus: 5, Hplus: 6, H: 7, Hminus: 8, Iplus: 9, I: 10, Iminus: 11, Jplus: 12, J: 13, Jminus: 14  };

//---------------------------------------
//---------- GRAPHICS -------------------

var ORIENTATION = { HORIZONTAL: 0, VERTICAL: 1 };
	//NOTE: below, PENTAGON, HEXAGON and OCTAGON are to be specified if POLYGON is pointy-top in first case, flat-top in latter 2
var SHAPE = { POINT: 1, LINE: 2, ARC: 3, CIRCLE: 4, ELLIPSE: 5, TRIANGLE: 6, RECTANGLE: 7, DIAMOND: 8, PENTAGON: 9, HEXAGON: 10, OCTAGON: 11, POLYGON: 12,
	      IRREGULAR: 13 };
var SIDES = { QUAD: 4, DIAMOND: 4, HEXAGON: 6, OCTAGON: 8 };
var STYLE = { WIReFRAME: 1, SOLID: 2, BAsRELIEF: 3, ISOMETRIC: 4 };
var HEX = { FLAtTOP: 0, POINTyTOP: 1 };

//------------------------------------------
//---------- PERSPECTIVE -------------------

var PERSPECTIVE = { TOpDOWN: 0, SIDeVIEW: 1, BIRDsEYE: 2, ISOMETRIC: 3, SEMiISOMETRIC: 4, OVErHEAdISOMETRIC: 5, CUSTOM: 6 };
var SIDeVIEW = { DEFAULtELEVATION: 30 };
var ANGLE = { RIGHT: 90, ISOMETRIC: 45, SEMiISOMETRIC: 22.5 };

//-----------------------------------
//---------- TEXT -------------------

var FONtSTYLE = { NONE: 0, BOLD: 1, ITALICS: 2, UNDERLINED: 4, OVERLINE: 8, LINETHROUGH: 16 };
var TEXtSPECS = { L: 0, T: 1, FONT: 2, STRING: 3, STYLE: 4, COLOUR: 5 };
//var TEXT = { FONT: "10pt Arial", COLOUR: "black" };
var TEXT = { FONT: "14px Arial", COLOUR: "black" };

//-----------------------------------
//---------- I/O --------------------

//--MOUSE--
var MOUSE = { LEFTBUTTON: 0, RIGHTBUTTON: 2 };

//--CONTROLLERS--
var GAMePAD = { ARROWS: 0, WASD: 1, NUMERIC: 2, MOUSE: 3 };
var KEY = { LEFT: 0, UP: 1, RIGHT: 2, DOWN: 3, CLICkLEFT: 4, CLICkRIGHT: 5, COUNT: 6 };
//var ARROwPAD = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, CLICkLEFT: 45, CLICkRIGHT: 46 };
var ARROwPAD = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, CLICkLEFT: 188, CLICkRIGHT: 190 };
var ArrowPadKeys = [ ARROwPAD.LEFT, ARROwPAD.UP, ARROwPAD.RIGHT, ARROwPAD.DOWN, ARROwPAD.CLICkLEFT, ARROwPAD.CLICkRIGHT ]; 
var WASdPAD =  { LEFT: 65, UP: 87, RIGHT: 68, DOWN: 83, CLICkLEFT: 81, CLICkRIGHT: 69 };
var WASdPadKeys = [ WASdPAD.LEFT, WASdPAD.UP, WASdPAD.RIGHT, WASdPAD.DOWN, WASdPAD.CLICkLEFT, WASdPAD.CLICkRIGHT ]; 
var NUMERIcPAD =  { LEFT: 100, UP: 104, RIGHT: 102, DOWN: 98, TOpLEFT: 103, TOpRIGHT: 105, BOTTOmLEFT: 97, BOTTOmRIGHT: 99 };
var NumericPadKeys = [ NUMERIcPAD.LEFT, NUMERIcPAD.UP, NUMERIcPAD.RIGHT, NUMERIcPAD.DOWN, NUMERIcPAD.TOpLEFT, NUMERIcPAD.TOpRIGHT, NUMERIcPAD.BOTTOmLEFT, NUMERIcPAD.BOTTOmRIGHT ]; 
var KEyPRESS = { CONTINUOUS: 0, SINGLeFIRE: 1 };
var KEySTATE = { READY: 0, PRESSED: 1, FIRED: 2 };

//--BUTTONS--
var BUTTONSTATE = { DISABLED: 0, ENABLED: 1, PUSHED: 2 };

//--------------------------------------
//--------- COLOURS --------------------

var RainbowColours = [ "violet", "indigo", "blue", "green", "yellow", "orange", "red" ];
var MAGENTA = { PURPLE: "rgb(127,0,127)", FUSCHIA: "rgb(255,0,255)", VIOLET: "rgb(223,159,223)" };
var GREEN = { ONE: "rgb(0,255,0)", TWO: "rgb(0,223,0)", THREE: "rgb(0,191,0)", FOUR: "rgb(0,159,0)", FIVE: "rgb(0,127,0)", SIX: "rgb(0,95,0)",
	      SEVEN: "rgb(0,63,0)", EIGHT: "rgb(0,31,0)", BRIGHT: "rgb(127,255,0)", PASTEL: "rgb(0,191,63)", HARLEQUIN: "rgb(63,255,0)",
	      OLIVE: "rgb(127,127,0)", GRASS: "rgb(124,177,1)" };
var BLUE = { INDIGO: "rgb(0,0,255)", MEDIUM: "rgb(0,63,255)", AZURE: "rgb(0,127,255)", DEEpSKY: "rgb(0,191,255)",
	     CYAN: "rgb(0,255,255)", CERULEAN: "rgb(0,127,191)", AQuaMARINE: "rgb(127,255,255)", ULTRaMARINE: "rgb(15,15,143)",
 	     DARK: "rgb(0,0,191)", NAVY: "rgb(0,0,127)", SAPPHIRE: "rgb(0,0,111)", MIDNIGHtEXPRESS: "rgb(0,0,63)",
	     MIDNIGHT: "rgb(31,31,95)", OXFORD: "rgb(0,31,63)", PRUSSIAN: "rgb(0,47,111)", LAPIsLAZULI: "rgb(31,95,159)",
	     ROYAL: "rgb(63,111,223)", AZURE: "rgb(63,111,223)", SILVErLAKE: "rgb(95,127,191)", COBALT: "rgb(0,63,175)",
	     SEA: "rgb(0,159,255)", SKY: "rgb(0,162,232)" };
var YELLOW = { ONE: "rgb(255,255,0)", TWO: "rgb(255,223,0)", GOLD: "rgb(255,191,0)", MUSTARD: "rgb(255,159,0)" };
var ORANGE = { ONE: "rgb(255,127,0)", TWO: "rgb(255,95,0)", THREE: "rgb(255,63,0)" };
var RED = { ONE: "rgb(255,0,0)", CRIMSON: "rgb(159,0,0)", MAROON: "rgb(127,0,0)", SCARLET: "rgb(255,31,0)" };
var BROWN = { SYRUP: "rgb(68,35,2)", GINGErBREAD: "rgb(92,48,0)", CARAMEL: "rgb(105,54,0)", TAWNY: "rgb(124,69,12)",
	      LIGHT: "rgb(139,86,18)", ONE: "rgb(191,127,31)", TWO: "rgb(159,95,0)", THREE: "rgb(127,63,0)", STRAW: "rgb(239,207,111)" };
var GREY = { LIGHT: "rgb(223,223,223)", SILVER: "rgb(191,191,191)", ASH: "rgb(159,159,159)", MEDIUM: "rgb(127,127,127)",
	     DARK: "rgb(95,95,95)", MOCHA: "rgb(63,63,63)", CHARCOAL: "rgb(31,31,31)" };
var PAINT = { SKY: "rgb(153,217,234)", SEA: "rgb(000,162,232)", NAVY: "rgb(063,072,204)", LIVID: "rgb(112,146,190)",
	      LIME: "rgb(181,230,029)", GRASS: "rgb(034,177,076)", PURPLE: "rgb(163,073,164)", LILAC: "rgb(200,191,231)",
	      ORANGE: "rgb(255,127,039)", MARIGOLD: "rgb(255,201,014)", YELLOW: "rgb(255,242,000)", FAWN: "rgb(239,228,176)",
	      RED: "rgb(237,028,036)", PINK: "rgb(255,174,201)", GREY: "rgb(127,127,127)", SILVER: "rgb(195,195,195)",
	      MAROON: "rgb(136,000,021)" };
var YellowRedSpectrum = [ YELLOW.ONE, YELLOW.TWO, YELLOW.THREE, YELLOW.MUSTARD, ORANGE.ONE, ORANGE.TWO, ORANGE.THREE, RED.ONE, RED.TWO ];

//--------------------------------------
//---------- IMAGES -------------------

var NEwGAMeBUTTOnIMAGE =   { L:  16, T:  16, W: 96, H: 96, SX:  1, SY:  1 };
var TUTORIAlBUTTOnIMAGE =  { L: 128, T:  16, W: 96, H: 96, SX: 98, SY:  1 };
var DEMoBUTTOnIMAGE =	   { L:  16, T: 128, W: 96, H: 96, SX:  1, SY: 98 };
var MINiGAMEsBUTTOnIMAGE = { L: 128, T: 128, W: 96, H: 96, SX: 98, SY: 98 };

//--------------------------------------
//---------- SPRITES -------------------

//--DATA--
var SPRITE = { STATIC: 0, ANIMATED: 1, GEOMETRIC: 2, COMPOSITE: 3, COMPOUND: 4 };
var SPRITeFORM = { ORIGINAL: 0, FLIPPED: 1, ROTATED: 2, SCALED: 4, COLOURED: 8, ENSHADOWED: 16, SKEW: 32 };
var FLIPPED = { FALSE: 0, HORIZONTAL: 1, VERTICAL: 2, BOTH: 3 };
var WALK = { UPRIGHT: 0, LEAnRIGHT: 1, LEAnLEFT: 2 };
var SHAPeSPEC = { SHAPE: 0, COLOUR: 1, WIREFRAME: 2, DIMENSIONS: 3, STYLE: 4 };
var COLLISION = { BOUNDINgBOX: 0, VERTExInBOX: 1, BOUNDINgCIRCLES: 2 };
var ALIGNMENT = { BOTTOmLEFT: 0, BOTTOmCENTRE: 1, BOTTOmRIGHT: 2, CENTReLEFT: 3, CENTRE: 4, CENTReRIGHT: 5, TOpLEFT: 6, TOpCENTRE: 7, TOpRIGHT: 8,
				 BOTTOmCENTER: 1, CENTErLEFT: 3, CENTER: 4, CENTErRIGHT: 5, TOpCENTER: 7, };  //TODO: eliminate CENTRE everywhere

//--SPECS--
var GENIeSPARkSPRITE = { L: 1, T: 1, W: 7, H: 7, O: 1, S: 3 };
var GENIeBULLEtSPRITE = { L: 1, T: 9, W: 3, H: 3 };
var GENIeEXPLOSIOnSPRITE = { L: 20, T: 13, W: 34, H: 34, TI: [ { Form: SPRITeFORM.SCALED, Scale: 0.75 },
							       { Form: SPRITeFORM.SCALED, Scale: 0.5 }   ] };
var ROTATINgEXPLOSIOnSPRITE = { L: 1, T: 13, W: 18, H: 18, TI: [ { Form: SPRITeFORM.SCALED,  Scale: 1.0 },
								 { Form: SPRITeFORM.SCALED,  Scale: 0.75 },
							         { Form: SPRITeFORM.SCALED,  Scale: 0.5  },
								 { Form: SPRITeFORM.ROTATED, Angle:  90 },
								 { Form: SPRITeFORM.ROTATED, Angle: 180 },
								 { Form: SPRITeFORM.ROTATED, Angle: 270 }   ] };
var GENIeROCKEtSPRITE = { L: 1, T: 48, W: 9, H: 7, O: 1 };
var GENIeROCKEtSPRITE1 = { W: 5, H: 7, GS: [ [ SHAPE.LINE,     "black", 1, [0.5,-3,0.5,2]   ],
					     [ SHAPE.LINE,     "black", 1, [-0.5,-2,-0.5,2] ],
					     [ SHAPE.LINE,     "black", 1, [1.5,-2,1.5,2]   ],
					     [ SHAPE.LINE, GREY.SILVER, 1, [0.5,-2,0.5,2]   ],
//					     [ SHAPE.LINE,     "black", 1, [-1.5,2.5,2.5,2.5]   ]  ] };
					     [ SHAPE.LINE,     "black", 1, [-2,2.5,3,2.5]   ]  ] };
var ROCKEtSIGHtSPRITE = { L: 26, T: 1, W: 9, H: 9, O: 1 };
var NoENTRySPRITE = { L: 1, T: 32, W: 11, H: 11 };

//-------------------------------------
//---------- SOUNDS -------------------

var GenieSoundList = [
   "../sounds/laser.mp3",
   "../sounds/bomb.mp3",
   "../sounds/missile.mp3",
   "../sounds/drone.mp3",
   "../sounds/explosion.wav"
];

//--------------------------------------
//---------- BITMAPS -------------------  most likely will make this whole section REDUNDANT

var GenieImages = [
   "GenieImages.png",
   "GenieSprites.png",
   "../modules/controls/GenieControls.png",
//   "controls/GenieControls.png",
   "checkbox.png",
   "checkedbox.png",
   "slider.png"
];
var GENIeIMAGeINDEX = {
   IMAGES:	  0,
   SPRITES:	  1,
   CONTROLS:      2,
   BOXUNCHECKED : 3,
   BOXCHECKED   : 4,
   SLIDER	: 5
};

//---------------------------------------
//---------- CONTROLS -------------------

var CONTROL = { ID: 0, LEFT: 1, TOP: 2, COLOUR: GREY.LIGHT, BACKGROUND: GREY.LIGHT };
var Control = function () {  //ISSUE: Is this ever used?
   var Id;
   var Top;
   var Left;
};

//-- IMAGES --
var RADIoCONTROlIMAGE = { L: 79, T: 16, W: 23, H: 11, O: 1, R: 1, C: 2, PATCH: { W: 11, H: 11 } };
var RADIoCONTROlUnCHECKEdIMAGE = { L: 53, T: 16, W: 12, H: 12 };	//TODO: make REDUNDANT
var RADIoCONTROlCHECKEdIMAGE = { L: 66, T: 16, W: 12, H: 12 };		//TODO: make REDUNDANT
var CHECkBOxCHECKEdIMAGE = { L: 97, T: 1, W: 15, H: 14 };		//TODO: replace this and one below with one specs entry
var CHECkBOxUnCHECKEdIMAGE = { L: 113, T: 1, W: 15, H: 14 };
var CHECkBOxIMAGE = { L: 97, T: 1, W: 15, H: 14, O: 1, R: 1, C: 2, PATCH: { W: 15, H: 14 } };
var DROpLIStBUTTOnIMAGE = { L: 1, T: 28, W: 23, H: 21, O: 1, R: 1, C: 2, PATCH: { W: 23, H: 21 } };
var SCROLlBArARROWsIMAGE = { L: 1, T: 71, W: 79, H: 17, O: 1, R: 1, C: 4, PATCH: { W: 19, H: 17 } };
var SCROLlBArTHUMbIMAGE = { L: 81, T: 71, W: 19, H: 11, O: 1, R: 3, C: 1, PATCH: { W: 19, H: 3 } };
var ICOnCORNERsIMAGE = { L: 129, T: 1, W: 31, H: 3, O: 1, R: 1, C: 8, PATCH: { W: 3, H: 3 } };
var PAGeNUMBERsIMAGE = { L: 1, T: 50, W: 229, H: 20 };

var RADIoCONTROlSPRITE = { L: 53, T: 16, W: 12, H: 12, O: 1, S: 2 };

//-- GUI --
var DROpDOWnLIST = { FIELD: { W: 100, H: 23 }, BUTTON: { W: 23, H: 21 }, ENTRY: { H: 15 } };
var LIStBOX = { COLOUR: { SELECTION: GREY.MEDIUM, PAGE: "rgb(000,175,239)" } };
var GENIeRADIoCONTROL = { SX: 79, SY: 16, W: 11, H: 11, O: 1 };		//TODO: this and below
var GENIeCHECkBOX = { L: 79, T: 16, W: 11, H: 11, O: 1 };		//	maybe REDUNDANT
var PAGINATION = { PATCH: { W: 18, H: 18, }, COLOUR: { STRIP: "rgb(175,191,191)", SELECTION: "rgb(000,175,239)", PAGE: "rgb(000,175,239)" } };  //NOTE: SELECTION
																//refers to STRIP, not PAGE
var TOUChBAR = { COLOUR: { KEY: "rgb(175,191,191)", SELECTION: "rgb(063,191,223)" } };			 
var TABS = { COLOUR: { TAB: "lightgray", PAGE: "white" } };

var SLIDER = { BOOKENDT: 1, BOOKENDL: 1, BOOKENDW: 7, BOOKENDH: 25, RANGET: 1, RANGEL: 9, RANGEW: 7, RANGEH: 25, THUMBT: 1, THUMBL: 17, THUMBW: 8, THUMBH: 15, TICKT: 1, TICKL: 26, TICKW: 1, TICKH: 5 };

//var TABS = { W: 60, H: 20, COLOUR: "lightgray", PAGeCOLOUR: "white", OUTLINeCOLOUR: "gray", ROwHEIGHT: 20 };
var SCROLlUpARROwIMAGE = { L: 1, T: 1, W: 11, H: 11 };
var SCROLlDOWnARROwIMAGE = { L: 13, T: 1, W: 11, H: 11 };

//-- BUTTONS --
var NEwGAMeBUTTON =   { L:   8, T:  18, W: 96, H: 64, COLOUR: BLUE.INDIGO, LABEL: "New Game",   TEXT: { COLOUR: "white", FONT: "18px Arial" } };
var TUTORIAlBUTTON =  { L: 124, T:  18, W: 96, H: 64, COLOUR: BLUE.INDIGO, LABEL: "Tutorial",   TEXT: { COLOUR: "white", FONT: "18px Arial" } };
var DEMoBUTTON =      { L:   8, T: 101, W: 96, H: 64, COLOUR: BLUE.INDIGO, LABEL: "Demo",       TEXT: { COLOUR: "white", FONT: "18px Arial" } };
var MINiGAMEsBUTTON = { L: 124, T: 101, W: 96, H: 64, COLOUR: BLUE.INDIGO, LABEL: "Mini-Games", TEXT: { COLOUR: "white", FONT: "18px Arial" } };

//-- WIDGETS --
var LEDDigits = [ [0,1,2,3,4,5],	//0
		  [1,2],		//1
		  [0,1,6,4,3],		//2
		  [0,1,6,2,3],		//3
		  [5,6,1,2],		//4
		  [0,5,6,2,3],		//5
		  [0,5,6,2,3,4],	//6
		  [0,1,2],		//7
		  [0,1,2,3,4,5,6],	//8
		  [0,1,2,5,6]	  ];	//9
var HORIZONTAlLEDiMAGE = { L: 1, T: 195, W: 44, H: 5, O: 1, R: 1, C: 3, PATCH: { W: 14, H: 5 } };
var VERTICAlLEDiMAGE = { L: 1, T: 201, W: 17, H: 14, O: 1, R: 1, C: 3, PATCH: { W: 5, H: 14 } };
var DOtLEDiMAGE = { L: 195, T: 216, W: 23, H: 7, O: 1, R: 1, C: 3, PATCH: { W: 7, H: 7 } };

//----------------------------------------
//---------- AGENTS ----------------------

var STATE = { MOTION:    { NONE: 0, STATIONARY: 1, TURNING: 2, ADVANCING: 3, REVERSING: 4, HPARABOLIC: 5, VPARABOLIC: 6, HVPARABOLIC: 7,
			   YIELDING: 8, AVOIDING: 9, PAThWALKING: 10, PATROLLING: 11, TRACKING: 12, CONTROLLER: 13, LEFtSTEPPING: 14, RIGHtSTEPPING: 15 },
	      AVOIDANCE: { CENTERING: 0, ALIGNING: 1, POLLING: 2, SLIDING: 3 } };
var AgentState = function() { var Motion; };
var STATUS = { NONE: 0, EXTANT: 1, VISIBLE: 2, SELECTED: 4,
	       TRANSFORM: { DIRECT: 16, SPRITeBUFFER: 32, TRANsBUFFER: 64, InMETHOD: 128 },
	       KEYSTROKE: { DISCRETE: 256, CONTINUOUS: 512 } };
  //-GROUPED can be added to indicate unit is part of selected group; also possible: indicators as to how sprite forms are handled rotation/direction wise
  //-another behaviour that can be described is reversing speed and turning behaviour (i.e. 90degs etc.)
  // * 'Targeted' becomes another property for Agents, stored in .Status
  //bits 30-23 will likely be used to indicate side agent belongs to (still leaving 16 bits to be used): 
var STANCE = { NONE: 0, PASSIVE: 1, DEFENSIVE: 2, BALANCED: 3, AGGRESSIVE: 4, RECKLESS: 5, TYPES: 5 };
var StanceTargetRange = [ 100, 80, 60, 40, 20 ];  //%
var FACING = { T: 0, TR: 1, R: 2, BR: 3, B: 4, BL: 5, L: 6, TL: 7 };
var DIRECTION = { N: 0, NE: 1, E: 2, SE: 3, S: 4, SW: 5, W: 6, NW: 7, T: 0, TR: 1, R: 2, BR: 3, B: 4, BL: 5, L: 6, TL: 7,
 		  UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3, C: 8, COUNT: 8, CLOCKWISE: false, ANTiCLOCKWISE: true, NONE: -1 };
var PARABOLIC = { NONE: 0, HORIZONTAL: 1, VERTICAL: 2, BOTH: 3 };								//REDUNDANT
var SELECTION = { SHAPE: SHAPE.CIRCLE, COLOUR: "yellow", THICKNESS: 3, OPACITY: 0.5 };
var DEXTERITY = { NEUTRAL: 0, RIGHT: 1, LEFT: 2, BOTH: 3 };
var GENDER = { UNSPECIFIED: 0, BOY: 1, GIRL: 2 };
var ACTIVePACK = { NONE: 0, LOCATION: 1, SELECTION: 2, TRACKING: 5 };  //NOTE: will re-number when more full (REDUNDANT?)
var CONTROLLER = { SLIDE: 0, CARDINAL: 1, TANK: 2 };
var LOCATIOnPACK = { NONE: 0, BOTTOmLEFtOFFSET: 1, CENTReOFFSET: 2, BOUNDINgBOX: 4, MOVeBOX: 8, FOOTPRINT: 16, ALL: 0x1F };  //hopefully REDUNDANT
var TRACkPACK = { NONE: 0, FOLLOWERS: 1, INTERCEPTORS: 2 };
var TRACkMODE = { NONE: 0, FOLLOWING: 1, INTERCEPTING: 2, ANTICIPATING: 3 };  //NOTE: ANTICIPATING is for future
	// implementation where an attempt is made to guess where NPC is headed based on its behaviour and characteristics;
	// actually, this has opened up some possbilities, such as in GJ Mazetrix tracker game, where NPC could keep a
	// linked list of previous three steps, and if they are linear, it could extrapolate to where quarry is headed
var TURN = { MODE: { INSTANT: 0, SPIN: 1, DIRECTION: 2 }, IMAGE: { STATIC: 0, STATE: 1, FORM: 2, TRANSFORM: 4 } };
var MOTION = { STATIONARY: 0, FOLLOWING: 1, INTERCEPTING: 2, PATH: 3 };  //NOTE: PATH indicates segmented route
var TRACKERS = { NONE: 0, FOLLOWERS: 1, INTERCEPTORS: 2 };  //REDUNDANT (used by GJ PYRAMID)
var ANIMATION = { F: 15 };

//Weapons
var WEAPON = { STATE: { INACTIVE: 0, ARMED: 1, ARMING: 2, FIRING: 3 }, FIRE: { THRESHOLD: 0, MOUSE: 1, KEY: 2 }, ReLOAD: 180,	//NOTE: 'FIRING' for Pellets
	       TYPE: { BLAST: 1, AIM: 2, SPOT: 3, TRACK: 4 } };
var TARGETING = { NONE: 0, SHOT: 1, SHELL: 2, ROCKET: 4, MISSILE: 8, TYPES: 4 };  //REDUNDANT
var CANNON = { ARC: { A: 45, COLOUR: "yellow", OPACITY: 0.5 }, W: 3, COLOUR: "grey", F: 90, ReLOAD: 180 };
var ROCKET = { ReLOAD: 180, GAP: { MIN: 8, MAX: 18 }, STATE: { INACTIVE: 0, RELEASED: 1, EXPLODING: 2, IMPLODING: 3 } };
var MISSILE = { LOCkCOLOUR: { GREEN: "rgb(0,255,0)", RED: "rgb(255,0,0)" } };

//-- NAME --
var CapitalLetters = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ];
var Vowels = [ "a", "e", "i", "o", "u" ];
var Consonants = [ "b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"];
var Alphabet = "abcdefghijklmnopqrstuvwxyz";

//----------------------------------
//---------- FX --------------------

var SMOKeTRAIL = { DORMANT: 0, EXPANDING: 1, STABLE: 2, CONTRACTING: 3 };
var EXPLOSION = { F: 15, ROTATING: { S: 8, F: 10 } };
var PULSATINgEXPLOSION = { S: 6, F: 15 };
var GRIdEXPLOSION = { S: 2, F: 60, COLOUR: "yellow", OUTLINeCOLOUR: "orange" };
var RINgEXPLOSION = { SIZE: 40, F: 15 };
var SPARK = { S: 6, F: 10 };

//---------- CALENDAR ----------
var Day = [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" ];
var Month = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

//Scrolling-------------------
var SCROLL = { NAME: 0, L: 1, T: 2, W: 3, H: 4 };

var SCROLLING = { RENDER: 0, MULTIRENDER: 1, IMAGES: 2};
var ScrollStruct = function () {
   var Type;
   var Width;
   var Height;
};
ScrollStruct.prototype.Set = function(wdth, hght) {this.Width = wdth; this.Height = hght;};
var RenderedScrollStruct = function () {
   var Shape;
   var Colour;
};
RenderedScrollStruct.prototype = new ScrollStruct();
RenderedScrollStruct.prototype.Set = function(shp, clr, wdth, hght) {
   ScrollStruct.prototype.call.Set(this, wdth, hght);

   this.Type = SCROLLING.RENDER;
   this.Shape = shp;
   this.Colour = clr;
};
var ImageScrollStruct = function () {
   var Pic;
};
ImageScrollStruct.prototype = new ScrollStruct();
ImageScrollStruct.prototype.Set = function(img, wdth, hght) {
   ScrollStruct.prototype.call.Set(this, wdth, hght);

   this.Type = SCROLLING.IMAGES;
   this.Pic = img;
};

//----------JAVASCRIPT PRE-DEFINED COLOURS-------------------
var COLOUrTABLE = { NAME: 0, HEX: 1 };
var JSColours = [ [ "violet",	0xEE82EE ],
		  [ "indigo",	0x4B0082 ],
		  [ "blue",	0x0000FF ],
		  [ "green",	0x008000 ],
		  [ "yellow",	0xFFFF00 ],
		  [ "orange",	0xFFA500 ],
		  [ "red",	0xFF0000 ]  ];

//----------BIT PACKING-------------------  ISSUE: UNTESTED!
var BitPackingData = function() {
   var Packed;		//single byte
   var UnPacked;	//array of values
   var Pattern;		//array of number of bits per value
};
BitPackingData.prototype = {
   Set(hexData, pattern) {
      this.Packed = hexData;
      if (pattern)
	 this.Pattern = pattern;
   },
   Pack(valuesArray) {  //2-dimensional, values and # of bits
      var i;

      this.Packed = valuesArray[0].Value;
      for (i=1;i<valuesArray.length;++i)
	 this.Packed += valuesArray[i]*Math.pow(2, valuesArray[i-1].Bits);

      return (this.Packed);	//just in case
   },
   UnPack(pattern, packedNum) {  //passed in the form of an array
      var i;
      var number;

      pattern = pattern || this.Pattern;
      if (!this.UnPacked)
	 this.UnPacked = new Array(pattern.length);

      number = packedNum || this.Packed;
      for (i=0;i<pattern.length;++i) {
	 this.UnPacked[i] = number & (Math.pow(2, pattern[i])-1);
	 number = number >> pattern[i];		//might be a bit verbose
      }

      return (this.UnPacked);	//just in case
   }
};
