
//---------------------------------------------
//---------- SKELETON DEMO --------------------
var SkeletonDemo = function() {
   var Screen;
   var InfoBox;
   var ControlPanel;
   var GraphicsTool;
   var CalcPad;
   var TextWriter;
   var Randomizer;
   var Frames;

   //ONE

   //TWO

   var t1, t2, t3, t4;
};
SkeletonDemo.prototype = {
   Set(cntxt, iBox, gTool, cPanel, tWriter, rGenerator) {
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
      DemoImage.Draw();
      this.Play();
   },
   Play() {

      this.AnimationFrameHandle = requestAnimationFrame(this.Play.bind(this));

      if (Mouse.CheckLeftClicked()) {
	 if (DemoImage.CheckClicked()) {
	    cancelAnimationFrame(this.AnimationFrameHandle);
	    indx = DemoImage.GetMapEntry(CLICKED);
	    switch (indx) {
	       case TEST.ONE:
		  this.SetTestOne();
		  this.PlayTestOne();
		  break;
	       case TEST.TWO:
		  this.SetTestTwo();
		  this.PlayTestTwo();
		  break;
	    }
	 }
      } else {
	 indx = DemoImage.GetMapEntry();
	 if (indx!=-1) {
	    this.InfoBox.clearRect(0, 0, INFoBOX.WIDTH, INFoBOX.HEIGHT);
	    this.TextWriter.SwitchContext(CANVAS.ZOOM);
	    this.TextWriter.Write(DemoDescriptions[indx], 5, 20);
	    this.TextWriter.RestoreContext();
	 }
      }
   },
   SetTestOne() {
   },
   PlayTestOne() {

      //UNLOGGED

      this.AnimationFrameHandle = requestAnimationFrame(this.PlayTestOne.bind(this));

      if (Game.Reset)
	 cancelAnimationFrame(this.AnimationFrameHandle);
   },
   ResetTestOne() {
   },
   SetTestTwo() {
   },
   PlayTestTwo() {

      //UNLOGGED

      this.AnimationFrameHandle = requestAnimationFrame(this.PlayTestTwo.bind(this));

      if (Game.Reset)
	 cancelAnimationFrame(this.AnimationFrameHandle);
   },
   ResetTestTwo() {
   }
};
