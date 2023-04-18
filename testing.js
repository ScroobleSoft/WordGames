
//----------------------------------------------
//---------- HOUSE TESTING ---------------------
var HouseTesting = function() {
   var Interface;
   var Screen, InfoBox, ControlPanel;
   var GraphicsTool, TextWriter;
   var CalcPad;
   var Randomizer;
   var Frames;

   //CONTROLS
   var TestButton1, TestButton2, TestButton3, TestButton4;

   //TWO

   var t1, t2, t3, t4;
};
HouseTesting.prototype = {
   Set(intrfc, cntxt, iBox, cPanel, gTool, tWriter, rGenerator) {
      this.Interface = intrfc;
      this.Screen = cntxt;
      this.InfoBox = iBox;
      this.ControlPanel = cPanel;
      this.GraphicsTool = gTool;
//      this.CalcPad = cPad;
      this.TextWriter = tWriter;
      this.Randomizer = rGenerator;
   },
   Start() {
      this.Screen.clearRect(0, 0, SCREEN.WIDTH, SCREEN.HEIGHT);
      TestingImage.Draw();
      this.Play();
   },
   Play() {

      this.AnimationFrameHandle = requestAnimationFrame(this.Play.bind(this));

      if (Mouse.CheckLeftClicked()) {
	 if (TestingImage.CheckClicked()) {
	    cancelAnimationFrame(this.AnimationFrameHandle);
	    indx = TestingImage.GetMapEntry(CLICKED);
	    switch (indx) {
	       case TEST.CONTROLS:
		  this.SetControlTest();
		  this.PlayControlTest();
		  break;
	       case TEST.TWO:
		  this.SetTestTwo();
		  this.PlayTestTwo();
		  break;
	    }
	 }
      } else {
	 indx = TestingImage.GetMapEntry();
	 if (indx!=-1) {
	    this.InfoBox.clearRect(0, 0, INFoBOX.WIDTH, INFoBOX.HEIGHT);
	    this.TextWriter.SwitchContext(CANVAS.ZOOM);
	    this.TextWriter.Write(TestingDescriptions[indx], 5, 20);
	    this.TextWriter.RestoreContext();
	 }
      }
   }
};
