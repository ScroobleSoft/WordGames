
var SHUFFLE = { STATE: { STATIC: 0, SELECTING: 1 },
		BOARD: { T: 100, L: 100, W: 252, H: 252, C: 7, R: 7 },
		TILE: { COLOUR: { INNER: "rgb(191,191,255)", OUTER: "rgb(127,127,255)",
				  CORRECT: "rgb(127,175,079)", CLOSE: "rgb(255,207,079)", WRONG: "rgb(255,079,047)" },
			STATUS: { NEUTRAL: 0, WRONG: 1, CLOSE: 2, CORRECT: 3 },
			SIZE: { W: 36, H: 36 },
			STATE: { NORMAL: 0, DOWNED: 1 } },
		BACKGROUND: { COLOUR: GREY.LIGHT },
		BORDER: { COLOUR: GREY.MEDIUM }
};

var JUMBLE = { WORD: { COUNT: 6, LENGTH: 5 } };

var SCRAMBLE = { WORDS: 4 };

var CRACKLE = { COLOUR: { BACKGROUND: GREY.ASH, SECTION: GREY.LIGHT, SUBMISSION: PAINT.SKY },
		ATTEMPTS: { X: 240, Y: 10, W: 120, H: 30, LABEL: { TEXT: "Attempts:", X: 270, Y: 30 }, COUNT: { X: 335, Y: 30 } },
		LEDGER: { X: 200, Y: 50 },
		SECTION: { FRAME: { W: 41, H: 41 }, W: 37, H: 37, COLOUR: { CORRECT: "rgb(000,255,000)", CLOSE: "rgb(255,255,111)", WRONG: "rgb(255,111,095)" } },
		SUBMISSION: { X: 200, Y: 360 },
		KEYBOARD: { X: 140, Y: 435, W: 320, H: 96, ROWS: 3 },
		KEY: { W: 32, H: 32 } };
