
HouseMiniGames.prototype.SetWordCrackle = function() {

   this.CrackleAttempts = 0;
   this.SetCrackleOptions();
   this.SetCrackleImages();
   this.SetCrackleInterface();
   this.SetCrackleWords();
};
HouseMiniGames.prototype.SetCrackleOptions = function() {

   //Radio option specs
   this.CRACKLeFIVeOPTION = { L: 225, T: 240, LABEL: "5-letter word", BACKGROUND: "rgb(191,191,255)" };
   this.CRACKLeSIxOPTION = { L: 225, T: 265, LABEL: "6-letter word", BACKGROUND: "rgb(191,191,255)" };
   this.CRACKLeSEVEnOPTION = { L: 225, T: 290, LABEL: "7-letter word", BACKGROUND: "rgb(191,191,255)" };
   this.CRACKLeRANDOmOPTION = { L: 225, T: 315, LABEL: "random", BACKGROUND: "rgb(191,191,255)" };
   this.CRACKLeFIVeOPTION = Object.assign({}, this.CRACKLeFIVeOPTION, GENIeRADIoCONTROL);
   this.CRACKLeSIxOPTION = Object.assign({}, this.CRACKLeSIxOPTION, GENIeRADIoCONTROL);
   this.CRACKLeSEVEnOPTION = Object.assign({}, this.CRACKLeSEVEnOPTION, GENIeRADIoCONTROL);
   this.CRACKLeRANDOmOPTION = Object.assign({}, this.CRACKLeRANDOmOPTION, GENIeRADIoCONTROL);
   this.CRACKLeOPTIONsRADIoGROUP = { L: 220, T: 225, W: 95, H: 12, TITLE: "Choose game type:" };

   //Create radio option controls
   this.CrackleFiveOption = new GenieRadioControl();
   this.CrackleSixOption = new GenieRadioControl();
   this.CrackleSevenOption = new GenieRadioControl();
   this.CrackleRandomOption = new GenieRadioControl();
   this.CrackleOptionsRadioGroup = new GenieRadioGroup();

   //Set radio option controls
   this.CrackleFiveOption.Set(this.Interface.PrimeScape, ImageManager.Pics[IMAGeINDEX.GENIeCONTROLS], this.CRACKLeFIVeOPTION, this.TextWriter);
   this.CrackleSixOption.Set(this.Interface.PrimeScape, ImageManager.Pics[IMAGeINDEX.GENIeCONTROLS], this.CRACKLeSIxOPTION, this.TextWriter);
   this.CrackleSevenOption.Set(this.Interface.PrimeScape, ImageManager.Pics[IMAGeINDEX.GENIeCONTROLS], this.CRACKLeSEVEnOPTION, this.TextWriter);
   this.CrackleRandomOption.Set(this.Interface.PrimeScape, ImageManager.Pics[IMAGeINDEX.GENIeCONTROLS], this.CRACKLeRANDOmOPTION, this.TextWriter);
   this.CrackleOptionsRadioGroup.Set(this.CRACKLeOPTIONsRADIoGROUP, this.Interface.PrimeScape, this.TextWriter, this.CrackleFiveOption, this.CrackleSixOption, this.CrackleSevenOption, this.CrackleRandomOption);

   //Ok button
   this.CrackleOkButton = new TextButton();
   this.CrackleOkButton.Set(this.Interface.PrimeScape, { L: 270, T: 355, W: 60, H: 20, LABEL: "Ok", BACKGROUND: "rgb(191,191,255)" }, this.TextWriter);
};
HouseMiniGames.prototype.SetCrackleImages = function() {

   this.CrackleLetterImages = new GenieImage();
   this.CrackleLetterImages.Set(this.Screen, ImageManager.Pics[IMAGeINDEX.MINiIMAGES], { L: 1, T: 144, W: 308, H: 61, O: 4, C: 13, R: 2, PATCH: { W: 20, H: 28 } } );
   this.CrackleSectionImage = new GenieImage();
   this.CrackleSectionImage.Set(this.Screen, ImageManager.Pics[IMAGeINDEX.MINiIMAGES], { L: 69, T: 101, W: 41, H: 41 } );
};
HouseMiniGames.prototype.SetCrackleInterface = function() {

   //Ledger
   this.CrackleLedger = new CrackleWordLedger();
   this.CrackleLedger.Set(this.Screen);
   this.CrackleLedger.SetImages(this.CrackleLetterImages);

   //Submission
   this.CrackleSubmission = new CrackleSubmissionField();
   this.CrackleSubmission.Set(this.Screen);
   this.CrackleSubmission.SetImages(this.CrackleLetterImages);

   //Keyboard
   this.CrackleKeyboard = new CrackleInputKeyboard();
   this.CrackleKeyboard.Set(this.Screen);
   this.CrackleKeyboard.SetLinks(this.CrackleSubmission);

   //Buttons
   this.CrackleEraseButton = new TextButton();
   this.CrackleEraseButton.Set(this.Interface.PrimeScape, { L: 75, T: 375, W: 75, H: 25, LABEL: "Erase", BACKGROUND: GREY.LIGHT }, this.TextWriter);
   this.CrackleSubmitButton = new TextButton();
   this.CrackleSubmitButton.Set(this.Interface.PrimeScape, { L: 460, T: 375, W: 75, H: 25, LABEL: "Submit", BACKGROUND: GREY.LIGHT }, this.TextWriter);
   this.CrackleRestartButton = new TextButton();
   this.CrackleRestartButton.Set(this.Interface.PrimeScape, { L: 260, T: 550, W: 80, H: 25, LABEL: "Restart", BACKGROUND: GREY.LIGHT }, this.TextWriter);
};
HouseMiniGames.prototype.SetCrackleWords = function() {

   this.CrackleWords = [ [ Words5a, Words5b, Words5c, Words5d, Words5e, Words5f, Words5g, Words5h, Words5i, Words5j, Words5k, Words5l, Words5m,
			   Words5n, Words5o, Words5p, Words5q, Words5r, Words5s, Words5t, Words5u, Words5v, Words5w, Words5y, Words5z ],
			 [ Words6a, Words6b, Words6c, Words6d, Words6e, Words6f, Words6g, Words6h, Words6i, Words6j, Words6k, Words6l, Words6m,
			   Words6n, Words6o, Words6p, Words6q, Words6r, Words6s, Words6t, Words6u, Words6v, Words6w, Words6y, Words6z ],
			 [ Words7a, Words7b, Words7c, Words7d, Words7e, Words7f, Words7g, Words7h, Words7i, Words7j, Words7k, Words7l, Words7m,
			   Words7n, Words7o, Words7p, Words7q, Words7r, Words7s, Words7t, Words7u, Words7v, Words7w, Words7y, Words7z ]  ];
};
HouseMiniGames.prototype.SetCrackleWord = function() {
   var j, k;

   j = this.Randomizer.GetIndex(this.CrackleWords[this.CrackleWordLength-5].length);
   k = this.Randomizer.GetIndex(this.CrackleWords[this.CrackleWordLength-5][j].length);
   this.CrackleLedger.SetWord(this.CrackleWords[this.CrackleWordLength-5][j][k]);
   this.CrackleSubmission.SetWordLength(this.CrackleWordLength);
};
HouseMiniGames.prototype.PlayWordCrackle = function() {

   this.AnimationFrameHandle = requestAnimationFrame(this.PlayWordCrackle.bind(this));

   this.UpdateCrackleButtons();
   this.UpdateCrackleMouse();
};
HouseMiniGames.prototype.DrawCrackleInterface = function() {

   //Background and buttons
   this.Screen.fillStyle = CRACKLE.COLOUR.BACKGROUND;
   this.Screen.fillRect(0, 0, SCREEN.WIDTH, SCREEN.HEIGHT);

   //Attempts box
   this.GraphicsTool.DrawRectangle(CRACKLE.ATTEMPTS.X, CRACKLE.ATTEMPTS.Y, CRACKLE.ATTEMPTS.W, CRACKLE.ATTEMPTS.H, CRACKLE.COLOUR.SECTION, 0);
   this.GraphicsTool.DrawRectangle(CRACKLE.ATTEMPTS.X, CRACKLE.ATTEMPTS.Y, CRACKLE.ATTEMPTS.W, CRACKLE.ATTEMPTS.H, "black", 1);
   this.TextWriter.Write(CRACKLE.ATTEMPTS.LABEL.TEXT, CRACKLE.ATTEMPTS.LABEL.X, CRACKLE.ATTEMPTS.LABEL.Y);
   this.TextWriter.Write(this.CrackleAttempts, CRACKLE.ATTEMPTS.COUNT.X, CRACKLE.ATTEMPTS.COUNT.Y);

   this.CrackleLedger.Draw();
   this.CrackleSubmission.Draw();
   this.CrackleKeyboard.Draw();
   this.CrackleEraseButton.Show();
   this.CrackleEraseButton.Disable();
   this.CrackleSubmitButton.Show();
   this.CrackleSubmitButton.Disable();
   this.CrackleRestartButton.Show();
};
HouseMiniGames.prototype.UpdateCrackleButtons = function() {

   if (this.CrackleSubmitButton.CheckClicked()) {
      this.CrackleLedger.Update(this.CrackleSubmission.Letters);
      this.CrackleSubmission.Clear();
      ++this.CrackleAttempts;
      this.GraphicsTool.DrawRectangle(CRACKLE.ATTEMPTS.COUNT.X, CRACKLE.ATTEMPTS.COUNT.Y-15, 20, 20, CRACKLE.COLOUR.SECTION, 0);
      this.TextWriter.Write(this.CrackleAttempts, CRACKLE.ATTEMPTS.COUNT.X, CRACKLE.ATTEMPTS.COUNT.Y);
      this.CrackleSubmitButton.Disable();
      this.CrackleEraseButton.Disable();
   }

   if (this.CrackleEraseButton.CheckClicked()) {
      this.CrackleSubmission.Clear();
      this.CrackleEraseButton.Disable();
      this.CrackleSubmitButton.Disable();
   }

   if (this.CrackleRestartButton.CheckClicked()) {
      this.DisplayCrackleOptions();
      this.PollCrackleOptions();
   }
};
HouseMiniGames.prototype.UpdateCrackleMouse = function() {

   if (Mouse.CheckLeftClicked(CANVAS.PRIME)) {

      //Keyboard
      if (Mouse.Click.X>=CRACKLE.KEYBOARD.X && Mouse.Click.X<(CRACKLE.KEYBOARD.X+CRACKLE.KEYBOARD.W) &&
	  Mouse.Click.Y>=CRACKLE.KEYBOARD.Y && Mouse.Click.Y<(CRACKLE.KEYBOARD.Y+CRACKLE.KEYBOARD.H)) {
	 this.CrackleKeyboard.UpdateClick();
	 if (this.CrackleSubmission.CheckFilled())
	    this.CrackleSubmitButton.Enable();
	 else if (this.CrackleSubmission.CheckPartiallyFilled())
	    if (!this.CrackleEraseButton.Enabled)
	       this.CrackleEraseButton.Enable();
      }

      //Submission field
      if (Mouse.Click.X>=this.CrackleSubmission.X && Mouse.Click.X<(this.CrackleSubmission.X+this.CrackleSubmission.W) &&
	  Mouse.Click.Y>=this.CrackleSubmission.Y && Mouse.Click.Y<(this.CrackleSubmission.Y+this.CrackleSubmission.H))
	 this.CrackleSubmission.UpdateClick();
   } else
      Mouse.ClearClicks();
};
HouseMiniGames.prototype.DisplayCrackleOptions = function() {

   //UNLOGGED

   this.Screen.fillStyle = PAINT.SKY;
   this.Screen.fillRect(0, 0, SCREEN.WIDTH, SCREEN.HEIGHT);
   this.Screen.fillStyle = "rgb(191,191,255)";
   this.Screen.fillRect(200, 200, 200, 200);
   this.GraphicsTool.DrawRectangle(200, 200, 200, 200, "black", 3);
   this.CrackleOptionsRadioGroup.Show();
   this.CrackleOkButton.Show();
};
HouseMiniGames.prototype.PollCrackleOptions = function() {

   this.AnimationFrameHandle = requestAnimationFrame(this.PollCrackleOptions.bind(this));

   if (this.CrackleOkButton.CheckClicked()) {
      cancelAnimationFrame(this.AnimationFrameHandle);
      this.CrackleOptionsRadioGroup.Hide();
      this.CrackleOkButton.Hide();
      if (this.CrackleOptionsRadioGroup.OptionSelected.Index==3)
	 this.CrackleWordLength = this.Randomizer.GetInRange(5,7);
      else
	 this.CrackleWordLength = this.CrackleOptionsRadioGroup.OptionSelected.Index + 5;
      this.SetCrackleWord();
      Mouse.ClearClicks();
      this.DrawCrackleInterface();
      this.StartNewCrackle();
      this.PlayWordCrackle();
   }
};
HouseMiniGames.prototype.StartNewCrackle = function() {

   //UNLOGGED

   this.CrackleAttempts = 0;
   this.GraphicsTool.DrawRectangle(CRACKLE.ATTEMPTS.COUNT.X, CRACKLE.ATTEMPTS.COUNT.Y-15, 20, 20, CRACKLE.COLOUR.SECTION, 0);
   this.TextWriter.Write(this.CrackleAttempts, CRACKLE.ATTEMPTS.COUNT.X, CRACKLE.ATTEMPTS.COUNT.Y);
   this.CrackleLedger.Clear();
   this.CrackleSubmission.Erase();
   this.SetCrackleWord();
   this.CrackleLedger.Draw();
   this.CrackleSubmission.Clear();
   this.CrackleEraseButton.Disable();
   this.CrackleSubmitButton.Disable();
};
